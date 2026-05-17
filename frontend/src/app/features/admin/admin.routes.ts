import { Routes } from '@angular/router';
import { authGuard } from '../../core/auth/auth.guard';
import { roleGuard } from '../../core/auth/role.guard';

export const adminRoutes: Routes = [
    {
        path: '',
        redirectTo: 'users',
        pathMatch: 'full',
    },
    {
        path: 'users',
        canActivate: [authGuard, roleGuard],
        data: { requiredRoles: ['admin'] },
        loadComponent: () =>
            import('./users/user-management.component').then((m) => m.UserManagementComponent),
    },
    {
        path: 'roles',
        canActivate: [authGuard, roleGuard],
        data: { requiredRoles: ['admin'] },
        loadComponent: () =>
            import('./roles/role-management.component').then((m) => m.RoleManagementComponent),
    },
    {
        path: 'audit-log',
        canActivate: [authGuard, roleGuard],
        data: { requiredRoles: ['admin'] },
        loadComponent: () =>
            import('./audit-log/audit-log.component').then((m) => m.AuditLogComponent),
    },
    {
        path: 'governance/bulletins',
        canActivate: [authGuard, roleGuard],
        data: { requiredRoles: ['elected_body', 'admin'] },
        loadComponent: () =>
            import('./governance/bulletins.component').then((m) => m.BulletinsComponent),
    },
];
