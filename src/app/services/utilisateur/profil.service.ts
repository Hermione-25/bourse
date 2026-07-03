import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EtudiantProfile } from '../../shared/models/profil-user.models';
import { User } from '../../shared/models/user.models';
import { ApiResponse } from '../../shared/models/interfaces/api-response.interface';
import { ApiService } from '../../core/api/api.service';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private apiService = inject(ApiService);

  updateUtilisateur(dto: Partial<Pick<User, 'first_name' | 'last_name' | 'country' | 'email'>>): Observable<User> {
    return this.apiService
      .put<ApiResponse<User>>('user/profile', dto)
      .pipe(map(res => res.data));
  }

  getProfile(): Observable<EtudiantProfile> {
    return this.apiService
      .get<ApiResponse<EtudiantProfile>>('user/profile')
      .pipe(map(res => res.data));
  }

  updateProfile(profile: EtudiantProfile): Observable<EtudiantProfile> {
    return this.apiService
      .put<ApiResponse<EtudiantProfile>>('user/profile/recommendation', profile)
      .pipe(map(res => res.data));
  }
}