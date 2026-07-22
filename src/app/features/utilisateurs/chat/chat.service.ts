import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';


export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  updatedAt: number;
}

const STORAGE_KEY = 'bp_chat_conversations';
const MAX_CONVERSATIONS = 10;

@Injectable({ providedIn: 'root' })
export class ChatService {
  messages = signal<ChatMessage[]>([]);
  isLoading = signal(false);
  isOpen = signal(false);

  conversations = signal<Conversation[]>([]);
  currentConversationId = signal<string | null>(null);

  constructor(private http: HttpClient) {
    this.chargerConversations();
  }


  ouvrir() { this.isOpen.set(true); }
  fermer() { this.isOpen.set(false); }

  demanderResume(id: number, title: string) {
    this.ouvrir();
    this.envoyerMessage(title, id);
  }

  /** Formate une date en texte relatif (ex: "Aujourd'hui", "Hier", "Il y a 3 j.") */
  formaterDate(timestamp: number): string {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7)  return `Il y a ${diffDays} j.`;
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  }

  private chargerConversations() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      this.conversations.set(JSON.parse(raw));
    } catch {
      this.conversations.set([]);
    }
  }

  private sauvegarderConversations() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.conversations()));
  }

  nouvelleConversation() {
    const conversation: Conversation = {
      id: crypto.randomUUID(),
      title: 'Nouvelle conversation',
      messages: [],
      updatedAt: Date.now()
    };

    let liste = [conversation, ...this.conversations()];
    if (liste.length > MAX_CONVERSATIONS) {
      // Supprime la plus ancienne (dernière dans la liste triée)
      liste = liste.slice(0, MAX_CONVERSATIONS);
    }

    this.conversations.set(liste);
    this.currentConversationId.set(conversation.id);
    this.messages.set([]);
    this.sauvegarderConversations();
  }

  selectionnerConversation(id: string) {
    const conv = this.conversations().find(c => c.id === id);
    if (!conv) return;
    this.currentConversationId.set(id);
    this.messages.set([...conv.messages]);
  }

  supprimerConversation(id: string, event: Event) {
    event.stopPropagation();
    this.conversations.set(this.conversations().filter(c => c.id !== id));
    this.sauvegarderConversations();

    if (this.currentConversationId() === id) {
      this.currentConversationId.set(null);
      this.messages.set([]);
    }
  }

  toutEffacer() {
    this.conversations.set([]);
    this.currentConversationId.set(null);
    this.messages.set([]);
    localStorage.removeItem(STORAGE_KEY);
  }

  private mettreAJourConversationCourante() {
    const id = this.currentConversationId();
    if (!id) return;

    this.conversations.update(liste =>
      liste.map(c => {
        if (c.id !== id) return c;

        const premierMessageUser = this.messages().find(m => m.role === 'user');
        const title = premierMessageUser
          ? premierMessageUser.content.slice(0, 45).trim() + (premierMessageUser.content.length > 45 ? '…' : '')
          : c.title;

        return { ...c, messages: [...this.messages()], title, updatedAt: Date.now() };
      })
    );

    this.sauvegarderConversations();
  }

  envoyerMessage(texte: string, id?: number) {
    if (!this.currentConversationId()) {
      this.nouvelleConversation();
    }

    this.messages.update(msgs => [...msgs, { role: 'user', content: texte }]);
    this.isLoading.set(true);
    this.mettreAJourConversationCourante();

this.http.post<{
  success: boolean;
  data: {
    answer: string;
  };
}>(`${environment.apiUrl}/gemini/chat`, {
  message: texte,
  history: this.messages(),
  scholarship_id: id
}).subscribe({
  next: (res) => {
    this.messages.update(msgs => [
      ...msgs,
      {
        role: 'assistant',
        content: res.data.answer
      }
    ]);

    this.isLoading.set(false);
    this.mettreAJourConversationCourante();
  },
  error: (err) => {
    console.error(err);

    this.messages.update(msgs => [
      ...msgs,
      {
        role: 'assistant',
        content: "Désolé, une erreur est survenue. Réessaie dans un instant."
      }
    ]);

    this.isLoading.set(false);
    this.mettreAJourConversationCourante();
  }
});
  }

  reset() {
    this.messages.set([]);
  }
}