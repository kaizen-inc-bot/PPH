import { Component } from '@angular/core';

@Component({
    selector: 'app-backend-error',
    standalone: true,
    imports: [],
    template: `
    <main class="backend-error" role="main">
      <h1>Unable to Connect</h1>
      <p>Unable to connect to the server. Please check your connection and try again.</p>
      <button type="button" class="retry-btn" (click)="retry()">Retry</button>
    </main>
  `,
    styles: [`
    .backend-error {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 60vh;
      gap: var(--spacing-md, 16px);
      text-align: center;
      padding: var(--spacing-lg, 24px);
    }
    h1 { color: var(--color-error, #c62828); }
    .retry-btn {
      padding: var(--spacing-sm, 8px) var(--spacing-lg, 24px);
      background: var(--color-primary, #1976d2);
      color: white;
      border: none;
      border-radius: var(--radius-sm, 4px);
      cursor: pointer;
      font-size: 1rem;
    }
    .retry-btn:focus-visible {
      outline: 2px solid var(--color-primary, #1976d2);
      outline-offset: 2px;
    }
  `],
})
export class BackendErrorComponent {
    retry(): void {
        window.location.href = '/';
    }
}
