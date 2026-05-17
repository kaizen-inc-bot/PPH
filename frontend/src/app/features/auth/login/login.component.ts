import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { AuthService } from '@core/auth/auth.service';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { ErrorBannerComponent } from '@shared/components/error-banner/error-banner.component';

type LoginStep = 'mobile' | 'otp';

@Component({
  selector: 'app-login',
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
          <p class="brand-tagline">Everything your community needs, in one place</p>

          <!-- Apartment illustration -->
          <div class="brand-illustration-wrap">
            <svg class="brand-illustration" viewBox="0 0 360 220" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <ellipse cx="180" cy="200" rx="165" ry="28" fill="rgba(0,0,0,0.12)"/>
              <!-- Stars -->
              <circle cx="30" cy="24" r="1.5" fill="rgba(255,255,255,0.6)"/>
              <circle cx="62" cy="11" r="1" fill="rgba(255,255,255,0.5)"/>
              <circle cx="112" cy="7" r="1.5" fill="rgba(255,255,255,0.6)"/>
              <circle cx="252" cy="16" r="1" fill="rgba(255,255,255,0.5)"/>
              <circle cx="292" cy="7" r="1.5" fill="rgba(255,255,255,0.6)"/>
              <circle cx="342" cy="28" r="1" fill="rgba(255,255,255,0.5)"/>
              <circle cx="148" cy="4" r="1" fill="rgba(255,255,255,0.45)"/>
              <!-- Crescent moon -->
              <circle cx="318" cy="36" r="19" fill="rgba(255,255,255,0.15)"/>
              <circle cx="327" cy="31" r="14" fill="#0d47a1"/>
              <!-- Left building -->
              <rect x="18" y="116" width="70" height="100" rx="3" fill="rgba(255,255,255,0.1)"/>
              <rect x="18" y="109" width="70" height="11" rx="2" fill="rgba(255,255,255,0.18)"/>
              <rect x="29" y="128" width="19" height="15" rx="2" fill="rgba(255,210,100,0.55)"/>
              <rect x="58" y="128" width="19" height="15" rx="2" fill="rgba(255,255,255,0.38)"/>
              <rect x="29" y="155" width="19" height="15" rx="2" fill="rgba(255,255,255,0.38)"/>
              <rect x="58" y="155" width="19" height="15" rx="2" fill="rgba(255,210,100,0.55)"/>
              <rect x="29" y="182" width="19" height="15" rx="2" fill="rgba(255,210,100,0.55)"/>
              <rect x="58" y="182" width="19" height="15" rx="2" fill="rgba(255,255,255,0.32)"/>
              <!-- Centre main building -->
              <rect x="108" y="48" width="144" height="168" rx="4" fill="rgba(255,255,255,0.18)"/>
              <rect x="108" y="40" width="144" height="14" rx="3" fill="rgba(255,255,255,0.28)"/>
              <rect x="176" y="24" width="8" height="20" rx="2" fill="rgba(255,255,255,0.28)"/>
              <circle cx="180" cy="22" r="5" fill="rgba(255,255,255,0.22)"/>
              <rect x="122" y="65" width="28" height="23" rx="3" fill="rgba(255,210,100,0.65)"/>
              <rect x="166" y="65" width="28" height="23" rx="3" fill="rgba(255,255,255,0.45)"/>
              <rect x="210" y="65" width="28" height="23" rx="3" fill="rgba(255,210,100,0.65)"/>
              <rect x="122" y="102" width="28" height="23" rx="3" fill="rgba(255,255,255,0.45)"/>
              <rect x="166" y="102" width="28" height="23" rx="3" fill="rgba(255,210,100,0.65)"/>
              <rect x="210" y="102" width="28" height="23" rx="3" fill="rgba(255,255,255,0.45)"/>
              <rect x="122" y="139" width="28" height="23" rx="3" fill="rgba(255,210,100,0.65)"/>
              <rect x="166" y="139" width="28" height="23" rx="3" fill="rgba(255,255,255,0.35)"/>
              <rect x="210" y="139" width="28" height="23" rx="3" fill="rgba(255,210,100,0.65)"/>
              <rect x="162" y="186" width="36" height="30" rx="3" fill="rgba(255,255,255,0.28)"/>
              <circle cx="194" cy="202" r="3" fill="rgba(255,255,255,0.55)"/>
              <!-- Right building -->
              <rect x="272" y="93" width="70" height="123" rx="3" fill="rgba(255,255,255,0.1)"/>
              <rect x="272" y="86" width="70" height="11" rx="2" fill="rgba(255,255,255,0.18)"/>
              <rect x="284" y="108" width="19" height="15" rx="2" fill="rgba(255,255,255,0.38)"/>
              <rect x="313" y="108" width="19" height="15" rx="2" fill="rgba(255,210,100,0.55)"/>
              <rect x="284" y="135" width="19" height="15" rx="2" fill="rgba(255,210,100,0.55)"/>
              <rect x="313" y="135" width="19" height="15" rx="2" fill="rgba(255,255,255,0.38)"/>
              <rect x="284" y="162" width="19" height="15" rx="2" fill="rgba(255,255,255,0.32)"/>
              <rect x="313" y="162" width="19" height="15" rx="2" fill="rgba(255,210,100,0.55)"/>
              <!-- Ground -->
              <rect x="0" y="214" width="360" height="3" rx="1.5" fill="rgba(255,255,255,0.18)"/>
              <!-- Left tree -->
              <rect x="90" y="186" width="6" height="30" rx="2" fill="rgba(255,255,255,0.2)"/>
              <ellipse cx="93" cy="175" rx="17" ry="19" fill="rgba(255,255,255,0.1)"/>
              <ellipse cx="93" cy="173" rx="11" ry="13" fill="rgba(255,255,255,0.09)"/>
              <!-- Right tree -->
              <rect x="264" y="186" width="6" height="30" rx="2" fill="rgba(255,255,255,0.2)"/>
              <ellipse cx="267" cy="175" rx="17" ry="19" fill="rgba(255,255,255,0.1)"/>
              <ellipse cx="267" cy="173" rx="11" ry="13" fill="rgba(255,255,255,0.09)"/>
              <!-- Pathway -->
              <path d="M156 214 L148 240 L212 240 L204 214Z" fill="rgba(255,255,255,0.07)"/>
            </svg>
          </div>

          <div class="brand-divider"></div>
          <div class="brand-features">
            <div class="brand-feature">
              <div class="feat-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
              </div>
              <div class="feat-text">
                <strong>Secure OTP Login</strong>
                <span>No passwords needed — verify instantly with your registered mobile number.</span>
              </div>
            </div>
            <div class="brand-feature">
              <div class="feat-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              </div>
              <div class="feat-text">
                <strong>All Community Services</strong>
                <span>Amenity bookings, maintenance requests, notices and due payments.</span>
              </div>
            </div>
            <div class="brand-feature">
              <div class="feat-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
              </div>
              <div class="feat-text">
                <strong>Stay Informed</strong>
                <span>Real-time alerts for maintenance updates, community events and governance.</span>
              </div>
            </div>
          </div>
          <!-- Stats strip -->
          <div class="brand-stats">
            <div class="brand-stat">
              <strong>500+</strong>
              <span>Residents</span>
            </div>
            <div class="brand-stat-sep"></div>
            <div class="brand-stat">
              <strong>3</strong>
              <span>Towers</span>
            </div>
            <div class="brand-stat-sep"></div>
            <div class="brand-stat">
              <strong>Est. 2018</strong>
              <span>Community</span>
            </div>
          </div>
          <p class="brand-footer-note">Managed by the PPH Residents' Welfare Association</p>
        </div>
      </aside>

      <!-- Form panel -->
      <main class="form-panel" role="main">
        <section class="auth-card" aria-labelledby="login-heading">
          <div class="auth-header">
            <h2 id="login-heading">Welcome back</h2>
            <p class="auth-subtitle">Sign in to access your resident portal</p>
          </div>

          <app-error-banner
            *ngIf="error()"
            [message]="error()!"
            [dismissible]="true"
            (dismiss)="error.set(null)"
          />

          <!-- Step indicator -->
          <div class="step-indicator" aria-label="Sign-in progress">
            <div class="step" [class.active]="step() === 'mobile'" [class.done]="step() === 'otp'">
              <div class="step-dot">
                @if (step() === 'otp') {
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                } @else { 1 }
              </div>
              <span>Mobile</span>
            </div>
            <div class="step-line" [class.done]="step() === 'otp'"></div>
            <div class="step" [class.active]="step() === 'otp'">
              <div class="step-dot">2</div>
              <span>Verify OTP</span>
            </div>
          </div>

          <!-- Step 1: Mobile number -->
          @if (step() === 'mobile') {
            <form [formGroup]="mobileForm" (ngSubmit)="requestOtp()" novalidate>
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
                    [class.invalid]="mobileForm.get('mobileNumber')?.invalid && mobileForm.get('mobileNumber')?.touched"
                    placeholder="98765 43210"
                  />
                </div>
                @if (mobileForm.get('mobileNumber')?.invalid && mobileForm.get('mobileNumber')?.touched) {
                  <span class="field-error" role="alert">Enter a valid 10-digit mobile number</span>
                }
                <p class="field-hint">We'll send a 6-digit OTP to this number to verify your identity.</p>
              </div>
              <button type="submit" class="btn-primary" [disabled]="loading() || mobileForm.invalid">
                @if (loading()) { <app-loading-spinner /> } @else { Send OTP }
              </button>
            </form>
          }

          <!-- Step 2: OTP -->
          @if (step() === 'otp') {
            <form [formGroup]="otpForm" (ngSubmit)="verifyOtp()" novalidate>
              <div class="otp-info-box">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                OTP sent to <strong>+91 {{ mobileForm.value.mobileNumber }}</strong>
              </div>
              <div class="field-group">
                <label for="otp" class="form-label">One-Time Password</label>
                <input
                  id="otp"
                  type="text"
                  inputmode="numeric"
                  formControlName="otp"
                  autocomplete="one-time-code"
                  class="form-input otp-input"
                  [class.invalid]="otpForm.get('otp')?.invalid && otpForm.get('otp')?.touched"
                  maxlength="6"
                  placeholder="• • • • • •"
                />
                @if (otpForm.get('otp')?.invalid && otpForm.get('otp')?.touched) {
                  <span class="field-error" role="alert">Enter the 6-digit OTP</span>
                }
                <p class="field-hint">OTP expires in 10 minutes. Didn't receive it?
                  <button type="button" class="link-btn" (click)="goBack()">Resend OTP</button>
                </p>
              </div>
              <div class="btn-row">
                <button type="button" class="btn-secondary" (click)="goBack()">Back</button>
                <button type="submit" class="btn-primary flex-1" [disabled]="loading() || otpForm.invalid">
                  @if (loading()) { <app-loading-spinner /> } @else { Verify &amp; Sign In }
                </button>
              </div>
            </form>
          }

          <!-- Trust badges -->
          <div class="trust-row">
            <div class="trust-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
              <span>256-bit SSL</span>
            </div>
            <div class="trust-sep"></div>
            <div class="trust-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <span>OTP Secured</span>
            </div>
            <div class="trust-sep"></div>
            <div class="trust-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M6 20v-2a6 6 0 0112 0v2"/></svg>
              <span>Data Private</span>
            </div>
          </div>

          <div class="auth-footer">
            <p>New resident? <a routerLink="/register" class="auth-link-text">Create an account</a></p>
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
    .brand-footer-note { margin-top:12px; color:rgba(255,255,255,0.45); font-size:.78rem; }
    .brand-illustration-wrap { margin:20px 0 4px; }
    .brand-illustration { width:100%; height:auto; display:block; }
    .brand-stats { display:flex; align-items:center; gap:0; margin-top:24px; background:rgba(255,255,255,0.08); border-radius:10px; padding:12px 0; }
    .brand-stat { flex:1; text-align:center; display:flex; flex-direction:column; gap:2px; }
    .brand-stat strong { color:#fff; font-size:1.0625rem; font-weight:700; }
    .brand-stat span { color:rgba(255,255,255,0.6); font-size:.75rem; }
    .brand-stat-sep { width:1px; height:32px; background:rgba(255,255,255,0.2); flex-shrink:0; }

    /* Form panel */
    .form-panel { flex:1; display:flex; align-items:center; justify-content:center; background:#f5f7fa; padding:32px 20px; }
    .auth-card { background:#fff; border-radius:16px; box-shadow:0 4px 24px rgba(0,0,0,0.08); padding:40px 36px; width:100%; max-width:420px; }
    .auth-header { margin-bottom:24px; }
    .auth-header h2 { font-size:1.625rem; font-weight:700; color:#111827; margin:0 0 6px; }
    .auth-subtitle { color:#6b7280; font-size:.9375rem; margin:0; }

    /* Step indicator */
    .step-indicator { display:flex; align-items:center; margin-bottom:26px; }
    .step { display:flex; align-items:center; gap:8px; }
    .step-dot { width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:.8rem; font-weight:600; background:#e5e7eb; color:#6b7280; transition:all .2s; flex-shrink:0; }
    .step.active .step-dot { background:var(--color-primary,#1976d2); color:#fff; }
    .step.done .step-dot { background:#10b981; color:#fff; }
    .step span { font-size:.8125rem; color:#6b7280; white-space:nowrap; }
    .step.active span { color:var(--color-primary,#1976d2); font-weight:600; }
    .step.done span { color:#10b981; }
    .step-line { flex:1; height:2px; background:#e5e7eb; margin:0 10px; transition:background .2s; }
    .step-line.done { background:#10b981; }

    /* Fields */
    .field-group { margin-bottom:18px; }
    .form-label { display:block; margin-bottom:6px; font-weight:500; font-size:.875rem; color:#374151; }
    .input-wrapper { position:relative; display:flex; align-items:center; }
    .input-prefix { position:absolute; left:13px; color:#6b7280; font-size:.9rem; font-weight:500; pointer-events:none; user-select:none; }
    .form-input { width:100%; padding:11px 14px; border:1.5px solid #e5e7eb; border-radius:8px; font-size:.9375rem; color:#111827; transition:border-color .15s, box-shadow .15s; outline:none; box-sizing:border-box; }
    .form-input:focus { border-color:var(--color-primary,#1976d2); box-shadow:0 0 0 3px rgba(25,118,210,0.1); }
    .form-input.prefixed { padding-left:46px; }
    .form-input.invalid { border-color:#dc2626; }
    .form-input.invalid:focus { box-shadow:0 0 0 3px rgba(220,38,38,0.1); }
    .form-input.otp-input { letter-spacing:.35em; font-size:1.25rem; font-weight:600; text-align:center; }
    .field-error { font-size:.8rem; color:#dc2626; display:block; margin-top:5px; }
    .field-hint { font-size:.8rem; color:#9ca3af; margin-top:6px; line-height:1.5; }

    /* OTP info box */
    .otp-info-box { display:flex; align-items:center; gap:8px; background:#eff6ff; color:#1d4ed8; border:1px solid #bfdbfe; border-radius:8px; padding:10px 14px; font-size:.875rem; margin-bottom:18px; }

    /* Buttons */
    .btn-primary { width:100%; padding:12px; background:var(--color-primary,#1976d2); color:#fff; border:none; border-radius:8px; cursor:pointer; font-size:.9375rem; font-weight:600; transition:background .15s, transform .1s; }
    .btn-primary:hover:not(:disabled) { background:#1565c0; }
    .btn-primary:active:not(:disabled) { transform:translateY(1px); }
    .btn-primary:disabled { opacity:.55; cursor:not-allowed; }
    .btn-secondary { padding:12px 20px; background:#fff; border:1.5px solid #e5e7eb; color:#374151; border-radius:8px; cursor:pointer; font-size:.9375rem; font-weight:500; transition:border-color .15s; }
    .btn-secondary:hover { border-color:#9ca3af; }
    .btn-row { display:flex; gap:10px; }
    .btn-row .btn-primary { flex:1; }
    .flex-1 { flex:1; }
    .link-btn { background:none; border:none; padding:0; color:var(--color-primary,#1976d2); cursor:pointer; font-size:.8rem; text-decoration:underline; font-family:inherit; }

    /* Trust row */
    .trust-row { display:flex; align-items:center; justify-content:center; gap:0; margin-top:16px; padding:10px 0; border-top:1px solid #f3f4f6; }
    .trust-item { display:flex; align-items:center; gap:5px; color:#9ca3af; font-size:.75rem; flex:1; justify-content:center; }
    .trust-item svg { color:#10b981; flex-shrink:0; }
    .trust-sep { width:1px; height:18px; background:#e5e7eb; }

    /* Footer */
    .auth-footer { margin-top:16px; padding-top:16px; border-top:1px solid #f3f4f6; text-align:center; }
    .auth-footer p { color:#6b7280; font-size:.875rem; margin:0; }
    .auth-link-text { color:var(--color-primary,#1976d2); font-weight:600; text-decoration:none; }
    .auth-link-text:hover { text-decoration:underline; }

    /* Responsive */
    @media (min-width:768px) { .brand-panel { display:flex; } }
    @media (max-width:480px) { .auth-card { padding:28px 20px; border-radius:12px; } .auth-header h2 { font-size:1.375rem; } }
  `],
})
export class LoginComponent {
  step = signal<LoginStep>('mobile');
  loading = signal(false);
  error = signal<string | null>(null);

  mobileForm = this.fb.group({
    mobileNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
  });

  otpForm = this.fb.group({
    otp: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
  });

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
  ) { }

  requestOtp(): void {
    if (this.mobileForm.invalid) return;
    this.loading.set(true);
    this.error.set(null);
    this.http
      .post(`${environment.apiUrl}/auth/otp/request`, {
        mobileNumber: this.mobileForm.value.mobileNumber,
      })
      .subscribe({
        next: () => {
          this.step.set('otp');
          this.loading.set(false);
        },
        error: (err) => {
          this.loading.set(false);
          this.error.set(err.error?.message ?? 'Failed to send OTP. Please try again.');
        },
      });
  }

  verifyOtp(): void {
    if (this.otpForm.invalid) return;
    this.loading.set(true);
    this.error.set(null);
    this.http
      .post<{ token: string; user: unknown }>(`${environment.apiUrl}/auth/otp/verify`, {
        mobileNumber: this.mobileForm.value.mobileNumber,
        otp: this.otpForm.value.otp,
      })
      .subscribe({
        next: (res) => {
          this.authService.setToken(res.token, res.user as Parameters<AuthService['setToken']>[1]);
          this.loading.set(false);
          this.router.navigate(['/home']);
        },
        error: (err) => {
          this.loading.set(false);
          this.error.set(err.error?.message ?? 'Invalid OTP. Please try again.');
        },
      });
  }

  goBack(): void {
    this.step.set('mobile');
    this.otpForm.reset();
    this.error.set(null);
  }
}
