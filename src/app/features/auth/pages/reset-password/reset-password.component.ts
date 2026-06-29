import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent {
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  token = '';

  submitting = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  form = this.fb.nonNullable.group({
    password: ['', [Validators.required]],
    password_confirmation: ['', [Validators.required]],
  });

  ngOnInit() {
  console.log('RESET PASSWORD LOADED');
  this.token = this.route.snapshot.queryParamMap.get('token') || '';
}
  submit() {
    if (this.form.invalid || !this.token) return;

    this.submitting = true;

    const { password, password_confirmation } = this.form.getRawValue();

    this.authService.resetPassword({
      token: this.token,
      password,
      password_confirmation,
    }).subscribe({
      next: () => {
        this.successMessage = 'Mot de passe changé avec succès';
        this.submitting = false;
      },
      error: () => {
        this.errorMessage = 'Erreur lors de la réinitialisation';
        this.submitting = false;
      },
    });
  }
}