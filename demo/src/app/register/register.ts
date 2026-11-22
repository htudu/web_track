import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

interface RegisterResponse {
  message: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
}

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: '../auth.css',
})
export class Register {
  private http = inject(HttpClient);
  private router = inject(Router);

  username = '';
  email = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  onRegister() {
    if (this.isLoading) {
      return;
    }

    this.errorMessage = '';
    this.isLoading = true;
    this.http.post<RegisterResponse>('http://localhost:8000/register', {
      username: this.username,
      email: this.email,
      password: this.password,
    }).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: () => {
        this.password = '';
        void this.router.navigate(['/login'], { queryParams: { registered: 'true' } });
      },
      error: (error: unknown) => {
        console.error('Registration failed', error);
        const backendMessage = error instanceof HttpErrorResponse ? error.error?.error : null;
        this.errorMessage = typeof backendMessage === 'string' && backendMessage
          ? backendMessage
          : 'Registration failed. Please try again.';
      }
    });
  }
}
