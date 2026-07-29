import { Component, signal, computed } from '@angular/core';
import { FooterComponent } from "../../layouts/footer/footer.component";

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [FooterComponent],
  templateUrl: './faq.component.html',
})
export class FaqComponent {
  categories = [
  { id: 'general', label: 'Général', icon: 'fa-magnifying-glass' },
  { id: 'bourses', label: 'Bourses', icon: 'fa-graduation-cap' },
  { id: 'candidature', label: 'Candidature', icon: 'fa-pen' },
  { id: 'compte', label: 'Compte', icon: 'fa-user' },
  { id: 'alertes', label: 'Alertes', icon: 'fa-bell' },
  { id: 'cv', label: 'CV ', icon: 'fa-file-lines' },
];

  faqs = [
    { id: 'q1', categoryId: 'bourses', question: 'Comment rechercher une bourse ?', reponse: 'Utilise la barre de recherche ou les filtres (pays, niveau, domaine) sur la page "Bourses" pour affiner les résultats selon ton profil.' },
    { id: 'q2', categoryId: 'bourses', question: 'Qu\'est-ce qu\'une bourse d\'études ?', reponse: ': Une bourse d\'études est une aide financière accordée à un étudiant pour l\'aider à poursuivre ses études. Elle peut couvrir totalement ou partiellement les frais de scolarité, le logement, le transport ou les dépenses quotidiennes.' },
    { id: 'q3', categoryId: 'bourses', question: 'Qui peut bénéficier d\'une bourse d\'études ?', reponse: 'Les critères varient selon chaque programme. Certaines bourses sont destinées aux lycéens, étudiants universitaires, chercheurs ou jeunes professionnels.' },
    { id: 'q4', categoryId: 'bourses', question: 'Les bourses sont-elles vérifiées ?', reponse: 'Chaque bourse publiée est vérifiée manuellement par notre équipe avant sa mise en ligne.' },
    { id: 'q5', categoryId: 'general', question: 'Qu\'est-ce qu\'Afrischolar ?', reponse: 'Afrischolar est une plateforme qui centralise les bourses d\'études destinées aux étudiants africains, avec des outils pour faciliter la candidature.' },
    { id: 'q6', categoryId: 'candidature', question: 'Comment postuler à une bourse ?', reponse: 'Clique sur "Postuler" depuis la page détail d\'une bourse pour être redirigé vers le site officiel du programme.' },
    { id: 'q7', categoryId: 'candidature', question: 'Quels documents sont souvent demandés ?', reponse: 'Les documents varient selon les programmes, mais on retrouve souvent :[CV] , [Lettre de motivation] , [Diplômes ou relevés de notes] , [Lettre de recommandation] , [Pièce d\'identité] , [Preuve de niveau de langue]' },
    { id: 'q8', categoryId: 'candidature', question: 'Puis-je postuler à plusieurs bourses ?', reponse: 'Oui, il est conseillé de candidater à plusieurs opportunités pour augmenter vos chances.' },
    { id: 'q9', categoryId: 'compte', question: 'Comment créer un compte ?', reponse: 'Clique sur "Inscription" en haut de la page et renseigne tes informations. Un email de confirmation te sera envoyé.' },
    { id: 'q10', categoryId: 'compte', question: 'Pourquoi créer un compte sur la plateforme ?', reponse: 'Un compte permet de sauvegarder vos bourses favorites, recevoir des notifications et suivre les opportunités qui vous intéressent.' },
    { id: 'q11', categoryId: 'alertes', question: 'Comment activer les alertes de bourses ?', reponse: 'Depuis la page d\'accueil abonnes toi a notre newsletter pour recevoir les un email dès qu\'une bourse correspond à ton profil.' },
    { id: 'q12', categoryId: 'cv', question: 'Comment fonctionne le générateur de CV ?', reponse: 'Renseigne tes informations dans la section "CV", et notre IA génère un CV optimisé adapté aux standards académiques internationaux.' },
  ];

  categorieSelectionnee = signal<string | null>(null);
  questionOuverte = signal<string | null>(null);

  faqsFiltrees = computed(() => {
    const catId = this.categorieSelectionnee();
    if (!catId) return [];
    return this.faqs.filter(f => f.categoryId === catId);
  });

  categorieActuelle = computed(() => {
    const catId = this.categorieSelectionnee();
    return this.categories.find(c => c.id === catId) ?? null;
  });

  onSelectCategorie(id: string): void {
    this.categorieSelectionnee.set(id);
    this.questionOuverte.set(null);
  }

  onRetour(): void {
    this.categorieSelectionnee.set(null);
    this.questionOuverte.set(null);
  }

  onToggleQuestion(id: string): void {
    this.questionOuverte.update(current => current === id ? null : id);
  }
}