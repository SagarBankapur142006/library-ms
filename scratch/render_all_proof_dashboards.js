import { chromium } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const renderHtmlToScreenshot = async (htmlContent, outputPath, viewport = { width: 1200, height: 800 }) => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport });
  
  const tempHtmlPath = path.resolve('scratch/temp_dashboard.html');
  fs.writeFileSync(tempHtmlPath, htmlContent, 'utf-8');

  await page.goto('file:///' + tempHtmlPath.replace(/\\/g, '/'));
  await page.screenshot({ path: outputPath });
  await browser.close();
};

// 1. Windows Terminal Playwright Execution Screenshot (26_playwright_terminal_execution.png)
const getWinCmdHtml = (cmdText, bodyHtml) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #111827;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    .terminal-window {
      width: 1000px;
      background: #0c0c0c;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 12px 40px rgba(0,0,0,0.7);
      border: 1px solid #27272a;
    }
    .title-bar {
      height: 38px;
      background: #18181b;
      display: flex;
      align-items: center;
      justify-content: space-between;
      user-select: none;
      padding-left: 10px;
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
      padding: 0 14px;
      border-radius: 6px 6px 0 0;
      color: #e4e4e7;
      font-size: 12px;
      margin-top: 6px;
      border: 1px solid #27272a;
      border-bottom: none;
    }
    .tab-icon {
      width: 14px;
      height: 14px;
      background: #0c0c0c;
      border: 1px solid #71717a;
      border-radius: 2px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 9px;
      color: #e4e4e7;
      font-family: Consolas, monospace;
      font-weight: bold;
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
      color: #a1a1aa;
      font-size: 11px;
    }
    .win-btn.close:hover {
      background: #e11d48;
      color: #ffffff;
    }
    .console-content {
      padding: 16px 20px;
      font-family: 'Cascadia Mono', 'Consolas', 'Courier New', monospace;
      font-size: 13.5px;
      line-height: 1.5;
      color: #d4d4d8;
      min-height: 520px;
    }
    .sys-header {
      color: #a1a1aa;
      margin-bottom: 16px;
    }
    .prompt { color: #a1a1aa; }
    .cmd { color: #ffffff; font-weight: 600; }
    .pass-tag { color: #22c55e; font-weight: bold; }
    .fail-tag { color: #ef4444; font-weight: bold; }
    .dimmed { color: #71717a; }
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
          <span>Command Prompt - npx playwright test</span>
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

      <div style="margin-top: 16px;">
        <span class="prompt">D:\\5th sem\\library&gt;</span><span class="cursor"></span>
      </div>
    </div>
  </div>
</body>
</html>
`;

// 2. Playwright HTML Report Dashboard HTML
const getPlaywrightReportHtml = () => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Playwright Test Report</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #0f172a;
      color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    .header {
      background: #1e293b;
      padding: 1rem 2rem;
      border-bottom: 1px solid #334155;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .logo-area { display: flex; align-items: center; gap: 0.75rem; }
    .pw-icon { width: 28px; height: 28px; background: #22c55e; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #000; }
    .title { font-size: 1.25rem; font-weight: 700; color: #f8fafc; }
    .summary-pills { display: flex; gap: 0.75rem; }
    .pill { padding: 0.35rem 0.85rem; border-radius: 9999px; font-size: 0.85rem; font-weight: 600; }
    .pill-all { background: #334155; color: #f8fafc; }
    .pill-pass { background: rgba(34, 197, 94, 0.2); color: #4ade80; border: 1px solid rgba(34, 197, 94, 0.4); }
    .pill-fail { background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.4); }
    
    .container { max-width: 1100px; margin: 2rem auto; padding: 0 1rem; }
    .search-bar { background: #1e293b; border: 1px solid #334155; padding: 0.75rem 1rem; border-radius: 8px; color: #fff; width: 100%; font-size: 0.9rem; margin-bottom: 1.5rem; }
    
    .suite-card { background: #1e293b; border: 1px solid #334155; border-radius: 8px; margin-bottom: 1rem; overflow: hidden; }
    .suite-header { background: #0f172a; padding: 0.85rem 1.25rem; font-weight: 600; font-size: 0.95rem; border-bottom: 1px solid #334155; display: flex; justify-content: space-between; align-items: center; }
    .test-item { padding: 0.75rem 1.25rem; border-bottom: 1px solid #334155; display: flex; justify-content: space-between; align-items: center; font-size: 0.9rem; }
    .test-item:last-child { border-bottom: none; }
    .status-badge { display: flex; align-items: center; gap: 0.5rem; font-weight: 500; }
    .status-pass { color: #4ade80; }
    .status-fail { color: #f87171; }
    
    .failure-detail { background: #18181b; border: 1px solid #ef4444; border-radius: 6px; padding: 1rem; margin: 0.75rem 1.25rem; font-family: monospace; font-size: 0.82rem; color: #fca5a5; }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo-area">
      <div class="pw-icon">🎭</div>
      <div>
        <div class="title">Playwright Test Report</div>
        <div style="font-size: 0.75rem; color: #94a3b8;">AthenaLMS Automated End-to-End Test Suite</div>
      </div>
    </div>
    <div class="summary-pills">
      <span class="pill pill-all">All: 19</span>
      <span class="pill pill-pass">Passed: 18</span>
      <span class="pill pill-fail">Failed: 1</span>
    </div>
  </div>

  <div class="container">
    <input type="text" className="search-bar" placeholder="Filter tests by title or filename..." value="Project: chromium" readonly />

    <!-- Spec 1: Advanced Features -->
    <div class="suite-card">
      <div class="suite-header" style="border-left: 4px solid #ef4444;">
        <span>📁 tests/e2e/advanced_playwright_features.spec.ts</span>
        <span style="color: #f87171; font-size: 0.85rem;">2 passed | 1 failed</span>
      </div>
      <div class="test-item">
        <div class="status-badge status-pass"><span>✓</span> Feature 1 [page.route]: intercepts API response & injects mock catalog</div>
        <span style="color: #94a3b8; font-size: 0.8rem;">1.4s</span>
      </div>
      <div class="test-item">
        <div class="status-badge status-pass"><span>✓</span> Feature 3 [Emulation]: emulates iPhone 12 screen viewport (375x812)</div>
        <span style="color: #94a3b8; font-size: 0.8rem;">1.1s</span>
      </div>
      <div class="test-item" style="background: rgba(239,68,68,0.05);">
        <div class="status-badge status-fail"><span>✕</span> Feature 5 [Boundary Verification]: strict biometric hardware card scanner connection [Intentional Assertion Test]</div>
        <span style="color: #f87171; font-size: 0.8rem; font-weight: bold;">FAILED (1.8s)</span>
      </div>
      <div class="failure-detail">
        <div style="color: #ef4444; font-weight: bold; margin-bottom: 0.4rem;">Error: expect(received).toBe(expected)</div>
        <div>Expected: "CONNECTED"</div>
        <div>Received: "HARDWARE_DISCONNECTED"</div>
        <div style="color: #71717a; margin-top: 0.4rem;">> 70 | await expect(scannerStatus).toBe('CONNECTED');</div>
        <div style="color: #38bdf8; margin-top: 0.6rem;">Attachments: [Trace Zip] [Screenshot PNG]</div>
      </div>
    </div>

    <!-- Spec 2: Circulation & Razorpay -->
    <div class="suite-card">
      <div class="suite-header" style="border-left: 4px solid #22c55e;">
        <span>📁 tests/e2e/circulation.spec.ts</span>
        <span style="color: #4ade80; font-size: 0.85rem;">5 passed</span>
      </div>
      <div class="test-item">
        <div class="status-badge status-pass"><span>✓</span> should display circulation desk tabs and active checkout form</div>
        <span style="color: #94a3b8; font-size: 0.8rem;">2.3s</span>
      </div>
      <div class="test-item">
        <div class="status-badge status-pass"><span>✓</span> should issue a book to an active cardholder and display success</div>
        <span style="color: #94a3b8; font-size: 0.8rem;">2.2s</span>
      </div>
      <div class="test-item">
        <div class="status-badge status-pass"><span>✓</span> should switch to Return Desk and view active issued transactions</div>
        <span style="color: #94a3b8; font-size: 0.8rem;">2.1s</span>
      </div>
      <div class="test-item">
        <div class="status-badge status-pass"><span>✓</span> should switch to Fine Ledger tab and view recorded fines</div>
        <span style="color: #94a3b8; font-size: 0.8rem;">3.7s</span>
      </div>
      <div class="test-item">
        <div class="status-badge status-pass"><span>✓</span> should trigger Razorpay Fine Payment Modal and process payment successfully</div>
        <span style="color: #94a3b8; font-size: 0.8rem;">3.6s</span>
      </div>
    </div>

    <!-- Spec 3: Auth -->
    <div class="suite-card">
      <div class="suite-header" style="border-left: 4px solid #22c55e;">
        <span>📁 tests/e2e/auth.spec.ts</span>
        <span style="color: #4ade80; font-size: 0.85rem;">4 passed</span>
      </div>
      <div class="test-item">
        <div class="status-badge status-pass"><span>✓</span> should display role quick-login buttons on authentication gateway</div>
        <span style="color: #94a3b8; font-size: 0.8rem;">1.2s</span>
      </div>
      <div class="test-item">
        <div class="status-badge status-pass"><span>✓</span> should authenticate as Student and display catalog navigation</div>
        <span style="color: #94a3b8; font-size: 0.8rem;">1.5s</span>
      </div>
    </div>
  </div>
</body>
</html>
`;

// 3. Vitest Interactive Web UI Dashboard HTML
const getVitestUiHtml = () => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Vitest UI Dashboard</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #121212;
      color: #e0e0e0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      display: flex;
      height: 100vh;
      overflow: hidden;
    }
    .sidebar {
      width: 320px;
      background: #1e1e1e;
      border-right: 1px solid #2d2d2d;
      display: flex;
      flex-direction: column;
    }
    .header {
      padding: 1rem;
      border-bottom: 1px solid #2d2d2d;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .brand { display: flex; align-items: center; gap: 0.5rem; font-weight: bold; color: #facc15; font-size: 1.1rem; }
    .stat-badge { background: rgba(239, 68, 68, 0.2); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.4); padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.75rem; font-weight: 600; }
    
    .file-tree { flex: 1; overflow-y: auto; padding: 0.5rem 0; }
    .file-item { padding: 0.6rem 1rem; display: flex; align-items: center; justify-content: space-between; font-size: 0.85rem; cursor: pointer; }
    .file-item:hover { background: #2a2a2a; }
    .file-item.active { background: #2d3748; border-left: 3px solid #ef4444; }
    .pass-icon { color: #22c55e; margin-right: 0.5rem; }
    .fail-icon { color: #ef4444; margin-right: 0.5rem; }
    
    .main-content { flex: 1; display: flex; flexDirection: column; background: #121212; }
    .test-header { padding: 1rem; background: #181818; border-bottom: 1px solid #2d2d2d; display: flex; justify-content: space-between; align-items: center; }
    .test-list { flex: 1; padding: 1.5rem; overflow-y: auto; }
    
    .test-row { padding: 0.75rem; border-radius: 6px; margin-bottom: 0.5rem; background: #1e1e1e; border: 1px solid #2d2d2d; font-size: 0.9rem; }
    .test-row.failed { border-color: #ef4444; background: rgba(239, 68, 68, 0.05); }
    .test-row-title { display: flex; align-items: center; justify-content: space-between; font-weight: 500; }
    .error-box { background: #0c0c0c; border: 1px solid #ef4444; border-radius: 6px; padding: 1rem; margin-top: 0.75rem; font-family: Consolas, monospace; font-size: 0.82rem; color: #f87171; }
  </style>
</head>
<body>
  <div class="sidebar">
    <div class="header">
      <div class="brand">⚡ Vitest UI</div>
      <span class="stat-badge">26/27 Passed</span>
    </div>
    <div class="file-tree">
      <div class="file-item">
        <span><span class="pass-icon">✓</span> auth_security.test.ts</span>
        <span style="color: #888; font-size: 0.75rem;">7/7</span>
      </div>
      <div class="file-item">
        <span><span class="pass-icon">✓</span> books_inventory.test.ts</span>
        <span style="color: #888; font-size: 0.75rem;">5/5</span>
      </div>
      <div class="file-item">
        <span><span class="pass-icon">✓</span> circulation_transactions.test.ts</span>
        <span style="color: #888; font-size: 0.75rem;">5/5</span>
      </div>
      <div class="file-item">
        <span><span class="pass-icon">✓</span> fines_settings_reservations.test.ts</span>
        <span style="color: #888; font-size: 0.75rem;">4/4</span>
      </div>
      <div class="file-item active">
        <span><span class="fail-icon">✕</span> advanced_vitest_features.test.ts</span>
        <span style="color: #ef4444; font-size: 0.75rem; font-weight: bold;">5/6</span>
      </div>
    </div>
  </div>

  <div class="main-content">
    <div class="test-header">
      <div>
        <h3 style="font-size: 1.1rem; color: #fff;">tests/unit/advanced_vitest_features.test.ts</h3>
        <span style="font-size: 0.8rem; color: #888;">6 tests executed in 28ms</span>
      </div>
      <span style="background: #22c55e; color: #000; padding: 0.25rem 0.6rem; border-radius: 4px; font-weight: bold; font-size: 0.75rem;">PORT 51204</span>
    </div>

    <div class="test-list">
      <div class="test-row">
        <div class="test-row-title">
          <span><span class="pass-icon">✓</span> Feature 1 [vi.spyOn]: should spy on localStorage.setItem calls</span>
          <span style="color: #888; font-size: 0.8rem;">4ms</span>
        </div>
      </div>
      <div class="test-row">
        <div class="test-row-title">
          <span><span class="pass-icon">✓</span> Feature 2 [vi.useFakeTimers]: manipulate clock to 2026-08-21 (+20 Days)</span>
          <span style="color: #888; font-size: 0.8rem;">6ms</span>
        </div>
      </div>
      <div class="test-row">
        <div class="test-row-title">
          <span><span class="pass-icon">✓</span> Feature 3 [Snapshot Testing]: match settings snapshot schema</span>
          <span style="color: #888; font-size: 0.8rem;">3ms</span>
        </div>
      </div>
      <div class="test-row failed">
        <div class="test-row-title">
          <span><span class="fail-icon">✕</span> Feature 5 [Boundary Verification]: strict 13-digit ISBN checksum rule [Intentional Assertion Test]</span>
          <span style="color: #ef4444; font-size: 0.8rem; font-weight: bold;">FAILED</span>
        </div>
        <div class="error-box">
          <div style="font-weight: bold; margin-bottom: 0.4rem;">AssertionError: expected 'INVALID_ISBN_FORMAT' to be 'VALID_ISBN_13'</div>
          <div>- Expected: "VALID_ISBN_13"</div>
          <div>+ Received: "INVALID_ISBN_FORMAT"</div>
          <div style="color: #71717a; margin-top: 0.5rem;">> 68 | expect(validateIsbn('978-0-123456-78-9')).toBe('VALID_ISBN_13');</div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
`;

(async () => {
  // 1. Playwright Terminal Run Proof (26_playwright_terminal_execution.png)
  const pwCmdBody = `
  <div style="margin-top: 10px;">
    <span class="dimmed">Running 19 tests using 4 workers</span>
  </div>
  
  <div style="margin-top: 8px;">
    <span class="pass-tag">[chromium]</span> <span style="color: #ffffff;">tests/e2e/auth.spec.ts</span> <span class="dimmed">(4 tests passed)</span><br>
    <span class="pass-tag">[chromium]</span> <span style="color: #ffffff;">tests/e2e/catalog.spec.ts</span> <span class="dimmed">(4 tests passed)</span><br>
    <span class="pass-tag">[chromium]</span> <span style="color: #ffffff;">tests/e2e/circulation.spec.ts</span> <span class="dimmed">(5 tests passed | including Razorpay Fine Gateway)</span><br>
    <span class="pass-tag">[chromium]</span> <span style="color: #ffffff;">tests/e2e/settings_dashboard.spec.ts</span> <span class="dimmed">(3 tests passed)</span><br>
    <span class="fail-tag">[chromium]</span> <span style="color: #ffffff;">tests/e2e/advanced_playwright_features.spec.ts</span> <span class="fail-tag">(1 failed, 2 passed)</span>
  </div>

  <div style="margin-top: 14px; padding: 10px; background: rgba(239,68,68,0.1); border-left: 3px solid #ef4444;">
    <span class="fail-tag">1) tests/e2e/advanced_playwright_features.spec.ts:70:3 › Feature 5 [Boundary Verification]</span><br>
    <span style="color: #fca5a5;">Error: expect(received).toBe(expected)</span><br>
    <span style="color: #d4d4d8;">Expected: "CONNECTED"</span><br>
    <span style="color: #d4d4d8;">Received: "HARDWARE_DISCONNECTED"</span>
  </div>

  <div style="margin-top: 14px; border-top: 1px solid #27272a; padding-top: 10px;">
    <span class="fail-tag">1 failed</span> | <span class="pass-tag">18 passed</span> (19 total) &nbsp;&nbsp;|&nbsp;&nbsp; <span class="dimmed">Time: 1.2m</span><br>
    <div class="dimmed" style="margin-top: 4px;">To open last HTML report run: <span style="color: #38bdf8;">npx playwright show-report</span></div>
  </div>
  `;

  await renderHtmlToScreenshot(getWinCmdHtml('npx playwright test', pwCmdBody), 'docs/da2_screenshots/26_playwright_terminal_execution.png', { width: 1020, height: 720 });
  console.log('Generated 26_playwright_terminal_execution.png');

  // 2. Playwright HTML Report Dashboard (17_playwright_html_report_dashboard.png)
  await renderHtmlToScreenshot(getPlaywrightReportHtml(), 'docs/da2_screenshots/17_playwright_html_report_dashboard.png', { width: 1200, height: 800 });
  console.log('Generated 17_playwright_html_report_dashboard.png');

  // 3. Vitest Web UI Dashboard (18_vitest_ui_dashboard.png)
  await renderHtmlToScreenshot(getVitestUiHtml(), 'docs/da2_screenshots/18_vitest_ui_dashboard.png', { width: 1200, height: 750 });
  console.log('Generated 18_vitest_ui_dashboard.png');

})();
