import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { ErrorBannerComponent } from '@shared/components/error-banner/error-banner.component';

export interface CoachingProgram {
    id: string;
    name: string;
    icon: string;
    ageMin: number;
    ageMax: number;
    fee: number;
    currency: string;
    schedule: string;
    venue: string;
    coach: string;
    coachQualification: string;
    description: string;
    highlights: string[];
    maxStrength: number;
    duration: string;
    startDate: string;
    registrationDeadline: string;
    equipment: string;
}

export interface CoachingCategory {
    id: string;
    label: string;
    icon: string;
    description: string;
    programs: CoachingProgram[];
}

interface CoachingConfig {
    categories: CoachingCategory[];
}

@Component({
    selector: 'app-coaching',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, LoadingSpinnerComponent, ErrorBannerComponent],
    template: `
    <div class="coaching-page">

      <!-- Page Hero -->
      <div class="page-hero">
        <div class="hero-content">
          <h1 class="hero-title">Children's Coaching Programs</h1>
          <p class="hero-subtitle">
            Enrol your child in professionally coached programs designed to build skills,
            confidence, and character — right within our community.
          </p>
          <div class="hero-badges">
            <span class="badge"><span aria-hidden="true">👶</span> Ages 4–16</span>
            <span class="badge"><span aria-hidden="true">🏆</span> Certified Coaches</span>
            <span class="badge"><span aria-hidden="true">📅</span> Starting June 2026</span>
          </div>
        </div>
      </div>

      @if (configLoading()) {
        <div class="loading-container">
          <app-loading-spinner />
          <p>Loading available programs…</p>
        </div>
      } @else if (configError()) {
        <app-error-banner [message]="configError()!" />
      } @else if (!selectedProgram()) {

        <!-- Category Tabs -->
        <div class="category-tabs" role="tablist" aria-label="Coaching categories">
          @for (cat of categories(); track cat.id) {
            <button
              class="tab-btn"
              role="tab"
              [attr.aria-selected]="activeCategory() === cat.id"
              [class.active]="activeCategory() === cat.id"
              (click)="selectCategory(cat.id)"
            >
              <span aria-hidden="true">{{ cat.icon }}</span>
              {{ cat.label }}
            </button>
          }
        </div>

        <!-- Category Description -->
        @for (cat of categories(); track cat.id) {
          @if (activeCategory() === cat.id) {
            <div class="category-info">
              <p class="category-desc">{{ cat.description }}</p>
            </div>
          }
        }

        <!-- Program Cards -->
        <div class="programs-section">
          @if (activePrograms().length === 0) {
            <div class="empty-state">
              <span class="empty-icon" aria-hidden="true">🚧</span>
              <h3>Programs Coming Soon</h3>
              <p>We are onboarding coaches for this category. Check back in the next update or contact the management office for details.</p>
            </div>
          } @else {
            <div class="programs-grid">
              @for (prog of activePrograms(); track prog.id) {
                <article class="program-card" [attr.aria-label]="prog.name + ' coaching program'">
                  <div class="card-header">
                    <span class="prog-icon" aria-hidden="true">{{ prog.icon }}</span>
                    <div>
                      <h3 class="prog-name">{{ prog.name }}</h3>
                      <span class="prog-duration">{{ prog.duration }} program</span>
                    </div>
                    <span class="prog-fee">₹{{ prog.fee | number }}<small>/term</small></span>
                  </div>

                  <p class="prog-desc">{{ prog.description }}</p>

                  <ul class="prog-highlights" aria-label="Highlights">
                    @for (h of prog.highlights; track h) {
                      <li><span aria-hidden="true">✓</span> {{ h }}</li>
                    }
                  </ul>

                  <div class="prog-meta">
                    <div class="meta-row">
                      <span class="meta-icon" aria-hidden="true">👨‍🏫</span>
                      <div>
                        <span class="meta-label">Coach</span>
                        <span class="meta-value">{{ prog.coach }}</span>
                        <span class="meta-sub">{{ prog.coachQualification }}</span>
                      </div>
                    </div>
                    <div class="meta-row">
                      <span class="meta-icon" aria-hidden="true">📅</span>
                      <div>
                        <span class="meta-label">Schedule</span>
                        <span class="meta-value">{{ prog.schedule }}</span>
                      </div>
                    </div>
                    <div class="meta-row">
                      <span class="meta-icon" aria-hidden="true">📍</span>
                      <div>
                        <span class="meta-label">Venue</span>
                        <span class="meta-value">{{ prog.venue }}</span>
                      </div>
                    </div>
                    <div class="meta-row">
                      <span class="meta-icon" aria-hidden="true">👦</span>
                      <div>
                        <span class="meta-label">Age Group</span>
                        <span class="meta-value">{{ prog.ageMin }}–{{ prog.ageMax }} years</span>
                      </div>
                    </div>
                    <div class="meta-row">
                      <span class="meta-icon" aria-hidden="true">👥</span>
                      <div>
                        <span class="meta-label">Batch Strength</span>
                        <span class="meta-value">Max {{ prog.maxStrength }} students</span>
                      </div>
                    </div>
                    <div class="meta-row">
                      <span class="meta-icon" aria-hidden="true">🎒</span>
                      <div>
                        <span class="meta-label">Equipment</span>
                        <span class="meta-value">{{ prog.equipment }}</span>
                      </div>
                    </div>
                  </div>

                  <div class="card-deadline">
                    <span aria-hidden="true">⏰</span>
                    Registration closes <strong>{{ prog.registrationDeadline | date:'d MMM yyyy' }}</strong>
                  </div>

                  <button class="btn-register" (click)="selectProgram(prog)" type="button">
                    Register for {{ prog.name }}
                  </button>
                </article>
              }
            </div>
          }
        </div>

      } @else {

        <!-- Registration Form -->
        <div class="form-page">
          <div class="form-back">
            <button class="btn-back" type="button" (click)="backToPrograms()">
              <span aria-hidden="true">←</span> Back to Programs
            </button>
          </div>

          <div class="form-layout">

            <!-- Selected Program Summary -->
            <aside class="form-summary" aria-label="Selected program summary">
              <div class="summary-header">
                <span class="summary-icon" aria-hidden="true">{{ selectedProgram()!.icon }}</span>
                <div>
                  <h2>{{ selectedProgram()!.name }}</h2>
                  <span class="summary-cat">{{ activeCategoryLabel() }}</span>
                </div>
              </div>
              <dl class="summary-details">
                <dt>Fee</dt>
                <dd>₹{{ selectedProgram()!.fee | number }} <small>per term ({{ selectedProgram()!.duration }})</small></dd>
                <dt>Schedule</dt>
                <dd>{{ selectedProgram()!.schedule }}</dd>
                <dt>Venue</dt>
                <dd>{{ selectedProgram()!.venue }}</dd>
                <dt>Coach</dt>
                <dd>{{ selectedProgram()!.coach }}</dd>
                <dt>Age Group</dt>
                <dd>{{ selectedProgram()!.ageMin }}–{{ selectedProgram()!.ageMax }} years</dd>
                <dt>Starts</dt>
                <dd>{{ selectedProgram()!.startDate | date:'d MMMM yyyy' }}</dd>
                <dt>Reg. Deadline</dt>
                <dd>{{ selectedProgram()!.registrationDeadline | date:'d MMMM yyyy' }}</dd>
              </dl>
              <div class="summary-note">
                <span aria-hidden="true">ℹ️</span>
                Seats are limited to <strong>{{ selectedProgram()!.maxStrength }}</strong> students.
                Register early to secure your child's place.
              </div>
            </aside>

            <!-- Form -->
            <div class="form-container">
              @if (success()) {
                <div class="success-card" role="status">
                  <span class="success-icon" aria-hidden="true">🎉</span>
                  <h2>Registration Submitted!</h2>
                  <p>
                    Thank you for registering your child for <strong>{{ selectedProgram()!.name }}</strong>.
                    Our team will review your application and send a confirmation to your registered contact.
                  </p>
                  <p class="success-sub">Please carry this confirmation when attending the first session on
                    <strong>{{ selectedProgram()!.startDate | date:'d MMMM yyyy' }}</strong>.</p>
                  <button class="btn-primary" type="button" (click)="backToPrograms()">
                    Register Another Child
                  </button>
                </div>
              } @else {
                <div class="form-header">
                  <h2>Registration Form</h2>
                  <p class="form-subtitle">
                    Please fill in your child's details below. All fields marked <abbr title="required">*</abbr> are mandatory.
                  </p>
                </div>

                <app-error-banner
                  *ngIf="error()"
                  [message]="error()!"
                  [dismissible]="true"
                  (dismiss)="error.set(null)"
                />

                <form [formGroup]="form" (ngSubmit)="submit()" novalidate class="reg-form">

                  <fieldset class="form-section">
                    <legend>Child's Information</legend>

                    <div class="form-group">
                      <label for="childName" class="form-label">Full Name <span aria-hidden="true" class="required">*</span></label>
                      <input id="childName" type="text" formControlName="childName" class="form-input"
                        placeholder="e.g. Aarav Sharma"
                        [class.invalid]="isInvalid('childName')"
                        autocomplete="name" />
                      @if (isInvalid('childName')) {
                        <span class="field-error" role="alert">Please enter the child's full name</span>
                      }
                    </div>

                    <div class="form-row">
                      <div class="form-group">
                        <label for="childAge" class="form-label">Age <span aria-hidden="true" class="required">*</span></label>
                        <input id="childAge" type="number" formControlName="childAge" class="form-input"
                          [attr.min]="selectedProgram()!.ageMin"
                          [attr.max]="selectedProgram()!.ageMax"
                          [placeholder]="selectedProgram()!.ageMin + '–' + selectedProgram()!.ageMax + ' years'"
                          [class.invalid]="isInvalid('childAge')" />
                        @if (isInvalid('childAge')) {
                          <span class="field-error" role="alert">
                            Age must be {{ selectedProgram()!.ageMin }}–{{ selectedProgram()!.ageMax }} years
                          </span>
                        }
                      </div>

                      <div class="form-group">
                        <label for="gender" class="form-label">Gender</label>
                        <select id="gender" formControlName="gender" class="form-input">
                          <option value="">Prefer not to say</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div class="form-group">
                      <label for="schoolName" class="form-label">School (optional)</label>
                      <input id="schoolName" type="text" formControlName="schoolName" class="form-input"
                        placeholder="e.g. Delhi Public School" />
                    </div>
                  </fieldset>

                  <fieldset class="form-section">
                    <legend>Guardian / Parent Details</legend>

                    <div class="form-group">
                      <label for="guardianName" class="form-label">Guardian's Name <span aria-hidden="true" class="required">*</span></label>
                      <input id="guardianName" type="text" formControlName="guardianName" class="form-input"
                        placeholder="e.g. Priya Sharma"
                        [class.invalid]="isInvalid('guardianName')"
                        autocomplete="name" />
                      @if (isInvalid('guardianName')) {
                        <span class="field-error" role="alert">Please enter the guardian's name</span>
                      }
                    </div>

                    <div class="form-row">
                      <div class="form-group">
                        <label for="contactNumber" class="form-label">Mobile Number <span aria-hidden="true" class="required">*</span></label>
                        <input id="contactNumber" type="tel" formControlName="contactNumber" class="form-input"
                          placeholder="10-digit mobile number"
                          [class.invalid]="isInvalid('contactNumber')"
                          autocomplete="tel" />
                        @if (isInvalid('contactNumber')) {
                          <span class="field-error" role="alert">Enter a valid 10-digit number</span>
                        }
                      </div>

                      <div class="form-group">
                        <label for="email" class="form-label">Email (optional)</label>
                        <input id="email" type="email" formControlName="email" class="form-input"
                          placeholder="For confirmation email"
                          [class.invalid]="isInvalid('email')"
                          autocomplete="email" />
                        @if (isInvalid('email')) {
                          <span class="field-error" role="alert">Enter a valid email address</span>
                        }
                      </div>
                    </div>

                    <div class="form-group">
                      <label for="flatNumber" class="form-label">Flat / Unit Number <span aria-hidden="true" class="required">*</span></label>
                      <input id="flatNumber" type="text" formControlName="flatNumber" class="form-input"
                        placeholder="e.g. A-402"
                        [class.invalid]="isInvalid('flatNumber')" />
                      @if (isInvalid('flatNumber')) {
                        <span class="field-error" role="alert">Please enter your flat number</span>
                      }
                    </div>
                  </fieldset>

                  <fieldset class="form-section">
                    <legend>Health & Additional Notes</legend>

                    <div class="form-group">
                      <label for="medicalNotes" class="form-label">Medical Conditions / Allergies (optional)</label>
                      <textarea id="medicalNotes" formControlName="medicalNotes" class="form-input" rows="3"
                        placeholder="Any allergies, medical conditions or special requirements the coach should be aware of…"></textarea>
                    </div>

                    <div class="form-group">
                      <label for="emergencyContact" class="form-label">Emergency Contact Number (optional)</label>
                      <input id="emergencyContact" type="tel" formControlName="emergencyContact" class="form-input"
                        placeholder="Alternate number in case of emergency" autocomplete="tel" />
                    </div>
                  </fieldset>

                  <div class="form-group terms-group">
                    <label class="checkbox-label">
                      <input type="checkbox" formControlName="termsAccepted" class="checkbox-input" />
                      <span>
                        I confirm that the information provided is accurate and I agree to the
                        <a href="#" class="terms-link">coaching program terms & conditions</a>,
                        including the fee schedule and attendance policy.
                        <span aria-hidden="true" class="required"> *</span>
                      </span>
                    </label>
                    @if (isInvalid('termsAccepted')) {
                      <span class="field-error" role="alert">You must accept the terms to proceed</span>
                    }
                  </div>

                  <div class="form-actions">
                    <button type="button" class="btn-secondary" (click)="backToPrograms()">Cancel</button>
                    <button type="submit" class="btn-primary" [disabled]="loading()">
                      @if (loading()) { <app-loading-spinner /> Submitting… } @else { Submit Registration }
                    </button>
                  </div>
                </form>
              }
            </div>
          </div>
        </div>
      }
    </div>
  `,
    styles: [`
    /* ── Page Layout ───────────────────────────────────────────────────── */
    .coaching-page { --card-shadow: 0 2px 8px rgba(0,0,0,.09); }

    /* ── Hero ──────────────────────────────────────────────────────────── */
    .page-hero {
      background: linear-gradient(135deg, #1565c0 0%, #1976d2 60%, #42a5f5 100%);
      color: #fff;
      border-radius: var(--radius-lg, 16px);
      padding: 36px 32px;
      margin-bottom: 32px;
    }
    .hero-title { font-size: 1.75rem; font-weight: 700; margin: 0 0 8px; }
    .hero-subtitle { font-size: 1rem; opacity: .9; margin: 0 0 20px; max-width: 600px; line-height: 1.6; }
    .hero-badges { display: flex; flex-wrap: wrap; gap: 10px; }
    .badge {
      background: rgba(255,255,255,.18); border: 1px solid rgba(255,255,255,.3);
      border-radius: 20px; padding: 4px 14px; font-size: .8125rem; font-weight: 500;
    }

    /* ── Loading ───────────────────────────────────────────────────────── */
    .loading-container { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 48px; color: #757575; }

    /* ── Category Tabs ─────────────────────────────────────────────────── */
    .category-tabs { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px; }
    .tab-btn {
      display: flex; align-items: center; gap: 6px;
      padding: 10px 20px; border: 1.5px solid #e0e0e0;
      border-radius: 24px; background: #fff; cursor: pointer;
      font-size: .9rem; font-weight: 500; color: #424242;
      transition: all .2s;
    }
    .tab-btn:hover { border-color: #1976d2; color: #1976d2; }
    .tab-btn.active { background: #1976d2; border-color: #1976d2; color: #fff; }

    .category-info { margin-bottom: 24px; }
    .category-desc { color: #616161; font-size: .9375rem; margin: 0; line-height: 1.6; }

    /* ── Program Grid ──────────────────────────────────────────────────── */
    .programs-section { }
    .programs-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 24px;
    }

    /* ── Program Card ──────────────────────────────────────────────────── */
    .program-card {
      background: #fff; border-radius: var(--radius-md, 8px);
      box-shadow: var(--card-shadow); border: 1px solid #e8e8e8;
      padding: 24px; display: flex; flex-direction: column; gap: 16px;
      transition: box-shadow .2s, transform .15s;
    }
    .program-card:hover { box-shadow: 0 6px 20px rgba(0,0,0,.13); transform: translateY(-2px); }

    .card-header { display: flex; align-items: flex-start; gap: 14px; }
    .prog-icon { font-size: 2.25rem; line-height: 1; flex-shrink: 0; }
    .prog-name { font-size: 1.1875rem; font-weight: 700; margin: 0 0 2px; color: #212121; }
    .prog-duration { font-size: .8rem; color: #1976d2; font-weight: 500; text-transform: uppercase; letter-spacing: .03em; }
    .prog-fee { margin-left: auto; text-align: right; font-size: 1.25rem; font-weight: 700; color: #1565c0; white-space: nowrap; }
    .prog-fee small { font-size: .7rem; font-weight: 400; color: #757575; display: block; }

    .prog-desc { font-size: .9rem; color: #616161; margin: 0; line-height: 1.6; }

    .prog-highlights { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 4px; }
    .prog-highlights li { font-size: .875rem; color: #2e7d32; display: flex; gap: 6px; }

    .prog-meta { display: flex; flex-direction: column; gap: 10px; background: #f9f9f9; border-radius: var(--radius-sm,4px); padding: 14px; }
    .meta-row { display: flex; gap: 10px; align-items: flex-start; }
    .meta-icon { font-size: 1rem; flex-shrink: 0; margin-top: 1px; }
    .meta-label { font-size: .75rem; color: #9e9e9e; font-weight: 600; text-transform: uppercase; letter-spacing: .04em; display: block; }
    .meta-value { font-size: .875rem; color: #212121; font-weight: 500; display: block; }
    .meta-sub { font-size: .75rem; color: #757575; display: block; }

    .card-deadline {
      display: flex; align-items: center; gap: 6px;
      font-size: .8125rem; color: #e65100;
      background: #fff3e0; border-radius: var(--radius-sm,4px);
      padding: 8px 12px;
    }

    .btn-register {
      margin-top: auto; width: 100%;
      background: #1976d2; color: #fff; border: none;
      padding: 12px; border-radius: var(--radius-sm,4px);
      font-size: .9375rem; font-weight: 600; cursor: pointer;
      transition: background .2s;
    }
    .btn-register:hover { background: #1565c0; }

    /* ── Empty State ───────────────────────────────────────────────────── */
    .empty-state {
      text-align: center; padding: 56px 24px; color: #9e9e9e;
      background: #fff; border-radius: var(--radius-md,8px);
      border: 2px dashed #e0e0e0;
    }
    .empty-icon { font-size: 3rem; display: block; margin-bottom: 12px; }
    .empty-state h3 { color: #424242; margin: 0 0 8px; }
    .empty-state p { max-width: 420px; margin: 0 auto; font-size: .9rem; line-height: 1.6; }

    /* ── Registration Form Page ────────────────────────────────────────── */
    .form-page { }
    .form-back { margin-bottom: 24px; }
    .btn-back {
      background: none; border: none; color: #1976d2; cursor: pointer;
      font-size: .9375rem; font-weight: 500; padding: 0; display: flex; align-items: center; gap: 6px;
    }
    .btn-back:hover { text-decoration: underline; }

    .form-layout {
      display: grid;
      grid-template-columns: 300px 1fr;
      gap: 32px;
      align-items: flex-start;
    }

    /* ── Summary Sidebar ───────────────────────────────────────────────── */
    .form-summary {
      background: #fff; border-radius: var(--radius-md,8px);
      box-shadow: var(--card-shadow); border: 1px solid #e8e8e8;
      padding: 24px; position: sticky; top: 24px;
    }
    .summary-header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
    .summary-icon { font-size: 2rem; }
    .summary-header h2 { font-size: 1.125rem; margin: 0 0 2px; }
    .summary-cat { font-size: .8rem; color: #1976d2; font-weight: 500; text-transform: uppercase; }

    .summary-details { margin: 0 0 16px; }
    .summary-details dt {
      font-size: .75rem; color: #9e9e9e; font-weight: 600;
      text-transform: uppercase; letter-spacing: .04em; margin-top: 12px;
    }
    .summary-details dd { margin: 2px 0 0; font-size: .875rem; color: #212121; font-weight: 500; }
    .summary-details dd small { font-weight: 400; color: #757575; }

    .summary-note {
      background: #e3f2fd; border-radius: var(--radius-sm,4px);
      padding: 10px 12px; font-size: .8125rem; color: #0d47a1;
      display: flex; gap: 6px; line-height: 1.5;
    }

    /* ── Form Container ────────────────────────────────────────────────── */
    .form-container {
      background: #fff; border-radius: var(--radius-md,8px);
      box-shadow: var(--card-shadow); border: 1px solid #e8e8e8;
      padding: 32px;
    }
    .form-header { margin-bottom: 24px; }
    .form-header h2 { font-size: 1.25rem; margin: 0 0 6px; }
    .form-subtitle { color: #757575; font-size: .9rem; margin: 0; }

    .reg-form { display: flex; flex-direction: column; gap: 0; }

    .form-section {
      border: 1px solid #e8e8e8; border-radius: var(--radius-sm,4px);
      padding: 20px 24px 16px; margin-bottom: 20px;
    }
    .form-section legend {
      font-size: .8125rem; font-weight: 700; color: #1976d2;
      text-transform: uppercase; letter-spacing: .06em;
      padding: 0 6px;
    }

    .form-group { margin-bottom: 16px; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .form-label { display: block; font-size: .875rem; font-weight: 600; color: #424242; margin-bottom: 6px; }
    .required { color: var(--color-error, #c62828); }
    .form-input {
      width: 100%; padding: 10px 12px;
      border: 1.5px solid #bdbdbd; border-radius: var(--radius-sm,4px);
      font-size: .9375rem; color: #212121; background: #fff;
      transition: border-color .15s, box-shadow .15s;
    }
    .form-input:focus { outline: none; border-color: #1976d2; box-shadow: 0 0 0 3px rgba(25,118,210,.12); }
    .form-input.invalid { border-color: var(--color-error, #c62828); }
    select.form-input { cursor: pointer; }
    textarea.form-input { resize: vertical; }
    .field-error { font-size: .8rem; color: var(--color-error, #c62828); margin-top: 4px; display: block; }

    .terms-group { margin-top: 4px; }
    .checkbox-label { display: flex; gap: 10px; align-items: flex-start; cursor: pointer; font-size: .875rem; color: #424242; line-height: 1.5; }
    .checkbox-input { width: 16px; height: 16px; flex-shrink: 0; margin-top: 2px; accent-color: #1976d2; cursor: pointer; }
    .terms-link { color: #1976d2; }

    .form-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px; padding-top: 20px; border-top: 1px solid #e8e8e8; }
    .btn-primary {
      background: #1976d2; color: #fff; border: none;
      padding: 11px 28px; border-radius: var(--radius-sm,4px);
      font-size: .9375rem; font-weight: 600; cursor: pointer;
      transition: background .2s; display: flex; align-items: center; gap: 8px;
    }
    .btn-primary:hover:not(:disabled) { background: #1565c0; }
    .btn-primary:disabled { opacity: .65; cursor: not-allowed; }
    .btn-secondary {
      background: #fff; color: #424242;
      border: 1.5px solid #bdbdbd; padding: 11px 20px;
      border-radius: var(--radius-sm,4px); font-size: .9375rem;
      cursor: pointer; transition: border-color .15s;
    }
    .btn-secondary:hover { border-color: #757575; }

    /* ── Success ───────────────────────────────────────────────────────── */
    .success-card {
      text-align: center; padding: 48px 32px;
      display: flex; flex-direction: column; align-items: center; gap: 12px;
    }
    .success-icon { font-size: 3.5rem; }
    .success-card h2 { font-size: 1.5rem; color: #2e7d32; margin: 0; }
    .success-card p { color: #424242; max-width: 480px; line-height: 1.6; margin: 0; }
    .success-sub { font-size: .875rem; color: #757575; }

    /* ── Responsive ────────────────────────────────────────────────────── */
    @media (max-width: 768px) {
      .page-hero { padding: 24px 20px; }
      .hero-title { font-size: 1.375rem; }
      .programs-grid { grid-template-columns: 1fr; }
      .form-layout { grid-template-columns: 1fr; }
      .form-summary { position: static; }
      .form-row { grid-template-columns: 1fr; gap: 0; }
    }
  `],
})
export class CoachingComponent implements OnInit {
    private http = inject(HttpClient);
    private fb = inject(FormBuilder);

    categories = signal<CoachingCategory[]>([]);
    activeCategory = signal<string>('sports');
    selectedProgram = signal<CoachingProgram | null>(null);

    loading = signal(false);
    configLoading = signal(true);
    configError = signal<string | null>(null);
    error = signal<string | null>(null);
    success = signal(false);

    form = this.fb.group({
        childName: ['', [Validators.required, Validators.minLength(2)]],
        childAge: [null as number | null, [Validators.required]],
        gender: [''],
        schoolName: [''],
        guardianName: ['', [Validators.required, Validators.minLength(2)]],
        contactNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
        email: ['', [Validators.email]],
        flatNumber: ['', [Validators.required]],
        medicalNotes: [''],
        emergencyContact: [''],
        termsAccepted: [false, Validators.requiredTrue],
    });

    activePrograms = computed(() =>
        this.categories().find(c => c.id === this.activeCategory())?.programs ?? []
    );

    activeCategoryLabel = computed(() =>
        this.categories().find(c => c.id === this.activeCategory())?.label ?? ''
    );

    ngOnInit(): void {
        this.http.get<CoachingConfig>('/coaching-programs.json').subscribe({
            next: (cfg) => {
                this.categories.set(cfg.categories);
                if (cfg.categories.length > 0) {
                    this.activeCategory.set(cfg.categories[0].id);
                }
                this.configLoading.set(false);
            },
            error: () => {
                this.configError.set('Failed to load coaching programs. Please refresh the page or contact the management office.');
                this.configLoading.set(false);
            },
        });
    }

    selectCategory(id: string): void {
        this.activeCategory.set(id);
        this.selectedProgram.set(null);
    }

    selectProgram(program: CoachingProgram): void {
        this.selectedProgram.set(program);
        this.success.set(false);
        this.error.set(null);
        this.form.reset({ gender: '', termsAccepted: false });
        // Apply age validators based on selected program
        this.form.get('childAge')?.setValidators([
            Validators.required,
            Validators.min(program.ageMin),
            Validators.max(program.ageMax),
        ]);
        this.form.get('childAge')?.updateValueAndValidity();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    backToPrograms(): void {
        this.selectedProgram.set(null);
        this.success.set(false);
        this.error.set(null);
    }

    isInvalid(field: string): boolean {
        const ctrl = this.form.get(field);
        return !!(ctrl?.invalid && ctrl?.touched);
    }

    submit(): void {
        this.form.markAllAsTouched();
        if (this.form.invalid || !this.selectedProgram()) return;

        this.loading.set(true);
        this.error.set(null);

        const payload = {
            program: this.selectedProgram()!.id,
            category: this.activeCategory(),
            ...this.form.value,
        };

        // TODO: replace with real HTTP call to backend
        // this.http.post('/api/coaching/register', payload).subscribe(...)
        console.log('Coaching registration payload:', payload);

        setTimeout(() => {
            this.loading.set(false);
            this.success.set(true);
        }, 1200);
    }
}
