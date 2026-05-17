import { Component, inject, OnInit, OnDestroy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoticeService } from '@core/notices/notice.service';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { ErrorBannerComponent } from '@shared/components/error-banner/error-banner.component';
import { NoticeDto } from '@shared/models/loading-state';

@Component({
    selector: 'app-notice-board',
    standalone: true,
    imports: [CommonModule, LoadingSpinnerComponent, ErrorBannerComponent],
    template: `
    <section aria-labelledby="notices-heading">
      <h1 id="notices-heading">Notice Board</h1>

      @if (pollingFailed()) {
        <app-error-banner
          message="Unable to load notices. Please check your connection and try again."
          [dismissible]="false"
        />
      }

      @if (state().status === 'loading') {
        <app-loading-spinner message="Loading notices…" />
      }

      @if (pinnedNotices().length > 0) {
        <section aria-labelledby="pinned-heading" class="notices-section">
          <h2 id="pinned-heading" class="section-label">📌 Pinned</h2>
          <ul class="notice-list" role="list">
            @for (notice of pinnedNotices(); track notice.id) {
              <li class="notice-card pinned">
                <ng-container *ngTemplateOutlet="noticeTemplate; context: { $implicit: notice }" />
              </li>
            }
          </ul>
        </section>
      }

      @if (regularNotices().length > 0) {
        <section aria-labelledby="recent-heading" class="notices-section">
          <h2 id="recent-heading" class="section-label">Recent</h2>
          <ul class="notice-list" role="list">
            @for (notice of regularNotices(); track notice.id) {
              <li class="notice-card">
                <ng-container *ngTemplateOutlet="noticeTemplate; context: { $implicit: notice }" />
              </li>
            }
          </ul>
        </section>
      }

      @if (state().status === 'loaded' && pinnedNotices().length === 0 && regularNotices().length === 0) {
        <p class="empty" role="status">No notices at this time.</p>
      }
    </section>

    <ng-template #noticeTemplate let-notice>
      <div class="notice-header">
        <span class="notice-title">{{ notice.title }}</span>
        <span class="notice-category">{{ notice.category }}</span>
      </div>
      <p class="notice-body">{{ notice.body }}</p>
      <time class="notice-date" [attr.datetime]="notice.publishAt">{{ notice.publishAt | date:'mediumDate' }}</time>
    </ng-template>
  `,
    styles: [`
    h1 { margin-bottom:var(--spacing-lg,24px); }
    .notices-section { margin-bottom:var(--spacing-xl,32px); }
    .section-label { font-size:1rem; font-weight:600; margin-bottom:var(--spacing-sm,8px); color:#757575; }
    .notice-list { list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:var(--spacing-sm,8px); }
    .notice-card { background:#fff; border-radius:var(--radius-md,8px); padding:var(--spacing-md,16px); box-shadow:0 1px 4px rgba(0,0,0,.08); }
    .notice-card.pinned { border-left:4px solid var(--color-primary,#1976d2); background:#f8fbff; }
    .notice-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:var(--spacing-xs,4px); flex-wrap:wrap; gap:var(--spacing-xs,4px); }
    .notice-title { font-weight:600; }
    .notice-category { font-size:.75rem; background:#e3f2fd; color:#1565c0; padding:2px 8px; border-radius:12px; }
    .notice-body { color:#424242; font-size:.9375rem; line-height:1.6; margin:0 0 var(--spacing-xs,4px); }
    .notice-date { font-size:.8rem; color:#9e9e9e; }
    .empty { color:#757575; font-style:italic; }
  `],
})
export class NoticeBoardComponent implements OnInit, OnDestroy {
    private noticeService = inject(NoticeService);

    state = this.noticeService.state;

    pinnedNotices = computed(() =>
        this.state().notices.filter((n) => n.isPinned)
    );

    regularNotices = computed(() =>
        this.state()
            .notices.filter((n) => !n.isPinned)
            .sort((a, b) => new Date(b.publishAt).getTime() - new Date(a.publishAt).getTime())
    );

    pollingFailed = computed(
        () => this.state().consecutiveFailures >= 3 && this.state().status !== 'loaded'
    );

    ngOnInit(): void {
        this.noticeService.startPolling();
    }

    ngOnDestroy(): void {
        this.noticeService.stopPolling();
    }
}
