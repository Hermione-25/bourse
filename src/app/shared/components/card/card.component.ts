import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FundingType, Scholarship } from '../../../features/scholarships/scholarships.models';


@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './card.component.html'
})
export class ScholarshipCard {
  FundingType = FundingType;

  scholarship = input.required<Scholarship>();
  estFavori = input(false);

  toggleFavori = output<string>();

  onToggleFavori(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.toggleFavori.emit(this.scholarship().id);
  }

  get urgent(): boolean {
    const jours = this.scholarship().days_remaining;
    return jours !== undefined && jours <= 7;
  }

  get scoreClasses(): string {
    const score = this.scholarship().compatibility_score;
    if (score === undefined) return '';
    if (score >= 75) return 'bg-emerald-600 text-white';
    if (score >= 50) return 'bg-amber-500 text-white';
    return 'bg-[var(--color-gray-text)]/70 text-white';
  }

  getJoursRestants(deadline: string | undefined): number | null {
    if (!deadline) return null;
    const aujourdHui = new Date();
    const dateDeadline = new Date(deadline);
    const diffMs = dateDeadline.getTime() - aujourdHui.getTime();
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  }

  getCouleurDeadline(jours: number | null): string {
    if (jours === null) return 'text-gray-500';
    if (jours < 0) return 'text-red-600';           // Expirée
    if (jours <= 7) return 'text-red-600';           // Urgent (moins d'une semaine)
    if (jours <= 30) return 'text-amber-600';        // Bientôt (moins d'un mois)
    return 'text-emerald-500';                       // Tranquille
  }
}