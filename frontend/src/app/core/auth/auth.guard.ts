import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { map, filter, take, switchMap, of } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';

export const authGuard: CanActivateFn = (_route, _state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return toObservable(authService.state).pipe(
        filter((state) => state.status !== 'loading'),
        take(1),
        switchMap((state) => {
            if (state.status === 'authenticated') {
                // Redirect pending-approval users away from protected routes
                if (
                    state.user.verificationStatus === 'MOBILE_MATCHED' &&
                    _state.url !== '/pending-approval'
                ) {
                    return of(router.createUrlTree(['/pending-approval']));
                }
                return of(true as const);
            }
            return of(router.createUrlTree(['/login']));
        })
    );
};
