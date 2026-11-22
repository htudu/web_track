# Frontend Integration Guide

This guide shows how to integrate the Flask backend APIs with your Angular frontend.

## Prerequisites

- Flask backend server running on `http://localhost:8000`
- Angular project with HttpClient module

## Current demo and dashboard

The demo implements login in [login.ts](./demo/src/app/login/login.ts) and
[login.html](./demo/src/app/login/login.html). It sends the form values to
`POST /login`, stores the returned token and user data, and navigates to the
[dashboard](./demo/src/app/dashboard/dashboard.ts). Errors are shown in the
form, and duplicate submissions are disabled while a request is pending.

The [registration page](./demo/src/app/register/register.ts) sends username,
email, and password to `POST /register`. On success, it returns to login with
a confirmation message; it does not log the user in automatically. Its
[template](./demo/src/app/register/register.html) validates the required fields,
username and password lengths, and email format before submission.
Both authentication pages share responsive styles in
[auth.css](./demo/src/app/auth.css).

The [routes](./demo/src/app/app.routes.ts) map `/login`, `/register`, and `/dashboard` to
their components. The root template uses `<router-outlet>` to show the matching
page. To expand the dashboard, add content to
[dashboard.html](./demo/src/app/dashboard/dashboard.html) and styles to
[dashboard.css](./demo/src/app/dashboard/dashboard.css). Its logout button
clears the stored session and returns to login.

The dashboard route guard checks only whether a token is present. It does not
validate the token or its expiration and is not a security boundary: the
backend must validate tokens before returning protected data. The dashboard is
currently a placeholder and does not call `/protected`.

The service, interceptor, and guard snippets below are optional
examples; they are not currently wired into the demo.

## 1. Update Angular Login Component

See the implemented [login component](./demo/src/app/login/login.ts).
`provideHttpClient()` is already configured in
[app.config.ts](./demo/src/app/app.config.ts).

## 2. Create Auth Service

Create a reusable authentication service [auth.service.ts](/demo/src/app/services/auth.service.ts):

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000';
  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  register(data: RegisterData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data)
      .pipe(
        tap(response => {
          console.log('Registration successful');
        })
      );
  }

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, {
      username,
      password
    }).pipe(
      tap(response => {
        this.setToken(response.token);
        this.setUserData(response.user);
        this.currentUserSubject.next(response.user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  setToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  getUserFromStorage(): User | null {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  }

  setUserData(user: User): void {
    localStorage.setItem('user_data', JSON.stringify(user));
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
```

## 3. Create Auth Interceptor (Optional but Recommended)

Create an HTTP interceptor to automatically add JWT token to requests:

```typescript
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.authService.getToken();
    
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    
    return next.handle(request);
  }
}
```

## 4. Use in App Configuration

If you implement the class-based interceptor above, register it in the app
configuration and enable DI-based interceptors:

```typescript
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AuthInterceptor } from './auth/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // ... other providers
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
};
```

## 5. Create Auth Guard (Optional)

Protect routes that require authentication:

```typescript
import { Injectable } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}

// Can be used in routes:
// {
//   path: 'dashboard',
//   component: DashboardComponent,
//   canActivate: [AuthGuard]
// }
```

## 6. Update Login Template

The implemented [login template](./demo/src/app/login/login.html) uses
`ngSubmit`, required inputs, and a loading state:

```html
<form #loginForm="ngForm" (ngSubmit)="loginForm.valid && backendLogin()">
  <input name="username" [(ngModel)]="uname" required>
  <input name="password" type="password" [(ngModel)]="pwd" required>
  <button type="submit" [disabled]="isLoading || loginForm.invalid">
    {{ isLoading ? 'Logging in...' : 'Login' }}
  </button>
</form>
@if (errorMessage) {
  <p role="alert">{{ errorMessage }}</p>
}
```

## API Response Handling

### Successful Login Response
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

### Error Response
```json
{
  "error": "Invalid username or password"
}
```

## Testing the Integration

1. **Start Backend Server**
   ```bash
   cd backend
   python app.py
   ```

2. **Run Angular App**
   ```bash
   cd demo
   npm start
   ```

3. **Test Flow**
   - Open http://localhost:4200
   - Open the login page
   - Use **Create an account** to register, or log in with an existing user
   - After registering, log in with the new credentials
   - Verify successful login opens `/dashboard`, then try logging out
   - Verify invalid credentials show an error and allow another attempt
   - Verify localStorage has `auth_token` and `user_data`

## Security Considerations

1. **Store Token Securely**
   - The demo uses localStorage, which is accessible to JavaScript and vulnerable to token theft via XSS
   - Consider an httpOnly, secure cookie-based session for production, with appropriate CSRF protection
   - Never store sensitive data like passwords

2. **HTTPS in Production**
   - Always use HTTPS when sending tokens
   - Set secure flag on cookies

3. **Token Expiration**
   - Current token expires in 24 hours
   - Implement token refresh mechanism for longer sessions
   - Handle expiration gracefully in the UI

4. **CORS**
   - Backend has CORS enabled for development
   - Restrict origins in production

## Troubleshooting

### CORS Errors
- Ensure backend is running on port 8000
- Check CORS headers in Flask app
- Use credentials: 'include' if needed

### Token Not Stored
- Check localStorage in browser dev tools
- Verify token is returned from login endpoint
- Check for JSON parsing errors

### Protected Routes Return 401
- Verify token format in Authorization header
- Check token expiration
- Ensure interceptor is properly configured

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Cannot find module '@angular/common/http'" | Install: `npm install @angular/common` |
| Token not sent with requests | Ensure interceptor is provided in appConfig |
| CORS error | Check backend CORS is enabled and origin is whitelisted |
| localStorage is undefined | Ensure running in browser, not server-side |

## Registration Component

See the implemented [registration component](./demo/src/app/register/register.ts)
and [template](./demo/src/app/register/register.html). They use `HttpClient`
directly, like the login component; the optional service above is not required.
