import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AbstractControl, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  token = '';
  email = '';

  submitting = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  form = this.fb.nonNullable.group(
    {
      password: ['', [Validators.required, Validators.minLength(8)]],
      password_confirmation: ['', [Validators.required]],
    },
    { validators: this.passwordsMatchValidator }
  );

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token') || this.route.snapshot.queryParamMap.get('token') || '';
    this.email = this.route.snapshot.queryParamMap.get('email') || '';
  }

  submit(): void {
    if (this.form.invalid || !this.token || !this.email) {
      this.errorMessage = 'Le lien de réinitialisation est invalide ou incomplet.';
      return;
    }

    const password = this.form.get('password')?.value ?? '';
    const passwordConfirmation = this.form.get('password_confirmation')?.value ?? '';

    if (password !== passwordConfirmation) {
      this.errorMessage = 'Les mots de passe ne correspondent pas.';
      return;
    }

    this.submitting = true;
    this.successMessage = null;
    this.errorMessage = null;

    this.authService.resetPassword(this.email, this.token, password, passwordConfirmation).subscribe({
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

  private passwordsMatchValidator(control: AbstractControl) {
    const password = control.get('password')?.value;
    const passwordConfirmation = control.get('password_confirmation')?.value;

    return password && passwordConfirmation && password !== passwordConfirmation
      ? { passwordMismatch: true }
      : null;
  }
}