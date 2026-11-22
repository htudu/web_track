import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize, tap } from 'rxjs';

interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
}

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css', '../auth.css'],
})
export class Login {
  private http = inject(HttpClient);
  private router = inject(Router);

  uname = '';
  pwd = '';
  errorMessage = '';
  successMessage = inject(ActivatedRoute).snapshot.queryParamMap.get('registered') === 'true'
    ? 'Registration successful. Please log in.'
    : '';
  isLoading = false;

  backendLogin() {
    if (this.isLoading) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = true;
    this.http.post<LoginResponse>('http://localhost:8000/login', {
      username: this.uname,
      password: this.pwd
    }).pipe(
      tap((response) => {
        if (!response.token || !response.user) {
          throw new Error('Invalid login response');
        }
        localStorage.setItem('user_data', JSON.stringify(response.user));
        localStorage.setItem('auth_token', response.token);
      }),
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: () => {
        this.pwd = '';
        void this.router.navigate(['/dashboard']);
      },
      error: (error: unknown) => {
        console.error('Login failed', error);
        const backendMessage = error instanceof HttpErrorResponse ? error.error?.error : null;
        this.errorMessage = typeof backendMessage === 'string' && backendMessage
          ? backendMessage
          : 'Login failed. Please try again.';
      }
    });
  }
}
