# Quick Start Guide - Flask Login Backend

## 🚀 Getting Started (2 minutes)

### Step 1: Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### Step 2: Start the Server
```bash
python app.py
```

You should see:
```
* Running on http://127.0.0.1:8000
* Debugger is active!
```

### Step 3: Test the API (Optional)
```bash
python test_api.py
```

## 📝 API Quick Reference

### Register New User
```bash
curl -X POST http://localhost:8000/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Response:**
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

### Login User
```bash
curl -X POST http://localhost:8000/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "password123"
  }'
```

**Response:**
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

### Verify Token (Protected Route)
```bash
curl -X GET http://localhost:8000/protected \
  -H "Authorization: Bearer <your_token>"
```

**Response:**
```json
{
  "message": "Access granted",
  "user": {
    "user_id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "exp": 1795427740,
    "iat": 1795341340
  }
}
```

### Health Check
```bash
curl http://localhost:8000/health
```

## 📁 Project Structure

```
backend/
├── app.py              # Main Flask application
├── models.py           # Database models & utilities
├── requirements.txt    # Python dependencies
├── .env               # Configuration (secrets)
├── users.db           # SQLite database (auto-created)
├── test_api.py        # Test suite
└── README.md          # Full documentation
```

## 🔑 Key Features

✅ User Registration with validation
✅ Secure Password Hashing
✅ JWT Token Generation (24-hour expiry)
✅ Protected Routes with Token Verification
✅ SQLite Database (no setup required)
✅ CORS Enabled (for Angular frontend)
✅ Comprehensive Error Handling
✅ Full Test Suite Included

## ⚙️ Configuration

Edit `.env` to customize:

```env
SECRET_KEY=your_secret_key_change_in_production
JWT_SECRET=your_jwt_secret_change_in_production
DATABASE=users.db
FLASK_ENV=development
```

## 🧪 Available Endpoints

| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---|
| POST | `/register` | Create new user | ❌ No |
| POST | `/login` | Authenticate user & get token | ❌ No |
| GET | `/protected` | Verify token & get user info | ✅ Yes |
| GET | `/health` | Server health check | ❌ No |

## 🔒 Validation Rules

### Registration
- **Username:** min 3 characters, unique
- **Email:** valid format, unique
- **Password:** min 6 characters

### Login
- **Username & Password:** both required
- **Response:** JWT token (24-hour expiry)

## 📊 Test Results

All tests passed! ✅

```
✓ Health Check
✓ User Registration
✓ Duplicate Registration (error handling)
✓ Login with Wrong Password (error handling)
✓ Login Success (token generated)
✓ Protected Route (without token - rejected)
✓ Protected Route (with invalid token - rejected)
✓ Protected Route (with valid token - accepted)
```

## 🐛 Troubleshooting

### "Port 8000 already in use"
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :8000
kill -9 <PID>
```

### "Module not found: flask"
```bash
pip install -r requirements.txt
```

### CORS issues with Angular
- Verify backend is running on http://localhost:8000
- Check that CORS is enabled in app.py (it is by default)

### Database issues
```bash
# Delete existing database to start fresh
rm users.db
# or on Windows
del users.db

# Restart the server - new database will be created
python app.py
```

## 📚 Frontend Integration

See [FRONTEND_INTEGRATION.md](../FRONTEND_INTEGRATION.md) for detailed Angular integration guide.

Quick Angular example:
```typescript
this.http.post('http://localhost:8000/login', {
  username: this.uname,
  password: this.pwd
}).subscribe({
  next: (response: any) => {
    localStorage.setItem('auth_token', response.token);
    console.log('Login successful!');
  },
  error: (error) => {
    console.error('Login failed', error.error.error);
  }
});
```

## 🔄 Development Workflow

```bash
# Terminal 1 - Backend
cd backend
python app.py

# Terminal 2 - Frontend
cd demo
ng serve

# Terminal 3 - Testing (optional)
cd backend
python test_api.py
```

Then open: http://localhost:4200

## 📝 Next Steps

1. ✅ Backend is running
2. Update Angular component to use backend APIs
3. Create auth service for token management
4. Add JWT interceptor for automatic token injection
5. Add login/register routes
6. Implement logout functionality
7. Add route guards for protected pages

## 🚀 Production Checklist

- [ ] Change SECRET_KEY in .env
- [ ] Change JWT_SECRET in .env
- [ ] Use HTTPS
- [ ] Enable database backups
- [ ] Implement rate limiting
- [ ] Add logging
- [ ] Use production WSGI server (Gunicorn)
- [ ] Add email verification
- [ ] Implement password reset
- [ ] Add token refresh mechanism

## 📞 Support

For issues:
1. Check error messages in terminal
2. Review test_api.py output
3. Check browser console (F12)
4. See README.md for detailed documentation

---

**Server Status:** ✅ Running on http://localhost:8000
