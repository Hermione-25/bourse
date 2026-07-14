import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, catchError, filter, Observable, switchMap, take, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class RefreshTokenService {
  private authService = inject(AuthService);
  private isRefreshing = false;
  private refreshSubject = new BehaviorSubject<string | null>(null);

  requestRefreshToken(): Observable<string> {
    if (this.isRefreshing) {

      return this.refreshSubject.pipe(
        filter((token): token is string => token !== null),
        take(1)
      );
    }

    this.isRefreshing = true;

    this.refreshSubject.next(null);

    return this.authService.refreshToken().pipe(
      switchMap((token) => {
        this.isRefreshing = false;
        this.refreshSubject.next(token);
        
        return this.refreshSubject.pipe(
          filter((t): t is string => t !== null),
          take(1)
        );
      }),
      catchError((error) => {
        this.isRefreshing = false;
        this.refreshSubject.next(null);
        return throwError(() => error);
      })
    );
  }
}
