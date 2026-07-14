import { Component, inject, signal, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { GenerateService } from './generate.service';
import { Cv, CvPayload, CvTemplate } from './generate.models';
import { AuthService } from '../../core/auth/auth.service';
import { take } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'app-generate',
  imports: [ReactiveFormsModule],
  templateUrl: 'generate.component.html',
})
export class GenerateComponent implements OnInit {
  private fb = inject(FormBuilder);
  private generateService = inject(GenerateService);
  private sanitizer = inject(DomSanitizer);
  private authService = inject (AuthService)

  currentStep = signal(0);
  derniereEtape = 6;

  templates = signal<CvTemplate[]>([]);
  templateSelectionne = signal<number | null>(null);
  chargementApercu = signal<boolean>(false);

  
  apercuHtmlRaw = signal<string>('');
  apercuHtmlSafe = signal<SafeHtml>('');

estConnecte = toSignal(
  this.authService.authState$.pipe(map((auth) => !!auth)),
  { initialValue: false }
);

  formulaire = this.fb.group({
    name: [''],
    personal_info: this.fb.group({
      first_name: [''],
      last_name: [''],
      photo: [''],
      birth_date: [''],
      gender: [''],
      email: [''],
      phone: [''],
      address: [''],
    }),
    summary: [''],
    educations: this.fb.array([this.createFormation()]),
    experiences: this.fb.array([this.createExperience()]),
    skills: this.fb.array([this.createSkill()]),
    languages: this.fb.array([this.createLanguage()]),
    interests: this.fb.array([this.createInterest()]),
  });

  ngOnInit() {
    this.generateService.getTemplates().subscribe({
      next: (response) => {
        this.templates.set(response);
      },
      error: () => {
        alert('Erreur lors de la récupération des modèles');
      },
    });
  }


  get personalInfoGroup(): FormGroup {
    return this.formulaire.get('personal_info') as FormGroup;
  }

  get educationsArray(): FormArray {
    return this.formulaire.get('educations') as FormArray;
  }

  get experiencesArray(): FormArray {
    return this.formulaire.get('experiences') as FormArray;
  }

  get skillsArray(): FormArray {
    return this.formulaire.get('skills') as FormArray;
  }

  get languagesArray(): FormArray {
    return this.formulaire.get('languages') as FormArray;
  }

  get interestsArray(): FormArray {
    return this.formulaire.get('interests') as FormArray;
  }


  createFormation(): FormGroup {
    return this.fb.group({
      degree: [''],
      school: [''],
      city: [''],
      start_date: [''],
      end_date: [''],
      description: [''],
    });
  }

  createExperience(): FormGroup {
    return this.fb.group({
      company: [''],
      position: [''],
      city: [''],
      start_date: [''],
      end_date: [''],
      description: [''],
    });
  }

  createSkill(): FormGroup {
    return this.fb.group({
      name: [''],
      level: [''],
    });
  }

  createLanguage(): FormGroup {
    return this.fb.group({
      language_name: [''],
      language_level: [''],
    });
  }

  createInterest(): FormGroup {
    return this.fb.group({
      name: [''],
    });
  }

  
  AjouterFormation() {
    this.educationsArray.push(this.createFormation());
  }

  AjouterExperience() {
    this.experiencesArray.push(this.createExperience());
  }

  AjouterSkill() {
    this.skillsArray.push(this.createSkill());
  }

  AjouterLanguage() {
    this.languagesArray.push(this.createLanguage());
  }

  AjouterInterest() {
    this.interestsArray.push(this.createInterest());
  }

  
  SupprimerFormation(index: number) {
    if (this.educationsArray.length > 1) this.educationsArray.removeAt(index);
  }

  SupprimerExperience(index: number) {
    if (this.experiencesArray.length > 1) this.experiencesArray.removeAt(index);
  }

  SupprimerSkill(index: number) {
    if (this.skillsArray.length > 1) this.skillsArray.removeAt(index);
  }

  SupprimerLanguage(index: number) {
    if (this.languagesArray.length > 1) this.languagesArray.removeAt(index);
  }

  SupprimerInterest(index: number) {
    if (this.interestsArray.length > 1) this.interestsArray.removeAt(index);
  }


  
  selectionnerTemplate(id: number) {
    this.templateSelectionne.set(id);
  }
  suivant() {
    if (this.currentStep() < this.derniereEtape) {
      this.currentStep.set(this.currentStep() + 1);
    }
  }

  precedent() {
    if (this.currentStep() > 0) {
      this.currentStep.set(this.currentStep() - 1);
    }
  }

  
  private construirePayload(): (CvPayload & { name: string }) | null {
  const templateId = this.templateSelectionne();
  if (!templateId) {
    alert('Veuillez sélectionner un modèle avant de continuer.');
    return null;
  }

  const { name, ...data } = this.formulaire.getRawValue();

  if (!name) {
    alert('Veuillez donner un nom à votre CV.');
    return null;
  }

  return {
    template_id: templateId,
    name,
    data: data as Cv,
  };
}

  finaliser() {
    const payload = this.construirePayload();
    if (!payload) return;

    this.chargementApercu.set(true);

    this.generateService.previewCv(payload).subscribe({
      next: (html) => {
        this.apercuHtmlRaw.set(html);
        this.apercuHtmlSafe.set(this.sanitizer.bypassSecurityTrustHtml(html));
        this.chargementApercu.set(false);
      },
      error: () => {
        alert('Erreur lors de la création du CV');
        this.chargementApercu.set(false);
      },
    });
  }

  modifier() {
    this.apercuHtmlRaw.set('');
    this.apercuHtmlSafe.set('');
  }

  
  telecharger() {
    const payload = this.construirePayload();
    if (!payload) return;

    this.generateService.downloadCv(payload).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'mon-cv.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => {
        alert('Erreur lors du téléchargement du CV');
      },
    });
  }

  photoApercu = signal<string | null>(null);
  onPhotoSelectionnee(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      this.photoApercu.set(base64);
      this.personalInfoGroup.patchValue({ photo: base64 }); // ✅ string base64, pas le File
    };
    reader.readAsDataURL(file);
  }



  SauvegarderCv(): void {
    this.authService.authState$.pipe(take(1)).subscribe({
      next: (auth) => {
        if (!auth) {
          console.log('Utilisateur non connecté — CV non sauvegardé');
          return;
        }

        const payload = this.construirePayload();
        if (!payload) return;

        this.generateService.saveCv(payload).subscribe({
          next: (response) => console.log(response),
          error: (error) => console.error(error),
        });
      },
    });
  }
}

   
