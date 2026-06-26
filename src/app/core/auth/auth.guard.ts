import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';
import { map, take } from 'rxjs';
import { AuthService } from './auth.service';

/**
 * Guard d'authentification — redirige vers /auth/login si non authentifié.
 * ✅ Functional guard (Angular 14.2+) — remplace la classe CanActivate deprecated
 * ✅ take(1) — complète l'observable après la première émission (pas de memory leak)
 */
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated$.pipe(
    take(1),
    map((authenticated) => {
      if (!authenticated) {
        return router.createUrlTree(['/auth/login']);
      }
      return true;
    })
  );
};

/**
 * Guard de rôle — vérifie que l'utilisateur possède l'un des rôles requis.
 * Usage dans les routes : canActivate: [authGuard, roleGuard], data: { roles: ['admin'] }
 * ✅ Functional guard + take(1) + utilise AuthService directement (supprime AuthStateService)
 */
export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const expectedRoles = route.data?.['roles'] as string[] | undefined;

  return authService.authState$.pipe(
    take(1),
    map((auth) => {
      const hasRole = expectedRoles?.some((role) => auth?.roles?.includes(role));
      if (!auth || (expectedRoles && !hasRole)) {
        return router.createUrlTree(['/auth/login']);
      }
      return true;
    })
  );
};

/**
 * Guard de permission — vérifie que l'utilisateur possède TOUTES les permissions requises.
 * Usage dans les routes : canActivate: [authGuard, permissionGuard], data: { permissions: ['scholarships.create'] }
 * ✅ Functional guard + take(1) + utilise AuthService directement (supprime AuthStateService)
 */
export const permissionGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const expectedPermissions = route.data?.['permissions'] as string[] | undefined;

  return authService.authState$.pipe(
    take(1),
    map((auth) => {
      const hasPermission = expectedPermissions?.every((permission) =>
        auth?.permissions?.includes(permission)
      );
      if (!auth || (expectedPermissions && !hasPermission)) {
        return router.createUrlTree(['/auth/login']);
      }
      return true;
    })
  );
};
