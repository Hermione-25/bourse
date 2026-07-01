import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EtudiantProfile } from '../../shared/models/profil-user.models';
import { User } from '../../shared/models/user.models'; 
import { ApiService } from '../../core/api/api.service';
@Injectable({ providedIn: 'root' })
export class ProfileService {
  private apiService = inject(ApiService);
  updateUtilisateur(dto: Partial<Pick<User, 'first_name' | 'last_name' | 'country' | 'email'>>): Observable<User> {
    return this.apiService.put<User>('me', dto);
  }
  getProfile(): Observable<EtudiantProfile> {
    return this.apiService.get<EtudiantProfile>('user/profile');
  }

  updateProfile(profile: EtudiantProfile): Observable<EtudiantProfile> {
    return this.apiService.put<EtudiantProfile>('user/profile', profile);
  }
}