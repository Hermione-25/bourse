import { APP_INITIALIZER, ApplicationConfig, ErrorHandler, inject, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { routes } from './app.routes';
import { API_CONFIG } from './core/api/api.config';
import { jwtInterceptor } from './core/api/jwt.interceptor';
import { httpErrorInterceptor } from './core/api/http-error.interceptor';
import { ErrorHandlerService } from './core/errors/error-handler.service';
import { environment } from '../environments/environment';
import { ChatService } from './features/utilisateurs/chat/chat.service';
import { AuthService } from './core/auth/auth.service';

function initializeAuth(): () => Promise<unknown> {
  const authService = inject(AuthService);
  return () => firstValueFrom(authService.initAuth(), { defaultValue: null });
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
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
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAuth,
      multi: true,
    },
    ChatService
  ],
};
