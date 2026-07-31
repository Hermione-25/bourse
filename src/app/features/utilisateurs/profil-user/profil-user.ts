import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';

import { EtudiantProfile } from '../../../shared/models/profil-user.models';
import { User } from '../../../shared/models/user.models';
import { AuthService } from '../../../core/auth/auth.service';
import { ProfileService } from '../../../services/utilisateur/profil.service';
import { calculerCompletionProfil } from '../../../shared/utils/profil-user-utils';

type VueProfil = 'lecture' | 'formulaire-base' | 'formulaire-complet';

@Component({
  selector: 'app-profil-user',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './profil-user.html'
})
export class ProfilUser implements OnInit {

  private readonly profileService = inject(ProfileService);
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);


  readonly nationality = [
    'Béninoise',
    'Ivoirienne',
    'Sénégalaise',
    'Togolaise',
    'Burkinabè',
    'Malienne',
    'Nigérienne',
    'Guinéenne',
    'Camerounaise',
    'Gabonaise',
    'Congolaise',
    'Marocaine',
    'Tunisienne',
    'Algérienne',
    'Française',
    'Autre'
  ];


  readonly study_level = [
    'Baccalauréat',
    'Licence 1',
    'Licence 2',
    'Licence 3',
    'Master 1',
    'Master 2',
    'Doctorat'
  ];


  readonly study_domain = [
    'Informatique',
    'Gestion / Économie',
    'Droit',
    'Médecine / Santé',
    'Ingénierie',
    'Sciences',
    'Lettres / Sciences humaines',
    'Agriculture',
    'Autre'
  ];


  readonly destination_countries = [
    'South Africa',
    'Algeria',
    'Egypt',
    'Morocco',
    'Tunisia',
    'Rwanda',
    'Senegal',

    'Germany',
    'Austria',
    'Belgium',
    'Spain',
    'France',
    'Italy',
    'Denmark',
    'Norway',
    'Netherlands',
    'Sweden',
    'Switzerland',
    'United Kingdom',
    'Czechia',

    'Qatar',
    'China',
    'South Korea',
    'Japan',
    'India',
    'Turkey',
    'Singapore',

    'Canada',
    'United States',

    'Australia',
    'New Zealand'
  ];


  readonly gender = [
    'Homme',
    'Femme'
  ];


  vue = signal<VueProfil>('lecture');


  utilisateur = signal<User>({
    id: 0,
    first_name: '',
    last_name: '',
    email: '',
    country: ''
  });


  basicForm = this.fb.nonNullable.group({
    first_name: [''],
    last_name: [''],
    country: [''],
    email: ['', [Validators.email]]
  });


  saving = signal(false);


  // Champs facultatifs : pas de Validators.required, cohérent avec le message
  // "Ces informations sont facultatives" affiché dans le formulaire.
  profileForm = this.fb.group({

    nationality: [''],

    birth_date: [''],

    gender: [''],

    study_level: [''],

    study_domain: [''],

    destination_countries: ['']

  });


  private formValue = toSignal(
    this.profileForm.valueChanges,
    {
      initialValue: this.profileForm.getRawValue()
    }
  );


  completion = computed(() =>
    calculerCompletionProfil({
      ...this.formValue()
    } as EtudiantProfile)
  );


  isComplete = computed(() =>
    this.completion() === 100
  );


  ngOnInit(): void {

    this.authService.authState$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(auth => {

        if (!auth) return;

        this.utilisateur.set({
          id: auth.id,
          first_name: auth.first_name ?? '',
          last_name: auth.last_name ?? '',
          email: auth.email,
          country: auth.country ?? '',
          role: auth.role ?? ''
        });


        this.basicForm.patchValue({
          first_name: auth.first_name ?? '',
          last_name: auth.last_name ?? '',
          country: auth.country ?? '',
          email: auth.email
        });

      });


    this.profileService.getProfile()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({

        next: profile => {
          this.profileForm.patchValue(profile);
        },

        error: () => {

        }

      });

  }



  ouvrirModifierBase(): void {

    this.basicForm.patchValue(
      this.utilisateur()
    );

    this.vue.set('formulaire-base');

  }



  ouvrirCompleterProfil(): void {

    this.vue.set('formulaire-complet');

  }



  retourVueLecture(): void {

    this.vue.set('lecture');

  }




  enregistrerBase(): void {

    if (this.basicForm.invalid) {

      this.basicForm.markAllAsTouched();

      return;

    }


    const valeurs = this.basicForm.getRawValue();


    this.profileService.updateUtilisateur(valeurs)
      .subscribe({

        next: user => {

          this.utilisateur.update(
            u => ({
              ...u,
              ...user
            })
          );


          this.vue.set('lecture');

        }

      });

  }




  enregistrer(): void {

    this.saving.set(true);


    const profile: EtudiantProfile = {

      ...this.profileForm.getRawValue()

    } as EtudiantProfile;



    this.profileService.updateProfile(profile)
      .subscribe({

        next: () => {

          this.saving.set(false);

          this.vue.set('lecture');

        },


        error: () => {

          this.saving.set(false);

        }

      });

  }

}