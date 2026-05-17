import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment } from '@env/environment';
import { AuthService } from '@core/auth/auth.service';
import { UserDto } from '@shared/models/loading-state';

@Component({
    selector: 'app-pending-approval',
    standalone: true,
    imports: [CommonModule],
    template: `
    <main class="pending-container" role="main">
      <section class="pending-card" aria-labelledby="pending-heading">
        <div class="status-icon" aria-hidden="true">⏳</div>
        <h1 id="pending-heading">Awaiting Approval</h1>
        <p>Your account has been created and your mobile number has been verified.</p>
        <p>
          A society administrator will review and approve your account shortly.
          This page will automatically update when your account is approved.
        </p>
        <div class="polling-indicator" aria-live="polite">
          <span class="dot"></span> Checking status automatically…
        </div>
        <button type="button" class="btn-logout" (click)="logout()">
          Sign Out
        </button>
      </section>
    </main>
  `,
    styles: [`
    .pending-container { display:flex; justify-content:center; align-items:center; min-height:80vh; padding:var(--spacing-md,16px); }
    .pending-card { background:#fff; border-radius:var(--radius-md,8px); box-shadow:0 2px 8px rgba(0,0,0,.12); padding:var(--spacing-xl,32px); width:100%; max-width:480px; text-align:center; }
    .status-icon { font-size:3rem; margin-bottom:var(--spacing-md,16px); }
    h1 { font-size:1.4rem; margin-bottom:var(--spacing-md,16px); }
    p { color:#616161; line-height:1.6; }
    .polling-indicator { display:flex; align-items:center; justify-content:center; gap:var(--spacing-sm,8px); margin-top:var(--spacing-lg,24px); font-size:.875rem; color:#757575; }
    .dot { width:8px; height:8px; background:var(--color-primary,#1976d2); border-radius:50%; animation:pulse 1.5s infinite; }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
    .btn-logout { margin-top:var(--spacing-lg,24px); padding:var(--spacing-sm,8px) var(--spacing-xl,32px); background:transparent; border:1px solid #bdbdbd; border-radius:var(--radius-sm,4px); cursor:pointer; color:#757575; font-size:.9rem; }
  `],
})
export class PendingApprovalComponent {
    private authService = inject(AuthService);
    private http = inject(HttpClient);
    private router = inject(Router);

    constructor() {
        // Poll /users/me every 30 seconds until status is APPROVED
        timer(0, 30000)
            .pipe(
                switchMap(() =>
                    this.http.get<UserDto>(`${environment.apiUrl}/users/me`)
                ),
                takeUntilDestroyed(),
            )
            .subscribe({
                next: (user) => {
                    if (user.verificationStatus === 'APPROVED') {
                        this.authService.setToken(this.authService.getToken()!, user);
                        this.router.navigate(['/home']);
                    }
                },
                error: () => {
                    // Silently ignore polling errors; will retry next tick
                },
            });
    }

    logout(): void {
        this.authService.logout().subscribe({
            complete: () => this.router.navigate(['/login']),
            error: () => this.router.navigate(['/login']),
        });
    }
}
