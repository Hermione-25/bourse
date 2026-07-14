import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PaysApi } from '../../shared/models/pays.models';
import { ApiResponse } from '../../shared';

@Injectable({
  providedIn: 'root',
})
export class PaysService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/scholarships/countries`;


  getCounts(): Observable<PaysApi[]> {
    return this.http
      .get<ApiResponse<PaysApi[]>>(this.apiUrl)
      .pipe(map((res) => res.data));
  }
}