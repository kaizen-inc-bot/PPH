import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { ErrorBannerComponent } from '@shared/components/error-banner/error-banner.component';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

interface FaqItem {
    id: string;
    question: string;
    answer: string;
    category: string;
}

type FaqState =
    | { status: 'loading' }
    | { status: 'loaded'; items: FaqItem[] }
    | { status: 'error'; message: string };

@Component({
    selector: 'app-faq',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, LoadingSpinnerComponent, ErrorBannerComponent],
    template: `
    <section aria-labelledby="faq-heading">
      <h1 id="faq-heading">Frequently Asked Questions</h1>

      <label for="faq-search" class="sr-only">Search FAQs</label>
      <input
        id="faq-search"
        type="search"
        [formControl]="searchControl"
        placeholder="Search questions…"
        class="search-input"
        aria-label="Search FAQs"
      />

      @if (state().status === 'loading') {
        <app-loading-spinner message="Loading FAQs…" />
      }
      @if (state().status === 'error') {
        <app-error-banner [message]="$any(state()).message" />
      }
      @if (state().status === 'loaded') {
        @if (filteredItems().length === 0) {
          <p class="no-results" role="status">No FAQs match your search.</p>
        }
        <dl class="faq-list">
          @for (item of filteredItems(); track item.id) {
            <div class="faq-item">
              <dt>
                <button
                  type="button"
                  class="faq-question"
                  [attr.aria-expanded]="expanded().has(item.id)"
                  (click)="toggle(item.id)"
                >
                  {{ item.question }}
                  <span class="faq-chevron" aria-hidden="true">{{ expanded().has(item.id) ? '▲' : '▼' }}</span>
                </button>
              </dt>
              @if (expanded().has(item.id)) {
                <dd class="faq-answer">{{ item.answer }}</dd>
              }
            </div>
          }
        </dl>
      }
    </section>
  `,
    styles: [`
    h1 { margin-bottom:var(--spacing-md,16px); }
    .search-input { width:100%; padding:var(--spacing-sm,8px) var(--spacing-md,16px); border:1px solid #bdbdbd; border-radius:var(--radius-sm,4px); font-size:1rem; margin-bottom:var(--spacing-lg,24px); }
    .sr-only { position:absolute; width:1px; height:1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; }
    .faq-list { margin:0; }
    .faq-item { border-bottom:1px solid #e0e0e0; }
    .faq-question { width:100%; display:flex; justify-content:space-between; align-items:center; padding:var(--spacing-md,16px) 0; background:none; border:none; cursor:pointer; font-size:1rem; text-align:left; font-weight:500; }
    .faq-question:focus-visible { outline:2px solid var(--color-primary,#1976d2); }
    .faq-chevron { font-size:.75rem; color:#9e9e9e; margin-left:var(--spacing-sm,8px); flex-shrink:0; }
    .faq-answer { padding:0 0 var(--spacing-md,16px); color:#424242; line-height:1.6; margin:0; }
    .no-results { color:#757575; font-style:italic; }
  `],
})
export class FaqComponent implements OnInit {
    private http = inject(HttpClient);

    state = signal<FaqState>({ status: 'loading' });
    expanded = signal<Set<string>>(new Set());
    searchTerm = signal('');
    searchControl = new FormControl('');

    filteredItems() {
        const s = this.state();
        if (s.status !== 'loaded') return [];
        const q = this.searchTerm().toLowerCase();
        if (!q) return s.items;
        return s.items.filter(
            (i) => i.question.toLowerCase().includes(q) || i.answer.toLowerCase().includes(q)
        );
    }

    ngOnInit(): void {
        this.searchControl.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe((v) =>
            this.searchTerm.set(v ?? '')
        );
        this.http.get<FaqItem[]>(`${environment.apiUrl}/faq`).subscribe({
            next: (items) => this.state.set({ status: 'loaded', items }),
            error: (err) => this.state.set({ status: 'error', message: err.error?.message ?? 'Failed to load FAQs.' }),
        });
    }

    toggle(id: string): void {
        const current = new Set(this.expanded());
        if (current.has(id)) {
            current.delete(id);
        } else {
            current.add(id);
        }
        this.expanded.set(current);
    }
}
