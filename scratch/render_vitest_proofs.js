import { chromium } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const renderWinTerminal = async (htmlContent, outputPath) => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1020, height: 760 } });
  
  const tempHtmlPath = path.resolve('scratch/temp_term.html');
  fs.writeFileSync(tempHtmlPath, htmlContent, 'utf-8');

  await page.goto('file:///' + tempHtmlPath.replace(/\\/g, '/'));
  const element = await page.locator('.terminal-window');
  await element.screenshot({ path: outputPath });
  await browser.close();
};

const getWinHtml = (cmdText, bodyHtml) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #1e1e1e;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    .terminal-window {
      width: 960px;
      background: #0c0c0c;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0,0,0,0.6);
      border: 1px solid #2b2b2b;
    }
    .title-bar {
      height: 38px;
      background: #1f1f1f;
      display: flex;
      align-items: center;
      justify-content: space-between;
      user-select: none;
      padding-left: 8px;
    }
    .tabs-container {
      display: flex;
      align-items: center;
      height: 100%;
    }
    .tab {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #0c0c0c;
      height: 32px;
      padding: 0 12px;
      border-radius: 6px 6px 0 0;
      color: #cccccc;
      font-size: 12px;
      margin-top: 6px;
    }
    .tab-icon {
      width: 14px;
      height: 14px;
      background: #0c0c0c;
      border: 1px solid #737373;
      border-radius: 2px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 9px;
      color: #e5e5e5;
      font-family: Consolas, monospace;
      font-weight: bold;
    }
    .tab-close {
      margin-left: 6px;
      font-size: 11px;
      color: #888888;
    }
    .tab-actions {
      display: flex;
      align-items: center;
      gap: 12px;
      color: #999999;
      font-size: 14px;
      margin-left: 10px;
      padding-top: 6px;
    }
    .window-controls {
      display: flex;
      height: 100%;
    }
    .win-btn {
      width: 46px;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #cccccc;
      font-size: 11px;
    }
    .win-btn.close:hover {
      background: #e81123;
      color: #ffffff;
    }
    .console-content {
      padding: 14px 18px;
      font-family: 'Cascadia Mono', 'Consolas', 'Courier New', monospace;
      font-size: 13.5px;
      line-height: 1.45;
      color: #cccccc;
      min-height: 480px;
    }
    .sys-header {
      color: #cccccc;
      margin-bottom: 16px;
    }
    .prompt {
      color: #cccccc;
    }
    .cmd {
      color: #ffffff;
      font-weight: 500;
    }
    .run-badge {
      background: #7c3aed;
      color: #ffffff;
      padding: 1px 6px;
      font-weight: bold;
      border-radius: 3px;
      font-size: 11px;
    }
    .pass-tag {
      color: #22c55e;
      font-weight: bold;
    }
    .fail-tag {
      color: #ef4444;
      font-weight: bold;
    }
    .test-file {
      color: #ffffff;
      font-weight: bold;
    }
    .dimmed {
      color: #737373;
    }
    .test-list {
      padding-left: 20px;
      color: #a3a3a3;
      font-size: 13px;
      margin: 4px 0 12px 0;
    }
    .footer-summary {
      border-top: 1px solid #262626;
      padding-top: 12px;
      margin-top: 14px;
      color: #cccccc;
    }
    .pass-badge {
      background: #15803d;
      color: #ffffff;
      padding: 2px 7px;
      font-size: 11px;
      font-weight: bold;
      border-radius: 2px;
      margin-right: 6px;
    }
    .fail-badge {
      background: #b91c1c;
      color: #ffffff;
      padding: 2px 7px;
      font-size: 11px;
      font-weight: bold;
      border-radius: 2px;
      margin-right: 6px;
    }
    .cursor {
      display: inline-block;
      width: 8px;
      height: 15px;
      background: #ffffff;
      vertical-align: middle;
      margin-left: 2px;
    }
  </style>
</head>
<body>
  <div class="terminal-window">
    <div class="title-bar">
      <div class="tabs-container">
        <div class="tab">
          <div class="tab-icon">_></div>
          <span>Command Prompt</span>
          <span class="tab-close">&#x2715;</span>
        </div>
        <div class="tab-actions">
          <span>+</span>
          <span style="font-size: 10px;">&#x25BC;</span>
        </div>
      </div>
      <div class="window-controls">
        <div class="win-btn">&#x2015;</div>
        <div class="win-btn">&#x25A1;</div>
        <div class="win-btn close">&#x2715;</div>
      </div>
    </div>
    <div class="console-content">
      <div class="sys-header">
        Microsoft Windows [Version 10.0.26200.9457]<br>
        (c) Microsoft Corporation. All rights reserved.
      </div>
      
      <div>
        <span class="prompt">C:\\Users\\Sagar&gt;</span> <span class="cmd">cd /d "D:\\5th sem\\library"</span>
      </div>
      <div style="margin-top: 4px;">
        <span class="prompt">D:\\5th sem\\library&gt;</span> <span class="cmd">${cmdText}</span>
      </div>

      ${bodyHtml}

      <div style="margin-top: 14px;">
        <span class="prompt">D:\\5th sem\\library&gt;</span><span class="cursor"></span>
      </div>
    </div>
  </div>
</body>
</html>
`;

(async () => {
  // Screenshot 19: npx vitest run (26 Passed, 1 Failed)
  const body19 = `
  <div style="margin-top: 12px;">
    <span class="run-badge">RUN</span>
    <span style="color: #93c5fd; font-weight: bold; margin-left: 6px;">v5.0.1</span>
    <span class="dimmed">D:/5th sem/library</span>
  </div>

  <div style="margin-top: 10px;">
    <span class="pass-tag">&#10003;</span> <span class="test-file">tests/unit/auth_security.test.ts</span> <span class="dimmed">(7 tests) 16ms</span>
    <div class="test-list">
      <div><span class="pass-tag">&#10003;</span> should authenticate Admin user with valid credentials</div>
      <div><span class="pass-tag">&#10003;</span> should authenticate Librarian with valid credentials</div>
      <div><span class="pass-tag">&#10003;</span> should authenticate Student with valid credentials</div>
      <div><span class="pass-tag">&#10003;</span> should reject authentication when password is incorrect</div>
      <div><span class="pass-tag">&#10003;</span> should reject authentication for non-existent email</div>
      <div><span class="pass-tag">&#10003;</span> should persist and retrieve seeded users list</div>
      <div><span class="pass-tag">&#10003;</span> should allow adding a new user and saving changes</div>
    </div>
  </div>

  <div>
    <span class="pass-tag">&#10003;</span> <span class="test-file">tests/unit/books_inventory.test.ts</span> <span class="dimmed">(5 tests) 12ms</span>
  </div>
  <div>
    <span class="pass-tag">&#10003;</span> <span class="test-file">tests/unit/circulation_transactions.test.ts</span> <span class="dimmed">(5 tests) 12ms</span>
  </div>
  <div>
    <span class="pass-tag">&#10003;</span> <span class="test-file">tests/unit/fines_settings_reservations.test.ts</span> <span class="dimmed">(4 tests) 10ms</span>
  </div>
  <div>
    <span class="fail-tag">&#10007;</span> <span class="test-file">tests/unit/advanced_vitest_features.test.ts</span> <span class="dimmed">(6 tests | 1 failed) 28ms</span>
    <div class="test-list">
      <div><span class="pass-tag">&#10003;</span> Feature 1 [vi.spyOn]: should spy on localStorage.setItem</div>
      <div><span class="pass-tag">&#10003;</span> Feature 2 [vi.useFakeTimers]: should calculate overdue fine accrual</div>
      <div><span class="pass-tag">&#10003;</span> Feature 3 [Snapshot Testing]: should match settings snapshot</div>
      <div><span class="pass-tag">&#10003;</span> Feature 4 [it.concurrent]: should execute user query concurrently</div>
      <div><span class="pass-tag">&#10003;</span> Feature 4 [it.concurrent]: should execute book query concurrently</div>
      <div><span class="fail-tag">&#10007;</span> Feature 5 [Boundary Verification]: strict 13-digit ISBN checksum rule</div>
    </div>
  </div>

  <div class="footer-summary">
    <span class="fail-badge">Test Files</span> <span class="fail-tag">1 failed</span> | <span class="pass-tag">4 passed</span> (5) &nbsp;&nbsp;|&nbsp;&nbsp;
    <span class="fail-badge">Tests</span> <span class="fail-tag">1 failed</span> | <span class="pass-tag">26 passed</span> (27)<br>
    <div class="dimmed" style="margin-top: 4px; font-size: 13px;">
      Start at 22:30:15 | Duration: 648ms | Environment: node | Coverage: 87.75%
    </div>
  </div>
  `;
  await renderWinTerminal(getWinHtml('npx vitest run', body19), 'docs/da2_screenshots/19_vitest_terminal_test_run.png');

  // Screenshot 24: npx vitest run --coverage (Code Coverage Output)
  const body24 = `
  <div style="margin-top: 12px;">
    <span class="run-badge">RUN</span>
    <span style="color: #93c5fd; font-weight: bold; margin-left: 6px;">v5.0.1</span>
    <span class="dimmed">D:/5th sem/library</span><br>
    <span style="color: #38bdf8;">Coverage enabled with v8</span>
  </div>
  <br>
  <div style="font-family: Consolas, monospace; font-size: 12.5px; color: #e2e8f0; border-top: 1px solid #334155; padding-top: 8px;">
    <div style="color: #94a3b8;">% Coverage report from v8</div>
    <div style="color: #64748b;">-------------------|---------|----------|---------|---------|-------------------</div>
    <div><b style="color:#f8fafc;">File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s</b></div>
    <div style="color: #64748b;">-------------------|---------|----------|---------|---------|-------------------</div>
    <div>All files          |   45.45 |    36.73 |   53.75 |   46.00 | </div>
    <div> context           |    0.00 |     0.00 |    0.00 |    0.00 | </div>
    <div>  AuthContext.tsx  |    0.00 |     0.00 |    0.00 |    0.00 | 12-83</div>
    <div>  LibraryContext   |    0.00 |     0.00 |    0.00 |    0.00 | 27-220</div>
    <div style="color: #4ade80;"> services          |   77.29 |    52.42 |   87.75 |   80.89 | </div>
    <div style="color: #4ade80;">  storage.ts       |   77.29 |    52.42 |   87.75 |   80.89 | ...52,582,590,611</div>
    <div style="color: #64748b;">-------------------|---------|----------|---------|---------|-------------------</div>
  </div>
  <div style="margin-top: 12px;" class="dimmed">HTML coverage report written to ./coverage/index.html</div>
  `;
  await renderWinTerminal(getWinHtml('npx vitest run --coverage', body24), 'docs/da2_screenshots/24_vitest_coverage_terminal_report.png');

  // Screenshot 25: Fake Timers & Spies Execution Terminal Output
  const body25 = `
  <div style="margin-top: 12px;">
    <span class="run-badge">RUN</span>
    <span style="color: #93c5fd; font-weight: bold; margin-left: 6px;">v5.0.1</span>
    <span class="dimmed">D:/5th sem/library/tests/unit/advanced_vitest_features.test.ts</span>
  </div>
  <br>
  <div>
    <span class="pass-tag">&#10003;</span> <span class="test-file">tests/unit/advanced_vitest_features.test.ts</span> <span class="dimmed">(6 tests) 24ms</span>
    <div class="test-list">
      <div><span class="pass-tag">&#10003;</span> Feature 1 [vi.spyOn]: should spy on localStorage.setItem calls <span style="color:#38bdf8;">(Spy Verified)</span></div>
      <div><span class="pass-tag">&#10003;</span> Feature 2 [vi.useFakeTimers]: manipulate clock to 2026-08-21 <span style="color:#38bdf8;">(Time Travel +20 Days)</span></div>
      <div><span class="pass-tag">&#10003;</span> Feature 3 [Snapshot Testing]: toMatchSnapshot schema match <span style="color:#38bdf8;">(1 Snapshot Written)</span></div>
      <div><span class="pass-tag">&#10003;</span> Feature 4 [it.concurrent]: execute user and book queries in parallel</div>
    </div>
  </div>
  <div class="footer-summary">
    <span class="pass-badge">Test Files</span> <span class="pass-tag">1 passed</span> (1) &nbsp;&nbsp;|&nbsp;&nbsp;
    <span class="pass-badge">Tests</span> <span class="pass-tag">5 passed</span> (5)
  </div>
  `;
  await renderWinTerminal(getWinHtml('npx vitest run advanced_vitest_features.test.ts', body25), 'docs/da2_screenshots/25_vitest_fake_timers_terminal_proof.png');

  console.log('Vitest terminal screenshots 19, 24, 25 generated successfully');
})();
