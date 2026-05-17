import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { ErrorBannerComponent } from '@shared/components/error-banner/error-banner.component';

interface FacilityDto {
    id: string;
    name: string;
    description: string;
    openingTime: string;
    closingTime: string;
    bookingRoute?: string;
}

type FacilityState =
    | { status: 'loading' }
    | { status: 'loaded'; facilities: FacilityDto[] }
    | { status: 'error'; message: string };

@Component({
    selector: 'app-facilities',
    standalone: true,
    imports: [CommonModule, RouterLink, LoadingSpinnerComponent, ErrorBannerComponent],
    template: `
    <section aria-labelledby="facilities-heading">
      <h1 id="facilities-heading">Facilities</h1>

      @if (state().status === 'loading') {
        <app-loading-spinner message="Loading facilities…" />
      }
      @if (state().status === 'error') {
        <app-error-banner [message]="$any(state()).message" />
      }
      @if (state().status === 'loaded') {
        <ul class="facility-list" role="list">
          @for (f of $any(state()).facilities; track f.id) {
            <li class="facility-card">
              <h2 class="facility-name">{{ f.name }}</h2>
              <p class="facility-desc">{{ f.description }}</p>
              <dl class="facility-hours">
                <dt>Hours</dt>
                <dd>{{ f.openingTime }} – {{ f.closingTime }}</dd>
              </dl>
              @if (f.bookingRoute) {
                <a [routerLink]="f.bookingRoute" class="btn-book">Book Now</a>
              }
            </li>
          }
        </ul>
      }
    </section>
  `,
    styles: [`
    h1 { margin-bottom:var(--spacing-lg,24px); }
    .facility-list { list-style:none; margin:0; padding:0; display:grid; gap:var(--spacing-md,16px); grid-template-columns:repeat(auto-fill,minmax(260px,1fr)); }
    .facility-card { background:#fff; border-radius:var(--radius-md,8px); padding:var(--spacing-lg,24px); box-shadow:0 1px 4px rgba(0,0,0,.1); }
    .facility-name { font-size:1.125rem; margin:0 0 var(--spacing-sm,8px); }
    .facility-desc { color:#616161; font-size:.9rem; margin-bottom:var(--spacing-md,16px); }
    .facility-hours { display:flex; gap:var(--spacing-sm,8px); font-size:.875rem; margin-bottom:var(--spacing-md,16px); }
    .facility-hours dt { font-weight:600; }
    .btn-book { display:inline-block; padding:6px 16px; background:var(--color-primary,#1976d2); color:#fff; text-decoration:none; border-radius:var(--radius-sm,4px); font-size:.875rem; }
  `],
})
export class FacilitiesComponent implements OnInit {
    private http = inject(HttpClient);
    state = signal<FacilityState>({ status: 'loading' });

    ngOnInit(): void {
        this.http.get<FacilityDto[]>(`${environment.apiUrl}/facilities`).subscribe({
            next: (facilities) => this.state.set({ status: 'loaded', facilities }),
            error: (err) => this.state.set({ status: 'error', message: err.error?.message ?? 'Failed to load facilities.' }),
        });
    }
}
