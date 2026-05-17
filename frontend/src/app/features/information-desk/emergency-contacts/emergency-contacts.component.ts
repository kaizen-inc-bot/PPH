import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { ErrorBannerComponent } from '@shared/components/error-banner/error-banner.component';

interface EmergencyContact {
    id: string;
    name: string;
    role: string;
    phoneNumber: string;
    available24h: boolean;
}

type ContactState =
    | { status: 'loading' }
    | { status: 'loaded'; contacts: EmergencyContact[] }
    | { status: 'error'; message: string };

@Component({
    selector: 'app-emergency-contacts',
    standalone: true,
    imports: [CommonModule, LoadingSpinnerComponent, ErrorBannerComponent],
    template: `
    <section aria-labelledby="contacts-heading">
      <h1 id="contacts-heading">Emergency Contacts</h1>

      @if (state().status === 'loading') {
        <app-loading-spinner message="Loading contacts…" />
      }
      @if (state().status === 'error') {
        <app-error-banner [message]="$any(state()).message" />
      }
      @if (state().status === 'loaded') {
        <ul class="contact-list" role="list">
          @for (c of $any(state()).contacts; track c.id) {
            <li class="contact-card">
              <div class="contact-info">
                <span class="contact-name">{{ c.name }}</span>
                <span class="contact-role">{{ c.role }}</span>
                @if (c.available24h) {
                  <span class="badge-24h" aria-label="Available 24 hours">24/7</span>
                }
              </div>
              <a
                [href]="'tel:' + c.phoneNumber"
                class="btn-call"
                [attr.aria-label]="'Call ' + c.name"
              >
                📞 {{ c.phoneNumber }}
              </a>
            </li>
          }
        </ul>
      }
    </section>
  `,
    styles: [`
    h1 { margin-bottom:var(--spacing-lg,24px); }
    .contact-list { list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:var(--spacing-sm,8px); }
    .contact-card { display:flex; align-items:center; justify-content:space-between; background:#fff; border-radius:var(--radius-sm,4px); padding:var(--spacing-md,16px); box-shadow:0 1px 3px rgba(0,0,0,.08); flex-wrap:wrap; gap:var(--spacing-sm,8px); }
    .contact-info { display:flex; align-items:center; gap:var(--spacing-sm,8px); flex-wrap:wrap; }
    .contact-name { font-weight:600; }
    .contact-role { color:#757575; font-size:.875rem; }
    .badge-24h { background:#e8f5e9; color:#2e7d32; font-size:.75rem; font-weight:700; padding:2px 8px; border-radius:12px; }
    .btn-call { padding:6px 14px; background:#e8f5e9; color:#2e7d32; text-decoration:none; border-radius:var(--radius-sm,4px); font-size:.875rem; white-space:nowrap; font-weight:500; }
    .btn-call:focus-visible { outline:2px solid var(--color-primary,#1976d2); }
    @media (max-width:480px) { .contact-card { flex-direction:column; align-items:flex-start; } }
  `],
})
export class EmergencyContactsComponent implements OnInit {
    private http = inject(HttpClient);
    state = signal<ContactState>({ status: 'loading' });

    ngOnInit(): void {
        this.http.get<EmergencyContact[]>(`${environment.apiUrl}/contacts/emergency`).subscribe({
            next: (contacts) => this.state.set({ status: 'loaded', contacts }),
            error: (err) => this.state.set({ status: 'error', message: err.error?.message ?? 'Failed to load contacts.' }),
        });
    }
}
