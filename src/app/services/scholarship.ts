import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ScholarshipDto } from '../features/scholarships/scholarships.models';
@Injectable({
  providedIn: 'root'
})
export class ScholarshipService {

  private apiUrl = 'https://next-cnb4.onrender.com';

  constructor(private http: HttpClient) {}

  getAllScholarships(): Observable<ScholarshipDto[]> {
    return this.http.get<ScholarshipDto[]>(`${this.apiUrl}/scholarships`);
  }

  getScholarshipById(id: number): Observable<ScholarshipDto> {
    return this.http.get<ScholarshipDto>(`${this.apiUrl}/scholarships/${id}`);
  }

  searchScholarships(country: string): Observable<ScholarshipDto[]> {
    return this.http.get<ScholarshipDto[]>(`${this.apiUrl}/scholarships/search?country=${country}`);
  }
}