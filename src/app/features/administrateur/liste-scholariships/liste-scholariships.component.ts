import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ScholarshipsService } from '../../../features/scholarships/scholarships.service';
import { FundingType, Scholarship, ScholarshipDto } from '../../../features/scholarships/scholarships.models';

@Component({
  selector: 'app-liste-scholariships',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './liste-scholariships.component.html',
  styleUrls: ['./liste-scholariships.component.css'],
})
export class ListeScholarishipsComponent implements OnInit {
  private scholarshipsService = inject(ScholarshipsService);
  private fb = inject(FormBuilder);

  // Expose l'enum au template (utilisé dans le <select> et pour les comparaisons)
  FundingType = FundingType;

  scholarships: Scholarship[] = [];
  loading = false;
  errorMessage: string | null = null;
  searchTerm = '';

  showForm = false;
  editingId: string | null = null;
  submitting = false;
  confirmDeleteId: string | null = null;

  form = this.fb.group({
    title: ['', Validators.required],
    country: ['', Validators.required],
    university: ['', Validators.required],
    domain: ['', Validators.required],
    deadline: ['', Validators.required],
    description: ['', Validators.required],
    funding_type: [FundingType.UNFUNDED, Validators.required],
    link: ['', Validators.required],
    amount: ['', []],
    benefits: [''],
    requirement: [''],
    image: [''],
    region: [''],
    source: [''],
  });

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm = value;
  }

  get filteredScholarships(): Scholarship[] {
    if (!this.searchTerm) return this.scholarships;
    const term = this.searchTerm.toLowerCase();
    return this.scholarships.filter(
      (s) =>
        s.title.toLowerCase().includes(term) ||
        s.university.toLowerCase().includes(term) ||
        s.description.toLowerCase().includes(term) ||
        (s.country && s.country.toLowerCase().includes(term)) ||
        (s.region && s.region.toLowerCase().includes(term)) ||
        (s.domain && s.domain.toLowerCase().includes(term)) ||
        (s.source && s.source.toLowerCase().includes(term))
    );
  }

  ngOnInit(): void {
    this.loadScholarships();
  }

  loadScholarships(): void {
    this.loading = true;
    this.errorMessage = null;
    this.scholarshipsService.getAll().subscribe({
      next: (items) => {
        this.scholarships = items;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err.message || 'Erreur lors du chargement.';
        this.loading = false;
      },
    });
  }

  openCreate(): void {
    this.editingId = null;
    this.errorMessage = null;

    this.form.reset({
      title: '',
      country: '',
      university: '',
      domain: '',
      deadline: '',
      description: '',
      funding_type: FundingType.UNFUNDED,
      link: '',
      amount: '',
      benefits: '',
      requirement: '',
      image: '',
      region: '',
      source: '',
    });

    this.showForm = true;
  }

  openEdit(s: Scholarship): void {
    this.editingId = s.id;
    this.errorMessage = null;

    this.form.patchValue({
      title: s.title ?? '',
      description: s.description ?? '',
      country: s.country ?? '',
      region: s.region ?? '',
      domain: s.domain ?? '',
      funding_type: s.funding_type ?? FundingType.UNFUNDED,
      amount: s.amount != null ? String(s.amount) : '',
      benefits: s.benefits ?? '',
      requirement: s.requirement ?? '',
      image: s.image ?? '',
      link: s.link ?? '',
      source: s.source ?? '',
      university: s.university ?? '',
      deadline: s.deadline
        ? new Date(s.deadline).toISOString().split('T')[0]
        : '',
    });

    this.showForm = true;
  }

  getDaysRemaining(deadline?: string | null): number {
    if (!deadline) return 0;
    const end = new Date(deadline);
    if (isNaN(end.getTime())) return 0;

    const today = new Date();
    const diff = end.getTime() - today.getTime();

    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  closeForm(): void {
    this.showForm = false;
    this.editingId = null;
    this.form.reset();
  }

  submitForm(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.errorMessage = null;

    const dto = this.form.value as ScholarshipDto;

    if (this.editingId) {
      this.scholarshipsService.update(this.editingId, dto).subscribe({
        next: (updated) => {
          this.scholarships = this.scholarships.map((s) =>
            s.id === this.editingId ? updated : s
          );
          this.submitting = false;
          this.closeForm();
        },
        error: (err) => {
          this.errorMessage = err.message || 'Erreur lors de la modification.';
          this.submitting = false;
        },
      });
    } else {
      this.scholarshipsService.create(dto).subscribe({
        next: (created) => {
          this.scholarships = [created, ...this.scholarships];
          this.submitting = false;
          this.closeForm();
        },
        error: (err) => {
          this.errorMessage = err.message || 'Erreur lors de la création.';
          this.submitting = false;
        },
      });
    }
  }

  askDelete(id: string): void {
    this.confirmDeleteId = id;
  }

  cancelDelete(): void {
    this.confirmDeleteId = null;
  }

  confirmDelete(): void {
    if (!this.confirmDeleteId) return;

    const id = this.confirmDeleteId;
    this.confirmDeleteId = null;
    this.errorMessage = null;

    this.scholarshipsService.delete(id).subscribe({
      next: () => {
        this.scholarships = this.scholarships.filter((s) => s.id !== id);
      },
      error: (err) => {
        this.errorMessage = err.message || 'Erreur lors de la suppression.';
      },
    });
  }

  selectedScholarship: Scholarship | null = null;
  showDetails = false;

  openDetails(s: Scholarship): void {
    this.selectedScholarship = s;
    this.showDetails = true;
  }

  closeDetails(): void {
    this.selectedScholarship = null;
    this.showDetails = false;
  }

  get fundingLabel(): string {
    switch (this.selectedScholarship?.funding_type) {
      case FundingType.FULL:
        return 'Entièrement financée';
      case FundingType.PARTIAL:
        return 'Partiellement financée';
      case FundingType.UNFUNDED:
        return 'Non financée';
      default:
        return 'Non précisé';
    }
  }
}