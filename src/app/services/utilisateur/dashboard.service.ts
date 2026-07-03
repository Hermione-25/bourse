import { inject, Injectable } from '@angular/core';
import { catchError, forkJoin, map, Observable, of } from 'rxjs';
import { ProfileService } from './profil.service';
import { FavorisService } from './favoris.service';
import { ApiService } from '../../core/api/api.service';
import { DashboardResume } from '../../shared/models/dashboard.models';
import { RecommandationService } from './recommandation.service';
import { calculerCompletionProfil } from '../../shared/utils/profil-user-utils';


@Injectable({ providedIn: 'root' })
export class DashboardService {
  private profileService = inject(ProfileService);
  private favorisService = inject(FavorisService);
  private recommandationService = inject(RecommandationService);
  private apiService = inject(ApiService);

  private getNombreNouvellesBourses(): Observable<number> {

    return this.apiService.get<{ count: number }>('scholarships/recent/count')
      .pipe(map(res => res.count));
  }

  getResume(): Observable<DashboardResume> {
    return forkJoin({
      profile: this.profileService.getProfile().pipe(catchError(() => of(null))),
      favoris: this.favorisService.getFavoris().pipe(catchError(() => of([]))),
      recommandations: this.recommandationService.getRecommandations().pipe(catchError(() => of([]))),
      nombreNouvellesBourses: this.getNombreNouvellesBourses().pipe(catchError(() => of(0)))
    }).pipe(
      map(({ profile, favoris, recommandations, nombreNouvellesBourses }) => ({
        pourcentageProfil: calculerCompletionProfil(profile),
        nombreFavoris: favoris.length,
        nombreRecommandations: recommandations.length,
        nombreNouvellesBourses
      }))
    );
  }
}