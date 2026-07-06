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
     
    if (token) {

      this.apiService.get<AuthToken>('me').subscribe({
        next: (user) => this.currentUserSubject.next(user),
        error: () => this.logout(),
      });
    }
  }

login(dto: LoginDto): Observable<AuthToken> {
  return this.apiService.post<AuthToken>('login', dto).pipe(
    tap((res) => {
      this.tokenService.setAccessToken(res.data.token);
      this.currentUserSubject.next(res);
    })
  );
}

  register(dto: RegisterDto): Observable<AuthToken> {
    return this.apiService.post<AuthToken>('register', dto).pipe(
      tap((res) => {
        this.tokenService.setAccessToken(res.data.token);
        
        this.currentUserSubject.next(res);
      })
    );
  }

  forgotPassword(dto: ForgotPasswordDto): Observable<void> {
    return this.apiService.post<void>('forgot-password', dto);
  }

  resetPassword(email: string, token: string, password: string, passwordConfirmation: string): Observable<void> {
    return this.apiService.post<void>('reset-password', {
      email,
      token,
      password,
      password_confirmation: passwordConfirmation,
    });
  }

  logout(): void {
    this.tokenService.clearTokens();
    this.currentUserSubject.next(null);
  }

  refreshToken(): Observable<string> {
    const refreshToken = this.tokenService.getRefreshToken();
    if (!refreshToken) {
      
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
