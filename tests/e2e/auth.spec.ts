import { test, expect } from '@playwright/test';

test.describe('SCRUM-7 & SCRUM-13: E2E Authentication & Session Guards (Sagar S Bankapur - 24BCE1294)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should display glassmorphic login interface and capture screenshot', async ({ page }) => {
    await expect(page.locator('.auth-logo')).toContainText('AthenaLMS');
    await expect(page.locator('button[type="submit"]')).toContainText('Sign In');
    await expect(page.locator('text=QUICK DEMO LOGINS')).toBeVisible();

    // Screenshot 1: Glassmorphic Login Gateway
    await page.screenshot({ path: 'docs/da2_screenshots/01_playwright_login_gateway.png', fullPage: true });
  });

  test('should display error validation on invalid credentials and capture screenshot', async ({ page }) => {
    await page.fill('input[type="email"]', 'unauthorized@library.com');
    await page.fill('input[type="password"]', 'wrongpass123');
    await page.click('button[type="submit"]');

    await expect(page.locator('text=Invalid email or password')).toBeVisible({ timeout: 5000 });

    // Screenshot 2: Authentication Error Banner
    await page.screenshot({ path: 'docs/da2_screenshots/02_playwright_auth_error_validation.png' });
  });

  test('should authenticate Student user and navigate to Book Catalog', async ({ page }) => {
    // Click John Doe quick login
    await page.click('text=John Doe');
    await expect(page.locator('.brand-name')).toContainText('AthenaLMS', { timeout: 8000 });
    await expect(page.locator('aside').getByText('Student', { exact: true })).toBeVisible();
    await expect(page.locator('.book-card').first()).toBeVisible();

    // Screenshot 3: Student View with Book Catalog
    await page.screenshot({ path: 'docs/da2_screenshots/03_playwright_student_catalog_view.png', fullPage: true });
  });

  test('should authenticate Chief Administrator and view Admin Dashboard', async ({ page }) => {
    // Click Chief Administrator quick login
    await page.click('text=Chief Administrator');
    await expect(page.locator('.brand-name')).toContainText('AthenaLMS', { timeout: 8000 });
    await expect(page.locator('text=Total Books Owned')).toBeVisible();

    // Screenshot 4: Admin Dashboard Overview
    await page.screenshot({ path: 'docs/da2_screenshots/04_playwright_admin_dashboard.png', fullPage: true });
  });

  test('should support logout workflow and session termination', async ({ page }) => {
    await page.click('text=Sarah Jenkins');
    await expect(page.locator('aside').getByText('Librarian', { exact: true })).toBeVisible({ timeout: 8000 });

    await page.click('button:has-text("Logout")');
    await expect(page.locator('.auth-logo')).toContainText('AthenaLMS');
    await expect(page.locator('button[type="submit"]')).toBeVisible();

    // Screenshot 5: Returned to Login screen after Logout
    await page.screenshot({ path: 'docs/da2_screenshots/05_playwright_logout_session_terminated.png' });
  });
});
