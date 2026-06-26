import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from './api.config';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private config = inject(API_CONFIG);

  private createUrl(path: string): string {
    return `${this.config.baseUrl}/${path}`.replace(/([^:]\/\/)\//g, '$1');
  }

  get<T>(path: string, params?: Record<string, string | number | boolean>): Observable<T> {
    // ✅ Construction conditionnelle — évite le cast unsafe vers Record<string, string>
    const httpParams = params
      ? new HttpParams({ fromObject: params as Record<string, string | number | boolean> })
      : undefined;
    return this.http.get<T>(this.createUrl(path), { params: httpParams });
  }

  post<T>(path: string, body: unknown): Observable<T> {
    return this.http.post<T>(this.createUrl(path), body);
  }

  put<T>(path: string, body: unknown): Observable<T> {
    return this.http.put<T>(this.createUrl(path), body);
  }

  patch<T>(path: string, body: unknown): Observable<T> {
    return this.http.patch<T>(this.createUrl(path), body);
  }

  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(this.createUrl(path));
  }
}
