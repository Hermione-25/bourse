import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/api/api.service';
import { ApiResponse } from '../../../shared/models/interfaces/api-response.interface';
import { User, UserDto } from '../../../features/users/user.models';
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

  users: User[] = [];
  loading = false;
  errorMessage: string | null = null;
  searchTerm = '';

  confirmDeleteId: number | null = null;

  showForm = false;
  editingId: number | null = null;
  submitting = false;

  selectedUser: User | null = null;
  showDetails = false;

  form = this.fb.group({
    first_name: [''],
    last_name: [''],
    email: [''],
    country: [''],
    role: [''],
  });

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm = value;
  }

  get filteredUsers(): User[] {
    if (!this.searchTerm) return this.users;

    const term = this.searchTerm.toLowerCase();

    return this.users.filter((u) =>
      u.first_name.toLowerCase().includes(term) ||
      u.last_name.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      (u.country ?? '').toLowerCase().includes(term)
    );
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;

    this.apiService.get<ApiResponse<User[]>>('users').subscribe({
      next: (res) => {
        this.users = res.data;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.loading = false;
      }
    });
  }

  OpenCreate(): void {
    this.showForm = true;
    this.editingId = null;
    this.form.reset();
  }

  editUser(id: number): void {
    this.editingId = id;
    this.showForm = true;

    const user = this.users.find((u) => u.id === id);

    this.form.patchValue({
      first_name: user?.first_name ?? '',
      last_name: user?.last_name ?? '',
      email: user?.email ?? '',
      country: user?.country ?? '',
      role: user?.role ?? '',
    });
  }

  closeEdit(): void {
    this.showForm = false;
    this.editingId = null;
    this.form.reset();
  }

  submitForm(): void {
    if (this.form.invalid) return;

    const dto: UserDto = this.form.value as UserDto;

    if (this.editingId) {
      this.apiService.put<User>(`users/${this.editingId}`, dto).subscribe({
        next: (updatedUser) => {
          const index = this.users.findIndex((u) => u.id === this.editingId);
          if (index !== -1) this.users[index] = updatedUser;
          this.closeEdit();
        },
        error: (err) => {
          this.errorMessage = err.message || 'Erreur update utilisateur';
        },
      });

    } else {
      this.apiService.post<User>('users', dto).subscribe({
        next: (newUser) => {
          this.users.push(newUser);
          this.closeEdit();
        },
        error: (err) => {
          this.errorMessage = err.message || 'Erreur création utilisateur';
        },
      });
    }
  }

  detailUser(id: number): void {
    this.selectedUser = this.users.find((u) => u.id === id) ?? null;
    this.showDetails = true;
  }

  closeDetails(): void {
    this.selectedUser = null;
    this.showDetails = false;
  }

  askDelete(id: number): void {
    this.confirmDeleteId = id;
  }

  cancelDelete(): void {
    this.confirmDeleteId = null;
  }

  confirmDelete(): void {
    if (!this.confirmDeleteId) return;

    const id = this.confirmDeleteId;
    this.confirmDeleteId = null;

    this.apiService.delete<void>(`users/${id}`).subscribe({
      next: () => {
        this.users = this.users.filter((u) => u.id !== id);
      },
      error: (err) => {
        this.errorMessage = err.message || 'Erreur suppression';
      },
    });
  }
}