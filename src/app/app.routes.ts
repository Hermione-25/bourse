import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './core/auth/auth.guard';


export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./features/landing/landing-page.component').then((m) => m.LandingPageComponent),
  },{
    path:'generate',
    loadComponent: ()=> import('./layouts/public/public-layout.component').then((m)=>m.PublicLayoutComponent), 
    children: [
      {
        path: '',
        loadComponent: () => import('./features/generate/generate.component').then((m) => m.GenerateComponent),
      },
    ], 
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
        path: 'reset-password',
        loadComponent: () => import('./features/auth/pages/reset-password/reset-password.component').then((m) => m.ResetPasswordComponent),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login',
      },
    ],
  },{
  path: 'details',
  loadComponent: () => import('./layouts/public/public-layout.component').then((m) => m.PublicLayoutComponent),
  children: [
    {
      path: ':id',
      loadComponent: () => import('./shared/components/scholariship-detail-page/scholariship-detail-page.component').then((m) => m.ScholarshipDetailComponent),
    },
  ],
},
  {
    path: 'scholarships',
    loadComponent: () => import('./layouts/public/public-layout.component').then((m) => m.PublicLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/scholarships/pages/scholarship-list/scholarship-list-page.component').then((m) => m.ScholarshipsListComponent),
      },
    ],
  }, {
    path: 'pays',
    loadComponent: () => import('./layouts/public/public-layout.component').then((m) => m.PublicLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/destination/destination.component').then((m) => m.DestinationComponent),
      },
    ],
  },{
    path:'contact',
    loadComponent: () => import('./layouts/public/public-layout.component').then((m) => m.PublicLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/contact/contact.component').then((m) => m.ContactComponent),
      },
    ],
  },{
    path:'faq',
    loadComponent: () => import('./layouts/public/public-layout.component').then((m) => m.PublicLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/faq/faq.component').then((m) => m.FaqComponent),
      },
    ],
  },
  {
    path: 'user',
    loadComponent: () => import('./layouts/utilisateur/user-layout.component').then((m) => m.UserLayoutComponent),
    canActivate: [authGuard, roleGuard],
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
    canActivate: [authGuard, roleGuard],
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