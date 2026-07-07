import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../../core/api/api.service';
import { ApiResponse } from '../../shared/models/interfaces/api-response.interface';
import { Scholarship, ScholarshipDto } from './scholarships.models';

@Injectable({ providedIn: 'root' })
export class ScholarshipsService {
  private apiService = inject(ApiService);

  getAll(params?: Record<string, string | number | boolean>): Observable<Scholarship[]> {
    return this.apiService
      .get<ApiResponse<Scholarship[]>>('admin/scholarships', params)
      .pipe(map((response) => response.data));
  }

  // Route publique — liste des bourses visibles sans authentification
  getPublic(): Observable<Scholarship[]> {
    return this.apiService
      .get<ApiResponse<Scholarship[]>>('scholarships')
      .pipe(map((response) => response.data));
  }

  // Route publique — détail d'une bourse, accessible sans authentification
getPublicById(id: string): Observable<Scholarship> {
  return this.apiService
    .get<ApiResponse<Scholarship>>(`scholarships/${id}`)
    .pipe(map((response) => response.data));
}
  // Route publique — recherche filtrée (utilisée par la landing page et la liste)
  search(filters: { country?: string; level?: string; domain?: string }): Observable<Scholarship[]> {
    const params: Record<string, string> = {};
    if (filters.country) params['country'] = filters.country;
    if (filters.level) params['level'] = filters.level;
    if (filters.domain) params['domain'] = filters.domain;

    return this.apiService
      .get<ApiResponse<Scholarship[]>>('scholarships/search', params)
      .pipe(map((response) => response.data));
  }

  getById(id: string): Observable<Scholarship> {
    return this.apiService
      .get<ApiResponse<Scholarship>>(`admin/scholarships/${id}`)
      .pipe(map((response) => response.data));
  }

  create(dto: ScholarshipDto): Observable<Scholarship> {
    return this.apiService
      .post<ApiResponse<Scholarship>>('admin/scholarships', dto)
      .pipe(map((response) => response.data));
  }

  delete(id: string): Observable<void> {
    return this.apiService.delete<void>(`admin/scholarships/${id}`);
  }

  update(id: string, dto: ScholarshipDto): Observable<Scholarship> {
    return this.apiService
      .put<ApiResponse<Scholarship>>(`admin/scholarships/${id}`, dto)
      .pipe(map((response) => response.data));
  }
}