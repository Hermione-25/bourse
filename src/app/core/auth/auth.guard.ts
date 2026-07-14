import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';
import { map, take } from 'rxjs';
import { AuthService } from './auth.service';

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

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const expectedRoles = route.data?.['role'] as string[] | undefined;

  return authService.authState$.pipe(
    take(1),
    map((auth) => {
 const hasRole = expectedRoles?.some((role) => auth?.role === role);
      if (!auth || (expectedRoles && !hasRole)) {
        return router.createUrlTree(['/auth/login']);
      }
      return true;
    })
  );
};

