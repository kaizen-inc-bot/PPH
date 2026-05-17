import { Routes } from '@angular/router';
import { authGuard } from '../../core/auth/auth.guard';

export const conciergeRoutes: Routes = [
    {
        path: '',
        redirectTo: 'booking',
        pathMatch: 'full',
    },
    {
        path: 'booking',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./bookings/bookings.component').then((m) => m.BookingsComponent),
    },
    {
        path: 'summer-camp',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./summer-camp/summer-camp.component').then((m) => m.SummerCampComponent),
    },
    {
        path: 'coaching',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./coaching/coaching.component').then((m) => m.CoachingComponent),
    },
    {
        path: 'forms',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./forms/forms.component').then((m) => m.FormsComponent),
    },
];
