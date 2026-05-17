import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-page-not-found',
    standalone: true,
    imports: [RouterLink],
    template: `
    <main class="not-found" role="main">
      <h1>Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <a routerLink="/home" class="back-link">Return to Home</a>
    </main>
  `,
    styles: [`
    .not-found {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 60vh;
      gap: var(--spacing-md, 16px);
      text-align: center;
      padding: var(--spacing-lg, 24px);
    }
    h1 { color: var(--color-secondary, #757575); }
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
export class PageNotFoundComponent { }
