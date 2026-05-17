import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

const SKIP_ENDPOINTS = ['/auth/refresh', '/auth/logout'];

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);

    const isSkipped = SKIP_ENDPOINTS.some((endpoint) =>
        req.url.includes(endpoint)
    );

    const token = authService.getToken();

    if (!isSkipped && token) {
        req = req.clone({
            setHeaders: { Authorization: `Bearer ${token}` },
        });
    }

    return next(req);
};
