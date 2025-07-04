#!/usr/bin/env python3
"""
SamenWerkt Political Café Export Script

This script reads all café registration data from the SQLite database,
creates a pandas DataFrame, exports it to Excel, and emails the
file to tijmenbaas83@outlook.com

Usage: python export_members.py
"""

import sqlite3
import pandas as pd
import json
import smtplib
import logging
from datetime import datetime
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication
from pathlib import Path
import os

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuration
DB_PATH = Path(__file__).parent / "politekcafe.db"
EXPORT_EMAIL = "tijmenbaas83@outlook.com"
FROM_EMAIL = "info@samenwerktwbd.nl"

def read_database() -> pd.DataFrame:
    """Read all café registration data from SQLite database and return as DataFrame"""
    try:
        # Connect to database
        conn = sqlite3.connect(DB_PATH)
        
        # Read all café registration data
        query = """
        SELECT 
            id,
            naam,
            email,
            lid_van_samenwerkt,
            komt_naar_cafe,
            telefoonnummer,
            opmerkingen,
            timestamp,
            submission_data
        FROM cafe_registrations 
        ORDER BY timestamp DESC
        """
        
        df = pd.read_sql_query(query, conn)
        conn.close()
        
        logger.info(f"Read {len(df)} café registration records from database")
        return df
        
    except Exception as e:
        logger.error(f"Error reading database: {e}")
        raise

def process_dataframe(df: pd.DataFrame) -> pd.DataFrame:
    """Process and clean the DataFrame for export"""
    if df.empty:
        logger.warning("No café registration data found in database")
        return df
    
    # Convert timestamp to readable format
    if 'timestamp' in df.columns:
        df['aanmeld_datum'] = pd.to_datetime(df['timestamp']).dt.strftime('%d-%m-%Y %H:%M')
    
    # Convert yes/no values to more readable Dutch
    if 'lid_van_samenwerkt' in df.columns:
        df['lid_van_samenwerkt'] = df['lid_van_samenwerkt'].map({'ja': 'Ja', 'nee': 'Nee'})
    
    if 'komt_naar_cafe' in df.columns:
        df['komt_naar_cafe'] = df['komt_naar_cafe'].map({'ja': 'Ja', 'nee': 'Nee'})
    
    # Reorder columns for better readability
    column_order = [
        'id', 'naam', 'email', 'telefoonnummer', 'lid_van_samenwerkt', 
        'komt_naar_cafe', 'opmerkingen', 'aanmeld_datum', 'timestamp', 'submission_data'
    ]
    
    # Only include columns that exist in the dataframe
    column_order = [col for col in column_order if col in df.columns]
    df = df[column_order]
    
    logger.info(f"Processed DataFrame with {len(df)} rows and {len(df.columns)} columns")
    return df

def create_excel_export(df: pd.DataFrame) -> str:
    """Create Excel file and return the filepath"""
    if df.empty:
        # Create empty Excel file with headers
        df = pd.DataFrame(columns=[
            'id', 'naam', 'email', 'telefoonnummer', 'lid_van_samenwerkt', 
            'komt_naar_cafe', 'opmerkingen', 'aanmeld_datum'
        ])
    
    # Generate filename with timestamp
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    filename = f"samenwerkt_politiekcafe_export_{timestamp}.xlsx"
    filepath = Path(__file__).parent / filename
    
    try:
        # Create Excel writer with formatting
        with pd.ExcelWriter(filepath, engine='openpyxl') as writer:
            # Remove technical columns for the main export
            export_df = df.drop(['timestamp', 'submission_data'], axis=1, errors='ignore')
            export_df.to_excel(writer, sheet_name='Politiek Café Aanmeldingen', index=False)
            
            # Get the workbook and worksheet
            workbook = writer.book
            worksheet = writer.sheets['Politiek Café Aanmeldingen']
            
            # Auto-adjust column widths
            for column in worksheet.columns:
                max_length = 0
                column_letter = column[0].column_letter
                
                for cell in column:
                    try:
                        if len(str(cell.value)) > max_length:
                            max_length = len(str(cell.value))
                    except:
                        pass
                
                adjusted_width = min(max_length + 2, 50)  # Max width of 50
                worksheet.column_dimensions[column_letter].width = adjusted_width
        
        logger.info(f"Created Excel export: {filepath}")
        return str(filepath)
        
    except Exception as e:
        logger.error(f"Error creating Excel file: {e}")
        raise

def send_export_email(excel_filepath: str, record_count: int):
    """Send the Excel export via email"""
    try:
        # Create message
        msg = MIMEMultipart()
        msg['Subject'] = f"SamenWerkt Politiek Café Export - {datetime.now().strftime('%d-%m-%Y')}"
        msg['From'] = FROM_EMAIL
        msg['To'] = EXPORT_EMAIL
        
        # Count participants by response
        try:
            conn = sqlite3.connect(DB_PATH)
            cursor = conn.cursor()
            
            cursor.execute("SELECT COUNT(*) FROM cafe_registrations WHERE komt_naar_cafe = 'ja'")
            ja_count = cursor.fetchone()[0]
            
            cursor.execute("SELECT COUNT(*) FROM cafe_registrations WHERE komt_naar_cafe = 'nee'")
            nee_count = cursor.fetchone()[0]
            
            cursor.execute("SELECT COUNT(*) FROM cafe_registrations WHERE lid_van_samenwerkt = 'ja'")
            leden_count = cursor.fetchone()[0]
            
            cursor.execute("SELECT COUNT(*) FROM cafe_registrations WHERE lid_van_samenwerkt = 'nee'")
            niet_leden_count = cursor.fetchone()[0]
            
            conn.close()
        except:
            ja_count = nee_count = leden_count = niet_leden_count = 0
        
        # Create email body
        body = f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
            <h2 style="color: #e53935;">SamenWerkt Wijk bij Duurstede</h2>
            <h3>🍃 Politiek Café Aanmeldingen Export</h3>
            
            <p>Beste Tijmen,</p>
            
            <p>Hierbij de export van alle aanmeldingen voor het politiek café van SamenWerkt Wijk bij Duurstede.</p>
            
            <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <strong>📊 Export Statistieken:</strong><br>
                📋 Totaal aanmeldingen: {record_count}<br>
                ✅ Komt naar café: {ja_count}<br>
                ❌ Komt niet naar café: {nee_count}<br>
                👥 Reeds lid van SamenWerkt: {leden_count}<br>
                🆕 Nog geen lid: {niet_leden_count}<br>
                📅 Export datum: {datetime.now().strftime('%d-%m-%Y om %H:%M')}<br>
                📁 Bestand: {Path(excel_filepath).name}
            </div>
            
            <p>Het Excel bestand bevat alle beschikbare gegevens inclusief:</p>
            <ul>
                <li>Naam en contactgegevens</li>
                <li>Lidmaatschapsstatus</li>
                <li>Aanwezigheidsvoorkeur voor café</li>
                <li>Eventuele opmerkingen</li>
                <li>Aanmelddatum en -tijd</li>
            </ul>
            
            <p style="background: #fff3cd; padding: 10px; border-radius: 5px; border-left: 4px solid #8B4513;">
                <strong>☕ Politiek Café Tip:</strong> Gebruik deze gegevens om persoonlijke uitnodigingen te versturen 
                en de logistiek voor het café te plannen op basis van het verwachte aantal deelnemers.
            </p>
            
            <p>Met vriendelijke groet,<br>
            SamenWerkt Export Systeem</p>
        </div>
        """
        
        html_part = MIMEText(body, 'html', 'utf-8')
        msg.attach(html_part)
        
        # Attach Excel file
        with open(excel_filepath, 'rb') as file:
            attachment = MIMEApplication(file.read(), _subtype='vnd.openxmlformats-officedocument.spreadsheetml.sheet')
            attachment.add_header('Content-Disposition', 'attachment', filename=Path(excel_filepath).name)
            msg.attach(attachment)
        
        # Send via local Postfix
        server = smtplib.SMTP('localhost', 25)
        server.sendmail(FROM_EMAIL, EXPORT_EMAIL, msg.as_string())
        server.quit()
        
        logger.info(f"Export email sent to {EXPORT_EMAIL}")
        return True
        
    except Exception as e:
        logger.error(f"Error sending email: {e}")
        return False

def cleanup_file(filepath: str):
    """Remove the temporary Excel file"""
    try:
        os.remove(filepath)
        logger.info(f"Cleaned up temporary file: {filepath}")
    except Exception as e:
        logger.warning(f"Could not remove temporary file {filepath}: {e}")

def main():
    """Main export function"""
    try:
        print("🍃 Starting SamenWerkt political café export...")
        
        # Check if database exists
        if not DB_PATH.exists():
            logger.error(f"Database not found at {DB_PATH}")
            print("❌ Database file not found!")
            return
        
        # Read data from database
        print("📖 Reading café registration data from database...")
        df = read_database()
        
        # Process the data
        print("🔄 Processing data...")
        df_processed = process_dataframe(df)
        
        # Create Excel export
        print("📊 Creating Excel export...")
        excel_filepath = create_excel_export(df_processed)
        
        # Send email
        print("📧 Sending export via email...")
        email_sent = send_export_email(excel_filepath, len(df))
        
        if email_sent:
            print(f"✅ Export successful! {len(df)} café registrations sent to {EXPORT_EMAIL}")
        else:
            print(f"⚠️  Export created but email failed. File saved as: {excel_filepath}")
            return  # Don't cleanup if email failed
        
        # Cleanup temporary file
        cleanup_file(excel_filepath)
        
        print("🎉 Political café export completed successfully!")
        
    except Exception as e:
        logger.error(f"Export failed: {e}")
        print(f"❌ Export failed: {e}")

if __name__ == "__main__":
    main()