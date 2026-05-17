import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { ErrorBannerComponent } from '@shared/components/error-banner/error-banner.component';

interface BulletinDto {
    id: string;
    title: string;
    body: string;
    publishAt: string;
}

@Component({
    selector: 'app-bulletins',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, LoadingSpinnerComponent, ErrorBannerComponent],
    template: `
    <section aria-labelledby="bulletins-heading">
      <h1 id="bulletins-heading">EC Bulletins</h1>

      @if (success()) {
        <div class="success-banner" role="status">Bulletin published.</div>
      }
      @if (error()) {
        <app-error-banner [message]="error()!" [dismissible]="true" (dismiss)="error.set(null)" />
      }

      <div class="layout-grid">
        <div class="create-section">
          <h2 class="section-title">Create Bulletin</h2>
          <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
            <label for="bTitle" class="form-label">Title</label>
            <input id="bTitle" type="text" formControlName="title" class="form-input" [class.invalid]="isInvalid('title')" />
            @if (isInvalid('title')) { <span class="field-error" role="alert">Title is required</span> }

            <label for="bBody" class="form-label">Body</label>
            <textarea id="bBody" formControlName="body" class="form-input" rows="5" [class.invalid]="isInvalid('body')"></textarea>
            @if (isInvalid('body')) { <span class="field-error" role="alert">Body is required (min 20 chars)</span> }

            <label for="bPublishAt" class="form-label">Publish At</label>
            <input id="bPublishAt" type="datetime-local" formControlName="publishAt" class="form-input" />

            <button type="submit" class="btn-primary" [disabled]="submitting() || form.invalid">
              @if (submitting()) { <app-loading-spinner /> } @else { Publish }
            </button>
          </form>
        </div>

        <div class="list-section">
          <h2 class="section-title">Published Bulletins</h2>
          @if (loadingList()) {
            <app-loading-spinner message="Loading bulletins…" />
          }
          @for (b of bulletins(); track b.id) {
            <div class="bulletin-card">
              <div class="bulletin-title">{{ b.title }}</div>
              <p class="bulletin-body">{{ b.body }}</p>
              <time class="bulletin-date" [attr.datetime]="b.publishAt">{{ b.publishAt | date:'medium' }}</time>
            </div>
          }
          @if (!loadingList() && bulletins().length === 0) {
            <p class="empty">No bulletins yet.</p>
          }
        </div>
      </div>
    </section>
  `,
    styles: [`
    h1 { margin-bottom:var(--spacing-lg,24px); }
    .success-banner { background:#e8f5e9; color:#2e7d32; padding:var(--spacing-sm,8px) var(--spacing-md,16px); border-radius:var(--radius-sm,4px); margin-bottom:var(--spacing-md,16px); }
    .layout-grid { display:grid; grid-template-columns:1fr 1fr; gap:var(--spacing-xl,32px); }
    @media (max-width:800px) { .layout-grid { grid-template-columns:1fr; } }
    .section-title { font-size:1rem; font-weight:600; margin-bottom:var(--spacing-md,16px); }
    .form-label { display:block; margin-top:var(--spacing-sm,8px); margin-bottom:var(--spacing-xs,4px); font-weight:500; font-size:.875rem; }
    .form-input { width:100%; padding:var(--spacing-sm,8px); border:1px solid #bdbdbd; border-radius:var(--radius-sm,4px); font-size:1rem; }
    .form-input.invalid { border-color:var(--color-error,#c62828); }
    .field-error { font-size:.8rem; color:var(--color-error,#c62828); }
    .btn-primary { margin-top:var(--spacing-md,16px); padding:var(--spacing-sm,8px) var(--spacing-lg,24px); background:var(--color-primary,#1976d2); color:#fff; border:none; border-radius:var(--radius-sm,4px); cursor:pointer; font-size:1rem; }
    .btn-primary:disabled { opacity:.6; cursor:not-allowed; }
    .bulletin-card { background:#fff; border-radius:var(--radius-md,8px); padding:var(--spacing-md,16px); box-shadow:0 1px 4px rgba(0,0,0,.08); margin-bottom:var(--spacing-sm,8px); }
    .bulletin-title { font-weight:600; margin-bottom:var(--spacing-xs,4px); }
    .bulletin-body { color:#424242; font-size:.9rem; line-height:1.6; margin:0 0 var(--spacing-xs,4px); }
    .bulletin-date { font-size:.8rem; color:#9e9e9e; }
    .empty { color:#757575; font-style:italic; }
  `],
})
export class BulletinsComponent implements OnInit {
    private http = inject(HttpClient);
    private fb = inject(FormBuilder);

    loadingList = signal(true);
    submitting = signal(false);
    error = signal<string | null>(null);
    success = signal(false);
    bulletins = signal<BulletinDto[]>([]);

    form = this.fb.group({
        title: ['', Validators.required],
        body: ['', [Validators.required, Validators.minLength(20)]],
        publishAt: [''],
    });

    isInvalid(field: string): boolean {
        const ctrl = this.form.get(field);
        return !!(ctrl?.invalid && ctrl.touched);
    }

    ngOnInit(): void {
        this.loadBulletins();
    }

    loadBulletins(): void {
        this.http.get<BulletinDto[]>(`${environment.apiUrl}/admin/governance/bulletins`).subscribe({
            next: (list) => { this.loadingList.set(false); this.bulletins.set(list); },
            error: () => this.loadingList.set(false),
        });
    }

    submit(): void {
        if (this.form.invalid) return;
        this.submitting.set(true);
        this.error.set(null);
        this.success.set(false);
        this.http.post<BulletinDto>(`${environment.apiUrl}/admin/governance/bulletins`, this.form.value).subscribe({
            next: (b) => {
                this.submitting.set(false);
                this.success.set(true);
                this.form.reset();
                this.bulletins.update((list) => [b, ...list]);
                setTimeout(() => this.success.set(false), 5000);
            },
            error: (err) => {
                this.submitting.set(false);
                this.error.set(err.error?.message ?? 'Failed to publish bulletin.');
            },
        });
    }
}
