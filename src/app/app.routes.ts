import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./features/landing/landing-page.component').then((m) => m.LandingPageComponent),
  },
  {
    path: 'auth',
    loadComponent: () => import('./layouts/auth/auth-layout.component').then((m) => m.AuthLayoutComponent),
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/pages/login/login-page.component').then((m) => m.LoginPageComponent),
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/pages/register/register-page.component').then((m) => m.RegisterPageComponent),
      },
      {
        path: 'forgot-password',
        loadComponent: () => import('./features/auth/pages/forgot-password/forgot-password-page.component').then((m) => m.ForgotPasswordPageComponent),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login',
      },
    ],
  },
  {
    path: 'scholarships',
    loadComponent: () => import('./layouts/public/public-layout.component').then((m) => m.PublicLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/scholarships/pages/scholarship-list/scholarship-list-page.component').then((m) => m.ScholarshipListPageComponent),
      },
    ],
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./layouts/dashboard/dashboard-layout.component').then((m) => m.DashboardLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'scholarships',
        loadComponent: () => import('./features/scholarships/pages/scholarship-list/scholarship-list-page.component').then((m) => m.ScholarshipListPageComponent),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'scholarships',
      },
    ],
  },
  {
    path: 'admin',
    loadComponent: () => import('./layouts/admin/admin-layout.component').then((m) => m.AdminLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'users',
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];

