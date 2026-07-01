import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/api/api.service'; 
import { Scholarship } from '../../features/scholarships/scholarships.models';


@Injectable({ providedIn: 'root' })
export class FavorisService {
  private apiService = inject(ApiService);

  getFavoris(): Observable<Scholarship[]> {
    return this.apiService.get<Scholarship[]>('favorites');
  }

  ajouterFavori(scholarshipId: string): Observable<void> {
    return this.apiService.post<void>(`favorites/${scholarshipId}`, {});
  }

  retirerFavori(scholarshipId: string): Observable<void> {
    return this.apiService.delete<void>(`favorites/${scholarshipId}`);
  }
}