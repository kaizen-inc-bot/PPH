import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { ErrorBannerComponent } from '@shared/components/error-banner/error-banner.component';

interface SopDocument {
    id: string;
    title: string;
    category: string;
    downloadUrl: string;
    updatedAt: string;
}

type SopState =
    | { status: 'loading' }
    | { status: 'loaded'; documents: SopDocument[] }
    | { status: 'error'; message: string };

@Component({
    selector: 'app-sops',
    standalone: true,
    imports: [CommonModule, LoadingSpinnerComponent, ErrorBannerComponent],
    template: `
    <section aria-labelledby="sops-heading">
      <h1 id="sops-heading">Rules & Procedures</h1>
      <p class="subtitle">Society operating procedures, house rules, and guidelines.</p>

      @if (state().status === 'loading') {
        <app-loading-spinner message="Loading documents…" />
      }
      @if (state().status === 'error') {
        <app-error-banner [message]="$any(state()).message" />
      }
      @if (state().status === 'loaded') {
        <ul class="sop-list" role="list">
          @for (doc of $any(state()).documents; track doc.id) {
            <li class="sop-item">
              <div class="sop-info">
                <span class="sop-title">{{ doc.title }}</span>
                <span class="sop-category">{{ doc.category }}</span>
              </div>
              <a
                [href]="doc.downloadUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="btn-download"
                [attr.aria-label]="'Download ' + doc.title"
              >Download</a>
            </li>
          }
        </ul>
      }
    </section>
  `,
    styles: [`
    h1 { margin-bottom:var(--spacing-sm,8px); }
    .subtitle { color:#757575; margin-bottom:var(--spacing-lg,24px); }
    .sop-list { list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:var(--spacing-sm,8px); }
    .sop-item { display:flex; align-items:center; justify-content:space-between; background:#fff; border-radius:var(--radius-sm,4px); padding:var(--spacing-md,16px); box-shadow:0 1px 3px rgba(0,0,0,.08); }
    .sop-info { display:flex; flex-direction:column; gap:2px; }
    .sop-title { font-weight:500; }
    .sop-category { font-size:.8rem; color:#9e9e9e; }
    .btn-download { padding:6px 14px; background:var(--color-primary,#1976d2); color:#fff; text-decoration:none; border-radius:var(--radius-sm,4px); font-size:.875rem; white-space:nowrap; }
  `],
})
export class SopsComponent implements OnInit {
    private http = inject(HttpClient);
    state = signal<SopState>({ status: 'loading' });

    ngOnInit(): void {
        this.http.get<SopDocument[]>(`${environment.apiUrl}/documents`).subscribe({
            next: (documents) => this.state.set({ status: 'loaded', documents }),
            error: (err) => this.state.set({ status: 'error', message: err.error?.message ?? 'Failed to load documents.' }),
        });
    }
}
