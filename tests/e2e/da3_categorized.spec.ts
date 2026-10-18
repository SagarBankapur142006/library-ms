import { test, expect } from '@playwright/test';

/**
 * Digital Assignment 3 (DA-3): Categorized Playwright E2E Suite
 * Candidate: Sagar S Bankapur (24BCE1294)
 * Course: Software Engineering
 * 
 * Categories:
 * 1. Functional End-to-End (E2E) Paths
 * 2. Boundary & Edge Cases
 * 3. Integration Points
 */

test.describe('DA-3: Categorized Playwright Test Suite (Sagar S Bankapur - 24BCE1294)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  // =========================================================================
  // CATEGORY 1: Functional End-to-End (E2E) Paths
  // =========================================================================
  test.describe('Category 1: Functional End-to-End (E2E) Paths', () => {
    test('TC-DA3-PW-E2E-01: should execute full multi-role login, navigation and session logout', async ({ page }) => {
      // 1. Login as Student
      await page.click('text=John Doe');
      await expect(page.locator('.brand-name')).toContainText('AthenaLMS');
      await expect(page.locator('aside').getByText('Student', { exact: true })).toBeVisible();

      // 2. Logout
      await page.click('button:has-text("Logout")');
      await expect(page.locator('.auth-logo')).toContainText('AthenaLMS');

      // 3. Login as Admin
      await page.click('text=Chief Administrator');
      await expect(page.locator('.brand-name')).toContainText('AthenaLMS');
      await expect(page.locator('text=Total Books Owned')).toBeVisible();
    });

    test('TC-DA3-PW-E2E-02: should execute book catalog acquisition and real-time search filtering', async ({ page }) => {
      await page.click('text=Sarah Jenkins'); // Librarian
      await page.click('text=Books & Catalog');

      // Click Add Book
      await page.click('text=+ Add New Book');
      await expect(page.locator('text=Register New Book in Catalog')).toBeVisible();

      await page.fill('input[placeholder="e.g. Design Patterns: Elements of Reusable Object-Oriented Software"]', 'Architecting Cloud Native Apps');
      await page.fill('input[placeholder="e.g. Erich Gamma, Richard Helm"]', 'Michael Fowler');
      await page.fill('input[placeholder="e.g. 978-0201633610"]', '978-1119876543');
      await page.fill('input[placeholder="e.g. Addison-Wesley"]', 'TechPub');
      await page.fill('input[placeholder="e.g. 1994"]', '2024');
      await page.fill('input[type="number"][min="1"]', '6');

      await page.click('button[type="submit"]:has-text("Add Book to Catalog")');

      // Verify book appears in catalog
      await expect(page.locator('text=Architecting Cloud Native Apps')).toBeVisible({ timeout: 5000 });

      // Verify dynamic search filter
      await page.fill('input[placeholder="Search books by title, author, or ISBN..."]', 'Architecting');
      await expect(page.locator('text=Architecting Cloud Native Apps')).toBeVisible();
      await expect(page.locator('text=The Great Gatsby')).not.toBeVisible();
    });

    test('TC-DA3-PW-E2E-03: should execute circulation desk checkout loan transaction', async ({ page }) => {
      await page.click('text=Sarah Jenkins'); // Librarian
      await page.click('text=Checkouts & Returns');

      await expect(page.locator('text=Create Book Checkout Loan')).toBeVisible();

      const bookSelect = page.locator('select.form-select').first();
      const memberSelect = page.locator('select.form-select').nth(1);

      await bookSelect.selectOption({ index: 1 });
      await memberSelect.selectOption({ index: 1 });

      await page.click('button[type="submit"]:has-text("Confirm Checkout Loan")');
      await expect(page.locator('text=Book checkout registered successfully!')).toBeVisible({ timeout: 5000 });
    });

    test('TC-DA3-PW-E2E-04: should switch to Return Desk and inspect active loan transactions', async ({ page }) => {
      await page.click('text=Sarah Jenkins');
      await page.click('text=Checkouts & Returns');
      await page.click('text=Return Desk');

      await expect(page.locator('text=Active Loans Return Desk')).toBeVisible();
      await expect(page.locator('table.custom-table tbody tr')).not.toHaveCount(0);
    });

    test('TC-DA3-PW-E2E-05: should trigger Razorpay Fine Payment Gateway Modal and complete settlement flow', async ({ page }) => {
      await page.click('text=Sarah Jenkins');
      await page.click('text=Checkouts & Returns');
      await page.click('text=Fine ledger');

      await expect(page.locator('text=Fine Penalties Ledger')).toBeVisible();

      // Open Razorpay Modal for unpaid fine
      const payBtn = page.locator('tr:has-text("Unpaid") .pay-fine-btn').first();
      await expect(payBtn).toBeVisible();
      await payBtn.click();

      // Verify Razorpay modal rendering
      await expect(page.locator('text=Razorpay Secure Checkout')).toBeVisible();
      await expect(page.locator('text=TEST MODE')).toBeVisible();

      // Submit payment
      await page.click('.confirm-razorpay-btn');

      // Verify Instant Payment Receipt
      await expect(page.locator('text=Payment Successful!')).toBeVisible({ timeout: 6000 });
      await expect(page.locator('text=Settled & Privilege Restored')).toBeVisible();
    });
  });

  // =========================================================================
  // CATEGORY 2: Boundary & Edge Cases
  // =========================================================================
  test.describe('Category 2: Boundary & Edge Cases', () => {
    test('TC-DA3-PW-BND-01: [Boundary] should intercept invalid authentication credentials with error guard', async ({ page }) => {
      await page.fill('input[type="email"]', 'wronguser@library.com');
      await page.fill('input[type="password"]', 'badpass999');
      await page.click('button[type="submit"]');

      // Verify interception of authentication error
      await expect(page.locator('text=Invalid email or password')).toBeVisible({ timeout: 5000 });
    });

    test('TC-DA3-PW-BND-02: [Edge] should adapt layout to mobile device boundary viewport (375x812)', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 }); // iPhone 12 boundary
      await page.goto('/');

      await expect(page.locator('.auth-logo')).toContainText('AthenaLMS');
      await page.click('text=John Doe');

      await expect(page.locator('.brand-name')).toContainText('AthenaLMS');
      await expect(page.locator('aside').getByText('Student', { exact: true })).toBeVisible();
    });

    test('TC-DA3-PW-BND-03: [Boundary Verification] strict biometric card scanner connection [Intentional Failure for Audit Realism]', async ({ page }) => {
      await page.click('text=Chief Administrator');
      await expect(page.locator('.brand-name')).toContainText('AthenaLMS');

      // Simulated external hardware scanner check
      const scannerStatus = await page.evaluate(() => {
        return (window as any).BIOMETRIC_CARD_SCANNER || 'HARDWARE_DISCONNECTED';
      });

      // Intentional failure assertion to demonstrate failure tracing in Playwright HTML Report
      expect(scannerStatus).toBe('CONNECTED');
    });
  });

  // =========================================================================
  // CATEGORY 3: Integration Points
  // =========================================================================
  test.describe('Category 3: Integration Points', () => {
    test('TC-DA3-PW-INT-01: [Accessibility Tree Integration] should locate and interact with controls using WAI-ARIA roles', async ({ page }) => {
      const emailInput = page.getByPlaceholder('e.g., admin@library.com');
      const submitBtn = page.getByRole('button', { name: 'Sign In' });

      await expect(emailInput).toBeVisible();
      await expect(submitBtn).toBeVisible();

      await emailInput.fill('admin@library.com');
      await page.fill('input[type="password"]', 'admin123');
      await submitBtn.click();

      await expect(page.locator('.brand-name')).toContainText('AthenaLMS');
    });

    test('TC-DA3-PW-INT-02: [Network Proxy Integration] should intercept network traffic and inject telemetry headers', async ({ page }) => {
      let routeIntercepted = false;

      await page.route('**/*', async (route) => {
        routeIntercepted = true;
        const response = await route.fetch();
        const headers = response.headers();
        headers['X-Playwright-Audit'] = 'Sagar-Bankapur-24BCE1294';
        await route.fulfill({ response, headers });
      });

      await page.click('text=Sarah Jenkins');
      await expect(page.locator('.brand-name')).toContainText('AthenaLMS');
      expect(routeIntercepted).toBe(true);
    });

    test('TC-DA3-PW-INT-03: [Visual Component Snapshot Integration] should capture and verify Admin KPI metrics snapshot', async ({ page }) => {
      await page.click('text=Chief Administrator');
      await expect(page.locator('.brand-name')).toContainText('AthenaLMS');

      const metricsGrid = page.locator('.dashboard-grid');
      await expect(metricsGrid).toBeVisible();

      // Visual snapshot proof
      await metricsGrid.screenshot({ path: 'docs/da3_screenshots/da3_metrics_component_snapshot.png' });
    });
  });
});
