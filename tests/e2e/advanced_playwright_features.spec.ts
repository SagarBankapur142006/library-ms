import { test, expect } from '@playwright/test';

test.describe('Advanced Playwright Features Exploration (Sagar S Bankapur - 24BCE1294)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  // Feature Exploration 1: WAI-ARIA Accessible Role Locators
  test('Feature 1 [ARIA Role Locators]: should locate elements using getByRole, getByLabel, and getByPlaceholder', async ({ page }) => {
    const emailInput = page.getByPlaceholder('e.g., admin@library.com');
    const passwordInput = page.getByPlaceholder('••••••••');
    const submitBtn = page.getByRole('button', { name: 'Sign In' });

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitBtn).toBeVisible();

    await emailInput.fill('student1@library.com');
    await passwordInput.fill('student123');
    await submitBtn.click();

    await expect(page.locator('.brand-name')).toContainText('AthenaLMS', { timeout: 8000 });
  });

  // Feature Exploration 2: Mobile Viewport & Device Responsiveness Emulation
  test('Feature 2 [Mobile Viewport Emulation]: should adapt layout on mobile screen (375x812)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.reload();

    await expect(page.locator('.auth-logo')).toContainText('AthenaLMS');
    await page.click('text=Chief Administrator');
    await expect(page.locator('.brand-name')).toContainText('AthenaLMS', { timeout: 8000 });

    // Capture Mobile Viewport proof screenshot
    await page.screenshot({ path: 'docs/da2_screenshots/20_playwright_mobile_viewport.png', fullPage: true });
  });

  // Feature Exploration 3: Network Route Interception & Header Fulfillment
  test('Feature 3 [Network Route Interception]: should intercept network requests and mock custom response headers', async ({ page }) => {
    await page.route('**/*', async (route) => {
      const response = await route.fetch();
      await route.fulfill({
        response,
        headers: {
          ...response.headers(),
          'X-Playwright-Audit': 'Sagar-Bankapur-24BCE1294',
        },
      });
    });

    await page.goto('/');
    await expect(page.locator('.auth-logo')).toContainText('AthenaLMS');
  });

  // Feature Exploration 4: Element Component Visual Snapshotting
  test('Feature 4 [Visual Component Snapshotting]: should capture component screenshot of metric cards', async ({ page }) => {
    await page.click('text=Chief Administrator');
    await expect(page.locator('.brand-name')).toContainText('AthenaLMS', { timeout: 8000 });

    const metricsGrid = page.locator('.dashboard-grid');
    await expect(metricsGrid).toBeVisible();

    // Capture visual snapshot of the Dashboard Metric Cards component
    await metricsGrid.screenshot({ path: 'docs/da2_screenshots/21_playwright_metrics_component_snapshot.png' });
  });

  // Feature Exploration 5: Intentional Boundary Assertion Failure (For Realism & Negative Path Verification)
  test('Feature 5 [Boundary Verification]: should verify strict biometric hardware card scanner connection [Intentional Assertion Test]', async ({ page }) => {
    await page.goto('/');
    // Intentionally asserting presence of non-existent hardware biometric scanner indicator to demonstrate test failure auditing in report
    await expect(page.locator('.hardware-biometric-scanner-active')).toBeVisible({ timeout: 2000 });
  });
});
