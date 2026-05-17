import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { ErrorBannerComponent } from '@shared/components/error-banner/error-banner.component';

interface FacilitySlotDto {
    slotId: string;
    facilityId: string;
    facilityName: string;
    date: string;
    startTime: string;
    endTime: string;
    available: boolean;
}

interface BookingRequestDto {
    slotId: string;
}

type BookingState =
    | { status: 'loading' }
    | { status: 'loaded'; slots: FacilitySlotDto[] }
    | { status: 'error'; message: string };

@Component({
    selector: 'app-bookings',
    standalone: true,
    imports: [CommonModule, LoadingSpinnerComponent, ErrorBannerComponent],
    template: `
    <section aria-labelledby="bookings-heading">
      <h1 id="bookings-heading">Book a Facility</h1>

      @if (bookingSuccess()) {
        <div class="success-banner" role="status">Booking confirmed! ✓</div>
      }
      @if (bookingError()) {
        <app-error-banner [message]="bookingError()!" [dismissible]="true" (dismiss)="bookingError.set(null)" />
      }

      @if (state().status === 'loading') {
        <app-loading-spinner message="Loading available slots…" />
      }
      @if (state().status === 'error') {
        <app-error-banner [message]="$any(state()).message" />
      }
      @if (state().status === 'loaded') {
        <div class="slots-grid" role="list" aria-label="Available facility slots">
          @for (slot of $any(state()).slots; track slot.slotId) {
            <div
              class="slot-card"
              [class.unavailable]="!slot.available"
              role="listitem"
            >
              <div class="slot-facility">{{ slot.facilityName }}</div>
              <div class="slot-date">{{ slot.date }}</div>
              <div class="slot-time">{{ slot.startTime }} – {{ slot.endTime }}</div>
              @if (slot.available) {
                <button
                  type="button"
                  class="btn-book"
                  [disabled]="booking()"
                  (click)="book(slot.slotId)"
                  [attr.aria-label]="'Book ' + slot.facilityName + ' at ' + slot.startTime"
                >
                  @if (booking()) { Booking… } @else { Book }
                </button>
              } @else {
                <span class="badge-taken" aria-label="Slot not available">Taken</span>
              }
            </div>
          }
        </div>
      }
    </section>
  `,
    styles: [`
    h1 { margin-bottom:var(--spacing-lg,24px); }
    .success-banner { background:#e8f5e9; color:#2e7d32; padding:var(--spacing-sm,8px) var(--spacing-md,16px); border-radius:var(--radius-sm,4px); margin-bottom:var(--spacing-md,16px); font-weight:500; }
    .slots-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:var(--spacing-md,16px); }
    .slot-card { background:#fff; border-radius:var(--radius-md,8px); padding:var(--spacing-md,16px); box-shadow:0 1px 4px rgba(0,0,0,.1); display:flex; flex-direction:column; gap:var(--spacing-xs,4px); }
    .slot-card.unavailable { opacity:.6; }
    .slot-facility { font-weight:600; font-size:.9375rem; }
    .slot-date, .slot-time { color:#757575; font-size:.875rem; }
    .btn-book { margin-top:auto; padding:6px; background:var(--color-primary,#1976d2); color:#fff; border:none; border-radius:var(--radius-sm,4px); cursor:pointer; font-size:.875rem; }
    .btn-book:disabled { opacity:.6; cursor:not-allowed; }
    .badge-taken { margin-top:auto; background:#fce4ec; color:#c62828; font-size:.8rem; font-weight:600; padding:4px 8px; border-radius:12px; text-align:center; }
  `],
})
export class BookingsComponent implements OnInit {
    private http = inject(HttpClient);

    state = signal<BookingState>({ status: 'loading' });
    booking = signal(false);
    bookingSuccess = signal(false);
    bookingError = signal<string | null>(null);

    ngOnInit(): void {
        this.http.get<FacilitySlotDto[]>(`${environment.apiUrl}/bookings/slots`).subscribe({
            next: (slots) => this.state.set({ status: 'loaded', slots }),
            error: (err) => this.state.set({ status: 'error', message: err.error?.message ?? 'Failed to load slots.' }),
        });
    }

    book(slotId: string): void {
        this.booking.set(true);
        this.bookingSuccess.set(false);
        this.bookingError.set(null);
        const request: BookingRequestDto = { slotId };
        this.http.post(`${environment.apiUrl}/bookings`, request).subscribe({
            next: () => {
                this.booking.set(false);
                this.bookingSuccess.set(true);
                // Reload slots to reflect updated availability
                this.ngOnInit();
            },
            error: (err) => {
                this.booking.set(false);
                if (err.status === 409) {
                    this.bookingError.set('Slot already taken. Please choose a different slot.');
                } else {
                    this.bookingError.set(err.error?.message ?? 'Booking failed. Please try again.');
                }
            },
        });
    }
}
