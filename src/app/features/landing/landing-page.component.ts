import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ScholarshipService } from '../../services/scholarship';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
})
export class LandingPageComponent implements OnInit {
  private router = inject(Router);
  private scholarshipService = inject(ScholarshipService);

  recentScholarships: any[] = [];
  isSelectFocused = false;

  ngOnInit(): void {
    this.scholarshipService.getAllScholarships().subscribe({
      next: (data: any) => {
        const scholarships = Array.isArray(data) ? data : (data?.data || []);
        this.recentScholarships = scholarships.slice(0, 4);
      },
      error: (err) => console.error('Error fetching scholarships', err)
    });
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}
