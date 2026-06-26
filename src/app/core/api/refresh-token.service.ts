import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, catchError, filter, Observable, switchMap, take, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class RefreshTokenService {
  private authService = inject(AuthService);
  private isRefreshing = false;
  // ✅ BehaviorSubject<string | null> — null = aucun refresh en cours
  private refreshSubject = new BehaviorSubject<string | null>(null);

  requestRefreshToken(): Observable<string> {
    if (this.isRefreshing) {
      // ✅ D'autres requêtes attendent — elles se débloqueront dès que
      // refreshSubject émettra le nouveau token (filter garantit string, pas null)
      return this.refreshSubject.pipe(
        filter((token): token is string => token !== null),
        take(1)
      );
    }

    this.isRefreshing = true;
    // ✅ Reset avant de démarrer le refresh — évite que le filter ci-dessus
    // ne se déclenche immédiatement avec l'ancien token du cycle précédent
    this.refreshSubject.next(null);

    return this.authService.refreshToken().pipe(
      switchMap((token) => {
        this.isRefreshing = false;
        this.refreshSubject.next(token);
        // ✅ filter + take(1) au lieu du cast — type-safe sans as
        return this.refreshSubject.pipe(
          filter((t): t is string => t !== null),
          take(1)
        );
      }),
      catchError((error) => {
        this.isRefreshing = false;
        // ✅ Reset également sur erreur pour le prochain cycle
        this.refreshSubject.next(null);
        return throwError(() => error);
      })
    );
  }
}
