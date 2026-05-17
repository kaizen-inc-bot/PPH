import { Routes } from '@angular/router';

export const authRoutes: Routes = [
    {
        path: 'login',
        loadComponent: () =>
            import('./login/login.component').then((m) => m.LoginComponent),
    },
    {
        path: 'register',
        loadComponent: () =>
            import('./register/register.component').then((m) => m.RegisterComponent),
    },
    {
        path: 'pending-approval',
        loadComponent: () =>
            import('./pending-approval/pending-approval.component').then(
                (m) => m.PendingApprovalComponent
            ),
    },
    {
        path: 'access-denied',
        loadComponent: () =>
            import('../../shared/components/access-denied/access-denied.component').then(
                (m) => m.AccessDeniedComponent
            ),
    },
];
