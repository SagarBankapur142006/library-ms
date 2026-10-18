import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import qn, nsdecls

# Colors
NAVY = RGBColor(0, 51, 102)      # #003366 - Headings
CHARCOAL = RGBColor(51, 51, 51)  # #333333 - Body Text
GRAY = RGBColor(128, 128, 128)    # #808080 - Subtitles
WHITE = RGBColor(255, 255, 255)
LIGHT_GRAY = "F2F2F2"            # Table Header Background
BORDER_COLOR = "D3D3D3"

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
        node = OxmlElement(f'w:{m}')
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def add_heading_styled(doc, text, level):
    h = doc.add_heading(text, level=level)
    run = h.runs[0]
    run.font.name = 'Arial'
    if level == 1:
        run.font.size = Pt(18)
        run.font.color.rgb = NAVY
        run.bold = True
        h.paragraph_format.space_before = Pt(18)
        h.paragraph_format.space_after = Pt(6)
    elif level == 2:
        run.font.size = Pt(14)
        run.font.color.rgb = NAVY
        run.bold = True
        h.paragraph_format.space_before = Pt(14)
        h.paragraph_format.space_after = Pt(4)
    elif level == 3:
        run.font.size = Pt(12)
        run.font.color.rgb = CHARCOAL
        run.bold = True
        h.paragraph_format.space_before = Pt(10)
        h.paragraph_format.space_after = Pt(2)
    return h

def add_paragraph_styled(doc, text="", bold_prefix="", italic=False):
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(6)
    p.paragraph_format.line_spacing = 1.15
    if bold_prefix:
        r_bold = p.add_run(bold_prefix)
        r_bold.font.name = 'Arial'
        r_bold.font.size = Pt(10.5)
        r_bold.bold = True
        r_bold.font.color.rgb = CHARCOAL
    if text:
        r_text = p.add_run(text)
        r_text.font.name = 'Arial'
        r_text.font.size = Pt(10.5)
        r_text.italic = italic
        r_text.font.color.rgb = CHARCOAL
    return p

def create_table_styled(doc, rows, cols):
    table = doc.add_table(rows=rows, cols=cols)
    table.autofit = True
    # Make borders clean
    tblPr = table._tbl.tblPr
    borders = parse_xml(
        f'<w:tblBorders {nsdecls("w")}>'
        f'  <w:top w:val="single" w:sz="4" w:space="0" w:color="{BORDER_COLOR}"/>'
        f'  <w:bottom w:val="single" w:sz="4" w:space="0" w:color="{BORDER_COLOR}"/>'
        f'  <w:insideH w:val="single" w:sz="4" w:space="0" w:color="{BORDER_COLOR}"/>'
        f'  <w:left w:val="none"/>'
        f'  <w:right w:val="none"/>'
        f'  <w:insideV w:val="none"/>'
        f'</w:tblBorders>'
    )
    tblPr.append(borders)
    return table

def style_header_cell(cell, text):
    set_cell_background(cell, LIGHT_GRAY)
    set_cell_margins(cell, top=120, bottom=120, left=150, right=150)
    p = cell.paragraphs[0]
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    run = p.add_run(text)
    run.font.name = 'Arial'
    run.font.size = Pt(10)
    run.bold = True
    run.font.color.rgb = NAVY

def style_body_cell(cell, text, is_mono=False, bold=False):
    set_cell_margins(cell, top=100, bottom=100, left=150, right=150)
    p = cell.paragraphs[0]
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    run = p.add_run(text)
    run.font.name = 'Courier New' if is_mono else 'Arial'
    run.font.size = Pt(9.5)
    run.bold = bold
    run.font.color.rgb = CHARCOAL

# ================= DOCUMENT 1: PROJECT PLANNING & WBS =================
def build_wbs_docx():
    doc = docx.Document()
    
    # Title
    title = doc.add_paragraph()
    title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    title_run = title.add_run("Library Management System\nProject Planning & WBS")
    title_run.font.name = 'Arial'
    title_run.font.size = Pt(24)
    title_run.bold = True
    title_run.font.color.rgb = NAVY
    title.paragraph_format.space_before = Pt(36)
    title.paragraph_format.space_after = Pt(6)

    # Subtitle
    sub = doc.add_paragraph()
    sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    sub_run = sub.add_run("Work Breakdown Structure and Repository Blueprint")
    sub_run.font.name = 'Arial'
    sub_run.font.size = Pt(12)
    sub_run.font.color.rgb = GRAY
    sub.paragraph_format.space_after = Pt(36)

    # Section 1
    add_heading_styled(doc, "1. Executive Summary", level=1)
    add_paragraph_styled(doc, 
        "This project planning document outlines the Work Breakdown Structure (WBS), technology stack selection, "
        "and codebase structure for the Library Management System (LMS). It serves as the foundation for the "
        "agile development sprints tracked under Epic SCRUM-12 (Project Planning) and Task SCRUM-11 (Create Project Structure)."
    )

    add_heading_styled(doc, "2. Work Breakdown Structure (WBS)", level=1)
    add_paragraph_styled(doc, 
        "The project is structured hierarchically into 9 key phases. Each phase represents a group of deliverables "
        "required to compile, build, test, and present the system."
    )

    # WBS Table
    wbs_data = [
        ("1.0", "Project Planning & Setup", "Repository setup & planning.", "LMS-SETUP", "2026-06-15", "2026-06-25", "Completed"),
        ("1.1", "Initialize Repository", "Git repository setup & folders.", "LMS-SETUP-1", "2026-06-15", "2026-06-18", "Completed"),
        ("1.2", "Setup Dev Environment", "Vite & TypeScript setup.", "LMS-SETUP-2", "2026-06-19", "2026-06-22", "Completed"),
        ("1.3", "Setup Jira Board", "Epic and backlog setup.", "LMS-SETUP-3", "2026-06-23", "2026-06-25", "Completed"),
        ("2.0", "Requirement Analysis", "Formulation of system rules.", "LMS-DESIGN", "2026-06-26", "2026-07-05", "In Progress"),
        ("2.1", "Draft SRS Document", "Drafting SRS specification.", "LMS-DESIGN-1", "2026-06-26", "2026-06-30", "In Progress"),
        ("2.2", "Define Use Case Models", "Defining actors & use cases.", "LMS-DESIGN-2", "2026-07-01", "2026-07-05", "In Progress"),
        ("3.0", "System Design", "Architecture & DB design.", "LMS-DESIGN", "2026-07-06", "2026-07-15", "In Progress"),
        ("3.1", "Design ER Diagram", "Model entity relationships.", "LMS-DESIGN-3", "2026-07-06", "2026-07-10", "In Progress"),
        ("3.2", "Define Database Schema", "Define SQL schemas in 3NF.", "LMS-DESIGN-4", "2026-07-11", "2026-07-15", "In Progress"),
        ("4.0", "User Authentication", "Secure sign-in & JWT settings.", "LMS-AUTH", "2026-07-16", "2026-07-25", "In Progress"),
        ("4.1", "Secure Admin & Librarian Sign-In", "Login UI & verification.", "LMS-AUTH-1", "2026-07-16", "2026-07-20", "In Progress"),
        ("4.2", "Student/Member Portal Access", "Student login interfaces.", "LMS-AUTH-2", "2026-07-21", "2026-07-22", "In Progress"),
        ("4.3", "Setup Global Context & Guards", "AuthContext session control.", "LMS-AUTH-3", "2026-07-23", "2026-07-25", "In Progress"),
        ("5.0", "Book Management", "Inventory CRUD & catalog search.", "LMS-BOOK", "2026-07-26", "2026-08-04", "In Progress"),
        ("5.1", "Create Book Entry Form", "Form CRUD controls & ISBN checks.", "LMS-BOOK-1", "2026-07-26", "2026-07-31", "In Progress"),
        ("5.2", "Catalog Search & Filters", "Title, Author, Genre queries.", "LMS-BOOK-2", "2026-08-01", "2026-08-04", "In Progress"),
        ("6.0", "Member Management", "Registry of library cardholders.", "LMS-MEM", "2026-08-05", "2026-08-12", "In Progress"),
        ("6.1", "Register New Members", "Registration form & card generation.", "LMS-MEM-1", "2026-08-05", "2026-08-08", "In Progress"),
        ("6.2", "View & Edit Member Profiles", "View logs & standings details.", "LMS-MEM-2", "2026-08-09", "2026-08-10", "In Progress"),
        ("6.3", "Account Status Handler", "Suspension triggers setup.", "LMS-MEM-3", "2026-08-11", "2026-08-12", "In Progress"),
        ("7.0", "Book Issue & Return", "Checkout transactions and returns.", "LMS-TX", "2026-08-13", "2026-08-22", "In Progress"),
        ("7.1", "Implement Book Checkout", "Issue log builder & availability triggers.", "LMS-TX-1", "2026-08-13", "2026-08-17", "In Progress"),
        ("7.2", "Implement Book Check-in", "Return state processing & check-in.", "LMS-TX-2", "2026-08-18", "2026-08-20", "In Progress"),
        ("7.3", "Fine Accrual & Penalties Logic", "Overdue dynamic fine calculation.", "LMS-TX-3", "2026-08-21", "2026-08-22", "In Progress"),
        ("8.0", "Reports & Dashboard", "Real-time settings & logs queues.", "LMS-ADV", "2026-08-23", "2026-08-27", "In Progress"),
        ("8.1", "Admin Borrowing Policy Settings", "Policy ceilings & settings dashboard.", "LMS-ADV-1", "2026-08-23", "2026-08-24", "In Progress"),
        ("8.2", "Book Reservation Queue", "Waitlist and queue triggers.", "LMS-ADV-2", "2026-08-24", "2026-08-26", "In Progress"),
        ("8.3", "Dashboard Metrics & Fine logs", "Dashboard widgets & settlement logs.", "LMS-ADV-3", "2026-08-26", "2026-08-27", "In Progress"),
        ("9.0", "Verification & Testing", "TypeScript compiler and E2E verifications.", "LMS-TEST", "2026-08-28", "2026-08-30", "In Progress"),
        ("9.1", "TypeScript & Build Compliance", "Type check matching & build bundles.", "LMS-TEST-1", "2026-08-28", "2026-08-29", "In Progress"),
        ("9.2", "End-to-End Delivery & Jira Sync", "Archive uploads & completion approvals.", "LMS-TEST-2", "2026-08-30", "2026-08-30", "In Progress")
    ]

    table = create_table_styled(doc, len(wbs_data) + 1, 7)
    # Header
    style_header_cell(table.cell(0, 0), "WBS Code")
    style_header_cell(table.cell(0, 1), "Element Name")
    style_header_cell(table.cell(0, 2), "Deliverables & Scope")
    style_header_cell(table.cell(0, 3), "Jira Key")
    style_header_cell(table.cell(0, 4), "Start Date")
    style_header_cell(table.cell(0, 5), "End Date")
    style_header_cell(table.cell(0, 6), "Status")
    
    # Body
    for i, row in enumerate(wbs_data):
        style_body_cell(table.cell(i+1, 0), row[0], is_mono=True, bold=row[0].endswith(".0"))
        style_body_cell(table.cell(i+1, 1), row[1], bold=row[0].endswith(".0"))
        style_body_cell(table.cell(i+1, 2), row[2])
        style_body_cell(table.cell(i+1, 3), row[3], is_mono=True, bold=row[0].endswith(".0"))
        style_body_cell(table.cell(i+1, 4), row[4], is_mono=True)
        style_body_cell(table.cell(i+1, 5), row[5], is_mono=True)
        style_body_cell(table.cell(i+1, 6), row[6])

    add_heading_styled(doc, "3. Codebase Directory Map", level=1)
    add_paragraph_styled(doc, 
        "To establish a standardized development environment, the following project hierarchy is initialized:"
    )

    dirs = [
        ("docs/", "Contains all design and requirement documents (WBS, SRS, ERD)."),
        ("src/assets/", "Static graphics, SVG icons, and library logo media assets."),
        ("src/components/", "Shared visual UI components (Navbar, Sidebar, MetricCard)."),
        ("src/context/", "Global state providers (LibraryContext for transactions, AuthContext for sessions)."),
        ("src/pages/", "Main application view controllers (Login, Dashboard, Books, Members, Issues)."),
        ("src/services/", "Storage access layer (storage.ts) simulating SQL transactions on LocalStorage."),
        ("src/styles/", "Global CSS rules, custom CSS variables, and layout styles."),
        ("index.html / App.tsx", "Entry point documents and main app layout frame.")
    ]

    for d, desc in dirs:
        add_paragraph_styled(doc, desc, bold_prefix=f"•  {d}  -  ")

    doc.save("docs/Project_Planning_and_Structure.docx")

# ================= DOCUMENT 2: SRS REQUIREMENTS =================
def build_srs_docx():
    doc = docx.Document()
    
    # Title
    title = doc.add_paragraph()
    title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    title_run = title.add_run("Library Management System\nSoftware Requirements Specification")
    title_run.font.name = 'Arial'
    title_run.font.size = Pt(22)
    title_run.bold = True
    title_run.font.color.rgb = NAVY
    title.paragraph_format.space_before = Pt(36)
    title.paragraph_format.space_after = Pt(6)

    # Subtitle
    sub = doc.add_paragraph()
    sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    sub_run = sub.add_run("System Functional & Non-Functional Specifications")
    sub_run.font.name = 'Arial'
    sub_run.font.size = Pt(12)
    sub_run.font.color.rgb = GRAY
    sub.paragraph_format.space_after = Pt(36)

    add_heading_styled(doc, "1. Scope & Purpose", level=1)
    add_paragraph_styled(doc, 
        "This Software Requirements Specification (SRS) details the specifications for the Library "
        "Management System (LMS) web application. This document lists user stories, acceptance criteria, "
        "and system scope tracked under Task SCRUM-10 (Research Library Requirements)."
    )

    add_heading_styled(doc, "2. User Personas & Roles", level=1)
    add_paragraph_styled(doc, "The system supports three user roles, each having distinct privileges:")
    add_paragraph_styled(doc, "Possesses complete administration access. Responsible for CRUD on librarians and configurations.", bold_prefix="•  Administrator: ")
    add_paragraph_styled(doc, "Handles daily inventory controls (books cataloging, member registration, checking books out, processing returns, recording payments).", bold_prefix="•  Librarian: ")
    add_paragraph_styled(doc, "Standard member role. Can search the database catalog, look up their checkout logs, and inspect outstanding fees.", bold_prefix="•  Student / Member: ")

    # Check for Use Case diagram image and insert if it exists
    use_case_path = "docs/use_case_diagram.png"
    if os.path.exists(use_case_path):
        add_heading_styled(doc, "Use Case Diagram Model", level=2)
        doc.add_picture(use_case_path, width=Inches(6.0))
        add_paragraph_styled(doc, "Figure 1: Use Case Diagram representing core library system actor boundaries.")

    add_heading_styled(doc, "3. Functional Requirements (User Stories)", level=1)
    add_paragraph_styled(doc, "The following stories outline the functional expectations for Sprint 1 and 2:")

    stories = [
        ("LMS-AUTH-01", "User Authentication (3 SP)", "As a user, I want to securely log in with my email/password so that I can open my dashboard.", 
         ["Validates email formatting and password rules (min 8 chars).", "Issues secure JWT tokens on authentication success.", "Checks role and redirects users to their appropriate page."]),
        
        ("LMS-BOOK-01", "Manage Book Catalog (5 SP)", "As a librarian, I want to add, edit, and delete books in the system catalog to manage inventory.",
         ["Form checks ISBN unique format.", "Input constraints reject invalid publishers/years.", "Blocks deletes if book copies are checked out."]),
        
        ("LMS-BOOK-02", "Book Search & Filter (2 SP)", "As a student or librarian, I want to search and filter book listings to find available copies.",
         ["Debounced search bar query.", "Filters by Title, Author, ISBN, or Genre.", "Availability state indicator (Available vs Out of Stock)."]),

        ("LMS-TX-01", "Checkout Book (5 SP)", "As a librarian, I want to issue books to active library members to track borrowings.",
         ["Decrements copies count on issue.", "Checks member is Active and has borrowed < 5 books.", "Applies a default return due date of 14 days."]),

        ("LMS-TX-02", "Return Book & Fines (5 SP)", "As a librarian, I want to mark returns and calculate overdue penalties automatically.",
         ["Increments available stock copy count.", "Computes days overdue between Due Date and Return Date.", "Charges $1.00 fine per day overdue and appends it to member's account."])
    ]

    for id_, title, story, acs in stories:
        add_heading_styled(doc, f"{id_}: {title}", level=2)
        add_paragraph_styled(doc, story, italic=True)
        add_paragraph_styled(doc, "", bold_prefix="Acceptance Criteria:")
        for ac in acs:
            add_paragraph_styled(doc, ac, bold_prefix=" - ")

    add_heading_styled(doc, "4. Non-Functional Requirements", level=1)
    add_paragraph_styled(doc, "Passwords must be encrypted using cryptographically strong hashing (bcrypt). Client sessions must rely on encrypted JWT tokens.", bold_prefix="•  Security: ")
    add_paragraph_styled(doc, "UI must adjust adaptively across desktop, tablet, and mobile devices.", bold_prefix="•  Usability: ")
    add_paragraph_styled(doc, "Database search queries and filter matches must return values within 500ms.", bold_prefix="•  Performance: ")

    # Check for Activity Diagram images and insert if they exist
    checkout_path = "docs/checkout_activity_diagram.png"
    return_path = "docs/return_activity_diagram.png"
    
    if os.path.exists(checkout_path) or os.path.exists(return_path):
        add_heading_styled(doc, "5. System Workflows & Activity Diagrams", level=1)
        
        if os.path.exists(checkout_path):
            add_heading_styled(doc, "Book Checkout (Issue) Workflow", level=2)
            doc.add_picture(checkout_path, width=Inches(6.0))
            add_paragraph_styled(doc, "Figure 2: Unified Activity Diagram detailing checkout validations, suspension checks, stock updates, and waitlist allocations.")
            
        if os.path.exists(return_path):
            add_heading_styled(doc, "Book Return & Fine Accrual Workflow", level=2)
            doc.add_picture(return_path, width=Inches(6.0))
            add_paragraph_styled(doc, "Figure 3: Activity Diagram representing book returns, overdue check-in triggers, fine calculations, and payment transitions.")

    doc.save("docs/Requirements_Analysis_SRS.docx")

# ================= DOCUMENT 3: DATABASE DESIGN =================
def build_db_docx():
    doc = docx.Document()
    
    # Title
    title = doc.add_paragraph()
    title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    title_run = title.add_run("Library Management System\nSystem Design & Database Schema")
    title_run.font.name = 'Arial'
    title_run.font.size = Pt(22)
    title_run.bold = True
    title_run.font.color.rgb = NAVY
    title.paragraph_format.space_before = Pt(36)
    title.paragraph_format.space_after = Pt(6)

    # Subtitle
    sub = doc.add_paragraph()
    sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    sub_run = sub.add_run("Relational Schema, Keys, Constraints, and Data Dictionary")
    sub_run.font.name = 'Arial'
    sub_run.font.size = Pt(12)
    sub_run.font.color.rgb = GRAY
    sub.paragraph_format.space_after = Pt(36)

    add_heading_styled(doc, "1. Database Model Overview", level=1)
    add_paragraph_styled(doc, 
        "This system design specification details the relational database design for the Library "
        "Management System, satisfying the requirements under Task SCRUM-6 (Design Database Schema)."
    )

    # Check for ER Diagram image and insert if it exists
    er_path = "docs/er_diagram.png"
    if os.path.exists(er_path):
        add_heading_styled(doc, "Entity-Relationship Diagram (ERD)", level=2)
        doc.add_picture(er_path, width=Inches(6.0))
        add_paragraph_styled(doc, "Figure 1: Normalized (3NF) Entity-Relationship Diagram detailing database table cardinalities, PK/FK mappings, and constraints.")

    add_heading_styled(doc, "2. Schema Normalization (3NF)", level=1)
    add_paragraph_styled(doc, 
        "To maximize data integrity and minimize storage redundancies, the schemas are normalized "
        "to the Third Normal Form (3NF):"
    )
    add_paragraph_styled(doc, "All columns represent atomic, single-valued attributes.", bold_prefix="•  1NF: ")
    add_paragraph_styled(doc, "All tables are in 1NF and all non-key properties fully depend on the primary keys.", bold_prefix="•  2NF: ")
    add_paragraph_styled(doc, "All tables are in 2NF and no transitive functional dependencies exist (e.g. member details are not repeated in transaction logs).", bold_prefix="•  3NF: ")

    add_heading_styled(doc, "3. Data Dictionary (Table Schemas)", level=1)

    # 1. Users Table
    add_heading_styled(doc, "3.1 users Table", level=2)
    add_paragraph_styled(doc, "Stores authentication credentials and permissions for all users.")
    t_users = [
        ("id", "SERIAL / INT", "PK, Auto-Inc", "Unique system user identifier."),
        ("email", "VARCHAR(150)", "UNIQUE, NOT NULL", "Login email address."),
        ("password_hash", "VARCHAR(255)", "NOT NULL", "Bcrypt password hash."),
        ("full_name", "VARCHAR(100)", "NOT NULL", "User's display name."),
        ("role", "VARCHAR(20)", "NOT NULL", "Role designation: 'Admin' | 'Librarian' | 'Student'."),
        ("created_at", "TIMESTAMP", "DEFAULT NOW()", "Account registration timestamp.")
    ]
    t = create_table_styled(doc, len(t_users)+1, 4)
    style_header_cell(t.cell(0, 0), "Column Name")
    style_header_cell(t.cell(0, 1), "Data Type")
    style_header_cell(t.cell(0, 2), "Constraints")
    style_header_cell(t.cell(0, 3), "Description")
    for r_idx, row in enumerate(t_users):
        for c_idx, val in enumerate(row):
            style_body_cell(t.cell(r_idx+1, c_idx), val, is_mono=(c_idx in [0, 1]))

    # 2. Books Table
    add_heading_styled(doc, "3.2 books Table", level=2)
    add_paragraph_styled(doc, "Stores cataloged books info and real-time physical availability count.")
    t_books = [
        ("id", "SERIAL / INT", "PK, Auto-Inc", "Catalog reference key."),
        ("title", "VARCHAR(255)", "NOT NULL", "Book title."),
        ("author", "VARCHAR(255)", "NOT NULL", "Author's name."),
        ("isbn", "VARCHAR(20)", "UNIQUE, NOT NULL", "International Standard Book Number."),
        ("genre", "VARCHAR(50)", "NOT NULL", "Classification genre (e.g. Fiction)."),
        ("total_copies", "INT", "DEFAULT 1", "Total stock units owned by the library."),
        ("available_copies", "INT", "DEFAULT 1", "Copies remaining on the shelves.")
    ]
    t = create_table_styled(doc, len(t_books)+1, 4)
    style_header_cell(t.cell(0, 0), "Column Name")
    style_header_cell(t.cell(0, 1), "Data Type")
    style_header_cell(t.cell(0, 2), "Constraints")
    style_header_cell(t.cell(0, 3), "Description")
    for r_idx, row in enumerate(t_books):
        for c_idx, val in enumerate(row):
            style_body_cell(t.cell(r_idx+1, c_idx), val, is_mono=(c_idx in [0, 1]))

    # 3. Transactions Table
    add_heading_styled(doc, "3.3 transactions Table", level=2)
    add_paragraph_styled(doc, "Logs all book checkouts, due targets, and return validations.")
    t_tx = [
        ("id", "SERIAL / INT", "PK, Auto-Inc", "Transaction ID."),
        ("book_id", "INT", "FK -> books(id)", "Borrowed book title catalog ID."),
        ("member_id", "INT", "FK -> members(id)", "Borrowing member identification."),
        ("issued_by_user_id", "INT", "FK -> users(id)", "Librarian user ID approving the checkout."),
        ("issue_date", "TIMESTAMP", "DEFAULT NOW()", "Timestamp of checkout transaction."),
        ("due_date", "TIMESTAMP", "NOT NULL", "Target return date (typically issue_date + 14 days)."),
        ("return_date", "TIMESTAMP", "NULLABLE", "Timestamp when book was physically checked back in."),
        ("status", "VARCHAR(20)", "DEFAULT 'Issued'", "Status state: 'Issued' | 'Returned'.")
    ]
    t = create_table_styled(doc, len(t_tx)+1, 4)
    style_header_cell(t.cell(0, 0), "Column Name")
    style_header_cell(t.cell(0, 1), "Data Type")
    style_header_cell(t.cell(0, 2), "Constraints")
    style_header_cell(t.cell(0, 3), "Description")
    for r_idx, row in enumerate(t_tx):
        for c_idx, val in enumerate(row):
            style_body_cell(t.cell(r_idx+1, c_idx), val, is_mono=(c_idx in [0, 1]))

    # 4. Fines Table
    add_heading_styled(doc, "3.4 fines Table", level=2)
    add_paragraph_styled(doc, "Tracks fees linked to overdue return transactions.")
    t_fines = [
        ("id", "SERIAL / INT", "PK, Auto-Inc", "Unique fine ticket ID."),
        ("transaction_id", "INT", "FK -> transactions(id)", "Associated loan transaction log ID."),
        ("fine_amount", "DECIMAL(10,2)", "DEFAULT 0.00", "Accrued overdue balance value."),
        ("payment_status", "VARCHAR(20)", "DEFAULT 'Unpaid'", "Payment status: 'Unpaid' | 'Paid'."),
        ("paid_date", "TIMESTAMP", "NULLABLE", "Timestamp of fee payment resolution.")
    ]
    t = create_table_styled(doc, len(t_fines)+1, 4)
    style_header_cell(t.cell(0, 0), "Column Name")
    style_header_cell(t.cell(0, 1), "Data Type")
    style_header_cell(t.cell(0, 2), "Constraints")
    style_header_cell(t.cell(0, 3), "Description")
    for r_idx, row in enumerate(t_fines):
        for c_idx, val in enumerate(row):
            style_body_cell(t.cell(r_idx+1, c_idx), val, is_mono=(c_idx in [0, 1]))

    add_heading_styled(doc, "4. Relational Constraints & Business Rules", level=1)
    add_paragraph_styled(doc, "Book checkout requires `books.available_copies` > 0. On transaction insert, decrement copies count. On return, increment copies count.", bold_prefix="•  Inventory Counter Triggers: ")
    add_paragraph_styled(doc, "Students are limited to maximum 5 concurrent active issues. Checkout blocks if `books_checked_out` >= 5.", bold_prefix="•  Borrow Limits: ")
    add_paragraph_styled(doc, "Overdue daily penalty rate is configured at $1.00/day. Fine calculations trigger on return if `return_date` > `due_date`.", bold_prefix="•  Fine Logic: ")

    doc.save("docs/System_Design_Database_Schema.docx")

if __name__ == "__main__":
    os.makedirs("docs", exist_ok=True)
    build_wbs_docx()
    build_srs_docx()
    build_db_docx()
    print("All docx files generated successfully in /docs directory!")
