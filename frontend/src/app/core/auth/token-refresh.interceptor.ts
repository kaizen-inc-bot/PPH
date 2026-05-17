import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError, ReplaySubject, take } from 'rxjs';
import { AuthService } from './auth.service';

let refreshInProgress = false;
let refreshSubject: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);

export const tokenRefreshInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const isRefreshEndpoint = req.url.includes('/auth/refresh');

    return next(req).pipe(
        catchError((error: unknown) => {
            if (!(error instanceof HttpErrorResponse)) {
                return throwError(() => error);
            }

            // Network unreachable → navigate to backend-error screen.
            // Skip for the refresh endpoint: tryRefresh() has its own catchError
            // that sets state to 'unauthenticated' and lets the auth guard
            // redirect to /login gracefully (avoids backend-error on cold start).
            if (error.status === 0 && !isRefreshEndpoint) {
                router.navigate(['/backend-error']);
                return throwError(() => error);
            }

            // 401 on refresh endpoint → session fully expired, force logout
            if (error.status === 401 && isRefreshEndpoint) {
                authService['_state'].set({ status: 'unauthenticated' });
                authService['_accessToken'] = null;
                router.navigate(['/login']);
                return throwError(() => error);
            }

            // 401 on any other endpoint → attempt silent token refresh
            if (error.status === 401 && !isRefreshEndpoint) {
                if (!refreshInProgress) {
                    refreshInProgress = true;
                    refreshSubject = new ReplaySubject<boolean>(1);

                    authService.tryRefresh().subscribe({
                        next: () => {
                            refreshInProgress = false;
                            refreshSubject.next(true);
                            refreshSubject.complete();
                        },
                        error: () => {
                            refreshInProgress = false;
                            refreshSubject.next(false);
                            refreshSubject.complete();
                            router.navigate(['/login']);
                        },
                    });
                }

                return refreshSubject.pipe(
                    take(1),
                    switchMap((refreshed) => {
                        if (!refreshed) {
                            return throwError(() => error);
                        }
                        const token = authService.getToken();
                        const retried = token
                            ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
                            : req;
                        return next(retried);
                    })
                );
            }

            return throwError(() => error);
        })
    );
};
