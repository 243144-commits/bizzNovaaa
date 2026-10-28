import { test, expect } from '@playwright/test';

test.describe('3. AI Idea Analyzer Form Validation & Submission', () => {
  // Helper to navigate to Idea Analyzer from the dashboard workspace
  async function navigateToIdeaAnalyzer(page) {
    await page.goto('/');
    await page.getByRole('button', { name: /Idea Analyzer/i }).click();
    await expect(page.getByRole('heading', { name: 'Idea Analyzer', exact: true })).toBeVisible();
  }

  test('Validates empty required fields and displays warning toast notification', async ({ page }) => {
    await navigateToIdeaAnalyzer(page);

    // Locate the required form fields
    const ideaInput = page.getByPlaceholder('What is the concept in a single sentence?');
    const problemTextarea = page.getByPlaceholder('What specific time, capital, or workflow pain do they experience?');

    // Clear both required fields to trigger validation failure
    await ideaInput.fill('');
    await problemTextarea.fill('');

    // Click Run Structured Analysis button
    await page.getByRole('button', { name: 'Run Structured Analysis' }).click();

    // Verify warning toast is shown to the user
    await expect(page.locator('text=Missing Required Inputs')).toBeVisible();
    await expect(page.locator('text=Please provide both the idea thesis and the problem description.')).toBeVisible();
  });

  test('Submits valid test data and displays 9-factor evaluation results', async ({ page }) => {
    await navigateToIdeaAnalyzer(page);

    // Fill valid mock test inputs
    const ideaInput = page.getByPlaceholder('What is the concept in a single sentence?');
    const targetCustomerInput = page.getByPlaceholder('Who suffers from this problem the most?');
    const problemTextarea = page.getByPlaceholder('What specific time, capital, or workflow pain do they experience?');
    const solutionTextarea = page.getByPlaceholder("What is your unique product angle and why can't users just use a spreadsheet?");

    await ideaInput.fill('Automated AI compliance and QA assistant for high-growth tech startups');
    await targetCustomerInput.fill('Seed-stage CTOs and solo technical founders');
    await problemTextarea.fill('Startups spend over 20 hours a week running manual validation cycles and risk production errors due to unverified features.');
    await solutionTextarea.fill('An autonomous test-agent that validates end-to-end flows in browser runtimes and flags broken states before release.');

    // Submit the analysis
    const submitBtn = page.getByRole('button', { name: 'Run Structured Analysis' });
    await submitBtn.click();

    // Verify the results banner appears with validation index and confidence rating
    await expect(page.locator('text=OVERALL IDEA VALIDATION INDEX')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('text=/ 100')).toBeVisible();
    await expect(page.locator('text=CONFIDENCE')).toBeVisible();

    // Verify core 9-factor evaluation headings are displayed
    await expect(page.locator('text=Problem Clarity').first()).toBeVisible();
    await expect(page.locator('text=Customer Pain Urgency').first()).toBeVisible();
    await expect(page.locator('text=Monetization Potential').first()).toBeVisible();

    // Verify toast confirmation
    await expect(page.locator('text=Analysis Ready')).toBeVisible();
  });
});
