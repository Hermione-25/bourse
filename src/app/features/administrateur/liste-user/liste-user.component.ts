import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/api/api.service';
import { ApiResponse } from '../../../shared/models/interfaces/api-response.interface';
import { User, UserDto } from '../../../shared/models/user.models';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

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

  form = this.fb.group({
    first_name: [''],
    last_name: [''],
    email: [''],
    country: [''],
    password: [''],
    role: [''],
  });

  filteredUsers = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const list = this.users();

    if (!term) return list;

    return list.filter((u) =>
      (u.first_name || '').toLowerCase().includes(term) ||
      (u.last_name || '').toLowerCase().includes(term) ||
      (u.email || '').toLowerCase().includes(term) ||
      (u.country || '').toLowerCase().includes(term)
    );
  });

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading.set(true);

    this.apiService.get<ApiResponse<User[]>>('admin/users').subscribe({
      next: (res) => {
        this.users.set(Array.isArray(res.data) ? res.data : []);
        this.loading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err.message);
        this.loading.set(false);
      }
    });
  }

  OpenCreate(): void {
    this.showForm.set(true);
    this.editingId.set(null);
    this.form.reset();
  }

  editUser(id: number): void {
    this.editingId.set(id);
    this.showForm.set(true);

    const user = this.users().find((u) => u.id === id);

    this.form.patchValue({
      first_name: user?.first_name ?? '',
      last_name: user?.last_name ?? '',
      email: user?.email ?? '',
      country: user?.country ?? '',
      password: '',
      role: user?.role ?? '',
    });
  }

  closeEdit(): void {
    this.showForm.set(false);
    this.editingId.set(null);
    this.form.reset();
  }

  submitForm(): void {
    if (this.form.invalid) return;

    const dto: UserDto = this.form.value as UserDto;
    const editingId = this.editingId();

    if (editingId) {
      this.apiService.put<User>(`admin/users/${editingId}`, dto).subscribe({
        next: (updatedUser) => {
          this.users.update((list) => {
            const index = list.findIndex((u) => u.id === editingId);
            if (index === -1) return list;
            const copy = [...list];
            copy[index] = updatedUser;
            return copy;
          });
          this.closeEdit();
        },
        error: (err) => {
          this.errorMessage.set(err.message || 'Erreur update utilisateur');
        },
      });

    } else {
      this.apiService.post<User>('admin/users', dto).subscribe({
        next: (newUser) => {
          this.users.update((list) => [...list, newUser]);
          this.closeEdit();
        },
        error: (err) => {
          this.errorMessage.set(err.message || 'Erreur création utilisateur');
        },
      });
    }
  }

  detailUser(id: number): void {
    this.selectedUser.set(this.users().find((u) => u.id === id) ?? null);
    this.showDetails.set(true);
  }

  closeDetails(): void {
    this.selectedUser.set(null);
    this.showDetails.set(false);
  }

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

    this.apiService.delete<void>(`admin/users/${id}`).subscribe({
      next: () => {
        this.users.update((list) => list.filter((u) => u.id !== id));
      },
      error: (err) => {
        this.errorMessage.set(err.message || 'Erreur suppression');
      },
    });
  }
}