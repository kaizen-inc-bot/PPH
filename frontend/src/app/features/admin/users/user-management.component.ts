import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { ErrorBannerComponent } from '@shared/components/error-banner/error-banner.component';
import { UserDto } from '@shared/models/loading-state';

interface PagedResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    page: number;
    size: number;
}

type UsersState =
    | { status: 'loading' }
    | { status: 'loaded'; data: PagedResponse<UserDto>; page: number }
    | { status: 'error'; message: string };

@Component({
    selector: 'app-user-management',
    standalone: true,
    imports: [CommonModule, LoadingSpinnerComponent, ErrorBannerComponent],
    template: `
    <section aria-labelledby="users-heading">
      <h1 id="users-heading">User Management</h1>

      @if (actionError()) {
        <app-error-banner [message]="actionError()!" [dismissible]="true" (dismiss)="actionError.set(null)" />
      }

      @if (state().status === 'loading') {
        <app-loading-spinner message="Loading users…" />
      }
      @if (state().status === 'error') {
        <app-error-banner [message]="$any(state()).message" />
      }
      @if (state().status === 'loaded') {
        <table class="users-table" role="grid" aria-label="Users">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Mobile</th>
              <th scope="col">Flat</th>
              <th scope="col">Status</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (user of $any(state()).data.content; track user.id) {
              <tr>
                <td>{{ user.fullName }}</td>
                <td>{{ user.mobileNumber }}</td>
                <td>{{ user.flatNumber }}</td>
                <td>
                  <span class="status-badge" [attr.data-status]="user.verificationStatus">
                    {{ user.verificationStatus }}
                  </span>
                </td>
                <td class="actions-cell">
                  @if (user.verificationStatus === 'MOBILE_MATCHED') {
                    <button type="button" class="btn-approve" (click)="approve(user.id)">Approve</button>
                    <button type="button" class="btn-reject" (click)="reject(user.id)">Reject</button>
                  }
                  @if (user.verificationStatus === 'APPROVED') {
                    <button type="button" class="btn-deactivate" (click)="deactivate(user.id)">Deactivate</button>
                  }
                </td>
              </tr>
            }
          </tbody>
        </table>
        <div class="pagination">
          <button type="button" [disabled]="$any(state()).page === 0" (click)="loadPage($any(state()).page - 1)">← Prev</button>
          <span>Page {{ $any(state()).page + 1 }} of {{ $any(state()).data.totalPages }}</span>
          <button type="button" [disabled]="$any(state()).page >= $any(state()).data.totalPages - 1" (click)="loadPage($any(state()).page + 1)">Next →</button>
        </div>
      }
    </section>
  `,
    styles: [`
    h1 { margin-bottom:var(--spacing-lg,24px); }
    .users-table { width:100%; border-collapse:collapse; background:#fff; border-radius:var(--radius-md,8px); overflow:hidden; box-shadow:0 1px 4px rgba(0,0,0,.08); }
    .users-table th { background:#f5f5f5; padding:var(--spacing-sm,8px) var(--spacing-md,16px); text-align:left; font-size:.875rem; color:#616161; }
    .users-table td { padding:var(--spacing-sm,8px) var(--spacing-md,16px); border-top:1px solid #f0f0f0; font-size:.9rem; }
    .status-badge { font-size:.75rem; font-weight:600; padding:2px 8px; border-radius:12px; background:#e0e0e0; color:#424242; }
    .status-badge[data-status="APPROVED"] { background:#e8f5e9; color:#2e7d32; }
    .status-badge[data-status="MOBILE_MATCHED"] { background:#fff8e1; color:#e65100; }
    .status-badge[data-status="REJECTED"] { background:#fce4ec; color:#c62828; }
    .actions-cell { display:flex; gap:var(--spacing-xs,4px); flex-wrap:wrap; }
    .btn-approve { padding:3px 10px; background:#e8f5e9; color:#2e7d32; border:1px solid #c8e6c9; border-radius:var(--radius-sm,4px); cursor:pointer; font-size:.8rem; font-weight:600; }
    .btn-reject { padding:3px 10px; background:#fce4ec; color:#c62828; border:1px solid #f8bbd0; border-radius:var(--radius-sm,4px); cursor:pointer; font-size:.8rem; font-weight:600; }
    .btn-deactivate { padding:3px 10px; background:#f5f5f5; color:#757575; border:1px solid #e0e0e0; border-radius:var(--radius-sm,4px); cursor:pointer; font-size:.8rem; }
    .pagination { display:flex; align-items:center; justify-content:center; gap:var(--spacing-lg,24px); margin-top:var(--spacing-md,16px); font-size:.875rem; }
    .pagination button { padding:6px 14px; border:1px solid #bdbdbd; border-radius:var(--radius-sm,4px); cursor:pointer; background:#fff; }
    .pagination button:disabled { opacity:.4; cursor:not-allowed; }
    @media (max-width:640px) { .users-table { display:block; overflow-x:auto; } }
  `],
})
export class UserManagementComponent implements OnInit {
    private http = inject(HttpClient);
    state = signal<UsersState>({ status: 'loading' });
    actionError = signal<string | null>(null);

    ngOnInit(): void {
        this.loadPage(0);
    }

    loadPage(page: number): void {
        this.http.get<PagedResponse<UserDto>>(`${environment.apiUrl}/admin/users?page=${page}&size=20`).subscribe({
            next: (data) => this.state.set({ status: 'loaded', data, page }),
            error: (err) => this.state.set({ status: 'error', message: err.error?.message ?? 'Failed to load users.' }),
        });
    }

    approve(id: string): void {
        this.http.post(`${environment.apiUrl}/admin/users/${id}/approve`, {}).subscribe({
            next: () => this.loadPage(0),
            error: (err) => this.actionError.set(err.error?.message ?? 'Failed to approve user.'),
        });
    }

    reject(id: string): void {
        this.http.post(`${environment.apiUrl}/admin/users/${id}/reject`, {}).subscribe({
            next: () => this.loadPage(0),
            error: (err) => this.actionError.set(err.error?.message ?? 'Failed to reject user.'),
        });
    }

    deactivate(id: string): void {
        this.http.post(`${environment.apiUrl}/admin/users/${id}/deactivate`, {}).subscribe({
            next: () => this.loadPage(0),
            error: (err) => this.actionError.set(err.error?.message ?? 'Failed to deactivate user.'),
        });
    }
}
