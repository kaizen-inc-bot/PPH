import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { ErrorBannerComponent } from '@shared/components/error-banner/error-banner.component';

export type IssueStatus = 'NEW' | 'ACKNOWLEDGED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

export interface IssueTicketDto {
    id: string;
    trackingReference: string;
    title: string;
    description: string;
    category: string;
    location: string;
    severity: string;
    status: IssueStatus;
    createdAt: string;
    updatedAt: string;
}

type IssuesState =
    | { status: 'loading' }
    | { status: 'loaded'; issues: IssueTicketDto[] }
    | { status: 'error'; message: string };

const STATUS_LABELS: Record<IssueStatus, string> = {
    NEW: 'New',
    ACKNOWLEDGED: 'Acknowledged',
    IN_PROGRESS: 'In Progress',
    RESOLVED: 'Resolved',
    CLOSED: 'Closed',
};

@Component({
    selector: 'app-issues',
    standalone: true,
    imports: [CommonModule, RouterLink, LoadingSpinnerComponent, ErrorBannerComponent],
    template: `
    <section aria-labelledby="issues-heading">
      <div class="issues-header">
        <h1 id="issues-heading">My Issues</h1>
        <a routerLink="new" class="btn-new" aria-label="Submit new issue">+ New Issue</a>
      </div>

      @if (state().status === 'loading') {
        <app-loading-spinner message="Loading issues…" />
      }
      @if (state().status === 'error') {
        <app-error-banner [message]="$any(state()).message" />
      }
      @if (state().status === 'loaded') {
        @if ($any(state()).issues.length === 0) {
          <p class="empty">No issues submitted yet.</p>
        } @else {
          <ul class="issue-list" role="list">
            @for (issue of $any(state()).issues; track issue.id) {
              <li>
                <a [routerLink]="issue.id" class="issue-card" [attr.aria-label]="'View issue ' + issue.trackingReference">
                  <div class="issue-row">
                    <span class="issue-title">{{ issue.title }}</span>
                    <span class="issue-badge" [attr.data-status]="issue.status">
                      {{ statusLabel(issue.status) }}
                    </span>
                  </div>
                  <div class="issue-meta">
                    <span class="ref">{{ issue.trackingReference }}</span>
                    <span>{{ issue.category }}</span>
                    <time [attr.datetime]="issue.createdAt">{{ issue.createdAt | date:'mediumDate' }}</time>
                  </div>
                </a>
              </li>
            }
          </ul>
        }
      }
    </section>
  `,
    styles: [`
    .issues-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:var(--spacing-lg,24px); }
    h1 { margin:0; }
    .btn-new { padding:8px 16px; background:var(--color-primary,#1976d2); color:#fff; text-decoration:none; border-radius:var(--radius-sm,4px); font-size:.875rem; font-weight:500; }
    .issue-list { list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:var(--spacing-sm,8px); }
    .issue-card { display:block; background:#fff; border-radius:var(--radius-md,8px); padding:var(--spacing-md,16px); box-shadow:0 1px 4px rgba(0,0,0,.08); text-decoration:none; color:#212121; }
    .issue-card:hover { box-shadow:0 2px 8px rgba(0,0,0,.15); }
    .issue-row { display:flex; align-items:center; justify-content:space-between; gap:var(--spacing-sm,8px); margin-bottom:var(--spacing-xs,4px); }
    .issue-title { font-weight:500; }
    .issue-badge { font-size:.75rem; font-weight:600; padding:2px 10px; border-radius:12px; white-space:nowrap; background:#e0e0e0; color:#424242; }
    .issue-badge[data-status="NEW"] { background:#e3f2fd; color:#1565c0; }
    .issue-badge[data-status="ACKNOWLEDGED"] { background:#fff8e1; color:#e65100; }
    .issue-badge[data-status="IN_PROGRESS"] { background:#ede7f6; color:#4527a0; }
    .issue-badge[data-status="RESOLVED"] { background:#e8f5e9; color:#2e7d32; }
    .issue-badge[data-status="CLOSED"] { background:#f5f5f5; color:#757575; }
    .issue-meta { display:flex; gap:var(--spacing-md,16px); font-size:.8rem; color:#9e9e9e; flex-wrap:wrap; }
    .ref { font-family:monospace; }
    .empty { color:#757575; font-style:italic; }
  `],
})
export class IssuesComponent implements OnInit {
    private http = inject(HttpClient);
    state = signal<IssuesState>({ status: 'loading' });

    statusLabel(s: IssueStatus): string {
        return STATUS_LABELS[s] ?? s;
    }

    ngOnInit(): void {
        this.http.get<IssueTicketDto[]>(`${environment.apiUrl}/issues`).subscribe({
            next: (issues) => this.state.set({ status: 'loaded', issues }),
            error: (err) => this.state.set({ status: 'error', message: err.error?.message ?? 'Failed to load issues.' }),
        });
    }
}
