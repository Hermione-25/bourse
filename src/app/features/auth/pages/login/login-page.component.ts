import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/auth/auth.service';
import { Router } from '@angular/router';
import { environment } from '../../../../../main';

declare const google: any;

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,], 
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
})
export class LoginPageComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);


  ngOnInit() {
    google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: (response: any) => this.handleGoogleLogin(response)
    });

    google.accounts.id.renderButton(
      document.getElementById('google-btn'),
      { theme: 'outline', size: 'large', width: '100%' }
    );
  }

  handleGoogleLogin(response: any) {
    const idToken = response.credential;

    this.authService.loginWithGoogle(idToken).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => console.error('Erreur connexion Google', err)
    });
  }

  
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  submitting = false;
  errorMessage: string | null = null;

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.errorMessage = 'Veuillez remplir correctement tous les champs obligatoires.';
      return;
    }

    this.submitting = true;
    this.errorMessage = null;

    const value = this.form.value as { email: string; password: string };
    this.authService.login(value).subscribe({
 next: (res) => {
  this.submitting = false;
  const isAdmin = res.data.user?.role === 'admin';
  this.router.navigate([isAdmin ? '/admin' : '/user']);
},
  error: (error: unknown) => {
    const errorMsg =
      typeof error === 'object' && error !== null && 'message' in error
        ? String((error as Record<string, unknown>)['message'])
        : 'Échec de la connexion';

    this.errorMessage = errorMsg;
    this.submitting = false;
  },
});
  }

  naviguerVersRegister(): void {
    this.router.navigate(['/auth/register']);
  }

  naviguerVersForgotPassword(): void {
    this.router.navigate(['/auth/forgot-password']);
  }
}
