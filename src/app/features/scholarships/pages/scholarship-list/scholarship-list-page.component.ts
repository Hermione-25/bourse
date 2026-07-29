import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ScholarshipsService } from '../../scholarships.service';
import { FavorisService } from '../../../../services/utilisateur/favoris.service';
import { Scholarship } from '../../scholarships.models';
import { ScholarshipCard } from "../../../../shared";
import { FooterComponent } from '../../../../layouts/footer/footer.component';

@Component({
  selector: 'app-scholarships-list',
  standalone: true,
  imports: [CommonModule, ScholarshipCard, FooterComponent],
  templateUrl: './scholarship-list-page.component.html',
})
export class ScholarshipsListComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private scholarshipsService = inject(ScholarshipsService);
  private favorisService = inject(FavorisService);

  scholarships = signal<Scholarship[]>([]);
  chargement = signal<boolean>(true);
  erreur = signal<string | null>(null);

  favoris = signal<Set<string>>(new Set());

  filtres = { country: '', level: '', domain: '' };

  search = computed(() => {
    const terme = this.recherche().trim().toLowerCase()

    return this.scholarships().filter((s) => {
      if (!terme) return true;

        return(
          s.title?.toLowerCase().includes(terme) ||
          s.university?.toLowerCase().includes(terme) ||
          s.country?.toLowerCase().includes(terme) ||
          s.domain?.toLowerCase().includes(terme) ||
          s.description?.toLowerCase().includes(terme) ||
          s.funding_type?.toLowerCase().includes(terme)
        )
    });
  });

  ngOnInit(): void {

    this.favorisService.getFavoris().subscribe({
      next: (liste) => {
        this.favoris.set(new Set(liste.map(s => s.id)));
      },
      error: () => {

      }
    });

    this.route.queryParamMap.subscribe((params) => {
      this.filtres = {
        country: params.get('country') || '',
        level: params.get('level') || '',
        domain: params.get('domain') || '',
      };
      this.charger();
    });
  }

  private charger(): void {
    this.chargement.set(true);
    this.erreur.set(null);

    const aDesFiltres = this.filtres.country || this.filtres.level || this.filtres.domain;
    const requete$ = aDesFiltres
      ? this.scholarshipsService.search(this.filtres)
      : this.scholarshipsService.getPublic();

    requete$.subscribe({
      next: (data) => {
        this.scholarships.set(data);
        this.chargement.set(false);
      },
      error: () => {
        this.erreur.set('Impossible de charger les bourses. Réessaie plus tard.');
        this.chargement.set(false);
      },
    });
  }

  isFavori(id: string): boolean {
    return this.favoris().has(id);
  }

  onToggleFavori(id: string): void {
    const dejaFavori = this.favoris().has(id);


    this.favoris.update(set => {
      const nouveau = new Set(set);
      dejaFavori ? nouveau.delete(id) : nouveau.add(id);
      return nouveau;
    });

    const appel$ = dejaFavori
      ? this.favorisService.retirerFavori(id)
      : this.favorisService.ajouterFavori(id);

    appel$.subscribe({
      error: () => {
        this.favoris.update(set => {
          const nouveau = new Set(set);
          dejaFavori ? nouveau.add(id) : nouveau.delete(id);
          return nouveau;
        });
        this.erreur.set('Impossible de mettre à jour tes favoris. Réessaie.');
      }
    });
  }



   recherche = signal<string>('');

   onRechercheChange(event: Event): void {
    const valeur = (event.target as HTMLInputElement).value;
    this.recherche.set(valeur);
  }
}