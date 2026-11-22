import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private router = inject(Router);

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    void this.router.navigate(['/login']);
  }
}
