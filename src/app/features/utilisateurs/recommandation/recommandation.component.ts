import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RecommandationService } from '../../../services/utilisateur/recommandation.service';
import { FavorisService } from '../../../services/utilisateur/favoris.service';
import { ProfileService } from '../../../services/utilisateur/profil.service';
import { Scholarship } from '../../scholarships/scholarships.models';
import { ScholarshipCard } from '../../../shared/components/card/card.component';
import { calculerCompletionProfil } from '../../../shared/utils/profil-user-utils';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-recommandation',
  standalone: true,
  imports: [CommonModule, RouterLink, ScholarshipCard],
  templateUrl: './recommandation.component.html',
  styleUrl: './recommandation.component.css',
})
export class RecommandationComponent implements OnInit {
  private recommandationService = inject(RecommandationService);
  private favorisService = inject(FavorisService);
  private profileService = inject(ProfileService);

  recommandations = signal<Scholarship[]>([]);
  favorisIds = signal<Set<string>>(new Set());
  completionProfil = signal<number>(0);
  chargement = signal<boolean>(true);
  erreur = signal<string | null>(null);

  ngOnInit(): void {
    this.chargerDonnees();
  }

  chargerDonnees(): void {
    this.chargement.set(true);
    this.erreur.set(null);

    forkJoin({
      profile: this.profileService.getProfile().pipe(catchError(() => of(null))),
      recommandations: this.recommandationService.getRecommandations().pipe(catchError((err) => {
        console.error('Erreur chargement recommandations:', err);
        this.erreur.set('Impossible de charger les recommandations.');
        return of([] as Scholarship[]);
      })),
      favoris: this.favorisService.getFavoris().pipe(catchError(() => of([] as Scholarship[])))
    }).subscribe({
      next: ({ profile, recommandations, favoris }) => {
        this.completionProfil.set(calculerCompletionProfil(profile));
        this.recommandations.set(recommandations);
        this.favorisIds.set(new Set(favoris.map(f => f.id)));
        this.chargement.set(false);
      },
      error: (err) => {
        console.error('Erreur générale de chargement des données:', err);
        this.erreur.set('Une erreur est survenue lors de la récupération des données.');
        this.chargement.set(false);
      }
    });
  }

  onToggleFavori(scholarshipId: string): void {
    const estFavori = this.favorisIds().has(scholarshipId);

    if (estFavori) {
      this.favorisService.retirerFavori(scholarshipId).subscribe({
        next: () => {
          this.favorisIds.update(set => {
            const newSet = new Set(set);
            newSet.delete(scholarshipId);
            return newSet;
          });
        },
        error: (err) => console.error('Erreur lors du retrait du favori:', err)
      });
    } else {
      this.favorisService.ajouterFavori(scholarshipId).subscribe({
        next: () => {
          this.favorisIds.update(set => {
            const newSet = new Set(set);
            newSet.add(scholarshipId);
            return newSet;
          });
        },
        error: (err) => console.error("Erreur lors de l'ajout aux favoris:", err)
      });
    }
  }
}
