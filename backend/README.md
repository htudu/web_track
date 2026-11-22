# Flask Login Backend Server

A simple Flask backend server with user registration and JWT-based authentication.

## Features

- **User Registration** - Create new user accounts with email validation
- **User Login** - Authenticate users and generate JWT tokens
- **Protected Routes** - Access control using JWT tokens
- **SQLite Database** - Persistent user storage
- **Password Hashing** - Secure password storage using Werkzeug
- **CORS Support** - Enabled for Angular frontend

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment

Edit `.env` file (optional, defaults are provided):

```env
SECRET_KEY=your_secret_key_change_in_production
JWT_SECRET=your_jwt_secret_change_in_production
DATABASE=users.db
FLASK_ENV=development
```

### 3. Run the Server

```bash
python app.py
```

The server will start at `http://localhost:8000`

## API Endpoints

### 1. Register User
**POST** `/register`

Request:
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```

Response (201):
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

### 2. Login User
**POST** `/login`

Request:
```json
{
  "username": "john_doe",
  "password": "password123"
}
```

Response (200):
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

### 3. Protected Route (Verify Token)
**GET** `/protected`

Headers:
```
Authorization: Bearer <your_jwt_token>
```

Response (200):
```json
{
  "message": "Access granted",
  "user": {
    "user_id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "exp": 1234567890,
    "iat": 1234567890
  }
}
```

### 4. Health Check
**GET** `/health`

Response (200):
```json
{
  "status": "Server is running"
}
```

## Validation Rules

### Registration
- Username: Minimum 3 characters
- Email: Must be valid email format
- Password: Minimum 6 characters
- Username and Email must be unique

### Login
- Both username and password are required
- Passwords are verified using secure hashing

## Token Details

- **Algorithm**: HS256
- **Expiration**: 24 hours
- **Contains**: user_id, username, email, exp, iat

## Database Schema

```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Testing with cURL

```bash
# Register
curl -X POST http://localhost:8000/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:8000/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'

# Protected route (replace TOKEN with actual token)
curl -X GET http://localhost:8000/protected \
  -H "Authorization: Bearer TOKEN"

# Health check
curl http://localhost:8000/health
```

## Project Structure

```
backend/
├── app.py           # Main Flask application
├── models.py        # Database models and utilities
├── requirements.txt # Python dependencies
├── .env             # Environment configuration
├── users.db         # SQLite database (auto-created)
└── README.md        # This file
```

## Notes

- Change `SECRET_KEY` and `JWT_SECRET` in production
- Use HTTPS in production
- Consider adding rate limiting
- Consider adding email verification
- Database is SQLite (suitable for development/testing)
