import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../../core/api/api.service';
import { ApiResponse } from '../../shared/models/interfaces/api-response.interface';
import { Scholarship } from '../../features/scholarships/scholarships.models';

interface Favorite {
  id: number;
  user_id: number;
  scholarship_id: string;
  scholarship: Scholarship;
}
@Injectable({ providedIn: 'root' })
export class FavorisService {

  private apiService = inject(ApiService);

  getFavoris(): Observable<Scholarship[]> {
    return this.apiService
      .get<ApiResponse<Favorite[]>>('user/favorites')
      .pipe(map((response) => response.data.map(f => f.scholarship).filter((s: Scholarship | null) => s !== null)));
  }

  ajouterFavori(scholarshipId: string): Observable<void> {
    return this.apiService.post<void>(`user/favorites/${scholarshipId}`, {});
  }

  retirerFavori(scholarshipId: string): Observable<void> {
    return this.apiService.post<void>(`user/favorites/${scholarshipId}`, {});
  }
}