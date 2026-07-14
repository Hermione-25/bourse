import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { EtudiantProfile} from '../../../shared/models/profil-user.models';
import {User} from '../../../shared/models/user.models';
import { AuthService } from '../../../core/auth/auth.service';
import { DestroyRef } from '@angular/core';
import { calculerCompletionProfil } from '../../../shared/utils/profil-user-utils';
import { ProfileService } from '../../../services/utilisateur/profil.service';

type VueProfil = 'lecture' | 'formulaire-base' | 'formulaire-complet';

@Component({
  selector: 'app-profil-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './profil-user.html'
})
export class ProfilUser implements OnInit {
  private profileService = inject(ProfileService);
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  destroyRef = inject(DestroyRef);

  readonly nationality = [
    'Béninoise', 'Ivoirienne', 'Sénégalaise', 'Togolaise', 'Burkinabè',
    'Malienne', 'Nigérienne', 'Guinéenne', 'Camerounaise', 'Gabonaise',
    'Congolaise', 'Marocaine', 'Tunisienne', 'Algérienne', 'Française',
    'Autre'
  ];

  readonly study_level = [
    'Baccalauréat', 'Licence 1', 'Licence 2', 'Licence 3',
    'Master 1', 'Master 2', 'Doctorat'
  ];

  readonly study_domain = [
    'Informatique', 'Gestion / Économie', 'Droit', 'Médecine / Santé',
    'Ingénierie', 'Sciences', 'Lettres / Sciences humaines',
    'Agriculture', 'Autre'
  ];

  readonly languages = ['Français', 'Anglais', 'Espagnol', 'Portugais', 'Arabe'];
  readonly gender = ['Homme', 'Femme'];

  vue = signal<VueProfil>('lecture');

  utilisateur = signal<User>({ id: 0, first_name: '', last_name: '', email: '', country: '' });

  basicForm = this.fb.nonNullable.group({
    first_name: [''],
    last_name: [''],
    country: [''],
    email: ['', [Validators.email]]
  });

  competences = signal<string[]>([]);
  nouvelleCompetence = signal('');
  saving = signal(false);
  saved = signal(false);

  profileForm = this.fb.group({
    nationality: [''],
    birth_date: [''],
    gender: [''],
    study_level: [''],
    study_domain: [''],
    skills: this.fb.control<string[]>([]),
    average: this.fb.control<number | null>(null, [Validators.min(0), Validators.max(20)]),
    languages: this.fb.control<string[]>([])
  });

  private formValue = toSignal(this.profileForm.valueChanges, { initialValue: this.profileForm.getRawValue() });

  completion = computed(() => calculerCompletionProfil({
    ...this.formValue(),
    languages: this.formValue().languages ?? [],
    skills: this.competences()
  } as EtudiantProfile));

  isComplete = computed(() => this.completion() === 100);

  ngOnInit(): void {

    this.authService.authState$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(auth => {
        const u = auth;
        if (!u) return;

        this.utilisateur.set({
          id: u.id,
          first_name: u.first_name ?? '',
          last_name: u.last_name ?? '',
          email: u.email,
          country: u.country ?? '',
          role: u.role ?? ''
        });

        this.basicForm.patchValue({
          first_name: u.first_name ?? '',
          last_name: u.last_name ?? '',
          country: u.country ?? '',
          email: u.email
        });
      });

    this.profileService.getProfile()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (profile) => {
          this.profileForm.patchValue(profile);
          this.competences.set(profile.skills ?? []);
        },
        error: () => {
          // normal si le profil n'a jamais été créé (404) — on garde le formulaire vide
        }
      });
  }

  ouvrirModifierBase(): void {
    this.basicForm.patchValue(this.utilisateur());
    this.vue.set('formulaire-base');
  }

  ouvrirCompleterProfil(): void {
    this.vue.set('formulaire-complet');
  }

  retourVueLecture(): void {
    this.vue.set('lecture');
  }

  toggleLangue(langue: string): void {
    const current = this.profileForm.value.languages ?? [];
    const updated = current.includes(langue)
      ? current.filter(l => l !== langue)
      : [...current, langue];
    this.profileForm.patchValue({ languages: updated });
  }

  isLangueSelected(langue: string): boolean {
    return (this.profileForm.value.languages ?? []).includes(langue);
  }

  ajouterCompetence(): void {
    const val = this.nouvelleCompetence().trim();
    if (val && !this.competences().includes(val)) {
      this.competences.update(list => [...list, val]);
    }
    this.nouvelleCompetence.set('');
  }

  supprimerCompetence(competence: string): void {
    this.competences.update(list => list.filter(c => c !== competence));
  }

  enregistrerBase(): void {
    if (this.basicForm.invalid) {
      this.basicForm.markAllAsTouched();
      return;
    }
    const valeurs = this.basicForm.getRawValue();

    this.profileService.updateUtilisateur(valeurs).subscribe({
      next: (user) => {
        this.utilisateur.update(u => ({ ...u, ...user }));
        this.vue.set('lecture');
      },
      error: () => {
        // gérer l'erreur (toast, message, etc.)
      }
    });
  }

  enregistrer(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.saving.set(true);

    const profile: EtudiantProfile = {
      ...this.profileForm.getRawValue(),
      languages: this.profileForm.value.languages ?? [],
      skills: this.competences()
    } as EtudiantProfile;

    this.profileService.updateProfile(profile).subscribe({
      next: () => {
        this.saving.set(false);
        this.saved.set(true);
        this.vue.set('lecture');
      },
      error: () => this.saving.set(false)
    });
  }
}