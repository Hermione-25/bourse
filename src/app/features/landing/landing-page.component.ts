import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ScholarshipsService } from '../../features/scholarships/scholarships.service';
import { Scholarship } from '../../features/scholarships/scholarships.models';
import { AuthService } from '../../core/auth/auth.service';
import { ScholarshipCard } from '../../shared';
import { DropdownSelectComponent } from '../../shared';

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

  recentScholarships: Scholarship[] = [];
  loading = signal<boolean>(true);
  isSelectFocused = false;
  isMenuOpen = false;

  destination = '';
  niveau = '';
  domaine = '';

  ngOnInit(): void {
    this.scholarshipsService.getPublic().subscribe({
      next: (scholarships) => {
        this.recentScholarships = scholarships.slice(0, 4);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error fetching scholarships', err);
        this.loading.set(false);
      }
    });
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
}