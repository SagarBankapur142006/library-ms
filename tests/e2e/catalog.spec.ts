import { test, expect } from '@playwright/test';

test.describe('SCRUM-9 & SCRUM-14: E2E Book Catalog & Inventory Management (Sagar S Bankapur - 24BCE1294)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    // Login as Librarian
    await page.click('text=Sarah Jenkins');
    await expect(page.locator('.brand-name')).toContainText('AthenaLMS', { timeout: 8000 });
    await page.click('text=Book Catalog');
    await expect(page.locator('.book-card').first()).toBeVisible();
  });

  test('should render book catalog and capture inventory overview screenshot', async ({ page }) => {
    await expect(page.locator('.book-card')).toHaveCount(5);
    await expect(page.locator('text=The Great Gatsby')).toBeVisible();

    // Screenshot 6: Book Catalog Grid View
    await page.screenshot({ path: 'docs/da2_screenshots/06_playwright_book_catalog_grid.png', fullPage: true });
  });

  test('should dynamically search books and capture filtered result', async ({ page }) => {
    const searchInput = page.locator('input[placeholder="Search by Title, Author, or ISBN..."]');
    await searchInput.fill('Clean Code');

    await expect(page.locator('.book-card')).toHaveCount(1);
    await expect(page.locator('text=Robert C. Martin')).toBeVisible();

    // Screenshot 7: Dynamic Search Filtered State
    await page.screenshot({ path: 'docs/da2_screenshots/07_playwright_catalog_search_filter.png' });
  });

  test('should open Add Book modal and capture modal form', async ({ page }) => {
    await page.click('button:has-text("Add Book")');
    await expect(page.locator('.modal-content h2')).toContainText('Add New Book');

    // Fill form
    await page.fill('input[placeholder="e.g. Clean Code"]', 'Modern Software Engineering');
    await page.fill('input[placeholder="e.g. Robert C. Martin"]', 'Dave Farley');
    await page.fill('input[placeholder="e.g. 9780132350884"]', '9780137314942');
    await page.fill('input[placeholder="e.g. Technology"]', 'Technology');
    await page.fill('input[placeholder="e.g. Prentice Hall"]', 'Pearson Education');

    // Screenshot 8: Add Book Modal Dialog
    await page.screenshot({ path: 'docs/da2_screenshots/08_playwright_add_book_modal.png' });

    // Submit form
    await page.click('button[type="submit"]:has-text("Add Book")');

    // Verify newly added book appears in catalog
    await expect(page.locator('text=Modern Software Engineering')).toBeVisible({ timeout: 5000 });

    // Screenshot 9: Catalog after adding new book
    await page.screenshot({ path: 'docs/da2_screenshots/09_playwright_catalog_book_added.png', fullPage: true });
  });
});
