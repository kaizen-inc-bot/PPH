import {
    ApplicationConfig,
    ErrorHandler,
    APP_INITIALIZER,
    inject,
} from '@angular/core';
import {
    provideRouter,
    withRouterConfig,
    withComponentInputBinding,
} from '@angular/router';
import {
    provideHttpClient,
    withInterceptors,
    withFetch,
} from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import * as Sentry from '@sentry/angular';
import { appRoutes } from './app.routes';
import { authTokenInterceptor } from './core/auth/auth-token.interceptor';
import { tokenRefreshInterceptor } from './core/auth/token-refresh.interceptor';
import { GlobalErrorHandler } from './core/error/global-error.handler';
import { AuthService } from './core/auth/auth.service';
import { environment } from '../environments/environment';

if (environment.sentryDsn) {
    Sentry.init({
        dsn: environment.sentryDsn,
        environment: environment.production ? 'production' : 'development',
        beforeSend(event) {
            // Scrub PII fields
            if (event.request?.data) {
                const data = event.request.data as Record<string, unknown>;
                for (const key of ['mobileNumber', 'password', 'otp', 'token']) {
                    if (key in data) data[key] = '[Filtered]';
                }
            }
            return event;
        },
    });
}

function initializeAuth() {
    return () => inject(AuthService).tryRefresh();
}

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(
            appRoutes,
            withRouterConfig({ onSameUrlNavigation: 'reload' }),
            withComponentInputBinding()
        ),
        provideHttpClient(
            withInterceptors([authTokenInterceptor, tokenRefreshInterceptor]),
            withFetch()
        ),
        provideAnimations(),
        { provide: ErrorHandler, useClass: GlobalErrorHandler },
        {
            provide: APP_INITIALIZER,
            useFactory: initializeAuth,
            multi: true,
        },
    ],
};
