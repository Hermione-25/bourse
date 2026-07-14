import { Component, inject, signal } from '@angular/core';
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

 submitting = signal(false);
successMessage = signal('');
errorMessage = signal('');

submit() {
  this.submitting.set(true);
  this.successMessage.set('');
  this.errorMessage.set('');

  const { email } = this.form.getRawValue();
  this.authService.forgotPassword({ email }).subscribe({
    next: () => {
      this.successMessage.set('Si cet email existe, un lien de réinitialisation a été envoyé.');
      this.submitting.set(false);
    },
    error: () => {
      this.errorMessage.set('Impossible de traiter la demande pour le moment.');
      this.submitting.set(false);
    },
  });
}
}