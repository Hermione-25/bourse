import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActivatedRoute } from '@angular/router';
import { ScholarshipsService } from '../../scholarships.service';
import { Scholarship } from '../../scholarships.models';
import { ScholarshipCard } from "../../../../shared";


@Component({
  selector: 'app-scholarships-list',
  standalone: true,
  imports: [CommonModule,  ScholarshipCard],
  templateUrl: './scholarship-list-page.component.html',
})
export class ScholarshipsListComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private scholarshipsService = inject(ScholarshipsService);

  scholarships = signal<Scholarship[]>([]);
  chargement = signal<boolean>(true);
  erreur = signal<string | null>(null);

  filtres = { country: '', level: '', domain: '' };

  ngOnInit(): void {
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



}