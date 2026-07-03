import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DashboardService } from '../../../services/utilisateur/dashboard.service';
import { DashboardResume } from '../../../shared/models/dashboard.models';


@Component({
  selector: 'app-tableau-de-bord',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './tableau.component.html'
})
export class TableauComponent implements OnInit {
  private dashboardService = inject(DashboardService);

  resume = signal<DashboardResume | null>(null);
  chargement = signal(true);

  ngOnInit(): void {
    this.dashboardService.getResume().subscribe({
      next: (r) => {
        this.resume.set(r);
        this.chargement.set(false);
      },
      error: () => this.chargement.set(false)
    });
  }
}