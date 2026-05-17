import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { ErrorBannerComponent } from '@shared/components/error-banner/error-banner.component';
import { IssueTicketDto } from '../issues.component';

@Component({
    selector: 'app-issue-detail',
    standalone: true,
    imports: [CommonModule, RouterLink, LoadingSpinnerComponent, ErrorBannerComponent],
    template: `
    <section aria-labelledby="issue-detail-heading">
      <a routerLink="../.." class="back-link">← Back to Issues</a>

      @if (loading()) {
        <app-loading-spinner message="Loading issue…" />
      }
      @if (error()) {
        <app-error-banner [message]="error()!" />
      }
      @if (issue(); as i) {
        <h1 id="issue-detail-heading">{{ i.title }}</h1>

        <dl class="issue-meta">
          <dt>Tracking Reference</dt>
          <dd><code>{{ i.trackingReference }}</code></dd>
          <dt>Status</dt>
          <dd><span class="status-badge" [attr.data-status]="i.status">{{ i.status }}</span></dd>
          <dt>Category</dt>
          <dd>{{ i.category }}</dd>
          <dt>Location</dt>
          <dd>{{ i.location }}</dd>
          <dt>Severity</dt>
          <dd>{{ i.severity }}</dd>
          <dt>Submitted</dt>
          <dd><time [attr.datetime]="i.createdAt">{{ i.createdAt | date:'medium' }}</time></dd>
          <dt>Last Updated</dt>
          <dd><time [attr.datetime]="i.updatedAt">{{ i.updatedAt | date:'medium' }}</time></dd>
        </dl>

        <h2 class="section-title">Description</h2>
        <p class="description">{{ i.description }}</p>
      }
    </section>
  `,
    styles: [`
    .back-link { display:inline-block; margin-bottom:var(--spacing-md,16px); color:var(--color-primary,#1976d2); text-decoration:none; font-size:.9rem; }
    h1 { margin-bottom:var(--spacing-lg,24px); }
    .issue-meta { display:grid; grid-template-columns:180px 1fr; gap:var(--spacing-xs,4px) var(--spacing-md,16px); margin-bottom:var(--spacing-xl,32px); background:#fff; padding:var(--spacing-md,16px); border-radius:var(--radius-md,8px); box-shadow:0 1px 4px rgba(0,0,0,.08); }
    .issue-meta dt { font-weight:600; font-size:.875rem; color:#757575; align-self:center; }
    .issue-meta dd { margin:0; align-self:center; }
    .status-badge { font-size:.8rem; font-weight:600; padding:2px 10px; border-radius:12px; background:#e0e0e0; color:#424242; }
    .status-badge[data-status="NEW"] { background:#e3f2fd; color:#1565c0; }
    .status-badge[data-status="ACKNOWLEDGED"] { background:#fff8e1; color:#e65100; }
    .status-badge[data-status="IN_PROGRESS"] { background:#ede7f6; color:#4527a0; }
    .status-badge[data-status="RESOLVED"] { background:#e8f5e9; color:#2e7d32; }
    .status-badge[data-status="CLOSED"] { background:#f5f5f5; color:#757575; }
    .section-title { font-size:1rem; font-weight:600; margin-bottom:var(--spacing-sm,8px); }
    .description { color:#424242; line-height:1.7; background:#fff; padding:var(--spacing-md,16px); border-radius:var(--radius-md,8px); box-shadow:0 1px 4px rgba(0,0,0,.08); }
    @media (max-width:480px) { .issue-meta { grid-template-columns:1fr; } .issue-meta dt { margin-top:var(--spacing-sm,8px); } }
  `],
})
export class IssueDetailComponent implements OnInit {
    private http = inject(HttpClient);
    private route = inject(ActivatedRoute);

    loading = signal(true);
    error = signal<string | null>(null);
    issue = signal<IssueTicketDto | null>(null);

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        this.http.get<IssueTicketDto>(`${environment.apiUrl}/issues/${id}`).subscribe({
            next: (issue) => { this.loading.set(false); this.issue.set(issue); },
            error: (err) => { this.loading.set(false); this.error.set(err.error?.message ?? 'Failed to load issue.'); },
        });
    }
}
