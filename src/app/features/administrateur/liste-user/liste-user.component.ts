import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';

import { ApiService } from '../../../core/api/api.service';
import { ApiResponse } from '../../../shared/models/interfaces/api-response.interface';
import { User, UserDto } from '../../../shared/models/user.models';

@Component({
  selector: 'app-liste-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './liste-user.component.html',
  styleUrls: ['./liste-user.component.css'],
})
export class ListeUserComponent implements OnInit {
  private apiService = inject(ApiService);
  private fb = inject(FormBuilder);

  users = signal<User[]>([]);
  loading = signal(false);
  errorMessage = signal<string | null>(null);

  searchTerm = signal('');

  confirmDeleteId = signal<number | null>(null);

  showForm = signal(false);
  editingId = signal<number | null>(null);
  submitting = signal(false);

  selectedUser = signal<User | null>(null);
  showDetails = signal(false);

  // Pagination
  itemsPerPage = 10;
  currentPage = signal(1);

  form = this.fb.group({
    first_name: [''],
    last_name: [''],
    email: [''],
    country: [''],
    password: [''],
    role: [''],
  });

  // ==========================
  // Recherche
  // ==========================
  filteredUsers = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();

    if (!term) {
      return this.users();
    }

    const fields: (keyof User)[] = [
      'first_name',
      'last_name',
      'email',
      'country',
    ];

    return this.users().filter((user) =>
      fields.some((field) =>
        String(user[field] ?? '')
          .toLowerCase()
          .includes(term)
      )
    );
  });

  // ==========================
  // Pagination
  // ==========================
  totalPages = computed(() =>
    Math.max(
      1,
      Math.ceil(this.filteredUsers().length / this.itemsPerPage)
    )
  );

  paginatedUsers = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage;

    return this.filteredUsers().slice(
      start,
      start + this.itemsPerPage
    );
  });

  pageNumbers = computed(() =>
    Array.from(
      { length: this.totalPages() },
      (_, i) => i + 1
    )
  );

  ngOnInit(): void {
    this.loadUsers();
  }

  // ==========================
  // Recherche
  // ==========================
  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;

    this.searchTerm.set(value);
    this.currentPage.set(1);
  }

  // ==========================
  // Pagination
  // ==========================
  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) return;

    this.currentPage.set(page);
  }

  nextPage(): void {
    this.goToPage(this.currentPage() + 1);
  }

  prevPage(): void {
    this.goToPage(this.currentPage() - 1);
  }

  // ==========================
  // Chargement
  // ==========================
  loadUsers(): void {
    this.loading.set(true);

    this.apiService
      .get<ApiResponse<User[]>>('admin/users')
      .subscribe({
        next: (res) => {
          this.users.set(Array.isArray(res.data) ? res.data : []);
          this.loading.set(false);
        },
        error: (err) => {
          this.errorMessage.set(err.message);
          this.loading.set(false);
        },
      });
  }

  // ==========================
  // Création
  // ==========================
  OpenCreate(): void {
    this.showForm.set(true);
    this.editingId.set(null);
    this.form.reset();
  }

  // ==========================
  // Edition
  // ==========================
  editUser(id: number): void {
    const user = this.users().find((u) => u.id === id);

    if (!user) return;

    this.editingId.set(id);
    this.showForm.set(true);

    this.form.patchValue({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      country: user.country,
      password: '',
      role: user.role,
    });
  }

  closeEdit(): void {
    this.showForm.set(false);
    this.editingId.set(null);
    this.form.reset();
  }

  // ==========================
  // Création / Modification
  // ==========================
  submitForm(): void {
    if (this.form.invalid) return;

    this.submitting.set(true);

    const dto = this.form.getRawValue() as UserDto;
    const id = this.editingId();

    if (id) {
      this.apiService
        .put<User>(`admin/users/${id}`, dto)
        .subscribe({
          next: (updatedUser) => {
            this.users.update((list) =>
              list.map((u) => (u.id === id ? updatedUser : u))
            );

            this.submitting.set(false);
            this.closeEdit();
          },
          error: (err) => {
            this.submitting.set(false);
            this.errorMessage.set(
              err.message || 'Erreur lors de la modification.'
            );
          },
        });
    } else {
      this.apiService
        .post<User>('admin/users', dto)
        .subscribe({
          next: (newUser) => {
            this.users.update((list) => [...list, newUser]);

            this.submitting.set(false);
            this.closeEdit();
          },
          error: (err) => {
            this.submitting.set(false);
            this.errorMessage.set(
              err.message || 'Erreur lors de la création.'
            );
          },
        });
    }
  }

  // ==========================
  // Détails
  // ==========================
  detailUser(id: number): void {
    const user = this.users().find((u) => u.id === id) ?? null;

    this.selectedUser.set(user);
    this.showDetails.set(true);
  }

  closeDetails(): void {
    this.selectedUser.set(null);
    this.showDetails.set(false);
  }

  // ==========================
  // Suppression
  // ==========================
  askDelete(id: number): void {
    this.confirmDeleteId.set(id);
  }

  cancelDelete(): void {
    this.confirmDeleteId.set(null);
  }

  confirmDelete(): void {
    const id = this.confirmDeleteId();

    if (!id) return;

    this.confirmDeleteId.set(null);

    this.apiService
      .delete<void>(`admin/users/${id}`)
      .subscribe({
        next: () => {
          this.users.update((list) =>
            list.filter((u) => u.id !== id)
          );
        },
        error: (err) => {
          this.errorMessage.set(
            err.message || 'Erreur lors de la suppression.'
          );
        },
      });
  }
}