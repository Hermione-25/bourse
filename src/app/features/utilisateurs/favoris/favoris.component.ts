import { Component, inject, OnInit, signal } from '@angular/core';
import { Scholarship } from '../../scholarships/scholarships.models';
import { FavorisService } from '../../../services/utilisateur/favoris.service';
import { ScholarshipCard } from '../../../shared/components/card/card.component';

@Component({
  selector: 'app-favoris',
  standalone: true,
  imports: [ScholarshipCard],
  templateUrl: './favoris.component.html'
})
export class FavorisComponent implements OnInit {
  private favorisService = inject(FavorisService);

  favoris = signal<Scholarship[]>([]);
  chargement = signal(true);
  erreur = signal<string | null>(null);

  ngOnInit(): void {
    this.favorisService.getFavoris().subscribe({
      next: (liste) => {
        this.favoris.set(liste);
        this.chargement.set(false);
      },
      error: () => {
        this.erreur.set('Impossible de charger tes favoris. Réessaie plus tard.');
        this.chargement.set(false);
      }
    });
  }

  onToggleFavori(scholarshipId: string): void {
    this.erreur.set(null);

    this.favorisService.retirerFavori(scholarshipId).subscribe({
      next: () => {
        this.favoris.update(liste => liste.filter(s => s.id !== scholarshipId));
      },
      error: () => {
        this.erreur.set('Impossible de retirer cette bourse des favoris. Réessaie.');
      }
    });
  }
}