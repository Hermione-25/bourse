import { Injectable, inject } from '@angular/core';
import { ApiService } from '../core/api/api.service';
import { ApiResponse } from '../shared/models/interfaces/api-response.interface';
import { User, UserDto } from '../shared/models/user.models';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private api = inject(ApiService);

  getAll(): Observable<ApiResponse<User[]>> {
    return this.api.get<ApiResponse<User[]>>('admin/users');
  }

  getById(id: string): Observable<User> {
    return this.api.get<User>(`admin/users/${id}`);
  }

  create(dto: UserDto): Observable<User> {
    return this.api.post<User>('admin/users', dto);
  }

  update(id: string, dto: UserDto): Observable<User> {
    return this.api.put<User>(`admin/users/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.api.delete<void>(`admin/users/${id}`);
  }
}