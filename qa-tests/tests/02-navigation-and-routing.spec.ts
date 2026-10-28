import { test, expect } from '@playwright/test';

test.describe('2. Navigation & Page Routing Flow', () => {
  test('Landing page navigates to Login and Signup pages', async ({ page }) => {
    await page.goto('/');

    // 1. Switch to Cinematic Landing view
    await page.getByRole('button', { name: 'Cinematic Landing New' }).click();
    await expect(page.getByRole('button', { name: 'Log in' })).toBeVisible();

    // 2. Click Log in in Navbar
    await page.getByRole('button', { name: 'Log in' }).click();
    await expect(page.getByRole('heading', { name: 'Sign in to your account' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();

    // 3. Switch to Signup from Login screen
    await page.getByRole('button', { name: 'Create new account' }).click();
    await expect(page.getByRole('heading', { name: 'Create your account' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign up' })).toBeVisible();

    // 4. Return to Landing page via brand title click
    await page.getByRole('heading', { name: 'BizzNova' }).click();
    await expect(page.getByRole('button', { name: 'Log in' })).toBeVisible();
  });

  test('Login transitions to Founder Dashboard workspace with active sidebar', async ({ page }) => {
    await page.goto('/');

    // Go to Landing then Login
    await page.getByRole('button', { name: 'Cinematic Landing New' }).click();
    await page.getByRole('button', { name: 'Log in' }).click();
    await expect(page.getByRole('heading', { name: 'Sign in to your account' })).toBeVisible();

    // Submit login form
    await page.locator('input[type="email"]').fill('founder@example.com');
    await page.locator('input[type="password"]').fill('Password123!');
    await page.getByRole('button', { name: 'Sign in' }).click();

    // Verify redirect into Founder Dashboard
    await expect(page.getByRole('heading', { name: /Welcome back, Founder/i })).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=COMMAND CORE ONLINE')).toBeVisible();

    // Verify presence of workspace sidebar navigation
    await expect(page.getByRole('button', { name: 'Founder Dashboard' })).toBeVisible();
    await expect(page.getByRole('button', { name: /Idea Analyzer Core/i })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Growth Analytics' })).toBeVisible();
  });

  test('Sidebar navigation smoothly switches between core workspace modules', async ({ page }) => {
    await page.goto('/');

    // Verify initial dashboard view
    await expect(page.getByRole('heading', { name: /Welcome back, Founder/i })).toBeVisible();

    // Switch to Idea Analyzer
    await page.getByRole('button', { name: /Idea Analyzer Core/i }).click();
    await expect(page.getByRole('heading', { name: 'Idea Analyzer', exact: true })).toBeVisible();
    await expect(page.locator('text=CORE EVALUATION')).toBeVisible();

    // Switch to Growth Analytics
    await page.getByRole('button', { name: 'Growth Analytics' }).click();
    await expect(page.getByRole('heading', { name: /Growth Analytics & Failure Diagnosis/i })).toBeVisible();

    // Switch back to Founder Dashboard
    await page.getByRole('button', { name: 'Founder Dashboard' }).click();
    await expect(page.getByRole('heading', { name: /Welcome back, Founder/i })).toBeVisible();
  });
});
