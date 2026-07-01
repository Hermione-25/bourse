import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Scholarship } from '../../scholarships/scholarships.models';
import { FavorisService } from '../../../services/utilisateur/favoris.service';
import { ScholarshipCard } from '../../../shared/components/card/card.component';


@Component({
  selector: 'app-favoris',
  standalone: true,
  imports: [CommonModule, ScholarshipCard],
  templateUrl: './favoris.component.html'
})
export class FavorisComponent implements OnInit {
  private favorisService = inject(FavorisService);

  favoris = signal<Scholarship[]>([]);
  chargement = signal(true);

  ngOnInit(): void {
    this.favorisService.getFavoris().subscribe({
      next: (liste) => {
        this.favoris.set(liste);
        this.chargement.set(false);
      },
      error: () => this.chargement.set(false)
    });
  }

  onToggleFavori(scholarshipId: string): void {

    this.favorisService.retirerFavori(scholarshipId).subscribe({
      next: () => {
        this.favoris.update(liste => liste.filter(s => s.id !== scholarshipId));
      }
    });
  }
}