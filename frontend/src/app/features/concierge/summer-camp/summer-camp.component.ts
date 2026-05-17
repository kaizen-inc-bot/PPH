import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { RazorpayService } from '@core/payments/razorpay.service';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { ErrorBannerComponent } from '@shared/components/error-banner/error-banner.component';

interface SummerCampRegistrationDto {
    childName: string;
    childAge: number;
    guardianName: string;
    contactNumber: string;
    medicalNotes?: string;
}

interface CampOrderResponse {
    orderId: string;
    amount: number;
}

@Component({
    selector: 'app-summer-camp',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, LoadingSpinnerComponent, ErrorBannerComponent],
    template: `
    <section aria-labelledby="camp-heading">
      <h1 id="camp-heading">Summer Camp Registration</h1>

      @if (success()) {
        <div class="success-banner" role="status">
          Registration and payment successful! You will receive a confirmation shortly.
        </div>
      } @else {
        <app-error-banner
          *ngIf="error()"
          [message]="error()!"
          [dismissible]="true"
          (dismiss)="error.set(null)"
        />

        <form [formGroup]="form" (ngSubmit)="submit()" novalidate class="camp-form">
          <label for="childName" class="form-label">Child's Name</label>
          <input id="childName" type="text" formControlName="childName" class="form-input"
            [class.invalid]="isInvalid('childName')" />
          @if (isInvalid('childName')) { <span class="field-error" role="alert">Required</span> }

          <label for="childAge" class="form-label">Child's Age</label>
          <input id="childAge" type="number" formControlName="childAge" class="form-input" min="4" max="18"
            [class.invalid]="isInvalid('childAge')" />
          @if (isInvalid('childAge')) { <span class="field-error" role="alert">Age must be 4–18</span> }

          <label for="guardianName" class="form-label">Guardian's Name</label>
          <input id="guardianName" type="text" formControlName="guardianName" class="form-input"
            [class.invalid]="isInvalid('guardianName')" />
          @if (isInvalid('guardianName')) { <span class="field-error" role="alert">Required</span> }

          <label for="contactNumber" class="form-label">Contact Number</label>
          <input id="contactNumber" type="tel" formControlName="contactNumber" class="form-input"
            [class.invalid]="isInvalid('contactNumber')" />
          @if (isInvalid('contactNumber')) { <span class="field-error" role="alert">Enter a valid 10-digit number</span> }

          <label for="medicalNotes" class="form-label">Medical Notes (optional)</label>
          <textarea id="medicalNotes" formControlName="medicalNotes" class="form-input" rows="3"></textarea>

          <button type="submit" class="btn-primary" [disabled]="loading() || form.invalid">
            @if (loading()) { <app-loading-spinner /> } @else { Register &amp; Pay }
          </button>
        </form>
      }
    </section>
  `,
    styles: [`
    h1 { margin-bottom:var(--spacing-lg,24px); }
    .success-banner { background:#e8f5e9; color:#2e7d32; padding:var(--spacing-md,16px); border-radius:var(--radius-sm,4px); font-weight:500; }
    .camp-form { display:flex; flex-direction:column; max-width:480px; }
    .form-label { display:block; margin-top:var(--spacing-md,16px); margin-bottom:var(--spacing-xs,4px); font-weight:500; font-size:.875rem; }
    .form-input { width:100%; padding:var(--spacing-sm,8px) var(--spacing-md,16px); border:1px solid #bdbdbd; border-radius:var(--radius-sm,4px); font-size:1rem; }
    .form-input.invalid { border-color:var(--color-error,#c62828); }
    .field-error { font-size:.8rem; color:var(--color-error,#c62828); }
    .btn-primary { margin-top:var(--spacing-lg,24px); padding:var(--spacing-sm,8px); background:var(--color-primary,#1976d2); color:#fff; border:none; border-radius:var(--radius-sm,4px); cursor:pointer; font-size:1rem; }
    .btn-primary:disabled { opacity:.6; cursor:not-allowed; }
  `],
})
export class SummerCampComponent {
    private http = inject(HttpClient);
    private razorpay = inject(RazorpayService);

    loading = signal(false);
    error = signal<string | null>(null);
    success = signal(false);

    form = inject(FormBuilder).group({
        childName: ['', Validators.required],
        childAge: [null as number | null, [Validators.required, Validators.min(4), Validators.max(18)]],
        guardianName: ['', Validators.required],
        contactNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
        medicalNotes: [''],
    });

    isInvalid(field: string): boolean {
        const ctrl = this.form.get(field);
        return !!(ctrl?.invalid && ctrl.touched);
    }

    submit(): void {
        if (this.form.invalid) return;
        this.loading.set(true);
        this.error.set(null);
        const dto: SummerCampRegistrationDto = {
            childName: this.form.value.childName!,
            childAge: this.form.value.childAge!,
            guardianName: this.form.value.guardianName!,
            contactNumber: this.form.value.contactNumber!,
            medicalNotes: this.form.value.medicalNotes ?? undefined,
        };
        // Step 1: Create order on backend
        this.http.post<CampOrderResponse>(`${environment.apiUrl}/summer-camp/register`, dto).subscribe({
            next: (order) => {
                // Step 2: Open Razorpay checkout
                this.razorpay.openCheckout(order.orderId, order.amount).subscribe({
                    next: (_paymentId) => {
                        this.loading.set(false);
                        this.success.set(true);
                    },
                    error: (err: Error) => {
                        this.loading.set(false);
                        this.error.set(err.message === 'Payment dismissed by user'
                            ? 'Payment was cancelled. Your registration is pending — please try again to complete payment.'
                            : 'Payment failed. Please try again.');
                    },
                });
            },
            error: (err) => {
                this.loading.set(false);
                this.error.set(err.error?.message ?? 'Registration failed. Please try again.');
            },
        });
    }
}
