import { ErrorHandler, Injectable, inject } from '@angular/core';
import { ErrorDialogService } from './error-dialog.service';

/**
 * Gestionnaire d'erreurs global Angular.
 * ✅ Gère deux cas :
 *  - Erreurs HTTP normalisées par httpErrorInterceptor : { status, message, details }
 *  - Erreurs JavaScript inattendues (TypeError, ReferenceError, etc.)
 */
@Injectable({ providedIn: 'root' })
export class ErrorHandlerService implements ErrorHandler {
  private dialog = inject(ErrorDialogService);

  handleError(error: unknown): void {
    // Les erreurs HTTP sont normalisées par httpErrorInterceptor en plain object
    if (this.isNormalizedHttpError(error)) {
      this.dialog.show(error.message || 'Une erreur serveur est survenue.');
    } else if (error instanceof Error) {
      this.dialog.show(error.message || 'Une erreur inconnue est survenue.');
    } else {
      this.dialog.show('Une erreur inconnue est survenue.');
    }
    console.error('[ErrorHandler]', error);
  }

  private isNormalizedHttpError(
    error: unknown
  ): error is { status: number; message: string; details: unknown } {
    return (
      typeof error === 'object' &&
      error !== null &&
      'status' in error &&
      'message' in error
    );
  }
}
