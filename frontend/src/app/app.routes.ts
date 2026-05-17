import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { roleGuard } from './core/auth/role.guard';

export const appRoutes: Routes = [
    // ── Public routes ────────────────────────────────────────────────────────
    {
        path: 'login',
        loadComponent: () =>
            import('./features/auth/login/login.component').then(
                (m) => m.LoginComponent
            ),
    },
    {
        path: 'register',
        loadComponent: () =>
            import('./features/auth/register/register.component').then(
                (m) => m.RegisterComponent
            ),
    },
    {
        path: 'pending-approval',
        loadComponent: () =>
            import(
                './features/auth/pending-approval/pending-approval.component'
            ).then((m) => m.PendingApprovalComponent),
    },
    {
        path: 'access-denied',
        loadComponent: () =>
            import(
                './shared/components/access-denied/access-denied.component'
            ).then((m) => m.AccessDeniedComponent),
    },
    {
        path: 'backend-error',
        loadComponent: () =>
            import(
                './shared/components/backend-error/backend-error.component'
            ).then((m) => m.BackendErrorComponent),
    },

    // ── Authenticated routes ─────────────────────────────────────────────────
    {
        path: 'home',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./features/home/home.component').then((m) => m.HomeComponent),
    },
    {
        path: 'notice-board',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./features/notice-board/notice-board.component').then(
                (m) => m.NoticeBoardComponent
            ),
    },

    // ── Information Desk (authenticated) ─────────────────────────────────────
    {
        path: 'information-desk',
        canActivate: [authGuard],
        loadChildren: () =>
            import(
                './features/information-desk/information-desk.routes'
            ).then((m) => m.informationDeskRoutes),
    },

    // ── Concierge (authenticated) ─────────────────────────────────────────────
    {
        path: 'concierge',
        canActivate: [authGuard],
        loadChildren: () =>
            import('./features/concierge/concierge.routes').then(
                (m) => m.conciergeRoutes
            ),
    },

    // ── Feedback Counter (authenticated) ──────────────────────────────────────
    {
        path: 'feedback',
        canActivate: [authGuard],
        loadChildren: () =>
            import('./features/feedback/feedback.routes').then(
                (m) => m.feedbackRoutes
            ),
    },

    // ── Admin module (admin role required) ────────────────────────────────────
    {
        path: 'admin',
        canActivate: [authGuard, roleGuard],
        data: { requiredRoles: ['admin'] },
        loadChildren: () =>
            import('./features/admin/admin.routes').then((m) => m.adminRoutes),
    },

    // ── Root redirect ──────────────────────────────────────────────────────────
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    {
        path: '**',
        loadComponent: () =>
            import('./shared/components/page-not-found/page-not-found.component').then(
                (m) => m.PageNotFoundComponent
            ),
    },
];
