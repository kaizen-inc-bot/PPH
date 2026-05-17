import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-access-denied',
    standalone: true,
    imports: [RouterLink],
    template: `
    <main class="access-denied" role="main">
      <h1>Access Denied</h1>
      <p>You don't have permission to view this page.</p>
      <a routerLink="/home" class="back-link">Return to Home</a>
    </main>
  `,
    styles: [`
    .access-denied {
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
    .back-link {
      color: var(--color-primary, #1976d2);
      text-decoration: underline;
    }
    .back-link:focus-visible {
      outline: 2px solid var(--color-primary, #1976d2);
      outline-offset: 2px;
    }
  `],
})
export class AccessDeniedComponent { }
