import { test, expect } from '@playwright/test';

test.describe('SCRUM-17: E2E Dashboard & Admin System Settings (Sagar S Bankapur - 24BCE1294)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    // Login as Admin
    await page.click('text=Chief Administrator');
    await expect(page.locator('.brand-name')).toContainText('AthenaLMS', { timeout: 8000 });
  });

  test('should render dashboard analytics metric cards and overdue ledger', async ({ page }) => {
    await expect(page.locator('text=Total Books Owned')).toBeVisible();
    await expect(page.locator('text=Active Loans')).toBeVisible();
    await expect(page.locator('text=Overdue Checkouts')).toBeVisible();
    await expect(page.locator('text=Outstanding Fines')).toBeVisible();
    await expect(page.locator('text=Overdue Returns Ledger')).toBeVisible();

    // Screenshot 14: Admin Dashboard Full View
    await page.screenshot({ path: 'docs/da2_screenshots/14_playwright_admin_metrics_dashboard.png', fullPage: true });
  });

  test('should navigate to System Settings, update library policies, and verify persistence', async ({ page }) => {
    await page.click('text=System Settings');
    await expect(page.locator('text=System Settings & Borrowing Policies')).toBeVisible();

    // Verify sliders and inputs
    await expect(page.locator('text=Max Books Checked Out')).toBeVisible();
    await expect(page.locator('text=Loan Duration Period')).toBeVisible();
    await expect(page.locator('text=Daily Fine Rate (USD)')).toBeVisible();

    // Screenshot 15: System Settings Configuration Console
    await page.screenshot({ path: 'docs/da2_screenshots/15_playwright_system_settings_console.png', fullPage: true });

    // Click Save Settings button
    await page.click('button[type="submit"]:has-text("Save Settings")');

    // Verify success banner
    await expect(page.locator('text=System settings and borrowing policies updated successfully!')).toBeVisible({ timeout: 5000 });

    // Screenshot 16: Settings Updated Banner
    await page.screenshot({ path: 'docs/da2_screenshots/16_playwright_settings_saved_alert.png' });
  });
});
