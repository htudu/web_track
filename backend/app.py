from flask import Flask, request, jsonify
from flask_cors import CORS
import jwt
import os
from datetime import datetime, timedelta
from dotenv import load_dotenv
from models import (
    init_db, user_exists, create_user, 
    get_user_by_username, verify_password
)

load_dotenv()

app = Flask(__name__)
CORS(app)

app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
JWT_SECRET = os.getenv('JWT_SECRET', 'jwt-secret-key')

@app.before_request
def before_request():
    """Initialize database on first request"""
    if not hasattr(app, 'db_initialized'):
        init_db()
        app.db_initialized = True

@app.route('/register', methods=['POST'])
def register():
    """User registration endpoint"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        username = data.get('username', '').strip()
        email = data.get('email', '').strip()
        password = data.get('password', '').strip()
        
        # Validation
        if not username or len(username) < 3:
            return jsonify({'error': 'Username must be at least 3 characters'}), 400
        
        if not email or '@' not in email:
            return jsonify({'error': 'Invalid email'}), 400
        
        if not password or len(password) < 6:
            return jsonify({'error': 'Password must be at least 6 characters'}), 400
        
        # Check if user exists
        if user_exists(username, email):
            return jsonify({'error': 'Username or email already exists'}), 409
        
        # Create user
        new_user = create_user(username, email, password)
        
        if new_user:
            return jsonify({
                'message': 'User registered successfully',
                'user': new_user
            }), 201
        else:
            return jsonify({'error': 'Failed to create user'}), 500
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/login', methods=['POST'])
def login():
    """User login endpoint - returns JWT token"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        username = data.get('username', '').strip()
        password = data.get('password', '').strip()
        
        if not username or not password:
            return jsonify({'error': 'Username and password required'}), 400
        
        # Get user from database
        user = get_user_by_username(username)
        
        if not user:
            return jsonify({'error': 'Invalid username or password'}), 401
        
        # Verify password
        if not verify_password(user['password'], password):
            return jsonify({'error': 'Invalid username or password'}), 401
        
        # Generate JWT token
        payload = {
            'user_id': user['id'],
            'username': user['username'],
            'email': user['email'],
            'exp': datetime.utcnow() + timedelta(hours=24),
            'iat': datetime.utcnow()
        }
        
        token = jwt.encode(payload, JWT_SECRET, algorithm='HS256')
        
        return jsonify({
            'message': 'Login successful',
            'token': token,
            'user': {
                'id': user['id'],
                'username': user['username'],
                'email': user['email']
            }
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/protected', methods=['GET'])
def protected():
    """Protected route - requires valid JWT token"""
    try:
        auth_header = request.headers.get('Authorization')
        
        if not auth_header:
            return jsonify({'error': 'Missing authorization header'}), 401
        
        try:
            token = auth_header.split(' ')[1]
        except IndexError:
            return jsonify({'error': 'Invalid authorization header'}), 401
        
        # Verify and decode token
        payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
        
        return jsonify({
            'message': 'Access granted',
            'user': payload
        }), 200
    
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token has expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid token'}), 401
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'Server is running'}), 200

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)
