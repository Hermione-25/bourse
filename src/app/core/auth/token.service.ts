import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TokenService {
  private accessKey = environment.tokenStorageKey;
  private refreshKey = environment.refreshTokenStorageKey;

  getAccessToken(): string | null {
    return localStorage.getItem(this.accessKey);
  }

  setAccessToken(token: string): void {
    localStorage.setItem(this.accessKey, token);
  }

  removeAccessToken(): void {
    localStorage.removeItem(this.accessKey);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshKey);
  }

  setRefreshToken(token: string): void {
    localStorage.setItem(this.refreshKey, token);
  }

  removeRefreshToken(): void {
    localStorage.removeItem(this.refreshKey);
  }

  clearTokens(): void {
    this.removeAccessToken();
    this.removeRefreshToken();
  }
}
