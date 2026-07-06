import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PaysService } from './pays.service';
import { Pays } from '../../shared/models/pays.models';
import { PAYS_MOCK } from './pays-data';

@Component({
  selector: 'app-destination',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './destination.component.html',
})
export class DestinationComponent implements OnInit {
  private paysService = inject(PaysService);

  pays = signal<Pays[]>([]);
  chargement = signal<boolean>(true);
  erreur = signal<string | null>(null);

  recherche = signal<string>('');
  lettreActive = signal<string>('Tous');

  alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

  paysFiltres = computed(() => {
    const terme = this.recherche().trim().toLowerCase();
    const lettre = this.lettreActive();

    return this.pays().filter((p) => {
      const correspondRecherche = !terme || p.name.toLowerCase().includes(terme);
      const correspondLettre = lettre === 'Tous' || p.name.toUpperCase().startsWith(lettre);
      return correspondRecherche && correspondLettre;
    });
  });

  ngOnInit(): void {
    this.chargerPays();
  }

  private chargerPays(): void {
    this.chargement.set(true);

    this.paysService.getCounts().subscribe({
      next: (countsApi) => {
        const paysAvecCounts: Pays[] = PAYS_MOCK.map((paysMock) => {
          const correspondance = countsApi.find(
            (c) => c.name.toLowerCase() === paysMock.name.toLowerCase()
          );
          return {
            ...paysMock,
            bourses_count: correspondance ? correspondance.bourses_count : 0,
          };
        });

        this.pays.set(paysAvecCounts);
        this.chargement.set(false);
      },
      error: (err) => {
        console.error('Erreur chargement pays :', err);
        this.pays.set(PAYS_MOCK); // fallback : affichage avec count à 0
        this.erreur.set("Les compteurs de bourses n'ont pas pu être chargés.");
        this.chargement.set(false);
      },
    });
  }

  onRechercheChange(event: Event): void {
    const valeur = (event.target as HTMLInputElement).value;
    this.recherche.set(valeur);
  }

  selectionnerLettre(lettre: string): void {
    this.lettreActive.set(lettre);
  }
}