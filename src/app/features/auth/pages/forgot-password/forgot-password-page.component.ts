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

 
  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  submitting = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  submit(): void {
    if (this.form.invalid || this.submitting) return;

    this.submitting = true;
    this.successMessage = null;
    this.errorMessage = null;

    const { email } = this.form.getRawValue();
    this.authService.forgotPassword({ email }).subscribe({
      next: () => {
        this.successMessage =
          'Si cet email existe, un lien de réinitialisation a été envoyé.';
        this.submitting = false;
      },
      error: () => {
        this.errorMessage =
          'Impossible de traiter la demande pour le moment.';
        this.submitting = false;
      },
    });
  }
}