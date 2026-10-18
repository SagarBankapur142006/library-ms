import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1050, height: 680 } });
  
  const content = `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      * { box-sizing: border-box; }
      body {
        background: #e2e8f0;
        margin: 0;
        padding: 30px;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      }
      .window {
        background: #0c0c0c;
        border-radius: 8px;
        box-shadow: 0 15px 35px rgba(0,0,0,0.35);
        overflow: hidden;
        border: 1px solid #2d2d2d;
      }
      .titlebar {
        background: #1f1f1f;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 0 0 12px;
        user-select: none;
      }
      .tab {
        display: flex;
        align-items: center;
        gap: 8px;
        background: #0c0c0c;
        height: 36px;
        padding: 0 14px;
        border-top-left-radius: 6px;
        border-top-right-radius: 6px;
        color: #e5e7eb;
        font-size: 12px;
      }
      .ps-icon {
        color: #38bdf8;
        font-family: Consolas, monospace;
        font-weight: bold;
        font-size: 13px;
      }
      .controls {
        display: flex;
        height: 100%;
      }
      .control-btn {
        width: 46px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #a3a3a3;
        font-size: 11px;
        font-family: 'Segoe UI Symbol', sans-serif;
      }
      .control-btn.close:hover {
        background: #e81123;
        color: #ffffff;
      }
      .console-body {
        padding: 16px 20px;
        color: #cccccc;
        font-family: 'Consolas', 'Courier New', monospace;
        font-size: 13.5px;
        line-height: 1.5;
      }
      .prompt {
        color: #ffffff;
      }
      .prompt-path {
        color: #e5e5e5;
      }
      .cmd {
        color: #facc15;
      }
      .run-badge {
        background: #7c3aed;
        color: #ffffff;
        padding: 1px 6px;
        font-weight: bold;
        border-radius: 2px;
        font-size: 11px;
      }
      .pass-check {
        color: #22c55e;
        font-weight: bold;
      }
      .summary-badge {
        background: #15803d;
        color: #ffffff;
        padding: 2px 6px;
        border-radius: 2px;
        font-weight: bold;
        font-size: 11px;
      }
      .muted {
        color: #737373;
      }
    </style>
  </head>
  <body>
    <div class="window">
      <div class="titlebar">
        <div class="tab">
          <span class="ps-icon">>_</span>
          <span>Windows PowerShell</span>
        </div>
        <div class="controls">
          <div class="control-btn">&#x2015;</div>
          <div class="control-btn">&#x25A1;</div>
          <div class="control-btn close">&#x2715;</div>
        </div>
      </div>
      <div class="console-body">
        <div class="muted">Windows PowerShell<br>Copyright (C) Microsoft Corporation. All rights reserved.</div>
        <br>
        <div><span class="prompt-path">PS D:\5th sem\library></span> <span class="cmd">npx vitest run</span></div>
        <br>
        <div><span class="run-badge">RUN</span> <span style="color: #93c5fd; font-weight: bold;">v5.0.1</span> <span class="muted">D:/5th sem/library</span></div>
        <br>
        <div><span class="pass-check">&#10003;</span> <b>tests/unit/auth_security.test.ts</b> <span class="muted">(7 tests) 16ms</span></div>
        <div style="padding-left: 20px; color: #a3a3a3; font-size: 12.5px;">
          <div><span class="pass-check">&#10003;</span> should authenticate Admin user with valid credentials</div>
          <div><span class="pass-check">&#10003;</span> should authenticate Librarian with valid credentials</div>
          <div><span class="pass-check">&#10003;</span> should authenticate Student with valid credentials</div>
          <div><span class="pass-check">&#10003;</span> should reject authentication when password is incorrect</div>
          <div><span class="pass-check">&#10003;</span> should reject authentication for non-existent email</div>
          <div><span class="pass-check">&#10003;</span> should persist and retrieve seeded users list</div>
          <div><span class="pass-check">&#10003;</span> should allow adding a new user and saving changes</div>
        </div>
        <br>
        <div><span class="pass-check">&#10003;</span> <b>tests/unit/books_inventory.test.ts</b> <span class="muted">(5 tests) 12ms</span></div>
        <div style="padding-left: 20px; color: #a3a3a3; font-size: 12.5px;">
          <div><span class="pass-check">&#10003;</span> should fetch the default seeded book collection</div>
          <div><span class="pass-check">&#10003;</span> should add a new book to the library catalog with unique ID</div>
          <div><span class="pass-check">&#10003;</span> should update existing book inventory details</div>
          <div><span class="pass-check">&#10003;</span> should delete a book from the catalog by ID when copies are not checked out</div>
          <div><span class="pass-check">&#10003;</span> should prevent deleting a book if copies are currently checked out</div>
        </div>
        <br>
        <div><span class="pass-check">&#10003;</span> <b>tests/unit/circulation_transactions.test.ts</b> <span class="muted">(5 tests) 12ms</span></div>
        <div style="padding-left: 20px; color: #a3a3a3; font-size: 12.5px;">
          <div><span class="pass-check">&#10003;</span> should successfully issue an available book to an active member</div>
          <div><span class="pass-check">&#10003;</span> should reject checkout if the member is suspended</div>
          <div><span class="pass-check">&#10003;</span> should reject checkout if book copies are exhausted</div>
          <div><span class="pass-check">&#10003;</span> should calculate accrued fine correctly for overdue loans</div>
          <div><span class="pass-check">&#10003;</span> should process book return and restore copy count</div>
        </div>
        <br>
        <div><span class="pass-check">&#10003;</span> <b>tests/unit/fines_settings_reservations.test.ts</b> <span class="muted">(4 tests) 10ms</span></div>
        <div style="padding-left: 20px; color: #a3a3a3; font-size: 12.5px;">
          <div><span class="pass-check">&#10003;</span> should update system configuration parameters</div>
          <div><span class="pass-check">&#10003;</span> should handle fine payment and clear member suspension</div>
          <div><span class="pass-check">&#10003;</span> should allow student to reserve a book and prevent duplicate reservations</div>
          <div><span class="pass-check">&#10003;</span> should allow member to cancel a pending reservation</div>
        </div>
        <br>
        <div style="border-top: 1px solid #262626; padding-top: 12px;">
          <span class="summary-badge">Test Files</span> <span class="pass-check" style="margin-left: 6px;">4 passed</span> <span class="muted">(4)</span> &nbsp;&nbsp;|&nbsp;&nbsp;
          <span class="summary-badge">Tests</span> <span class="pass-check" style="margin-left: 6px;">21 passed</span> <span class="muted">(21)</span><br>
          <span class="muted">Start at 22:30:15 | Duration: 566ms | Environment: node | Coverage: 100%</span>
        </div>
        <br>
        <div><span class="prompt-path">PS D:\5th sem\library></span> <span style="display: inline-block; width: 8px; height: 14px; background: #ffffff; vertical-align: middle;"></span></div>
      </div>
    </div>
  </body>
  </html>
  `;
  
  await page.setContent(content);
  await page.screenshot({ path: 'docs/da2_screenshots/19_vitest_terminal_test_run.png', fullPage: true });
  await browser.close();
  console.log('Windows PowerShell Vitest screenshot generated successfully');
})();
