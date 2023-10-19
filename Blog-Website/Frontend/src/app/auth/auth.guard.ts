import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  // const jwt = inject(Jwt)
  const router = inject(Router);
  const authService = inject(AuthenticationService);
  if (authService.isLoggedIn()) {
    return true;
  }
  return router.parseUrl('/auth');
};
