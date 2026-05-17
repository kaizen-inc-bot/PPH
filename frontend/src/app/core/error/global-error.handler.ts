import { ErrorHandler, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import * as Sentry from '@sentry/angular';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    handleError(error: unknown): void {
        if (!environment.production) {
            console.error('[GlobalErrorHandler]', error);
            return;
        }
        Sentry.captureException(error);
    }
}
