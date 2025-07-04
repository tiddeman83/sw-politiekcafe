#!/usr/bin/env python3
"""
Python backend for SamenWerkt membership registration
Replaces the Express.js server with FastAPI
"""

import json
import sqlite3
import smtplib
from datetime import datetime
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from pathlib import Path
from typing import Dict, List, Optional
import re
import logging

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, field_validator
import uvicorn

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="SamenWerkt Membership API", version="1.0.0")

# Enable CORS for localhost development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database setup
DB_PATH = Path(__file__).parent / "membership.db"

def init_database():
    """Initialize SQLite database with membership and cafe tables"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS memberships (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            naam TEXT NOT NULL,
            adres TEXT NOT NULL,
            geboortedatum TEXT NOT NULL,
            telefoon TEXT NOT NULL,
            email TEXT NOT NULL,
            lidmaatschap TEXT NOT NULL,
            opleiding TEXT,
            beroep TEXT,
            politieke_ervaring TEXT,
            activiteiten TEXT,
            timestamp TEXT NOT NULL,
            submission_data TEXT NOT NULL
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS cafe_registrations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            naam TEXT NOT NULL,
            email TEXT NOT NULL,
            lid_van_samenwerkt TEXT NOT NULL,
            komt_naar_cafe TEXT NOT NULL,
            telefoonnummer TEXT NOT NULL,
            opmerkingen TEXT,
            timestamp TEXT NOT NULL,
            submission_data TEXT NOT NULL
        )
    ''')
    
    conn.commit()
    conn.close()

# Initialize database on startup
init_database()

class MembershipForm(BaseModel):
    """Pydantic model for membership form validation"""
    naam: str
    adres: str
    geboortedatum: str
    telefoon: str
    email: EmailStr
    lidmaatschap: str
    opleiding: Optional[str] = None
    beroep: Optional[str] = None
    politieke_ervaring: Optional[str] = None
    activiteiten: Optional[Dict] = None
    
    @field_validator('naam')
    @classmethod
    def validate_naam(cls, v):
        if not v or len(v.strip()) < 2:
            raise ValueError('Naam is verplicht en moet minimaal 2 karakters bevatten.')
        return v.strip()
    
    @field_validator('adres')
    @classmethod
    def validate_adres(cls, v):
        if not v or len(v.strip()) < 5:
            raise ValueError('Adres is verplicht en moet minimaal 5 karakters bevatten.')
        return v.strip()
    
    @field_validator('telefoon')
    @classmethod
    def validate_telefoon(cls, v):
        if not v or len(v.strip()) < 8:
            raise ValueError('Telefoonnummer is verplicht en moet minimaal 8 cijfers bevatten.')
        return v.strip()
    
    @field_validator('lidmaatschap')
    @classmethod
    def validate_lidmaatschap(cls, v):
        if not v:
            raise ValueError('Lidmaatschapstype is verplicht.')
        return v

class CafeForm(BaseModel):
    """Pydantic model for political café form validation"""
    naam: str
    email: EmailStr
    lidVanSamenwerkt: str
    komtNaarCafe: str
    telefoonnummer: str
    opmerkingen: Optional[str] = None
    
    @field_validator('naam')
    @classmethod
    def validate_naam(cls, v):
        if not v or len(v.strip()) < 2:
            raise ValueError('Naam is verplicht en moet minimaal 2 karakters bevatten.')
        return v.strip()
    
    @field_validator('telefoonnummer')
    @classmethod
    def validate_telefoonnummer(cls, v):
        if not v or len(v.strip()) < 8:
            raise ValueError('Telefoonnummer is verplicht en moet minimaal 8 cijfers bevatten.')
        return v.strip()
    
    @field_validator('lidVanSamenwerkt')
    @classmethod
    def validate_lid_van_samenwerkt(cls, v):
        if v not in ['ja', 'nee']:
            raise ValueError('Geef aan of u lid bent van SamenWerkt.')
        return v
    
    @field_validator('komtNaarCafe')
    @classmethod
    def validate_komt_naar_cafe(cls, v):
        if v not in ['ja', 'nee']:
            raise ValueError('Geef aan of u naar het politiek café komt.')
        return v

def store_submission(form_data: dict) -> bool:
    """Store form submission in SQLite database"""
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # Extract main fields
        naam = form_data.get('naam', '')
        adres = form_data.get('adres', '')
        geboortedatum = form_data.get('geboortedatum', '')
        telefoon = form_data.get('telefoon', '')
        email = form_data.get('email', '')
        lidmaatschap = form_data.get('lidmaatschap', '')
        opleiding = form_data.get('opleiding', '')
        beroep = form_data.get('beroep', '')
        politieke_ervaring = form_data.get('politieke_ervaring', '')
        activiteiten = json.dumps(form_data.get('activiteiten', {}))
        timestamp = datetime.now().isoformat()
        submission_data = json.dumps(form_data)
        
        cursor.execute('''
            INSERT INTO memberships (
                naam, adres, geboortedatum, telefoon, email, lidmaatschap,
                opleiding, beroep, politieke_ervaring, activiteiten,
                timestamp, submission_data
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            naam, adres, geboortedatum, telefoon, email, lidmaatschap,
            opleiding, beroep, politieke_ervaring, activiteiten,
            timestamp, submission_data
        ))
        
        conn.commit()
        conn.close()
        logger.info(f"Stored submission for {naam}")
        return True
        
    except Exception as e:
        logger.error(f"Error storing submission: {e}")
        return False

def store_cafe_submission(form_data: dict) -> bool:
    """Store café form submission in SQLite database"""
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # Extract main fields
        naam = form_data.get('naam', '')
        email = form_data.get('email', '')
        lid_van_samenwerkt = form_data.get('lidVanSamenwerkt', '')
        komt_naar_cafe = form_data.get('komtNaarCafe', '')
        telefoonnummer = form_data.get('telefoonnummer', '')
        opmerkingen = form_data.get('opmerkingen', '')
        timestamp = datetime.now().isoformat()
        submission_data = json.dumps(form_data)
        
        cursor.execute('''
            INSERT INTO cafe_registrations (
                naam, email, lid_van_samenwerkt, komt_naar_cafe, telefoonnummer,
                opmerkingen, timestamp, submission_data
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            naam, email, lid_van_samenwerkt, komt_naar_cafe, telefoonnummer,
            opmerkingen, timestamp, submission_data
        ))
        
        conn.commit()
        conn.close()
        logger.info(f"Stored café registration for {naam}")
        return True
        
    except Exception as e:
        logger.error(f"Error storing café registration: {e}")
        return False

def send_notification_email(form_data: dict) -> bool:
    """Send notification email to organization"""
    try:
        # Create message
        msg = MIMEMultipart('alternative')
        msg['Subject'] = f"Nieuwe aanmelding via de website: {form_data['naam']}"
        msg['From'] = 'info@samenwerktwbd.nl'
        msg['To'] = 'info@samenwerktwbd.nl'
        
        # Create HTML content
        html_content = f"""
        <h2>Nieuwe lidmaatschapsaanmelding</h2>
        <p><strong>Naam:</strong> {form_data['naam']}</p>
        <p><strong>E-mail:</strong> {form_data['email']}</p>
        <p><strong>Telefoon:</strong> {form_data['telefoon']}</p>
        <p><strong>Lidmaatschap:</strong> {form_data['lidmaatschap']}</p>
        <p><strong>Datum aanmelding:</strong> {datetime.now().strftime('%d-%m-%Y')}</p>
        <hr>
        <h3>Volledige gegevens:</h3>
        <pre>{json.dumps(form_data, indent=2, ensure_ascii=False)}</pre>
        """
        
        html_part = MIMEText(html_content, 'html', 'utf-8')
        msg.attach(html_part)
        
        # Send via local Postfix
        server = smtplib.SMTP('localhost', 25)
        server.sendmail('info@samenwerktwbd.nl', 'info@samenwerktwbd.nl', msg.as_string())
        server.quit()
        
        logger.info(f"Notification email sent for {form_data['naam']}")
        return True
        
    except Exception as e:
        logger.error(f"Error sending notification email: {e}")
        return False

def send_confirmation_email(form_data: dict) -> bool:
    """Send confirmation email to the form sender"""
    try:
        # Create message
        msg = MIMEMultipart('alternative')
        msg['Subject'] = "Bevestiging lidmaatschapsaanvraag SamenWerkt Wijk bij Duurstede"
        msg['From'] = 'info@samenwerktwbd.nl'
        msg['To'] = form_data['email']
        
        # Create HTML content
        html_content = f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #e53935, #4caf50); padding: 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">SamenWerkt Wijk bij Duurstede</h1>
            </div>
            
            <div style="padding: 30px; background-color: #f9f9f9;">
                <h2 style="color: #333;">Beste {form_data['naam']},</h2>
                
                <p style="font-size: 16px; line-height: 1.6; color: #555;">
                    Hartelijk dank voor uw aanmelding als lid van SamenWerkt Wijk bij Duurstede!
                </p>
                
                <p style="font-size: 16px; line-height: 1.6; color: #555;">
                    Wij hebben uw lidmaatschapsaanvraag in goede orde ontvangen en zullen deze zo spoedig mogelijk behandelen. 
                    U kunt verwachten dat wij binnen enkele werkdagen contact met u opnemen voor de verdere afhandeling.
                </p>
                
                <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4caf50;">
                    <h3 style="margin-top: 0; color: #333;">Uw gegevens:</h3>
                    <p><strong>Naam:</strong> {form_data['naam']}</p>
                    <p><strong>E-mailadres:</strong> {form_data['email']}</p>
                    <p><strong>Lidmaatschapstype:</strong> {form_data['lidmaatschap']}</p>
                    <p><strong>Datum aanmelding:</strong> {datetime.now().strftime('%d-%m-%Y')}</p>
                </div>
                
                <p style="font-size: 16px; line-height: 1.6; color: #555;">
                    Mocht u vragen hebben over uw aanmelding, dan kunt u contact met ons opnemen via 
                    <a href="mailto:info@samenwerktwbd.nl" style="color: #e53935;">info@samenwerktwbd.nl</a>.
                </p>
                
                <p style="font-size: 16px; line-height: 1.6; color: #555;">
                    Met vriendelijke groet,<br>
                    Het bestuur van SamenWerkt Wijk bij Duurstede
                </p>
                
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center;">
                    <p style="font-size: 14px; color: #888;">
                        <a href="https://samenwerktwijkbijduurstede.nl" style="color: #e53935;">samenwerktwijkbijduurstede.nl</a><br>
                        Lokale politiek die ertoe doet
                    </p>
                </div>
            </div>
        </div>
        """
        
        html_part = MIMEText(html_content, 'html', 'utf-8')
        msg.attach(html_part)
        
        # Send via local Postfix
        server = smtplib.SMTP('localhost', 25)
        server.sendmail('info@samenwerktwbd.nl', form_data['email'], msg.as_string())
        server.quit()
        
        logger.info(f"Confirmation email sent to {form_data['email']}")
        return True
        
    except Exception as e:
        logger.error(f"Error sending confirmation email: {e}")
        return False

def send_cafe_notification_email(form_data: dict) -> bool:
    """Send notification email to organization for café registration"""
    try:
        # Create message
        msg = MIMEMultipart('alternative')
        msg['Subject'] = f"Nieuwe aanmelding politiek café: {form_data['naam']}"
        msg['From'] = 'info@samenwerktwbd.nl'
        msg['To'] = 'info@samenwerktwbd.nl'
        
        # Create HTML content
        html_content = f"""
        <h2>Nieuwe aanmelding politiek café</h2>
        <p><strong>Naam:</strong> {form_data['naam']}</p>
        <p><strong>E-mail:</strong> {form_data['email']}</p>
        <p><strong>Telefoon:</strong> {form_data['telefoonnummer']}</p>
        <p><strong>Lid van SamenWerkt:</strong> {form_data['lidVanSamenwerkt']}</p>
        <p><strong>Komt naar café:</strong> {form_data['komtNaarCafe']}</p>
        <p><strong>Datum aanmelding:</strong> {datetime.now().strftime('%d-%m-%Y')}</p>
        {f"<p><strong>Opmerkingen:</strong> {form_data['opmerkingen']}</p>" if form_data.get('opmerkingen') else ""}
        <hr>
        <h3>Volledige gegevens:</h3>
        <pre>{json.dumps(form_data, indent=2, ensure_ascii=False)}</pre>
        """
        
        html_part = MIMEText(html_content, 'html', 'utf-8')
        msg.attach(html_part)
        
        # Send via local Postfix
        server = smtplib.SMTP('localhost', 25)
        server.sendmail('info@samenwerktwbd.nl', 'info@samenwerktwbd.nl', msg.as_string())
        server.quit()
        
        logger.info(f"Café notification email sent for {form_data['naam']}")
        return True
        
    except Exception as e:
        logger.error(f"Error sending café notification email: {e}")
        return False

def send_cafe_confirmation_email(form_data: dict) -> bool:
    """Send confirmation email to café form sender"""
    try:
        # Create message
        msg = MIMEMultipart('alternative')
        msg['Subject'] = "Bevestiging aanmelding politiek café SamenWerkt"
        msg['From'] = 'info@samenwerktwbd.nl'
        msg['To'] = form_data['email']
        
        # Create HTML content
        cafe_status = "komt graag naar het politiek café" if form_data['komtNaarCafe'] == 'ja' else "komt mogelijk niet naar het politiek café"
        member_status = "bent lid van SamenWerkt" if form_data['lidVanSamenwerkt'] == 'ja' else "bent nog geen lid van SamenWerkt"
        
        html_content = f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #e53935, #4caf50); padding: 20px; text-align: center;">
                <h1 style="color: white; margin: 0;">SamenWerkt Wijk bij Duurstede</h1>
                <h2 style="color: white; margin: 10px 0 0 0; font-size: 18px;">Politiek Café</h2>
            </div>
            
            <div style="padding: 30px; background-color: #f9f9f9;">
                <h2 style="color: #333;">Beste {form_data['naam']},</h2>
                
                <p style="font-size: 16px; line-height: 1.6; color: #555;">
                    Hartelijk dank voor uw aanmelding voor het politiek café van SamenWerkt!
                </p>
                
                <p style="font-size: 16px; line-height: 1.6; color: #555;">
                    We hebben uw aanmelding in goede orde ontvangen. U {cafe_status} en {member_status}.
                </p>
                
                <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #8B4513;">
                    <h3 style="margin-top: 0; color: #333;">Uw gegevens:</h3>
                    <p><strong>Naam:</strong> {form_data['naam']}</p>
                    <p><strong>E-mailadres:</strong> {form_data['email']}</p>
                    <p><strong>Telefoonnummer:</strong> {form_data['telefoonnummer']}</p>
                    <p><strong>Lid van SamenWerkt:</strong> {form_data['lidVanSamenwerkt']}</p>
                    <p><strong>Komt naar café:</strong> {form_data['komtNaarCafe']}</p>
                    <p><strong>Datum aanmelding:</strong> {datetime.now().strftime('%d-%m-%Y')}</p>
                    {f"<p><strong>Opmerkingen:</strong> {form_data['opmerkingen']}</p>" if form_data.get('opmerkingen') else ""}
                </div>
                
                <p style="font-size: 16px; line-height: 1.6; color: #555;">
                    We sturen u binnenkort meer informatie over de datum, tijd en locatie van het eerstvolgende politiek café.
                </p>
                
                <p style="font-size: 16px; line-height: 1.6; color: #555;">
                    Heeft u vragen? Neem gerust contact met ons op via 
                    <a href="mailto:info@samenwerktwbd.nl" style="color: #e53935;">info@samenwerktwbd.nl</a>.
                </p>
                
                <p style="font-size: 16px; line-height: 1.6; color: #555;">
                    Tot ziens bij het politiek café!<br>
                    Het team van SamenWerkt Wijk bij Duurstede
                </p>
                
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center;">
                    <p style="font-size: 14px; color: #888;">
                        <a href="https://samenwerktwijkbijduurstede.nl" style="color: #e53935;">samenwerktwijkbijduurstede.nl</a><br>
                        Lokale politiek die ertoe doet
                    </p>
                </div>
            </div>
        </div>
        """
        
        html_part = MIMEText(html_content, 'html', 'utf-8')
        msg.attach(html_part)
        
        # Send via local Postfix
        server = smtplib.SMTP('localhost', 25)
        server.sendmail('info@samenwerktwbd.nl', form_data['email'], msg.as_string())
        server.quit()
        
        logger.info(f"Café confirmation email sent to {form_data['email']}")
        return True
        
    except Exception as e:
        logger.error(f"Error sending café confirmation email: {e}")
        return False

@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Log all incoming requests"""
    logger.info(f"{datetime.now().isoformat()} - {request.method} {request.url.path}")
    response = await call_next(request)
    return response

@app.post("/api/submit")
async def submit_form(form: MembershipForm):
    """Handle form submission - store in database and send email"""
    try:
        form_data = form.dict()
        
        # Add metadata
        form_data['timestamp'] = datetime.now().isoformat()
        form_data['id'] = str(int(datetime.now().timestamp() * 1000))
        
        # Store in database
        if not store_submission(form_data):
            raise HTTPException(
                status_code=500,
                detail="Fout bij opslaan van gegevens."
            )
        
        # Send notification email to organization
        notification_sent = send_notification_email(form_data)
        
        # Send confirmation email to form sender
        confirmation_sent = send_confirmation_email(form_data)
        
        if notification_sent and confirmation_sent:
            return {
                "success": True,
                "message": "Formulier succesvol verzonden! U ontvangt een bevestigingsmail."
            }
        elif notification_sent:
            return {
                "success": True,
                "message": "Formulier opgeslagen en melding verstuurd. Bevestigingsmail kon niet worden verzonden.",
                "warning": "Bevestigingsmail mislukt"
            }
        elif confirmation_sent:
            return {
                "success": True,
                "message": "Formulier opgeslagen en bevestigingsmail verzonden. Interne melding mislukt.",
                "warning": "Interne melding mislukt"
            }
        else:
            return {
                "success": True,
                "message": "Formulier opgeslagen, maar e-mails konden niet worden verstuurd. We nemen contact met u op.",
                "warning": "E-mail verzending mislukt"
            }
            
    except ValueError as e:
        # Validation errors
        raise HTTPException(
            status_code=400,
            detail={
                "success": False,
                "message": "Validatiefout in formuliergegevens.",
                "errors": [str(e)]
            }
        )
    except Exception as e:
        logger.error(f"Submission error: {e}")
        raise HTTPException(
            status_code=500,
            detail="Er is een onverwachte fout opgetreden bij het verwerken van uw aanmelding."
        )

@app.post("/api/cafe")
async def submit_cafe_form(form: CafeForm):
    """Handle café form submission - store in database and send email"""
    try:
        form_data = form.dict()
        
        # Add metadata
        form_data['timestamp'] = datetime.now().isoformat()
        form_data['id'] = str(int(datetime.now().timestamp() * 1000))
        
        # Store in database
        if not store_cafe_submission(form_data):
            raise HTTPException(
                status_code=500,
                detail="Fout bij opslaan van gegevens."
            )
        
        # Send notification email to organization
        notification_sent = send_cafe_notification_email(form_data)
        
        # Send confirmation email to form sender
        confirmation_sent = send_cafe_confirmation_email(form_data)
        
        if notification_sent and confirmation_sent:
            return {
                "success": True,
                "message": "Formulier succesvol verzonden! U ontvangt een bevestigingsmail."
            }
        elif notification_sent:
            return {
                "success": True,
                "message": "Formulier opgeslagen en melding verstuurd. Bevestigingsmail kon niet worden verzonden.",
                "warning": "Bevestigingsmail mislukt"
            }
        elif confirmation_sent:
            return {
                "success": True,
                "message": "Formulier opgeslagen en bevestigingsmail verzonden. Interne melding mislukt.",
                "warning": "Interne melding mislukt"
            }
        else:
            return {
                "success": True,
                "message": "Formulier opgeslagen, maar e-mails konden niet worden verstuurd. We nemen contact met u op.",
                "warning": "E-mail verzending mislukt"
            }
            
    except ValueError as e:
        # Validation errors
        raise HTTPException(
            status_code=400,
            detail={
                "success": False,
                "message": "Validatiefout in formuliergegevens.",
                "errors": [str(e)]
            }
        )
    except Exception as e:
        logger.error(f"Café submission error: {e}")
        raise HTTPException(
            status_code=500,
            detail="Er is een onverwachte fout opgetreden bij het verwerken van uw aanmelding."
        )

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "OK",
        "timestamp": datetime.now().isoformat(),
        "database": "SQLite",
        "email": "Postfix (localhost:25)"
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8521)