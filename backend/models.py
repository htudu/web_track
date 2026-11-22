import sqlite3
import os
from werkzeug.security import generate_password_hash, check_password_hash

DATABASE = os.getenv('DATABASE', 'users.db')

def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initialize the database with users table"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    conn.commit()
    conn.close()

def user_exists(username, email):
    """Check if user already exists"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('SELECT id FROM users WHERE username = ? OR email = ?', (username, email))
    result = cursor.fetchone()
    conn.close()
    
    return result is not None

def create_user(username, email, password):
    """Create a new user"""
    hashed_password = generate_password_hash(password)
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute('''
            INSERT INTO users (username, email, password)
            VALUES (?, ?, ?)
        ''', (username, email, hashed_password))
        
        conn.commit()
        user_id = cursor.lastrowid
        conn.close()
        return {'id': user_id, 'username': username, 'email': email}
    except sqlite3.IntegrityError:
        conn.close()
        return None

def get_user_by_username(username):
    """Get user by username"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM users WHERE username = ?', (username,))
    user = cursor.fetchone()
    conn.close()
    
    return user

def verify_password(stored_hash, password):
    """Verify password"""
    return check_password_hash(stored_hash, password)
