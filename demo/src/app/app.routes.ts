import { inject } from '@angular/core';
import { CanActivateFn, Router, Routes } from '@angular/router';
import { Login } from './login/login';
import { Dashboard } from './dashboard/dashboard';
import { Register } from './register/register';

const requireLogin: CanActivateFn = () =>
  localStorage.getItem('auth_token') ? true : inject(Router).createUrlTree(['/login']);

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'dashboard', component: Dashboard, canActivate: [requireLogin] },
];
