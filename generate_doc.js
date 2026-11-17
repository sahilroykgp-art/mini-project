const fs = require('fs');
const docx = require('docx');
const {
    Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
    HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType,
    PageBreak, UnderlineType
} = docx;

// Helper to create empty lines
function emptyLine(count = 1) {
    const arr = [];
    for (let i = 0; i < count; i++) {
        arr.push(new Paragraph({ text: "" }));
    }
    return arr;
}

// Border definitions
const cellBorderNone = {
    top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
};

const cellBorderThin = {
    top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
    bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
    left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
    right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
};

const doc = new Document({
    styles: {
        default: {
            document: {
                run: {
                    font: "Times New Roman",
                    size: 24, // 12pt
                    color: "000000",
                },
                paragraph: {
                    spacing: { line: 360, before: 100, after: 100 }, // 1.5 line spacing
                },
            },
        },
    },
    sections: [
        // ==========================================
        // PAGE 1: COVER PAGE (Exact Synopsis Format)
        // ==========================================
        {
            properties: {
                page: {
                    margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 },
                },
            },
            children: [
                new Paragraph({
                    alignment: AlignmentType.RIGHT,
                    children: [
                        new TextRun({ text: "1", font: "Times New Roman", size: 24 })
                    ]
                }),
                ...emptyLine(2),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                        new TextRun({
                            text: "A SYNOPSIS ON",
                            bold: true,
                            size: 28, // 14pt
                            font: "Times New Roman"
                        })
                    ]
                }),
                ...emptyLine(1),
                // Double Border Box for Title
                new Table({
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    borders: {
                        top: { style: BorderStyle.DOUBLE, size: 6, color: "000000" },
                        bottom: { style: BorderStyle.DOUBLE, size: 6, color: "000000" },
                        left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                        right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                    },
                    rows: [
                        new TableRow({
                            children: [
                                new TableCell({
                                    borders: cellBorderNone,
                                    children: [
                                        new Paragraph({
                                            alignment: AlignmentType.CENTER,
                                            spacing: { before: 140, after: 140 },
                                            children: [
                                                new TextRun({
                                                    text: "HOSPITAL EMERGENCY MANAGEMENT SYSTEM",
                                                    bold: true,
                                                    size: 32, // 16pt
                                                    font: "Times New Roman"
                                                })
                                            ]
                                        })
                                    ]
                                })
                            ]
                        })
                    ]
                }),
                ...emptyLine(2),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                        new TextRun({
                            text: "Submitted in partial fulfilment of the requirement for the award of the degree of",
                            size: 24,
                            font: "Times New Roman"
                        })
                    ]
                }),
                ...emptyLine(1),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                        new TextRun({
                            text: "BACHELOR OF COMPUTER APPLICATIONS (BCA)",
                            bold: true,
                            size: 28,
                            font: "Times New Roman"
                        })
                    ]
                }),
                ...emptyLine(2),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                        new TextRun({
                            text: "Submitted by:",
                            bold: true,
                            size: 24,
                            font: "Times New Roman"
                        })
                    ]
                }),
                ...emptyLine(1),
                new Table({
                    width: { size: 80, type: WidthType.PERCENTAGE },
                    alignment: AlignmentType.CENTER,
                    borders: cellBorderNone,
                    rows: [
                        new TableRow({
                            children: [
                                new TableCell({
                                    borders: cellBorderNone,
                                    width: { size: 50, type: WidthType.PERCENTAGE },
                                    children: [
                                        new Paragraph({
                                            alignment: AlignmentType.CENTER,
                                            children: [
                                                new TextRun({ text: "Student Name", bold: true, size: 24 })
                                            ]
                                        }),
                                        new Paragraph({
                                            alignment: AlignmentType.CENTER,
                                            children: [
                                                new TextRun({ text: "Sahil Roy", size: 24 })
                                            ]
                                        })
                                    ]
                                }),
                                new TableCell({
                                    borders: cellBorderNone,
                                    width: { size: 50, type: WidthType.PERCENTAGE },
                                    children: [
                                        new Paragraph({
                                            alignment: AlignmentType.CENTER,
                                            children: [
                                                new TextRun({ text: "University Roll No.", bold: true, size: 24 })
                                            ]
                                        }),
                                        new Paragraph({
                                            alignment: AlignmentType.CENTER,
                                            children: [
                                                new TextRun({ text: "2510610142", size: 24 })
                                            ]
                                        })
                                    ]
                                })
                            ]
                        })
                    ]
                }),
                ...emptyLine(2),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                        new TextRun({ text: "Under the Guidance of", bold: true, size: 24 })
                    ]
                }),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                        new TextRun({ text: "Mr. Shubham Kumar", bold: true, size: 26 })
                    ]
                }),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                        new TextRun({ text: "Assistant Professor", size: 24 })
                    ]
                }),
                ...emptyLine(2),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                        new TextRun({ text: "Department of Computer Applications", bold: true, size: 26 })
                    ]
                }),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                        new TextRun({ text: "Graphic Era (Deemed to be University)", bold: true, size: 26 })
                    ]
                }),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                        new TextRun({ text: "Dehradun, Uttarakhand", size: 24 })
                    ]
                }),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                        new TextRun({ text: "September-2026", bold: true, size: 24 })
                    ]
                }),
                new Paragraph({ children: [new PageBreak()] })
            ]
        },

        // ====================================================
        // PAGE 2: CANDIDATE'S DECLARATION (Exact Synopsis Format)
        // ====================================================
        {
            properties: {
                page: {
                    margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 },
                },
            },
            children: [
                new Paragraph({
                    alignment: AlignmentType.RIGHT,
                    children: [
                        new TextRun({ text: "2", font: "Times New Roman", size: 24 })
                    ]
                }),
                ...emptyLine(1),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                        new TextRun({ text: "CANDIDATE'S DECLARATION", bold: true, size: 28 })
                    ]
                }),
                ...emptyLine(1),
                new Paragraph({
                    alignment: AlignmentType.JUSTIFY,
                    children: [
                        new TextRun({
                            text: "I hereby certify that the work presented in this synopsis entitled \"Hospital Emergency Management System\" is submitted in partial fulfilment of the requirements for the award of the Bachelor of Computer Applications (BCA) in the Department of Computer Applications of Graphic Era (Deemed to be University), Dehradun. The proposed work is based on the project proposal supplied for this study and is intended to be carried out under the supervision of the designated project guide."
                        })
                    ]
                }),
                ...emptyLine(1),
                new Paragraph({
                    alignment: AlignmentType.JUSTIFY,
                    children: [
                        new TextRun({
                            text: "The project focuses on a console-based Hospital Emergency Management System developed using C programming. The system applies priority-queue data structures, file handling, structures, pointers and functions to organize emergency patient registration, triage priority, queue processing and daily record maintenance."
                        })
                    ]
                }),
                ...emptyLine(2),
                new Table({
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    borders: cellBorderNone,
                    rows: [
                        new TableRow({
                            children: [
                                new TableCell({
                                    borders: cellBorderNone,
                                    width: { size: 33, type: WidthType.PERCENTAGE },
                                    children: [
                                        new Paragraph({ children: [new TextRun({ text: "Name", bold: true })] }),
                                        new Paragraph({ children: [new TextRun({ text: "Sahil Roy" })] })
                                    ]
                                }),
                                new TableCell({
                                    borders: cellBorderNone,
                                    width: { size: 33, type: WidthType.PERCENTAGE },
                                    children: [
                                        new Paragraph({ children: [new TextRun({ text: "University Roll No.", bold: true })] }),
                                        new Paragraph({ children: [new TextRun({ text: "2510610142" })] })
                                    ]
                                }),
                                new TableCell({
                                    borders: cellBorderNone,
                                    width: { size: 34, type: WidthType.PERCENTAGE },
                                    children: [
                                        new Paragraph({ children: [new TextRun({ text: "Signature", bold: true })] }),
                                        new Paragraph({ children: [new TextRun({ text: "____________________" })] })
                                    ]
                                })
                            ]
                        })
                    ]
                }),
                ...emptyLine(3),
                new Table({
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    borders: cellBorderNone,
                    rows: [
                        new TableRow({
                            children: [
                                new TableCell({
                                    borders: cellBorderNone,
                                    width: { size: 50, type: WidthType.PERCENTAGE },
                                    children: [
                                        new Paragraph({ children: [new TextRun({ text: "Signature" })] }),
                                        new Paragraph({ children: [new TextRun({ text: "Supervisor", bold: true })] })
                                    ]
                                }),
                                new TableCell({
                                    borders: cellBorderNone,
                                    width: { size: 50, type: WidthType.PERCENTAGE },
                                    children: [
                                        new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "Signature" })] }),
                                        new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "Head of the Department", bold: true })] })
                                    ]
                                })
                            ]
                        })
                    ]
                }),
                ...emptyLine(3),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                        new TextRun({ text: "Internal Evaluation (By Project Committee)", bold: true, underline: { type: UnderlineType.SINGLE } })
                    ]
                }),
                ...emptyLine(1),
                new Paragraph({
                    children: [
                        new TextRun({ text: "Status of the Synopsis:  Accepted / Rejected", bold: true })
                    ]
                }),
                new Paragraph({
                    children: [
                        new TextRun({ text: "Any Comments: " }),
                        new TextRun({ text: "_____________________________________________________________________________" })
                    ]
                }),
                ...emptyLine(2),
                new Table({
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    borders: cellBorderNone,
                    rows: [
                        new TableRow({
                            children: [
                                new TableCell({
                                    borders: cellBorderNone,
                                    width: { size: 50, type: WidthType.PERCENTAGE },
                                    children: [
                                        new Paragraph({ children: [new TextRun({ text: "Name of the Committee Members:", bold: true })] }),
                                        new Paragraph({ children: [new TextRun({ text: "1. __________________________________" })] }),
                                        new Paragraph({ children: [new TextRun({ text: "2. __________________________________" })] })
                                    ]
                                }),
                                new TableCell({
                                    borders: cellBorderNone,
                                    width: { size: 50, type: WidthType.PERCENTAGE },
                                    children: [
                                        new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "Signature with Date", bold: true })] }),
                                        new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "____________________" })] }),
                                        new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "____________________" })] })
                                    ]
                                })
                            ]
                        })
                    ]
                }),
                new Paragraph({ children: [new PageBreak()] })
            ]
        },

        // =========================================================================
        // BODY SECTION: ARCHITECTURE, ALGORITHMS, IMPLEMENTATION, AND DIFFICULTIES
        // =========================================================================
        {
            properties: {
                page: {
                    margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 },
                },
            },
            children: [
                // -------------------------------------------------------------
                // CHAPTER 1: SYSTEM ARCHITECTURE & FLOW (Synopsis Ch. 5.1 & 5.2)
                // -------------------------------------------------------------
                new Paragraph({
                    text: "Chapter 1: System Architecture and Operational Design",
                    heading: HeadingLevel.HEADING_1,
                    bold: true
                }),
                new Paragraph({
                    alignment: AlignmentType.JUSTIFY,
                    children: [
                        new TextRun({
                            text: "The high-level architecture of the Hospital Emergency Management System (HEMS) divides the application into three cooperative operational areas: Medical Staff / Admin Interface, Core Engine, and Receptionist Portal. Persistent text files (\"er_patient_log.txt\" and \"daily_er_report.txt\") provide a dependable file-handling storage layer."
                        })
                    ]
                }),
                ...emptyLine(1),
                new Paragraph({
                    text: "1.1 Architectural Hierarchy and Data Flow Diagram",
                    heading: HeadingLevel.HEADING_2,
                    bold: true
                }),
                new Table({
                    width: { size: 90, type: WidthType.PERCENTAGE },
                    alignment: AlignmentType.CENTER,
                    borders: cellBorderThin,
                    rows: [
                        new TableRow({
                            children: [
                                new TableCell({
                                    shading: { fill: "F0F4F8", type: ShadingType.CLEAR },
                                    children: [
                                        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "[Receptionist / Medical Staff / Administrator]", bold: true })] })
                                    ]
                                })
                            ]
                        }),
                        new TableRow({
                            children: [
                                new TableCell({
                                    children: [
                                        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "↓  (Role Authentication / Direct Selection)" })] })
                                    ]
                                })
                            ]
                        }),
                        new TableRow({
                            children: [
                                new TableCell({
                                    shading: { fill: "E8F0FE", type: ShadingType.CLEAR },
                                    children: [
                                        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "[Role-Based Main Menu (Receptionist vs Medical Staff/Admin)]", bold: true })] })
                                    ]
                                })
                            ]
                        }),
                        new TableRow({
                            children: [
                                new TableCell({
                                    children: [
                                        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "↓  (Triage Input / Enqueue / Bed Ops)" })] })
                                    ]
                                })
                            ]
                        }),
                        new TableRow({
                            children: [
                                new TableCell({
                                    shading: { fill: "D2E3FC", type: ShadingType.CLEAR },
                                    children: [
                                        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "[Dynamic Priority Queue Engine (Linked-List Ordered by Triage Urgency)]", bold: true })] })
                                    ]
                                })
                            ]
                        }),
                        new TableRow({
                            children: [
                                new TableCell({
                                    children: [
                                        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "↓  (Dequeue Critical Patient / Clinical Disposition)" })] })
                                    ]
                                })
                            ]
                        }),
                        new TableRow({
                            children: [
                                new TableCell({
                                    shading: { fill: "CEEAD6", type: ShadingType.CLEAR },
                                    children: [
                                        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "[Emergency Bed Management & Trauma Bay Service]", bold: true })] })
                                    ]
                                })
                            ]
                        }),
                        new TableRow({
                            children: [
                                new TableCell({
                                    children: [
                                        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "↓  (Persistent File Storage & Audit Trail)" })] })
                                    ]
                                })
                            ]
                        }),
                        new TableRow({
                            children: [
                                new TableCell({
                                    shading: { fill: "FEF7E0", type: ShadingType.CLEAR },
                                    children: [
                                        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Persistent Storage: \"er_patient_log.txt\"  &  \"daily_er_report.txt\"", bold: true })] })
                                    ]
                                })
                            ]
                        })
                    ]
                }),
                ...emptyLine(1),
                new Paragraph({
                    text: "1.2 Module Descriptions (Chapter 5.2)",
                    heading: HeadingLevel.HEADING_2,
                    bold: true
                }),
                new Paragraph({
                    alignment: AlignmentType.JUSTIFY,
                    children: [
                        new TextRun({ text: "1. Receptionist Interface: ", bold: true }),
                        new TextRun({ text: "Accepts patient personal and clinical details, records chief medical complaint, assigns triage severity level (1 to 5), issues auto-incremented tokens (e.g. ER-1001), and logs to persistent files." })
                    ]
                }),
                new Paragraph({
                    alignment: AlignmentType.JUSTIFY,
                    children: [
                        new TextRun({ text: "2. Triage Management: ", bold: true }),
                        new TextRun({ text: "Maintains severity grading from Level 1 (Resuscitation/Immediate) to Level 5 (Non-urgent), serving as the governing metric for queue prioritization." })
                    ]
                }),
                new Paragraph({
                    alignment: AlignmentType.JUSTIFY,
                    children: [
                        new TextRun({ text: "3. Priority Queue Processing: ", bold: true }),
                        new TextRun({ text: "Uses a singly linked list with pointer-based ordered insertion. Patients with higher urgency (lower triage integer) jump ahead, while peers with identical urgency follow FIFO order." })
                    ]
                }),
                new Paragraph({
                    alignment: AlignmentType.JUSTIFY,
                    children: [
                        new TextRun({ text: "4. Medical Staff / Admin Interface: ", bold: true }),
                        new TextRun({ text: "Protected by password verification. Grants privileges to dequeue critical patients into trauma care, allocate emergency ward beds, discharge patients, search logs, and reset daily logs." })
                    ]
                }),
                new Paragraph({
                    alignment: AlignmentType.JUSTIFY,
                    children: [
                        new TextRun({ text: "5. Bed Management Module: ", bold: true }),
                        new TextRun({ text: "Maintains real-time status of 10 Emergency Ward Beds, recording patient token, name, triage level, and admission/discharge timestamps." })
                    ]
                }),
                new Paragraph({
                    alignment: AlignmentType.JUSTIFY,
                    children: [
                        new TextRun({ text: "6. Persistent File Storage: ", bold: true }),
                        new TextRun({ text: "Maintains full audit trails in er_patient_log.txt and daily statistical summaries in daily_er_report.txt." })
                    ]
                }),
                ...emptyLine(1),

                // -------------------------------------------------------------
                // CHAPTER 2: CORE ALGORITHMS (Synopsis Ch. 5.3)
                // -------------------------------------------------------------
                new Paragraph({
                    text: "Chapter 2: Algorithms and Pseudocode (Chapter 5.3)",
                    heading: HeadingLevel.HEADING_1,
                    bold: true
                }),
                new Paragraph({
                    alignment: AlignmentType.JUSTIFY,
                    children: [
                        new TextRun({ text: "The system executes three fundamental algorithms defined in the project synopsis:" })
                    ]
                }),
                ...emptyLine(1),
                new Paragraph({ text: "Algorithm 1: Patient Registration and Enqueue (Receptionist)", bold: true }),
                new Table({
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    borders: cellBorderThin,
                    rows: [
                        new TableRow({
                            children: [
                                new TableCell({
                                    shading: { fill: "F8F9FA", type: ShadingType.CLEAR },
                                    children: [
                                        new Paragraph({ children: [new TextRun({ text: "BEGIN", bold: true })] }),
                                        new Paragraph({ children: [new TextRun({ text: "  1. Accept patient details (Name, Age, Gender, Contact, Chief Complaint)." })] }),
                                        new Paragraph({ children: [new TextRun({ text: "  2. Assign unique token ID (g_hems.next_token_id++)." })] }),
                                        new Paragraph({ children: [new TextRun({ text: "  3. Prompt clinical triage level (1 to 5, where 1 is highest priority)." })] }),
                                        new Paragraph({ children: [new TextRun({ text: "  4. Create patient record in memory using Patient structure." })] }),
                                        new Paragraph({ children: [new TextRun({ text: "  5. Traverse Priority Queue linked list; insert node before first element with greater triage level (maintaining FIFO for equal levels)." })] }),
                                        new Paragraph({ children: [new TextRun({ text: "  6. Append audit record to er_patient_log.txt with timestamp." })] }),
                                        new Paragraph({ children: [new TextRun({ text: "  7. Display confirmed token and current waiting count." })] }),
                                        new Paragraph({ children: [new TextRun({ text: "END", bold: true })] })
                                    ]
                                })
                            ]
                        })
                    ]
                }),
                ...emptyLine(1),
                new Paragraph({ text: "Algorithm 2: Advance Highest-Priority Patient (Medical Staff Dequeue)", bold: true }),
                new Table({
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    borders: cellBorderThin,
                    rows: [
                        new TableRow({
                            children: [
                                new TableCell({
                                    shading: { fill: "F8F9FA", type: ShadingType.CLEAR },
                                    children: [
                                        new Paragraph({ children: [new TextRun({ text: "BEGIN", bold: true })] }),
                                        new Paragraph({ children: [new TextRun({ text: "  1. Verify medical staff authorization credentials (verifyAdminLogin)." })] }),
                                        new Paragraph({ children: [new TextRun({ text: "  2. Check if Priority Queue is empty (g_hems.queue_head == NULL)." })] }),
                                        new Paragraph({ children: [new TextRun({ text: "  3. If another patient is active in trauma bay, prompt doctor for disposition (Discharge, Admit Bed, or Transfer)." })] }),
                                        new Paragraph({ children: [new TextRun({ text: "  4. Dequeue head of priority queue (O(1) operation), advance head pointer to head->next, free memory." })] }),
                                        new Paragraph({ children: [new TextRun({ text: "  5. Set dequeued patient as currently_serving and update total_treated_today." })] }),
                                        new Paragraph({ children: [new TextRun({ text: "  6. Log transition to er_patient_log.txt and update daily_er_report.txt." })] }),
                                        new Paragraph({ children: [new TextRun({ text: "  7. Display critical patient details and remaining waiting queue." })] }),
                                        new Paragraph({ children: [new TextRun({ text: "END", bold: true })] })
                                    ]
                                })
                            ]
                        })
                    ]
                }),
                ...emptyLine(1),
                new Paragraph({ text: "Algorithm 3: Daily Log Retrieval / Report Generation", bold: true }),
                new Table({
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    borders: cellBorderThin,
                    rows: [
                        new TableRow({
                            children: [
                                new TableCell({
                                    shading: { fill: "F8F9FA", type: ShadingType.CLEAR },
                                    children: [
                                        new Paragraph({ children: [new TextRun({ text: "BEGIN", bold: true })] }),
                                        new Paragraph({ children: [new TextRun({ text: "  1. Open required text file (PATIENT_LOG_FILE or DAILY_REPORT_FILE) safely in read/write mode." })] }),
                                        new Paragraph({ children: [new TextRun({ text: "  2. Compute daily statistics (registrations, treated, bed utilization, triage breakdown)." })] }),
                                        new Paragraph({ children: [new TextRun({ text: "  3. Stream structured data into daily_er_report.txt with formatting." })] }),
                                        new Paragraph({ children: [new TextRun({ text: "  4. Output formatted lines to console screen for authorized viewer." })] }),
                                        new Paragraph({ children: [new TextRun({ text: "  5. Flush buffers and close file pointer safely (fclose)." })] }),
                                        new Paragraph({ children: [new TextRun({ text: "END", bold: true })] })
                                    ]
                                })
                            ]
                        })
                    ]
                }),
                ...emptyLine(1),

                // -------------------------------------------------------------
                // CHAPTER 3: TECHNICAL DIFFICULTIES & STEP-BY-STEP SOLUTIONS
                // -------------------------------------------------------------
                new Paragraph({
                    text: "Chapter 3: Technical Difficulties, Errors Encountered & Solutions",
                    heading: HeadingLevel.HEADING_1,
                    bold: true
                }),
                new Paragraph({
                    alignment: AlignmentType.JUSTIFY,
                    children: [
                        new TextRun({
                            text: "During the design, implementation, and rigorous testing of the Hospital Emergency Management System in C, several non-trivial data structure, input handling, and operating system challenges were encountered. Below is the comprehensive documentation of these issues, root causes, corrective actions, and scholarly references used to resolve them."
                        })
                    ]
                }),
                ...emptyLine(1),

                // Issue 1
                new Paragraph({ text: "3.1 Difficulty 1: Priority Queue Ordering & FIFO Tie-Breaking Logic", heading: HeadingLevel.HEADING_2, bold: true }),
                new Paragraph({
                    alignment: AlignmentType.JUSTIFY,
                    children: [
                        new TextRun({ text: "• The Problem: ", bold: true }),
                        new TextRun({ text: "In hospital emergency triage, severity levels range from 1 (Resuscitation) to 5 (Non-urgent). While a Level 1 patient must jump ahead of a Level 2 patient, patients who arrive with the same severity level must strictly follow First-In-First-Out (FIFO) arrival order. Early implementations using standard strictly less-than comparisons ('<') inserted new patients of equal priority before existing ones, causing older patients to suffer starvation." })
                    ]
                }),
                new Paragraph({
                    alignment: AlignmentType.JUSTIFY,
                    children: [
                        new TextRun({ text: "• Root Cause: ", bold: true }),
                        new TextRun({ text: "The insertion traversal stopped too early at the first node with an equal triage value." })
                    ]
                }),
                new Paragraph({
                    alignment: AlignmentType.JUSTIFY,
                    children: [
                        new TextRun({ text: "• Technical Solution: ", bold: true }),
                        new TextRun({ text: "We refined the linked-list traversal loop in enqueuePriority():" })
                    ]
                }),
                new Paragraph({
                    shading: { fill: "F1F3F4", type: ShadingType.CLEAR },
                    children: [
                        new TextRun({
                            font: "Courier New",
                            size: 20,
                            text: "while (current->next != NULL && current->next->data.triage_level <= p.triage_level) {\n    current = current->next;\n}"
                        })
                    ]
                }),
                new Paragraph({
                    alignment: AlignmentType.JUSTIFY,
                    children: [
                        new TextRun({ text: "Using '<=' ensures that the pointer advances past all nodes that have an equal or higher priority, placing the new patient at the exact tail of that priority tier. This strictly satisfies both medical urgency and fairness." })
                    ]
                }),
                new Paragraph({
                    alignment: AlignmentType.JUSTIFY,
                    children: [
                        new TextRun({ text: "• Academic References Used: ", bold: true }),
                        new TextRun({ text: "E. Balagurusamy (2017) [4] (Linked Lists & Queues in ANSI C) and Sun & Hong (2021) [10] (\"Who Is Next: Patient Prioritization Under Emergency Department Blocking\")." })
                    ]
                }),
                ...emptyLine(1),

                // Issue 2
                new Paragraph({ text: "3.2 Difficulty 2: Console Input Buffer Skips & GCC String Truncation Warnings", heading: HeadingLevel.HEADING_2, bold: true }),
                new Paragraph({
                    alignment: AlignmentType.JUSTIFY,
                    children: [
                        new TextRun({ text: "• The Problem: ", bold: true }),
                        new TextRun({ text: "Standard scanf(\"%d\") leaves the trailing newline ('\\n') in stdin, which caused subsequent fgets() prompts for Patient Name or Phone to immediately swallow the empty newline and skip user input. Furthermore, compiling with GCC -Wall -Wextra produced compiler warnings:" })
                    ]
                }),
                new Paragraph({
                    shading: { fill: "FCE8E6", type: ShadingType.CLEAR },
                    children: [
                        new TextRun({
                            font: "Courier New",
                            size: 20,
                            color: "C5221F",
                            text: "warning: 'strncpy' output may be truncated copying 31 bytes [-Wstringop-truncation]\nwarning: '%s' directive output may be truncated writing into size 32 [-Wformat-truncation]"
                        })
                    ]
                }),
                new Paragraph({
                    alignment: AlignmentType.JUSTIFY,
                    children: [
                        new TextRun({ text: "• Technical Solution: ", bold: true }),
                        new TextRun({ text: "We developed bulletproof input wrappers readInt() and readString() that strictly read entire lines via fgets(). If input exceeds buffer capacity, remaining characters are flushed with clearInputBuffer(). Risky strncpy() calls were replaced with bounded snprintf(), and credential buffer sizes were matched exactly to 32 bytes to eliminate all GCC warnings." })
                    ]
                }),
                new Paragraph({
                    alignment: AlignmentType.JUSTIFY,
                    children: [
                        new TextRun({ text: "• Academic References Used: ", bold: true }),
                        new TextRun({ text: "B. W. Kernighan & D. M. Ritchie (1988) [3] (Safe I/O in The C Programming Language), Herbert Schildt (2005) [2], and GeeksforGeeks [5]." })
                    ]
                }),
                ...emptyLine(1),

                // Issue 3
                new Paragraph({ text: "3.3 Difficulty 3: Session Persistence & Token Duplication on Restart", heading: HeadingLevel.HEADING_2, bold: true }),
                new Paragraph({
                    alignment: AlignmentType.JUSTIFY,
                    children: [
                        new TextRun({ text: "• The Problem: ", bold: true }),
                        new TextRun({ text: "When the application terminates, in-memory global variables reset. Re-launching the application caused next_token_id to reset back to 1001, resulting in duplicate token numbers being issued and corrupting the chronological audit log in er_patient_log.txt." })
                    ]
                }),
                new Paragraph({
                    alignment: AlignmentType.JUSTIFY,
                    children: [
                        new TextRun({ text: "• Technical Solution: ", bold: true }),
                        new TextRun({ text: "Implemented restoreTokenCounter() during system boot (initSystem). The function inspects er_patient_log.txt, parses the leading token column with sscanf(), determines the highest existing token number max_token, and initializes next_token_id = max_token + 1. If 15 patients exist up to ER-1015, the next patient automatically receives ER-1016." })
                    ]
                }),
                new Paragraph({
                    alignment: AlignmentType.JUSTIFY,
                    children: [
                        new TextRun({ text: "• Academic References Used: ", bold: true }),
                        new TextRun({ text: "TutorialsPoint (2026) [6] (\"C Programming - File Handling\") and Balagurusamy (2017) [4]." })
                    ]
                }),
                ...emptyLine(1),

                // Issue 4
                new Paragraph({ text: "3.4 Difficulty 4: Bed Management Triage Loss & Overwrite Protection", heading: HeadingLevel.HEADING_2, bold: true }),
                new Paragraph({
                    alignment: AlignmentType.JUSTIFY,
                    children: [
                        new TextRun({ text: "• The Problem: ", bold: true }),
                        new TextRun({ text: "Initially, the EmergencyBed structure only tracked patient token and name, but omitted triage severity level. Consequently, when an emergency patient was discharged from a ward bed, the audit log recorded their triage as 'Level 0'. In addition, when medical staff advanced a patient while a previous patient was still under active care in the trauma bay, the active patient state was vulnerable to being silently overwritten." })
                    ]
                }),
                new Paragraph({
                    alignment: AlignmentType.JUSTIFY,
                    children: [
                        new TextRun({ text: "• Technical Solution: ", bold: true }),
                        new TextRun({ text: "1. Added 'int triage_level;' to the EmergencyBed structure and updated allocateBed() and dischargeBed() to retain and log the patient's exact triage level upon release." })
                    ]
                }),
                new Paragraph({
                    alignment: AlignmentType.JUSTIFY,
                    children: [
                        new TextRun({ text: "2. In advanceHighestPriorityPatient(), added an explicit clinical disposition check (Discharge, Admit to Bed, or Transfer to Secondary Care) before dequeuing the next patient, ensuring zero data loss." })
                    ]
                }),
                new Paragraph({
                    alignment: AlignmentType.JUSTIFY,
                    children: [
                        new TextRun({ text: "• Academic References Used: ", bold: true }),
                        new TextRun({ text: "Yao et al. (2021) [8] (\"A Novel Electronic-Record-Based System for Triage in the Emergency Department\") and Shen & Lee (2020) [9]." })
                    ]
                }),
                ...emptyLine(1),

                // Issue 5
                new Paragraph({ text: "3.5 Difficulty 5: Operating System File Locking During Recompilation", heading: HeadingLevel.HEADING_2, bold: true }),
                new Paragraph({
                    alignment: AlignmentType.JUSTIFY,
                    children: [
                        new TextRun({ text: "• The Problem: ", bold: true }),
                        new TextRun({ text: "On Windows environments, MinGW GCC failed with:" })
                    ]
                }),
                new Paragraph({
                    shading: { fill: "FCE8E6", type: ShadingType.CLEAR },
                    children: [
                        new TextRun({
                            font: "Courier New",
                            size: 20,
                            color: "C5221F",
                            text: "ld.exe: cannot open output file hems.exe: Permission denied"
                        })
                    ]
                }),
                new Paragraph({
                    alignment: AlignmentType.JUSTIFY,
                    children: [
                        new TextRun({ text: "• Root Cause & Solution: ", bold: true }),
                        new TextRun({ text: "Windows locks binary files that are currently being executed. Implemented cleanupSystem() to release all dynamic memory on exit, and configured build_and_run.bat to verify process state before compilation." })
                    ]
                }),
                new Paragraph({
                    alignment: AlignmentType.JUSTIFY,
                    children: [
                        new TextRun({ text: "• Academic References Used: ", bold: true }),
                        new TextRun({ text: "Graphic Era University Course Material on Systems Programming [7]." })
                    ]
                }),
                ...emptyLine(1),

                // Summary Mapping Table
                new Paragraph({ text: "3.6 Problem-to-Reference Mapping Matrix", bold: true }),
                new Table({
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    borders: cellBorderThin,
                    rows: [
                        new TableRow({
                            children: [
                                new TableCell({ shading: { fill: "E0E0E0", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Challenge / Error", bold: true })] })] }),
                                new TableCell({ shading: { fill: "E0E0E0", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Root Cause", bold: true })] })] }),
                                new TableCell({ shading: { fill: "E0E0E0", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Applied Solution", bold: true })] })] }),
                                new TableCell({ shading: { fill: "E0E0E0", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Reference Cited", bold: true })] })] }),
                            ]
                        }),
                        new TableRow({
                            children: [
                                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "FIFO Tie-Breaking in Priority Queue" })] })] }),
                                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Strict '<' stopped at first equal node" })] })] }),
                                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Used '<=' loop to append behind peers" })] })] }),
                                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Balagurusamy [4], Sun & Hong [10]" })] })] }),
                            ]
                        }),
                        new TableRow({
                            children: [
                                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Input Buffer Skipping & Warnings" })] })] }),
                                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "scanf('\\n') leftover & buffer mismatch" })] })] }),
                                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Custom fgets() wrappers + snprintf()" })] })] }),
                                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "K&R [3], Schildt [2], GFG [5]" })] })] }),
                            ]
                        }),
                        new TableRow({
                            children: [
                                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Token Duplication on Restart" })] })] }),
                                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Global token counter reset to 1001" })] })] }),
                                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "restoreTokenCounter() file scanner" })] })] }),
                                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "TutorialsPoint [6], GFG [5]" })] })] }),
                            ]
                        }),
                        new TableRow({
                            children: [
                                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Bed Triage Level Loss" })] })] }),
                                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Bed structure lacked triage_level field" })] })] }),
                                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Stored triage in Bed struct & audit log" })] })] }),
                                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Yao et al. [8], Shen & Lee [9]" })] })] }),
                            ]
                        }),
                        new TableRow({
                            children: [
                                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Windows ld.exe Permission Denied" })] })] }),
                                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Process lock while hems.exe active" })] })] }),
                                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "cleanupSystem() & batch process kill" })] })] }),
                                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "GEU Course Notes [7]" })] })] }),
                            ]
                        })
                    ]
                }),
                new Paragraph({ children: [new PageBreak()] })
            ]
        },

        // =========================================================================
        // LAST PAGE: REFERENCES (Exact Synopsis Page 13 Format)
        // =========================================================================
        {
            properties: {
                page: {
                    margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 },
                },
            },
            children: [
                new Paragraph({
                    alignment: AlignmentType.RIGHT,
                    children: [
                        new TextRun({ text: "13", font: "Times New Roman", size: 24 })
                    ]
                }),
                ...emptyLine(1),
                new Paragraph({
                    text: "References",
                    heading: HeadingLevel.HEADING_1,
                    bold: true
                }),
                ...emptyLine(1),
                new Paragraph({
                    alignment: AlignmentType.JUSTIFY,
                    children: [
                        new TextRun({
                            text: "[1] S. Roy, \"Hospital Emergency Management Synopsis,\" Project Proposal, Graphic Era (Deemed to be University), Dehradun, 2026."
                        })
                    ]
                }),
                ...emptyLine(1),
                new Paragraph({
                    alignment: AlignmentType.JUSTIFY,
                    children: [
                        new TextRun({
                            text: "[2] H. Schildt, The Complete Reference C, 4th ed. New Delhi, India: McGraw-Hill, 2005."
                        })
                    ]
                }),
                ...emptyLine(1),
                new Paragraph({
                    alignment: AlignmentType.JUSTIFY,
                    children: [
                        new TextRun({
                            text: "[3] B. W. Kernighan and D. M. Ritchie, The C Programming Language, 2nd ed. Englewood Cliffs, NJ, USA: Prentice Hall, 1988."
                        })
                    ]
                }),
                ...emptyLine(1),
                new Paragraph({
                    alignment: AlignmentType.JUSTIFY,
                    children: [
                        new TextRun({
                            text: "[4] E. Balagurusamy, Programming in ANSI C, 7th ed. New Delhi, India: McGraw-Hill Education, 2017."
                        })
                    ]
                }),
                ...emptyLine(1),
                new Paragraph({
                    alignment: AlignmentType.JUSTIFY,
                    children: [
                        new TextRun({
                            text: "[5] GeeksforGeeks, \"File Handling in C Programming,\" online resource, updated 2026. Available at: https://www.geeksforgeeks.org/c/basics-file-handling-c/"
                        })
                    ]
                }),
                ...emptyLine(1),
                new Paragraph({
                    alignment: AlignmentType.JUSTIFY,
                    children: [
                        new TextRun({
                            text: "[6] TutorialsPoint, \"C Programming - File Handling,\" online resource, accessed 2026. Available at: https://www.tutorialspoint.com/cprogramming/c_file_io.htm"
                        })
                    ]
                }),
                ...emptyLine(1),
                new Paragraph({
                    alignment: AlignmentType.JUSTIFY,
                    children: [
                        new TextRun({
                            text: "[7] Lecture notes and study materials related to C Programming and Data Structures, course material supplied with the project proposal, 2026."
                        })
                    ]
                }),
                ...emptyLine(1),
                new Paragraph({
                    alignment: AlignmentType.JUSTIFY,
                    children: [
                        new TextRun({
                            text: "[8] Yao, L.-H., Leung, K.-C., Tsai, C.-L., Huang, C.-H., and Fu, L.-C., \"A Novel Deep Learning–Based System for Triage in the Emergency Department Using Electronic Medical Records: Retrospective Cohort Study,\" Journal of Medical Internet Research, vol. 23, no. 12, e27008, 2021."
                        })
                    ]
                }),
                ...emptyLine(1),
                new Paragraph({
                    alignment: AlignmentType.JUSTIFY,
                    children: [
                        new TextRun({
                            text: "[9] Shen, Y. and Lee, L. H., \"Improving the wait time to triage at the emergency department,\" BMJ Open Quality, vol. 9, no. 1, e000708, 2020."
                        })
                    ]
                }),
                ...emptyLine(1),
                new Paragraph({
                    alignment: AlignmentType.JUSTIFY,
                    children: [
                        new TextRun({
                            text: "[10] Sun, Z. and Hong, L. J., \"Who Is Next: Patient Prioritization Under Emergency Department Blocking,\" Operations Research, published online Dec. 8, 2021."
                        })
                    ]
                })
            ]
        }
    ]
});

Packer.toBuffer(doc).then((buffer) => {
    fs.writeFileSync("Hospital_Emergency_Management_System_Synopsis_Report.docx", buffer);
    console.log("SUCCESS: Hospital_Emergency_Management_System_Synopsis_Report.docx created successfully!");
}).catch((err) => {
    console.error("ERROR generating docx:", err);
});
