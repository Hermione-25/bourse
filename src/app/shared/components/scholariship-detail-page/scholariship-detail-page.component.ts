import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ScholarshipsService } from '../../../features/scholarships/scholarships.service';
import { FundingType, Scholarship } from '../../../features/scholarships/scholarships.models';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-scholarship-detail',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './scholariship-detail-page.component.html',
})
export class ScholarshipDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private scholarshipsService = inject(ScholarshipsService);

  FundingType = FundingType;

  scholarship = signal<Scholarship | null>(null);
  chargement = signal(true);
  erreur = signal<string | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.erreur.set('Bourse introuvable.');
      this.chargement.set(false);
      return;
    }

    this.scholarshipsService.getPublicById(id).subscribe({
      next: (data) => {
        this.scholarship.set(data);
        this.chargement.set(false);
      },
      error: () => {
        this.erreur.set('Impossible de charger cette bourse. Réessaie plus tard.');
        this.chargement.set(false);
      },
    });
  }

  onRetour(): void {
    this.router.navigate(['/scholarships']);
  }

  onPostuler(): void {
    const lien = this.scholarship()?.link;
    if (lien) {
      window.open(lien, '_blank', 'noopener,noreferrer');
    }
  }
}