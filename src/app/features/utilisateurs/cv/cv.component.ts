import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { GenerateService } from '../../generate/generate.service';
import { Cv } from '../../generate/generate.models';


@Component({
  selector: 'app-cv',
  standalone: true,
  imports: [CommonModule, RouterLink ],
  templateUrl: './cv.component.html',
 
})
export class CvComponent implements OnInit {
  private generateService = inject(GenerateService);
  private router = inject(Router);

  mesCvs = signal<Cv[]>([]);
  chargement = signal(true);
  suppressionEnCours = signal<number | null>(null); 

  generation(){
    this.router.navigate(['/generate'])
  }

  ngOnInit() {
    this.chargerCvs();
  }

  chargerCvs() {
    this.chargement.set(true);
    this.generateService.getMesCvs().subscribe({
      next: (cvs) => {
        this.mesCvs.set(cvs);
        this.chargement.set(false);
      },
      error: () => {
        alert('Erreur lors du chargement de vos CV');
        this.chargement.set(false);
      },
    });
  }

  modifier(id: number) {
    this.router.navigate(['/generate'], { queryParams: { id } });
  }

  supprimer(id: number) {
    const confirmation = confirm('Voulez-vous vraiment supprimer ce CV ?');
    if (!confirmation) return;

    this.suppressionEnCours.set(id);
    this.generateService.deleteCv(id).subscribe({
      next: () => {
        this.mesCvs.set(this.mesCvs().filter((cv) => cv.id !== id));
        this.suppressionEnCours.set(null);
      },
      error: () => {
        alert('Erreur lors de la suppression du CV');
        this.suppressionEnCours.set(null);
      },
    });
  }

  telecharger(id: number) {
    this.generateService.downloadSavedCv(id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cv-${id}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => {
        alert('Erreur lors du téléchargement du CV');
      },
    });
  }
}