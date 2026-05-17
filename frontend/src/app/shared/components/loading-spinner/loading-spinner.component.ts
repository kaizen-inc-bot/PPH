import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-loading-spinner',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="spinner-wrapper" role="status" [attr.aria-label]="message">
      <div class="spinner"></div>
      <span class="spinner-message">{{ message }}</span>
    </div>
  `,
    styles: [`
    .spinner-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--spacing-lg, 24px);
      gap: var(--spacing-sm, 8px);
    }
    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid var(--color-surface, #e0e0e0);
      border-top-color: var(--color-primary, #1976d2);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .spinner-message {
      font-size: 0.875rem;
      color: var(--color-secondary, #757575);
    }
  `],
})
export class LoadingSpinnerComponent {
    @Input() message = 'Loading…';
}
