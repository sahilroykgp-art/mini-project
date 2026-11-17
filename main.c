/*
========================================================================================
    HOSPITAL EMERGENCY MANAGEMENT SYSTEM (HEMS)
    
    Academic Project in C for Bachelor of Computer Applications (BCA)
    Institution: Graphic Era (Deemed to be University), Dehradun
    Submitted by: Sahil Roy (University Roll No. 2510610142)
    Supervisor: Mr. Shubham Kumar (Assistant Professor)
    
    Core Concepts:
    - Priority Queue Data Structure (Linked List implementation)
    - Pointers, Dynamic Structures, and Modular Functions
    - Persistent File Handling ("er_patient_log.txt" & "daily_er_report.txt")
    - Role-Based Access Control (Receptionist vs Medical Staff / Admin)
    - Triage Prioritization (Severity Levels 1 to 5)
    - Emergency Bed Management System
========================================================================================
*/

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <ctype.h>

#ifdef _WIN32
#include <windows.h>
#define CLEAR_SCREEN() system("cls")
#else
#define CLEAR_SCREEN() printf("\033[H\033[J")
#endif

/* ANSI Color Escape Codes for Terminal Aesthetics */
#define COLOR_RESET   "\033[0m"
#define COLOR_BOLD    "\033[1m"
#define COLOR_RED     "\033[1;31m"
#define COLOR_GREEN   "\033[1;32m"
#define COLOR_YELLOW  "\033[1;33m"
#define COLOR_BLUE    "\033[1;34m"
#define COLOR_MAGENTA "\033[1;35m"
#define COLOR_CYAN    "\033[1;36m"
#define COLOR_WHITE   "\033[1;37m"

#define MAX_BEDS 10
#define PATIENT_LOG_FILE "er_patient_log.txt"
#define DAILY_REPORT_FILE "daily_er_report.txt"
#define DEFAULT_ADMIN_PASSWORD "admin123"

/* ====================================================================================
    DATA STRUCTURE DEFINITIONS
==================================================================================== */

/* Patient Record Structure */
typedef struct {
    int token;                  /* Unique Token ID (e.g. 1001, 1002...) */
    char name[60];              /* Patient Full Name */
    int age;                    /* Age in years */
    char gender[12];            /* Male, Female, Other */
    char contact[20];           /* Phone / Emergency Contact */
    char complaint[120];        /* Chief Medical Complaint / Symptoms */
    int triage_level;           /* 1 (Resuscitation) to 5 (Non-urgent) */
    char reg_time[32];          /* Timestamp when registered */
    char status[24];            /* "Waiting", "In Treatment", "Admitted", "Discharged" */
    int assigned_bed;           /* Bed number (1-MAX_BEDS) or 0 if none */
} Patient;

/* Node for Linked List Priority Queue */
typedef struct PatientNode {
    Patient data;
    struct PatientNode* next;
} PatientNode;

/* Bed Structure for ER Bed Management */
typedef struct {
    int bed_id;
    int is_occupied;
    int patient_token;
    char patient_name[60];
    int triage_level;
    char admitted_time[32];
} EmergencyBed;

/* Global System State */
typedef struct {
    PatientNode* queue_head;             /* Head of the Priority Queue */
    int queue_count;                     /* Current waiting count */
    int next_token_id;                   /* Auto-incrementing token generator */
    int total_registered_today;          /* Daily statistics */
    int total_treated_today;             /* Total advanced & treated today */
    int level_counts[6];                 /* Breakdown by triage levels 1 to 5 */
    EmergencyBed beds[MAX_BEDS];         /* Emergency beds */
    Patient currently_serving;           /* Patient currently in treatment */
    int has_currently_serving;           /* 1 if active, 0 otherwise */
    char admin_password[32];             /* Dynamic Admin Password */
} HEMS_State;

HEMS_State g_hems;

/* ====================================================================================
    FUNCTION PROTOTYPES
==================================================================================== */
void initSystem(void);
void enableWindowsAnsiColors(void);
void getCurrentTimestamp(char* buffer, size_t size);
void clearInputBuffer(void);
void readString(const char* prompt, char* buffer, int max_len);
int readInt(const char* prompt, int min_val, int max_val);
const char* getTriageName(int level);
const char* getTriageColor(int level);

/* Priority Queue Operations */
void enqueuePriority(Patient p);
int dequeuePriority(Patient* out_patient);
void displayQueue(void);

/* File Handling Operations */
void logPatientToFile(const Patient* p, const char* action_note);
void generateDailyReport(void);
void viewPatientLog(void);
void viewDailyReport(void);
void resetDailyRecords(void);

/* Bed Management */
void initBeds(void);
void displayBedStatus(void);
int allocateBed(int token, const char* name, int triage_level);
int dischargeBed(int bed_id);
void restoreTokenCounter(void);
void cleanupSystem(void);

/* Role Menus & Controllers */
void showBanner(void);
void receptionistMenu(void);
void medicalStaffMenu(void);
void liveStatusDisplay(void);
void registerNewPatient(void);
void advanceHighestPriorityPatient(void);
void searchPatientRecord(void);
void bedManagementMenu(void);
void changePassword(void);
void displayAboutSynopsis(void);

/* ====================================================================================
    UTILITY FUNCTIONS
==================================================================================== */

void enableWindowsAnsiColors(void) {
#ifdef _WIN32
    HANDLE hOut = GetStdHandle(STD_OUTPUT_HANDLE);
    if (hOut != INVALID_HANDLE_VALUE) {
        DWORD dwMode = 0;
        if (GetConsoleMode(hOut, &dwMode)) {
            dwMode |= ENABLE_VIRTUAL_TERMINAL_PROCESSING;
            SetConsoleMode(hOut, dwMode);
        }
    }
#endif
}

void getCurrentTimestamp(char* buffer, size_t size) {
    time_t raw_time;
    struct tm* time_info;
    time(&raw_time);
    time_info = localtime(&raw_time);
    strftime(buffer, size, "%Y-%m-%d %H:%M:%S", time_info);
}

void clearInputBuffer(void) {
    int c;
    while ((c = getchar()) != '\n' && c != EOF) { }
}

void readString(const char* prompt, char* buffer, int max_len) {
    printf("%s", prompt);
    if (fgets(buffer, max_len, stdin) != NULL) {
        size_t len = strlen(buffer);
        if (len > 0 && buffer[len - 1] == '\n') {
            buffer[len - 1] = '\0';
        } else if (!feof(stdin)) {
            clearInputBuffer();
        }
    } else {
        buffer[0] = '\0';
    }
}

int readInt(const char* prompt, int min_val, int max_val) {
    int value;
    char buffer[128];
    while (1) {
        printf("%s", prompt);
        if (fgets(buffer, sizeof(buffer), stdin) != NULL) {
            if (strchr(buffer, '\n') == NULL && !feof(stdin)) {
                clearInputBuffer();
            }
            char* endptr;
            value = (int)strtol(buffer, &endptr, 10);
            /* Skip trailing spaces */
            while (isspace((unsigned char)*endptr)) endptr++;
            if (*endptr == '\0' && endptr != buffer && value >= min_val && value <= max_val) {
                return value;
            }
        } else {
            /* EOF reached on piped input */
            return min_val;
        }
        printf(COLOR_RED "  [!] Invalid input. Please enter a valid number between %d and %d.\n" COLOR_RESET, min_val, max_val);
    }
}

const char* getTriageName(int level) {
    switch (level) {
        case 1: return "Level 1: Resuscitation (Immediate Life Threat)";
        case 2: return "Level 2: Emergent / Critical (High Risk)";
        case 3: return "Level 3: Urgent (Potentially Serious)";
        case 4: return "Level 4: Less Urgent (Stable)";
        case 5: return "Level 5: Non-Urgent (Minor / Routine)";
        default: return "Unknown";
    }
}

const char* getTriageColor(int level) {
    switch (level) {
        case 1: return COLOR_RED;
        case 2: return COLOR_MAGENTA;
        case 3: return COLOR_YELLOW;
        case 4: return COLOR_GREEN;
        case 5: return COLOR_CYAN;
        default: return COLOR_WHITE;
    }
}

/* ====================================================================================
    INITIALIZATION
==================================================================================== */

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

void restoreTokenCounter(void) {
    FILE* fp = fopen(PATIENT_LOG_FILE, "r");
    if (fp == NULL) return;
    char line[512];
    int max_token = 1000;
    while (fgets(line, sizeof(line), fp) != NULL) {
        int token = 0;
        if (sscanf(line, "%d", &token) == 1) {
            if (token > max_token && token < 1000000) {
                max_token = token;
            }
        }
    }
    fclose(fp);
    g_hems.next_token_id = max_token + 1;
}

void cleanupSystem(void) {
    PatientNode* curr = g_hems.queue_head;
    while (curr != NULL) {
        PatientNode* next = curr->next;
        free(curr);
        curr = next;
    }
    g_hems.queue_head = NULL;
    g_hems.queue_count = 0;
}

void initSystem(void) {
    enableWindowsAnsiColors();
    g_hems.queue_head = NULL;
    g_hems.queue_count = 0;
    g_hems.next_token_id = 1001;
    g_hems.total_registered_today = 0;
    g_hems.total_treated_today = 0;
    g_hems.has_currently_serving = 0;
    strcpy(g_hems.admin_password, DEFAULT_ADMIN_PASSWORD);
    
    for (int i = 0; i < 6; i++) {
        g_hems.level_counts[i] = 0;
    }
    
    initBeds();

    /* Check if log file exists; if not, initialize it with a professional header */
    FILE* fp = fopen(PATIENT_LOG_FILE, "r");
    if (fp == NULL) {
        fp = fopen(PATIENT_LOG_FILE, "w");
        if (fp != NULL) {
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

/* ====================================================================================
    PRIORITY QUEUE IMPLEMENTATION (Algorithm 1 & 2 Enqueue / Dequeue)
    - Lower triage number indicates higher medical urgency (Level 1 > Level 2 > Level 3)
    - Equal triage levels preserve First-In, First-Out (FIFO) arrival order
==================================================================================== */

void enqueuePriority(Patient p) {
    PatientNode* newNode = (PatientNode*)malloc(sizeof(PatientNode));
    if (newNode == NULL) {
        printf(COLOR_RED "  [Error] Memory allocation failed during enqueue!\n" COLOR_RESET);
        return;
    }
    newNode->data = p;
    newNode->next = NULL;

    /* If queue is empty OR new patient has strictly higher priority than head */
    if (g_hems.queue_head == NULL || p.triage_level < g_hems.queue_head->data.triage_level) {
        newNode->next = g_hems.queue_head;
        g_hems.queue_head = newNode;
    } else {
        /* Traverse to find appropriate priority slot (strictly <= ensures FIFO for equal priority) */
        PatientNode* current = g_hems.queue_head;
        while (current->next != NULL && current->next->data.triage_level <= p.triage_level) {
            current = current->next;
        }
        newNode->next = current->next;
        current->next = newNode;
    }
    g_hems.queue_count++;
}

int dequeuePriority(Patient* out_patient) {
    if (g_hems.queue_head == NULL) {
        return 0; /* Queue is empty */
    }
    PatientNode* temp = g_hems.queue_head;
    *out_patient = temp->data;
    g_hems.queue_head = g_hems.queue_head->next;
    free(temp);
    g_hems.queue_count--;
    return 1;
}

void displayQueue(void) {
    printf("\n" COLOR_CYAN "========================================================================================\n");
    printf("                             CURRENT EMERGENCY PRIORITY QUEUE                           \n");
    printf("========================================================================================\n" COLOR_RESET);

    if (g_hems.queue_head == NULL) {
        printf(COLOR_YELLOW "  [i] No patients currently waiting in the emergency queue.\n" COLOR_RESET);
        printf(COLOR_CYAN "========================================================================================\n" COLOR_RESET);
        return;
    }

    printf(COLOR_BOLD "%-6s | %-8s | %-20s | %-4s | %-10s | %-25s | %-19s\n" COLOR_RESET,
           "POS", "TOKEN", "PATIENT NAME", "AGE", "GENDER", "TRIAGE PRIORITY", "ARRIVAL TIME");
    printf("----------------------------------------------------------------------------------------\n");

    PatientNode* curr = g_hems.queue_head;
    int pos = 1;
    while (curr != NULL) {
        const char* color = getTriageColor(curr->data.triage_level);
        printf("%s%-6d | %-8d | %-20.20s | %-4d | %-10.10s | L%d: %-21.21s | %-19s%s\n",
               color,
               pos,
               curr->data.token,
               curr->data.name,
               curr->data.age,
               curr->data.gender,
               curr->data.triage_level,
               getTriageName(curr->data.triage_level) + 9, /* skip prefix */
               curr->data.reg_time,
               COLOR_RESET);
        curr = curr->next;
        pos++;
    }
    printf(COLOR_CYAN "========================================================================================\n" COLOR_RESET);
    printf("  Total Patients Waiting: %s%d%s\n", COLOR_BOLD, g_hems.queue_count, COLOR_RESET);
}

/* ====================================================================================
    FILE HANDLING OPERATIONS (Persistence for er_patient_log.txt & daily_er_report.txt)
==================================================================================== */

void logPatientToFile(const Patient* p, const char* action_note) {
    FILE* fp = fopen(PATIENT_LOG_FILE, "a");
    if (fp == NULL) {
        printf(COLOR_RED "  [Error] Could not open %s for appending!\n" COLOR_RESET, PATIENT_LOG_FILE);
        return;
    }
    char currentTime[32];
    getCurrentTimestamp(currentTime, sizeof(currentTime));

    fprintf(fp, "%-8d | %-20.20s | %-4d | %-6.6s | %-12.12s | Level %-1d | %-19s | %-12.12s | %-15.15s\n",
            p->token,
            p->name,
            p->age,
            p->gender,
            p->contact,
            p->triage_level,
            currentTime,
            p->status,
            action_note);
    fclose(fp);
}

void generateDailyReport(void) {
    FILE* fp = fopen(DAILY_REPORT_FILE, "w");
    if (fp == NULL) {
        printf(COLOR_RED "  [Error] Could not write to %s!\n" COLOR_RESET, DAILY_REPORT_FILE);
        return;
    }

    char reportTime[32];
    getCurrentTimestamp(reportTime, sizeof(reportTime));

    int occupied_beds = 0;
    for (int i = 0; i < MAX_BEDS; i++) {
        if (g_hems.beds[i].is_occupied) occupied_beds++;
    }

    fprintf(fp, "========================================================================================\n");
    fprintf(fp, "                        HOSPITAL EMERGENCY ROOM - DAILY AUDIT REPORT                    \n");
    fprintf(fp, "========================================================================================\n");
    fprintf(fp, "Generated On           : %s\n", reportTime);
    fprintf(fp, "Emergency Department   : Trauma & Acute Care Center\n");
    fprintf(fp, "Total Registered Today : %d\n", g_hems.total_registered_today);
    fprintf(fp, "Total Patients Treated : %d\n", g_hems.total_treated_today);
    fprintf(fp, "Patients Still Waiting : %d\n", g_hems.queue_count);
    fprintf(fp, "Emergency Beds In Use  : %d / %d (Available: %d)\n", occupied_beds, MAX_BEDS, MAX_BEDS - occupied_beds);
    fprintf(fp, "----------------------------------------------------------------------------------------\n");
    fprintf(fp, "TRIAGE SEVERITY BREAKDOWN (REGISTERED TODAY):\n");
    fprintf(fp, "  Level 1 (Resuscitation - Immediate Threat) : %d\n", g_hems.level_counts[1]);
    fprintf(fp, "  Level 2 (Emergent / Critical)              : %d\n", g_hems.level_counts[2]);
    fprintf(fp, "  Level 3 (Urgent)                           : %d\n", g_hems.level_counts[3]);
    fprintf(fp, "  Level 4 (Less Urgent)                      : %d\n", g_hems.level_counts[4]);
    fprintf(fp, "  Level 5 (Non-Urgent / Routine)             : %d\n", g_hems.level_counts[5]);
    fprintf(fp, "----------------------------------------------------------------------------------------\n");
    fprintf(fp, "EMERGENCY BED STATUS SNAPSHOT:\n");
    for (int i = 0; i < MAX_BEDS; i++) {
        if (g_hems.beds[i].is_occupied) {
            fprintf(fp, "  Bed #%02d : OCCUPIED | Token #%d (%s) | Admitted: %s\n",
                    g_hems.beds[i].bed_id,
                    g_hems.beds[i].patient_token,
                    g_hems.beds[i].patient_name,
                    g_hems.beds[i].admitted_time);
        } else {
            fprintf(fp, "  Bed #%02d : VACANT\n", g_hems.beds[i].bed_id);
        }
    }
    fprintf(fp, "========================================================================================\n");
    fprintf(fp, "End of Daily Summary Report.\n");
    fclose(fp);
}

void viewPatientLog(void) {
    FILE* fp = fopen(PATIENT_LOG_FILE, "r");
    if (fp == NULL) {
        printf(COLOR_YELLOW "  [i] Patient log file (%s) does not exist yet.\n" COLOR_RESET, PATIENT_LOG_FILE);
        return;
    }
    printf("\n" COLOR_CYAN "========================================================================================================================\n");
    printf("                                       ER PATIENT LOG (from %s)                                        \n", PATIENT_LOG_FILE);
    printf("========================================================================================================================\n" COLOR_RESET);
    
    char line[512];
    int lineCount = 0;
    while (fgets(line, sizeof(line), fp) != NULL) {
        printf("%s", line);
        lineCount++;
    }
    fclose(fp);
    printf(COLOR_CYAN "========================================================================================================================\n" COLOR_RESET);
    printf("  Total Log Entries Displayed: %d\n", lineCount > 4 ? lineCount - 4 : lineCount);
}

void viewDailyReport(void) {
    generateDailyReport(); /* Refresh latest figures */
    FILE* fp = fopen(DAILY_REPORT_FILE, "r");
    if (fp == NULL) {
        printf(COLOR_RED "  [!] Unable to open %s.\n" COLOR_RESET, DAILY_REPORT_FILE);
        return;
    }
    printf("\n" COLOR_GREEN "========================================================================================\n");
    printf("                               DAILY EMERGENCY SUMMARY REPORT                           \n");
    printf("========================================================================================\n" COLOR_RESET);
    
    char line[256];
    while (fgets(line, sizeof(line), fp) != NULL) {
        printf("%s", line);
    }
    fclose(fp);
}

void resetDailyRecords(void) {
    printf("\n" COLOR_RED COLOR_BOLD "  [WARNING] You are about to reset today's emergency records and queue!\n" COLOR_RESET);
    printf("  This will clear the active queue, bed allocations, and reset daily metrics.\n");
    printf("  A backup archive of the daily report will be created before resetting.\n");
    
    int confirm = readInt("\n  Are you sure? (1 = YES Reset, 2 = CANCEL): ", 1, 2);
    if (confirm != 1) {
        printf(COLOR_YELLOW "  [i] Operation cancelled. No data was cleared.\n" COLOR_RESET);
        return;
    }

    /* Archive daily report with timestamp */
    char archive_name[64];
    time_t now = time(NULL);
    snprintf(archive_name, sizeof(archive_name), "daily_er_report_archive_%ld.txt", (long)now);
    generateDailyReport();
    rename(DAILY_REPORT_FILE, archive_name);

    /* Free all nodes in queue */
    PatientNode* curr = g_hems.queue_head;
    while (curr != NULL) {
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

    printf(COLOR_GREEN "\n  [SUCCESS] Daily logs successfully reset. Archive saved as '%s'.\n" COLOR_RESET, archive_name);
}

/* ====================================================================================
    BED MANAGEMENT MODULE
==================================================================================== */

void displayBedStatus(void) {
    printf("\n" COLOR_CYAN "===================================================================================================\n");
    printf("                                    EMERGENCY WARD BED STATUS                                      \n");
    printf("===================================================================================================\n" COLOR_RESET);
    printf(COLOR_BOLD "%-6s | %-10s | %-9s | %-22s | %-8s | %-19s\n" COLOR_RESET,
           "BED #", "STATUS", "TOKEN #", "PATIENT NAME", "TRIAGE", "ADMITTED AT");
    printf("---------------------------------------------------------------------------------------------------\n");

    int occupied = 0;
    for (int i = 0; i < MAX_BEDS; i++) {
        if (g_hems.beds[i].is_occupied) {
            occupied++;
            printf(COLOR_RED "%-6d | %-10s | %-9d | %-22.22s | Level %-2d | %-19s\n" COLOR_RESET,
                   g_hems.beds[i].bed_id,
                   "OCCUPIED",
                   g_hems.beds[i].patient_token,
                   g_hems.beds[i].patient_name,
                   g_hems.beds[i].triage_level,
                   g_hems.beds[i].admitted_time);
        } else {
            printf(COLOR_GREEN "%-6d | %-10s | %-9s | %-22s | %-8s | %-19s\n" COLOR_RESET,
                   g_hems.beds[i].bed_id,
                   "VACANT",
                   "-",
                   "-",
                   "-",
                   "-");
        }
    }
    printf(COLOR_CYAN "===================================================================================================\n" COLOR_RESET);
    printf("  Total Beds: %d  |  Occupied: %s%d%s  |  Available: %s%d%s\n",
           MAX_BEDS,
           COLOR_RED, occupied, COLOR_RESET,
           COLOR_GREEN, MAX_BEDS - occupied, COLOR_RESET);
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
    return 0; /* All beds full */
}

int dischargeBed(int bed_id) {
    if (bed_id < 1 || bed_id > MAX_BEDS) return -1;
    int idx = bed_id - 1;
    if (!g_hems.beds[idx].is_occupied) return 0; /* Already vacant */

    Patient p;
    memset(&p, 0, sizeof(Patient));
    p.token = g_hems.beds[idx].patient_token;
    snprintf(p.name, sizeof(p.name), "%s", g_hems.beds[idx].patient_name);
    p.triage_level = g_hems.beds[idx].triage_level;
    strcpy(p.status, "Discharged");

    logPatientToFile(&p, "Bed Discharged");

    g_hems.beds[idx].is_occupied = 0;
    g_hems.beds[idx].patient_token = 0;
    g_hems.beds[idx].patient_name[0] = '\0';
    g_hems.beds[idx].triage_level = 0;
    g_hems.beds[idx].admitted_time[0] = '\0';
    return 1;
}

void bedManagementMenu(void) {
    while (1) {
        displayBedStatus();
        printf("\n" COLOR_BOLD "  --- Bed Management Options ---\n" COLOR_RESET);
        printf("  [1] Admit Current Patient to an Available Bed\n");
        printf("  [2] Discharge Patient from a Bed\n");
        printf("  [3] Return to Medical Staff Menu\n");

        int choice = readInt("\n  Select option (1-3): ", 1, 3);
        if (choice == 1) {
            if (!g_hems.has_currently_serving) {
                printf(COLOR_YELLOW "  [!] No patient is currently being served. Advance a patient first!\n" COLOR_RESET);
            } else if (g_hems.currently_serving.assigned_bed > 0) {
                printf(COLOR_YELLOW "  [!] Current patient (Token #%d) is already assigned to Bed #%d.\n" COLOR_RESET,
                       g_hems.currently_serving.token, g_hems.currently_serving.assigned_bed);
            } else {
                int bedNum = allocateBed(g_hems.currently_serving.token, g_hems.currently_serving.name, g_hems.currently_serving.triage_level);
                if (bedNum > 0) {
                    g_hems.currently_serving.assigned_bed = bedNum;
                    strcpy(g_hems.currently_serving.status, "Admitted");
                    logPatientToFile(&g_hems.currently_serving, "Bed Allocated");
                    printf(COLOR_GREEN "  [SUCCESS] Patient Token #%d (%s) admitted to Emergency Bed #%d.\n" COLOR_RESET,
                           g_hems.currently_serving.token, g_hems.currently_serving.name, bedNum);
                    g_hems.has_currently_serving = 0; /* Trauma bay is now clear for next emergency */
                } else {
                    printf(COLOR_RED "  [ALERT] All emergency beds are currently full! Consider transfer.\n" COLOR_RESET);
                }
            }
        } else if (choice == 2) {
            int bedNum = readInt("  Enter Bed Number to discharge (1-10): ", 1, MAX_BEDS);
            int res = dischargeBed(bedNum);
            if (res == 1) {
                printf(COLOR_GREEN "  [SUCCESS] Bed #%d has been safely discharged and is now VACANT.\n" COLOR_RESET, bedNum);
            } else if (res == 0) {
                printf(COLOR_YELLOW "  [i] Bed #%d is already vacant.\n" COLOR_RESET, bedNum);
            } else {
                printf(COLOR_RED "  [!] Invalid bed ID specified.\n" COLOR_RESET);
            }
        } else {
            break;
        }
    }
}

/* ====================================================================================
    ALGORITHM 1: PATIENT REGISTRATION & ENQUEUE (Receptionist Interface)
==================================================================================== */

void registerNewPatient(void) {
    Patient p;
    memset(&p, 0, sizeof(Patient));

    printf("\n" COLOR_CYAN "========================================================================================\n");
    printf("                          EMERGENCY PATIENT REGISTRATION & TRIAGE                       \n");
    printf("========================================================================================\n" COLOR_RESET);

    p.token = g_hems.next_token_id++;
    printf("  Generated Token ID   : " COLOR_BOLD COLOR_GREEN "ER-%d\n" COLOR_RESET, p.token);

    readString("  Enter Patient Name   : ", p.name, sizeof(p.name));
    if (strlen(p.name) == 0) strcpy(p.name, "Anonymous Patient");

    p.age = readInt("  Enter Patient Age    : ", 0, 130);

    printf("  Select Gender:\n");
    printf("    1. Male\n    2. Female\n    3. Other\n");
    int gChoice = readInt("  Enter Choice (1-3)   : ", 1, 3);
    if (gChoice == 1) strcpy(p.gender, "Male");
    else if (gChoice == 2) strcpy(p.gender, "Female");
    else strcpy(p.gender, "Other");

    readString("  Contact / Phone No.  : ", p.contact, sizeof(p.contact));
    if (strlen(p.contact) == 0) strcpy(p.contact, "N/A");

    readString("  Chief Complaint/Signs: ", p.complaint, sizeof(p.complaint));
    if (strlen(p.complaint) == 0) strcpy(p.complaint, "Emergency Trauma");

    printf("\n" COLOR_BOLD "  --- Clinical Triage Priority Assessment ---\n" COLOR_RESET);
    printf("    " COLOR_RED     "[1] Level 1: Resuscitation (Cardiac arrest, severe trauma, immediate threat)\n" COLOR_RESET);
    printf("    " COLOR_MAGENTA "[2] Level 2: Emergent / Critical (Chest pain, stroke, severe distress)\n" COLOR_RESET);
    printf("    " COLOR_YELLOW  "[3] Level 3: Urgent (Moderate fracture, severe abdominal pain, high fever)\n" COLOR_RESET);
    printf("    " COLOR_GREEN   "[4] Level 4: Less Urgent (Mild injury, minor laceration, sprain)\n" COLOR_RESET);
    printf("    " COLOR_CYAN    "[5] Level 5: Non-Urgent (Routine clinic, minor illness, suture check)\n" COLOR_RESET);

    p.triage_level = readInt("\n  Assign Triage Level (1-5): ", 1, 5);

    getCurrentTimestamp(p.reg_time, sizeof(p.reg_time));
    strcpy(p.status, "Waiting");
    p.assigned_bed = 0;

    /* Enqueue into Priority Queue */
    enqueuePriority(p);

    /* Update Statistics */
    g_hems.total_registered_today++;
    g_hems.level_counts[p.triage_level]++;

    /* Persistent File Storage */
    logPatientToFile(&p, "Registered");

    printf("\n" COLOR_GREEN "  ======================================================================================\n");
    printf("  [SUCCESS] Patient ER-%d successfully triaged and enqueued with %s!\n", p.token, getTriageName(p.triage_level));
    printf("  Position in queue: %d patient(s) currently waiting.\n", g_hems.queue_count);
    printf("  ======================================================================================\n" COLOR_RESET);
}

/* ====================================================================================
    ALGORITHM 2: ADVANCE HIGHEST-PRIORITY PATIENT (Medical Staff / Admin)
==================================================================================== */

void advanceHighestPriorityPatient(void) {
    printf("\n" COLOR_MAGENTA "========================================================================================\n");
    printf("                         ADVANCE HIGHEST-PRIORITY PATIENT (DEQUEUE)                     \n");
    printf("========================================================================================\n" COLOR_RESET);

    if (g_hems.queue_head == NULL) {
        printf(COLOR_YELLOW "  [i] The emergency queue is currently empty. No patients waiting.\n" COLOR_RESET);
        return;
    }

    /* If a patient is already in treatment, ask for disposition before taking next */
    if (g_hems.has_currently_serving) {
        printf(COLOR_YELLOW "  [!] Notice: Token #%d (%s) is currently in treatment.\n" COLOR_RESET,
               g_hems.currently_serving.token, g_hems.currently_serving.name);
        printf("  Select disposition for current patient:\n");
        printf("    [1] Complete Treatment & Discharge\n");
        printf("    [2] Admit to Emergency Bed\n");
        printf("    [3] Keep Active & Force Call Next Patient\n");
        
        int disp = readInt("  Choose option (1-3): ", 1, 3);
        if (disp == 1) {
            strcpy(g_hems.currently_serving.status, "Discharged");
            logPatientToFile(&g_hems.currently_serving, "Treated & Discharged");
            printf(COLOR_GREEN "  Patient Token #%d discharged from treatment area.\n" COLOR_RESET, g_hems.currently_serving.token);
            g_hems.has_currently_serving = 0;
        } else if (disp == 2) {
            int bedNum = allocateBed(g_hems.currently_serving.token, g_hems.currently_serving.name, g_hems.currently_serving.triage_level);
            if (bedNum > 0) {
                g_hems.currently_serving.assigned_bed = bedNum;
                strcpy(g_hems.currently_serving.status, "Admitted");
                logPatientToFile(&g_hems.currently_serving, "Admitted to Bed");
                printf(COLOR_GREEN "  Patient Token #%d admitted to Bed #%d.\n" COLOR_RESET, g_hems.currently_serving.token, bedNum);
                g_hems.has_currently_serving = 0;
            } else {
                printf(COLOR_RED "  [ALERT] Beds are full! Patient remains in emergency care.\n" COLOR_RESET);
            }
        } else if (disp == 3) {
            logPatientToFile(&g_hems.currently_serving, "Shifted to Secondary Care");
            printf(COLOR_YELLOW "  Patient Token #%d shifted to secondary care observation.\n" COLOR_RESET, g_hems.currently_serving.token);
            g_hems.has_currently_serving = 0;
        }
    }

    /* Dequeue the most critical patient */
    Patient nextPatient;
    if (dequeuePriority(&nextPatient)) {
        strcpy(nextPatient.status, "In Treatment");
        g_hems.currently_serving = nextPatient;
        g_hems.has_currently_serving = 1;
        g_hems.total_treated_today++;

        /* Log update */
        logPatientToFile(&nextPatient, "Advanced to Doctor");

        const char* color = getTriageColor(nextPatient.triage_level);
        printf("\n" COLOR_BOLD "  >>> CALLING NEXT CRITICAL PATIENT TO TRAUMA BAY <<< \n" COLOR_RESET);
        printf("  --------------------------------------------------------------------------------------\n");
        printf("  Token ID           : " COLOR_BOLD "%sER-%d%s\n", color, nextPatient.token, COLOR_RESET);
        printf("  Patient Name       : " COLOR_BOLD "%s%s%s\n", color, nextPatient.name, COLOR_RESET);
        printf("  Age / Gender       : %d / %s\n", nextPatient.age, nextPatient.gender);
        printf("  Triage Category    : %s%s%s\n", color, getTriageName(nextPatient.triage_level), COLOR_RESET);
        printf("  Chief Complaint    : %s\n", nextPatient.complaint);
        printf("  Arrival Time       : %s\n", nextPatient.reg_time);
        printf("  --------------------------------------------------------------------------------------\n");
        printf("  Updated Queue Status: %s%d%s patient(s) remaining in queue.\n",
               COLOR_BOLD, g_hems.queue_count, COLOR_RESET);
    }
}

/* ====================================================================================
    SEARCH PATIENT RECORD (By Token or Name)
==================================================================================== */

void searchPatientRecord(void) {
    printf("\n" COLOR_CYAN "========================================================================================\n");
    printf("                               SEARCH PATIENT EMERGENCY RECORDS                         \n");
    printf("========================================================================================\n" COLOR_RESET);
    printf("  [1] Search by Token ID\n");
    printf("  [2] Search by Patient Name\n");
    
    int mode = readInt("  Choose search method (1-2): ", 1, 2);
    char query[64];
    int searchToken = 0;

    if (mode == 1) {
        searchToken = readInt("  Enter Patient Token Number (e.g., 1001): ", 1, 999999);
    } else {
        readString("  Enter Patient Name (or part of name): ", query, sizeof(query));
        for (int i = 0; query[i]; i++) query[i] = (char)tolower((unsigned char)query[i]);
    }

    FILE* fp = fopen(PATIENT_LOG_FILE, "r");
    if (fp == NULL) {
        printf(COLOR_YELLOW "  [i] No patient log file found.\n" COLOR_RESET);
        return;
    }

    printf("\n  Matching Log Records:\n");
    printf("------------------------------------------------------------------------------------------------------------------------\n");
    
    char line[512];
    int found = 0;
    while (fgets(line, sizeof(line), fp) != NULL) {
        if (mode == 1) {
            int tokenInLine = 0;
            if (sscanf(line, "%d", &tokenInLine) == 1 && tokenInLine == searchToken) {
                printf("  %s", line);
                found++;
            }
        } else {
            char lowerLine[512];
            for (int i = 0; line[i] && i < 511; i++) lowerLine[i] = (char)tolower((unsigned char)line[i]);
            lowerLine[sizeof(lowerLine) - 1] = '\0';
            if (strstr(lowerLine, query) != NULL) {
                printf("  %s", line);
                found++;
            }
        }
    }
    fclose(fp);

    if (!found) {
        printf(COLOR_YELLOW "  No patient records matched your query.\n" COLOR_RESET);
    } else {
        printf("------------------------------------------------------------------------------------------------------------------------\n");
        printf(COLOR_GREEN "  Total matches found: %d\n" COLOR_RESET, found);
    }
}

/* ====================================================================================
    LIVE STATUS DISPLAY (Public / Department Board)
==================================================================================== */

void liveStatusDisplay(void) {
    int occupied_beds = 0;
    for (int i = 0; i < MAX_BEDS; i++) {
        if (g_hems.beds[i].is_occupied) occupied_beds++;
    }

    printf("\n" COLOR_CYAN "========================================================================================\n");
    printf("                 HOSPITAL EMERGENCY DEPARTMENT - LIVE MONITOR BOARD                    \n");
    printf("========================================================================================\n" COLOR_RESET);

    char nowStr[32];
    getCurrentTimestamp(nowStr, sizeof(nowStr));
    printf("  System Clock: %s  |  Status: ACTIVE 24x7\n", nowStr);
    printf("----------------------------------------------------------------------------------------\n");

    /* Current Patient */
    printf(COLOR_BOLD "  [NOW SERVING IN TRAUMA / ER BAY]:\n" COLOR_RESET);
    if (g_hems.has_currently_serving) {
        const char* color = getTriageColor(g_hems.currently_serving.triage_level);
        printf("    Token       : %sER-%d%s\n", color, g_hems.currently_serving.token, COLOR_RESET);
        printf("    Name        : %s%s%s (Age: %d, Gender: %s)\n",
               color, g_hems.currently_serving.name, COLOR_RESET,
               g_hems.currently_serving.age, g_hems.currently_serving.gender);
        printf("    Category    : %s%s%s\n", color, getTriageName(g_hems.currently_serving.triage_level), COLOR_RESET);
        printf("    Complaint   : %s\n", g_hems.currently_serving.complaint);
    } else {
        printf(COLOR_GREEN "    Trauma Bay is currently idle / Ready for next patient.\n" COLOR_RESET);
    }
    printf("----------------------------------------------------------------------------------------\n");

    /* Queue Summary */
    printf(COLOR_BOLD "  [QUEUE METRICS]:\n" COLOR_RESET);
    printf("    Waiting in Queue      : %s%d%s\n", COLOR_YELLOW, g_hems.queue_count, COLOR_RESET);
    printf("    Treated Today         : %s%d%s\n", COLOR_GREEN, g_hems.total_treated_today, COLOR_RESET);
    printf("    Total Registered      : %d\n", g_hems.total_registered_today);
    printf("    Emergency Beds        : %d Occupied, %d Free (Total %d)\n",
           occupied_beds, MAX_BEDS - occupied_beds, MAX_BEDS);
    printf("----------------------------------------------------------------------------------------\n");

    /* Next up in queue */
    printf(COLOR_BOLD "  [NEXT IN LINE (TOP 3 CRITICAL)]: \n" COLOR_RESET);
    if (g_hems.queue_head == NULL) {
        printf("    No patients waiting.\n");
    } else {
        PatientNode* curr = g_hems.queue_head;
        int count = 0;
        while (curr != NULL && count < 3) {
            const char* color = getTriageColor(curr->data.triage_level);
            printf("    #%d -> Token: %sER-%-5d%s | Level %d (%-14.14s) | %s\n",
                   count + 1,
                   color, curr->data.token, COLOR_RESET,
                   curr->data.triage_level,
                   getTriageName(curr->data.triage_level) + 9,
                   curr->data.name);
            curr = curr->next;
            count++;
        }
    }
    printf(COLOR_CYAN "========================================================================================\n" COLOR_RESET);
}

/* ====================================================================================
    SECURITY & AUTHENTICATION (Medical Staff / Admin Login)
==================================================================================== */

int verifyAdminLogin(void) {
    char inputPass[64];
    printf("\n" COLOR_BOLD COLOR_MAGENTA "  --- RESTRICTED ACCESS: MEDICAL STAFF & ADMINISTRATOR --- \n" COLOR_RESET);
    printf("  Please enter staff authorization password.\n");
    readString("  Password: ", inputPass, sizeof(inputPass));

    if (strcmp(inputPass, g_hems.admin_password) == 0) {
        printf(COLOR_GREEN "  [ACCESS GRANTED] Welcome, Authorized Medical Personnel.\n" COLOR_RESET);
        return 1;
    } else {
        printf(COLOR_RED "  [ACCESS DENIED] Invalid authorization credentials.\n" COLOR_RESET);
        return 0;
    }
}

void changePassword(void) {
    char currentPass[64];
    printf("\n" COLOR_BOLD "  --- Change Admin Password ---\n" COLOR_RESET);
    readString("  Enter Current Password : ", currentPass, sizeof(currentPass));

    if (strcmp(currentPass, g_hems.admin_password) != 0) {
        printf(COLOR_RED "  [!] Incorrect current password!\n" COLOR_RESET);
        return;
    }

    char newPass[32];
    char confirmPass[32];
    readString("  Enter New Password     : ", newPass, sizeof(newPass));
    readString("  Confirm New Password   : ", confirmPass, sizeof(confirmPass));

    if (strcmp(newPass, confirmPass) == 0 && strlen(newPass) > 0) {
        snprintf(g_hems.admin_password, sizeof(g_hems.admin_password), "%s", newPass);
        printf(COLOR_GREEN "  [SUCCESS] Medical staff password updated successfully!\n" COLOR_RESET);
    } else {
        printf(COLOR_RED "  [!] Password confirmation does not match or is empty.\n" COLOR_RESET);
    }
}

/* ====================================================================================
    MENUS AND INTERFACES
==================================================================================== */

void showBanner(void) {
    printf(COLOR_CYAN COLOR_BOLD);
    printf("========================================================================================\n");
    printf("                      HOSPITAL EMERGENCY MANAGEMENT SYSTEM (HEMS)                       \n");
    printf("========================================================================================\n");
    printf(COLOR_RESET);
}

void receptionistMenu(void) {
    while (1) {
        printf("\n" COLOR_BLUE COLOR_BOLD "========================================================================================\n");
        printf("                                RECEPTIONIST WORKSPACE                                  \n");
        printf("========================================================================================\n" COLOR_RESET);
        printf("  [1] Register New Emergency Patient (Triage & Enqueue)\n");
        printf("  [2] View Current Waiting Queue\n");
        printf("  [3] Check Department Serving Status\n");
        printf("  [4] Search Patient by Token or Name\n");
        printf("  [5] Return to Role Selection Menu\n");
        printf(COLOR_BLUE "----------------------------------------------------------------------------------------\n" COLOR_RESET);

        int choice = readInt("  Select Option (1-5): ", 1, 5);
        switch (choice) {
            case 1:
                registerNewPatient();
                break;
            case 2:
                displayQueue();
                break;
            case 3:
                liveStatusDisplay();
                break;
            case 4:
                searchPatientRecord();
                break;
            case 5:
                return;
        }
    }
}

void medicalStaffMenu(void) {
    while (1) {
        printf("\n" COLOR_MAGENTA COLOR_BOLD "========================================================================================\n");
        printf("                             MEDICAL STAFF & ADMIN WORKSPACE                            \n");
        printf("========================================================================================\n" COLOR_RESET);
        printf("  [1] Advance Highest-Priority Patient (Dequeue & Begin Treatment)\n");
        printf("  [2] Emergency Bed Management (Allocate, Discharge, Ward View)\n");
        printf("  [3] View All Waiting Patients in Priority Queue\n");
        printf("  [4] View Historical ER Patient Log (er_patient_log.txt)\n");
        printf("  [5] Generate & View Daily Emergency Report (daily_er_report.txt)\n");
        printf("  [6] Reset / Archive Daily Emergency Records\n");
        printf("  [7] Change Medical Staff Password\n");
        printf("  [8] Return to Role Selection Menu\n");
        printf(COLOR_MAGENTA "----------------------------------------------------------------------------------------\n" COLOR_RESET);

        int choice = readInt("  Select Option (1-8): ", 1, 8);
        switch (choice) {
            case 1:
                advanceHighestPriorityPatient();
                break;
            case 2:
                bedManagementMenu();
                break;
            case 3:
                displayQueue();
                break;
            case 4:
                viewPatientLog();
                break;
            case 5:
                viewDailyReport();
                break;
            case 6:
                resetDailyRecords();
                break;
            case 7:
                changePassword();
                break;
            case 8:
                return;
        }
    }
}

void displayAboutSynopsis(void) {
    printf("\n" COLOR_CYAN "========================================================================================\n");
    printf("                               ABOUT THIS PROJECT (SYNOPSIS INFO)                       \n");
    printf("========================================================================================\n" COLOR_RESET);
    printf("  Project Title  : Hospital Emergency Management System\n");
    printf("  Degree Award   : Bachelor of Computer Applications (BCA)\n");
    printf("  Candidate Name : Sahil Roy\n");
    printf("  Roll Number    : 2510610142\n");
    printf("  Guide / Faculty: Mr. Shubham Kumar (Assistant Professor)\n");
    printf("  Institution    : Graphic Era (Deemed to be University), Dehradun\n");
    printf("  Submission Date: September 2026\n");
    printf("----------------------------------------------------------------------------------------\n");
    printf(COLOR_BOLD "  Implementation Details as per Synopsis:\n" COLOR_RESET);
    printf("  1. Priority Queue       : Dynamic Linked-List storing patients ordered by urgency level\n");
    printf("  2. Triage Classification: 5 Severity Levels (1: Resuscitation -> 5: Non-Urgent)\n");
    printf("  3. Role Separation      : Receptionist (Add/View) vs Medical Staff (Advance/Admit/Admin)\n");
    printf("  4. Persistence Layer    : Patient audit in '%s', daily summaries in '%s'\n", PATIENT_LOG_FILE, DAILY_REPORT_FILE);
    printf("  5. Bed Management       : %d Ward Emergency Beds tracking admissions and discharges\n", MAX_BEDS);
    printf(COLOR_CYAN "========================================================================================\n" COLOR_RESET);
}

/* ====================================================================================
    MAIN ENTRY POINT
==================================================================================== */

int main(void) {
    initSystem();

    showBanner();
    printf("  Welcome to the Hospital Emergency Management System.\n");
    printf("  System initialized with Priority Queue, Bed Manager, and File Persistence.\n");

    while (1) {
        printf("\n" COLOR_BOLD "========================================================================================\n");
        printf("                                    MAIN ROLE SELECTION                                 \n");
        printf("========================================================================================\n" COLOR_RESET);
        printf("  [1] Receptionist Portal (Register, Triage, Token Generation, View Queue)\n");
        printf("  [2] Medical Staff / Admin Portal (Advance Patients, Bed Management, Logs, Reports)\n");
        printf("  [3] Live Emergency Status Board (Trauma Bay & Bed Occupancy)\n");
        printf("  [4] Project Details & Synopsis Summary\n");
        printf("  [5] Exit Application\n");
        printf("========================================================================================\n");

        int roleChoice = readInt("  Select Role / Option (1-5): ", 1, 5);

        switch (roleChoice) {
            case 1:
                receptionistMenu();
                break;
            case 2:
                if (verifyAdminLogin()) {
                    medicalStaffMenu();
                }
                break;
            case 3:
                liveStatusDisplay();
                break;
            case 4:
                displayAboutSynopsis();
                break;
            case 5:
                printf("\n" COLOR_GREEN "  Saving daily report before exiting...\n" COLOR_RESET);
                generateDailyReport();
                cleanupSystem();
                printf("  [i] All records safely stored in '%s' and '%s'.\n", PATIENT_LOG_FILE, DAILY_REPORT_FILE);
                printf("  Thank you for using Hospital Emergency Management System. Goodbye!\n\n");
                return 0;
        }
    }

    return 0;
}
