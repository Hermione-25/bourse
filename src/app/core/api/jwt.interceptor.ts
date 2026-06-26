import { inject } from '@angular/core';
import { HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { TokenService } from '../auth/token.service';
import { RefreshTokenService } from './refresh-token.service';

export const jwtInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const tokenService = inject(TokenService);
  const refreshTokenService = inject(RefreshTokenService);

  const token = tokenService.getAccessToken();

  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (
        error.status === 401 &&
        !req.url.endsWith('/auth/login') &&
        !req.url.endsWith('/auth/refresh')
      ) {
        return handle401Error(req, next, tokenService, refreshTokenService);
      }
      return throwError(() => error);
    })
  );
};

function handle401Error(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  tokenService: TokenService,
  refreshTokenService: RefreshTokenService
): Observable<HttpEvent<unknown>> {
  return refreshTokenService.requestRefreshToken().pipe(
    switchMap((newToken) => {
      const newReq = req.clone({
        setHeaders: { Authorization: `Bearer ${newToken}` },
      });
      return next(newReq);
    }),
    catchError((error) => {
      tokenService.clearTokens();
      return throwError(() => error);
    })
  );
}
