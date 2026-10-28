import { test, expect } from '@playwright/test';

test.describe('1. Application Loading & System Status API', () => {
  test('Backend System Status API returns ONLINE status', async ({ request }) => {
    const response = await request.get('/api/system/status');
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('status');
    expect(data.status).toBe('ONLINE');
    expect(data).toHaveProperty('version');
    expect(data.version).toContain('bizznova');
    expect(data).toHaveProperty('aiProvider');
  });

  test('Application loads successfully into Founder Dashboard with workspace sidebar', async ({ page }) => {
    await page.goto('/');

    // Verify main brand name and command center header
    await expect(page.locator('text=BizNova').first()).toBeVisible();
    await expect(page.getByRole('heading', { name: /Welcome back, Founder/i })).toBeVisible();
    await expect(page.locator('text=COMMAND CORE ONLINE')).toBeVisible();

    // Verify workspace navigation sidebar buttons using exact labels
    await expect(page.getByRole('button', { name: 'Founder Dashboard' })).toBeVisible();
    await expect(page.getByRole('button', { name: /Idea Analyzer Core/i })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cinematic Landing New' })).toBeVisible();
  });

  test('Cinematic Landing page renders brand heading and guest navigation', async ({ page }) => {
    await page.goto('/');

    // Navigate to Cinematic Landing from the sidebar
    await page.getByRole('button', { name: 'Cinematic Landing New' }).click();

    // Verify landing page navigation buttons
    await expect(page.getByRole('button', { name: 'Log in' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Get Started' }).first()).toBeVisible();

    // Verify hero text
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Turn Your Startup Idea');
  });
});
