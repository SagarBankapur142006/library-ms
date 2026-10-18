# Work Breakdown Structure (WBS)
## Library Management System

This document outlines the Work Breakdown Structure (WBS) for the Library Management System project. The WBS is organized hierarchically, breaking down the project into manageable phases, modules, and specific tasks.

---

### WBS Visual Diagram (Mindmap)

```mermaid
mindmap
  root((Library Management System))
    1 Project Planning & Setup
      1.1 Initialize Repository & Folder Structure
      1.2 Establish Dev Environment & CI/CD
      1.3 Setup Jira Board & Agile Sprints
    2 Requirement Analysis
      2.1 Draft Software Requirements Specification (SRS)
      2.2 Define Use Case Models
      2.3 Map Agile User Stories & Story Points
    3 System Design
      3.1 Design Entity Relationship (ER) Diagram
      3.2 Define Normalized Database Schema
      3.3 Create UI Wireframes & Mockups
    4 User Authentication
      4.1 Secure Admin & Librarian Sign-In
      4.2 Student/Member Portal Access
      4.3 Implement Form Validations
      4.4 Setup JWT & Role-Based Access Control
    5 Book Management
      5.1 Create Book Entry Form (Librarian)
      5.2 Edit & Update Book Details
      5.3 Remove Books from Inventory
      5.4 Implement Elastic Search/Filter by Title, Author, ISBN
    6 Member Management
      6.1 Register New Members
      6.2 View & Edit Member Profiles
      6.3 Assign Library Cards & Statuses
      6.4 Suspend/Deactivate Member Accounts
    7 Book Issue & Return
      7.1 Implement Book Checkout (Issue Flow)
      7.2 Implement Book Check-in (Return Flow)
      7.3 Due Date Tracking & Reminders
      7.4 Dynamic Fine Accrual & Fee Calculation
    8 Reports & Dashboard
      8.1 Active & Historic Loans Summary
      8.2 Overdue Penalties Ledger
      8.3 Inventory Status & Stock Alerts
      8.4 Admin Dashboard Analytics Widgets
    9 Verification & Testing
      9.1 Unit Testing (API & UI Components)
      9.2 Integration & End-to-End Testing
      9.3 Bug Fixing & User Acceptance Testing (UAT)
```

---

### Detailed WBS Hierarchy

| WBS Code | Element Name | Description / Deliverable | Jira Key | Start Date | End Date | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **1.0** | **Project Planning & Setup** | Initial project setup, environment bootstrap, and sprint planning. | **LMS-SETUP** | 2026-06-15 | 2026-06-25 | Completed |
| 1.1 | Initialize Repository & Folder Structure | Create git repository, define workspace folders, and establish code structure. | LMS-SETUP-1 | 2026-06-15 | 2026-06-18 | Completed |
| 1.2 | Establish Dev Environment & CI/CD | Configure bundlers, compiler setups (TypeScript), and linting tools. | LMS-SETUP-2 | 2026-06-19 | 2026-06-22 | Completed |
| 1.3 | Setup Jira Board & Agile Sprints | Configure Jira backlog, create epics, and set up Sprint 1 boards. | LMS-SETUP-3 | 2026-06-23 | 2026-06-25 | Completed |
| **2.0** | **Requirement Analysis** | Detailed analysis of library operations and business rules. | **LMS-DESIGN** | 2026-06-26 | 2026-07-05 | In Progress |
| 2.1 | Draft SRS Document | Compile Functional and Non-Functional requirements in a formal document. | LMS-DESIGN-1 | 2026-06-26 | 2026-06-30 | In Progress |
| 2.2 | Define Use Case Models | Identify user personas (Librarian, Student, Admin) and map their interactions. | LMS-DESIGN-2 | 2026-07-01 | 2026-07-05 | In Progress |
| **3.0** | **System Design** | Architecture planning, database relational models, and page wireframe drawings. | **LMS-DESIGN** | 2026-07-06 | 2026-07-15 | In Progress |
| 3.1 | Design ER Diagram | Model entity relationships, primary/foreign keys, and relational cardinality. | LMS-DESIGN-3 | 2026-07-06 | 2026-07-10 | In Progress |
| 3.2 | Define Normalized Database Schema | Translate ER diagram into SQL tables with detailed field constraints. | LMS-DESIGN-4 | 2026-07-11 | 2026-07-15 | In Progress |
| **4.0** | **User Authentication** | Identity management, secure password storage, and access session context. | **LMS-AUTH** | 2026-07-16 | 2026-07-25 | In Progress |
| 4.1 | Secure Admin & Librarian Sign-In | Login interface and backend credentials verification for admin roles. | LMS-AUTH-1 | 2026-07-16 | 2026-07-20 | In Progress |
| 4.2 | Student/Member Portal Access | Login interface and personalized credentials for members. | LMS-AUTH-2 | 2026-07-21 | 2026-07-22 | In Progress |
| 4.3 | Setup Global Context & Auth Guards | Secure routes, AuthContext sessions, and Role-Based Access Control (RBAC). | LMS-AUTH-3 | 2026-07-23 | 2026-07-25 | In Progress |
| **5.0** | **Book Management** | Catalog management system for librarians to track book inventories. | **LMS-BOOK** | 2026-07-26 | 2026-08-04 | In Progress |
| 5.1 | Create Book Entry Form | Add new books to catalog (ISBN, title, author, copies, genre, etc.). | LMS-BOOK-1 | 2026-07-26 | 2026-07-31 | In Progress |
| 5.2 | Catalog Search & Filters | Search engine and filters by genre, title, author, and availability status. | LMS-BOOK-2 | 2026-08-01 | 2026-08-04 | In Progress |
| **6.0** | **Member Management** | Registry of library cardholders, contact details, and account standings. | **LMS-MEM** | 2026-08-05 | 2026-08-12 | In Progress |
| 6.1 | Register New Members | Enrollment forms to register students and assign unique card sequences. | LMS-MEM-1 | 2026-08-05 | 2026-08-08 | In Progress |
| 6.2 | View & Edit Member Profiles | Profiles inspector containing current loans and membership standings. | LMS-MEM-2 | 2026-08-09 | 2026-08-10 | In Progress |
| 6.3 | Account Status Handler | Rules to suspend or reactivate accounts based on overdue fees. | LMS-MEM-3 | 2026-08-11 | 2026-08-12 | In Progress |
| **7.0** | **Book Issue & Return** | The transaction log of checked out and returned items. | **LMS-TX** | 2026-08-13 | 2026-08-22 | In Progress |
| 7.1 | Implement Book Checkout | Allocate book copies, decrement available counts, and enforce limits. | LMS-TX-1 | 2026-08-13 | 2026-08-17 | In Progress |
| 7.2 | Implement Book Check-in | Mark book returned, increment available copies, and check overdue limits. | LMS-TX-2 | 2026-08-18 | 2026-08-20 | In Progress |
| 7.3 | Fine Accrual & Penalties Logic | Automatically calculate dynamic daily fees for overdue checkout items. | LMS-TX-3 | 2026-08-21 | 2026-08-22 | In Progress |
| **8.0** | **Reports & Dashboard** | Aggregated charts, overdue penalties ledgers, and configurations. | **LMS-ADV** | 2026-08-23 | 2026-08-27 | In Progress |
| 8.1 | Admin Borrowing Policy Settings | Configure dynamic checkout counts and fine limits (Settings.tsx). | LMS-ADV-1 | 2026-08-23 | 2026-08-24 | In Progress |
| 8.2 | Book Reservation Queue | Waitlist systems for checking out out-of-stock items (MyLoans, Books). | LMS-ADV-2 | 2026-08-24 | 2026-08-26 | In Progress |
| 8.3 | Dashboard Metrics & Fine logs | Dashboards displaying analytics, waitlists, and fine settlement logs. | LMS-ADV-3 | 2026-08-26 | 2026-08-27 | In Progress |
| **9.0** | **Verification & Testing** | Testing quality gates to guarantee robust operation and delivery. | **LMS-TEST** | 2026-08-28 | 2026-08-30 | In Progress |
| 9.1 | TypeScript & Build Compliance | Type check matching, build verifications, and directory cleaning. | LMS-TEST-1 | 2026-08-28 | 2026-08-29 | In Progress |
| 9.2 | End-to-End Delivery & Jira Sync | Code archiving, artifact uploads, and task completion approvals. | LMS-TEST-2 | 2026-08-30 | 2026-08-30 | In Progress |
