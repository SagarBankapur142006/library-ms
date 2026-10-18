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

| WBS Code | Element Name | Description / Deliverable |
| :--- | :--- | :--- |
| **1.0** | **Project Planning & Setup** | Initial project kickoff, environment bootstrapping, and project tracking configuration. |
| 1.1 | Initialize Repository & Folder Structure | Create git repository, define workspace folders, and establish coding conventions. |
| 1.2 | Establish Dev Environment & CI/CD | Configure bundlers, compiler setups (TypeScript), and initial deployment pipelines. |
| 1.3 | Setup Jira Board & Agile Sprints | Configure Jira backlog, create epics, and set up Sprint 1 board. |
| **2.0** | **Requirement Analysis** | Detailed analysis of what the library system needs to accomplish. |
| 2.1 | Draft SRS Document | Compile Functional and Non-Functional requirements in a formal document. |
| 2.2 | Define Use Case Models | Identify user personas (Librarian, Student, Admin) and map their interactions. |
| 2.3 | Map Agile User Stories | Draft specific, actionable user stories with acceptance criteria and estimate story points. |
| **3.0** | **System Design** | Architecture planning, database relational models, and front-end interface mockups. |
| 3.1 | Design ER Diagram | Model entity relationships, primary/foreign keys, and relational cardinality. |
| 3.2 | Define Normalized Database Schema | Translate ER diagram into SQL tables / MongoDB schemas with detailed field types. |
| 3.3 | Create UI Wireframes & Mockups | Design interactive low-fidelity layouts for pages (Login, Dashboard, Catalog). |
| **4.0** | **User Authentication** | Identity management, secure password storage, and access tokens. |
| 4.1 | Secure Admin & Librarian Sign-In | Login interface and backend verification for administrative roles. |
| 4.2 | Student/Member Portal Access | Login interface and profile views for library members. |
| 4.3 | Implement Form Validations | Client and server-side validation for input safety. |
| 4.4 | Setup JWT & Role-Based Access Control | Secure routes, token expiration, and permission checks. |
| **5.0** | **Book Management** | Catalog management system for librarians to track book titles. |
| 5.1 | Create Book Entry Form | Add new books to catalog (ISBN, title, author, genre, total copies, etc.). |
| 5.2 | Edit & Update Book Details | Modify details of existing book records. |
| 5.3 | Remove Books from Inventory | Delete or soft-delete books that are no longer in circulation. |
| 5.4 | Implement Search & Filters | Search engine/filters for catalog by genre, author, title, availability. |
| **6.0** | **Member Management** | Registry of library cardholders, contact details, and account standings. |
| 6.1 | Register New Members | Form to enroll students/public members. |
| 6.2 | View & Edit Member Profiles | Management views for personal details and current borrowings. |
| 6.3 | Assign Library Cards | Generate unique IDs/card sequences. |
| 6.4 | Suspend/Deactivate Accounts | Change statuses for overdue books, unpaid fines, or lost cards. |
| **7.0** | **Book Issue & Return** | The core transaction log of checked out and checked in physical items. |
| 7.1 | Implement Book Checkout | Transaction builder allocating a book copy to a member with an issue timestamp. |
| 7.2 | Implement Book Check-in | Return handler updating book availability and calculating days elapsed. |
| 7.3 | Due Date Tracking | Compute due dates automatically based on borrower class policies. |
| 7.4 | Fine Accrual & Fee Calculation | Compute outstanding fines dynamically for overdue returns (e.g. $1/day). |
| **8.0** | **Reports & Dashboard** | Aggregated data visualization and administrative ledgers. |
| 8.1 | Loans Summary Report | Detailed tables showing active borrow transactions. |
| 8.2 | Overdue Penalties Ledger | Tracking who owes what fine amounts and outstanding tickets. |
| 8.3 | Inventory Status & Stock Alerts | Overview of physical copies vs. issued copies, identifying lost books. |
| 8.4 | Dashboard Analytics Widgets | High-level widgets for total members, active issues, total books, and charts. |
| **9.0** | **Verification & Testing** | Testing quality gates to guarantee robust operation. |
| 9.1 | Unit Testing | Verify individual utility methods (e.g., date calculations, validation, token helper). |
| 9.2 | Integration Testing | End-to-end API testing from client UI actions to database state modifications. |
| 9.3 | Bug Fixing & UAT | Resolve QA tickets and verify acceptance criteria before sign-off. |
