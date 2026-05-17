import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { ErrorBannerComponent } from '@shared/components/error-banner/error-banner.component';
import { IssueTicketDto } from '../issues.component';

@Component({
    selector: 'app-new-issue',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, LoadingSpinnerComponent, ErrorBannerComponent],
    template: `
    <section aria-labelledby="new-issue-heading">
      <h1 id="new-issue-heading">Submit New Issue</h1>

      @if (trackingRef()) {
        <div class="success-banner" role="status">
          Issue submitted! Your tracking reference is
          <strong class="tracking-ref">{{ trackingRef() }}</strong>.
          Please save this reference for future follow-up.
        </div>
      } @else {
        <app-error-banner *ngIf="error()" [message]="error()!" [dismissible]="true" (dismiss)="error.set(null)" />

        <form [formGroup]="form" (ngSubmit)="submit()" novalidate class="issue-form">
          <label for="title" class="form-label">Title</label>
          <input id="title" type="text" formControlName="title" class="form-input" [class.invalid]="isInvalid('title')" />
          @if (isInvalid('title')) { <span class="field-error" role="alert">Title is required (min 5 chars)</span> }

          <label for="category" class="form-label">Category</label>
          <select id="category" formControlName="category" class="form-input" [class.invalid]="isInvalid('category')">
            <option value="">Select…</option>
            <option value="plumbing">Plumbing</option>
            <option value="electrical">Electrical</option>
            <option value="structural">Structural</option>
            <option value="security">Security</option>
            <option value="cleanliness">Cleanliness</option>
            <option value="noise">Noise</option>
            <option value="other">Other</option>
          </select>
          @if (isInvalid('category')) { <span class="field-error" role="alert">Please select a category</span> }

          <label for="location" class="form-label">Location</label>
          <input id="location" type="text" formControlName="location" class="form-input" [class.invalid]="isInvalid('location')" placeholder="e.g. Block B, 3rd floor corridor" />
          @if (isInvalid('location')) { <span class="field-error" role="alert">Location is required</span> }

          <label for="severity" class="form-label">Severity</label>
          <select id="severity" formControlName="severity" class="form-input">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>

          <label for="description" class="form-label">Description</label>
          <textarea id="description" formControlName="description" class="form-input" rows="4" [class.invalid]="isInvalid('description')" placeholder="Describe the issue in detail…"></textarea>
          @if (isInvalid('description')) { <span class="field-error" role="alert">Description is required (min 20 chars)</span> }

          <div class="form-actions">
            <button type="button" class="btn-secondary" (click)="goBack()">Cancel</button>
            <button type="submit" class="btn-primary" [disabled]="loading() || form.invalid">
              @if (loading()) { <app-loading-spinner /> } @else { Submit Issue }
            </button>
          </div>
        </form>
      }
    </section>
  `,
    styles: [`
    h1 { margin-bottom:var(--spacing-lg,24px); }
    .success-banner { background:#e8f5e9; color:#2e7d32; padding:var(--spacing-md,16px); border-radius:var(--radius-sm,4px); line-height:1.6; }
    .tracking-ref { font-family:monospace; background:#c8e6c9; padding:2px 6px; border-radius:4px; }
    .issue-form { display:flex; flex-direction:column; max-width:560px; }
    .form-label { display:block; margin-top:var(--spacing-md,16px); margin-bottom:var(--spacing-xs,4px); font-weight:500; font-size:.875rem; }
    .form-input { width:100%; padding:var(--spacing-sm,8px) var(--spacing-md,16px); border:1px solid #bdbdbd; border-radius:var(--radius-sm,4px); font-size:1rem; }
    .form-input.invalid { border-color:var(--color-error,#c62828); }
    .field-error { font-size:.8rem; color:var(--color-error,#c62828); }
    .form-actions { display:flex; gap:var(--spacing-sm,8px); margin-top:var(--spacing-lg,24px); }
    .btn-primary { flex:1; padding:var(--spacing-sm,8px); background:var(--color-primary,#1976d2); color:#fff; border:none; border-radius:var(--radius-sm,4px); cursor:pointer; font-size:1rem; }
    .btn-primary:disabled { opacity:.6; cursor:not-allowed; }
    .btn-secondary { padding:var(--spacing-sm,8px) var(--spacing-lg,24px); background:transparent; border:1px solid #bdbdbd; border-radius:var(--radius-sm,4px); cursor:pointer; }
  `],
})
export class NewIssueComponent {
    private http = inject(HttpClient);
    private router = inject(Router);

    loading = signal(false);
    error = signal<string | null>(null);
    trackingRef = signal<string | null>(null);

    form = inject(FormBuilder).group({
        title: ['', [Validators.required, Validators.minLength(5)]],
        category: ['', Validators.required],
        location: ['', Validators.required],
        severity: ['medium'],
        description: ['', [Validators.required, Validators.minLength(20)]],
    });

    isInvalid(field: string): boolean {
        const ctrl = this.form.get(field);
        return !!(ctrl?.invalid && ctrl.touched);
    }

    submit(): void {
        if (this.form.invalid) return;
        this.loading.set(true);
        this.error.set(null);
        this.http.post<IssueTicketDto>(`${environment.apiUrl}/issues`, this.form.value).subscribe({
            next: (issue) => { this.loading.set(false); this.trackingRef.set(issue.trackingReference); },
            error: (err) => { this.loading.set(false); this.error.set(err.error?.message ?? 'Failed to submit. Please try again.'); },
        });
    }

    goBack(): void {
        this.router.navigate(['/feedback/issues']);
    }
}
