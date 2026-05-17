import { Routes } from '@angular/router';
import { authGuard } from '../../core/auth/auth.guard';

export const feedbackRoutes: Routes = [
    {
        path: '',
        redirectTo: 'suggestions',
        pathMatch: 'full',
    },
    {
        path: 'suggestions',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./suggestions/suggestions.component').then((m) => m.SuggestionsComponent),
    },
    {
        path: 'issues',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./issues/issues.component').then((m) => m.IssuesComponent),
    },
    {
        path: 'issues/new',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./issues/new-issue/new-issue.component').then((m) => m.NewIssueComponent),
    },
    {
        path: 'issues/:id',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./issues/issue-detail/issue-detail.component').then(
                (m) => m.IssueDetailComponent
            ),
    },
];
