import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { ErrorBannerComponent } from '@shared/components/error-banner/error-banner.component';

interface FormTemplateDto {
    id: string;
    title: string;
    description: string;
    fields: Array<{ name: string; label: string; type: string; required: boolean }>;
}

type FormsState =
    | { status: 'loading' }
    | { status: 'loaded'; templates: FormTemplateDto[] }
    | { status: 'error'; message: string };

@Component({
    selector: 'app-forms',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormsModule, LoadingSpinnerComponent, ErrorBannerComponent],
    template: `
    <section aria-labelledby="forms-heading">
      <h1 id="forms-heading">Digital Forms</h1>
      <p class="subtitle">Gate passes, visitor entry requests, and other society forms.</p>

      @if (submitSuccess()) {
        <div class="success-banner" role="status">Form submitted successfully! ✓</div>
      }
      @if (submitError()) {
        <app-error-banner [message]="submitError()!" [dismissible]="true" (dismiss)="submitError.set(null)" />
      }

      @if (state().status === 'loading') {
        <app-loading-spinner message="Loading forms…" />
      }
      @if (state().status === 'error') {
        <app-error-banner [message]="$any(state()).message" />
      }
      @if (state().status === 'loaded') {
        <ul class="form-list" role="list">
          @for (template of $any(state()).templates; track template.id) {
            <li class="form-card">
              <h2 class="form-title">{{ template.title }}</h2>
              <p class="form-desc">{{ template.description }}</p>
              <button type="button" class="btn-open" (click)="openForm(template)">
                Fill Out Form
              </button>
            </li>
          }
        </ul>
      }

      @if (activeForm()) {
        <div class="form-modal" role="dialog" [attr.aria-labelledby]="'modal-title'">
          <div class="form-modal-content">
            <h2 id="modal-title">{{ activeForm()!.title }}</h2>
            <form (ngSubmit)="submitForm()" novalidate>
              @for (field of activeForm()!.fields; track field.name) {
                <label [for]="field.name" class="form-label">
                  {{ field.label }}
                  @if (field.required) { <span class="required" aria-label="required">*</span> }
                </label>
                <input
                  [id]="field.name"
                  [type]="field.type === 'textarea' ? 'text' : field.type"
                  class="form-input"
                  [(ngModel)]="formData[field.name]"
                  [name]="field.name"
                  [required]="field.required"
                />
              }
              <div class="modal-actions">
                <button type="button" class="btn-secondary" (click)="activeForm.set(null)">Cancel</button>
                <button type="submit" class="btn-primary" [disabled]="submitting()">
                  @if (submitting()) { Submitting… } @else { Submit }
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </section>
  `,
    styles: [`
    h1 { margin-bottom:var(--spacing-sm,8px); }
    .subtitle { color:#757575; margin-bottom:var(--spacing-lg,24px); }
    .success-banner { background:#e8f5e9; color:#2e7d32; padding:var(--spacing-sm,8px) var(--spacing-md,16px); border-radius:var(--radius-sm,4px); margin-bottom:var(--spacing-md,16px); }
    .form-list { list-style:none; margin:0; padding:0; display:grid; gap:var(--spacing-md,16px); grid-template-columns:repeat(auto-fill,minmax(240px,1fr)); }
    .form-card { background:#fff; border-radius:var(--radius-md,8px); padding:var(--spacing-lg,24px); box-shadow:0 1px 4px rgba(0,0,0,.1); display:flex; flex-direction:column; gap:var(--spacing-sm,8px); }
    .form-title { font-size:1rem; margin:0; }
    .form-desc { font-size:.875rem; color:#616161; margin:0; flex:1; }
    .btn-open { padding:6px 16px; background:var(--color-primary,#1976d2); color:#fff; border:none; border-radius:var(--radius-sm,4px); cursor:pointer; font-size:.875rem; align-self:flex-start; }
    .form-modal { position:fixed; inset:0; background:rgba(0,0,0,.5); display:flex; align-items:center; justify-content:center; z-index:1000; padding:var(--spacing-md,16px); }
    .form-modal-content { background:#fff; border-radius:var(--radius-md,8px); padding:var(--spacing-xl,32px); width:100%; max-width:480px; max-height:90vh; overflow:auto; }
    .form-label { display:block; margin-top:var(--spacing-md,16px); margin-bottom:var(--spacing-xs,4px); font-weight:500; font-size:.875rem; }
    .required { color:var(--color-error,#c62828); margin-left:2px; }
    .form-input { width:100%; padding:var(--spacing-sm,8px) var(--spacing-md,16px); border:1px solid #bdbdbd; border-radius:var(--radius-sm,4px); font-size:1rem; }
    .modal-actions { display:flex; gap:var(--spacing-sm,8px); margin-top:var(--spacing-lg,24px); justify-content:flex-end; }
    .btn-primary { padding:8px 24px; background:var(--color-primary,#1976d2); color:#fff; border:none; border-radius:var(--radius-sm,4px); cursor:pointer; }
    .btn-secondary { padding:8px 24px; background:transparent; border:1px solid #bdbdbd; border-radius:var(--radius-sm,4px); cursor:pointer; }
  `],
})
export class FormsComponent implements OnInit {
    private http = inject(HttpClient);

    state = signal<FormsState>({ status: 'loading' });
    activeForm = signal<FormTemplateDto | null>(null);
    formData: Record<string, string> = {};
    submitting = signal(false);
    submitSuccess = signal(false);
    submitError = signal<string | null>(null);

    ngOnInit(): void {
        this.http.get<FormTemplateDto[]>(`${environment.apiUrl}/forms`).subscribe({
            next: (templates) => this.state.set({ status: 'loaded', templates }),
            error: (err) => this.state.set({ status: 'error', message: err.error?.message ?? 'Failed to load forms.' }),
        });
    }

    openForm(template: FormTemplateDto): void {
        this.formData = {};
        this.submitSuccess.set(false);
        this.submitError.set(null);
        this.activeForm.set(template);
    }

    submitForm(): void {
        const form = this.activeForm();
        if (!form) return;
        this.submitting.set(true);
        this.http.post(`${environment.apiUrl}/forms/${form.id}/submit`, this.formData).subscribe({
            next: () => {
                this.submitting.set(false);
                this.activeForm.set(null);
                this.submitSuccess.set(true);
            },
            error: (err) => {
                this.submitting.set(false);
                this.submitError.set(err.error?.message ?? 'Submission failed. Please try again.');
            },
        });
    }
}
