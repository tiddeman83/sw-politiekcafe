#!/usr/bin/env python3
"""
Test script to diagnose import and namespace issues
Run this to check if all dependencies are properly installed
"""

import sys
import os

print(f"Python version: {sys.version}")
print(f"Python executable: {sys.executable}")
print(f"Current working directory: {os.getcwd()}")
print(f"Python path: {sys.path}")
print()

# Test imports one by one
modules_to_test = [
    'json',
    'sqlite3', 
    'smtplib',
    'datetime',
    'email.mime.text',
    'email.mime.multipart',
    'pathlib',
    'typing',
    're',
    'logging',
    'fastapi',
    'fastapi.middleware.cors',
    'pydantic',
    'uvicorn'
]

print("Testing imports:")
print("-" * 50)

for module in modules_to_test:
    try:
        __import__(module)
        print(f"✅ {module}")
    except ImportError as e:
        print(f"❌ {module} - Error: {e}")
    except Exception as e:
        print(f"⚠️  {module} - Unexpected error: {e}")

print()
print("Testing FastAPI startup:")
print("-" * 50)

try:
    from fastapi import FastAPI
    from fastapi.middleware.cors import CORSMiddleware
    from pydantic import BaseModel, EmailStr, field_validator
    
    app = FastAPI(title="Test App")
    print("✅ FastAPI app creation successful")
    
    class TestModel(BaseModel):
        name: str
        email: EmailStr
        
        @field_validator('name')
        @classmethod
        def validate_name(cls, v):
            if len(v) < 2:
                raise ValueError('Name too short')
            return v
    
    print("✅ Pydantic model with validation successful")
    
except Exception as e:
    print(f"❌ FastAPI/Pydantic setup failed: {e}")

print()
print("Testing database connection:")
print("-" * 50)

try:
    import sqlite3
    conn = sqlite3.connect(':memory:')
    cursor = conn.cursor()
    cursor.execute('CREATE TABLE test (id INTEGER PRIMARY KEY)')
    conn.close()
    print("✅ SQLite database operations successful")
except Exception as e:
    print(f"❌ SQLite test failed: {e}")

print()
print("If you see any ❌ errors above, install missing packages with:")
print("pip install fastapi uvicorn pydantic[email] python-multipart")