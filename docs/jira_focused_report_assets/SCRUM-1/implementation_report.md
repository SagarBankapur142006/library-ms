# Library Management System (LMS) - Implementation Report

This report outlines the technical implementation of the Library Management System (LMS) developed for the 5th Semester Academic Project. The system is fully bootstrapped with a modern, glassmorphic, React + TypeScript + LocalStorage-relational simulation architecture.

---

## 🏗️ Architecture & Core Modules

The implementation strictly follows the system planning specifications:

1. **Storage Service Layer (`src/services/storage.ts`)**:
   - Manages five relational entities: `users`, `members`, `books`, `transactions`, and `fines`.
   - Incorporates normalization principles (3NF) and relational constraints (e.g. available copy control, maximum loan threshold checks, and auto-suspension triggers on unpaid fines).
   - Dynamically calculates outstanding overdue fine rates ($1.00/day) on active loans.

2. **Authentication Context (`src/context/AuthContext.tsx`)**:
   - Manages active user sessions with automatic caching to `localStorage`.
   - Protects administrative routes and adjusts layout properties dynamically according to active roles.

3. **Library Database State Context (`src/context/LibraryContext.tsx`)**:
   - Acts as the operational controller that coordinates updates, transactions, registry states, and fine payments.

4. **Vibrant Glassmorphic UI & Layout (`src/index.css` & `src/App.css`)**:
   - Leverages an Outfit-based typographic design system.
   - Customized dark theme featuring smooth glowing borders, glass card scaling transitions, badges, and status tables.

---

## 📷 Verification Screenshots

The application was run and verified successfully under the development server at `http://localhost:5173/`. Below are the active verification screenshots:

### 1. Overview Dashboard
Shows high-level metrics for Administrators/Librarians, overdue loans return desk ledger, and catalog inventory gauges.

![LMS Admin Dashboard](file:///d:/5th%20sem/library/docs/main_dashboard_1785261292483.png)

### 2. Book Catalog
Provides search, filtering by genre and availability, and full CRUD operations (add/edit/delete buttons are visible based on roles).

![LMS Book Catalog](file:///d:/5th%20sem/library/docs/book_catalog_1785261304299.png)

---

## 🚀 How to Run Locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
3. Use the **Quick Demo Logins** on the sign-in page to test roles instantly:
   - **Chief Administrator** (`admin@library.com` / `admin123`)
   - **Sarah Jenkins (Librarian)** (`librarian@library.com` / `lib123`)
   - **John Doe (Student)** (`student1@library.com` / `student123`)
