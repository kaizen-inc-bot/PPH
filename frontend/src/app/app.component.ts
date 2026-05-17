import { Component, inject, computed } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '@core/auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    @if (isAuthenticated()) {
      <div class="app-shell">
        <header class="app-header" role="banner">
          <span class="app-title">PPH Digital Reception</span>
          <div class="user-info">
            <span class="user-name" [attr.aria-label]="'Logged in as ' + userName()">
              {{ userName() }}
            </span>
            <span class="flat-number">Flat {{ flatNumber() }}</span>
            <button type="button" class="btn-logout" (click)="logout()">Sign Out</button>
          </div>
        </header>

        <div class="app-body">
          <nav class="app-sidebar" aria-label="Main navigation">
            <ul class="nav-list">
              <li>
                <a routerLink="/home" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
                  Home
                </a>
              </li>
              <!-- hidden for first release
              <li>
                <a routerLink="/notice-board" routerLinkActive="active">Notice Board</a>
              </li>
              <li>
                <a routerLink="/concierge" routerLinkActive="active">Concierge</a>
              </li>
              <li>
                <a routerLink="/information-desk" routerLinkActive="active">Information Desk</a>
              </li>
              <li>
                <a routerLink="/feedback" routerLinkActive="active">Feedback</a>
              </li>
              @if (isAdmin()) {
                <li>
                  <a routerLink="/admin" routerLinkActive="active">Admin</a>
                </li>
              }
              -->
            </ul>
          </nav>

          <main class="app-content" id="main-content" role="main" tabindex="-1">
            <router-outlet />
          </main>
        </div>
      </div>
    } @else {
      <router-outlet />
    }
  `,
  styles: [`
    .app-shell { display:flex; flex-direction:column; min-height:100vh; }
    .app-header { display:flex; align-items:center; justify-content:space-between; padding:0 var(--spacing-lg,24px); height:56px; background:var(--color-primary,#1976d2); color:#fff; box-shadow:0 2px 4px rgba(0,0,0,.2); }
    .app-title { font-size:1.125rem; font-weight:600; }
    .user-info { display:flex; align-items:center; gap:var(--spacing-md,16px); font-size:.875rem; }
    .btn-logout { background:transparent; border:1px solid rgba(255,255,255,.6); color:#fff; border-radius:var(--radius-sm,4px); padding:4px 12px; cursor:pointer; font-size:.875rem; }
    .btn-logout:focus-visible { outline:2px solid #fff; }
    .app-body { display:flex; flex:1; }
    .app-sidebar { width:220px; background:#fff; border-right:1px solid #e0e0e0; padding:var(--spacing-md,16px) 0; flex-shrink:0; }
    .nav-list { list-style:none; margin:0; padding:0; }
    .nav-list li a { display:block; padding:var(--spacing-sm,8px) var(--spacing-lg,24px); color:#424242; text-decoration:none; font-size:.9375rem; border-left:3px solid transparent; }
    .nav-list li a:hover { background:#f5f5f5; }
    .nav-list li a.active { border-left-color:var(--color-primary,#1976d2); background:#e3f2fd; color:var(--color-primary,#1976d2); font-weight:500; }
    .app-content { flex:1; padding:var(--spacing-lg,24px); overflow:auto; background:var(--color-surface,#f5f5f5); }
    @media (max-width:640px) {
      .app-sidebar { display:none; }
      .user-info .flat-number { display:none; }
    }
  `],
})
export class AppComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  isAuthenticated = computed(() => this.authService.state().status === 'authenticated');
  userName = computed(() => {
    const s = this.authService.state();
    return s.status === 'authenticated' ? s.user.fullName : '';
  });
  flatNumber = computed(() => {
    const s = this.authService.state();
    return s.status === 'authenticated' ? s.user.flatNumber : '';
  });
  isAdmin = computed(() => {
    const s = this.authService.state();
    return s.status === 'authenticated' && s.user.roles?.includes('admin');
  });

  logout(): void {
    this.authService.logout().subscribe({
      complete: () => this.router.navigate(['/login']),
      error: () => this.router.navigate(['/login']),
    });
  }
}

