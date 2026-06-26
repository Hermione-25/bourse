import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../../core/api/api.service';
import { ApiResponse } from '../../shared/models/interfaces/api-response.interface';
import { Scholarship, ScholarshipDto } from './scholarships.models';

@Injectable({ providedIn: 'root' })
export class ScholarshipsService {
  private apiService = inject(ApiService);

  /**
   * ✅ Unwrap de l'enveloppe Laravel ApiResource { data: [...] }
   * Si votre API retourne directement un tableau (sans enveloppe), remplacez par :
   *   return this.apiService.get<Scholarship[]>('scholarships', params);
   */
  getAll(params?: Record<string, string | number | boolean>): Observable<Scholarship[]> {
    return this.apiService
      .get<ApiResponse<Scholarship[]>>('scholarships', params)
      .pipe(map((response) => response.data));
  }

  getById(id: string): Observable<Scholarship> {
    return this.apiService
      .get<ApiResponse<Scholarship>>(`scholarships/${id}`)
      .pipe(map((response) => response.data));
  }

  create(dto: ScholarshipDto): Observable<Scholarship> {
    return this.apiService
      .post<ApiResponse<Scholarship>>('scholarships', dto)
      .pipe(map((response) => response.data));
  }
}
