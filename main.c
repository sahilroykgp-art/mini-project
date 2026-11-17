/*
========================================================================================
    HOSPITAL EMERGENCY MANAGEMENT SYSTEM (HEMS)
    
    Academic Mini-Project for Bachelor of Computer Applications (BCA)
    Institution : Graphic Era (Deemed to be University), Dehradun
    Student     : Sahil Roy (Roll No. 2510610142)
    Supervisor  : Mr. Shubham Kumar (Assistant Professor)
    
    Core Features:
    1. Priority Queue using Linked List (Triage Levels 1 to 5)
    2. Emergency Ward Bed Management (10 Beds)
    3. Role-Based Access: Receptionist vs Medical Staff / Admin (admin123)
    4. File Persistence: er_patient_log.txt and daily_er_report.txt
========================================================================================
*/

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <ctype.h>

#define MAX_BEDS 10
#define PATIENT_LOG_FILE "er_patient_log.txt"
#define DAILY_REPORT_FILE "daily_er_report.txt"
#define DEFAULT_ADMIN_PASS "admin123"

/* ================= DATA STRUCTURES ================= */

typedef struct Patient {
    int token;
    char name[50];
    int age;
    char gender[10];
    char contact[20];
    char complaint[100];
    int triage_level;       /* 1 (Resuscitation) to 5 (Non-Urgent) */
    char reg_time[25];
    char status[20];        /* Waiting, In Treatment, Admitted, Discharged */
    int assigned_bed;
} Patient;

typedef struct PatientNode {
    Patient data;
    struct PatientNode* next;
} PatientNode;

typedef struct EmergencyBed {
    int bed_id;
    int is_occupied;
    int patient_token;
    char patient_name[50];
    int triage_level;
    char admitted_time[25];
} EmergencyBed;

typedef struct {
    PatientNode* queue_head;
    int queue_count;
    int next_token_id;
    int total_registered_today;
    int total_treated_today;
    int level_counts[6];
    EmergencyBed beds[MAX_BEDS];
    Patient currently_serving;
    int has_currently_serving;
    char admin_password[32];
} HEMS_State;

HEMS_State g_hems;

/* ================= HELPER FUNCTIONS ================= */

void getCurrentTimestamp(char* buf, size_t size) {
    time_t now = time(NULL);
    struct tm* t = localtime(&now);
    if (t) strftime(buf, size, "%Y-%m-%d %H:%M:%S", t);
    else snprintf(buf, size, "2026-11-17 00:00:00");
}

void getString(const char* prompt, char* buf, int max_len) {
    printf("%s", prompt);
    if (fgets(buf, max_len, stdin)) {
        size_t len = strlen(buf);
        if (len > 0 && buf[len - 1] == '\n') buf[len - 1] = '\0';
    } else {
        buf[0] = '\0';
    }
}

int getInt(const char* prompt, int min_val, int max_val) {
    char buf[64];
    int val;
    while (1) {
        printf("%s", prompt);
        if (!fgets(buf, sizeof(buf), stdin)) {
            if (feof(stdin)) exit(0);
            return min_val;
        }
        if (sscanf(buf, "%d", &val) == 1 && val >= min_val && val <= max_val) {
            return val;
        }
        printf("  [!] Please enter a number between %d and %d.\n", min_val, max_val);
    }
}

const char* getTriageName(int level) {
    switch (level) {
        case 1: return "Level 1: Resuscitation (Highest)";
        case 2: return "Level 2: Emergent / Critical";
        case 3: return "Level 3: Urgent";
        case 4: return "Level 4: Less Urgent";
        case 5: return "Level 5: Non-Urgent (Lowest)";
        default: return "Unknown";
    }
}

/* ================= BED MANAGEMENT ================= */

void initBeds(void) {
    for (int i = 0; i < MAX_BEDS; i++) {
        g_hems.beds[i].bed_id = i + 1;
        g_hems.beds[i].is_occupied = 0;
        g_hems.beds[i].patient_token = 0;
        g_hems.beds[i].patient_name[0] = '\0';
        g_hems.beds[i].triage_level = 0;
        g_hems.beds[i].admitted_time[0] = '\0';
    }
}

void displayBedStatus(void) {
    printf("\n========================================================================================\n");
    printf("                                EMERGENCY WARD BED STATUS                               \n");
    printf("========================================================================================\n");
    printf("%-6s | %-10s | %-9s | %-22s | %-8s | %-19s\n", "BED #", "STATUS", "TOKEN #", "PATIENT NAME", "TRIAGE", "ADMITTED AT");
    printf("----------------------------------------------------------------------------------------\n");
    int occupied = 0;
    for (int i = 0; i < MAX_BEDS; i++) {
        if (g_hems.beds[i].is_occupied) {
            occupied++;
            printf("%-6d | OCCUPIED   | ER-%-6d | %-22.22s | Level %-2d | %-19s\n",
                   g_hems.beds[i].bed_id, g_hems.beds[i].patient_token,
                   g_hems.beds[i].patient_name, g_hems.beds[i].triage_level, g_hems.beds[i].admitted_time);
        } else {
            printf("%-6d | VACANT     | -         | -                      | -        | -\n", g_hems.beds[i].bed_id);
        }
    }
    printf("========================================================================================\n");
    printf("  Total Beds: %d | Occupied: %d | Available: %d\n", MAX_BEDS, occupied, MAX_BEDS - occupied);
}

int allocateBed(int token, const char* name, int triage_level) {
    for (int i = 0; i < MAX_BEDS; i++) {
        if (!g_hems.beds[i].is_occupied) {
            g_hems.beds[i].is_occupied = 1;
            g_hems.beds[i].patient_token = token;
            g_hems.beds[i].triage_level = triage_level;
            snprintf(g_hems.beds[i].patient_name, sizeof(g_hems.beds[i].patient_name), "%s", name);
            getCurrentTimestamp(g_hems.beds[i].admitted_time, sizeof(g_hems.beds[i].admitted_time));
            return g_hems.beds[i].bed_id;
        }
    }
    return 0;
}

void logPatientToFile(const Patient* p, const char* action_note);

int dischargeBed(int bed_id) {
    if (bed_id < 1 || bed_id > MAX_BEDS) return -1;
    int idx = bed_id - 1;
    if (!g_hems.beds[idx].is_occupied) return 0;

    Patient p = {0};
    p.token = g_hems.beds[idx].patient_token;
    snprintf(p.name, sizeof(p.name), "%s", g_hems.beds[idx].patient_name);
    p.triage_level = g_hems.beds[idx].triage_level;
    strcpy(p.status, "Discharged");
    logPatientToFile(&p, "Bed Discharged");

    g_hems.beds[idx].is_occupied = 0;
    g_hems.beds[idx].patient_token = 0;
    g_hems.beds[idx].patient_name[0] = '\0';
    return 1;
}

/* ================= PRIORITY QUEUE (LINKED LIST) ================= */

void enqueuePriority(Patient p) {
    PatientNode* newNode = (PatientNode*)malloc(sizeof(PatientNode));
    if (!newNode) return;
    newNode->data = p;
    newNode->next = NULL;

    /* Insert ordered by triage urgency (1 is highest priority; '<=' maintains FIFO) */
    if (!g_hems.queue_head || p.triage_level < g_hems.queue_head->data.triage_level) {
        newNode->next = g_hems.queue_head;
        g_hems.queue_head = newNode;
    } else {
        PatientNode* curr = g_hems.queue_head;
        while (curr->next && curr->next->data.triage_level <= p.triage_level) {
            curr = curr->next;
        }
        newNode->next = curr->next;
        curr->next = newNode;
    }
    g_hems.queue_count++;
}

int dequeuePriority(Patient* out_p) {
    if (!g_hems.queue_head) return 0;
    PatientNode* temp = g_hems.queue_head;
    *out_p = temp->data;
    g_hems.queue_head = g_hems.queue_head->next;
    free(temp);
    g_hems.queue_count--;
    return 1;
}

void displayQueue(void) {
    printf("\n========================================================================================\n");
    printf("                             CURRENT EMERGENCY PRIORITY QUEUE                           \n");
    printf("========================================================================================\n");
    if (!g_hems.queue_head) {
        printf("  [i] No patients currently waiting in the emergency queue.\n");
        printf("========================================================================================\n");
        return;
    }
    printf("%-5s | %-8s | %-20s | %-4s | %-8s | %-26s | %-19s\n",
           "POS", "TOKEN", "PATIENT NAME", "AGE", "GENDER", "TRIAGE PRIORITY", "ARRIVAL TIME");
    printf("----------------------------------------------------------------------------------------\n");
    PatientNode* curr = g_hems.queue_head;
    int pos = 1;
    while (curr) {
        printf("%-5d | ER-%-5d | %-20.20s | %-4d | %-8.8s | %-26.26s | %-19s\n",
               pos++, curr->data.token, curr->data.name, curr->data.age,
               curr->data.gender, getTriageName(curr->data.triage_level), curr->data.reg_time);
        curr = curr->next;
    }
    printf("========================================================================================\n");
    printf("  Total Patients Waiting: %d\n", g_hems.queue_count);
}

/* ================= FILE OPERATIONS ================= */

void logPatientToFile(const Patient* p, const char* action_note) {
    FILE* fp = fopen(PATIENT_LOG_FILE, "a");
    if (!fp) return;
    char now[25];
    getCurrentTimestamp(now, sizeof(now));
    fprintf(fp, "%-8d | %-20.20s | %-4d | %-6.6s | %-12.12s | Level %-1d | %-19s | %-12.12s | %-15.15s\n",
            p->token, p->name, p->age, p->gender, p->contact, p->triage_level, now, p->status, action_note);
    fclose(fp);
}

void generateDailyReport(void) {
    FILE* fp = fopen(DAILY_REPORT_FILE, "w");
    if (!fp) return;
    char now[25];
    getCurrentTimestamp(now, sizeof(now));
    int occupied = 0;
    for (int i = 0; i < MAX_BEDS; i++) {
        if (g_hems.beds[i].is_occupied) occupied++;
    }

    fprintf(fp, "========================================================================================\n");
    fprintf(fp, "                        HOSPITAL EMERGENCY ROOM - DAILY AUDIT REPORT                    \n");
    fprintf(fp, "========================================================================================\n");
    fprintf(fp, "Generated On           : %s\n", now);
    fprintf(fp, "Emergency Department   : Trauma & Acute Care Center\n");
    fprintf(fp, "Total Registered Today : %d\n", g_hems.total_registered_today);
    fprintf(fp, "Total Patients Treated : %d\n", g_hems.total_treated_today);
    fprintf(fp, "Patients Still Waiting : %d\n", g_hems.queue_count);
    fprintf(fp, "Emergency Beds In Use  : %d / %d (Available: %d)\n", occupied, MAX_BEDS, MAX_BEDS - occupied);
    fprintf(fp, "----------------------------------------------------------------------------------------\n");
    fprintf(fp, "TRIAGE SEVERITY BREAKDOWN (REGISTERED TODAY):\n");
    for (int i = 1; i <= 5; i++) {
        fprintf(fp, "  %s : %d\n", getTriageName(i), g_hems.level_counts[i]);
    }
    fprintf(fp, "----------------------------------------------------------------------------------------\n");
    fprintf(fp, "EMERGENCY BED STATUS SNAPSHOT:\n");
    for (int i = 0; i < MAX_BEDS; i++) {
        if (g_hems.beds[i].is_occupied) {
            fprintf(fp, "  Bed #%02d : OCCUPIED | Token #%d (%s) | Admitted: %s\n",
                    g_hems.beds[i].bed_id, g_hems.beds[i].patient_token,
                    g_hems.beds[i].patient_name, g_hems.beds[i].admitted_time);
        } else {
            fprintf(fp, "  Bed #%02d : VACANT\n", g_hems.beds[i].bed_id);
        }
    }
    fprintf(fp, "========================================================================================\n");
    fprintf(fp, "End of Daily Summary Report.\n");
    fclose(fp);
}

void viewFileContent(const char* filename, const char* title) {
    FILE* fp = fopen(filename, "r");
    if (!fp) {
        printf("  [i] File '%s' not found.\n", filename);
        return;
    }
    printf("\n========================================================================================\n");
    printf("                               %s\n", title);
    printf("========================================================================================\n");
    char line[256];
    while (fgets(line, sizeof(line), fp)) printf("%s", line);
    fclose(fp);
    printf("========================================================================================\n");
}

/* ================= RECEPTIONIST WORKSPACE ================= */

void registerNewPatient(void) {
    Patient p = {0};
    printf("\n========================================================================================\n");
    printf("                          EMERGENCY PATIENT REGISTRATION & TRIAGE                       \n");
    printf("========================================================================================\n");

    p.token = g_hems.next_token_id++;
    printf("  Generated Token ID   : ER-%d\n", p.token);

    getString("  Enter Patient Name   : ", p.name, sizeof(p.name));
    if (!p.name[0]) strcpy(p.name, "Anonymous Patient");

    p.age = getInt("  Enter Patient Age    : ", 0, 130);

    printf("  Select Gender:\n    1. Male\n    2. Female\n    3. Other\n");
    int gChoice = getInt("  Enter Choice (1-3)   : ", 1, 3);
    strcpy(p.gender, gChoice == 1 ? "Male" : (gChoice == 2 ? "Female" : "Other"));

    getString("  Contact / Phone No.  : ", p.contact, sizeof(p.contact));
    if (!p.contact[0]) strcpy(p.contact, "N/A");

    getString("  Chief Complaint/Signs: ", p.complaint, sizeof(p.complaint));
    if (!p.complaint[0]) strcpy(p.complaint, "Emergency Trauma");

    printf("\n  --- Clinical Triage Priority Assessment ---\n");
    for (int i = 1; i <= 5; i++) printf("    [%d] %s\n", i, getTriageName(i));
    p.triage_level = getInt("\n  Assign Triage Level (1-5): ", 1, 5);

    getCurrentTimestamp(p.reg_time, sizeof(p.reg_time));
    strcpy(p.status, "Waiting");
    p.assigned_bed = 0;

    enqueuePriority(p);
    g_hems.total_registered_today++;
    g_hems.level_counts[p.triage_level]++;
    logPatientToFile(&p, "Registered");

    printf("\n  [SUCCESS] Patient ER-%d enqueued with %s!\n", p.token, getTriageName(p.triage_level));
    printf("  Current Queue Length: %d patient(s).\n", g_hems.queue_count);
}

void searchPatientRecord(void) {
    printf("\n========================================================================================\n");
    printf("                               SEARCH PATIENT EMERGENCY RECORDS                         \n");
    printf("========================================================================================\n");
    printf("  [1] Search by Token ID\n  [2] Search by Patient Name\n");
    int mode = getInt("  Choose search method (1-2): ", 1, 2);

    char query[64] = {0};
    int searchToken = 0;
    if (mode == 1) searchToken = getInt("  Enter Patient Token Number: ", 1, 999999);
    else getString("  Enter Patient Name (or part): ", query, sizeof(query));

    FILE* fp = fopen(PATIENT_LOG_FILE, "r");
    if (!fp) {
        printf("  [i] Patient log file not found.\n");
        return;
    }

    printf("\n  Matching Log Records:\n----------------------------------------------------------------------------------------\n");
    char line[256];
    int found = 0;
    while (fgets(line, sizeof(line), fp)) {
        if (mode == 1) {
            int tok = 0;
            if (sscanf(line, "%d", &tok) == 1 && tok == searchToken) {
                printf("  %s", line);
                found++;
            }
        } else {
            char lLine[256], lQuery[64];
            size_t i;
            for (i = 0; line[i] && i < sizeof(lLine) - 1; i++) lLine[i] = (char)tolower((unsigned char)line[i]);
            lLine[i] = '\0';
            for (i = 0; query[i] && i < sizeof(lQuery) - 1; i++) lQuery[i] = (char)tolower((unsigned char)query[i]);
            lQuery[i] = '\0';
            if (strstr(lLine, lQuery)) {
                printf("  %s", line);
                found++;
            }
        }
    }
    fclose(fp);
    if (!found) printf("  No patient records matched.\n");
    else printf("  Total matches found: %d\n", found);
}

/* ================= MEDICAL STAFF & ADMIN WORKSPACE ================= */

void advanceHighestPriorityPatient(void) {
    printf("\n========================================================================================\n");
    printf("                         ADVANCE HIGHEST-PRIORITY PATIENT (DEQUEUE)                     \n");
    printf("========================================================================================\n");

    if (!g_hems.queue_head) {
        printf("  [i] The emergency queue is currently empty. No patients waiting.\n");
        return;
    }

    if (g_hems.has_currently_serving) {
        printf("  [!] Notice: ER-%d (%s) is currently in treatment.\n",
               g_hems.currently_serving.token, g_hems.currently_serving.name);
        printf("  Select disposition for current patient:\n");
        printf("    [1] Complete Treatment & Discharge\n    [2] Admit to Emergency Bed\n    [3] Keep Active & Force Call Next Patient\n");
        int disp = getInt("  Choose option (1-3): ", 1, 3);
        if (disp == 1) {
            strcpy(g_hems.currently_serving.status, "Discharged");
            logPatientToFile(&g_hems.currently_serving, "Discharged");
            printf("  Patient ER-%d discharged.\n", g_hems.currently_serving.token);
            g_hems.has_currently_serving = 0;
        } else if (disp == 2) {
            int bed = allocateBed(g_hems.currently_serving.token, g_hems.currently_serving.name, g_hems.currently_serving.triage_level);
            if (bed > 0) {
                g_hems.currently_serving.assigned_bed = bed;
                strcpy(g_hems.currently_serving.status, "Admitted");
                logPatientToFile(&g_hems.currently_serving, "Bed Allocated");
                printf("  Patient ER-%d admitted to Bed #%d.\n", g_hems.currently_serving.token, bed);
                g_hems.has_currently_serving = 0;
            } else {
                printf("  [ALERT] Beds full! Patient remains in emergency bay.\n");
            }
        } else {
            logPatientToFile(&g_hems.currently_serving, "Shifted Care");
            g_hems.has_currently_serving = 0;
        }
    }

    Patient nextP;
    if (dequeuePriority(&nextP)) {
        strcpy(nextP.status, "In Treatment");
        g_hems.currently_serving = nextP;
        g_hems.has_currently_serving = 1;
        g_hems.total_treated_today++;
        logPatientToFile(&nextP, "In Treatment");

        printf("\n  >>> CALLING NEXT CRITICAL PATIENT TO TRAUMA BAY <<< \n");
        printf("  --------------------------------------------------------------------------------------\n");
        printf("  Token ID        : ER-%d\n", nextP.token);
        printf("  Patient Name    : %s\n", nextP.name);
        printf("  Age / Gender    : %d / %s\n", nextP.age, nextP.gender);
        printf("  Triage Category : %s\n", getTriageName(nextP.triage_level));
        printf("  Chief Complaint : %s\n", nextP.complaint);
        printf("  Arrival Time    : %s\n", nextP.reg_time);
        printf("  --------------------------------------------------------------------------------------\n");
        printf("  Remaining in Queue: %d patient(s).\n", g_hems.queue_count);
    }
}

void bedManagementMenu(void) {
    while (1) {
        displayBedStatus();
        printf("\n  --- Bed Management Options ---\n");
        printf("  [1] Admit Current Patient to an Available Bed\n");
        printf("  [2] Discharge Patient from a Bed\n");
        printf("  [3] Return to Medical Staff Menu\n");
        int choice = getInt("\n  Select option (1-3): ", 1, 3);
        if (choice == 1) {
            if (!g_hems.has_currently_serving) {
                printf("  [!] No patient is currently being served. Advance a patient first!\n");
            } else if (g_hems.currently_serving.assigned_bed > 0) {
                printf("  [!] Current patient (Token #%d) is already in Bed #%d.\n",
                       g_hems.currently_serving.token, g_hems.currently_serving.assigned_bed);
            } else {
                int bed = allocateBed(g_hems.currently_serving.token, g_hems.currently_serving.name, g_hems.currently_serving.triage_level);
                if (bed > 0) {
                    g_hems.currently_serving.assigned_bed = bed;
                    strcpy(g_hems.currently_serving.status, "Admitted");
                    logPatientToFile(&g_hems.currently_serving, "Bed Allocated");
                    printf("  [SUCCESS] Patient ER-%d admitted to Bed #%d.\n", g_hems.currently_serving.token, bed);
                    g_hems.has_currently_serving = 0;
                } else {
                    printf("  [ALERT] All emergency beds are currently full!\n");
                }
            }
        } else if (choice == 2) {
            int bed = getInt("  Enter Bed Number to discharge (1-10): ", 1, MAX_BEDS);
            int res = dischargeBed(bed);
            if (res == 1) printf("  [SUCCESS] Bed #%d is now VACANT.\n", bed);
            else if (res == 0) printf("  [i] Bed #%d was already vacant.\n", bed);
        } else {
            break;
        }
    }
}

void resetDailyRecords(void) {
    printf("\n  [WARNING] You are about to reset today's queue and bed records!\n");
    int confirm = getInt("  Are you sure? (1 = YES Reset, 2 = CANCEL): ", 1, 2);
    if (confirm != 1) {
        printf("  [i] Reset cancelled.\n");
        return;
    }
    generateDailyReport();
    PatientNode* curr = g_hems.queue_head;
    while (curr) {
        PatientNode* next = curr->next;
        free(curr);
        curr = next;
    }
    g_hems.queue_head = NULL;
    g_hems.queue_count = 0;
    g_hems.total_registered_today = 0;
    g_hems.total_treated_today = 0;
    g_hems.has_currently_serving = 0;
    for (int i = 0; i < 6; i++) g_hems.level_counts[i] = 0;
    initBeds();
    printf("  [SUCCESS] Today's records reset successfully.\n");
}

int verifyAdminLogin(void) {
    char pass[64];
    printf("\n  --- RESTRICTED ACCESS: MEDICAL STAFF & ADMIN ---\n");
    getString("  Enter Password: ", pass, sizeof(pass));
    if (strcmp(pass, g_hems.admin_password) == 0) {
        printf("  [ACCESS GRANTED] Welcome, Authorized Medical Staff.\n");
        return 1;
    }
    printf("  [ACCESS DENIED] Invalid password!\n");
    return 0;
}

void changePassword(void) {
    char currentPass[64], newPass[32], confirmPass[32];
    printf("\n  --- Change Admin Password ---\n");
    getString("  Current Password : ", currentPass, sizeof(currentPass));
    if (strcmp(currentPass, g_hems.admin_password) != 0) {
        printf("  [!] Incorrect current password!\n");
        return;
    }
    getString("  New Password     : ", newPass, sizeof(newPass));
    getString("  Confirm Password : ", confirmPass, sizeof(confirmPass));
    if (strcmp(newPass, confirmPass) == 0 && strlen(newPass) > 0) {
        snprintf(g_hems.admin_password, sizeof(g_hems.admin_password), "%s", newPass);
        printf("  [SUCCESS] Password updated successfully.\n");
    } else {
        printf("  [!] Passwords do not match or empty.\n");
    }
}

/* ================= LIVE STATUS & SYNOPSIS ================= */

void liveStatusDisplay(void) {
    int occupied = 0;
    for (int i = 0; i < MAX_BEDS; i++) {
        if (g_hems.beds[i].is_occupied) occupied++;
    }
    char now[25];
    getCurrentTimestamp(now, sizeof(now));

    printf("\n========================================================================================\n");
    printf("                 HOSPITAL EMERGENCY DEPARTMENT - LIVE MONITOR BOARD                     \n");
    printf("========================================================================================\n");
    printf("  System Time: %s | Status: 24x7 ACTIVE\n", now);
    printf("----------------------------------------------------------------------------------------\n");
    printf("  [CURRENTLY SERVING IN TRAUMA BAY]:\n");
    if (g_hems.has_currently_serving) {
        printf("    Token: ER-%d | Name: %s (Age: %d, %s)\n",
               g_hems.currently_serving.token, g_hems.currently_serving.name,
               g_hems.currently_serving.age, g_hems.currently_serving.gender);
        printf("    Category : %s\n    Complaint: %s\n",
               getTriageName(g_hems.currently_serving.triage_level), g_hems.currently_serving.complaint);
    } else {
        printf("    Trauma Bay is currently idle / Ready for next patient.\n");
    }
    printf("----------------------------------------------------------------------------------------\n");
    printf("  [STATISTICS SNAPSHOT]:\n");
    printf("    Waiting in Queue : %d\n    Treated Today    : %d\n", g_hems.queue_count, g_hems.total_treated_today);
    printf("    Total Registered : %d\n    Beds In Use      : %d / %d (Available: %d)\n",
           g_hems.total_registered_today, occupied, MAX_BEDS, MAX_BEDS - occupied);
    printf("========================================================================================\n");
}

void displayAboutSynopsis(void) {
    printf("\n========================================================================================\n");
    printf("                               ABOUT THIS PROJECT (SYNOPSIS INFO)                       \n");
    printf("========================================================================================\n");
    printf("  Project Title  : Hospital Emergency Management System (HEMS)\n");
    printf("  Degree Award   : Bachelor of Computer Applications (BCA)\n");
    printf("  Candidate Name : Sahil Roy | Roll No: 2510610142\n");
    printf("  Supervisor     : Mr. Shubham Kumar (Assistant Professor)\n");
    printf("  Institution    : Graphic Era (Deemed to be University), Dehradun\n");
    printf("  Academic Year  : 2026\n");
    printf("----------------------------------------------------------------------------------------\n");
    printf("  Key Technical Features:\n");
    printf("  1. Priority Queue       : Ordered Linked List based on Clinical Triage (Level 1-5)\n");
    printf("  2. Role Separation      : Receptionist (Enqueue) vs Medical Staff (Dequeue/Admin)\n");
    printf("  3. File Persistence     : Audit log ('%s'), Daily report ('%s')\n", PATIENT_LOG_FILE, DAILY_REPORT_FILE);
    printf("  4. Bed Management       : Tracking %d Emergency Ward Beds\n", MAX_BEDS);
    printf("========================================================================================\n");
}

/* ================= MENUS & MAIN ================= */

void receptionistMenu(void) {
    while (1) {
        printf("\n========================================================================================\n");
        printf("                                RECEPTIONIST WORKSPACE                                  \n");
        printf("========================================================================================\n");
        printf("  [1] Register New Emergency Patient (Triage & Enqueue)\n");
        printf("  [2] View Current Waiting Queue\n");
        printf("  [3] Check Department Serving Status\n");
        printf("  [4] Search Patient by Token or Name\n");
        printf("  [5] Return to Main Menu\n");
        printf("----------------------------------------------------------------------------------------\n");
        int choice = getInt("  Select Option (1-5): ", 1, 5);
        switch (choice) {
            case 1: registerNewPatient(); break;
            case 2: displayQueue(); break;
            case 3: liveStatusDisplay(); break;
            case 4: searchPatientRecord(); break;
            case 5: return;
        }
    }
}

void medicalStaffMenu(void) {
    while (1) {
        printf("\n========================================================================================\n");
        printf("                             MEDICAL STAFF & ADMIN WORKSPACE                            \n");
        printf("========================================================================================\n");
        printf("  [1] Advance Highest-Priority Patient (Dequeue & Begin Treatment)\n");
        printf("  [2] Emergency Bed Management (Allocate, Discharge, Ward View)\n");
        printf("  [3] View All Waiting Patients in Priority Queue\n");
        printf("  [4] View Historical ER Patient Log (%s)\n", PATIENT_LOG_FILE);
        printf("  [5] Generate & View Daily Emergency Report (%s)\n", DAILY_REPORT_FILE);
        printf("  [6] Reset / Archive Daily Emergency Records\n");
        printf("  [7] Change Medical Staff Password\n");
        printf("  [8] Return to Main Menu\n");
        printf("----------------------------------------------------------------------------------------\n");
        int choice = getInt("  Select Option (1-8): ", 1, 8);
        switch (choice) {
            case 1: advanceHighestPriorityPatient(); break;
            case 2: bedManagementMenu(); break;
            case 3: displayQueue(); break;
            case 4: viewFileContent(PATIENT_LOG_FILE, "ER PATIENT AUDIT LOG"); break;
            case 5: generateDailyReport(); viewFileContent(DAILY_REPORT_FILE, "DAILY EMERGENCY REPORT"); break;
            case 6: resetDailyRecords(); break;
            case 7: changePassword(); break;
            case 8: return;
        }
    }
}

void restoreTokenCounter(void) {
    FILE* fp = fopen(PATIENT_LOG_FILE, "r");
    if (!fp) return;
    char line[256];
    int max_token = 1000;
    while (fgets(line, sizeof(line), fp)) {
        int token = 0;
        if (sscanf(line, "%d", &token) == 1 && token > max_token && token < 1000000) {
            max_token = token;
        }
    }
    fclose(fp);
    g_hems.next_token_id = max_token + 1;
}

void cleanupSystem(void) {
    PatientNode* curr = g_hems.queue_head;
    while (curr) {
        PatientNode* next = curr->next;
        free(curr);
        curr = next;
    }
    g_hems.queue_head = NULL;
    g_hems.queue_count = 0;
}

void initSystem(void) {
    memset(&g_hems, 0, sizeof(HEMS_State));
    g_hems.next_token_id = 1001;
    strcpy(g_hems.admin_password, DEFAULT_ADMIN_PASS);
    initBeds();

    FILE* fp = fopen(PATIENT_LOG_FILE, "r");
    if (!fp) {
        fp = fopen(PATIENT_LOG_FILE, "w");
        if (fp) {
            fprintf(fp, "========================================================================================================================\n");
            fprintf(fp, "                            HOSPITAL EMERGENCY MANAGEMENT SYSTEM - PATIENT AUDIT LOG                                   \n");
            fprintf(fp, "========================================================================================================================\n");
            fprintf(fp, "%-8s | %-20s | %-4s | %-6s | %-12s | %-7s | %-19s | %-12s | %-15s\n",
                    "TOKEN", "PATIENT NAME", "AGE", "GENDER", "CONTACT", "TRIAGE", "TIMESTAMP", "STATUS", "EVENT NOTE");
            fprintf(fp, "------------------------------------------------------------------------------------------------------------------------\n");
            fclose(fp);
        }
    } else {
        fclose(fp);
        restoreTokenCounter();
    }
}

int main(void) {
    initSystem();

    printf("\n========================================================================================\n");
    printf("                      HOSPITAL EMERGENCY MANAGEMENT SYSTEM (HEMS)                       \n");
    printf("========================================================================================\n");
    printf("  Welcome to the Hospital Emergency Management System.\n");
    printf("  System initialized with Priority Queue, Bed Manager, and File Persistence.\n");

    while (1) {
        printf("\n========================================================================================\n");
        printf("                                    MAIN ROLE SELECTION                                 \n");
        printf("========================================================================================\n");
        printf("  [1] Receptionist Portal (Register, Triage, Token Generation, View Queue)\n");
        printf("  [2] Medical Staff / Admin Portal (Advance Patients, Bed Management, Logs, Reports)\n");
        printf("  [3] Live Emergency Status Board (Trauma Bay & Bed Occupancy)\n");
        printf("  [4] Project Details & Synopsis Summary\n");
        printf("  [5] Exit Application\n");
        printf("========================================================================================\n");

        int roleChoice = getInt("  Select Role / Option (1-5): ", 1, 5);
        switch (roleChoice) {
            case 1: receptionistMenu(); break;
            case 2: if (verifyAdminLogin()) medicalStaffMenu(); break;
            case 3: liveStatusDisplay(); break;
            case 4: displayAboutSynopsis(); break;
            case 5:
                printf("\n  Saving daily report before exiting...\n");
                generateDailyReport();
                cleanupSystem();
                printf("  [i] All records safely stored in '%s' and '%s'.\n", PATIENT_LOG_FILE, DAILY_REPORT_FILE);
                printf("  Thank you for using Hospital Emergency Management System. Goodbye!\n\n");
                return 0;
        }
    }
    return 0;
}
