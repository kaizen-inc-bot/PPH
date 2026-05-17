import { Routes } from '@angular/router';
import { authGuard } from '../../core/auth/auth.guard';

export const informationDeskRoutes: Routes = [
    {
        path: '',
        redirectTo: 'facilities',
        pathMatch: 'full',
    },
    {
        path: 'facilities',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./facilities/facilities.component').then((m) => m.FacilitiesComponent),
    },
    {
        path: 'sops',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./sops/sops.component').then((m) => m.SopsComponent),
    },
    {
        path: 'emergency-contacts',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./emergency-contacts/emergency-contacts.component').then(
                (m) => m.EmergencyContactsComponent
            ),
    },
    {
        path: 'faq',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./faq/faq.component').then((m) => m.FaqComponent),
    },
];
