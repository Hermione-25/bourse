import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-forgot-password-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgot-password-page.component.html',
  styleUrls: ['./forgot-password-page.component.css'],
})
export class ForgotPasswordPageComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  submitting = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  submit(): void {
    if (this.form.invalid) {
      return;
    }

    this.submitting = true;
    this.errorMessage = null;
    this.successMessage = null;

    const value = this.form.value as { email: string };
    this.authService.forgotPassword(value).subscribe({
      next: () => {
        this.successMessage = 'Si cet email existe, un lien de réinitialisation a été envoyé.';
        this.submitting = false;
      },
      error: (error: unknown) => {
        const errorMsg = typeof error === 'object' && error !== null && 'message' in error
          ? String((error as Record<string, unknown>)['message'])
          : 'Échec de la demande de mot de passe.';
        this.errorMessage = errorMsg;
        this.submitting = false;
      },
    });
  }
}
