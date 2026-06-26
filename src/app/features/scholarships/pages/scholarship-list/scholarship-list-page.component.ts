import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScholarshipsService } from '../../scholarships.service';
import { Scholarship } from '../../scholarships.models';

@Component({
  selector: 'app-scholarship-list-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scholarship-list-page.component.html',
  styleUrls: ['./scholarship-list-page.component.css'],
})
export class ScholarshipListPageComponent implements OnInit {
  private scholarshipsService = inject(ScholarshipsService);

  scholarships: Scholarship[] = [];
  loading = false;
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.loading = true;
    this.scholarshipsService.getAll().subscribe({
      next: (items) => {
        this.scholarships = items;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.message || 'Impossible de charger les bourses';
        this.loading = false;
      },
    });
  }
}
