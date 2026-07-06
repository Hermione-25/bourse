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
    return jours != null && jours <= 7;
  }
}