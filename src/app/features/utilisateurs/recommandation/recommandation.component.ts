import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { RecommandationService } from '../../../services/utilisateur/recommandation.service';
import { FavorisService } from '../../../services/utilisateur/favoris.service';
import { ProfileService } from '../../../services/utilisateur/profil.service';

import { Scholarship } from '../../scholarships/scholarships.models';
import { ScholarshipCard } from '../../../shared/components/card/card.component';
import { calculerCompletionProfil } from '../../../shared/utils/profil-user-utils';

@Component({
  selector: 'app-recommandation',
  standalone: true,
  imports: [RouterLink, ScholarshipCard],
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
      profile: this.profileService.getProfile().pipe(
        catchError(() => of(null))
      ),

      recommandations: this.recommandationService.getRecommandations().pipe(
        catchError((err) => {
          console.error('Erreur recommandations:', err);
          return of([] as Scholarship[]);
        })
      ),

      favoris: this.favorisService.getFavoris().pipe(
        catchError(() => of([] as Scholarship[]))
      )
    }).subscribe({
      next: ({ profile, recommandations, favoris }) => {

        // Profil completion
        this.completionProfil.set(
          profile ? calculerCompletionProfil(profile) : 0
        );

        // Recommandations
        this.recommandations.set(recommandations);

        // Transformer favoris en Set d'IDs (string, cohérent avec Scholarship.id)
        const favorisSet = new Set<string>(
          favoris.map(f => f.id)
        );

        this.favorisIds.set(favorisSet);

        this.chargement.set(false);
      },

      error: (err) => {
        console.error('Erreur globale:', err);
        this.erreur.set('Erreur lors du chargement des données.');
        this.chargement.set(false);
      }
    });
  }

  onToggleFavori(scholarshipId: string): void {

    const estFavori = this.favorisIds().has(scholarshipId);

    // optimistic update
    this.favorisIds.update(set => {
      const newSet = new Set(set);
      estFavori ? newSet.delete(scholarshipId) : newSet.add(scholarshipId);
      return newSet;
    });

    const action$ = estFavori
      ? this.favorisService.retirerFavori(scholarshipId)
      : this.favorisService.ajouterFavori(scholarshipId);

    action$.subscribe({
      error: (err) => {
        console.error('Erreur favori:', err);

        // rollback
        this.favorisIds.update(set => {
          const newSet = new Set(set);
          estFavori ? newSet.add(scholarshipId) : newSet.delete(scholarshipId);
          return newSet;
        });
      }
    });
  }
}