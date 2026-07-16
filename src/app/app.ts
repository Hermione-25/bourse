import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './shared/components/toast/toast.component';
import { ChatComponent } from './features/utilisateurs/chat/chat.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastComponent, ChatComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('bourse-plateforme');
}
