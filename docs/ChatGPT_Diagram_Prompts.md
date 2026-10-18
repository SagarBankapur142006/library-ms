# ChatGPT Prompts for Project Management Diagrams
## Library Management System (LMS)

Use the following highly structured prompts with **ChatGPT** (GPT-4 / GPT-4o / GPT-3.5) or any visual AI diagramming tool (like Eraser.io, Mermaid Live Editor, or PlantUML) to generate professional diagram assets for your project documentation.

---

## 🎟️ Prompt 1: Use Case Diagram
**Instructions**: Copy and paste the prompt below into ChatGPT. You can also specify *"Generate this as a PlantUML format"* or ask ChatGPT to render it directly.

```text
Please generate a professional, high-fidelity UML Use Case Diagram for a web-based Library Management System (LMS). 

Use PlantUML notation (fenced inside a code block) so I can copy-paste it.
The diagram must model the following Actors and Use Cases:

Actors:
1. Student / Member (General viewer role)
2. Librarian (Staff / Operations role)
3. Admin (Full system configuration role)

Use Case Groups:
- Group 1: Authentication (Login, Validate Roles)
- Group 2: Catalog Operations (Search Books, Filter Availability, Reserve Unavailable Book)
- Group 3: Librarian Operations (Register Member, Issue Book, Return Book, Charge Overdue Fines)
- Group 4: Administrative Settings (Modify Max Borrow Limits, Adjust Overdue Fine Rate, Configure Suspension Thresholds, View Analytical Reports)

Relationships:
- Student has access to Authentication and Catalog Operations (Search, Filter, Reserve).
- Librarian inherits basic Catalog operations, and possesses Librarian Operations (Register, Issue, Return, Fines).
- Admin has full access to Administrative Settings and can Deactivate/Suspend Members.
- "Issue Book" has an <<include>> relationship pointing to "Check Member Status" and "Verify Copy Stock".
- "Return Book" has an <<extend>> relationship pointing to "Calculate & Charge Overdue Fine" (triggered only if book returned past due date).

Please apply a clean design style using a professional color scheme (such as Navy Blue elements, clean thin lines, and clear subsystem boundaries labeled "Library Management System").
```

---

## 📊 Prompt 2: Entity-Relationship (ER) Diagram
**Instructions**: Paste this into ChatGPT to get a database layout schema suitable for database designers.

```text
Please generate a detailed Entity-Relationship Diagram (ERD) in PlantUML (or Mermaid syntax) representing a normalized (3NF) relational database schema for our Library Management System (LMS).

Define these 5 Core Entities with their Primary Keys (PK), Foreign Keys (FK), and attribute data types:

1. USERS:
   - id (INT, PK, Auto-Increment)
   - email (VARCHAR, Unique, Not Null)
   - password_hash (VARCHAR, Not Null)
   - full_name (VARCHAR, Not Null)
   - role (VARCHAR, Not Null: Admin | Librarian | Student)
   - created_at (TIMESTAMP)

2. MEMBERS:
   - id (INT, PK, Auto-Increment)
   - user_id (INT, FK -> USERS.id, Unique)
   - card_number (VARCHAR, Unique)
   - status (VARCHAR: Active | Suspended)
   - books_checked_out (INT, default 0, max 5)
   - joined_date (TIMESTAMP)

3. BOOKS:
   - id (INT, PK, Auto-Increment)
   - title (VARCHAR)
   - author (VARCHAR)
   - isbn (VARCHAR, Unique)
   - genre (VARCHAR)
   - publisher (VARCHAR)
   - publication_year (INT)
   - total_copies (INT)
   - available_copies (INT)

4. TRANSACTIONS:
   - id (INT, PK, Auto-Increment)
   - book_id (INT, FK -> BOOKS.id)
   - member_id (INT, FK -> MEMBERS.id)
   - issued_by_user_id (INT, FK -> USERS.id)
   - issue_date (TIMESTAMP)
   - due_date (TIMESTAMP)
   - return_date (TIMESTAMP, Nullable)
   - status (VARCHAR: Issued | Returned)

5. FINES:
   - id (INT, PK, Auto-Increment)
   - transaction_id (INT, FK -> TRANSACTIONS.id, Unique)
   - fine_amount (DECIMAL(10,2))
   - payment_status (VARCHAR: Unpaid | Paid)
   - paid_date (TIMESTAMP, Nullable)

6. RESERVATIONS (Queue for out-of-stock items):
   - id (INT, PK, Auto-Increment)
   - book_id (INT, FK -> BOOKS.id)
   - member_id (INT, FK -> MEMBERS.id)
   - reservation_date (TIMESTAMP)
   - status (VARCHAR: Pending | Fulfilled | Cancelled)

Cardinality & Relationships:
- USERS has a 1-to-0..1 relationship with MEMBERS (only Students have a member card profile).
- MEMBERS initiates 0-to-many TRANSACTIONS.
- BOOKS is included in 0-to-many TRANSACTIONS.
- TRANSACTIONS incurs 0-to-1 FINES (only when returned late).
- BOOKS has 0-to-many RESERVATIONS.
- MEMBERS has 0-to-many RESERVATIONS.

Render this as a clean, elegant diagram using standard ER notation, highlighting PKs and FKs clearly.
```

---

## 🔄 Prompt 3: Activity Diagram (Book Issue & Checkout Workflow)
**Instructions**: Paste this to generate a flow chart detailing how a book is checked out, verifying limits, membership state, and reservation logic.

```text
Please generate a UML Activity Diagram in PlantUML syntax detailing the core "Book Checkout (Issue) Workflow" in our Library Management System.

The diagram should follow this sequential execution logic:
1. Start: Student requests to borrow a book.
2. Step 1: Librarian scans the Student's Library Card.
3. Decision 1: Is the Member Status 'Active'?
   - If NO: Display "Account Suspended / Outstanding Fines" and Terminate.
   - If YES: Scan the Book's ISBN/Barcode.
4. Decision 2: Is the Book Stock Available (available_copies > 0)?
   - If NO: Display "Book Out of Stock" -> Ask if user wants to reserve the book:
     - If YES: Create a RESERVATION record with status 'Pending' and add Student to Waitlist -> Terminate.
     - If NO: Terminate.
   - If YES: Proceed.
5. Decision 3: Has the Student exceeded their borrowing ceiling (active loans count >= 5)?
   - If YES: Display "Maximum Checkout Limit Reached" and Terminate.
   - If NO: Proceed.
6. Step 2: Create a new TRANSACTION log (Status = 'Issued', set issue_date = NOW, due_date = NOW + 14 Days).
7. Step 3: Decrement the Book's `available_copies` count by 1.
8. Step 4: Increment the Member's `books_checked_out` counter by 1.
9. Step 5: If the student had a 'Pending' reservation for this book, automatically update the RESERVATION status to 'Fulfilled'.
10. End: Display "Checkout Successful" receipt.

Please make sure the layout flows vertically, uses clean decision diamonds, distinct pathways for Yes/No, and is styled with professional color borders.
```

---

## 🔄 Prompt 4: Activity Diagram (Book Return & Fine Accrual Workflow)
**Instructions**: Paste this to model the return flow that evaluates return dates, charges overdue fines, and handles payment triggers.

```text
Please generate a UML Activity Diagram in PlantUML syntax representing the "Book Return & Fine Settlement Workflow" in our Library Management System.

The diagram should trace this logic:
1. Start: Student returns physical book to the library desk.
2. Step 1: Librarian searches for the active transaction log associated with the Book ID and Member ID.
3. Step 2: Mark transaction `return_date` = NOW.
4. Step 3: Increment the Book's `available_copies` count by 1 in the catalog index.
5. Step 4: Decrement the Member's `books_checked_out` counter by 1.
6. Decision 1: Is the Return Date past the Due Date (`return_date` > `due_date`)?
   - If NO: Update transaction status to 'Returned' -> Skip to End.
   - If YES: Proceed to Fine Calculation.
7. Step 5: Automatically calculate the late fine: `overdue_days * daily_fine_rate` (based on system settings).
8. Step 6: Create a FINE record linked to the transaction (status = 'Unpaid').
9. Step 7: Display fine balance to the Member.
10. Decision 2: Does the Member pay the fine immediately?
    - If YES: Process transaction payment -> Mark FINE status to 'Paid' -> Set `paid_date` = NOW -> Update Member status to 'Active'.
    - If NO: Member status is set/retained as 'Suspended' (due to outstanding fees) -> Proceed.
11. Step 8: Update transaction status to 'Returned'.
12. End: Display success screen.

Use swimlanes if possible to separate the actions of the "Student/Member", "Librarian", and "System Database".
```
