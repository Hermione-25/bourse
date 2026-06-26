import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/auth/auth.service';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css'],
})
export class RegisterPageComponent {

  countries = [
  { id: 1, name: 'Bénin' },
  { id: 2, name: 'Burkina Faso' },
  { id: 3, name: 'Cap-Vert' },
  { id: 4, name: 'Côte d\'Ivoire' },
  { id: 5, name: 'Gambie' },
  { id: 6, name: 'Ghana' },
  { id: 7, name: 'Guinée' },
  { id: 8, name: 'Guinée-Bissau' },
  { id: 9, name: 'Liberia' },
  { id: 10, name: 'Mali' },
  { id: 11, name: 'Mauritanie' },
  { id: 12, name: 'Niger' },
  { id: 13, name: 'Nigeria' },
  { id: 14, name: 'Sénégal' },
  { id: 15, name: 'Sierra Leone' },
  { id: 16, name: 'Togo' },
  { id: 17, name: 'Algérie' },
  { id: 18, name: 'Égypte' },
  { id: 19, name: 'Libye' },
  { id: 20, name: 'Maroc' },
  { id: 21, name: 'Tunisie' },
  { id: 22, name: 'Soudan' },
  { id: 23, name: 'Afrique du Sud' },
  { id: 24, name: 'Angola' },
  { id: 25, name: 'Botswana' },
  { id: 26, name: 'Eswatini' },
  { id: 27, name: 'Lesotho' },
  { id: 28, name: 'Namibie' },
  { id: 29, name: 'Zimbabwe' },
  { id: 30, name: 'Zambie' },
  { id: 31, name: 'Mozambique' },
  { id: 32, name: 'Madagascar' },
  { id: 33, name: 'Malawi' },
  { id: 34, name: 'Maurice' },
  { id: 35, name: 'Seychelles' },
  { id: 36, name: 'Comores' },
  { id: 37, name: 'Cameroun' },
  { id: 38, name: 'République centrafricaine' },
  { id: 39, name: 'Tchad' },
  { id: 40, name: 'Congo' },
  { id: 41, name: 'République démocratique du Congo' },
  { id: 42, name: 'Guinée équatoriale' },
  { id: 43, name: 'Gabon' },
  { id: 44, name: 'São Tomé-et-Príncipe' },
  { id: 45, name: 'Burundi' },
  { id: 46, name: 'Djibouti' },
  { id: 47, name: 'Érythrée' },
  { id: 48, name: 'Éthiopie' },
  { id: 49, name: 'Kenya' },
  { id: 50, name: 'Ouganda' },
  { id: 51, name: 'Rwanda' },
  { id: 52, name: 'Somalie' },
  { id: 53, name: 'Soudan du Sud' },
  { id: 54, name: 'Tanzanie' }
];
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    country:['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(8)]],
    passwordConfirmation: ['', Validators.required],
  });

  submitting = false;
  errorMessage: string | null = null;

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.errorMessage = 'Veuillez remplir correctement tous les champs obligatoires.';
      return;
    }

    if (this.form.value.password !== this.form.value.passwordConfirmation) {
      this.errorMessage = 'Les mots de passe ne correspondent pas.';
      return;
    }

    this.submitting = true;
    this.errorMessage = null;

    const value = this.form.value as { first_name: string; last_name: string; country: string; email: string; password: string; passwordConfirmation: string };
    this.authService.register(value).subscribe({
      next: () => {
        this.submitting = false;
        this.router.navigate(['/auth/login']);
      },
      error: (error: unknown) => {
        const errorMsg = typeof error === 'object' && error !== null && 'message' in error
          ? String((error as Record<string, unknown>)['message'])
          : 'Échec de l\'inscription';
        this.errorMessage = errorMsg;
        this.submitting = false;
      },
    });
  }
}
