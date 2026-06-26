import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from './toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container" aria-live="polite" aria-atomic="false">
      @for (toast of toasts(); track toast.id) {
        <div
          class="toast"
          [class]="'toast toast--' + toast.type"
          role="alert"
        >
          <span class="toast__icon">{{ getIcon(toast.type) }}</span>
          <span class="toast__message">{{ toast.message }}</span>
          <button
            class="toast__close"
            (click)="dismiss(toast.id)"
            aria-label="Fermer"
          >✕</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      bottom: 1.5rem;
      right: 1.5rem;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      max-width: 380px;
      width: 100%;
    }

    .toast {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.875rem 1rem;
      border-radius: 0.5rem;
      box-shadow: 0 4px 16px rgba(0,0,0,.18);
      font-family: inherit;
      font-size: 0.9rem;
      animation: toast-in 0.28s cubic-bezier(0.34, 1.56, 0.64, 1) both;
    }

    @keyframes toast-in {
      from { opacity: 0; transform: translateY(1rem) scale(0.95); }
      to   { opacity: 1; transform: translateY(0)     scale(1);    }
    }

    .toast--error   { background: #2d1b1b; border-left: 4px solid #f87171; color: #fecaca; }
    .toast--success { background: #1b2d1e; border-left: 4px solid #4ade80; color: #bbf7d0; }
    .toast--warning { background: #2d2a1b; border-left: 4px solid #fbbf24; color: #fef08a; }
    .toast--info    { background: #1b2040; border-left: 4px solid #60a5fa; color: #bfdbfe; }

    .toast__icon { font-size: 1.1rem; flex-shrink: 0; }
    .toast__message { flex: 1; line-height: 1.4; }
    .toast__close {
      background: none;
      border: none;
      cursor: pointer;
      color: inherit;
      opacity: 0.6;
      font-size: 0.85rem;
      padding: 0.2rem;
      line-height: 1;
      flex-shrink: 0;
      transition: opacity 0.15s;
    }
    .toast__close:hover { opacity: 1; }
  `],
})
export class ToastComponent implements OnInit, OnDestroy {
  private toastService = inject(ToastService);
  readonly toasts = signal<Toast[]>([]);
  private sub!: Subscription;

  ngOnInit(): void {
    this.sub = this.toastService.toasts$.subscribe((list) => this.toasts.set(list));
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  dismiss(id: string): void {
    this.toastService.dismiss(id);
  }

  getIcon(type: Toast['type']): string {
    const icons: Record<Toast['type'], string> = {
      error: '✖',
      success: '✔',
      warning: '⚠',
      info: 'ℹ',
    };
    return icons[type];
  }
}
