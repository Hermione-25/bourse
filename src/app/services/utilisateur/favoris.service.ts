import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../../core/api/api.service';
import { ApiResponse } from '../../shared/models/interfaces/api-response.interface';
import { Scholarship } from '../../features/scholarships/scholarships.models';

@Injectable({ providedIn: 'root' })
export class FavorisService {
  private apiService = inject(ApiService);

  getFavoris(): Observable<Scholarship[]> {
    return this.apiService
      .get<ApiResponse<Scholarship[]>>('user/favorites')
      .pipe(map((response) => response.data));
  }

  ajouterFavori(scholarshipId: string): Observable<void> {
    return this.apiService.post<void>(`user/favorites/${scholarshipId}`, {});
  }

  retirerFavori(scholarshipId: string): Observable<void> {
    // Le backend n'expose qu'un endpoint toggle : un même POST ajoute ou retire
    // selon l'état actuel côté serveur. L'UI gère déjà l'état optimiste avant l'appel.
    return this.apiService.post<void>(`user/favorites/${scholarshipId}`, {});
  }
}