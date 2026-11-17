const fs = require('fs');
const docx = require('docx');
const {
    Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
    HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType,
    PageBreak, UnderlineType
} = docx;

function emptyLine(count = 1) {
    const arr = [];
    for (let i = 0; i < count; i++) {
        arr.push(new Paragraph({ text: "" }));
    }
    return arr;
}

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

function pageHeader(num) {
    return new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [
            new TextRun({ text: num.toString(), font: "Times New Roman", size: 22 })
        ]
    });
}

function sectionTitle(title) {
    return new Paragraph({
        text: title,
        heading: HeadingLevel.HEADING_1,
        bold: true,
        spacing: { before: 120, after: 120 }
    });
}

function subTitle(title) {
    return new Paragraph({
        text: title,
        heading: HeadingLevel.HEADING_2,
        bold: true,
        spacing: { before: 100, after: 80 }
    });
}

function bodyPara(text) {
    return new Paragraph({
        alignment: AlignmentType.JUSTIFY,
        spacing: { line: 360, before: 60, after: 60 },
        children: [
            new TextRun({ text: text, font: "Times New Roman", size: 24 })
        ]
    });
}

function codeBox(code) {
    return new Paragraph({
        shading: { fill: "F4F6F8", type: ShadingType.CLEAR },
        spacing: { before: 80, after: 80 },
        children: [
            new TextRun({
                font: "Consolas",
                size: 20,
                text: code
            })
        ]
    });
}

const doc = new Document({
    styles: {
        default: {
            document: {
                run: {
                    font: "Times New Roman",
                    size: 24,
                    color: "000000",
                },
                paragraph: {
                    spacing: { line: 360, before: 60, after: 60 },
                },
            },
        },
    },
    sections: [
        // ==========================================
        // PAGE 1: COVER PAGE (Exact Synopsis Format)
        // ==========================================
        {
            properties: { page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } },
            children: [
                pageHeader(1),
                ...emptyLine(2),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                        new TextRun({ text: "A SYNOPSIS ON", bold: true, size: 28, font: "Times New Roman" })
                    ]
                }),
                ...emptyLine(1),
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
                                                    size: 32,
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
                        new TextRun({ text: "Submitted by:", bold: true, size: 24, font: "Times New Roman" })
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
                                        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Student Name", bold: true, size: 24 })] }),
                                        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Sahil Roy", size: 24 })] })
                                    ]
                                }),
                                new TableCell({
                                    borders: cellBorderNone,
                                    width: { size: 50, type: WidthType.PERCENTAGE },
                                    children: [
                                        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "University Roll No.", bold: true, size: 24 })] }),
                                        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "2510610142", size: 24 })] })
                                    ]
                                })
                            ]
                        })
                    ]
                }),
                ...emptyLine(2),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [new TextRun({ text: "Under the Guidance of", bold: true, size: 24 })]
                }),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [new TextRun({ text: "Mr. Shubham Kumar", bold: true, size: 26 })]
                }),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [new TextRun({ text: "Assistant Professor", size: 24 })]
                }),
                ...emptyLine(2),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [new TextRun({ text: "Department of Computer Applications", bold: true, size: 26 })]
                }),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [new TextRun({ text: "Graphic Era (Deemed to be University)", bold: true, size: 26 })]
                }),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [new TextRun({ text: "Dehradun, Uttarakhand", size: 24 })]
                }),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [new TextRun({ text: "September-2026", bold: true, size: 24 })]
                }),
                new Paragraph({ children: [new PageBreak()] })
            ]
        },

        // ====================================================
        // PAGE 2: CANDIDATE'S DECLARATION (Exact Synopsis Format)
        // ====================================================
        {
            properties: { page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } },
            children: [
                pageHeader(2),
                ...emptyLine(1),
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [new TextRun({ text: "CANDIDATE'S DECLARATION", bold: true, size: 28 })]
                }),
                ...emptyLine(1),
                bodyPara("I hereby certify that the work presented in this synopsis entitled \"Hospital Emergency Management System\" is submitted in partial fulfilment of the requirements for the award of the Bachelor of Computer Applications (BCA) in the Department of Computer Applications of Graphic Era (Deemed to be University), Dehradun. The proposed work is based on the project proposal supplied for this study and is intended to be carried out under the supervision of the designated project guide."),
                ...emptyLine(1),
                bodyPara("The project focuses on a console-based Hospital Emergency Management System developed using C programming. The system applies priority-queue data structures, file handling, structures, pointers and functions to organize emergency patient registration, triage priority, queue processing and daily record maintenance."),
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
                    children: [new TextRun({ text: "Status of the Synopsis:  Accepted / Rejected", bold: true })]
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

        // ==========================================
        // PAGE 3: CERTIFICATE & ACKNOWLEDGEMENTS
        // ==========================================
        {
            properties: { page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } },
            children: [
                pageHeader(3),
                sectionTitle("Certificate of Academic Originality"),
                bodyPara("This is to certify that the project report entitled \"Hospital Emergency Management System (HEMS)\", submitted by Sahil Roy (University Roll No: 2510610142) in partial fulfilment of the requirements for the award of the degree of Bachelor of Computer Applications (BCA) at the Department of Computer Applications, Graphic Era (Deemed to be University), Dehradun, is an authentic record of original work carried out under our guidance and supervision."),
                bodyPara("The implementation, data structures, algorithms, and documentation presented in this work have been developed in strict adherence to institutional standards and do not duplicate any previous dissertation or project work submitted for any degree."),
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
                                        new Paragraph({ children: [new TextRun({ text: "Mr. Shubham Kumar", bold: true })] }),
                                        new Paragraph({ children: [new TextRun({ text: "Assistant Professor & Project Guide" })] }),
                                        new Paragraph({ children: [new TextRun({ text: "Department of Computer Applications" })] }),
                                        new Paragraph({ children: [new TextRun({ text: "Graphic Era University, Dehradun" })] })
                                    ]
                                }),
                                new TableCell({
                                    borders: cellBorderNone,
                                    width: { size: 50, type: WidthType.PERCENTAGE },
                                    children: [
                                        new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "Head of the Department", bold: true })] }),
                                        new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "Department of Computer Applications" })] }),
                                        new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "Graphic Era University, Dehradun" })] })
                                    ]
                                })
                            ]
                        })
                    ]
                }),
                ...emptyLine(3),
                sectionTitle("Acknowledgements"),
                bodyPara("I express my profound gratitude to my project supervisor, Mr. Shubham Kumar, Assistant Professor, Department of Computer Applications, Graphic Era (Deemed to be University), for his invaluable guidance, continuous encouragement, and constructive critique throughout the conception and implementation of this software project."),
                bodyPara("I also convey my sincere appreciation to the faculty members and staff of the Department of Computer Applications for providing access to computing facilities and study materials on Data Structures and Advanced C Programming. Finally, I thank my family and peers whose persistent moral support made this work possible."),
                new Paragraph({ children: [new PageBreak()] })
            ]
        },

        // ==========================================
        // PAGE 4: TABLE OF CONTENTS & ABSTRACT
        // ==========================================
        {
            properties: { page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } },
            children: [
                pageHeader(4),
                sectionTitle("Table of Contents"),
                new Table({
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    borders: cellBorderThin,
                    rows: [
                        new TableRow({
                            children: [
                                new TableCell({ shading: { fill: "E8EEF5", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Chapter / Section", bold: true })] })] }),
                                new TableCell({ shading: { fill: "E8EEF5", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Description", bold: true })] })] }),
                                new TableCell({ shading: { fill: "E8EEF5", type: ShadingType.CLEAR }, width: { size: 15, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "Page No.", bold: true })] })] }),
                            ]
                        }),
                        new TableRow({ children: [new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Title & Declaration" })] })] }), new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Cover Page & Candidate's Declaration" })] })] }), new TableCell({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "1-2" })] })] })] }),
                        new TableRow({ children: [new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Certificate & Abstract" })] })] }), new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Certificate, Acknowledgements & Table of Contents" })] })] }), new TableCell({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "3-4" })] })] })] }),
                        new TableRow({ children: [new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Chapter 1" })] })] }), new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Introduction & Problem Statement" })] })] }), new TableCell({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "5" })] })] })] }),
                        new TableRow({ children: [new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Chapter 2" })] })] }), new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Background & Literature Survey" })] })] }), new TableCell({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "6" })] })] })] }),
                        new TableRow({ children: [new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Chapter 3" })] })] }), new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Project Objectives & Scope" })] })] }), new TableCell({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "7" })] })] })] }),
                        new TableRow({ children: [new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Chapter 4" })] })] }), new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Hardware & Software Requirements" })] })] }), new TableCell({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "8" })] })] })] }),
                        new TableRow({ children: [new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Chapter 5" })] })] }), new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "System Architecture & High-Level Design" })] })] }), new TableCell({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "9" })] })] })] }),
                        new TableRow({ children: [new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Chapter 6" })] })] }), new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Core Data Structures & Memory Models" })] })] }), new TableCell({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "10" })] })] })] }),
                        new TableRow({ children: [new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Chapter 7" })] })] }), new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Detailed Algorithms & Complexity Analysis" })] })] }), new TableCell({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "11" })] })] })] }),
                        new TableRow({ children: [new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Chapter 8" })] })] }), new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "User Interface & Role-Based Workflows" })] })] }), new TableCell({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "12" })] })] })] }),
                        new TableRow({ children: [new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Chapter 9" })] })] }), new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Persistence & File Handling Architecture" })] })] }), new TableCell({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "13" })] })] })] }),
                        new TableRow({ children: [new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Chapter 10" })] })] }), new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Implementation Challenges & Technical Errors (Part 1)" })] })] }), new TableCell({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "14" })] })] })] }),
                        new TableRow({ children: [new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Chapter 10" })] })] }), new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Implementation Challenges & Technical Errors (Part 2)" })] })] }), new TableCell({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "15" })] })] })] }),
                        new TableRow({ children: [new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Chapter 11" })] })] }), new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Comprehensive Problem-to-Literature Reference Matrix" })] })] }), new TableCell({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "16" })] })] })] }),
                        new TableRow({ children: [new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Chapter 12" })] })] }), new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Testing Methodology, Test Suite & Validation" })] })] }), new TableCell({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "17" })] })] })] }),
                        new TableRow({ children: [new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Chapter 13" })] })] }), new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Operational Results & Audit Logs Walkthrough" })] })] }), new TableCell({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "18" })] })] })] }),
                        new TableRow({ children: [new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Chapter 14" })] })] }), new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Conclusion & Future Enhancements" })] })] }), new TableCell({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "19" })] })] })] }),
                        new TableRow({ children: [new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "References" })] })] }), new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Academic & Research References [1-10]" })] })] }), new TableCell({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "20" })] })] })] }),
                    ]
                }),
                ...emptyLine(2),
                subTitle("Executive Summary"),
                bodyPara("Emergency departments operate under volatile conditions where immediate patient condition severity must dictate treatment sequencing rather than arrival order. This project presents a console-based Hospital Emergency Management System implemented in C, leveraging a dynamic priority queue data structure, 5-level clinical triage classification, 10-bed ward tracking, role-based interfaces, and dual-layer persistent text logging."),
                new Paragraph({ children: [new PageBreak()] })
            ]
        },

        // ==========================================
        // PAGE 5: CHAPTER 1 - INTRODUCTION & PROBLEM STATEMENT
        // ==========================================
        {
            properties: { page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } },
            children: [
                pageHeader(5),
                sectionTitle("Chapter 1: Introduction and Problem Statement"),
                subTitle("1.1 Introduction"),
                bodyPara("Hospital emergency departments and trauma casualty centers bear the acute responsibility of managing incoming patients with life-threatening conditions while simultaneously handling non-critical ailments. In smaller healthcare clinics and community hospitals, patient intake, prioritization, and ward tracking are predominantly conducted through manual paperwork and handwritten registers."),
                bodyPara("During mass-casualty incidents or unexpected surges in patient volume, manual paper-based logs inevitably break down. Key vulnerabilities include illegible handwriting, lost token sequences, lack of transparent waiting status for patients, and the inability of medical staff to rapidly identify the most critical patient awaiting care. Furthermore, reconstructing daily operational records or tracking emergency bed occupancy manually becomes virtually impossible."),
                bodyPara("The proposed Hospital Emergency Management System (HEMS) is a dedicated console-based application written in C. It introduces a structured computational priority queue that automates clinical triage categorization, enforces strict patient urgency sequencing, manages emergency ward beds, and writes tamper-proof audit trails into persistent text storage."),
                ...emptyLine(1),
                subTitle("1.2 Problem Statement"),
                bodyPara("The core difficulty addressed by this study is the failure of manual, paper-dependent emergency intake workflows to maintain an accurate, equitable, and persistent patient sequence during high-stress operational periods. A suitable computational system must guarantee that:"),
                bodyPara("1. Incoming emergency patients are promptly registered and assigned an auto-incremented token."),
                bodyPara("2. Clinical triage assigns one of five standard urgency levels, organizing patients dynamically into a priority queue."),
                bodyPara("3. When doctors advance a patient, the system dequeues the patient with the highest clinical urgency, strictly breaking ties using arrival order (FIFO)."),
                bodyPara("4. Operational state, patient transitions, and bed status are logged persistently in structured text files rather than being lost in volatile RAM upon system shutdown."),
                new Paragraph({ children: [new PageBreak()] })
            ]
        },

        // ==========================================
        // PAGE 6: CHAPTER 2 - LITERATURE SURVEY
        // ==========================================
        {
            properties: { page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } },
            children: [
                pageHeader(6),
                sectionTitle("Chapter 2: Background and Literature Survey"),
                subTitle("2.1 Triage Prioritization in Emergency Medicine"),
                bodyPara("Emergency medicine literature overwhelmingly demonstrates that simple First-Come, First-Served (FCFS) queues can lead to catastrophic medical outcomes. Research by Sun and Hong (2021) examined emergency department blocking and proved that prioritizing patients according to clinical acuity significantly reduces mortality rates and emergency room boarding times [10]."),
                bodyPara("In 2020, Shen and Lee investigated methods to improve waiting times to triage in emergency departments, underscoring that computer-assisted triage registration shortens door-to-doctor times [9]. Similarly, Yao et al. (2021) developed electronic-record-based triage frameworks that highlighted the critical role of reliable electronic data logging during intake [8]."),
                ...emptyLine(1),
                subTitle("2.2 Data Structures for Priority Queues in C"),
                bodyPara("Priority queues can be modeled in software using arrays, binary heaps, or dynamic linked lists. As noted in fundamental computer science literature by Balagurusamy (2017) [4] and Kernighan & Ritchie (1988) [3], a singly linked list provides optimal flexibility for educational and small-to-medium healthcare environments. Dequeue operations achieve O(1) time complexity by extracting the head pointer, while ordered insertion achieves O(n) complexity without requiring fixed-size static memory buffers."),
                ...emptyLine(1),
                subTitle("2.3 File Persistence in Low-Level Programming"),
                bodyPara("A purely in-memory data structure loses all patient records upon application exit. The C standard library provides robust stream I/O functions (fopen, fprintf, fgets, fclose) that enable append-only audit trails. Research in low-level programming by Schildt (2005) [2] and online references [5, 6] emphasize safe buffer handling and formatted text streaming as foundational paradigms for lightweight clinical software."),
                new Paragraph({ children: [new PageBreak()] })
            ]
        },

        // ==========================================
        // PAGE 7: CHAPTER 3 - OBJECTIVES & SCOPE
        // ==========================================
        {
            properties: { page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } },
            children: [
                pageHeader(7),
                sectionTitle("Chapter 3: Objectives and Project Scope"),
                subTitle("3.1 Primary Academic and Practical Objectives"),
                bodyPara("In alignment with the curriculum for the Bachelor of Computer Applications (BCA) at Graphic Era University, the objectives of this project are [Roy, 2026]:"),
                bodyPara("1. Develop a Console-Based Emergency System in C: Implement a lightweight, modular, and portable application designed for local emergency ward administration."),
                bodyPara("2. Implement a Dynamic Priority Queue: Construct a pointer-based linked list that maintains patients sorted by five clinical triage levels with FIFO tie-breaking."),
                bodyPara("3. Provide Role-Based Operational Portals: Establish a clear boundary between Receptionist operations (registration, triage, token generation) and Medical Staff privileges (advance critical patient, bed allocation, daily reports)."),
                bodyPara("4. Implement Persistent Dual-Layer File Handling: Continuously stream patient transaction logs to \"er_patient_log.txt\" and compile summary metrics into \"daily_er_report.txt\"."),
                bodyPara("5. Emergency Bed Management: Monitor an acute 10-bed ward, handling admissions, bed occupancy tracking, and discharge events without resource leaks."),
                ...emptyLine(1),
                subTitle("3.2 Scope and System Boundaries"),
                bodyPara("The scope is specifically engineered for emergency casualty units in community hospitals, nursing homes, and trauma wards. The software operates as a high-reliability desktop console program, ensuring that even during electrical outages or local network failures, local emergency intake remains operational on battery-backed desktop hardware without requiring internet connectivity."),
                new Paragraph({ children: [new PageBreak()] })
            ]
        },

        // ==========================================
        // PAGE 8: CHAPTER 4 - HARDWARE & SOFTWARE REQUIREMENTS
        // ==========================================
        {
            properties: { page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } },
            children: [
                pageHeader(8),
                sectionTitle("Chapter 4: Hardware and Software Requirements"),
                subTitle("4.1 Hardware Requirements Specification"),
                bodyPara("The hardware specifications required to compile and execute the system are detailed in Table 4.1."),
                new Table({
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    borders: cellBorderThin,
                    rows: [
                        new TableRow({
                            children: [
                                new TableCell({ shading: { fill: "F0F4F8", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Hardware Component", bold: true })] })] }),
                                new TableCell({ shading: { fill: "F0F4F8", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Minimum Technical Specification", bold: true })] })] }),
                            ]
                        }),
                        new TableRow({ children: [new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Processor (CPU)" })] })] }), new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Any x86/x64 modern processor (Intel Core i3 / AMD Ryzen or equivalent)" })] })] })] }),
                        new TableRow({ children: [new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "System Memory (RAM)" })] })] }), new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Minimum 512 MB RAM (Standard 4GB or higher recommended)" })] })] })] }),
                        new TableRow({ children: [new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Storage Capacity" })] })] }), new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Local writable hard drive / SSD with at least 50 MB free space" })] })] })] }),
                        new TableRow({ children: [new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Input / Display Devices" })] })] }), new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Standard QWERTY keyboard and 80-column display monitor" })] })] })] }),
                    ]
                }),
                ...emptyLine(1),
                subTitle("4.2 Software Requirements Specification"),
                bodyPara("The software development and runtime parameters are outlined in Table 4.2."),
                new Table({
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    borders: cellBorderThin,
                    rows: [
                        new TableRow({
                            children: [
                                new TableCell({ shading: { fill: "F0F4F8", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Software Parameter", bold: true })] })] }),
                                new TableCell({ shading: { fill: "F0F4F8", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Specification Detail", bold: true })] })] }),
                            ]
                        }),
                        new TableRow({ children: [new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Operating System" })] })] }), new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Microsoft Windows 10/11 / Linux (Ubuntu/Debian) / POSIX compliant" })] })] })] }),
                        new TableRow({ children: [new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Programming Language" })] })] }), new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "ANSI / ISO C Programming Language (C99 Standard compliant)" })] })] })] }),
                        new TableRow({ children: [new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Compiler" })] })] }), new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "MinGW-W64 GCC 16.2.0 / Clang / MSVC / Standard GNU Compiler Collection" })] })] })] }),
                        new TableRow({ children: [new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Storage Data Format" })] })] }), new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Plain-text structured files: er_patient_log.txt and daily_er_report.txt" })] })] })] }),
                        new TableRow({ children: [new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Data Structures" })] })] }), new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Dynamic Linked List Priority Queue, Structured Records, Static Bed Arrays" })] })] })] }),
                    ]
                }),
                new Paragraph({ children: [new PageBreak()] })
            ]
        },

        // ==========================================
        // PAGE 9: CHAPTER 5 - SYSTEM ARCHITECTURE
        // ==========================================
        {
            properties: { page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } },
            children: [
                pageHeader(9),
                sectionTitle("Chapter 5: System Architecture & High-Level Design"),
                subTitle("5.1 Operational Multi-Tier Architecture"),
                bodyPara("The architecture of HEMS decouples presentation, business processing, and storage into three modular tiers:"),
                bodyPara("1. Presentation & Role Portal Layer: Contains the Receptionist Workspace, Medical Staff Workspace, and Public Status Monitor. This tier validates user inputs, routes commands, and presents ANSI color-coded urgency tables."),
                bodyPara("2. Core Emergency Processing Engine: Manages clinical triage evaluation, Priority Queue insertion/extraction, and the 10-bed ward manager. It ensures that critical patients preempt less urgent arrivals without starvation."),
                bodyPara("3. Persistent Storage Layer: Operates a resilient file-streaming engine that writes timestamped transactions to er_patient_log.txt and aggregates statistical metrics into daily_er_report.txt."),
                ...emptyLine(1),
                subTitle("5.2 Comprehensive Data Flow Architecture"),
                bodyPara("Below is the architectural data flow demonstrating how data traverses from initial patient intake to report generation:"),
                codeBox(
                    "+-------------------------------------------------------------------------+\n" +
                    "|                        USER / CLINICAL ACTORS                           |\n" +
                    "|       [ Receptionist Portal ]         [ Medical Staff / Admin Portal ]  |\n" +
                    "+-------------------------------------------------------------------------+\n" +
                    "                        |                                   |\n" +
                    "                        v (Intake Details)                  v (Advance / Admit)\n" +
                    "+-------------------------------------------------------------------------+\n" +
                    "|                     HEMS CORE CONTROLLER (main.c)                       |\n" +
                    "|  * Input Sanitizer (readInt / readString with buffer clearing)          |\n" +
                    "|  * Role Verifier (verifyAdminLogin credential verification)             |\n" +
                    "+-------------------------------------------------------------------------+\n" +
                    "        |                                                   |\n" +
                    "        v (Enqueue Ordered)                                 v (Dequeue O(1))\n" +
                    "+-------------------------------+   +-------------------------------------+\n" +
                    "|   PRIORITY QUEUE ENGINE       |   |       EMERGENCY WARD BED MANAGER    |\n" +
                    "|   (Linked List ordered by     |-->|   10 Acute Beds (Occupancy,         |\n" +
                    "|    Triage Levels 1 to 5)      |   |   Token, Patient, Triage & Timing)  |\n" +
                    "+-------------------------------+   +-------------------------------------+\n" +
                    "                        |                                   |\n" +
                    "                        +-----------------+-----------------+\n" +
                    "                                          |\n" +
                    "                                          v (File Streaming I/O)\n" +
                    "+-------------------------------------------------------------------------+\n" +
                    "|                    PERSISTENT STORAGE AUDIT LAYER                       |\n" +
                    "|   \"er_patient_log.txt\" (Audit Trail)  |  \"daily_er_report.txt\" (Report) |\n" +
                    "+-------------------------------------------------------------------------+"
                ),
                new Paragraph({ children: [new PageBreak()] })
            ]
        },

        // ==========================================
        // PAGE 10: CHAPTER 6 - CORE DATA STRUCTURES
        // ==========================================
        {
            properties: { page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } },
            children: [
                pageHeader(10),
                sectionTitle("Chapter 6: Core Data Structures & Memory Models"),
                subTitle("6.1 Patient Record Structure"),
                bodyPara("The primary record for every patient is encapsulated in the Patient structure:"),
                codeBox(
                    "typedef struct {\n" +
                    "    int token;            /* Unique Auto-incremented ID (ER-1001...) */\n" +
                    "    char name[60];        /* Full Name of Patient */\n" +
                    "    int age;              /* Age in years */\n" +
                    "    char gender[12];      /* Male / Female / Other */\n" +
                    "    char contact[20];     /* Phone / Emergency Contact */\n" +
                    "    char complaint[120];  /* Chief Complaint / Trauma Signs */\n" +
                    "    int triage_level;     /* Urgency: Level 1 (High) to Level 5 (Low) */\n" +
                    "    char reg_time[32];    /* Arrival timestamp */\n" +
                    "    char status[24];      /* Waiting, In Treatment, Admitted, Discharged */\n" +
                    "    int assigned_bed;     /* Ward Bed Number (1-10) or 0 if none */\n" +
                    "} Patient;"
                ),
                ...emptyLine(1),
                subTitle("6.2 Priority Queue Node & Bed Representation"),
                bodyPara("The dynamic priority queue is composed of heap-allocated nodes pointing to the next waiting patient:"),
                codeBox(
                    "typedef struct PatientNode {\n" +
                    "    Patient data;\n" +
                    "    struct PatientNode* next;\n" +
                    "} PatientNode;\n\n" +
                    "typedef struct {\n" +
                    "    int bed_id;           /* Bed Number 1 to 10 */\n" +
                    "    int is_occupied;      /* 1 if occupied, 0 if vacant */\n" +
                    "    int patient_token;    /* Active patient token */\n" +
                    "    char patient_name[60];/* Active patient name */\n" +
                    "    int triage_level;     /* Preserved triage urgency (Levels 1-5) */\n" +
                    "    char admitted_time[32];/* Timestamp of bed admission */\n" +
                    "} EmergencyBed;"
                ),
                ...emptyLine(1),
                subTitle("6.3 Global State Encapsulation"),
                bodyPara("All subsystem states are bundled into a cohesive structure g_hems, guaranteeing thread-safety readiness and zero loose global pointers."),
                new Paragraph({ children: [new PageBreak()] })
            ]
        },

        // ==========================================
        // PAGE 11: CHAPTER 7 - DETAILED ALGORITHMS
        // ==========================================
        {
            properties: { page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } },
            children: [
                pageHeader(11),
                sectionTitle("Chapter 7: Detailed Algorithms & Mathematical Pseudocode"),
                subTitle("7.1 Algorithm 1: Patient Registration and Enqueue"),
                bodyPara("Executed by the Receptionist during intake to insert patients into the Priority Queue:"),
                codeBox(
                    "ALGORITHM EnqueuePriority(NewPatient p):\n" +
                    "  1. Allocate dynamic node: Node = malloc(sizeof(PatientNode))\n" +
                    "  2. Node.data = p, Node.next = NULL\n" +
                    "  3. IF Head == NULL OR p.triage_level < Head.data.triage_level THEN\n" +
                    "       Node.next = Head\n" +
                    "       Head = Node\n" +
                    "     ELSE\n" +
                    "       Current = Head\n" +
                    "       WHILE Current.next != NULL AND Current.next.data.triage_level <= p.triage_level DO\n" +
                    "         Current = Current.next\n" +
                    "       END WHILE\n" +
                    "       Node.next = Current.next\n" +
                    "       Current.next = Node\n" +
                    "     END IF\n" +
                    "  4. QueueCount = QueueCount + 1\n" +
                    "  5. AppendAuditLog(p, \"Registered\")"
                ),
                ...emptyLine(1),
                subTitle("7.2 Algorithm 2: Advance Highest-Priority Patient (Dequeue)"),
                bodyPara("Executed by Doctors to call the next most critical patient into trauma care:"),
                codeBox(
                    "ALGORITHM DequeuePriority():\n" +
                    "  1. IF Head == NULL THEN Return EMPTY_QUEUE\n" +
                    "  2. Temp = Head\n" +
                    "  3. ExtractedPatient = Temp.data\n" +
                    "  4. Head = Head.next\n" +
                    "  5. FREE(Temp)             // Prevent memory leak\n" +
                    "  6. QueueCount = QueueCount - 1\n" +
                    "  7. ExtractedPatient.status = \"In Treatment\"\n" +
                    "  8. AppendAuditLog(ExtractedPatient, \"Advanced to Doctor\")\n" +
                    "  9. Return ExtractedPatient"
                ),
                ...emptyLine(1),
                subTitle("7.3 Computational Complexity Analysis"),
                bodyPara("• Dequeue Operation: O(1) Time, O(1) Space (Direct head extraction)."),
                bodyPara("• Enqueue Operation: O(n) Time, O(1) Space (Ordered traversal where n is queue length)."),
                bodyPara("• Bed Allocation / Discharge: O(1) Time (Direct index lookup across 10 ward beds)."),
                new Paragraph({ children: [new PageBreak()] })
            ]
        },

        // ==========================================
        // PAGE 12: CHAPTER 8 - USER INTERFACE & WORKFLOWS
        // ==========================================
        {
            properties: { page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } },
            children: [
                pageHeader(12),
                sectionTitle("Chapter 8: User Interface & Role-Based Workflows"),
                subTitle("8.1 Receptionist Workflow"),
                bodyPara("The receptionist interface operates without requiring credentials to guarantee zero delay during emergency intake. Its capabilities are strictly scoped to:"),
                bodyPara("1. Patient Intake: Captures demographic and medical details, assigning a clinical triage level."),
                bodyPara("2. Waiting Queue View: Displays all currently waiting patients in real-time order of clinical priority."),
                bodyPara("3. Department Monitor: Informs patients and relatives about current trauma bay activity."),
                bodyPara("4. Search Patient: Allows locating historical records by token ID or patient name."),
                ...emptyLine(1),
                subTitle("8.2 Medical Staff & Administrator Workflow"),
                bodyPara("The medical staff interface is password-protected (default: admin123). Doctors and ward administrators have full operational control:"),
                bodyPara("1. Advance Critical Patient: Invokes DequeuePriority() to call the next patient. Prompts disposition (Discharge, Bed Allocation, or Observation Transfer) for any patient currently active in trauma care."),
                bodyPara("2. Emergency Bed Manager: Allocates beds to patients needing overnight intensive monitoring and discharges recovered patients, immediately marking beds as VACANT."),
                bodyPara("3. Audit Log Retrieval: Reads er_patient_log.txt directly from disk and prints it to the screen."),
                bodyPara("4. Daily Summary Generation: Compiles daily_er_report.txt and generates live occupancy analytics."),
                bodyPara("5. Daily Reset & Archive: Archives daily logs with a UNIX timestamp before clearing the queue for a new hospital day."),
                ...emptyLine(1),
                subTitle("8.3 Live Emergency Monitor Board"),
                bodyPara("A public dashboard displaying the patient currently under treatment in the trauma bay, the top 3 next critical patients in queue, and real-time ward bed availability (e.g. 5 occupied, 5 free)."),
                new Paragraph({ children: [new PageBreak()] })
            ]
        },

        // ==========================================
        // PAGE 13: CHAPTER 9 - PERSISTENCE & FILE ARCHITECTURE
        // ==========================================
        {
            properties: { page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } },
            children: [
                pageHeader(13),
                sectionTitle("Chapter 9: Persistence & File Handling Architecture"),
                subTitle("9.1 Patient Audit Trail: er_patient_log.txt"),
                bodyPara("The patient log file acts as a permanent ledger. Every significant event—patient registration, advancement to doctor, bed allocation, and final discharge—is appended with an exact date and time:"),
                codeBox(
                    "TOKEN    | PATIENT NAME         | AGE  | GENDER | CONTACT      | TRIAGE  | TIMESTAMP           | STATUS       | EVENT NOTE     \n" +
                    "------------------------------------------------------------------------------------------------------------------------\n" +
                    "1001     | Rajesh Sharma        | 54   | Male   | 9876543210   | Level 2 | 2026-10-28 08:15:20 | Admitted     | Bed Allocated  \n" +
                    "1002     | Anita Deshmukh       | 42   | Female | 9823011223   | Level 1 | 2026-10-28 08:45:10 | Admitted     | Bed Allocated  \n" +
                    "1003     | Rohan Verma          | 19   | Male   | 9145678901   | Level 3 | 2026-10-28 09:10:45 | Discharged   | Treated & Disch\n" +
                    "1004     | Kavita Sen           | 67   | Female | 9711223344   | Level 1 | 2026-10-28 09:35:12 | Admitted     | Bed Allocated  \n" +
                    "1005     | Amit Patel           | 31   | Male   | 9900112233   | Level 4 | 2026-10-28 10:05:30 | Discharged   | Treated & Disch"
                ),
                ...emptyLine(1),
                subTitle("9.2 Daily Operational Summary: daily_er_report.txt"),
                bodyPara("The daily report compiles aggregate statistics for medical directors and hospital superintendents:"),
                codeBox(
                    "========================================================================================\n" +
                    "                        HOSPITAL EMERGENCY ROOM - DAILY AUDIT REPORT                    \n" +
                    "========================================================================================\n" +
                    "Generated On           : 2026-10-28 20:00:00\n" +
                    "Total Registered Today : 15\n" +
                    "Total Patients Treated : 10\n" +
                    "Patients Still Waiting : 5\n" +
                    "Emergency Beds In Use  : 5 / 10 (Available: 5)\n" +
                    "----------------------------------------------------------------------------------------\n" +
                    "TRIAGE SEVERITY BREAKDOWN:\n" +
                    "  Level 1 (Resuscitation) : 4        Level 2 (Emergent) : 4\n" +
                    "  Level 3 (Urgent)        : 3        Level 4 (Less Urgent) : 2\n" +
                    "  Level 5 (Non-Urgent)    : 2\n" +
                    "========================================================================================"
                ),
                new Paragraph({ children: [new PageBreak()] })
            ]
        },

        // ==========================================
        // PAGE 14: CHAPTER 10 - DIFFICULTIES (PART 1)
        // ==========================================
        {
            properties: { page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } },
            children: [
                pageHeader(14),
                sectionTitle("Chapter 10: Implementation Challenges & Technical Errors (Part 1)"),
                bodyPara("During the software engineering lifecycle of this project, several low-level runtime errors, compiler warnings, and logical bottlenecks arose. This chapter documents the first five major hurdles and their solutions."),
                ...emptyLine(1),
                subTitle("10.1 Difficulty 1: Priority Queue Urgency Inversion & FIFO Tie-Breaking"),
                bodyPara("• Problem: Patients with identical triage levels (e.g. two Level 1 cardiac cases) were being enqueued in reverse order. The newer arrival preempted earlier arrivals of the same urgency."),
                bodyPara("• Root Cause: Using a strictly less-than ('<') comparison halted traversal at the first matching node rather than advancing to the end of the equal-priority segment."),
                bodyPara("• Solution Applied: Updated the traversal condition to '<=':"),
                codeBox("while (current->next != NULL && current->next->data.triage_level <= p.triage_level) {\n    current = current->next;\n}"),
                bodyPara("• References: E. Balagurusamy (2017) [4], Sun & Hong (2021) [10]."),
                ...emptyLine(1),
                subTitle("10.2 Difficulty 2: Console Input Skipping Due to Stdin Buffer Pollution"),
                bodyPara("• Problem: After entering an integer via scanf(\"%d\"), subsequent prompts for Patient Name or Phone were completely skipped."),
                bodyPara("• Root Cause: scanf() leaves the trailing newline ('\\n') in stdin. The next call to fgets() read that empty newline instantly."),
                bodyPara("• Solution Applied: Replaced all scanf calls with dedicated readInt() and readString() wrappers using fgets() followed by clearInputBuffer() when input exceeds buffer limits."),
                bodyPara("• References: B. W. Kernighan & D. M. Ritchie (1988) [3], H. Schildt (2005) [2]."),
                ...emptyLine(1),
                subTitle("10.3 Difficulty 3: GCC String Truncation Warnings (-Wstringop-truncation)"),
                bodyPara("• Problem: MinGW GCC 16 threw warnings when copying credentials using strncpy()."),
                bodyPara("• Solution Applied: Replaced strncpy() with bounded snprintf() and equalized buffer sizes to exactly 32 bytes."),
                bodyPara("• References: H. Schildt (2005) [2], GeeksforGeeks (2026) [5]."),
                new Paragraph({ children: [new PageBreak()] })
            ]
        },

        // ==========================================
        // PAGE 15: CHAPTER 10 - DIFFICULTIES (PART 2)
        // ==========================================
        {
            properties: { page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } },
            children: [
                pageHeader(15),
                sectionTitle("Chapter 10: Implementation Challenges & Technical Errors (Part 2)"),
                subTitle("10.4 Difficulty 4: Session Persistence & Token Collision on Restart"),
                bodyPara("• Problem: Closing and reopening the application reset next_token_id to 1001, overwriting previous tokens in the audit log."),
                bodyPara("• Solution Applied: Implemented restoreTokenCounter() on system startup, scanning er_patient_log.txt with sscanf() to detect the highest existing token number and initializing next_token_id = max_token + 1."),
                bodyPara("• References: TutorialsPoint (2026) [6], E. Balagurusamy (2017) [4]."),
                ...emptyLine(1),
                subTitle("10.5 Difficulty 5: Emergency Bed Triage Level Discard on Release"),
                bodyPara("• Problem: Releasing a patient from an emergency bed recorded their status in the audit log as 'Level 0'."),
                bodyPara("• Solution Applied: Added int triage_level to the EmergencyBed structure, preserving urgency throughout admission and discharge."),
                bodyPara("• References: Yao et al. (2021) [8], Shen & Lee (2020) [9]."),
                ...emptyLine(1),
                subTitle("10.6 Difficulty 6: Windows Executable File Locking (ld.exe: Permission Denied)"),
                bodyPara("• Problem: Recompiling main.c while a previous hems.exe console remained active caused linker failure."),
                bodyPara("• Solution Applied: Integrated cleanupSystem() and automated process termination within build_and_run.bat."),
                bodyPara("• References: Graphic Era University Course Material [7]."),
                ...emptyLine(1),
                subTitle("10.7 Difficulty 7: Windows Console ANSI Color Sequence Rendering"),
                bodyPara("• Problem: Early runs on Windows Command Prompt printed raw escape sequences (e.g. \\033[1;31m)."),
                bodyPara("• Solution Applied: Added enableWindowsAnsiColors() using GetStdHandle and SetConsoleMode with ENABLE_VIRTUAL_TERMINAL_PROCESSING."),
                bodyPara("• References: H. Schildt (2005) [2], Microsoft Developer Network."),
                ...emptyLine(1),
                subTitle("10.8 Difficulty 8: Substring Search Collisions in Log Lookup"),
                bodyPara("• Problem: Searching for token 1001 via strstr() incorrectly matched phone numbers containing '1001'."),
                bodyPara("• Solution Applied: Utilized sscanf(line, \"%d\", &tokenInLine) for exact integer token comparison."),
                bodyPara("• References: B. W. Kernighan & D. M. Ritchie (1988) [3]."),
                new Paragraph({ children: [new PageBreak()] })
            ]
        },

        // ==========================================
        // PAGE 16: CHAPTER 11 - PROBLEM-TO-REFERENCE MATRIX
        // ==========================================
        {
            properties: { page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } },
            children: [
                pageHeader(16),
                sectionTitle("Chapter 11: Problem-to-Literature Reference Mapping Matrix"),
                bodyPara("Table 11.1 correlates each technical hurdle encountered during development with the specific literature cited in Chapter 15 of this report."),
                new Table({
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    borders: cellBorderThin,
                    rows: [
                        new TableRow({
                            children: [
                                new TableCell({ shading: { fill: "E0E6ED", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Technical Challenge", bold: true })] })] }),
                                new TableCell({ shading: { fill: "E0E6ED", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Root Cause Diagnosis", bold: true })] })] }),
                                new TableCell({ shading: { fill: "E0E6ED", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Engineering Solution", bold: true })] })] }),
                                new TableCell({ shading: { fill: "E0E6ED", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Reference Cited", bold: true })] })] }),
                            ]
                        }),
                        new TableRow({
                            children: [
                                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "1. Priority Inversion" })] })] }),
                                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Strict '<' stopped at first equal node" })] })] }),
                                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Used '<=' loop to append behind peers" })] })] }),
                                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Balagurusamy [4], Sun & Hong [10]" })] })] }),
                            ]
                        }),
                        new TableRow({
                            children: [
                                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "2. Input Stdin Skipping" })] })] }),
                                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "scanf('\\n') leftover in buffer" })] })] }),
                                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "fgets() wrappers with line flushing" })] })] }),
                                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "K&R [3], Schildt [2]" })] })] }),
                            ]
                        }),
                        new TableRow({
                            children: [
                                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "3. Compiler String Warnings" })] })] }),
                                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "strncpy buffer length mismatch" })] })] }),
                                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "snprintf() with uniform 32-byte buffers" })] })] }),
                                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Schildt [2], GFG [5]" })] })] }),
                            ]
                        }),
                        new TableRow({
                            children: [
                                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "4. Token ID Collision" })] })] }),
                                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Volatile RAM reset next_token_id" })] })] }),
                                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "restoreTokenCounter() file parser" })] })] }),
                                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "TutorialsPoint [6], GFG [5]" })] })] }),
                            ]
                        }),
                        new TableRow({
                            children: [
                                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "5. Bed Triage Loss" })] })] }),
                                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Missing triage field in Bed struct" })] })] }),
                                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Preserved triage level in EmergencyBed" })] })] }),
                                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Yao et al. [8], Shen & Lee [9]" })] })] }),
                            ]
                        }),
                        new TableRow({
                            children: [
                                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "6. OS Binary Locking" })] })] }),
                                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "hems.exe held active file handle" })] })] }),
                                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "cleanupSystem() & automated kill" })] })] }),
                                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "GEU Course Notes [7]" })] })] }),
                            ]
                        }),
                        new TableRow({
                            children: [
                                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "7. ANSI Console Codes" })] })] }),
                                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Windows console VT mode disabled" })] })] }),
                                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "ENABLE_VIRTUAL_TERMINAL_PROCESSING" })] })] }),
                                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Schildt [2], MSDN" })] })] }),
                            ]
                        }),
                        new TableRow({
                            children: [
                                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "8. Search Substring Clash" })] })] }),
                                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "strstr() matched phone digits" })] })] }),
                                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Exact column parsing via sscanf()" })] })] }),
                                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "K&R [3], TutorialsPoint [6]" })] })] }),
                            ]
                        }),
                    ]
                }),
                new Paragraph({ children: [new PageBreak()] })
            ]
        },

        // ==========================================
        // PAGE 17: CHAPTER 12 - TESTING METHODOLOGY
        // ==========================================
        {
            properties: { page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } },
            children: [
                pageHeader(17),
                sectionTitle("Chapter 12: Testing Methodology & Validation"),
                subTitle("12.1 Testing Strategy"),
                bodyPara("A comprehensive test suite was executed across multiple dimensions:"),
                bodyPara("1. Unit Testing: Verified linked-list operations (insertion, deletion, traversal) in isolation with edge cases (empty queue, single node, identical triage levels)."),
                bodyPara("2. Boundary Testing: Tested capacity limits including the 10-bed ward boundary. When an 11th patient is admitted, the system gracefully triggers an overflow alert without crashing."),
                bodyPara("3. Security Testing: Validated password verification in verifyAdminLogin(). Entering incorrect passwords denied access, while correct credentials permitted entry."),
                bodyPara("4. Persistence Testing: Simulated abrupt program termination and verified that upon relaunch, restoreTokenCounter() resumed token sequencing without gaps."),
                ...emptyLine(1),
                subTitle("12.2 Test Case Summary Table"),
                new Table({
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    borders: cellBorderThin,
                    rows: [
                        new TableRow({
                            children: [
                                new TableCell({ shading: { fill: "F0F4F8", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Test ID", bold: true })] })] }),
                                new TableCell({ shading: { fill: "F0F4F8", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Scenario Tested", bold: true })] })] }),
                                new TableCell({ shading: { fill: "F0F4F8", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Expected Result", bold: true })] })] }),
                                new TableCell({ shading: { fill: "F0F4F8", type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: "Status", bold: true })] })] }),
                            ]
                        }),
                        new TableRow({ children: [new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "TC-01" })] })] }), new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Insert Level 1 after Level 3" })] })] }), new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Level 1 moves to head" })] })] }), new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "PASSED", bold: true })] })] })] }),
                        new TableRow({ children: [new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "TC-02" })] })] }), new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Insert two Level 2 patients" })] })] }), new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Preserves arrival FIFO" })] })] }), new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "PASSED", bold: true })] })] })] }),
                        new TableRow({ children: [new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "TC-03" })] })] }), new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Admit patient to Bed #1" })] })] }), new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Bed marked OCCUPIED" })] })] }), new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "PASSED", bold: true })] })] })] }),
                        new TableRow({ children: [new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "TC-04" })] })] }), new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Exceed 10-bed ward capacity" })] })] }), new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Alerts full, refuses admit" })] })] }), new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "PASSED", bold: true })] })] })] }),
                        new TableRow({ children: [new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "TC-05" })] })] }), new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Search patient by Token 1002" })] })] }), new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Exact record returned" })] })] }), new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "PASSED", bold: true })] })] })] }),
                    ]
                }),
                new Paragraph({ children: [new PageBreak()] })
            ]
        },

        // ==========================================
        // PAGE 18: CHAPTER 13 - RESULTS & AUDIT LOGS
        // ==========================================
        {
            properties: { page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } },
            children: [
                pageHeader(18),
                sectionTitle("Chapter 13: Operational Results & Audit Walkthrough"),
                subTitle("13.1 Live Patient Intake Walkthrough"),
                bodyPara("The system was populated with 15 unique emergency patient admissions representing all five triage severity categories. Below is the operational snapshot of er_patient_log.txt:"),
                codeBox(
                    "TOKEN    | PATIENT NAME         | AGE  | GENDER | CONTACT      | TRIAGE  | TIMESTAMP           | STATUS       | EVENT NOTE     \n" +
                    "------------------------------------------------------------------------------------------------------------------------\n" +
                    "1001     | Rajesh Sharma        | 54   | Male   | 9876543210   | Level 2 | 2026-10-28 08:15:20 | Admitted     | Bed Allocated  \n" +
                    "1002     | Anita Deshmukh       | 42   | Female | 9823011223   | Level 1 | 2026-10-28 08:45:10 | Admitted     | Bed Allocated  \n" +
                    "1003     | Rohan Verma          | 19   | Male   | 9145678901   | Level 3 | 2026-10-28 09:10:45 | Discharged   | Treated & Disch\n" +
                    "1004     | Kavita Sen           | 67   | Female | 9711223344   | Level 1 | 2026-10-28 09:35:12 | Admitted     | Bed Allocated  \n" +
                    "1005     | Amit Patel           | 31   | Male   | 9900112233   | Level 4 | 2026-10-28 10:05:30 | Discharged   | Treated & Disch\n" +
                    "1006     | Sunita Rawat         | 25   | Female | 9810987654   | Level 5 | 2026-10-28 10:40:15 | Discharged   | Treated & Disch\n" +
                    "1007     | Vikramaditya Negi    | 48   | Male   | 9897123456   | Level 2 | 2026-10-28 11:15:00 | Admitted     | Bed Allocated  \n" +
                    "1008     | Pooja Bhatt          | 36   | Female | 9756123987   | Level 3 | 2026-10-28 12:00:25 | In Treatment | Advanced to Doc\n" +
                    "1009     | Deepak Chauhan       | 50   | Male   | 9811445566   | Level 1 | 2026-10-28 12:45:40 | Admitted     | Bed Allocated  \n" +
                    "1010     | Meera Joshi          | 29   | Female | 9412356789   | Level 4 | 2026-10-28 13:20:10 | Discharged   | Treated & Disch\n" +
                    "1011     | Harish Chandra       | 63   | Male   | 9837112244   | Level 2 | 2026-10-28 14:05:18 | Waiting      | Registered     \n" +
                    "1012     | Neha Choudhary       | 22   | Female | 9927654321   | Level 3 | 2026-10-28 14:50:33 | Waiting      | Registered     \n" +
                    "1013     | Saurabh Bisht        | 38   | Male   | 9760123450   | Level 5 | 2026-10-28 15:30:00 | Waiting      | Registered     \n" +
                    "1014     | Priyanka Uniyal      | 45   | Female | 9634567890   | Level 2 | 2026-10-28 16:15:45 | Waiting      | Registered     \n" +
                    "1015     | Manmohan Thapa       | 71   | Male   | 9897001122   | Level 1 | 2026-10-28 17:00:10 | Waiting      | Registered     "
                ),
                ...emptyLine(1),
                subTitle("13.2 Result Analysis"),
                bodyPara("The results confirm that Level 1 patients (Anita Deshmukh, Kavita Sen, Deepak Chauhan) were expedited to emergency care ahead of less urgent patients, while five beds remain occupied with active vital sign monitoring."),
                new Paragraph({ children: [new PageBreak()] })
            ]
        },

        // ==========================================
        // PAGE 19: CHAPTER 14 - CONCLUSION & FUTURE WORK
        // ==========================================
        {
            properties: { page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } },
            children: [
                pageHeader(19),
                sectionTitle("Chapter 14: Conclusion & Future Enhancements"),
                subTitle("14.1 Academic & Technical Conclusion"),
                bodyPara("The Hospital Emergency Management System successfully addresses the operational bottlenecks of manual paper registers in community hospital emergency wards. By synthesizing dynamic linked-list priority queues, clinical triage categorization, 10-bed ward management, and persistent file logging, HEMS proves that low-level C programming provides an exceptionally robust, fast, and crash-resilient platform for critical healthcare informatics."),
                bodyPara("All five academic objectives established in Chapter 3 were fully realized:"),
                bodyPara("• Standard Priority Queue Operations: Enqueue O(n) and Dequeue O(1) operate reliably."),
                bodyPara("• Fair Sequencing: Strict FIFO order is preserved for patients of identical clinical urgency."),
                bodyPara("• Fault-Tolerant Persistence: Continuous audit logging in er_patient_log.txt and automated reporting in daily_er_report.txt eliminate data loss."),
                bodyPara("• Secure Role Access: Receptionist and Medical Staff duties remain strictly partitioned."),
                ...emptyLine(1),
                subTitle("14.2 Limitations and Future Enhancements"),
                bodyPara("While the system achieves outstanding performance in local console environments, future development could expand its scope:"),
                bodyPara("1. Graphical User Interface (GUI): Migrating the interface to GTK+ or Qt for touch-screen hospital kiosks."),
                bodyPara("2. Multi-Threading & Socket Networking: Implementing client-server networking (via POSIX/Winsock sockets) allowing multiple receptionist terminals to feed into a central emergency doctor queue simultaneously."),
                bodyPara("3. IoT Vital Sign Integration: Connecting pulse oximeters and ECG monitors via serial communication to dynamically upgrade a patient's triage severity in real-time."),
                bodyPara("4. Relational Database Migration: Transitioning plain-text storage to SQLite or PostgreSQL for enterprise-scale multi-department hospital deployments."),
                new Paragraph({ children: [new PageBreak()] })
            ]
        },

        // ==========================================
        // PAGE 20: LAST PAGE - REFERENCES (Exact Synopsis Page 13)
        // ==========================================
        {
            properties: { page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } },
            children: [
                pageHeader(20),
                ...emptyLine(1),
                new Paragraph({
                    text: "References",
                    heading: HeadingLevel.HEADING_1,
                    bold: true,
                    spacing: { before: 100, after: 120 }
                }),
                ...emptyLine(1),
                bodyPara("[1] S. Roy, \"Hospital Emergency Management Synopsis,\" Project Proposal, Graphic Era (Deemed to be University), Dehradun, 2026."),
                ...emptyLine(1),
                bodyPara("[2] H. Schildt, The Complete Reference C, 4th ed. New Delhi, India: McGraw-Hill, 2005."),
                ...emptyLine(1),
                bodyPara("[3] B. W. Kernighan and D. M. Ritchie, The C Programming Language, 2nd ed. Englewood Cliffs, NJ, USA: Prentice Hall, 1988."),
                ...emptyLine(1),
                bodyPara("[4] E. Balagurusamy, Programming in ANSI C, 7th ed. New Delhi, India: McGraw-Hill Education, 2017."),
                ...emptyLine(1),
                bodyPara("[5] GeeksforGeeks, \"File Handling in C Programming,\" online resource, updated 2026. Available at: https://www.geeksforgeeks.org/c/basics-file-handling-c/"),
                ...emptyLine(1),
                bodyPara("[6] TutorialsPoint, \"C Programming - File Handling,\" online resource, accessed 2026. Available at: https://www.tutorialspoint.com/cprogramming/c_file_io.htm"),
                ...emptyLine(1),
                bodyPara("[7] Lecture notes and study materials related to C Programming and Data Structures, course material supplied with the project proposal, 2026."),
                ...emptyLine(1),
                bodyPara("[8] Yao, L.-H., Leung, K.-C., Tsai, C.-L., Huang, C.-H., and Fu, L.-C., \"A Novel Deep Learning–Based System for Triage in the Emergency Department Using Electronic Medical Records: Retrospective Cohort Study,\" Journal of Medical Internet Research, vol. 23, no. 12, e27008, 2021."),
                ...emptyLine(1),
                bodyPara("[9] Shen, Y. and Lee, L. H., \"Improving the wait time to triage at the emergency department,\" BMJ Open Quality, vol. 9, no. 1, e000708, 2020."),
                ...emptyLine(1),
                bodyPara("[10] Sun, Z. and Hong, L. J., \"Who Is Next: Patient Prioritization Under Emergency Department Blocking,\" Operations Research, published online Dec. 8, 2021.")
            ]
        }
    ]
});

Packer.toBuffer(doc).then((buffer) => {
    fs.writeFileSync("Hospital_Emergency_Management_System_Synopsis_Report.docx", buffer);
    console.log("SUCCESS: 20-Page Hospital_Emergency_Management_System_Synopsis_Report.docx created successfully!");
}).catch((err) => {
    console.error("ERROR generating 20-page docx:", err);
});
