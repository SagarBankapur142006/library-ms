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
        run.font.size = Pt(14)
        run.font.color.rgb = NAVY
        run.bold = True
        h.paragraph_format.space_before = Pt(16)
        h.paragraph_format.space_after = Pt(6)
    elif level == 2:
        run.font.size = Pt(12)
        run.font.color.rgb = NAVY
        run.bold = True
        h.paragraph_format.space_before = Pt(10)
        h.paragraph_format.space_after = Pt(4)
    return h

def add_paragraph_styled(doc, text="", bold_prefix="", italic=False):
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(6)
    p.paragraph_format.line_spacing = 1.15
    if bold_prefix:
        r_bold = p.add_run(bold_prefix)
        r_bold.font.name = 'Arial'
        r_bold.font.size = Pt(10)
        r_bold.bold = True
        r_bold.font.color.rgb = CHARCOAL
    if text:
        r_text = p.add_run(text)
        r_text.font.name = 'Arial'
        r_text.font.size = Pt(10)
        r_text.italic = italic
        r_text.font.color.rgb = CHARCOAL
    return p

def create_table_styled(doc, rows, cols):
    table = doc.add_table(rows=rows, cols=cols)
    table.autofit = True
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
    set_cell_margins(cell, top=100, bottom=100, left=120, right=120)
    p = cell.paragraphs[0]
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    run = p.add_run(text)
    run.font.name = 'Arial'
    run.font.size = Pt(9.5)
    run.bold = True
    run.font.color.rgb = NAVY

def style_body_cell(cell, text, is_mono=False, bold=False):
    set_cell_margins(cell, top=80, bottom=80, left=120, right=120)
    p = cell.paragraphs[0]
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    run = p.add_run(text)
    run.font.name = 'Courier New' if is_mono else 'Arial'
    run.font.size = Pt(9)
    run.bold = bold
    run.font.color.rgb = CHARCOAL

def build_jira_report_docx():
    doc = docx.Document()
    
    # Page setup - Margins
    for section in doc.sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)

    # ---------------- PAGE 1: COMPLETELY BLANK ----------------
    # First page is left blank as requested for manual entry of cover details.
    p_blank = doc.add_paragraph()
    p_blank.paragraph_format.space_before = Pt(200)
    doc.add_page_break()

    # ---------------- PAGE 2: PROJECT OVERVIEW ----------------
    add_heading_styled(doc, "Project Overview", level=1)
    add_paragraph_styled(doc,
        "The Library Management System (LMS) is a single-page web application designed to digitize academic library operations. "
        "The project aims to provide a reliable, premium interface for students, librarians, and administrators to streamline library workflows "
        "such as cataloging books, managing member profiles, tracking checkouts, returns, waitlist queues, settings, and outstanding fines."
    )
    add_paragraph_styled(doc,
        "Key functional modules developed within this application include:\n"
        "• User Authentication: Access credentials validation with Role-Based Access Control (RBAC) separating Admin, Librarian, and Student views.\n"
        "• Book Cataloging: Comprehensive CRUD tools permitting catalog updates, live search, genre filters, and available stock control.\n"
        "• Member Registry: Roster of library cardholders and standing indicators (Active vs. Suspended accounts).\n"
        "• Issue & Return: Circulation logic checking borrowing limits, decrementing/incrementing stocks, and processing returns.\n"
        "• Fine Engine: Dynamic daily overdue fee accruals linked to transaction due dates with settlement ledgers.\n"
        "• Waitlist Queue: Book reservation system allowing students to request currently checked-out/out-of-stock items, which automatically update on return.\n"
        "• Admin Policy Settings: Administrative console to adjust borrow durations, maximum limits, and daily fine rates in real time."
    )
    add_paragraph_styled(doc,
        "The frontend is implemented using React and TypeScript (fully compliant with compiler configurations) and compiled via Vite. "
        "The user interface incorporates modern HSL color design systems, CSS variables, and glassmorphism styling parameters. "
        "State data is managed dynamically and persisted locally through a Storage Service layer simulating SQL relational operations in HTML5 LocalStorage."
    )
    doc.add_page_break()

    # ---------------- PAGE 3: JIRA CONFIGURATION & SPRINT ----------------
    add_heading_styled(doc, "Jira Scrum Configuration", level=1)
    add_paragraph_styled(doc,
        "The project's lifecycle, sprints backlog, requirements mapping, database designs, and implementation steps were managed "
        "exclusively using Agile Scrum methodologies on Atlassian Jira."
    )
    add_paragraph_styled(doc, "Jira Project Key: SCRUM\nJira Site Workspace: https://vitstudent-team-r6bfp56o.atlassian.net")
    
    add_heading_styled(doc, "Sprint Breakdown", level=2)
    add_paragraph_styled(doc,
        "The project was executed in exactly one active Scrum sprint covering planning, analysis, design, and code delivery phases "
        "under the unified timeline: June 15, 2026 – August 30, 2026."
    )
    add_paragraph_styled(doc,
        "Sprint Name: SCRUM Sprint 1\n"
        "Sprint Duration: June 15, 2026 – August 30, 2026\n"
        "Sprint Objective: To configure development environments, design normalized database layouts, draft requirements, "
        "build authentication guards, implement core book cataloging forms, design member listings, develop book circulation transaction mechanisms, "
        "integrate settings rules, and synchronize all source files directly to the Jira board issues."
    )
    doc.add_page_break()

    # ---------------- PAGE 4 ONWARDS: EPICS & TASKS DETAILS ----------------
    add_heading_styled(doc, "Jira Epics & Tasks Breakdown", level=1)
    add_paragraph_styled(doc,
        "Below is a detailed analysis of every Epic and Task configured on the Jira project board. "
        "Each section covers the item's summary, type, assignee, completion status, work description, and associated attachments."
    )

    # Let's list issues SCRUM-1 through SCRUM-19
    issues_data = [
        {
            "key": "SCRUM-12",
            "title": "Project Planning",
            "type": "Epic",
            "status": "Done (100% Completed)",
            "assignee": "Sagar Bankapur",
            "desc": "Governs the overall repository structure setup, initial scheduling, work packages planning, and project plan tracking.",
            "attachments": [
                ("Project_Planning_and_Structure.docx", "Word document outlining the directory tree, technology stack, and initial planning steps."),
                ("WhatsApp Image 2026-07-27 at 9.49.54 PM.jpeg", "Handwritten planning photo capturing WBS Part 1: Project Planning, Setup, and Environment Configurations."),
                ("WhatsApp Image 2026-07-27 at 9.49.56 PM.jpeg", "Handwritten planning photo capturing WBS Part 2: Requirements Analysis, Use Cases, System Design, and Auth Page UI."),
                ("WhatsApp Image 2026-07-27 at 9.49.57 PM.jpeg", "Handwritten planning photo capturing WBS Part 3: Book Inventory CRUD, Member Registries, Issue/Return Flow, and Settings Dashboard."),
                ("WhatsApp Image 2026-07-27 at 9.50.00 PM.jpeg", "Handwritten planning photo capturing WBS Part 4: Testing Quality Gates, E2E Verification, Build Compilations, and Jira Delivery.")
            ],
            "images": [
                ("WhatsApp Image 2026-07-27 at 9.49.54 PM.jpeg", "Figure 1: Handwritten WBS Planning - Setup & Bootstrapping"),
                ("WhatsApp Image 2026-07-27 at 9.49.56 PM.jpeg", "Figure 2: Handwritten WBS Planning - Requirements, Design, & Auth"),
                ("WhatsApp Image 2026-07-27 at 9.49.57 PM.jpeg", "Figure 3: Handwritten WBS Planning - Books, Circulation, & Settings"),
                ("WhatsApp Image 2026-07-27 at 9.50.00 PM.jpeg", "Figure 4: Handwritten WBS Planning - Verification & Delivery")
            ]
        },
        {
            "key": "SCRUM-11",
            "title": "Create Project Structure",
            "type": "Task (Parent: SCRUM-12)",
            "status": "Done (100% Completed)",
            "assignee": "Sagar Bankapur",
            "desc": "Initialize the Git code repository, compile developer packages (React, Vite, TypeScript), and configure compilation standards.",
            "attachments": [
                ("library_management_system_codebase.zip", "Zip archive containing the initial boilerplate codebase structure including Vite configs, TS configurations, and standard assets folders."),
                ("Project_Planning_and_Structure.docx", "Planning document defining folder structure and modular paths.")
            ]
        },
        {
            "key": "SCRUM-18",
            "title": "Requirement Analysis",
            "type": "Epic",
            "status": "In Progress (Development Stage)",
            "assignee": "Unassigned",
            "desc": "Captures system operational flow boundaries, user stories, validation thresholds, and drafts formal specifications documents.",
            "attachments": [
                ("Requirements_Analysis_SRS.docx", "Word document outlining system actors, detailed functional user stories, and non-functional security constraints."),
                ("use_case_diagram.png", "StarUML Use Case diagram detailing system boundaries and user interactions.")
            ],
            "images": [
                ("use_case_diagram.png", "Figure 5: StarUML System Use Case Diagram Model")
            ]
        },
        {
            "key": "SCRUM-10",
            "title": "Research Library Requirements",
            "type": "Task (Parent: SCRUM-18)",
            "status": "In Progress (Development Stage)",
            "assignee": "Aella Harsha Vardhan Reddy 24BCE1254",
            "desc": "Compile detailed business logic parameters, cardholder standing criteria, and model use cases diagrams.",
            "attachments": [
                ("Requirements_Analysis_SRS.docx", "Detailed specifications document."),
                ("SRS.md", "Markdown copy of the requirements specifications."),
                ("WBS.md", "Work Breakdown Structure mapping milestones."),
                ("use_case_diagram.png", "System boundary use case diagram."),
                ("Project_Planning_and_Structure.docx", "Planning reference document.")
            ]
        },
        {
            "key": "SCRUM-19",
            "title": "System Design",
            "type": "Epic",
            "status": "In Progress (Development Stage)",
            "assignee": "Aella Harsha Vardhan Reddy 24BCE1254",
            "desc": "Draft relational database schemes, entity representations, relationships cardinality, and structural ERDs.",
            "attachments": [
                ("System_Design_Database_Schema.docx", "Word document modeling tables, indices, constraints, and data dictionaries."),
                ("er_diagram.png", "StarUML entity-relationship diagram.")
            ],
            "images": [
                ("er_diagram.png", "Figure 6: StarUML Normalized 3NF Entity-Relationship Diagram")
            ]
        },
        {
            "key": "SCRUM-6",
            "title": "Design Database Schema",
            "type": "Task (Parent: SCRUM-19)",
            "status": "In Progress (Development Stage)",
            "assignee": "Sagar Bankapur",
            "desc": "Establish normalized 3NF relational data tables (users, members, books, transactions, fines, settings, and reservations).",
            "attachments": [
                ("System_Design_Database_Schema.docx", "Relational database dictionary specifications."),
                ("Database_Design.md", "Markdown document defining fields, data types, primary keys, foreign keys, and normalizations."),
                ("er_diagram.png", "System entity-relationship diagram.")
            ]
        },
        {
            "key": "SCRUM-13",
            "title": "User Authentication",
            "type": "Epic",
            "status": "In Progress (Development Stage)",
            "assignee": "Sagar Bankapur",
            "desc": "Enforces security boundaries, login interface views, session storage, and route authorization contexts.",
            "attachments": []
        },
        {
            "key": "SCRUM-7",
            "title": "Create Login Page UI",
            "type": "Task (Parent: SCRUM-13)",
            "status": "In Progress (Development Stage)",
            "assignee": "Aella Harsha Vardhan Reddy 24BCE1254",
            "desc": "Build the frontend login UI component including input validations and glassmorphism themes styling.",
            "attachments": [
                ("Login.tsx", "React login view file managing credentials verification states."),
                ("login_ui_mockup.png", "Glassmorphic login screen mockup screenshot.")
            ],
            "images": [
                ("login_ui_mockup.png", "Figure 7: User Authentication Sign-In UI Screen")
            ]
        },
        {
            "key": "SCRUM-8",
            "title": "Implement User Authentication",
            "type": "Task (Parent: SCRUM-13)",
            "status": "In Progress (Development Stage)",
            "assignee": "Sagar Bankapur",
            "desc": "Develop local storage session persistence and Role-Based Access Control (RBAC) hooks.",
            "attachments": [
                ("AuthContext.tsx", "Global auth context provider file.")
            ]
        },
        {
            "key": "SCRUM-14",
            "title": "Book Management",
            "type": "Epic",
            "status": "In Progress (Development Stage)",
            "assignee": "Sagar Bankapur",
            "desc": "Manages book catalogs, availability indicators, search filters, and inventory modifications.",
            "attachments": [
                ("Books.tsx", "React component source code for catalog operations.")
            ]
        },
        {
            "key": "SCRUM-9",
            "title": "Design Book Management Module",
            "type": "Task (Parent: SCRUM-14)",
            "status": "In Progress (Development Stage)",
            "assignee": "Sagar Bankapur",
            "desc": "Build inventory forms enabling librarians to add, edit, and archive book resources, alongside search filters.",
            "attachments": [
                ("Books.tsx", "Catalog views React code."),
                ("book_catalog_1785261304299.png", "React book catalog UI view screenshot.")
            ],
            "images": [
                ("book_catalog_1785261304299.png", "Figure 8: Book Inventory Catalog UI View")
            ]
        },
        {
            "key": "SCRUM-15",
            "title": "Member Management",
            "type": "Epic",
            "status": "In Progress (Development Stage)",
            "assignee": "Sagar Bankapur",
            "desc": "Manages cardholder registries, enrollment details, active borrowings limits, and member suspensions.",
            "attachments": [
                ("MyLoans.tsx", "React component source code for student cardholders view.")
            ]
        },
        {
            "key": "SCRUM-16",
            "title": "Issue & Return",
            "type": "Epic",
            "status": "In Progress (Development Stage)",
            "assignee": "Aella Harsha Vardhan Reddy 24BCE1254",
            "desc": "Core transaction circulation log handler processing checkouts, check-ins, return dates, and daily fines calculation.",
            "attachments": [
                ("LibraryContext.tsx", "React library state provider managing issues and returns transaction flows."),
                ("storage.ts", "LocalStorage data persistence service query engine."),
                ("library_management_system_advanced_features.zip", "Zip file containing advanced transaction scripts."),
                ("checkout_activity_diagram.png", "Workflow activity diagram for issuing books."),
                ("return_activity_diagram.png", "Workflow activity diagram for returning books.")
            ],
            "images": [
                ("checkout_activity_diagram.png", "Figure 9: Book Checkout (Issue) Activity Diagram"),
                ("return_activity_diagram.png", "Figure 10: Book Return & Fine Accrual Activity Diagram")
            ]
        },
        {
            "key": "SCRUM-17",
            "title": "Reports & Dashboard",
            "type": "Epic",
            "status": "In Progress (Development Stage)",
            "assignee": "Aella Harsha Vardhan Reddy 24BCE1254",
            "desc": "Librarian metrics dash panel, transaction grids, fine ledgers, waitlists queue, and administrative policies configurator.",
            "attachments": [
                ("Dashboard.tsx", "Main dashboard component code."),
                ("Settings.tsx", "Policy settings panel component code."),
                ("Project_Status_Snapshot.md", "Markdown status tracking record."),
                ("main_dashboard_1785261292483.png", "Dashboard UI screen view screenshot.")
            ],
            "images": [
                ("main_dashboard_1785261292483.png", "Figure 11: Librarian Dashboard UI Screen")
            ]
        }
    ]

    # Render each Jira issue details
    for issue in issues_data:
        add_heading_styled(doc, f"{issue['key']}: {issue['title']}", level=2)
        add_paragraph_styled(doc, issue['status'], bold_prefix="Completion Status: ")
        add_paragraph_styled(doc, issue['assignee'], bold_prefix="Assignee: ")
        add_paragraph_styled(doc, f"Issue Type: {issue['type']}")
        add_paragraph_styled(doc, issue['desc'])
        
        # Add attachments list
        if issue['attachments']:
            add_paragraph_styled(doc, "Linked Deliverables / Attachments in Jira:", bold_prefix="")
            for filename, file_desc in issue['attachments']:
                add_paragraph_styled(doc, f" {file_desc}", bold_prefix=f"• {filename}:")
        else:
            add_paragraph_styled(doc, "No attachments linked directly.", italic=True)

        # Add images
        if "images" in issue:
            for img_name, caption in issue['images']:
                img_path = f"docs/{img_name}"
                if os.path.exists(img_path):
                    try:
                        add_paragraph_styled(doc, "", bold_prefix=caption)
                        doc.add_picture(img_path, width=Inches(5.0))
                        p = doc.add_paragraph()
                        p.paragraph_format.space_before = Pt(4)
                        p.paragraph_format.space_after = Pt(8)
                    except Exception as e:
                        add_paragraph_styled(doc, f"[Image Error: Could not render image {img_name}. Details: {e}]", italic=True)
                else:
                    add_paragraph_styled(doc, f"[Screenshot image '{img_name}' not found in docs/ directory.]", italic=True)
        
        doc.add_page_break()

    # Let's list the other minor setup tasks at the end
    add_heading_styled(doc, "Setup & System Integration Work Items", level=2)
    add_paragraph_styled(doc, "The following tasks represent standard configurations and setup logs:")
    
    minor_tasks = [
        ("SCRUM-1", "Start here: Add your team's work", "In Progress", "Unassigned", "Default Atlassian initial setup guidelines ticket."),
        ("SCRUM-2", "Connect your coding agent to Jira", "In Progress", "Unassigned", "Configuration ticket linking IDE plugins to the Jira API."),
        ("SCRUM-3", "Connect Atlassian Rovo MCP to your local coding tools", "In Progress", "Unassigned", "Setup ticket configuring Atlassian Rovo protocol hooks."),
        ("SCRUM-4", "Delegate this work item to a coding agent", "In Progress", "Unassigned", "Subtask tracking automation actions."),
        ("SCRUM-5", "Implement this work item from your IDE or terminal", "In Progress", "Unassigned", "Subtask tracking manual code check-ins.")
    ]
    
    for key, summary, status, assignee, desc in minor_tasks:
        add_paragraph_styled(doc, f" | Status: {status} | Assignee: {assignee} - {desc}", bold_prefix=f"{key}: {summary}")

    # Save document
    doc.save("docs/Jira_Agile_Project_Management_Report_v2.docx")
    print("DOCX generated successfully at docs/Jira_Agile_Project_Management_Report_v2.docx!")

# ---------------- GENERATE HTML REPORT ----------------
def generate_jira_report_html():
    html_content = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Jira Agile Project Management Report - LMS</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
    body {
      font-family: 'Inter', sans-serif;
    }
    @media print {
      .no-print { display: none !important; }
      body { background: white !important; color: black !important; }
      .print-card { border: none !important; box-shadow: none !important; margin: 0 !important; padding: 0 !important; }
      .print-page-break { page-break-before: always; }
    }
  </style>
</head>
<body class="bg-slate-50 text-slate-800 min-h-screen pb-12">

  <!-- Header Banner (no-print) -->
  <header class="bg-indigo-900 text-white py-8 px-6 shadow-lg mb-8 no-print">
    <div class="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 class="text-3xl font-extrabold tracking-tight">Jira Agile Project Management Report</h1>
        <p class="text-indigo-200 mt-1">LMS Project Status Submission</p>
      </div>
      <div class="flex gap-3">
        <button onclick="window.print()" class="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow transition-all flex items-center gap-2">
          Save PDF / Print
        </button>
      </div>
    </div>
  </header>

  <main class="max-w-4xl mx-auto px-4 sm:px-6">
    <article class="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 md:p-12 space-y-12 print-card">
      
      <!-- PAGE 1 (Blank Placeholder for printing) -->
      <section class="h-[800px] border-2 border-dashed border-slate-200 flex items-center justify-center rounded-xl bg-slate-50/50 print:border-none print:h-0 print:overflow-hidden">
        <span class="text-slate-400 text-sm font-medium">[Page 1: Left Blank for Cover Page Details]</span>
      </section>

      <div class="print-page-break"></div>

      <!-- PAGE 2: Project Overview -->
      <section class="space-y-6 pt-6">
        <h2 class="text-3xl font-extrabold text-slate-900 border-l-4 border-indigo-600 pl-4">Project Overview</h2>
        <p class="text-slate-600 leading-relaxed">
          The Library Management System (LMS) is a single-page web application designed to digitize academic library operations. 
          The project aims to provide a reliable, premium interface for students, librarians, and administrators to streamline library workflows 
          such as cataloging books, managing member profiles, tracking checkouts, returns, waitlist queues, settings, and outstanding fines.
        </p>
        <p class="text-slate-600 leading-relaxed">
          Key functional modules developed within this application include:
        </p>
        <ul class="list-disc pl-6 space-y-2 text-slate-600">
          <li><strong>User Authentication:</strong> Access credentials validation with Role-Based Access Control (RBAC) separating Admin, Librarian, and Student views.</li>
          <li><strong>Book Cataloging:</strong> Comprehensive CRUD tools permitting catalog updates, live search, genre filters, and available stock control.</li>
          <li><strong>Member Registry:</strong> Roster of library cardholders and standing indicators (Active vs. Suspended accounts).</li>
          <li><strong>Issue & Return:</strong> Circulation logic checking borrowing limits, decrementing/incrementing stocks, and processing returns.</li>
          <li><strong>Fine Engine:</strong> Dynamic daily overdue fee accruals linked to transaction due dates with settlement ledgers.</li>
          <li><strong>Waitlist Queue:</strong> Book reservation system allowing students to request currently checked-out/out-of-stock items, which automatically update on return.</li>
          <li><strong>Admin Policy Settings:</strong> Administrative console to adjust borrow durations, maximum limits, and daily fine rates in real time.</li>
        </ul>
      </section>

      <div class="print-page-break"></div>

      <!-- PAGE 3: Jira Configuration -->
      <section class="space-y-6">
        <h2 class="text-3xl font-extrabold text-slate-900 border-l-4 border-indigo-600 pl-4">Jira Scrum Configuration</h2>
        <p class="text-slate-600 leading-relaxed">
          The project's lifecycle, sprints backlog, requirements mapping, database designs, and implementation steps were managed 
          exclusively using Agile Scrum methodologies on Atlassian Jira.
        </p>
        <div class="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-sm text-slate-700">
          <p><strong>Jira Project Key:</strong> SCRUM</p>
          <p><strong>Jira Site Workspace:</strong> <a href="https://vitstudent-team-r6bfp56o.atlassian.net" class="text-indigo-600 hover:underline">vitstudent-team-r6bfp56o.atlassian.net</a></p>
        </div>

        <h3 class="text-2xl font-bold text-slate-900 mt-6">Sprint Breakdown</h3>
        <p class="text-slate-600 leading-relaxed">
          The project was executed in exactly one active Scrum sprint covering planning, analysis, design, and code delivery phases 
          under the unified timeline: June 15, 2026 – August 30, 2026.
        </p>
        <div class="p-5 border border-indigo-100 bg-indigo-50/30 rounded-xl space-y-2">
          <p class="text-indigo-900 font-bold text-lg">SCRUM Sprint 1</p>
          <p class="text-xs font-semibold text-indigo-600">June 15, 2026 – August 30, 2026</p>
          <p class="text-slate-600 text-sm">
            <strong>Sprint Objective:</strong> To configure development environments, design normalized database layouts, draft requirements, 
            build authentication guards, implement core book cataloging forms, design member listings, develop book circulation transaction mechanisms, 
            integrate settings rules, and synchronize all source files directly to the Jira board issues.
          </p>
        </div>
      </section>

      <div class="print-page-break"></div>

      <!-- PAGE 4 ONWARDS: EPICS & TASKS DETAILS -->
      <section class="space-y-12">
        <h2 class="text-3xl font-extrabold text-slate-900 border-l-4 border-indigo-600 pl-4">Jira Epics & Tasks Breakdown</h2>

        <!-- SCRUM-12 -->
        <div class="border-b border-slate-200 pb-8 space-y-4">
          <div class="flex justify-between items-start">
            <h3 class="text-xl font-bold text-slate-900">SCRUM-12: Project Planning</h3>
            <span class="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">Done (100%)</span>
          </div>
          <p class="text-xs text-slate-500 font-mono">Type: Epic | Assignee: Sagar Bankapur</p>
          <p class="text-slate-600 text-sm">Governs the overall repository structure setup, initial scheduling, work packages planning, and project plan tracking.</p>
          <div class="text-xs text-slate-600 space-y-1">
            <p class="font-semibold text-slate-800">Attachments:</p>
            <p>• <strong>Project_Planning_and_Structure.docx</strong>: Document outlining structures and environment setups.</p>
            <p>• <strong>WhatsApp Image 2026-07-27 at 9.49.54 PM.jpeg</strong>: WBS setup handwritten photo.</p>
            <p>• <strong>WhatsApp Image 2026-07-27 at 9.49.56 PM.jpeg</strong>: WBS requirements handwritten photo.</p>
            <p>• <strong>WhatsApp Image 2026-07-27 at 9.49.57 PM.jpeg</strong>: WBS features handwritten photo.</p>
            <p>• <strong>WhatsApp Image 2026-07-27 at 9.50.00 PM.jpeg</strong>: WBS handover handwritten photo.</p>
          </div>
          <div class="grid grid-cols-2 gap-4 pt-4">
            <div class="border border-slate-200 rounded p-2 text-center bg-slate-50">
              <span class="text-xs font-bold block mb-1">Figure 1: WBS - Setup</span>
              <img src="WhatsApp%20Image%202026-07-27%20at%209.49.54%20PM.jpeg" class="max-h-48 mx-auto rounded">
            </div>
            <div class="border border-slate-200 rounded p-2 text-center bg-slate-50">
              <span class="text-xs font-bold block mb-1">Figure 2: WBS - Req & Design</span>
              <img src="WhatsApp%20Image%202026-07-27%20at%209.49.56%20PM.jpeg" class="max-h-48 mx-auto rounded">
            </div>
            <div class="border border-slate-200 rounded p-2 text-center bg-slate-50">
              <span class="text-xs font-bold block mb-1">Figure 3: WBS - Core Modules</span>
              <img src="WhatsApp%20Image%202026-07-27%20at%209.49.57%20PM.jpeg" class="max-h-48 mx-auto rounded">
            </div>
            <div class="border border-slate-200 rounded p-2 text-center bg-slate-50">
              <span class="text-xs font-bold block mb-1">Figure 4: WBS - Handover</span>
              <img src="WhatsApp%20Image%202026-07-27%20at%209.50.00%20PM.jpeg" class="max-h-48 mx-auto rounded">
            </div>
          </div>
        </div>

        <!-- SCRUM-11 -->
        <div class="border-b border-slate-200 pb-8 space-y-4">
          <div class="flex justify-between items-start">
            <h3 class="text-xl font-bold text-slate-900">SCRUM-11: Create Project Structure</h3>
            <span class="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">Done (100%)</span>
          </div>
          <p class="text-xs text-slate-500 font-mono">Type: Task (Parent: SCRUM-12) | Assignee: Sagar Bankapur</p>
          <p class="text-slate-600 text-sm">Initialize the Git code repository, compile developer packages (React, Vite, TypeScript), and configure compilation standards.</p>
          <div class="text-xs text-slate-600 space-y-1">
            <p class="font-semibold text-slate-800">Attachments:</p>
            <p>• <strong>library_management_system_codebase.zip</strong>: Zip containing initialized folder layout code.</p>
            <p>• <strong>Project_Planning_and_Structure.docx</strong>: Details directory layouts.</p>
          </div>
        </div>

        <!-- SCRUM-18 -->
        <div class="border-b border-slate-200 pb-8 space-y-4">
          <div class="flex justify-between items-start">
            <h3 class="text-xl font-bold text-slate-900">SCRUM-18: Requirement Analysis</h3>
            <span class="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">In Progress</span>
          </div>
          <p class="text-xs text-slate-500 font-mono">Type: Epic | Assignee: Unassigned</p>
          <p class="text-slate-600 text-sm">Captures system operational flow boundaries, user stories, validation thresholds, and drafts formal specifications documents.</p>
          <div class="text-xs text-slate-600 space-y-1">
            <p class="font-semibold text-slate-800">Attachments:</p>
            <p>• <strong>Requirements_Analysis_SRS.docx</strong>: Details functional specifications and use cases.</p>
            <p>• <strong>use_case_diagram.png</strong>: StarUML boundary use case diagram.</p>
          </div>
          <div class="border border-slate-200 rounded p-4 text-center bg-slate-50">
            <span class="text-xs font-bold block mb-2">Figure 5: StarUML Use Case Diagram</span>
            <img src="use_case_diagram.png" class="max-h-64 mx-auto rounded">
          </div>
        </div>

        <!-- SCRUM-10 -->
        <div class="border-b border-slate-200 pb-8 space-y-4">
          <div class="flex justify-between items-start">
            <h3 class="text-xl font-bold text-slate-900">SCRUM-10: Research Library Requirements</h3>
            <span class="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">In Progress</span>
          </div>
          <p class="text-xs text-slate-500 font-mono">Type: Task (Parent: SCRUM-18) | Assignee: Aella Harsha Vardhan Reddy 24BCE1254</p>
          <p class="text-slate-600 text-sm">Compile detailed business logic parameters, cardholder standing criteria, and model use cases diagrams.</p>
          <div class="text-xs text-slate-600 space-y-1">
            <p class="font-semibold text-slate-800">Attachments:</p>
            <p>• <strong>SRS.md</strong>, <strong>WBS.md</strong>, <strong>Requirements_Analysis_SRS.docx</strong>, <strong>use_case_diagram.png</strong>, <strong>Project_Planning_and_Structure.docx</strong>.</p>
          </div>
        </div>

        <!-- SCRUM-19 -->
        <div class="border-b border-slate-200 pb-8 space-y-4">
          <div class="flex justify-between items-start">
            <h3 class="text-xl font-bold text-slate-900">SCRUM-19: System Design</h3>
            <span class="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">In Progress</span>
          </div>
          <p class="text-xs text-slate-500 font-mono">Type: Epic | Assignee: Aella Harsha Vardhan Reddy 24BCE1254</p>
          <p class="text-slate-600 text-sm">Draft relational database schemes, entity representations, relationships cardinality, and structural ERDs.</p>
          <div class="text-xs text-slate-600 space-y-1">
            <p class="font-semibold text-slate-800">Attachments:</p>
            <p>• <strong>System_Design_Database_Schema.docx</strong>: Schema specifications document.</p>
            <p>• <strong>er_diagram.png</strong>: StarUML ER diagram.</p>
          </div>
          <div class="border border-slate-200 rounded p-4 text-center bg-slate-50">
            <span class="text-xs font-bold block mb-2">Figure 6: StarUML Entity-Relationship Diagram</span>
            <img src="er_diagram.png" class="max-h-64 mx-auto rounded">
          </div>
        </div>

        <!-- SCRUM-6 -->
        <div class="border-b border-slate-200 pb-8 space-y-4">
          <div class="flex justify-between items-start">
            <h3 class="text-xl font-bold text-slate-900">SCRUM-6: Design Database Schema</h3>
            <span class="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">In Progress</span>
          </div>
          <p class="text-xs text-slate-500 font-mono">Type: Task (Parent: SCRUM-19) | Assignee: Sagar Bankapur</p>
          <p class="text-slate-600 text-sm">Establish normalized 3NF relational data tables (users, members, books, transactions, fines, settings, and reservations).</p>
          <div class="text-xs text-slate-600 space-y-1">
            <p class="font-semibold text-slate-800">Attachments:</p>
            <p>• <strong>Database_Design.md</strong>, <strong>System_Design_Database_Schema.docx</strong>, <strong>er_diagram.png</strong>.</p>
          </div>
        </div>

        <!-- SCRUM-13 -->
        <div class="border-b border-slate-200 pb-8 space-y-4">
          <div class="flex justify-between items-start">
            <h3 class="text-xl font-bold text-slate-900">SCRUM-13: User Authentication</h3>
            <span class="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">In Progress</span>
          </div>
          <p class="text-xs text-slate-500 font-mono">Type: Epic | Assignee: Sagar Bankapur</p>
          <p class="text-slate-600 text-sm">Enforces security boundaries, login interface views, session storage, and route authorization contexts.</p>
        </div>

        <!-- SCRUM-7 -->
        <div class="border-b border-slate-200 pb-8 space-y-4">
          <div class="flex justify-between items-start">
            <h3 class="text-xl font-bold text-slate-900">SCRUM-7: Create Login Page UI</h3>
            <span class="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">In Progress</span>
          </div>
          <p class="text-xs text-slate-500 font-mono">Type: Task (Parent: SCRUM-13) | Assignee: Aella Harsha Vardhan Reddy 24BCE1254</p>
          <p class="text-slate-600 text-sm">Build the frontend login UI component including input validations and glassmorphism themes styling.</p>
          <div class="text-xs text-slate-600 space-y-1">
            <p class="font-semibold text-slate-800">Attachments:</p>
            <p>• <strong>Login.tsx</strong>: React code file for login view.</p>
            <p>• <strong>login_ui_mockup.png</strong>: UI page screenshot.</p>
          </div>
          <div class="border border-slate-200 rounded p-4 text-center bg-slate-50">
            <span class="text-xs font-bold block mb-2">Figure 7: Glassmorphic Login UI Mockup</span>
            <img src="login_ui_mockup.png" class="max-h-64 mx-auto rounded">
          </div>
        </div>

        <!-- SCRUM-8 -->
        <div class="border-b border-slate-200 pb-8 space-y-4">
          <div class="flex justify-between items-start">
            <h3 class="text-xl font-bold text-slate-900">SCRUM-8: Implement User Authentication</h3>
            <span class="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">In Progress</span>
          </div>
          <p class="text-xs text-slate-500 font-mono">Type: Task (Parent: SCRUM-13) | Assignee: Sagar Bankapur</p>
          <p class="text-slate-600 text-sm">Develop local storage session persistence and Role-Based Access Control (RBAC) hooks.</p>
          <div class="text-xs text-slate-600 space-y-1">
            <p class="font-semibold text-slate-800">Attachments:</p>
            <p>• <strong>AuthContext.tsx</strong>: Context wrapper source code.</p>
          </div>
        </div>

        <!-- SCRUM-14 -->
        <div class="border-b border-slate-200 pb-8 space-y-4">
          <div class="flex justify-between items-start">
            <h3 class="text-xl font-bold text-slate-900">SCRUM-14: Book Management</h3>
            <span class="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">In Progress</span>
          </div>
          <p class="text-xs text-slate-500 font-mono">Type: Epic | Assignee: Sagar Bankapur</p>
          <p class="text-slate-600 text-sm">Manages book catalogs, availability indicators, search filters, and inventory modifications.</p>
          <div class="text-xs text-slate-600 space-y-1">
            <p class="font-semibold text-slate-800">Attachments:</p>
            <p>• <strong>Books.tsx</strong>: Books component source file.</p>
          </div>
        </div>

        <!-- SCRUM-9 -->
        <div class="border-b border-slate-200 pb-8 space-y-4">
          <div class="flex justify-between items-start">
            <h3 class="text-xl font-bold text-slate-900">SCRUM-9: Design Book Management Module</h3>
            <span class="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">In Progress</span>
          </div>
          <p class="text-xs text-slate-500 font-mono">Type: Task (Parent: SCRUM-14) | Assignee: Sagar Bankapur</p>
          <p class="text-slate-600 text-sm">Build inventory forms enabling librarians to add, edit, and archive book resources, alongside search filters.</p>
          <div class="text-xs text-slate-600 space-y-1">
            <p class="font-semibold text-slate-800">Attachments:</p>
            <p>• <strong>Books.tsx</strong>: React file.</p>
            <p>• <strong>book_catalog_1785261304299.png</strong>: UI screenshot.</p>
          </div>
          <div class="border border-slate-200 rounded p-4 text-center bg-slate-50">
            <span class="text-xs font-bold block mb-2">Figure 8: Book Catalog View UI Screen</span>
            <img src="book_catalog_1785261304299.png" class="max-h-64 mx-auto rounded">
          </div>
        </div>

        <!-- SCRUM-15 -->
        <div class="border-b border-slate-200 pb-8 space-y-4">
          <div class="flex justify-between items-start">
            <h3 class="text-xl font-bold text-slate-900">SCRUM-15: Member Management</h3>
            <span class="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">In Progress</span>
          </div>
          <p class="text-xs text-slate-500 font-mono">Type: Epic | Assignee: Sagar Bankapur</p>
          <p class="text-slate-600 text-sm">Manages cardholder registries, enrollment details, active borrowings limits, and member suspensions.</p>
          <div class="text-xs text-slate-600 space-y-1">
            <p class="font-semibold text-slate-800">Attachments:</p>
            <p>• <strong>MyLoans.tsx</strong>: Student loans view component code.</p>
          </div>
        </div>

        <!-- SCRUM-16 -->
        <div class="border-b border-slate-200 pb-8 space-y-4">
          <div class="flex justify-between items-start">
            <h3 class="text-xl font-bold text-slate-900">SCRUM-16: Issue & Return</h3>
            <span class="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">In Progress</span>
          </div>
          <p class="text-xs text-slate-500 font-mono">Type: Epic | Assignee: Aella Harsha Vardhan Reddy 24BCE1254</p>
          <p class="text-slate-600 text-sm">Core transaction circulation log handler processing checkouts, check-ins, return dates, and daily fines calculation.</p>
          <div class="text-xs text-slate-600 space-y-1">
            <p class="font-semibold text-slate-800">Attachments:</p>
            <p>• <strong>LibraryContext.tsx</strong>, <strong>storage.ts</strong>, <strong>library_management_system_advanced_features.zip</strong>.</p>
            <p>• <strong>checkout_activity_diagram.png</strong>: Issue flow activity diagram.</p>
            <p>• <strong>return_activity_diagram.png</strong>: Return flow activity diagram.</p>
          </div>
          <div class="grid grid-cols-2 gap-4 pt-4">
            <div class="border border-slate-200 rounded p-2 text-center bg-slate-50">
              <span class="text-xs font-bold block mb-1">Figure 9: StarUML Book Checkout Workflow</span>
              <img src="checkout_activity_diagram.png" class="max-h-48 mx-auto rounded">
            </div>
            <div class="border border-slate-200 rounded p-2 text-center bg-slate-50">
              <span class="text-xs font-bold block mb-1">Figure 10: StarUML Book Return Workflow</span>
              <img src="return_activity_diagram.png" class="max-h-48 mx-auto rounded">
            </div>
          </div>
        </div>

        <!-- SCRUM-17 -->
        <div class="border-b border-slate-200 pb-8 space-y-4">
          <div class="flex justify-between items-start">
            <h3 class="text-xl font-bold text-slate-900">SCRUM-17: Reports & Dashboard</h3>
            <span class="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">In Progress</span>
          </div>
          <p class="text-xs text-slate-500 font-mono">Type: Epic | Assignee: Aella Harsha Vardhan Reddy 24BCE1254</p>
          <p class="text-slate-600 text-sm">Librarian metrics dash panel, transaction grids, fine ledgers, waitlists queue, and administrative policies configurator.</p>
          <div class="text-xs text-slate-600 space-y-1">
            <p class="font-semibold text-slate-800">Attachments:</p>
            <p>• <strong>Dashboard.tsx</strong>, <strong>Settings.tsx</strong>, <strong>Project_Status_Snapshot.md</strong>, <strong>main_dashboard_1785261292483.png</strong>.</p>
          </div>
          <div class="border border-slate-200 rounded p-4 text-center bg-slate-50">
            <span class="text-xs font-bold block mb-2">Figure 11: Librarian Dashboard UI Screen</span>
            <img src="main_dashboard_1785261292483.png" class="max-h-64 mx-auto rounded">
          </div>
        </div>

      </section>

      <div class="print-page-break"></div>

      <!-- Minor Setup Tasks -->
      <section class="space-y-4">
        <h3 class="text-2xl font-bold text-slate-900 mt-6">Setup & System Integration Work Items</h3>
        <p class="text-slate-600 leading-relaxed text-sm">The following tasks represent standard configurations and setup logs:</p>
        <div class="space-y-3 text-sm text-slate-600">
          <p>• <strong>SCRUM-1: Start here: Add your team's work</strong> (In Progress - Unassigned): Default Atlassian initial setup guidelines ticket.</p>
          <p>• <strong>SCRUM-2: Connect your coding agent to Jira</strong> (In Progress - Unassigned): Configuration ticket linking IDE plugins to the Jira API.</p>
          <p>• <strong>SCRUM-3: Connect Atlassian Rovo MCP to your local coding tools</strong> (In Progress - Unassigned): Setup ticket configuring Atlassian Rovo protocol hooks.</p>
          <p>• <strong>SCRUM-4: Delegate this work item to a coding agent</strong> (In Progress - Unassigned): Subtask tracking automation actions.</p>
          <p>• <strong>SCRUM-5: Implement this work item from your IDE or terminal</strong> (In Progress - Unassigned): Subtask tracking manual code check-ins.</p>
        </div>
      </section>

    </article>
  </main>

</body>
</html>
"""
    with open("docs/Jira_Agile_Project_Management_Report_v2.html", "w", encoding="utf-8") as f:
        f.write(html_content)
    print("HTML generated successfully at docs/Jira_Agile_Project_Management_Report_v2.html!")

if __name__ == "__main__":
    os.makedirs("docs", exist_ok=True)
    build_jira_report_docx()
    generate_jira_report_html()
    print("All assignment documents compiled successfully!")
