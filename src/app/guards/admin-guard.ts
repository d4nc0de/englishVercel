import { SessionService } from '@/pages/service/session.service';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  const session = inject(SessionService);
  const router = inject(Router);

  if (!session.isAdmin()) {
    router.navigate(['/auth/access'], { skipLocationChange: true });
    return false;
  }

  return true;
};
