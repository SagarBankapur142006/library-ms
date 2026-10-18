import { test, expect } from '@playwright/test';

test.describe('SCRUM-16: E2E Book Circulation & Razorpay Fine Payment Gateway (Sagar S Bankapur - 24BCE1294)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    // Login as Librarian
    await page.click('text=Sarah Jenkins');
    await expect(page.locator('.brand-name')).toContainText('AthenaLMS', { timeout: 8000 });
    await page.click('text=Checkouts & Returns');
  });

  test('should display circulation desk tabs and active checkout form', async ({ page }) => {
    await expect(page.locator('text=Issue Checkout')).toBeVisible();
    await expect(page.locator('text=Return Desk')).toBeVisible();
    await expect(page.locator('text=Fine ledger')).toBeVisible();
    await expect(page.locator('text=Create Book Checkout Loan')).toBeVisible();

    // Screenshot 10: Issue Checkout Form
    await page.screenshot({ path: 'docs/da2_screenshots/10_playwright_circulation_issue_form.png' });
  });

  test('should issue a book to an active cardholder and display success', async ({ page }) => {
    const bookSelect = page.locator('select.form-select').first();
    const memberSelect = page.locator('select.form-select').nth(1);

    await bookSelect.selectOption({ index: 1 });
    await memberSelect.selectOption({ index: 1 });

    await page.click('button[type="submit"]:has-text("Confirm Checkout Loan")');

    // Verify success banner
    await expect(page.locator('text=Book checkout registered successfully!')).toBeVisible({ timeout: 5000 });

    // Screenshot 11: Checkout Success Notification
    await page.screenshot({ path: 'docs/da2_screenshots/11_playwright_circulation_checkout_success.png' });
  });

  test('should switch to Return Desk and view active issued transactions', async ({ page }) => {
    await page.click('text=Return Desk');
    await expect(page.locator('text=Active Loans Return Desk')).toBeVisible();

    // Verify transaction table has rows
    await expect(page.locator('table.custom-table tbody tr')).not.toHaveCount(0);

    // Screenshot 12: Return Desk Active Circulating Loans Table
    await page.screenshot({ path: 'docs/da2_screenshots/12_playwright_circulation_return_desk.png', fullPage: true });
  });

  test('should switch to Fine Ledger tab and view recorded fines', async ({ page }) => {
    await page.click('text=Fine ledger');
    await expect(page.locator('text=Fine Penalties Ledger')).toBeVisible();

    // Screenshot 13: Fine Ledger Tab
    await page.screenshot({ path: 'docs/da2_screenshots/13_playwright_circulation_fine_ledger.png', fullPage: true });
  });

  test('should trigger Razorpay Fine Payment Modal and process payment successfully', async ({ page }) => {
    await page.click('text=Fine ledger');
    await expect(page.locator('text=Fine Penalties Ledger')).toBeVisible();

    // Click Pay Fine (Razorpay) button for Unpaid fine
    const payBtn = page.locator('tr:has-text("Unpaid") .pay-fine-btn').first();
    await expect(payBtn).toBeVisible();
    await payBtn.click();

    // Verify Razorpay Secure Checkout Modal opens
    await expect(page.locator('text=Razorpay Secure Checkout')).toBeVisible();
    await expect(page.locator('text=TEST MODE')).toBeVisible();

    // Screenshot 22: Razorpay Fine Payment Gateway Modal
    await page.screenshot({ path: 'docs/da2_screenshots/22_playwright_razorpay_fine_payment_modal.png' });

    // Submit payment form
    await page.click('.confirm-razorpay-btn');

    // Verify Payment Success Receipt
    await expect(page.locator('text=Payment Successful!')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=Settled & Privilege Restored')).toBeVisible();

    // Screenshot 23: Razorpay Payment Success Receipt
    await page.screenshot({ path: 'docs/da2_screenshots/23_playwright_payment_success_receipt.png' });
  });
});
