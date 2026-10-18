# Technology Stack Document
## Project: Library Management System

This document outlines the selected technology stack and system architecture for the Library Management System project.

---

### 1. Technology Selection

| Layer | Technology | Selection Rationale |
| :--- | :--- | :--- |
| **Frontend Framework** | React (TypeScript) | High performance component-based architecture, robust state management, and type safety for reliable application development. |
| **Build System / Bundler**| Vite | Sub-second Hot Module Replacement (HMR) and fast build times compared to legacy bundlers like Webpack. |
| **Styling** | Vanilla CSS (Modern CSS Variables) | Full control over styling, custom glassmorphism components, tailored transitions, and responsive layout designs without bloated frameworks. |
| **Data Persistence** | HTML5 LocalStorage & Mock Service Layer | Ensures a fully functional, self-contained demonstration app. All state modifications (catalog additions, issues, returns, fine tracking) are persisted locally without requiring a complex backend setup during early stages. |

---

### 2. Project Architecture & Directory Structure

The application is structured following modern frontend best practices:

```
library/
├── docs/                      # Planning and Design documentation
│   ├── WBS.md                 # Work Breakdown Structure
│   ├── SRS.md                 # Software Requirements Specification
│   ├── Database_Design.md     # Relational Database details & ER Diagram
│   └── Tech_Stack.md          # Technology Stack overview (This file)
├── public/                    # Static assets
└── src/
    ├── assets/                # Images, icons, and logo assets
    ├── components/            # Reusable UI elements (Buttons, Inputs, Cards)
    │   ├── Navbar.tsx
    │   ├── Sidebar.tsx
    │   └── MetricCard.tsx
    ├── context/               # Global state contexts (Auth context, Library Store)
    │   ├── AuthContext.tsx
    │   └── LibraryContext.tsx
    ├── pages/                 # Full view layouts
    │   ├── Dashboard.tsx      # Main statistics & analytics page
    │   ├── Books.tsx          # Book catalog CRUD & Search interface
    │   ├── Members.tsx        # Member profiles & management
    │   ├── Issues.tsx         # Book checkout/check-in logs
    │   └── Login.tsx          # Credentials-based access gateway
    ├── services/              # Local storage data persistence services
    │   └── storage.ts         # Database initializer & access queries
    ├── styles/                # Modular stylesheet definitions
    │   ├── index.css          # Global layout, resets, and HSL variables
    │   └── theme.css          # Design system classes (glassmorphism, colors)
    ├── App.tsx                # Page controller & Route navigator
    └── main.tsx               # Entry point
```

---

### 3. Application State Design

To simulate a real SQL database environment, the system utilizes a **Storage Service Layer (`storage.ts`)** that manages five relational entities inside LocalStorage:

```
+------------------+         +------------------+
|      users       |         |     members      |
|------------------|         |------------------|
| id               |<--------| user_id          |
| email            |         | card_number      |
| role             |         | status           |
+------------------+         +------------------+
                                      |
                                      | 1 to Many
                                      v
+------------------+         +------------------+         +------------------+
|      books       | 1 to M  |   transactions   | 1 to 1  |      fines       |
|------------------|-------->|------------------|-------->|------------------|
| id               |         | id               |         | id               |
| title            |         | book_id          |         | transaction_id   |
| available_copies |         | member_id        |         | fine_amount      |
+------------------+         | issue_date       |         | payment_status   |
                             | status           |         +------------------+
                             +------------------+
```

Upon first launch, the storage layer automatically seeds the system with mock data (e.g. 5 standard books, 3 members, and pre-configured logins) so the dashboard displays mock metrics immediately.
