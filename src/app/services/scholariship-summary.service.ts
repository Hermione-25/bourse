import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../main';


@Injectable({ providedIn: 'root' })
export class ScholarshipSummaryService {
  summary = signal<string | null>(null);
  isLoading = signal(false);

  constructor(private http: HttpClient) {}

  genererResume(scholarshipId: string) {
    this.isLoading.set(true);
    this.summary.set(null);

    this.http.post<{ summary: string }>(
      `${environment.apiUrl}/scholarships/${scholarshipId}/summary`, {}
    ).subscribe({
      next: (res) => {
        this.summary.set(res.summary);
        this.isLoading.set(false);
      },
      error: () => {
        this.summary.set("Résumé indisponible pour le moment.");
        this.isLoading.set(false);
      }
    });
  }
}