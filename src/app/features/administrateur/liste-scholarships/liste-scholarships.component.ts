import { Component, OnInit, inject, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ScholarshipsService } from '../../../features/scholarships/scholarships.service';
import { FundingType, Scholarship, ScholarshipDto } from '../../../features/scholarships/scholarships.models';

@Component({
  selector: 'app-liste-scholarships',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './liste-scholarships.component.html',
  styleUrl: './liste-scholarships.component.css',
})
export class ListeScholarshipsComponent implements OnInit {
  private scholarshipsService = inject(ScholarshipsService);
  private fb = inject(FormBuilder);


  FundingType = FundingType;

  scholarships: Scholarship[] = [];
  loading = signal(false);
  errorMessage: string | null = null;
  searchTerm = '';

  showForm = false;
  editingId: string | null = null;
  submitting = false;
  confirmDeleteId: string | null = null;

  // --- Pagination ---
  itemsPerPage = 10;
  currentPage = signal(1);

  form = this.fb.group({
    title: ['', Validators.required],
    country: ['', Validators.required],
    university: ['', Validators.required],
    domain: ['', Validators.required],
    deadline: ['', Validators.required],
    description: ['', Validators.required],
    details: ['', Validators.required],
    funding_type: [FundingType.UNFUNDED, Validators.required],
    link: ['', Validators.required],
    apply_link: ['', Validators.required],
    official_website: ['', Validators.required],
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
    this.currentPage.set(1); // on revient à la page 1 à chaque nouvelle recherche
  }

  get filteredScholarships(): Scholarship[] {
    if (!this.searchTerm) return this.scholarships;
    const term = this.searchTerm.toLowerCase();
    const fields: (keyof Scholarship)[] = ['title', 'university', 'description', 'country', 'domain', 'source'];

    return this.scholarships.filter((s) =>
      fields.some((field) => (s[field] as string)?.toLowerCase().includes(term))
    );
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredScholarships.length / this.itemsPerPage));
  }

  get paginatedScholarships(): Scholarship[] {
    const start = (this.currentPage() - 1) * this.itemsPerPage;
    return this.filteredScholarships.slice(start, start + this.itemsPerPage);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage.set(page);
  }

  nextPage(): void {
    this.goToPage(this.currentPage() + 1);
  }

  prevPage(): void {
    this.goToPage(this.currentPage() - 1);
  }
  // --- Fin pagination ---

  ngOnInit(): void {
    this.loadScholarships();
  }

  loadScholarships(): void {
    this.loading.set(true);
    this.errorMessage = null;
    this.scholarshipsService.getAll().subscribe({
      next: (res) => {
        this.scholarships = (res ?? []) as Scholarship[];
        this.loading.set(false);
      },
      error: (err) => {
        this.errorMessage = err.message || 'Erreur lors du chargement.';
        this.loading.set(false);
      }
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
      details: '',
      funding_type: FundingType.UNFUNDED,
      link: '',
      apply_link: '',
      official_website: '',
      amount: '',
      benefits: '',
      requirement: '',
      image: '',
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
      details: s.details ?? '',
      country: s.country ?? '',
      domain: s.domain ?? '',
      funding_type: s.funding_type ?? FundingType.UNFUNDED,
      benefits: s.benefits ?? '',
      requirement: s.requirement ?? '',
      image: s.image ?? '',
      link: s.link ?? '',
      apply_link: s.apply_link ?? '',
      official_website: s.official_website ?? '',
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