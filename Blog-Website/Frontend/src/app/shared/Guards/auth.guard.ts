import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/auth/authentication.service';

export const allowIfLoggedIn: CanActivateFn = (route, state) => {
  const _authService = inject(AuthenticationService);
  const _router = inject(Router);

  if (_authService.isLoggedIn()) {
    return true;
  }
  return _router.parseUrl('/auth');
};
