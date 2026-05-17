import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { timer, Subscription } from 'rxjs';
import { switchMap, catchError, of } from 'rxjs';
import { NoticePollingState, NoticeDto } from '@shared/models/loading-state';
import * as Sentry from '@sentry/angular';

@Injectable({ providedIn: 'root' })
export class NoticeService {
    private http = inject(HttpClient);

    private _state = signal<NoticePollingState>({
        status: 'loading',
        notices: [],
        consecutiveFailures: 0,
    });
    readonly state = this._state.asReadonly();

    private pollSubscription: Subscription | null = null;

    startPolling(): void {
        if (this.pollSubscription) return;
        this.pollSubscription = timer(0, environment.pollIntervalMs)
            .pipe(
                switchMap(() =>
                    this.http.get<NoticeDto[]>(`${environment.apiUrl}/notices/active`).pipe(
                        catchError((err) => {
                            const current = this._state();
                            const failures = (current.consecutiveFailures ?? 0) + 1;
                            this._state.set({
                                status: failures >= 3 ? 'error' : current.status === 'loaded' ? 'loaded' : 'error',
                                notices: current.notices,
                                consecutiveFailures: failures,
                            });
                            // T080: capture on third consecutive failure
                            if (failures === 3 && environment.sentryDsn) {
                                Sentry.captureMessage('Notice polling failed 3 times consecutively', 'warning');
                            }
                            return of(null);
                        })
                    )
                )
            )
            .subscribe((notices) => {
                if (notices !== null) {
                    this._state.set({
                        status: 'loaded',
                        notices,
                        consecutiveFailures: 0,
                    });
                }
            });
    }

    stopPolling(): void {
        this.pollSubscription?.unsubscribe();
        this.pollSubscription = null;
    }
}
