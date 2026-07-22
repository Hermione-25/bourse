import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap, throwError, catchError, of } from 'rxjs';
import { ApiService } from '../api/api.service';
import { TokenService } from './token.service';
import { AuthToken, LoginDto, RefreshTokenResponse, RegisterDto, ForgotPasswordDto } from './auth.models';
import { User } from '../../shared/models/user.models';
import { ApiResponse } from '../../shared/models/interfaces/api-response.interface';


@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiService = inject(ApiService);
  private tokenService = inject(TokenService);
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  readonly authState$ = this.currentUserSubject.asObservable();
  readonly isAuthenticated$ = this.authState$.pipe(map(Boolean));


  initAuth(): Observable<ApiResponse<User> | null> {
    const token = this.tokenService.getAccessToken();

    if (!token) {
      console.log('[AuthService] initAuth: aucun token trouvé, utilisateur non connecté.');
      this.currentUserSubject.next(null);
      return of(null);
    }

    console.log('[AuthService] initAuth: token trouvé, vérification avec le serveur...');

    return this.apiService.get<ApiResponse<User>>('me').pipe(
      tap((res) => {
        const user = res?.data ?? null;
        console.log('[AuthService] initAuth: utilisateur restauré →', user);
        this.currentUserSubject.next(user);
      }),
      catchError((err) => {
        const status = err?.status;
        console.warn('[AuthService] initAuth: erreur lors de la vérification →', err);
        if (status === 401) {
          this.logout();
        } else {
          this.currentUserSubject.next(null);
        }
        return of(null);
      })
    );
  }


  login(dto: LoginDto): Observable<AuthToken> {
    return this.apiService.post<AuthToken>('login', dto).pipe(
      tap((res) => {
        this.tokenService.setAccessToken(res.data.token);
        this.currentUserSubject.next(res.data.user);
      })
    );
  }

loginWithGoogle(idToken: string) {
  return this.apiService.post<AuthToken>('auth/login', { id_token: idToken })
    .pipe(    
      tap(res => {
        this.tokenService.setAccessToken(res.data.token);
        this.currentUserSubject.next(res.data.user);
      })  
    );
}
  
  register(dto: RegisterDto): Observable<AuthToken> {
    return this.apiService.post<AuthToken>('register', dto).pipe(
      tap((res) => {
        this.tokenService.setAccessToken(res.data.token);
        
        this.currentUserSubject.next(res.data.user);
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
