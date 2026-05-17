import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { ErrorBannerComponent } from '@shared/components/error-banner/error-banner.component';

interface FeedbackSubmissionDto {
    category: string;
    message: string;
    rating?: number;
}

@Component({
    selector: 'app-suggestions',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, LoadingSpinnerComponent, ErrorBannerComponent],
    template: `
    <section aria-labelledby="suggestions-heading">
      <h1 id="suggestions-heading">Suggestions &amp; Feedback</h1>

      @if (success()) {
        <div class="success-banner" role="status">
          Thank you! Your feedback has been submitted.
        </div>
      } @else {
        <app-error-banner *ngIf="error()" [message]="error()!" [dismissible]="true" (dismiss)="error.set(null)" />

        <form [formGroup]="form" (ngSubmit)="submit()" novalidate class="feedback-form">
          <label for="category" class="form-label">Category</label>
          <select id="category" formControlName="category" class="form-input">
            <option value="">Select a category…</option>
            <option value="maintenance">Maintenance</option>
            <option value="security">Security</option>
            <option value="amenities">Amenities</option>
            <option value="governance">Governance</option>
            <option value="general">General</option>
          </select>
          @if (isInvalid('category')) { <span class="field-error" role="alert">Please select a category</span> }

          <label for="message" class="form-label">Your Feedback</label>
          <textarea id="message" formControlName="message" class="form-input" rows="5" placeholder="Share your suggestion or feedback…"></textarea>
          @if (isInvalid('message')) { <span class="field-error" role="alert">Please enter your feedback (at least 20 characters)</span> }

          <label class="form-label">Rating (optional)</label>
          <div class="rating-row" role="group" aria-label="Rating">
            @for (star of [1,2,3,4,5]; track star) {
              <button type="button" class="star" [class.active]="form.value.rating! >= star"
                (click)="form.patchValue({rating: star})" [attr.aria-label]="star + ' star'">★</button>
            }
          </div>

          <button type="submit" class="btn-primary" [disabled]="loading() || form.invalid">
            @if (loading()) { <app-loading-spinner /> } @else { Submit Feedback }
          </button>
        </form>
      }
    </section>
  `,
    styles: [`
    h1 { margin-bottom:var(--spacing-lg,24px); }
    .success-banner { background:#e8f5e9; color:#2e7d32; padding:var(--spacing-md,16px); border-radius:var(--radius-sm,4px); }
    .feedback-form { display:flex; flex-direction:column; max-width:560px; }
    .form-label { display:block; margin-top:var(--spacing-md,16px); margin-bottom:var(--spacing-xs,4px); font-weight:500; font-size:.875rem; }
    .form-input { width:100%; padding:var(--spacing-sm,8px) var(--spacing-md,16px); border:1px solid #bdbdbd; border-radius:var(--radius-sm,4px); font-size:1rem; }
    .field-error { font-size:.8rem; color:var(--color-error,#c62828); }
    .rating-row { display:flex; gap:4px; margin-top:var(--spacing-sm,8px); }
    .star { background:none; border:none; font-size:1.5rem; cursor:pointer; color:#bdbdbd; }
    .star.active { color:#f9a825; }
    .btn-primary { margin-top:var(--spacing-lg,24px); padding:var(--spacing-sm,8px); background:var(--color-primary,#1976d2); color:#fff; border:none; border-radius:var(--radius-sm,4px); cursor:pointer; font-size:1rem; }
    .btn-primary:disabled { opacity:.6; cursor:not-allowed; }
  `],
})
export class SuggestionsComponent {
    private http = inject(HttpClient);

    loading = signal(false);
    error = signal<string | null>(null);
    success = signal(false);

    form = inject(FormBuilder).group({
        category: ['', Validators.required],
        message: ['', [Validators.required, Validators.minLength(20)]],
        rating: [0],
    });

    isInvalid(field: string): boolean {
        const ctrl = this.form.get(field);
        return !!(ctrl?.invalid && ctrl.touched);
    }

    submit(): void {
        if (this.form.invalid) return;
        this.loading.set(true);
        this.error.set(null);
        const dto: FeedbackSubmissionDto = {
            category: this.form.value.category!,
            message: this.form.value.message!,
            rating: this.form.value.rating || undefined,
        };
        this.http.post(`${environment.apiUrl}/feedback`, dto).subscribe({
            next: () => { this.loading.set(false); this.success.set(true); },
            error: (err) => { this.loading.set(false); this.error.set(err.error?.message ?? 'Submission failed.'); },
        });
    }
}
