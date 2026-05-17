import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { ErrorBannerComponent } from '@shared/components/error-banner/error-banner.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LoadingSpinnerComponent, ErrorBannerComponent],
  template: `
    <div class="auth-page">

      <!-- Branding panel -->
      <aside class="brand-panel" aria-hidden="true">
        <div class="brand-inner">
          <div class="brand-logo">
            <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
              <rect width="52" height="52" rx="14" fill="rgba(255,255,255,0.18)"/>
              <path d="M26 9L10 21v22h13V31h6v12h13V21L26 9z" fill="white"/>
            </svg>
          </div>
          <h1 class="brand-title">PPH Resident Portal</h1>
          <p class="brand-tagline">Join your community's digital home</p>
          <div class="brand-divider"></div>
          <div class="brand-features">
            <div class="brand-feature">
              <div class="feat-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </div>
              <div class="feat-text">
                <strong>Verified Residents Only</strong>
                <span>Registration is open to verified unit owners and tenants at PPH.</span>
              </div>
            </div>
            <div class="brand-feature">
              <div class="feat-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <div class="feat-text">
                <strong>Quick Setup</strong>
                <span>Complete your profile in under 2 minutes and get started right away.</span>
              </div>
            </div>
            <div class="brand-feature">
              <div class="feat-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
              </div>
              <div class="feat-text">
                <strong>Your Data is Safe</strong>
                <span>All resident information is encrypted and never shared with third parties.</span>
              </div>
            </div>
          </div>
          <p class="brand-footer-note">Managed by the PPH Residents' Welfare Association</p>
        </div>
      </aside>

      <!-- Form panel -->
      <main class="form-panel" role="main">
        <section class="auth-card" aria-labelledby="register-heading">
          <div class="auth-header">
            <h2 id="register-heading">Create your account</h2>
            <p class="auth-subtitle">Fill in your details to register as a resident</p>
          </div>

          <app-error-banner
            *ngIf="error()"
            [message]="error()!"
            [dismissible]="true"
            (dismiss)="error.set(null)"
          />

          <form [formGroup]="form" (ngSubmit)="register()" novalidate>

            <div class="field-group">
              <label for="fullName" class="form-label">Full Name</label>
              <input
                id="fullName"
                type="text"
                formControlName="fullName"
                autocomplete="name"
                class="form-input"
                [class.invalid]="isInvalid('fullName')"
                placeholder="e.g. Ravi Kumar"
              />
              @if (isInvalid('fullName')) {
                <span class="field-error" role="alert">Full name is required</span>
              }
            </div>

            <div class="field-group">
              <label for="flatNumber" class="form-label">Flat / Unit Number</label>
              <input
                id="flatNumber"
                type="text"
                formControlName="flatNumber"
                class="form-input"
                [class.invalid]="isInvalid('flatNumber')"
                placeholder="e.g. A-204"
              />
              @if (isInvalid('flatNumber')) {
                <span class="field-error" role="alert">Flat number is required</span>
              }
              <p class="field-hint">Enter the flat number as listed in your allotment letter.</p>
            </div>

            <div class="field-group">
              <label for="mobileNumber" class="form-label">Mobile Number</label>
              <div class="input-wrapper">
                <span class="input-prefix">+91</span>
                <input
                  id="mobileNumber"
                  type="tel"
                  formControlName="mobileNumber"
                  autocomplete="tel"
                  class="form-input prefixed"
                  [class.invalid]="isInvalid('mobileNumber')"
                  placeholder="98765 43210"
                />
              </div>
              @if (isInvalid('mobileNumber')) {
                <span class="field-error" role="alert">Enter a valid 10-digit mobile number</span>
              }
              <p class="field-hint">This number will be used for OTP-based login and notifications.</p>
            </div>

            <div class="consent-box" formGroupName="notificationPreferences">
              <label class="consent-label">
                <input
                  id="consentGiven"
                  type="checkbox"
                  formControlName="consentGiven"
                  class="consent-checkbox"
                />
                <span>I consent to receiving community notifications via SMS and WhatsApp</span>
              </label>
            </div>

            <button type="submit" class="btn-primary" [disabled]="loading() || form.invalid">
              @if (loading()) { <app-loading-spinner /> } @else { Create Account }
            </button>

          </form>

          <div class="auth-footer">
            <p>Already have an account? <a routerLink="/login" class="auth-link-text">Sign In</a></p>
          </div>
        </section>
      </main>

    </div>
  `,
  styles: [`
    .auth-page { display:flex; min-height:100vh; }

    /* Brand panel */
    .brand-panel { display:none; width:44%; background:linear-gradient(150deg,#1565c0 0%,#0d47a1 55%,#01579b 100%); padding:56px 44px; position:relative; overflow:hidden; }
    .brand-panel::before { content:''; position:absolute; top:-100px; right:-100px; width:320px; height:320px; border-radius:50%; background:rgba(255,255,255,0.05); }
    .brand-panel::after { content:''; position:absolute; bottom:-80px; left:-80px; width:260px; height:260px; border-radius:50%; background:rgba(255,255,255,0.05); }
    .brand-inner { position:relative; z-index:1; display:flex; flex-direction:column; justify-content:center; height:100%; }
    .brand-logo { margin-bottom:24px; }
    .brand-title { color:#fff; font-size:1.875rem; font-weight:700; margin:0 0 10px; line-height:1.25; }
    .brand-tagline { color:rgba(255,255,255,0.8); font-size:1rem; margin:0; line-height:1.6; }
    .brand-divider { width:48px; height:3px; background:rgba(255,255,255,0.35); border-radius:2px; margin:28px 0; }
    .brand-features { display:flex; flex-direction:column; gap:22px; }
    .brand-feature { display:flex; gap:14px; align-items:flex-start; }
    .feat-icon { width:38px; height:38px; border-radius:10px; background:rgba(255,255,255,0.15); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .feat-text { display:flex; flex-direction:column; gap:3px; }
    .feat-text strong { color:#fff; font-size:.9rem; font-weight:600; }
    .feat-text span { color:rgba(255,255,255,0.68); font-size:.8125rem; line-height:1.55; }
    .brand-footer-note { margin-top:36px; color:rgba(255,255,255,0.45); font-size:.78rem; }

    /* Form panel */
    .form-panel { flex:1; display:flex; align-items:center; justify-content:center; background:#f5f7fa; padding:32px 20px; }
    .auth-card { background:#fff; border-radius:16px; box-shadow:0 4px 24px rgba(0,0,0,0.08); padding:40px 36px; width:100%; max-width:440px; }
    .auth-header { margin-bottom:24px; }
    .auth-header h2 { font-size:1.625rem; font-weight:700; color:#111827; margin:0 0 6px; }
    .auth-subtitle { color:#6b7280; font-size:.9375rem; margin:0; }

    /* Fields */
    .field-group { margin-bottom:16px; }
    .form-label { display:block; margin-bottom:6px; font-weight:500; font-size:.875rem; color:#374151; }
    .input-wrapper { position:relative; display:flex; align-items:center; }
    .input-prefix { position:absolute; left:13px; color:#6b7280; font-size:.9rem; font-weight:500; pointer-events:none; user-select:none; }
    .form-input { width:100%; padding:11px 14px; border:1.5px solid #e5e7eb; border-radius:8px; font-size:.9375rem; color:#111827; transition:border-color .15s, box-shadow .15s; outline:none; box-sizing:border-box; }
    .form-input:focus { border-color:var(--color-primary,#1976d2); box-shadow:0 0 0 3px rgba(25,118,210,0.1); }
    .form-input.prefixed { padding-left:46px; }
    .form-input.invalid { border-color:#dc2626; }
    .form-input.invalid:focus { box-shadow:0 0 0 3px rgba(220,38,38,0.1); }
    .field-error { font-size:.8rem; color:#dc2626; display:block; margin-top:5px; }
    .field-hint { font-size:.8rem; color:#9ca3af; margin-top:6px; line-height:1.5; }

    /* Consent */
    .consent-box { background:#f9fafb; border:1px solid #e5e7eb; border-radius:8px; padding:14px; margin-bottom:4px; }
    .consent-label { display:flex; gap:10px; align-items:flex-start; cursor:pointer; }
    .consent-checkbox { margin-top:2px; flex-shrink:0; width:16px; height:16px; accent-color:var(--color-primary,#1976d2); cursor:pointer; }
    .consent-label span { font-size:.875rem; color:#374151; line-height:1.5; }

    /* Buttons */
    .btn-primary { width:100%; padding:12px; background:var(--color-primary,#1976d2); color:#fff; border:none; border-radius:8px; cursor:pointer; font-size:.9375rem; font-weight:600; transition:background .15s, transform .1s; margin-top:20px; }
    .btn-primary:hover:not(:disabled) { background:#1565c0; }
    .btn-primary:active:not(:disabled) { transform:translateY(1px); }
    .btn-primary:disabled { opacity:.55; cursor:not-allowed; }

    /* Footer */
    .auth-footer { margin-top:24px; padding-top:18px; border-top:1px solid #f3f4f6; text-align:center; }
    .auth-footer p { color:#6b7280; font-size:.875rem; margin:0; }
    .auth-link-text { color:var(--color-primary,#1976d2); font-weight:600; text-decoration:none; }
    .auth-link-text:hover { text-decoration:underline; }

    /* Responsive */
    @media (min-width:768px) { .brand-panel { display:flex; } }
    @media (max-width:480px) { .auth-card { padding:28px 20px; border-radius:12px; } .auth-header h2 { font-size:1.375rem; } }
  `],
})
export class RegisterComponent {
  loading = signal(false);
  error = signal<string | null>(null);

  form = this.fb.group({
    fullName: ['', Validators.required],
    flatNumber: ['', Validators.required],
    mobileNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
    notificationPreferences: this.fb.group({
      consentGiven: [false],
    }),
  });

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
  ) { }

  isInvalid(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!(ctrl?.invalid && ctrl?.touched);
  }

  register(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set(null);
    this.http.post(`${environment.apiUrl}/users/register`, this.form.value).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/login'], {
          queryParams: { registered: '1' },
        });
      },
      error: (err) => {
        this.loading.set(false);
        if (err.status === 422) {
          this.error.set('Unit number and mobile number do not match our records.');
        } else {
          this.error.set(err.error?.message ?? 'Registration failed. Please try again.');
        }
      },
    });
  }
}
