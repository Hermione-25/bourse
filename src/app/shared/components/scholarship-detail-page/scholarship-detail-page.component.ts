import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ScholarshipsService } from '../../../features/scholarships/scholarships.service';
import { FundingType, Scholarship } from '../../../features/scholarships/scholarships.models';
import { DatePipe, Location } from '@angular/common';
import { ChatService } from '../../../features/utilisateurs/chat/chat.service';


@Component({
  selector: 'app-scholarship-detail',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './scholarship-detail-page.component.html',
  styleUrl: './scholarship-detail-page.component.css',
})
export class ScholarshipDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private location = inject(Location);
  private scholarshipsService = inject(ScholarshipsService);
  private chatService = inject(ChatService);

  FundingType = FundingType;

  scholarship = signal<Scholarship | null>(null);
  chargement = signal(true);
  erreur = signal<string | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.erreur.set('Bourse introuvable.');
      this.chargement.set(false);
      return;
    }

    this.scholarshipsService.getPublicById(id).subscribe({
      next: (data) => {
        this.scholarship.set(data);
        this.chargement.set(false);
      },
      error: () => {
        this.erreur.set('Impossible de charger cette bourse. Réessaie plus tard.');
        this.chargement.set(false);
      },
    });
  }

  onRetour(): void {
    this.location.back();
  }

  onPostuler(): void {
    this.ouvrirLien(this.scholarship()?.apply_link);
  }

  onOfficial(): void {
    this.ouvrirLien(this.scholarship()?.official_website);
  }

  private ouvrirLien(lien: string | undefined): void {
    if (!lien) return;
    window.open(lien, '_blank', 'noopener,noreferrer');
  }

getJoursRestants(deadline: string | undefined): number | null {
  if (!deadline) return null;
  const aujourdHui = new Date();
  const dateDeadline = new Date(deadline);
  const diffMs = dateDeadline.getTime() - aujourdHui.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

  demanderResumer() {
  this.chatService.demanderResume(
    Number(this.scholarship()!.id),
    this.scholarship()!.title
  );
}

}  

