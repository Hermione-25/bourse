import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ToastType = 'error' | 'success' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

/**
 * Service de notification Toast.
 * ✅ Remplace window.alert() — non-bloquant, non-modal, accessible.
 *
 * Usage :
 *   toastService.error('Une erreur serveur est survenue.');
 *   toastService.success('Bourse créée avec succès !');
 */
@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly DEFAULT_DURATION_MS = 4500;
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  readonly toasts$ = this.toastsSubject.asObservable();

  error(message: string, durationMs = this.DEFAULT_DURATION_MS): void {
    this.show(message, 'error', durationMs);
  }

  success(message: string, durationMs = this.DEFAULT_DURATION_MS): void {
    this.show(message, 'success', durationMs);
  }

  warning(message: string, durationMs = this.DEFAULT_DURATION_MS): void {
    this.show(message, 'warning', durationMs);
  }

  info(message: string, durationMs = this.DEFAULT_DURATION_MS): void {
    this.show(message, 'info', durationMs);
  }

  dismiss(id: string): void {
    this.toastsSubject.next(
      this.toastsSubject.getValue().filter((t) => t.id !== id)
    );
  }

  private show(message: string, type: ToastType, durationMs: number): void {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const toast: Toast = { id, message, type };
    this.toastsSubject.next([...this.toastsSubject.getValue(), toast]);

    if (durationMs > 0) {
      setTimeout(() => this.dismiss(id), durationMs);
    }
  }
}
