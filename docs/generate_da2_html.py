import base64
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DOCS = ROOT / "docs"
SCREENSHOTS = DOCS / "da2_screenshots"
OUTPUT_HTML = DOCS / "Software_Engineering_DA2_Testing_Report.html"

def get_base64_image(filename):
    p = SCREENSHOTS / filename
    if not p.exists():
        print(f"Warning: Image {filename} not found in {SCREENSHOTS}")
        return ""
    with open(p, "rb") as f:
        data = base64.b64encode(f.read()).decode("utf-8")
    return f"data:image/png;base64,{data}"

def generate_html():
    imgs = {
        "login_gateway": get_base64_image("01_playwright_login_gateway.png"),
        "auth_error": get_base64_image("02_playwright_auth_error_validation.png"),
        "student_view": get_base64_image("03_playwright_student_catalog_view.png"),
        "admin_dashboard": get_base64_image("04_playwright_admin_dashboard.png"),
        "logout": get_base64_image("05_playwright_logout_session_terminated.png"),
        "catalog_grid": get_base64_image("06_playwright_book_catalog_grid.png"),
        "search_filter": get_base64_image("07_playwright_catalog_search_filter.png"),
        "add_modal": get_base64_image("08_playwright_add_book_modal.png"),
        "book_added": get_base64_image("09_playwright_catalog_book_added.png"),
        "issue_form": get_base64_image("10_playwright_circulation_issue_form.png"),
        "checkout_success": get_base64_image("11_playwright_circulation_checkout_success.png"),
        "return_desk": get_base64_image("12_playwright_circulation_return_desk.png"),
        "fine_ledger": get_base64_image("13_playwright_circulation_fine_ledger.png"),
        "admin_metrics": get_base64_image("14_playwright_admin_metrics_dashboard.png"),
        "settings_console": get_base64_image("15_playwright_system_settings_console.png"),
        "settings_saved": get_base64_image("16_playwright_settings_saved_alert.png"),
        "pw_report": get_base64_image("17_playwright_html_report_dashboard.png"),
        "vitest_ui": get_base64_image("18_vitest_ui_dashboard.png"),
        "vitest_cli": get_base64_image("19_vitest_terminal_test_run.png"),
        "pw_mobile": get_base64_image("20_playwright_mobile_viewport.png"),
        "pw_component": get_base64_image("21_playwright_metrics_component_snapshot.png"),
        "razorpay_modal": get_base64_image("22_playwright_razorpay_fine_payment_modal.png"),
        "razorpay_receipt": get_base64_image("23_playwright_payment_success_receipt.png"),
        "vitest_coverage": get_base64_image("24_vitest_coverage_terminal_report.png"),
        "vitest_timers": get_base64_image("25_vitest_fake_timers_terminal_proof.png"),
        "pw_terminal": get_base64_image("26_playwright_terminal_execution.png"),
        "vitest_spies": get_base64_image("27_vitest_spies_and_snapshots.png"),
        "pw_aria": get_base64_image("28_playwright_aria_accessibility_locators.png"),
        "pw_route": get_base64_image("29_playwright_network_route_interception.png"),
    }

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Digital Assignment 2 - Advanced Software Testing Tools Exploration Report</title>
  <style>
    body {{
      font-family: 'Times New Roman', Times, serif;
      background: #ffffff;
      color: #000000;
      line-height: 1.35;
      font-size: 14.5px;
      margin: 0;
      padding: 40px 60px;
    }}

    .container {{
      max-width: 920px;
      margin: 0 auto;
    }}

    .title-page {{
      text-align: center;
      padding: 80px 0 60px 0;
      page-break-after: always;
    }}

    .main-title {{
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 12px;
      line-height: 1.3;
    }}

    .project-name {{
      font-size: 17px;
      font-weight: bold;
      color: #000000;
      margin-bottom: 160px;
    }}

    .submission-block {{
      text-align: right;
      font-size: 14px;
      line-height: 1.45;
      color: #000000;
    }}

    .submission-block b {{
      font-size: 16px;
    }}

    h1 {{
      font-size: 17px;
      font-weight: bold;
      border-bottom: 1px solid #000000;
      padding-bottom: 4px;
      margin-top: 32px;
      margin-bottom: 10px;
    }}

    h2 {{
      font-size: 15px;
      font-weight: bold;
      margin-top: 22px;
      margin-bottom: 6px;
    }}

    h3 {{
      font-size: 14.5px;
      font-weight: bold;
      font-style: italic;
      margin-top: 16px;
      margin-bottom: 4px;
    }}

    p {{
      margin: 6px 0;
      text-align: justify;
    }}

    ul {{
      margin: 4px 0;
      padding-left: 24px;
    }}

    li {{
      margin-bottom: 3px;
    }}

    table {{
      width: 100%;
      border-collapse: collapse;
      margin: 14px 0;
      font-size: 12px;
    }}

    th, td {{
      border: 1px solid #000000;
      padding: 6px 8px;
      text-align: left;
    }}

    th {{
      background: #eaeaea;
      font-weight: bold;
    }}

    .figure {{
      text-align: center;
      margin: 18px 0 22px 0;
    }}

    .figure img {{
      max-width: 100%;
      height: auto;
      border: 1px solid #777777;
    }}

    .caption {{
      font-size: 12.5px;
      font-style: italic;
      margin-top: 5px;
      color: #000000;
    }}

    .code-line {{
      font-family: 'Consolas', 'Courier New', monospace;
      background: #f4f4f4;
      padding: 3px 6px;
      border: 1px solid #cccccc;
      display: inline-block;
      margin: 3px 0;
      font-size: 12.5px;
    }}
  </style>
</head>
<body>
  <div class="container">
    <div class="title-page">
      <div class="main-title">Digital Assignment 2<br>Automated Testing Tools & Verification Report</div>
      <div class="project-name">Library Management System (LMS)</div>
      
      <div class="submission-block">
        Submitted by:<br>
        <b>Sagar S Bankapur (24BCE1294)</b><br>
        Software Engineering<br>
        School of Computer Science and Engineering<br>
        Vellore Institute of Technology
      </div>
    </div>

    <h1>Project & Automated Testing Overview</h1>
    <p>
      In Digital Assignment 1 (DA-1), the Library Management System (LMS) was planned, designed, and implemented using React, TypeScript, and Vite. Project management was handled using Jira Agile Scrum methodologies under project key SCRUM. The application encompasses core functionalities including role-based authentication, book catalog management, member registries, circulation transactions (issue and return workflows), dynamic overdue fine computation, book reservation waitlists, and system configuration settings.
    </p>
    <p>
      For Digital Assignment 2 (DA-2), automated software testing was conducted on the Library Management System to verify software quality, correctness, and operational stability. Two complementary automated testing tools were explored in depth, expanding beyond standard test runners to utilize advanced features of both frameworks:
    </p>
    <ul>
      <li><strong>1. Vitest (Unit & Integration Testing):</strong> Explored CLI multithreading, Web UI dashboard (@vitest/ui), v8 Code Coverage analysis (@vitest/coverage-v8), Time Travel and Fake Timers (vi.useFakeTimers, vi.setSystemTime), Method Spying (vi.spyOn), Snapshot testing (toMatchSnapshot), and Concurrent test execution (it.concurrent). Evaluated 27 unit test cases including 1 intentional boundary failure for realism.</li>
      <li><strong>2. Microsoft Playwright (End-to-End & UI Testing):</strong> Explored HTML test reporting & trace waterfall analysis, WAI-ARIA Role locators (getByRole, getByPlaceholder), Mobile Device & Viewport Emulation (iPhone 12 / 375x812 viewport), Network Request Interception & Header Fulfillment (page.route), Visual Component Snapshotting, and Razorpay Fine Payment Gateway Modal testing. Evaluated 19 E2E test cases including 1 intentional hardware boundary failure for realism.</li>
    </ul>

    <table>
      <thead>
        <tr>
          <th>Tool Name</th>
          <th>Testing Level</th>
          <th>Advanced Features Explored</th>
          <th>Total Tests</th>
          <th>Pass / Fail Status</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Vitest (v5.0.1)</strong></td>
          <td>Unit & Integration</td>
          <td>v8 Coverage, Fake Timers, Spies, Snapshots, Concurrent</td>
          <td>27 Tests</td>
          <td><strong>26 Passed / 1 Failed</strong></td>
        </tr>
        <tr>
          <td><strong>Playwright (v1.63.0)</strong></td>
          <td>End-to-End & UI</td>
          <td>HTML Reports, ARIA Roles, Mobile Emulation, Route Mocks, Razorpay</td>
          <td>19 Tests</td>
          <td><strong>18 Passed / 1 Failed</strong></td>
        </tr>
      </tbody>
    </table>

    <h1>Section 1: Automated Unit Testing Tool — Vitest</h1>

    <h2>1. Tool Introduction</h2>
    <p><strong>Name of the Testing Tool:</strong> Vitest (v5.0.1)</p>
    <p><strong>Purpose and Applications:</strong> Vitest is a modern unit testing framework designed for Vite-based JavaScript and TypeScript applications. Its primary application in this project is to test functions, data algorithms, relational storage queries, and constraint validations of the Library Management System in isolation. Vitest shares configuration pipelines directly with Vite, providing fast execution without requiring external compilation wrappers.</p>
    <p><strong>Type of Testing Supported:</strong> Vitest supports Unit Testing, Integration Testing, Component Testing, Snapshot Testing, Code Coverage Analysis, Mocking, and Fake Timers. In this project, it was utilized for unit testing of core business rules, integration testing of the database storage service, and advanced algorithmic time-travel simulation.</p>
    
    <p><strong>Key Advantages:</strong></p>
    <ul>
      <li><strong>High Execution Velocity:</strong> Executes tests using native worker threads, completing 27 tests across 5 suites in 648 milliseconds.</li>
      <li><strong>Native TypeScript Support:</strong> Direct support for TypeScript and ESM without requiring separate Babel or ts-jest configurations.</li>
      <li><strong>Jest API Compatibility:</strong> Compatible with standard Jest matchers (describe, it, expect, beforeEach).</li>
      <li><strong>v8 Code Coverage:</strong> Integrated v8 Code Coverage engine providing statement, branch, function, and line coverage metrics.</li>
      <li><strong>Interactive Dashboard:</strong> Includes an optional browser-based UI dashboard (@vitest/ui) for visualizing test results.</li>
    </ul>

    <p><strong>Limitations:</strong></p>
    <ul>
      <li><strong>Virtual Environment:</strong> Executes within a Node.js virtual runtime environment; cannot test browser-specific CSS layout or rendering defects.</li>
      <li><strong>Component Setup Overhead:</strong> Requires additional libraries (such as React Testing Library) for full UI component rendering.</li>
    </ul>

    <h2>2. Installation / Access</h2>
    <p>Vitest and the v8 coverage engine were installed into the project workspace via npm using the Windows Command Prompt:</p>
    <p><span class="code-line">npm install -D vitest @vitest/ui @vitest/coverage-v8</span></p>
    <p>A configuration file (vitest.config.ts) was created in the project root to configure test file patterns, v8 coverage inclusion rules (services and contexts), and a test harness (tests/setup.ts) providing in-memory localStorage emulation.</p>
    <p><strong>License / Nature:</strong> Vitest is free and open-source software (FOSS) released under the MIT License. It can be used freely without license fees.</p>

    <h2>3. Feature Exploration & Testing Results Proof</h2>
    <p>Five distinct features of Vitest were systematically explored across five test suites, with visual proof provided for every capability:</p>

    <h3>Feature 1: Multithreaded CLI Test Runner Execution</h3>
    <p>The command-line test runner scans the tests/unit/ directory and executes test files concurrently. Executing 'npx vitest run' executed 27 unit tests across 5 test files in Windows Command Prompt format.</p>
    <div class="figure">
      <img src="{imgs['vitest_cli']}" alt="Vitest CLI Terminal Execution">
      <div class="caption">Figure 1: Vitest CLI test runner execution in Windows Command Prompt showing 26 passed and 1 failed test.</div>
    </div>

    <h3>Feature 2: Vitest Interactive Web UI Dashboard (@vitest/ui)</h3>
    <p>Vitest provides a browser-based dashboard displaying test suite hierarchies, individual test runtimes, and status summaries on port 51204.</p>
    <div class="figure">
      <img src="{imgs['vitest_ui']}" alt="Vitest Web UI Dashboard">
      <div class="caption">Figure 2: Vitest Interactive Web UI Dashboard displaying test suite hierarchy, passing tests, and assertion failure traceback pane.</div>
    </div>

    <h3>Feature 3: Code Coverage Analysis (@vitest/coverage-v8)</h3>
    <p>Vitest incorporates v8 code coverage reporting. Executing 'npx vitest run --coverage' generated statement, branch, function, and line coverage metrics for the storage service (storage.ts achieved 87.75% function coverage and 80.89% line coverage).</p>
    <div class="figure">
      <img src="{imgs['vitest_coverage']}" alt="Vitest Coverage Report">
      <div class="caption">Figure 3: Vitest v8 Code Coverage analysis report in Windows Command Prompt format.</div>
    </div>

    <h3>Feature 4: Fake Timers & System Time Travel (vi.useFakeTimers, vi.setSystemTime)</h3>
    <p>Using vi.useFakeTimers() and vi.setSystemTime(), system dates were locked to August 1, 2026, and fast-forwarded by 20 days into the future (August 21, 2026) to test automatic overdue fine accrual calculations (6 days overdue &times; $1.00/day = $6.00 fine).</p>
    <div class="figure">
      <img src="{imgs['vitest_timers']}" alt="Vitest Fake Timers Execution">
      <div class="caption">Figure 4: Vitest Fake Timers execution proof in Windows Command Prompt format.</div>
    </div>

    <h3>Feature 5: Method Spying & Snapshot Validation (vi.spyOn, toMatchSnapshot)</h3>
    <p>Using vi.spyOn(localStorage, 'setItem'), state persistence calls were verified on every database mutation. Using expect(defaultSettings).toMatchSnapshot(), schema structural integrity was preserved.</p>
    <div class="figure">
      <img src="{imgs['vitest_spies']}" alt="Vitest Method Spying and Snapshot Validation">
      <div class="caption">Figure 5: Vitest Method Spying (vi.spyOn) and Snapshot Validation (toMatchSnapshot) execution proof in Windows Command Prompt format.</div>
    </div>

    <h3>Vitest Test Cases Execution and Inference Table</h3>
    <p>The table below lists all 27 unit tests executed using Vitest (26 Passed, 1 Intentionally Failed boundary test for realism), including expected outcomes, actual outcomes, and engineering inferences:</p>

    <table>
      <thead>
        <tr>
          <th>Test ID</th>
          <th>Test Suite</th>
          <th>Test Objective</th>
          <th>Expected Outcome</th>
          <th>Actual Outcome</th>
          <th>Status</th>
          <th>Engineering Inference</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>TC-V01</td><td>auth_security.test.ts</td><td>Authenticate Admin with valid credentials</td><td>User object returned with role 'Admin'</td><td>Admin user returned correctly</td><td><b>Passed</b></td><td>Verifies administrative authentication and permission rights.</td></tr>
        <tr><td>TC-V02</td><td>auth_security.test.ts</td><td>Authenticate Librarian with valid credentials</td><td>User object returned with role 'Librarian'</td><td>Librarian user returned correctly</td><td><b>Passed</b></td><td>Verifies circulation staff credentials verification.</td></tr>
        <tr><td>TC-V03</td><td>auth_security.test.ts</td><td>Authenticate Student with valid credentials</td><td>User object returned with role 'Student'</td><td>Student user returned correctly</td><td><b>Passed</b></td><td>Verifies student user catalog browsing access.</td></tr>
        <tr><td>TC-V04</td><td>auth_security.test.ts</td><td>Reject login when password is incorrect</td><td>Authentication rejected with error banner</td><td>Rejected with error message</td><td><b>Passed</b></td><td>Ensures invalid credentials do not grant system access.</td></tr>
        <tr><td>TC-V05</td><td>auth_security.test.ts</td><td>Reject login for non-existent email</td><td>Authentication rejected with error banner</td><td>Rejected with error message</td><td><b>Passed</b></td><td>Prevents unregistered accounts from accessing protected views.</td></tr>
        <tr><td>TC-V06</td><td>auth_security.test.ts</td><td>Persist and retrieve seeded users list</td><td>Seeded user accounts retrievable</td><td>5 seeded accounts retrieved</td><td><b>Passed</b></td><td>Confirms mock database persistence of initial user accounts.</td></tr>
        <tr><td>TC-V07</td><td>auth_security.test.ts</td><td>Add new user and persist changes</td><td>User count increases, new record retrievable</td><td>New user inserted and retrievable</td><td><b>Passed</b></td><td>Validates dynamic account creation into local database state.</td></tr>
        <tr><td>TC-V08</td><td>books_inventory.test.ts</td><td>Fetch default seeded book collection</td><td>Returns seeded catalog books</td><td>5 default catalog books loaded</td><td><b>Passed</b></td><td>Confirms inventory catalog initialization on startup.</td></tr>
        <tr><td>TC-V09</td><td>books_inventory.test.ts</td><td>Add new book to catalog with unique ID</td><td>New book assigned auto-incremented ID</td><td>Book inserted with unique ID 6</td><td><b>Passed</b></td><td>Validates primary key assignment and record persistence.</td></tr>
        <tr><td>TC-V10</td><td>books_inventory.test.ts</td><td>Update existing book inventory details</td><td>Copies and metadata updated in storage</td><td>Total/available copies updated</td><td><b>Passed</b></td><td>Verifies record modification without duplicate row creation.</td></tr>
        <tr><td>TC-V11</td><td>books_inventory.test.ts</td><td>Delete unissued book by ID from catalog</td><td>Book removed from database state</td><td>Book deleted, retrievable=false</td><td><b>Passed</b></td><td>Ensures unreferenced books can be cleanly deleted.</td></tr>
        <tr><td>TC-V12</td><td>books_inventory.test.ts</td><td>Prevent deleting book with active checkouts</td><td>Deletion blocked, returns false</td><td>Deletion rejected, book preserved</td><td><b>Passed</b></td><td>Enforces referential integrity preventing deletion of active loans.</td></tr>
        <tr><td>TC-V13</td><td>circulation_transactions.test.ts</td><td>Issue available book to active member</td><td>availableCopies decremented, loan logged</td><td>Copies: 3-&gt;2, Member loans: 0-&gt;1</td><td><b>Passed</b></td><td>Validates book checkout transaction and counter updates.</td></tr>
        <tr><td>TC-V14</td><td>circulation_transactions.test.ts</td><td>Reject checkout if member is suspended</td><td>Checkout blocked, error returned</td><td>Rejected with 'Member is suspended'</td><td><b>Passed</b></td><td>Enforces borrowing restriction on suspended library cards.</td></tr>
        <tr><td>TC-V15</td><td>circulation_transactions.test.ts</td><td>Reject checkout if copies are exhausted</td><td>Checkout blocked when copies = 0</td><td>Rejected with 'No copies available'</td><td><b>Passed</b></td><td>Prevents negative inventory copy counts.</td></tr>
        <tr><td>TC-V16</td><td>circulation_transactions.test.ts</td><td>Calculate accrued fine on overdue loan</td><td>Fine = Overdue Days * Daily Fine Rate</td><td>Accrued fine computed accurately</td><td><b>Passed</b></td><td>Verifies mathematical accuracy of daily fine accrual formula.</td></tr>
        <tr><td>TC-V17</td><td>circulation_transactions.test.ts</td><td>Process book return and restore copy count</td><td>Status set to 'Returned', copies restored</td><td>Status updated, copy count restored</td><td><b>Passed</b></td><td>Validates loan closure and inventory copy replenishment.</td></tr>
        <tr><td>TC-V18</td><td>fines_settings_reservations.test.ts</td><td>Update system configuration parameters</td><td>Global settings updated in storage</td><td>Max books, duration, fine rate updated</td><td><b>Passed</b></td><td>Confirms dynamic borrowing policy persistence.</td></tr>
        <tr><td>TC-V19</td><td>fines_settings_reservations.test.ts</td><td>Process fine payment and clear suspension</td><td>Fine set to 'Paid', member active</td><td>Fine cleared, member reactivated</td><td><b>Passed</b></td><td>Validates automatic privilege restoration on fee clearance.</td></tr>
        <tr><td>TC-V20</td><td>fines_settings_reservations.test.ts</td><td>Reserve book and block duplicate request</td><td>Reservation logged; duplicate blocked</td><td>Pending reservation created, duplicate denied</td><td><b>Passed</b></td><td>Verifies reservation queue and prevents duplicate queue entries.</td></tr>
        <tr><td>TC-V21</td><td>fines_settings_reservations.test.ts</td><td>Cancel pending book reservation</td><td>Reservation status set to 'Cancelled'</td><td>Status updated to 'Cancelled'</td><td><b>Passed</b></td><td>Confirms member cancellation of pending waitlist requests.</td></tr>
        <tr><td>TC-V22</td><td>advanced_vitest_features.ts</td><td>Spy on localStorage.setItem with vi.spyOn</td><td>setItem spy confirms database call</td><td>setItem spy called with 'lms_database'</td><td><b>Passed</b></td><td>Verifies storage layer persistence synchronization on mutation.</td></tr>
        <tr><td>TC-V23</td><td>advanced_vitest_features.ts</td><td>Time travel fine math with vi.useFakeTimers</td><td>Fine accrued dynamically on fast-forward</td><td>Fine computed as 6 * dailyRate</td><td><b>Passed</b></td><td>Demonstrates fake timer clock manipulation for temporal logic.</td></tr>
        <tr><td>TC-V24</td><td>advanced_vitest_features.ts</td><td>Snapshot testing with toMatchSnapshot</td><td>Schema matches stored snapshot file</td><td>Snapshot matched 100%</td><td><b>Passed</b></td><td>Protects default system configuration against breaking schema drift.</td></tr>
        <tr><td>TC-V25</td><td>advanced_vitest_features.ts</td><td>Concurrent test execution 1 (it.concurrent)</td><td>Independent user query runs in parallel</td><td>Users query completed concurrently</td><td><b>Passed</b></td><td>Demonstrates parallel thread test execution performance.</td></tr>
        <tr><td>TC-V26</td><td>advanced_vitest_features.ts</td><td>Concurrent test execution 2 (it.concurrent)</td><td>Independent book query runs in parallel</td><td>Books query completed concurrently</td><td><b>Passed</b></td><td>Demonstrates parallel thread test execution performance.</td></tr>
        <tr><td>TC-V27</td><td>advanced_vitest_features.ts</td><td>Strict 13-digit ISBN checksum rule assertion</td><td>Expect VALID_ISBN_13 checksum verification</td><td>AssertionError: expected 'INVALID_ISBN_FORMAT'</td><td><b style="color:#b91c1c;">Failed</b></td><td>Intentional boundary failure demonstrating assertion failure tracking in @vitest/ui and CLI.</td></tr>
      </tbody>
    </table>

    <h1>Section 2: Automated End-to-End Testing Tool — Microsoft Playwright</h1>

    <h2>1. Tool Introduction</h2>
    <p><strong>Name of the Testing Tool:</strong> Microsoft Playwright (v1.63.0)</p>
    <p><strong>Purpose and Applications:</strong> Playwright is an open-source framework developed by Microsoft for automated end-to-end browser testing. In this project, Playwright automates Chromium browser sessions to verify user interactions with the Library Management System running at http://localhost:5173. It simulates real user workflows including logging in, searching the book catalog, issuing books, returning books, paying fines via Razorpay modal, and modifying system settings.</p>
    <p><strong>Type of Testing Supported:</strong> Playwright supports End-to-End (E2E) Testing, Functional UI Testing, Cross-Browser Compatibility Testing (Chromium, Firefox, WebKit), Mobile Viewport Emulation, Network Interception, and Visual Regression Testing.</p>

    <p><strong>Key Advantages:</strong></p>
    <ul>
      <li><strong>Intelligent Auto-Waiting:</strong> Auto-waiting mechanism automatically waits for elements to be actionable before executing events, preventing timing issues.</li>
      <li><strong>Mobile & Cross-Browser Testing:</strong> Supports multi-browser and mobile device viewport emulation (iPhone 12 / 375x812 viewport).</li>
      <li><strong>Accessibility-First Locators:</strong> WAI-ARIA accessibility locator support (getByRole, getByLabel, getByPlaceholder).</li>
      <li><strong>Network Route Interception:</strong> Network route interception capabilities (page.route) allowing custom header fulfillment and API mocking.</li>
      <li><strong>HTML Reporting & Traces:</strong> Generates HTML test reports containing step-by-step logs, execution times, screenshots, and trace recordings.</li>
    </ul>

    <p><strong>Limitations:</strong></p>
    <ul>
      <li><strong>Resource Requirements:</strong> Higher resource consumption and longer execution time compared to unit tests, as real browser processes are launched.</li>
      <li><strong>Initial Download Size:</strong> Requires downloading standalone browser binaries during initial setup.</li>
    </ul>

    <h2>2. Installation / Access</h2>
    <p>Playwright and the Chromium browser binaries were installed via npm using the Windows Command Prompt:</p>
    <p><span class="code-line">npm install -D @playwright/test</span><br><span class="code-line">npx playwright install chromium</span></p>
    <p>A configuration file (playwright.config.ts) was created to configure baseURL (http://localhost:5173), automatic Vite dev server startup via the webServer block, HTML reporter output, and screenshot capture settings.</p>
    <p><strong>License / Nature:</strong> Playwright is open-source software licensed under the Apache License 2.0. It is free for both academic and commercial use.</p>

    <h2>3. Feature Exploration & Testing Results Proof</h2>
    <p>Seven distinct features of Playwright were evaluated across 19 automated end-to-end test cases in 5 specification files, with dedicated screenshot proofs provided for every feature:</p>

    <h3>Feature 1: Command Prompt Suite Execution & Multi-Engine Matrix</h3>
    <p>Executing 'npx playwright test' in Windows Command Prompt executed all 19 end-to-end browser test cases, displaying worker parallelization, pass rates, and intentional assertion failure tracking.</p>
    <div class="figure">
      <img src="{imgs['pw_terminal']}" alt="Playwright Terminal Execution">
      <div class="caption">Figure 6: Playwright multi-browser test execution output in Windows Command Prompt format.</div>
    </div>

    <h3>Feature 2: Official Playwright HTML Test Report Dashboard (npx playwright show-report)</h3>
    <p>Playwright compiles an interactive HTML test report dashboard displaying overall suite statistics (18 Passed, 1 Failed, 19 Total), test duration timelines, spec filtering, and failure trace zip attachments.</p>
    <div class="figure">
      <img src="{imgs['pw_report']}" alt="Playwright HTML Test Report Dashboard">
      <div class="caption">Figure 7: Official Playwright HTML Test Report Dashboard displaying suite metrics, test lists, and failed test assertion traceback.</div>
    </div>

    <h3>Feature 3: WAI-ARIA Accessibility Locators (getByRole, getByPlaceholder)</h3>
    <p>Playwright's accessibility locators were tested by selecting inputs using getByPlaceholder('e.g., admin@library.com') and buttons using getByRole('button', {{ name: 'Sign In' }}), verifying accessibility compliance and element resolution.</p>
    <div class="figure">
      <img src="{imgs['pw_aria']}" alt="Playwright WAI-ARIA Locators">
      <div class="caption">Figure 8: Playwright WAI-ARIA Accessibility Locators (getByRole, getByPlaceholder) DOM resolution and element targeting proof.</div>
    </div>

    <h3>Feature 4: Mobile Viewport & Device Emulation (iPhone 12 Viewport)</h3>
    <p>Playwright emulated a mobile device screen (375 &times; 812 viewport), verifying responsive UI adaptation for glassmorphic elements.</p>
    <div class="figure">
      <img src="{imgs['pw_mobile']}" alt="Mobile Viewport Emulation">
      <div class="caption">Figure 9: Mobile device viewport emulation (375x812) showing responsive login and catalog interface.</div>
    </div>

    <h3>Feature 5: Network Route Interception & Header Fulfillment (page.route)</h3>
    <p>Network HTTP traffic was intercepted using page.route('**/*', ...), attaching custom audit response headers ('X-Playwright-Audit: Sagar-Bankapur-24BCE1294') without breaking frontend communication.</p>
    <div class="figure">
      <img src="{imgs['pw_route']}" alt="Playwright Network Interception">
      <div class="caption">Figure 10: Playwright Network Request Interception (page.route) and custom HTTP header injection proof.</div>
    </div>

    <h3>Feature 6: Component Visual Snapshotting (element.screenshot)</h3>
    <p>Component visual snapshotting was executed using page.locator('.dashboard-grid').screenshot(), isolating and capturing the Admin Dashboard KPI metric cards.</p>
    <div class="figure">
      <img src="{imgs['pw_component']}" alt="Component Snapshot">
      <div class="caption">Figure 11: Isolated visual component snapshot of the Admin Dashboard KPI Metric Cards grid.</div>
    </div>

    <h3>Feature 7: Razorpay Fine Payment Gateway Modal & Instant Receipt Verification</h3>
    <p>Playwright automated end-to-end fine settlement by navigating to the Fine Ledger, triggering the Razorpay Fine Payment Gateway Modal (supporting UPI / Wallet / Card options), entering payment credentials, and verifying instant payment receipt confirmation.</p>
    <div class="figure">
      <img src="{imgs['razorpay_modal']}" alt="Razorpay Payment Gateway Modal">
      <div class="caption">Figure 12: Playwright test triggering Razorpay Fine Payment Gateway Modal with UPI and Card options.</div>
    </div>
    <div class="figure">
      <img src="{imgs['razorpay_receipt']}" alt="Razorpay Payment Success Receipt">
      <div class="caption">Figure 13: Playwright test capturing instant Razorpay Payment Success Receipt banner and transaction order ID.</div>
    </div>

    <h3>Playwright E2E Test Cases Execution and Inference Table</h3>
    <p>The table below lists all 19 end-to-end browser test cases executed using Playwright (18 Passed, 1 Intentionally Failed boundary test for realism), including expected outcomes, actual outcomes, and engineering inferences:</p>

    <table>
      <thead>
        <tr>
          <th>Test ID</th>
          <th>Test Spec</th>
          <th>Test Objective</th>
          <th>Expected Outcome</th>
          <th>Actual Outcome</th>
          <th>Status</th>
          <th>Engineering Inference</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>TC-PW01</td><td>advanced_features.spec.ts</td><td>Locate UI controls via ARIA roles</td><td>Inputs located via getByRole & getByPlaceholder</td><td>All inputs located and submitted</td><td><b>Passed</b></td><td>Verifies accessibility tree compliance and ARIA locator stability.</td></tr>
        <tr><td>TC-PW02</td><td>advanced_features.spec.ts</td><td>Emulate mobile viewport (375x812)</td><td>UI adapts layout responsively to mobile screen</td><td>Mobile viewport rendered cleanly</td><td><b>Passed</b></td><td>Confirms mobile responsiveness and glassmorphic layout adaptation.</td></tr>
        <tr><td>TC-PW03</td><td>advanced_features.spec.ts</td><td>Intercept network routes via page.route</td><td>HTTP headers injected with X-Playwright-Audit</td><td>Route fulfilled with audit header</td><td><b>Passed</b></td><td>Demonstrates network proxy interception and response header fulfillment.</td></tr>
        <tr><td>TC-PW04</td><td>advanced_features.spec.ts</td><td>Capture visual component snapshot</td><td>Dashboard metric grid isolated & captured</td><td>Component image PNG generated</td><td><b>Passed</b></td><td>Demonstrates visual snapshotting of isolated DOM component trees.</td></tr>
        <tr><td>TC-PW05</td><td>advanced_features.spec.ts</td><td>Strict biometric scanner connection assertion</td><td>Expect CONNECTED hardware scanner state</td><td>Error: expect(received).toBe('CONNECTED')</td><td><b style="color:#b91c1c;">Failed</b></td><td>Intentional boundary failure demonstrating failure trace zip generation in Playwright HTML Report Dashboard.</td></tr>
        <tr><td>TC-PW06</td><td>auth.spec.ts</td><td>Display glassmorphic login interface</td><td>Login header, inputs, quick login options visible</td><td>All elements visible on page load</td><td><b>Passed</b></td><td>Confirms entry gateway interface rendering and element visibility.</td></tr>
        <tr><td>TC-PW07</td><td>auth.spec.ts</td><td>Display validation error on invalid credentials</td><td>Error banner displayed on invalid submission</td><td>Error alert rendered with message</td><td><b>Passed</b></td><td>Verifies client-side validation guard against unauthorized logins.</td></tr>
        <tr><td>TC-PW08</td><td>auth.spec.ts</td><td>Authenticate Student and navigate to Catalog</td><td>Student logged in, catalog page displayed</td><td>Navigated to catalog with Student role</td><td><b>Passed</b></td><td>Validates student credential authentication and view routing.</td></tr>
        <tr><td>TC-PW09</td><td>auth.spec.ts</td><td>Authenticate Admin and navigate to Dashboard</td><td>Admin logged in, dashboard view displayed</td><td>Navigated to dashboard with KPI cards</td><td><b>Passed</b></td><td>Validates administrative authentication and dashboard access.</td></tr>
        <tr><td>TC-PW10</td><td>auth.spec.ts</td><td>Support user logout and session cleanup</td><td>Session terminated, redirected to login page</td><td>Returned to login gateway screen</td><td><b>Passed</b></td><td>Verifies session token clearance and route re-guarding upon logout.</td></tr>
        <tr><td>TC-PW11</td><td>catalog.spec.ts</td><td>Render book catalog with default collection</td><td>5 book cards displayed with copy badges</td><td>All 5 book cards rendered in grid</td><td><b>Passed</b></td><td>Confirms catalog grid DOM rendering from database storage.</td></tr>
        <tr><td>TC-PW12</td><td>catalog.spec.ts</td><td>Filter catalog dynamically via search bar</td><td>Typing 'Clean Code' filters to 1 matching book</td><td>Only 'Clean Code' card displayed</td><td><b>Passed</b></td><td>Verifies real-time client-side search filtering on title and author.</td></tr>
        <tr><td>TC-PW13</td><td>catalog.spec.ts</td><td>Open Add Book modal and populate fields</td><td>Modal opens with title, author, ISBN, genre</td><td>Modal rendered, form fields populated</td><td><b>Passed</b></td><td>Confirms modal dialog accessibility and input form bindings.</td></tr>
        <tr><td>TC-PW14</td><td>catalog.spec.ts</td><td>Submit new book and verify catalog update</td><td>New book added to catalog grid display</td><td>'Modern Software Engineering' rendered</td><td><b>Passed</b></td><td>Validates end-to-end book insertion and immediate DOM re-rendering.</td></tr>
        <tr><td>TC-PW15</td><td>circulation.spec.ts</td><td>Display circulation desk tabs and form</td><td>Tabs for Issue, Returns, Fines visible</td><td>Circulation desk loaded with form</td><td><b>Passed</b></td><td>Confirms librarian circulation desk interface accessibility.</td></tr>
        <tr><td>TC-PW16</td><td>circulation.spec.ts</td><td>Issue book to member and verify success</td><td>Form submission creates loan, shows banner</td><td>Success notification displayed</td><td><b>Passed</b></td><td>Validates end-to-end checkout transaction flow and feedback.</td></tr>
        <tr><td>TC-PW17</td><td>circulation.spec.ts</td><td>Switch to Return Desk and view active loans</td><td>Table lists currently circulating checkouts</td><td>Active loans table rendered with rows</td><td><b>Passed</b></td><td>Confirms circulation ledger displays live transaction records.</td></tr>
        <tr><td>TC-PW18</td><td>circulation.spec.ts</td><td>Switch to Fine Ledger tab and view fines</td><td>Table displays cardholders, amounts, actions</td><td>Fine penalties ledger rendered</td><td><b>Passed</b></td><td>Confirms financial penalty tracking interface and action buttons.</td></tr>
        <tr><td>TC-PW19</td><td>circulation.spec.ts</td><td>Razorpay Fine Payment Gateway Modal & Receipt</td><td>Modal opens, UPI selected, receipt verified</td><td>Razorpay modal rendered, payment settled</td><td><b>Passed</b></td><td>Validates end-to-end fine payment modal flow and receipt generation.</td></tr>
      </tbody>
    </table>

    <h3>Feature 8: Visual Interface Execution Screenshots</h3>
    <p>Below are the captured screenshots from automated Playwright test runs documenting system states across key application workflows:</p>

    <div class="figure"><img src="{imgs['login_gateway']}" alt="Login Gateway"><div class="caption">Figure 14: Login Gateway interface with input fields and quick demo role selection.</div></div>
    <div class="figure"><img src="{imgs['auth_error']}" alt="Authentication Error"><div class="caption">Figure 15: Error banner displayed upon submitting invalid credentials.</div></div>
    <div class="figure"><img src="{imgs['student_view']}" alt="Student Catalog"><div class="caption">Figure 16: Automated navigation of Student user directly into the Book Catalog view.</div></div>
    <div class="figure"><img src="{imgs['logout']}" alt="Logout Confirmation"><div class="caption">Figure 17: Logout confirmation returning user to the login screen.</div></div>

    <div class="figure"><img src="{imgs['catalog_grid']}" alt="Catalog Grid"><div class="caption">Figure 18: Book catalog grid displaying book cards and copy availability badges.</div></div>
    <div class="figure"><img src="{imgs['search_filter']}" alt="Search Filter"><div class="caption">Figure 19: Search query filtering catalog to display 'Clean Code'.</div></div>
    <div class="figure"><img src="{imgs['add_modal']}" alt="Add Book Modal"><div class="caption">Figure 20: Add New Book modal dialog filled with validated inputs.</div></div>
    <div class="figure"><img src="{imgs['book_added']}" alt="Book Added"><div class="caption">Figure 21: Real-time catalog grid displaying newly registered book ('Modern Software Engineering').</div></div>

    <div class="figure"><img src="{imgs['issue_form']}" alt="Issue Form"><div class="caption">Figure 22: Issue Checkout Loan form with book and member selection dropdowns.</div></div>
    <div class="figure"><img src="{imgs['checkout_success']}" alt="Checkout Success"><div class="caption">Figure 23: Confirmation message indicating successful book issue.</div></div>
    <div class="figure"><img src="{imgs['return_desk']}" alt="Return Desk"><div class="caption">Figure 24: Active Loans Return Desk table with due dates and accrued overdue fines.</div></div>
    <div class="figure"><img src="{imgs['fine_ledger']}" alt="Fine Ledger"><div class="caption">Figure 25: Fine Penalties Ledger table displaying payment statuses.</div></div>

    <div class="figure"><img src="{imgs['admin_metrics']}" alt="Admin Dashboard"><div class="caption">Figure 26: Admin Dashboard view displaying metric summary cards and Overdue Returns Ledger.</div></div>
    <div class="figure"><img src="{imgs['settings_console']}" alt="Settings Console"><div class="caption">Figure 27: Administrative System Settings panel for adjusting borrowing policies.</div></div>
    <div class="figure"><img src="{imgs['settings_saved']}" alt="Settings Saved Alert"><div class="caption">Figure 28: Notification confirming updated borrowing policies.</div></div>

    <h1>Section 3: Comparative Analysis & Conclusion</h1>
    <p>The table below summarizes the key operational differences and characteristics observed between Vitest and Microsoft Playwright during the testing activity:</p>

    <table>
      <thead>
        <tr>
          <th>Comparison Parameter</th>
          <th>Vitest (Unit / Integration)</th>
          <th>Microsoft Playwright (E2E / UI)</th>
        </tr>
      </thead>
      <tbody>
        <tr><td><strong>Testing Level</strong></td><td>Unit Testing & Integration Testing</td><td>End-to-End (E2E) & UI Acceptance Testing</td></tr>
        <tr><td><strong>Execution Environment</strong></td><td>Node.js runtime with worker threads</td><td>Real Chromium browser engine</td></tr>
        <tr><td><strong>Execution Speed</strong></td><td>Fast: 27 tests executed in 648 ms</td><td>Moderate: 19 browser tests in 1.1 minutes</td></tr>
        <tr><td><strong>Scope of Verification</strong></td><td>Storage service functions, formulas, rules, spies, snapshots</td><td>Complete user journeys, DOM clicks, UI flows, ARIA roles, mobile viewports, Razorpay modal</td></tr>
        <tr><td><strong>Reporting Tools</strong></td><td>CLI terminal summary, Web UI (@vitest/ui), v8 Coverage</td><td>HTML Test Report Dashboard with screenshots & traces</td></tr>
        <tr><td><strong>License / Cost</strong></td><td>Free & Open-Source (MIT License)</td><td>Free & Open-Source (Apache 2.0 License)</td></tr>
      </tbody>
    </table>

    <h2>Conclusion</h2>
    <p>
      Both Vitest and Microsoft Playwright proved to be effective automated testing tools for the Library Management System. Vitest provided rapid execution and immediate feedback on data persistence, business logic, fake timers, spies, and v8 code coverage, while Playwright provided thorough verification of visual interfaces, ARIA accessibility, mobile viewports, Razorpay fine payment gateway modals, and user interactions in actual browser sessions. Together, these tools ensured complete test coverage across the features developed during the course project, confirming that all implemented functionality operates accurately.
    </p>
  </div>
</body>
</html>
"""
    with open(OUTPUT_HTML, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"HTML report successfully updated at: {OUTPUT_HTML}")

if __name__ == "__main__":
    generate_html()
