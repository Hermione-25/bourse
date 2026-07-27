import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ScholarshipsService, Stats } from '../../features/scholarships/scholarships.service';
import { Scholarship } from '../../features/scholarships/scholarships.models';
import { AuthService } from '../../core/auth/auth.service';
import { ScholarshipCard } from '../../shared';
import { DropdownSelectComponent } from '../../shared';
import { FavorisService } from '../../services/utilisateur/favoris.service';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ScholarshipCard, DropdownSelectComponent],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
})
export class LandingPageComponent implements OnInit {
  private router = inject(Router);
  private scholarshipsService = inject(ScholarshipsService);
  authService = inject(AuthService);
  private favorisService = inject(FavorisService)

  recentScholarships: Scholarship[] = [];
  loading = signal<boolean>(true);
  isSelectFocused = false;
  isMenuOpen = false;

  destination = '';
  niveau = '';
  domaine = '';

  stats = signal<Stats | null>(null);

  ngOnInit(): void {
    
    this.scholarshipsService.getPublic().subscribe({
      next: (scholarships) => {
        this.recentScholarships = scholarships.slice(0, 8);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error fetching scholarships', err);
        this.loading.set(false);
      }
    });

    this.scholarshipsService.getStats().subscribe({
      next: (data) => this.stats.set(data),
      error: () => {},
    });

    this.favorisService.getFavoris().subscribe({
      next: (liste) => {
        this.favoris.set(new Set(liste.map(s => s.id)));
      },
      error: () => {
        
      }
    })
  }

  rechercher(): void {
    const queryParams: Record<string, string> = {};
    if (this.destination) queryParams['country'] = this.destination;
    if (this.niveau) queryParams['level'] = this.niveau;
    if (this.domaine) queryParams['domain'] = this.domaine;

    this.router.navigate(['/scholarships'], { queryParams });
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  erreur = signal<string | null>(null);
  favoris = signal<Set<string>>(new Set());

   isFavori(id: string): boolean {
    return this.favoris().has(id);
  }

  onToggleFavori(id: string): void {
    const dejaFavori = this.favoris().has(id);

    // Mise à jour optimiste de l'UI
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
        // Rollback en cas d'échec
        this.favoris.update(set => {
          const nouveau = new Set(set);
          dejaFavori ? nouveau.add(id) : nouveau.delete(id);
          return nouveau;
        });
        this.erreur.set('Impossible de mettre à jour tes favoris. Réessaie.');
      }
    });
  }
  
}