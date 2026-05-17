import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthState, UserDto } from '../../shared/models/loading-state';

interface RefreshResponse {
    accessToken: string;
    user: UserDto;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly _state = signal<AuthState>({ status: 'loading' });
    readonly state = this._state.asReadonly();

    private _accessToken: string | null = null;

    constructor(private readonly http: HttpClient) { }

    getToken(): string | null {
        return this._accessToken;
    }

    setToken(token: string, user: UserDto): void {
        this._accessToken = token;
        this._state.set({ status: 'authenticated', user, token });
    }

    tryRefresh(): Observable<void> {
        return this.http
            .post<RefreshResponse>(
                `${environment.apiUrl}/auth/refresh`,
                {},
                { withCredentials: true }
            )
            .pipe(
                tap((res) => {
                    this._accessToken = res.accessToken;
                    this._state.set({
                        status: 'authenticated',
                        user: res.user,
                        token: res.accessToken,
                    });
                }),
                map(() => void 0),
                catchError(() => {
                    this._state.set({ status: 'unauthenticated' });
                    return of(void 0);
                })
            );
    }

    logout(): Observable<void> {
        return this.http
            .post<void>(
                `${environment.apiUrl}/auth/logout`,
                {},
                { withCredentials: true }
            )
            .pipe(
                tap(() => {
                    this._accessToken = null;
                    this._state.set({ status: 'unauthenticated' });
                }),
                catchError(() => {
                    this._accessToken = null;
                    this._state.set({ status: 'unauthenticated' });
                    return of(void 0);
                })
            );
    }
}
