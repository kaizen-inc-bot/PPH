import { Component, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '@core/auth/auth.service';

interface QuickAction {
  label: string;
  description: string;
  icon: string;
  route: string;
  ariaLabel: string;
  badge?: string;
}

interface Stat {
  value: string;
  label: string;
  icon: string;
}

interface Notice {
  title: string;
  body: string;
  date: string;
  tag: string;
  tagColor: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="home-page">

      <!-- ── Welcome Banner ── -->
      <div class="welcome-banner" aria-labelledby="home-heading">
        <div class="welcome-text">
          <p class="welcome-eyebrow">PPH Digital Reception Portal</p>
          <h1 id="home-heading">Welcome back, {{ userName() }}</h1>
          <p class="welcome-sub">
            <span class="flat-chip">🏢 Flat {{ flatNumber() }}</span>
            <span class="date-chip">📅 {{ todayDate }}</span>
          </p>
          <p class="welcome-message">
            Your one-stop community hub — manage services, enrol children in coaching,
            and stay up to date with society notices, all from here.
          </p>
        </div>
        <div class="welcome-graphic" aria-hidden="true">
          <div class="graphic-circle c1"></div>
          <div class="graphic-circle c2"></div>
          <span class="graphic-icon">🏠</span>
        </div>
      </div>

      <!-- ── Community Stats Strip ── -->
      <div class="stats-strip" aria-label="Community overview">
        @for (stat of stats; track stat.label) {
          <div class="stat-item">
            <span class="stat-icon" aria-hidden="true">{{ stat.icon }}</span>
            <span class="stat-value">{{ stat.value }}</span>
            <span class="stat-label">{{ stat.label }}</span>
          </div>
        }
      </div>

      <!-- ── Services ── -->
      <section aria-labelledby="services-heading">
        <div class="section-header">
          <div>
            <h2 id="services-heading" class="section-heading">Services</h2>
            <p class="section-sub">Tap a service card to get started.</p>
          </div>
        </div>
        <div class="actions-grid" role="list">
          @for (action of quickActions; track action.route) {
            <a
              [routerLink]="action.route"
              class="action-card"
              role="listitem"
              [attr.aria-label]="action.ariaLabel"
            >
              @if (action.badge) {
                <span class="action-badge">{{ action.badge }}</span>
              }
              <span class="action-icon" aria-hidden="true">{{ action.icon }}</span>
              <span class="action-label">{{ action.label }}</span>
              <span class="action-desc">{{ action.description }}</span>
              <span class="action-arrow" aria-hidden="true">→</span>
            </a>
          }
        </div>
      </section>

      <!-- ── Latest Notices ── -->
      <section aria-labelledby="notices-heading">
        <div class="section-header">
          <div>
            <h2 id="notices-heading" class="section-heading">Latest Notices</h2>
            <p class="section-sub">Recent announcements from the management office.</p>
          </div>
        </div>
        <div class="notices-grid">
          @for (notice of notices; track notice.title) {
            <article class="notice-card">
              <div class="notice-top">
                <span class="notice-tag" [style.background]="notice.tagColor">{{ notice.tag }}</span>
                <span class="notice-date">{{ notice.date }}</span>
              </div>
              <h3 class="notice-title">{{ notice.title }}</h3>
              <p class="notice-body">{{ notice.body }}</p>
            </article>
          }
        </div>
      </section>

      <!-- ── Info Footer ── -->
      <div class="info-footer" role="contentinfo">
        <div class="info-item">
          <span aria-hidden="true">🕘</span>
          <div>
            <span class="info-label">Management Office Hours</span>
            <span class="info-value">Mon – Sat, 9 AM – 6 PM</span>
          </div>
        </div>
        <div class="info-divider" aria-hidden="true"></div>
        <div class="info-item">
          <span aria-hidden="true">📞</span>
          <div>
            <span class="info-label">Helpdesk</span>
            <span class="info-value">+91 98765 43210</span>
          </div>
        </div>
        <div class="info-divider" aria-hidden="true"></div>
        <div class="info-item">
          <span aria-hidden="true">🚨</span>
          <div>
            <span class="info-label">Security (24 × 7)</span>
            <span class="info-value">+91 98765 00001</span>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    /* ── Layout ─────────────────────────────────────────────────────────── */
    .home-page { display: flex; flex-direction: column; gap: 28px; }

    /* ── Welcome Banner ─────────────────────────────────────────────────── */
    .welcome-banner {
      position: relative; overflow: hidden;
      display: flex; justify-content: space-between; align-items: center;
      background: linear-gradient(135deg, #0d47a1 0%, #1565c0 40%, #1976d2 75%, #1e88e5 100%);
      color: #fff; border-radius: var(--radius-lg, 16px);
      padding: 36px 40px; gap: 16px;
    }
    .welcome-eyebrow {
      font-size: .75rem; font-weight: 700; letter-spacing: .12em;
      text-transform: uppercase; opacity: .7; margin: 0 0 8px;
    }
    .welcome-text h1 { font-size: 1.75rem; margin: 0 0 12px; font-weight: 700; line-height: 1.2; }
    .welcome-sub { display: flex; flex-wrap: wrap; gap: 8px; margin: 0 0 14px; }
    .flat-chip, .date-chip {
      background: rgba(255,255,255,.18); border: 1px solid rgba(255,255,255,.25);
      border-radius: 20px; padding: 3px 12px; font-size: .8125rem; font-weight: 500;
    }
    .welcome-message { margin: 0; opacity: .88; font-size: .9375rem; line-height: 1.65; max-width: 520px; }

    /* decorative circles */
    .welcome-graphic { position: relative; flex-shrink: 0; width: 120px; height: 120px; }
    .graphic-circle {
      position: absolute; border-radius: 50%;
      background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.12);
    }
    .c1 { width: 120px; height: 120px; top: 0; left: 0; }
    .c2 { width: 80px; height: 80px; top: 20px; left: 20px; background: rgba(255,255,255,.06); }
    .graphic-icon {
      position: absolute; font-size: 3rem;
      top: 50%; left: 50%; transform: translate(-50%, -50%);
    }

    /* ── Stats Strip ────────────────────────────────────────────────────── */
    .stats-strip {
      display: grid; grid-template-columns: repeat(4, 1fr);
      background: #fff; border-radius: var(--radius-md, 8px);
      border: 1px solid #e8e8e8; box-shadow: 0 1px 4px rgba(0,0,0,.06);
      overflow: hidden;
    }
    .stat-item {
      display: flex; flex-direction: column; align-items: center;
      padding: 20px 12px; gap: 4px; border-right: 1px solid #f0f0f0;
      text-align: center;
    }
    .stat-item:last-child { border-right: none; }
    .stat-icon { font-size: 1.5rem; }
    .stat-value { font-size: 1.25rem; font-weight: 800; color: #1565c0; line-height: 1; }
    .stat-label { font-size: .75rem; color: #757575; font-weight: 500; text-transform: uppercase; letter-spacing: .04em; }

    /* ── Section Headers ─────────────────────────────────────────────────── */
    .section-header { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 14px; }
    .section-heading { font-size: 1.0625rem; font-weight: 700; margin: 0 0 2px; color: #212121; }
    .section-sub { margin: 0; font-size: .8125rem; color: #757575; }

    /* ── Services Grid ──────────────────────────────────────────────────── */
    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 16px;
    }
    .action-card {
      position: relative;
      display: flex; flex-direction: column; align-items: center;
      background: #fff; border-radius: var(--radius-md, 8px);
      box-shadow: 0 1px 4px rgba(0,0,0,.07);
      border: 1.5px solid #e8e8e8;
      padding: 28px 16px 20px;
      text-decoration: none; color: #212121;
      gap: 4px; text-align: center;
      transition: box-shadow .2s, transform .15s, border-color .15s;
    }
    .action-card:hover {
      box-shadow: 0 8px 24px rgba(25,118,210,.15);
      transform: translateY(-4px);
      border-color: #1976d2;
    }
    .action-card:focus-visible { outline: 2px solid var(--color-primary, #1976d2); outline-offset: 2px; }
    .action-badge {
      position: absolute; top: 10px; right: 10px;
      background: #e53935; color: #fff;
      font-size: .65rem; font-weight: 800; padding: 2px 8px;
      border-radius: 10px; text-transform: uppercase; letter-spacing: .06em;
    }
    .action-icon { font-size: 2.5rem; margin-bottom: 6px; }
    .action-label { font-size: .9375rem; font-weight: 700; color: #212121; }
    .action-desc { font-size: .775rem; color: #757575; line-height: 1.45; }
    .action-arrow {
      margin-top: 8px; font-size: .875rem; color: #1976d2; font-weight: 700;
      opacity: 0; transform: translateX(-4px);
      transition: opacity .2s, transform .2s;
    }
    .action-card:hover .action-arrow { opacity: 1; transform: translateX(0); }

    /* ── Notices ────────────────────────────────────────────────────────── */
    .notices-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 16px;
    }
    .notice-card {
      background: #fff; border-radius: var(--radius-md, 8px);
      border: 1px solid #e8e8e8; padding: 20px;
      box-shadow: 0 1px 4px rgba(0,0,0,.06);
      display: flex; flex-direction: column; gap: 8px;
    }
    .notice-top { display: flex; justify-content: space-between; align-items: center; }
    .notice-tag {
      color: #fff; font-size: .7rem; font-weight: 700;
      padding: 2px 8px; border-radius: 10px;
      text-transform: uppercase; letter-spacing: .05em;
    }
    .notice-date { font-size: .75rem; color: #9e9e9e; }
    .notice-title { font-size: .9375rem; font-weight: 700; color: #212121; margin: 0; }
    .notice-body { font-size: .8125rem; color: #616161; margin: 0; line-height: 1.55; }

    /* ── Info Footer ────────────────────────────────────────────────────── */
    .info-footer {
      display: flex; flex-wrap: wrap; align-items: center; gap: 0;
      background: #fff; border-radius: var(--radius-md, 8px);
      border: 1px solid #e8e8e8; padding: 18px 28px;
      box-shadow: 0 1px 4px rgba(0,0,0,.06);
    }
    .info-item { display: flex; align-items: center; gap: 10px; flex: 1; min-width: 180px; padding: 6px 0; }
    .info-item > span:first-child { font-size: 1.25rem; }
    .info-label { font-size: .7rem; color: #9e9e9e; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; display: block; }
    .info-value { font-size: .875rem; color: #212121; font-weight: 600; display: block; }
    .info-divider { width: 1px; height: 40px; background: #e8e8e8; margin: 0 24px; }

    /* ── Responsive ─────────────────────────────────────────────────────── */
    @media (max-width: 640px) {
      .welcome-banner { padding: 24px 20px; }
      .welcome-text h1 { font-size: 1.375rem; }
      .welcome-graphic { display: none; }
      .stats-strip { grid-template-columns: repeat(2, 1fr); }
      .stat-item:nth-child(2) { border-right: none; }
      .info-divider { display: none; }
      .info-footer { gap: 8px; }
    }
  `],
})
export class HomeComponent {
  private authService = inject(AuthService);

  readonly todayDate = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  userName = computed(() => {
    const s = this.authService.state();
    return s.status === 'authenticated' ? s.user.fullName : 'Resident';
  });

  flatNumber = computed(() => {
    const s = this.authService.state();
    return s.status === 'authenticated' ? s.user.flatNumber : '';
  });

  readonly stats: Stat[] = [
    { value: '240', label: 'Residential Units', icon: '🏢' },
    { value: '12', label: 'Amenities', icon: '🏊' },
    { value: '2018', label: 'Est. Year', icon: '📅' },
    { value: '24×7', label: 'Security', icon: '🛡️' },
  ];

  readonly notices: Notice[] = [
    {
      title: 'Children\'s Coaching Registration Open',
      body: 'Enrolments for Football, Karate and Swimming are now open for June 2026. Seats are limited — register early to secure your child\'s spot.',
      date: '17 May 2026',
      tag: 'New',
      tagColor: '#1976d2',
    },
    {
      title: 'Scheduled Water Supply Interruption',
      body: 'Overhead tank maintenance on 20 May 2026 from 10 AM to 2 PM. Please store adequate water. Inconvenience is regretted.',
      date: '15 May 2026',
      tag: 'Maintenance',
      tagColor: '#f57c00',
    },
    {
      title: 'AGM — June 2026',
      body: 'The Annual General Meeting will be held on 7 June 2026 at 5 PM in the Community Hall. All residents are requested to attend.',
      date: '10 May 2026',
      tag: 'Announcement',
      tagColor: '#388e3c',
    },
  ];

  readonly quickActions: QuickAction[] = [
    {
      label: 'Children\'s Coaching',
      description: 'Enrol in Football, Karate, Swimming & more',
      icon: '🏅',
      route: '/concierge/coaching',
      ariaLabel: 'Register children for coaching programs',
      badge: 'New',
    },
    // hidden for first release:
    // { label: 'Summer Camp', description: 'Register for the annual summer camp', icon: '☀️', route: '/concierge/summer-camp', ariaLabel: 'Register for summer camp' },
    // { label: 'Pay CAM', description: 'Pay Common Area Maintenance charges', icon: '💳', route: '/concierge/cam-payment', ariaLabel: 'Pay CAM charges' },
    // { label: 'Book Court', description: 'Reserve a recreational facility', icon: '🏸', route: '/concierge/booking', ariaLabel: 'Book a facility' },
    // { label: 'Register Complaint', description: 'Submit a maintenance or other complaint', icon: '📋', route: '/concierge/complaint', ariaLabel: 'Submit a complaint' },
  ];
}
