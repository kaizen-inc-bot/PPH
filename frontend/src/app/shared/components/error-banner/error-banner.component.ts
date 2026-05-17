import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-error-banner',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="error-banner" role="alert" aria-live="assertive">
      <span class="error-message">{{ message }}</span>
      <button
        *ngIf="dismissible"
        class="dismiss-btn"
        type="button"
        aria-label="Dismiss error"
        (click)="dismiss.emit()"
      >
        ✕
      </button>
    </div>
  `,
    styles: [`
    .error-banner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: var(--color-error-bg, #fdecea);
      border: 1px solid var(--color-error, #f44336);
      border-radius: var(--radius-sm, 4px);
      padding: var(--spacing-sm, 8px) var(--spacing-md, 16px);
      gap: var(--spacing-sm, 8px);
    }
    .error-message {
      color: var(--color-error, #c62828);
      font-size: 0.875rem;
    }
    .dismiss-btn {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--color-error, #c62828);
      font-size: 1rem;
      padding: 2px 6px;
    }
    .dismiss-btn:focus-visible {
      outline: 2px solid var(--color-primary, #1976d2);
      outline-offset: 2px;
    }
  `],
})
export class ErrorBannerComponent {
    @Input() message = 'An error occurred.';
    @Input() dismissible = false;
    @Output() dismiss = new EventEmitter<void>();
}
