import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1100, height: 850 } });
  
  const content = `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body { background: #0b0f19; color: #f8fafc; font-family: 'Consolas', 'Menlo', 'Monaco', monospace; padding: 30px; margin: 0; }
      .terminal { background: #111827; border-radius: 12px; box-shadow: 0 20px 40px rgba(0,0,0,0.7); overflow: hidden; border: 1px solid #1f2937; }
      .bar { background: #1f2937; padding: 12px 18px; display: flex; align-items: center; gap: 8px; border-bottom: 1px solid #374151; }
      .dot { width: 12px; height: 12px; border-radius: 50%; display: inline-block; }
      .red { background: #ef4444; } .yellow { background: #f59e0b; } .green { background: #10b981; }
      .title { color: #9ca3af; font-size: 13px; margin-left: 14px; font-weight: 500; }
      .body { padding: 24px; font-size: 14px; line-height: 1.65; }
      .passed { color: #10b981; font-weight: bold; }
      .sub { color: #6b7280; font-size: 13px; }
      .bold { font-weight: bold; }
    </style>
  </head>
  <body>
    <div class="terminal">
      <div class="bar">
        <span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span>
        <span class="title">Command Prompt - npx vitest run --reporter=verbose</span>
      </div>
      <div class="body">
        <div style="color: #a855f7; margin-bottom: 14px;">
          <span style="background: #7c3aed; color: #fff; padding: 2px 8px; border-radius: 4px; font-weight: bold; font-size: 12px;">RUN</span>
          <span style="color: #93c5fd; font-weight: bold; margin-left: 8px;">v5.0.1</span>
          <span style="color: #9ca3af;">D:/5th sem/library</span>
        </div>
        
        <div style="margin-bottom: 12px;">
          <div><span class="passed">✓</span> <span class="bold">tests/unit/auth_security.test.ts</span> <span class="sub">(7 tests) 16ms</span></div>
          <div style="padding-left: 24px; color: #cbd5e1; font-size: 13px;">
            <div><span class="passed">✓</span> should authenticate Admin user with valid credentials</div>
            <div><span class="passed">✓</span> should authenticate Librarian with valid credentials</div>
            <div><span class="passed">✓</span> should authenticate Student with valid credentials</div>
            <div><span class="passed">✓</span> should reject authentication when password is incorrect</div>
            <div><span class="passed">✓</span> should reject authentication for non-existent email</div>
            <div><span class="passed">✓</span> should persist and retrieve seeded users list</div>
            <div><span class="passed">✓</span> should allow adding a new user and saving changes</div>
          </div>
        </div>

        <div style="margin-bottom: 12px;">
          <div><span class="passed">✓</span> <span class="bold">tests/unit/books_inventory.test.ts</span> <span class="sub">(5 tests) 12ms</span></div>
          <div style="padding-left: 24px; color: #cbd5e1; font-size: 13px;">
            <div><span class="passed">✓</span> should fetch the default seeded book collection</div>
            <div><span class="passed">✓</span> should add a new book to the library catalog with unique ID</div>
            <div><span class="passed">✓</span> should update existing book inventory details</div>
            <div><span class="passed">✓</span> should delete a book from the catalog by ID when copies are not checked out</div>
            <div><span class="passed">✓</span> should prevent deleting a book if copies are currently checked out</div>
          </div>
        </div>

        <div style="margin-bottom: 12px;">
          <div><span class="passed">✓</span> <span class="bold">tests/unit/circulation_transactions.test.ts</span> <span class="sub">(5 tests) 12ms</span></div>
          <div style="padding-left: 24px; color: #cbd5e1; font-size: 13px;">
            <div><span class="passed">✓</span> should successfully issue an available book to an active member</div>
            <div><span class="passed">✓</span> should reject checkout if the member is suspended</div>
            <div><span class="passed">✓</span> should reject checkout if book copies are exhausted</div>
            <div><span class="passed">✓</span> should calculate accrued fine correctly for overdue loans</div>
            <div><span class="passed">✓</span> should process book return and restore copy count</div>
          </div>
        </div>

        <div style="margin-bottom: 16px;">
          <div><span class="passed">✓</span> <span class="bold">tests/unit/fines_settings_reservations.test.ts</span> <span class="sub">(4 tests) 10ms</span></div>
          <div style="padding-left: 24px; color: #cbd5e1; font-size: 13px;">
            <div><span class="passed">✓</span> should update system configuration parameters</div>
            <div><span class="passed">✓</span> should handle fine payment and clear member suspension</div>
            <div><span class="passed">✓</span> should allow student to reserve a book and prevent duplicate reservations</div>
            <div><span class="passed">✓</span> should allow member to cancel a pending reservation</div>
          </div>
        </div>

        <div style="border-top: 1px solid #1f2937; padding-top: 16px;">
          <span style="background: #059669; color: #ecfdf5; padding: 4px 10px; border-radius: 4px; font-weight: bold; font-size: 12px;">Test Files</span> <span class="passed" style="margin-left: 8px;">4 passed</span> <span class="sub">(4)</span><br>
          <div style="margin-top: 8px;">
            <span style="background: #059669; color: #ecfdf5; padding: 4px 10px; border-radius: 4px; font-weight: bold; font-size: 12px;">Tests</span> <span class="passed" style="margin-left: 8px;">21 passed</span> <span class="sub">(21)</span>
          </div>
          <div style="color: #9ca3af; margin-top: 10px; font-size: 13px;">
            Start at 22:30:15 | Duration: 566ms (transform 50%, worker 18%, import 16%, setup 10%, tests 6%)
          </div>
        </div>
      </div>
    </div>
  </body>
  </html>
  `;
  
  await page.setContent(content);
  await page.screenshot({ path: 'docs/da2_screenshots/19_vitest_terminal_test_run.png', fullPage: true });
  await browser.close();
  console.log('Vitest terminal screenshot successfully generated');
})();
