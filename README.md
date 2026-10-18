# Library Management System (LMS)
## Academic Project | 5th Semester

A modern, responsive web application for managing library inventory, book checkouts, returns, membership states, and dynamic overdue fee calculations.

---

## 📂 Project Planning & Design Artifacts

The system's planning, requirement specifications, design models, and architecture details are documented in the `/docs` folder:

*   **[Work Breakdown Structure (WBS)](./docs/WBS.md)**: Hierarchical project task breakdown with a visual Mermaid mindmap.
*   **[Software Requirements Specification (SRS)](./docs/SRS.md)**: Detailed functional requirements, non-functional requirements, and a Mermaid Use Case diagram.
*   **[Database Schema & ER Model](./docs/Database_Design.md)**: relational structures, normalization guidelines, and a Mermaid Entity-Relationship diagram.
*   **[Technology Stack & Architecture](./docs/Tech_Stack.md)**: Details on framework selection, directory layout, and relational data simulation in local storage.

---

## 🛠️ Tech Stack & Tooling

*   **Frontend**: React (TypeScript), Vite, Custom Vanilla CSS
*   **Routing & Controller**: React Context + Custom App State Router
*   **State & DB Simulation**: LocalStorage-backed SQL-relational storage service

---

## 🚀 Running the App Locally

To start the local development server:

1.  Clone/open the workspace:
    ```bash
    cd "d:/5th sem/library"
    ```
2.  Install dependencies (if not already done):
    ```bash
    npm install
    ```
3.  Launch the dev server:
    ```bash
    npm run dev
    ```
4.  Open the browser at the address displayed in the console (usually `http://localhost:5173`).
