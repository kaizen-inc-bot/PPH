import { test, expect } from '@playwright/test';

// Admin E2E — requires admin auth token; tests guard redirects when unauthenticated

test.describe('Admin routes — unauthenticated', () => {
    test('admin users redirects to login', async ({ page }) => {
        await page.goto('/admin/users');
        await expect(page).toHaveURL(/\/login/);
    });

    test('admin roles redirects to login', async ({ page }) => {
        await page.goto('/admin/roles');
        await expect(page).toHaveURL(/\/login/);
    });

    test('admin audit-log redirects to login', async ({ page }) => {
        await page.goto('/admin/audit-log');
        await expect(page).toHaveURL(/\/login/);
    });

    test('admin governance bulletins redirects to login', async ({ page }) => {
        await page.goto('/admin/governance/bulletins');
        await expect(page).toHaveURL(/\/login/);
    });
});

test.describe('Responsive: 375×812 (mobile)', () => {
    test.use({ viewport: { width: 375, height: 812 } });

    test('login page renders on mobile', async ({ page }) => {
        await page.goto('/login');
        await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible();
    });
});

test.describe('Responsive: 1280×720 (desktop)', () => {
    test.use({ viewport: { width: 1280, height: 720 } });

    test('login page renders on desktop', async ({ page }) => {
        await page.goto('/login');
        await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible();
    });
});
