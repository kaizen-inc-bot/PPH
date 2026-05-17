import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, take, map, of, switchMap } from 'rxjs';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const requiredRoles: string[] = route.data['requiredRoles'] ?? [];

    return toObservable(authService.state).pipe(
        filter((state) => state.status !== 'loading'),
        take(1),
        switchMap((state) => {
            if (state.status !== 'authenticated') {
                return of(router.createUrlTree(['/login']));
            }
            const hasRole = requiredRoles.some((role) =>
                state.user.roles.includes(role)
            );
            if (!hasRole) {
                return of(router.createUrlTree(['/access-denied']));
            }
            return of(true as const);
        })
    );
};
