/**
 * Example Authentication Service for Angular
 * 
 * This service provides methods for user registration, login, and token management.
 * It can be used with the Flask backend at http://localhost:8000
 * 
 * To use this service:
 * 1. Create auth.service.ts with this content
 * 2. Import in your components or as a provider
 * 3. Update the apiUrl if your backend is on a different URL
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

export interface User {
  id: number;
  username: string;
  email: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

export interface TokenPayload {
  user_id: number;
  username: string;
  email: string;
  exp: number;
  iat: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000';
  
  // Observable to track current user
  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Register a new user
   * @param data Registration data (username, email, password)
   * @returns Observable with registration response
   */
  register(data: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, data)
      .pipe(
        tap(response => {
          console.log('Registration successful', response);
        }),
        catchError(error => {
          console.error('Registration error', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Login user and store JWT token
   * @param username User's username
   * @param password User's password
   * @returns Observable with login response (token + user data)
   */
  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, {
      username,
      password
    }).pipe(
      tap(response => {
        this.setToken(response.token);
        this.setUserData(response.user);
        this.currentUserSubject.next(response.user);
        console.log('Login successful', response);
      }),
      catchError(error => {
        console.error('Login error', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Logout user (clear token and user data)
   */
  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    this.currentUserSubject.next(null);
    console.log('User logged out');
  }

  /**
   * Get stored JWT token
   * @returns JWT token or null
   */
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  /**
   * Store JWT token in localStorage
   * @param token JWT token
   */
  private setToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  /**
   * Check if user is logged in
   * @returns true if token exists
   */
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  /**
   * Get current user from localStorage
   * @returns User object or null
   */
  getCurrentUser(): User | null {
    return this.getUserFromStorage();
  }

  /**
   * Get user from localStorage
   * @returns User object or null
   */
  private getUserFromStorage(): User | null {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  }

  /**
   * Store user data in localStorage
   * @param user User data
   */
  private setUserData(user: User): void {
    localStorage.setItem('user_data', JSON.stringify(user));
  }

  /**
   * Parse JWT token payload (without verification - client-side only!)
   * @param token JWT token
   * @returns Decoded payload or null
   */
  parseToken(token: string): TokenPayload | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error parsing token', error);
      return null;
    }
  }

  /**
   * Check if token is expired
   * @returns true if token is expired
   */
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    const payload = this.parseToken(token);
    if (!payload) return true;

    // exp is in seconds, Date.now() is in milliseconds
    return payload.exp * 1000 < Date.now();
  }

  /**
   * Get time until token expiration
   * @returns Milliseconds until expiration, or 0 if no token
   */
  getTokenExpirationTime(): number {
    const token = this.getToken();
    if (!token) return 0;

    const payload = this.parseToken(token);
    if (!payload) return 0;

    return (payload.exp * 1000) - Date.now();
  }

  /**
   * Verify token with backend
   * @returns Observable with verification result
   */
  verifyToken(): Observable<any> {
    return this.http.get(`${this.apiUrl}/protected`)
      .pipe(
        catchError(error => {
          console.error('Token verification error', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Clear authentication (logout)
   */
  clearAuth(): void {
    this.logout();
  }
}

/**
 * Example usage in a component:
 * 
 * import { AuthService } from './services/auth.service';
 * 
 * @Component(...)
 * export class LoginComponent {
 *   constructor(private authService: AuthService) {}
 * 
 *   login() {
 *     this.authService.login('username', 'password').subscribe({
 *       next: (response) => {
 *         console.log('Login successful!');
 *         // Navigate to dashboard
 *       },
 *       error: (error) => {
 *         console.error('Login failed', error);
 *       }
 *     });
 *   }
 * 
 *   isLoggedIn() {
 *     return this.authService.isLoggedIn();
 *   }
 * 
 *   logout() {
 *     this.authService.logout();
 *   }
 * }
 */
