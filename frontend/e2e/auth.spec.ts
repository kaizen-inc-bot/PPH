import { test, expect } from '@playwright/test';

// Auth E2E — register → pending-approval → OTP login → logout

test.describe('Authentication flow', () => {
    test('register page renders and validates', async ({ page }) => {
        await page.goto('/register');
        await expect(page.getByRole('heading', { name: /register/i })).toBeVisible();

        // Submit empty form — validation errors should appear
        await page.getByRole('button', { name: /register/i }).click();
        await expect(page.getByRole('alert').first()).toBeVisible();
    });

    test('login page — OTP step 1 validates mobile', async ({ page }) => {
        await page.goto('/login');
        await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible();

        await page.getByRole('button', { name: /send otp/i }).click();
        await expect(page.getByRole('alert')).toBeVisible();
    });

    test('pending-approval redirects to login when unauthenticated', async ({ page }) => {
        await page.goto('/pending-approval');
        // Should be redirected away by guard
        await expect(page).not.toHaveURL('/pending-approval');
    });

    test('protected route redirects unauthenticated users to login', async ({ page }) => {
        await page.goto('/home');
        await expect(page).toHaveURL(/\/login/);
    });

    test('access-denied page renders', async ({ page }) => {
        await page.goto('/access-denied');
        await expect(page.getByText(/access denied/i)).toBeVisible();
    });
});
