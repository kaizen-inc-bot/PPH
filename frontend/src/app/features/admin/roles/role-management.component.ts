import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { ErrorBannerComponent } from '@shared/components/error-banner/error-banner.component';

interface ModulePermission {
    module: string;
    canRead: boolean;
    canWrite: boolean;
    canDelete: boolean;
    canAdmin: boolean;
}

interface RoleDto {
    id: string;
    name: string;
    description: string;
    permissions: ModulePermission[];
}

@Component({
    selector: 'app-role-management',
    standalone: true,
    imports: [CommonModule, FormsModule, LoadingSpinnerComponent, ErrorBannerComponent],
    template: `
    <section aria-labelledby="roles-heading">
      <h1 id="roles-heading">Role Management</h1>

      @if (saveMessage()) {
        <div class="save-banner" role="status">{{ saveMessage() }}</div>
      }
      @if (error()) {
        <app-error-banner [message]="error()!" [dismissible]="true" (dismiss)="error.set(null)" />
      }

      @if (loading()) {
        <app-loading-spinner message="Loading roles…" />
      }

      @for (role of roles(); track role.id) {
        <div class="role-card">
          <h2 class="role-name">{{ role.name }}</h2>
          @if (role.description) {
            <p class="role-desc">{{ role.description }}</p>
          }
          <table class="perms-table" [attr.aria-label]="role.name + ' permissions'">
            <thead>
              <tr>
                <th scope="col">Module</th>
                <th scope="col">Read</th>
                <th scope="col">Write</th>
                <th scope="col">Delete</th>
                <th scope="col">Admin</th>
              </tr>
            </thead>
            <tbody>
              @for (perm of role.permissions; track perm.module) {
                <tr>
                  <td>{{ perm.module }}</td>
                  <td><input type="checkbox" [(ngModel)]="perm.canRead" [attr.aria-label]="perm.module + ' read'" /></td>
                  <td><input type="checkbox" [(ngModel)]="perm.canWrite" [attr.aria-label]="perm.module + ' write'" /></td>
                  <td><input type="checkbox" [(ngModel)]="perm.canDelete" [attr.aria-label]="perm.module + ' delete'" /></td>
                  <td><input type="checkbox" [(ngModel)]="perm.canAdmin" [attr.aria-label]="perm.module + ' admin'" /></td>
                </tr>
              }
            </tbody>
          </table>
          <button type="button" class="btn-save" (click)="saveRole(role)">Save Permissions</button>
        </div>
      }
    </section>
  `,
    styles: [`
    h1 { margin-bottom:var(--spacing-lg,24px); }
    .save-banner { background:#e8f5e9; color:#2e7d32; padding:var(--spacing-sm,8px) var(--spacing-md,16px); border-radius:var(--radius-sm,4px); margin-bottom:var(--spacing-md,16px); }
    .role-card { background:#fff; border-radius:var(--radius-md,8px); padding:var(--spacing-md,16px); box-shadow:0 1px 4px rgba(0,0,0,.08); margin-bottom:var(--spacing-lg,24px); }
    .role-name { font-size:1.1rem; margin-bottom:var(--spacing-xs,4px); }
    .role-desc { font-size:.875rem; color:#757575; margin-bottom:var(--spacing-md,16px); }
    .perms-table { width:100%; border-collapse:collapse; margin-bottom:var(--spacing-md,16px); }
    .perms-table th { font-size:.8rem; color:#616161; padding:var(--spacing-xs,4px) var(--spacing-sm,8px); text-align:left; border-bottom:1px solid #e0e0e0; }
    .perms-table td { padding:var(--spacing-xs,4px) var(--spacing-sm,8px); border-bottom:1px solid #f5f5f5; font-size:.9rem; }
    .btn-save { padding:6px 18px; background:var(--color-primary,#1976d2); color:#fff; border:none; border-radius:var(--radius-sm,4px); cursor:pointer; font-size:.875rem; font-weight:500; }
  `],
})
export class RoleManagementComponent implements OnInit {
    private http = inject(HttpClient);
    loading = signal(true);
    error = signal<string | null>(null);
    saveMessage = signal<string | null>(null);
    roles = signal<RoleDto[]>([]);

    ngOnInit(): void {
        this.http.get<RoleDto[]>(`${environment.apiUrl}/admin/roles`).subscribe({
            next: (roles) => { this.loading.set(false); this.roles.set(roles); },
            error: (err) => { this.loading.set(false); this.error.set(err.error?.message ?? 'Failed to load roles.'); },
        });
    }

    saveRole(role: RoleDto): void {
        this.http.put(`${environment.apiUrl}/admin/roles/${role.id}`, role).subscribe({
            next: () => { this.saveMessage.set('Permissions saved.'); setTimeout(() => this.saveMessage.set(null), 3000); },
            error: (err) => this.error.set(err.error?.message ?? 'Failed to save permissions.'),
        });
    }
}
