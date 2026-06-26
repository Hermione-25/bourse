import { ApplicationConfig, ErrorHandler, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { API_CONFIG } from './core/api/api.config';
import { jwtInterceptor } from './core/api/jwt.interceptor';
import { httpErrorInterceptor } from './core/api/http-error.interceptor';
import { ErrorHandlerService } from './core/errors/error-handler.service';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    // ✅ Ordre correct : jwtInterceptor agit en premier sur la requête (ajoute le token)
    // et en DERNIER sur la réponse — httpErrorInterceptor normalise l'erreur AVANT
    // que jwtInterceptor ne tente un refresh, évitant la perte du type HttpErrorResponse.
    provideHttpClient(
      withInterceptors([jwtInterceptor, httpErrorInterceptor])
    ),
    {
      provide: API_CONFIG,
      useValue: {
        baseUrl: environment.apiUrl,
      },
    },
    {
      provide: ErrorHandler,
      useClass: ErrorHandlerService,
    },
  ],
};
