import os
import sys
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        if self._pageNumber == 1:
            return

        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))

        # Running Header
        self.drawString(42, letter[1] - 28, "Golf Subscription & Charity Draw Platform — Technical Project Report")
        self.drawRightString(letter[0] - 42, letter[1] - 28, "Candidate: Vipul Chandra Mishra")
        self.setStrokeColor(colors.HexColor("#E2E8F0"))
        self.setLineWidth(0.75)
        self.line(42, letter[1] - 34, letter[0] - 42, letter[1] - 34)

        # Running Footer
        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(letter[0] - 42, 24, page_text)
        self.drawString(42, 24, "Confidential — Submission to Project Assigner | https://github.com/VCM-5105")
        self.line(42, 34, letter[0] - 42, 34)
        self.restoreState()


def build_pdf(filename):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=42,
        rightMargin=42,
        topMargin=42,
        bottomMargin=42
    )

    styles = getSampleStyleSheet()

    # Custom Palette
    PRIMARY = colors.HexColor("#1B4332")     # Deep Augusta Green
    SECONDARY = colors.HexColor("#2D6A4F")   # Forest Green
    ACCENT = colors.HexColor("#D97706")      # Warm Amber / Gold
    DARK = colors.HexColor("#0F172A")        # Slate 900
    BODY_TEXT = colors.HexColor("#334155")   # Slate 700
    LIGHT_BG = colors.HexColor("#F8FAFC")    # Slate 50
    CARD_BORDER = colors.HexColor("#CBD5E1") # Slate 300

    # Custom Typography Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=PRIMARY,
        spaceAfter=4
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10.5,
        leading=14,
        textColor=SECONDARY,
        spaceAfter=10
    )

    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=15,
        textColor=PRIMARY,
        spaceBefore=10,
        spaceAfter=5,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Heading3'],
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=12,
        textColor=SECONDARY,
        spaceBefore=6,
        spaceAfter=2,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11.5,
        textColor=BODY_TEXT,
        spaceAfter=4
    )

    bullet_style = ParagraphStyle(
        'Bullet_Custom',
        parent=body_style,
        leftIndent=10,
        firstLineIndent=-6,
        spaceAfter=2.5
    )

    code_style = ParagraphStyle(
        'Code_Custom',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=7.5,
        leading=10,
        textColor=colors.HexColor("#0F172A")
    )

    meta_label = ParagraphStyle('MetaLabel', fontName='Helvetica-Bold', fontSize=8.5, leading=11, textColor=DARK)
    meta_val = ParagraphStyle('MetaVal', fontName='Helvetica', fontSize=8.5, leading=11, textColor=BODY_TEXT)
    tbl_cell = ParagraphStyle('TableCell', fontName='Helvetica', fontSize=8, leading=10, textColor=BODY_TEXT)
    tbl_header = ParagraphStyle('TableHeader', fontName='Helvetica-Bold', fontSize=8, leading=10, textColor=colors.white)

    story = []

    # ==========================================
    # COVER / HEADER BLOCK
    # ==========================================
    story.append(Paragraph("PROJECT SUBMISSION & TECHNICAL ARCHITECTURE REPORT", subtitle_style))
    story.append(Paragraph("Golf Subscription, Score Tracking & Charity Draw Platform", title_style))
    story.append(Paragraph("An End-to-End Enterprise SaaS Solution with Stableford Handicap Calculations, Rollover Draw Mechanics, and Philanthropic Giving", body_style))
    story.append(Spacer(1, 8))

    # Candidate Meta Card Table
    meta_data = [
        [Paragraph("Candidate Name:", meta_label), Paragraph("Vipul Chandra Mishra", meta_val),
         Paragraph("Submission Date:", meta_label), Paragraph("September 22, 2026", meta_val)],
        [Paragraph("Email Address:", meta_label), Paragraph("vcmvipul5105@gmail.com", meta_val),
         Paragraph("Deployment Environment:", meta_label), Paragraph("Vercel (Production) + Supabase", meta_val)],
        [Paragraph("Contact Number:", meta_label), Paragraph("+91-8340256955", meta_val),
         Paragraph("Application Architecture:", meta_label), Paragraph("React 19 + Express.js ESM + PostgreSQL", meta_val)],
        [Paragraph("GitHub Repository:", meta_label), Paragraph('<font color="#1B4332"><u>https://github.com/VCM-5105/Golf-subscription</u></font>', meta_val),
         Paragraph("Build Status:", meta_label), Paragraph("Passing (0 Errors, Monorepo Deployed)", meta_val)]
    ]
    t_meta = Table(meta_data, colWidths=[100, 160, 110, 134])
    t_meta.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#F1F5F9")),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#CBD5E1")),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(t_meta)
    story.append(Spacer(1, 12))

    # ==========================================
    # SECTION 1: EXECUTIVE SUMMARY
    # ==========================================
    story.append(Paragraph("1. Executive Summary & Specification Fulfillment", h1_style))
    story.append(Paragraph(
        "This project is a high-performance web platform engineered to connect amateur golfers with automated monthly reward draws and verified charitable giving. "
        "The system complies 100% with the provided specification deck, implementing real database persistence through <b>Supabase PostgreSQL</b>, a decoupled <b>Node.js (ESM) / Express</b> REST API, and a responsive <b>React 19 / Vite</b> user interface. "
        "All static mocks have been eliminated; 100% of user data, scores, draw tickets, charity pools, and audit logs are dynamically managed in real time.",
        body_style
    ))

    key_spec_data = [
        [Paragraph("Specification Requirement", tbl_header), Paragraph("Architectural Implementation", tbl_header), Paragraph("Compliance", tbl_header)],
        [Paragraph("3 Distinct User Roles", tbl_cell), Paragraph("Public Visitors, Active Subscribers, and Platform Administrators with protected route guards.", tbl_cell), Paragraph("100% Verified", tbl_cell)],
        [Paragraph("Stableford Score Engine", tbl_cell), Paragraph("1–45 net points, single score per calendar date, FIFO sliding window retaining exactly 5 recent rounds.", tbl_cell), Paragraph("100% Verified", tbl_cell)],
        [Paragraph("Automated Ticket Bridge", tbl_cell), Paragraph("Active subscribers with 5 recorded rounds automatically have tickets generated for the active monthly draw.", tbl_cell), Paragraph("100% Verified", tbl_cell)],
        [Paragraph("3-Tier Draw Engine & Rollover", tbl_cell), Paragraph("Tier 1: Match 5 (40% + Rollover), Tier 2: Match 4 (35%), Tier 3: Match 3 (25%). Automatic jackpot rollover.", tbl_cell), Paragraph("100% Verified", tbl_cell)],
        [Paragraph("Charity Giving Engine", tbl_cell), Paragraph("Minimum 10% pledge allocation from memberships, dynamic charity rosters, and administrative transfer ledger.", tbl_cell), Paragraph("100% Verified", tbl_cell)],
        [Paragraph("Winner Scorecard Verification", tbl_cell), Paragraph("State machine: Pending Submission -> Pending Verification -> Verified / Rejected -> Paid, with audit trail.", tbl_cell), Paragraph("100% Verified", tbl_cell)],
        [Paragraph("5 Admin Control Surfaces", tbl_cell), Paragraph("User Management, Score Overrides, Draw Simulator/Publisher, Winner Audit Queue, Charity Disbursements.", tbl_cell), Paragraph("100% Verified", tbl_cell)]
    ]
    t_spec = Table(key_spec_data, colWidths=[140, 294, 70])
    t_spec.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PRIMARY),
        ('BOX', (0, 0), (-1, -1), 0.75, colors.HexColor("#CBD5E1")),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, LIGHT_BG]),
        ('TOPPADDING', (0, 0), (-1, -1), 3),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
    ]))
    story.append(t_spec)
    story.append(Spacer(1, 10))

    # ==========================================
    # SECTION 2: SYSTEM ARCHITECTURE
    # ==========================================
    story.append(Paragraph("2. System Architecture & Technology Stack", h1_style))
    story.append(Paragraph(
        "The application utilizes a scalable multi-tier monorepo architecture engineered for cloud-native deployment:",
        body_style
    ))
    story.append(Paragraph("• <b>Frontend Layer</b>: React 19 SPA bootstrapped with Vite, styled with Tailwind CSS, lucide-react icons, and custom responsive layouts adhering strictly to modern UI standards (Inter & Plus Jakarta Sans typography, no obsolete symbols, zero footers).", bullet_style))
    story.append(Paragraph("• <b>API Gateway & Serverless Layer</b>: Node.js (ECMAScript Modules) Express framework running seamlessly inside Vercel Serverless Functions via <font face='Courier'>vercel.json</font> rewrites and an optimized <font face='Courier'>api/index.js</font> entrypoint.", bullet_style))
    story.append(Paragraph("• <b>Database Layer</b>: Remote Supabase PostgreSQL instance utilizing relational integrity, foreign keys, unique constraint indexes, and Row-Level Security policies.", bullet_style))
    story.append(Paragraph("• <b>Security Architecture</b>: Dual-channel authentication supporting both <font face='Courier'>httpOnly</font> cookies and stateless JSON Web Token (JWT) Bearer headers, protected by <font face='Courier'>bcryptjs</font> password salting (10 rounds).", bullet_style))

    story.append(PageBreak())

    # ==========================================
    # SECTION 3: CORE BACKEND ENGINES & LOGIC
    # ==========================================
    story.append(Paragraph("3. Deep-Dive Backend Business Logic & Algorithms", h1_style))

    story.append(Paragraph("3.1. Stableford Score Engine & FIFO Sliding Window Algorithm", h2_style))
    story.append(Paragraph(
        "Amateur golfers enter net Stableford points earned during their rounds. The backend (<font face='Courier'>backend/src/controllers/score.controller.js</font>) enforces strict mathematical constraints and a FIFO sliding window:",
        body_style
    ))
    story.append(Paragraph("1. <b>Bound Validation</b>: Scores must be integers between 1 and 45 inclusive. Out-of-bounds submissions are immediately rejected with an HTTP 400 Bad Request.", bullet_style))
    story.append(Paragraph("2. <b>Calendar Date Uniqueness</b>: A user may record at most one score per date. Supabase enforces a compound unique index (<font face='Courier'>user_id, date</font>), preventing duplicate rounds.", bullet_style))
    story.append(Paragraph("3. <b>FIFO Eviction Model</b>: Upon inserting a new score, the system queries all scores for the player ordered descending by date. If the count exceeds 5, the surplus oldest rounds are purged: <font face='Courier'>idsToDelete = allScores.slice(5).map(s => s.id)</font>.", bullet_style))
    story.append(Paragraph("4. <b>Dynamic Analytics</b>: Real-time statistics are calculated in O(N) time for the 5-round window, yielding rolling average, career best, and round variance.", bullet_style))

    story.append(Paragraph("3.2. Automatic Draw Ticket Bridge (ticketSync.js)", h2_style))
    story.append(Paragraph(
        "A critical innovation in the platform is the zero-friction draw entry system. Players do not purchase separate lottery tickets; their golf scores <i>become</i> their lottery numbers.",
        body_style
    ))
    story.append(Paragraph("• Whenever a score is added/deleted or a user's subscription changes, <font face='Courier'>syncUserDrawTicket(userId)</font> triggers automatically.", bullet_style))
    story.append(Paragraph("• If the user holds an <b>active subscription</b> AND has <b>exactly 5 scores</b> in their portfolio, the 5 numbers are sorted ascending <font face='Courier'>[s1, s2, s3, s4, s5]</font> and synced directly into the active draw in the <font face='Courier'>tickets</font> table.", bullet_style))
    story.append(Paragraph("• If a player's membership lapses or their score count drops below 5, their ticket is automatically purged, preventing ineligible entries.", bullet_style))

    story.append(Paragraph("3.3. 3-Tier Reward Draw Engine & Rollover Mathematical Model", h2_style))
    story.append(Paragraph(
        "Monthly draws (<font face='Courier'>backend/src/controllers/draw.controller.js</font>, <font face='Courier'>admin.controller.js</font>) execute with strict prize distribution formulas:",
        body_style
    ))

    draw_math_data = [
        [Paragraph("Prize Tier", tbl_header), Paragraph("Matching Condition", tbl_header), Paragraph("Pool Allocation Formula", tbl_header), Paragraph("Rollover Behavior", tbl_header)],
        [Paragraph("<b>Tier 1 (Jackpot)</b>", tbl_cell), Paragraph("Match all 5 numbers", tbl_cell), Paragraph("<b>40% of Base Pool + Rollover</b>", tbl_cell), Paragraph("If 0 winners, 100% of Tier 1 rolls over to next month", tbl_cell)],
        [Paragraph("<b>Tier 2</b>", tbl_cell), Paragraph("Match 4 of 5 numbers", tbl_cell), Paragraph("<b>35% of Base Pool</b>", tbl_cell), Paragraph("Shared equally among Tier 2 winners; no rollover", tbl_cell)],
        [Paragraph("<b>Tier 3</b>", tbl_cell), Paragraph("Match 3 of 5 numbers", tbl_cell), Paragraph("<b>25% of Base Pool</b>", tbl_cell), Paragraph("Shared equally among Tier 3 winners; no rollover", tbl_cell)]
    ]
    t_draw = Table(draw_math_data, colWidths=[90, 110, 160, 144])
    t_draw.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), SECONDARY),
        ('BOX', (0, 0), (-1, -1), 0.75, colors.HexColor("#CBD5E1")),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, LIGHT_BG]),
        ('TOPPADDING', (0, 0), (-1, -1), 3),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
    ]))
    story.append(t_draw)
    story.append(Spacer(1, 4))
    story.append(Paragraph(
        "<b>Base Pool Calculation</b>: £10 per active eligible ticket. Rollovers are tracked persistently in the <font face='Courier'>settings</font> table under <font face='Courier'>key = 'jackpot'</font>.",
        body_style
    ))

    story.append(Paragraph("3.4. Winner Verification State Machine", h2_style))
    story.append(Paragraph(
        "To uphold competitive fairness, prize payouts are governed by an audit state machine (<font face='Courier'>winner.controller.js</font>):",
        body_style
    ))
    story.append(Paragraph("• <b>pending_submission</b>: Draw publishes; winners notified. Player must upload signed club scorecard proof.", bullet_style))
    story.append(Paragraph("• <b>pending_verification</b>: Proof received. Administrator reviews scorecard image against submitted Stableford points.", bullet_style))
    story.append(Paragraph("• <b>verified / rejected</b>: Administrator validates authenticity or flags discrepancies with corrective audit notes.", bullet_style))
    story.append(Paragraph("• <b>paid</b>: Treasury disburses winnings, completing the audit cycle.", bullet_style))

    story.append(Paragraph("3.5. Philanthropic Giving Engine", h2_style))
    story.append(Paragraph(
        "Subscribers select an accredited charity partner and pledge between 10% and 100% of their subscription fee. "
        "The system aggregates real-time contributions across user bases, recording monthly disbursements and tracking verified impact badges.",
        body_style
    ))

    # ==========================================
    # SECTION 4: DATABASE ARCHITECTURE
    # ==========================================
    story.append(Paragraph("4. Relational Database Schema (Supabase PostgreSQL)", h1_style))

    schema_data = [
        [Paragraph("Table", tbl_header), Paragraph("Primary Key", tbl_header), Paragraph("Key Foreign Keys & Columns", tbl_header), Paragraph("Indexed Attributes", tbl_header)],
        [Paragraph("<b>users</b>", tbl_cell), Paragraph("id (text)", tbl_cell), Paragraph("email, password, role, subscription (jsonb), charity (jsonb)", tbl_cell), Paragraph("email (unique, ilike)", tbl_cell)],
        [Paragraph("<b>scores</b>", tbl_cell), Paragraph("id (text)", tbl_cell), Paragraph("user_id -> users(id), score (int 1-45), date (date), course", tbl_cell), Paragraph("(user_id, date) UNIQUE", tbl_cell)],
        [Paragraph("<b>tickets</b>", tbl_cell), Paragraph("id (text)", tbl_cell), Paragraph("draw_id -> draws(id), user_id -> users(id), numbers (int[])", tbl_cell), Paragraph("(draw_id, user_id) UNIQUE", tbl_cell)],
        [Paragraph("<b>draws</b>", tbl_cell), Paragraph("id (text)", tbl_cell), Paragraph("draw_number, draw_date, winning_numbers (int[]), rollover_jackpot", tbl_cell), Paragraph("draw_date, status", tbl_cell)],
        [Paragraph("<b>winners</b>", tbl_cell), Paragraph("id (text)", tbl_cell), Paragraph("draw_id, user_id, match_tier, prize_amount, verification_status", tbl_cell), Paragraph("draw_id, verification_status", tbl_cell)],
        [Paragraph("<b>charities</b>", tbl_cell), Paragraph("id (text)", tbl_cell), Paragraph("name, category, total_raised, active_supporters", tbl_cell), Paragraph("name", tbl_cell)],
        [Paragraph("<b>settings</b>", tbl_cell), Paragraph("key (text)", tbl_cell), Paragraph("value (jsonb) [currentJackpotRollover, minCharityPct]", tbl_cell), Paragraph("key (primary)", tbl_cell)]
    ]
    t_schema = Table(schema_data, colWidths=[65, 60, 240, 139])
    t_schema.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PRIMARY),
        ('BOX', (0, 0), (-1, -1), 0.75, colors.HexColor("#CBD5E1")),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, LIGHT_BG]),
        ('TOPPADDING', (0, 0), (-1, -1), 2.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2.5),
    ]))
    story.append(t_schema)
    story.append(Spacer(1, 6))

    # ==========================================
    # SECTION 5: PRODUCTION HARDENING & DEPLOYMENT
    # ==========================================
    story.append(Paragraph("5. Production Engineering & Cloud Hardening", h1_style))
    story.append(Paragraph(
        "Deploying an Express backend alongside a Vite React frontend in a unified Vercel Serverless environment presented unique architectural challenges. "
        "The following production-grade solutions were implemented to achieve zero-downtime operation:",
        body_style
    ))

    prod_fixes = [
        [Paragraph("Production Hurdle", tbl_header), Paragraph("Root Cause", tbl_header), Paragraph("Engineering Resolution", tbl_header)],
        [Paragraph("<b>405 Method Not Allowed</b>", tbl_cell), Paragraph("Vercel routing treated <font face='Courier'>/api/*</font> as static frontend assets.", tbl_cell), Paragraph("Configured <font face='Courier'>vercel.json</font> service schema and explicit URL rewrite rules directing <font face='Courier'>/api/(.*)</font> to the backend.", tbl_cell)],
        [Paragraph("<b>Serverless Filesystem Crash (ENOENT)</b>", tbl_cell), Paragraph("Multer middleware called <font face='Courier'>fs.mkdirSync</font> on the read-only AWS Lambda/Vercel <font face='Courier'>/var/task</font> directory.", tbl_cell), Paragraph("Architected dynamic environment detection: routes uploads to <font face='Courier'>os.tmpdir()</font> (<font face='Courier'>/tmp/uploads</font>) in serverless mode, and safely handles missing directories.", tbl_cell)],
        [Paragraph("<b>Process Abort (500 Error)</b>", tbl_cell), Paragraph("Legacy DB helper invoked <font face='Courier'>process.exit(1)</font> during cold starts.", tbl_cell), Paragraph("Refactored to non-blocking client initialization with non-fatal logging, allowing serverless invocation reuse.", tbl_cell)],
        [Paragraph("<b>Opaque Client Error Parsing</b>", tbl_cell), Paragraph("Vite frontend discarded non-JSON error bodies, showing generic fallbacks.", tbl_cell), Paragraph("Enhanced <font face='Courier'>api.js</font> to inspect raw response text before JSON parsing, surfacing exact diagnostic messages in the UI.", tbl_cell)],
        [Paragraph("<b>Live Diagnostic Endpoint</b>", tbl_cell), Paragraph("Lack of visibility into production environment credentials.", tbl_cell), Paragraph("Built <font face='Courier'>GET /api/v1/health</font> reporting live Supabase connectivity and credential existence flags.", tbl_cell)]
    ]
    t_fixes = Table(prod_fixes, colWidths=[110, 180, 214])
    t_fixes.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PRIMARY),
        ('BOX', (0, 0), (-1, -1), 0.75, colors.HexColor("#CBD5E1")),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, LIGHT_BG]),
        ('TOPPADDING', (0, 0), (-1, -1), 3),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
    ]))
    story.append(t_fixes)
    story.append(Spacer(1, 8))

    # ==========================================
    # SECTION 6: API SPECIFICATION OVERVIEW
    # ==========================================
    story.append(PageBreak())
    story.append(Paragraph("6. Key REST API Endpoints Specification", h1_style))

    api_data = [
        [Paragraph("Method & Route", tbl_header), Paragraph("Access Level", tbl_header), Paragraph("Description & Functional Purpose", tbl_header)],
        [Paragraph("POST /api/v1/auth/register", tbl_cell), Paragraph("Public", tbl_cell), Paragraph("Registers new player account with bcrypt hashing and defaults.", tbl_cell)],
        [Paragraph("POST /api/v1/auth/login", tbl_cell), Paragraph("Public", tbl_cell), Paragraph("Authenticates credentials, sets httpOnly cookie, and returns JWT.", tbl_cell)],
        [Paragraph("GET /api/v1/scores", tbl_cell), Paragraph("Subscriber", tbl_cell), Paragraph("Retrieves current 5 retained scores and calculated rolling stats.", tbl_cell)],
        [Paragraph("POST /api/v1/scores", tbl_cell), Paragraph("Subscriber", tbl_cell), Paragraph("Submits Stableford score (1-45), executes FIFO eviction, triggers ticket sync.", tbl_cell)],
        [Paragraph("GET /api/v1/draws/active", tbl_cell), Paragraph("Public / Auth", tbl_cell), Paragraph("Returns current prize pool, rollover jackpot, and user active ticket.", tbl_cell)],
        [Paragraph("POST /api/v1/admin/draws/simulate", tbl_cell), Paragraph("Admin", tbl_cell), Paragraph("Simulates draw outcome across all tickets without committing state.", tbl_cell)],
        [Paragraph("POST /api/v1/admin/draws/publish", tbl_cell), Paragraph("Admin", tbl_cell), Paragraph("Publishes winning numbers, records winners, updates rollover ledger.", tbl_cell)],
        [Paragraph("POST /api/v1/winners/:id/proof", tbl_cell), Paragraph("Winner", tbl_cell), Paragraph("Uploads scorecard proof image for admin verification.", tbl_cell)],
        [Paragraph("PATCH /api/v1/admin/winners/:id", tbl_cell), Paragraph("Admin", tbl_cell), Paragraph("Audits winner scorecard proof, sets verified/rejected/paid state.", tbl_cell)],
        [Paragraph("GET /api/v1/health", tbl_cell), Paragraph("Public", tbl_cell), Paragraph("Returns serverless diagnostic health, timestamp, and database status.", tbl_cell)]
    ]
    t_api = Table(api_data, colWidths=[160, 80, 264])
    t_api.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), SECONDARY),
        ('BOX', (0, 0), (-1, -1), 0.75, colors.HexColor("#CBD5E1")),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, LIGHT_BG]),
        ('TOPPADDING', (0, 0), (-1, -1), 2.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2.5),
    ]))
    story.append(t_api)
    story.append(Spacer(1, 8))

    # ==========================================
    # SECTION 7: CONCLUSION & SIGN-OFF
    # ==========================================
    story.append(Paragraph("7. Verification, Validation & Assigner Sign-Off", h1_style))
    story.append(Paragraph(
        "The project has been tested end-to-end across multiple test cycles covering user registration, authentication, score submissions, FIFO evictions, ticket synchronizations, draw simulation, and scorecard verification. "
        "All code is committed and live on GitHub at <b>https://github.com/VCM-5105/Golf-subscription</b> and deployed to production.",
        body_style
    ))
    story.append(Spacer(1, 6))

    sign_data = [
        [Paragraph("<b>Submitted By:</b>", meta_label), Paragraph("Vipul Chandra Mishra (vcmvipul5105@gmail.com)", meta_val)],
        [Paragraph("<b>Candidate Signature:</b>", meta_label), Paragraph("<i>Vipul Chandra Mishra</i>", meta_val)],
        [Paragraph("<b>Assigned Reviewer:</b>", meta_label), Paragraph("Project Evaluator / Hiring Manager", meta_val)],
        [Paragraph("<b>Review Status:</b>", meta_label), Paragraph("Completed & Submitted for Final Evaluation", meta_val)]
    ]
    t_sign = Table(sign_data, colWidths=[140, 364])
    t_sign.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#F8FAFC")),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#CBD5E1")),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
        ('TOPPADDING', (0, 0), (-1, -1), 3),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
    ]))
    story.append(t_sign)

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Report successfully generated at: {filename}")


if __name__ == "__main__":
    out_path = sys.argv[1] if len(sys.argv) > 1 else "Golf_Subscription_Project_Report_Vipul_Chandra_Mishra.pdf"
    build_pdf(out_path)
