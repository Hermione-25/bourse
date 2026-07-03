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
        path: 'reset-password/:token',
        loadComponent: () => import('./features/auth/pages/reset-password/reset-password.component').then((m) => m.ResetPasswordComponent),
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
    path: 'user',
    loadComponent: () => import('./layouts/utilisateur/user-layout.component').then((m) => m.UserLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'tableau-de-bord',
      },
      {
        path: 'profil',
        loadComponent: () => import('./features/utilisateurs/profil-user/profil-user').then((m) => m.ProfilUser),
      },
      {
        path: 'recommandations',
        loadComponent: () => import('./features/utilisateurs/recommandation/recommandation.component').then((m) => m.RecommandationComponent),
      },
      {
        path: 'favoris',
        loadComponent: () => import('./features/utilisateurs/favoris/favoris.component').then((m) => m.FavorisComponent),
      },
      {
        path: 'cv',
        loadComponent: () => import('./features/utilisateurs/cv/cv.component').then((m) => m.CvComponent),
        
      },{
        path:'tableau-de-bord',
        loadComponent:() => import('./features/utilisateurs/tableau/tableau.component').then((m) => m.TableauComponent)
      }
    ],
  },
  {
    path: 'admin',
    loadComponent: () => import('./layouts/admin/admin-layout.component').then((m) => m.AdminLayoutComponent),
    canActivate: [],
    children: [
      {
        path: 'liste-user',
        loadComponent: () => import('./features/administrateur/liste-user/liste-user.component').then((m) => m.ListeUserComponent),
      },
      {
        path: 'liste-scholarite',
        loadComponent: () => import('./features/administrateur/liste-scholariships/liste-scholariships.component').then((m) => m.ListeScholarishipsComponent),
      },
      {
        path: 'profil',
        loadComponent: () => import('./features/administrateur/profil/profil.component').then((m) => m.ProfilComponent),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'liste-user',
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];

