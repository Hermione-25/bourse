import { Component, ElementRef, ViewChild, AfterViewChecked, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatService } from './chat.service';
import { AuthService } from '../../../core/auth/auth.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements AfterViewChecked {

  private chatService = inject(ChatService);
  authService = inject(AuthService);

  texteSaisi = signal('');
  historiqueOuvert = signal(false);

  isOpen = this.chatService.isOpen;
  messages = this.chatService.messages;
  isLoading = this.chatService.isLoading;
  conversations = this.chatService.conversations;
  currentConversationId = this.chatService.currentConversationId;

  @ViewChild('inputMessage') inputMessage!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('messageContainer') messageContainer!: ElementRef<HTMLElement>;

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  toggleChat() {
    this.isOpen() ? this.chatService.fermer() : this.chatService.ouvrir();
  }

  toggleHistorique() {
    this.historiqueOuvert.update(v => !v);
  }

  estConnecte = toSignal(
    this.authService.authState$.pipe(map((auth) => !!auth)),
    { initialValue: false }
  );

  envoyer() {
    const text = this.texteSaisi();
    if (text.trim() === '' || this.isLoading()) return;

    this.chatService.envoyerMessage(text);
    this.texteSaisi.set('');
    this.focusOnInput();
  }

  onKeydownEnter(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.envoyer();
    }
  }

  nouvelleConversation() {
    this.chatService.nouvelleConversation();
    this.historiqueOuvert.set(false);
    this.focusOnInput();
  }

  selectionnerConversation(id: string) {
    this.chatService.selectionnerConversation(id);
    this.historiqueOuvert.set(false);
  }

  supprimerConversation(id: string, event: Event) {
    this.chatService.supprimerConversation(id, event);
  }

  private focusOnInput() {
    setTimeout(() => {
      if (this.inputMessage) {
        this.inputMessage.nativeElement.focus();
      }
    }, 50);
  }

  private scrollToBottom(): void {
    if (this.messageContainer) {
      this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
    }
  }
}