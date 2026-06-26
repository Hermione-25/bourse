import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap, throwError } from 'rxjs';
import { ApiService } from '../api/api.service';
import { TokenService } from './token.service';
import { AuthToken, LoginDto, RefreshTokenResponse, RegisterDto, ForgotPasswordDto } from './auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiService = inject(ApiService);
  private tokenService = inject(TokenService);
  private currentUserSubject = new BehaviorSubject<AuthToken | null>(null);

  readonly authState$ = this.currentUserSubject.asObservable();
  readonly isAuthenticated$ = this.authState$.pipe(map(Boolean));

  constructor() {
    const token = this.tokenService.getAccessToken();
    const refreshToken = this.tokenService.getRefreshToken();

    if (token) {
      this.currentUserSubject.next({
        accessToken: token,
        refreshToken: refreshToken ?? undefined,
      });
    }
  }

  login(dto: LoginDto): Observable<AuthToken> {
    return this.apiService.post<AuthToken>('login', dto).pipe(
      tap((token) => {
        this.tokenService.setAccessToken(token.accessToken);
        if (token.refreshToken) {
          this.tokenService.setRefreshToken(token.refreshToken);
        }
        this.currentUserSubject.next(token);
      })
    );
  }

  register(dto: RegisterDto): Observable<AuthToken> {
    return this.apiService.post<AuthToken>('register', dto).pipe(
      tap((token) => {
        this.tokenService.setAccessToken(token.accessToken);
        if (token.refreshToken) {
          this.tokenService.setRefreshToken(token.refreshToken);
        }
        this.currentUserSubject.next(token);
      })
    );
  }

  forgotPassword(dto: ForgotPasswordDto): Observable<void> {
    return this.apiService.post<void>('forgot-password', dto);
  }

  logout(): void {
    this.tokenService.clearTokens();
    this.currentUserSubject.next(null);
  }

  refreshToken(): Observable<string> {
    const refreshToken = this.tokenService.getRefreshToken();
    if (!refreshToken) {
      // ✅ throwError() au lieu de throw — reste dans le pipeline RxJS et
      // peut être capturé par catchError dans RefreshTokenService
      return throwError(() => new Error('Refresh token not found'));
    }
    return this.apiService.post<RefreshTokenResponse>('refresh', { refreshToken }).pipe(
      tap((response) => {
        this.tokenService.setAccessToken(response.accessToken);
        if (response.refreshToken) {
          this.tokenService.setRefreshToken(response.refreshToken);
        }
      }),
      map((response) => response.accessToken)
    );
  }
}
