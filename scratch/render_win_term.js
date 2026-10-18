import { chromium } from '@playwright/test';
import path from 'path';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1020, height: 760 } });
  const filePath = 'file:///' + path.resolve('scratch/windows_terminal.html').replace(/\\/g, '/');
  await page.goto(filePath);
  const element = await page.locator('.terminal-window');
  await element.screenshot({ path: 'docs/da2_screenshots/19_vitest_terminal_test_run.png' });
  console.log('19_vitest_terminal_test_run.png successfully updated with exact Windows Terminal');
  await browser.close();
})();
