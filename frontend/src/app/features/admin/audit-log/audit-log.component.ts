import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { ErrorBannerComponent } from '@shared/components/error-banner/error-banner.component';

interface AuditEntryDto {
    id: string;
    actorId: string;
    actorName: string;
    action: string;
    resourceType: string;
    resourceId: string;
    detail: string;
    createdAt: string;
}

interface PagedResponse<T> {
    content: T[];
    totalPages: number;
    page: number;
}

@Component({
    selector: 'app-audit-log',
    standalone: true,
    imports: [CommonModule, LoadingSpinnerComponent, ErrorBannerComponent],
    template: `
    <section aria-labelledby="audit-heading">
      <div class="audit-header">
        <h1 id="audit-heading">Audit Log</h1>
        <div class="filters" role="group" aria-label="Filters">
          <input type="text" class="filter-input" placeholder="Filter by action…"
            [value]="filterAction()"
            (input)="onFilterChange($event)" />
        </div>
      </div>

      @if (loading()) {
        <app-loading-spinner message="Loading audit log…" />
      }
      @if (error()) {
        <app-error-banner [message]="error()!" />
      }
      @if (!loading() && entries().length > 0) {
        <table class="audit-table" role="grid">
          <thead>
            <tr>
              <th scope="col">Actor</th>
              <th scope="col">Action</th>
              <th scope="col">Resource</th>
              <th scope="col">Detail</th>
              <th scope="col">When</th>
            </tr>
          </thead>
          <tbody>
            @for (entry of entries(); track entry.id) {
              <tr>
                <td>{{ entry.actorName }}</td>
                <td><code>{{ entry.action }}</code></td>
                <td>{{ entry.resourceType }}/{{ entry.resourceId }}</td>
                <td class="detail-cell" [title]="entry.detail">{{ entry.detail | slice:0:80 }}</td>
                <td><time [attr.datetime]="entry.createdAt">{{ entry.createdAt | date:'short' }}</time></td>
              </tr>
            }
          </tbody>
        </table>
        <div class="pagination">
          <button type="button" [disabled]="page() === 0" (click)="loadPage(page() - 1)">← Prev</button>
          <span>Page {{ page() + 1 }} of {{ totalPages() }}</span>
          <button type="button" [disabled]="page() >= totalPages() - 1" (click)="loadPage(page() + 1)">Next →</button>
        </div>
      }
      @if (!loading() && entries().length === 0 && !error()) {
        <p class="empty">No audit entries found.</p>
      }
    </section>
  `,
    styles: [`
    .audit-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:var(--spacing-lg,24px); flex-wrap:wrap; gap:var(--spacing-sm,8px); }
    h1 { margin:0; }
    .filter-input { padding:var(--spacing-xs,4px) var(--spacing-sm,8px); border:1px solid #bdbdbd; border-radius:var(--radius-sm,4px); font-size:.875rem; }
    .audit-table { width:100%; border-collapse:collapse; background:#fff; border-radius:var(--radius-md,8px); overflow:hidden; box-shadow:0 1px 4px rgba(0,0,0,.08); font-size:.875rem; }
    .audit-table th { background:#f5f5f5; padding:var(--spacing-sm,8px) var(--spacing-md,16px); text-align:left; color:#616161; font-size:.8rem; }
    .audit-table td { padding:var(--spacing-sm,8px) var(--spacing-md,16px); border-top:1px solid #f0f0f0; vertical-align:middle; }
    .detail-cell { max-width:240px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; color:#757575; }
    .pagination { display:flex; align-items:center; justify-content:center; gap:var(--spacing-lg,24px); margin-top:var(--spacing-md,16px); font-size:.875rem; }
    .pagination button { padding:6px 14px; border:1px solid #bdbdbd; border-radius:var(--radius-sm,4px); cursor:pointer; background:#fff; }
    .pagination button:disabled { opacity:.4; cursor:not-allowed; }
    .empty { color:#757575; font-style:italic; }
    @media (max-width:640px) { .audit-table { display:block; overflow-x:auto; } }
  `],
})
export class AuditLogComponent implements OnInit {
    private http = inject(HttpClient);
    loading = signal(true);
    error = signal<string | null>(null);
    entries = signal<AuditEntryDto[]>([]);
    page = signal(0);
    totalPages = signal(1);
    filterAction = signal('');

    ngOnInit(): void {
        this.loadPage(0);
    }

    loadPage(page: number): void {
        this.loading.set(true);
        const action = this.filterAction() ? `&action=${encodeURIComponent(this.filterAction())}` : '';
        this.http
            .get<PagedResponse<AuditEntryDto>>(`${environment.apiUrl}/admin/audit-log?page=${page}&size=25${action}`)
            .subscribe({
                next: (resp) => {
                    this.loading.set(false);
                    this.entries.set(resp.content);
                    this.page.set(resp.page);
                    this.totalPages.set(resp.totalPages);
                },
                error: (err) => {
                    this.loading.set(false);
                    this.error.set(err.error?.message ?? 'Failed to load audit log.');
                },
            });
    }

    onFilterChange(e: Event): void {
        this.filterAction.set((e.target as HTMLInputElement).value);
        this.loadPage(0);
    }
}
