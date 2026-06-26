import { Injectable, inject } from '@angular/core';
import { ToastService } from '../../shared/components/toast/toast.service';

/**
 * Service centralisé d'affichage des erreurs.
 * ✅ Utilise ToastService au lieu de window.alert() — non-bloquant et accessible.
 */
@Injectable({ providedIn: 'root' })
export class ErrorDialogService {
  private toastService = inject(ToastService);

  show(message: string): void {
    this.toastService.error(message);
  }
}
