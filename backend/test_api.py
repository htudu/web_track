import requests
import json

BASE_URL = "http://localhost:8000"

def test_health():
    """Test health check endpoint"""
    print("=" * 50)
    print("Testing: Health Check")
    print("=" * 50)
    response = requests.get(f"{BASE_URL}/health")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}\n")

def test_register():
    """Test user registration"""
    print("=" * 50)
    print("Testing: User Registration")
    print("=" * 50)
    
    payload = {
        "username": "john_doe",
        "email": "john@example.com",
        "password": "password123"
    }
    
    response = requests.post(f"{BASE_URL}/register", json=payload)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}\n")
    return response.json() if response.status_code == 201 else None

def test_duplicate_register():
    """Test duplicate registration"""
    print("=" * 50)
    print("Testing: Duplicate Registration")
    print("=" * 50)
    
    payload = {
        "username": "john_doe",
        "email": "john@example.com",
        "password": "password123"
    }
    
    response = requests.post(f"{BASE_URL}/register", json=payload)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}\n")

def test_login(username, password):
    """Test user login"""
    print("=" * 50)
    print("Testing: User Login")
    print("=" * 50)
    
    payload = {
        "username": username,
        "password": password
    }
    
    response = requests.post(f"{BASE_URL}/login", json=payload)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}\n")
    return response.json().get("token") if response.status_code == 200 else None

def test_login_wrong_password():
    """Test login with wrong password"""
    print("=" * 50)
    print("Testing: Login with Wrong Password")
    print("=" * 50)
    
    payload = {
        "username": "john_doe",
        "password": "wrongpassword"
    }
    
    response = requests.post(f"{BASE_URL}/login", json=payload)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}\n")

def test_protected(token):
    """Test protected route"""
    print("=" * 50)
    print("Testing: Protected Route (with valid token)")
    print("=" * 50)
    
    headers = {
        "Authorization": f"Bearer {token}"
    }
    
    response = requests.get(f"{BASE_URL}/protected", headers=headers)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}\n")

def test_protected_no_token():
    """Test protected route without token"""
    print("=" * 50)
    print("Testing: Protected Route (without token)")
    print("=" * 50)
    
    response = requests.get(f"{BASE_URL}/protected")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}\n")

def test_protected_invalid_token():
    """Test protected route with invalid token"""
    print("=" * 50)
    print("Testing: Protected Route (with invalid token)")
    print("=" * 50)
    
    headers = {
        "Authorization": "Bearer invalid_token_123"
    }
    
    response = requests.get(f"{BASE_URL}/protected", headers=headers)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}\n")

if __name__ == "__main__":
    print("\n" + "=" * 50)
    print("FLASK LOGIN API - TEST SUITE")
    print("=" * 50 + "\n")
    
    # Test health
    test_health()
    
    # Test registration
    test_register()
    
    # Test duplicate registration
    test_duplicate_register()
    
    # Test wrong password login
    test_login_wrong_password()
    
    # Test successful login
    token = test_login("john_doe", "password123")
    
    # Test protected route without token
    test_protected_no_token()
    
    # Test protected route with invalid token
    test_protected_invalid_token()
    
    # Test protected route with valid token
    if token:
        test_protected(token)
    
    print("=" * 50)
    print("TEST SUITE COMPLETED")
    print("=" * 50)
