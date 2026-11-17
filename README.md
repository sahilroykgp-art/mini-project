# Hospital Emergency Management System (HEMS)

**A Console-Based C Project for Bachelor of Computer Applications (BCA)**  
**Department of Computer Applications, Graphic Era (Deemed to be University), Dehradun**

- **Student Name:** Sahil Roy  
- **University Roll No:** 2510610142  
- **Project Supervisor:** Mr. Shubham Kumar (Assistant Professor)  
- **Academic Year:** September-2026  

---

## 📋 Project Synopsis & Overview

In emergency rooms and casualty wards, patients cannot be treated on a simple First-Come, First-Served (FCFS) basis; critical and life-threatening conditions (e.g., cardiac arrest, acute trauma) require immediate attention over minor ailments. This system implements a **Priority Queue** data structure in **C** alongside persistent file handling and role-based operational security.

### 🎯 Key Objectives Met (Chapter 3)
1. **Console-Based Application in C**: Developed with robust, crash-free input handling and clear modular menus.
2. **Priority-Queue Data Structure**: Enqueue by triage urgency; Dequeue always serves the most critical patient first.
3. **Role-Based Interfaces**:
   - **Receptionist Interface**: Patient registration, automatic token issuance, clinical triage categorization (Levels 1–5), and live queue observation.
   - **Medical Staff / Administrator Interface**: Password-protected access (`admin123`), advancing the highest-priority patient, bed management, log retrieval, daily report generation, and day reset.
4. **File Handling & Persistence**:
   - `er_patient_log.txt`: Complete append-only audit trail of every patient event (registration, treatment, bed allocation, discharge).
   - `daily_er_report.txt`: Automated daily summary of triage breakdown, bed occupancy, treated counts, and waiting statistics.
5. **Emergency Bed Management**: Tracks 10 emergency ward beds with admission and discharge tracking.

---

## 🗂️ Synopsis Algorithms Implemented (Chapter 5)

### Algorithm 1: Patient Registration and Enqueue (Receptionist)
1. Accepts incoming patient details (Name, Age, Gender, Contact, Chief Complaint).
2. Generates a unique token (`ER-1001`, `ER-1002`, ...).
3. Assigns clinical triage level (1 to 5, where Level 1 is highest priority).
4. Inserts record into the Priority Queue using linked-list ordering.
5. Logs registration details immediately to `er_patient_log.txt`.
6. Displays the updated waiting count and position.

### Algorithm 2: Advance Highest-Priority Patient (Medical Staff)
1. Verifies medical staff authentication credentials.
2. Checks whether any patients are waiting in the queue.
3. Dequeues the patient with the highest priority (Level 1 > Level 2 > ...; FIFO for equal priority).
4. Updates current serving status and enables bed admission or discharge.
5. Logs transition and treatment events to `er_patient_log.txt`.
6. Updates live emergency status and metrics.

### Algorithm 3: Daily Log Retrieval & Report Generation
1. Formats and computes all daily metrics (Total registered, treated, bed utilization, triage breakdown).
2. Writes structured report to `daily_er_report.txt`.
3. Reads and displays formatted logs and reports to authorized personnel.
4. Safely closes file pointers without resource leakage.

---

## 🏥 Clinical Triage Classification System

| Level | Category | Urgency Description | Priority Rank |
|:---:|:---|:---|:---:|
| **1** | **Resuscitation** | Cardiac arrest, severe trauma, respiratory failure | **Highest (1)** |
| **2** | **Emergent / Critical** | Chest pain, acute stroke signs, heavy blood loss | **High (2)** |
| **3** | **Urgent** | High fever, severe abdominal pain, fractures | **Medium (3)** |
| **4** | **Less Urgent** | Mild injuries, sprains, minor lacerations | **Low (4)** |
| **5** | **Non-Urgent** | Routine dressing, medication review, cold symptoms | **Lowest (5)** |

---

## 📂 Project Structure

```text
├── main.c              # Complete C source code (Priority queue, structures, file I/O, menus)
├── hems.exe            # Compiled executable (MinGW-W64 GCC)
├── er_patient_log.txt  # Persistent patient event log file
├── daily_er_report.txt # Daily emergency summary report file
├── build_and_run.bat   # Windows one-click compile and run batch script
├── Makefile            # Standard Makefile for GCC compilation
├── README.md           # Complete documentation and viva guide
```

---

## 🚀 How to Compile and Run

### Option 1: One-Click Run (Windows)
Double-click `build_and_run.bat` or run in Command Prompt:
```cmd
build_and_run.bat
```

### Option 2: Manual GCC Compilation
```bash
gcc -Wall -Wextra -std=c99 -o hems.exe main.c
.\hems.exe
```

### Option 3: Using Make
```bash
make
make run
```

---

## 🔑 Default Credentials

- **Role:** Medical Staff / Administrator
- **Default Password:** `admin123`
*(Can be changed securely from inside the Medical Staff menu option 7).*

---

## 🎓 Viva Voce & Practical Exam Preparation

1. **Why use a Priority Queue instead of a simple Queue?**  
   *Answer:* In hospital emergency departments, patient arrival order (FIFO) alone can be fatal for critical patients. A priority queue ensures that life-threatening cases (Triage Level 1) preempt less urgent cases (Triage Level 4 or 5), ensuring timely emergency interventions.

2. **Why use a Linked List for the Priority Queue?**  
   *Answer:* Linked lists allow dynamic memory allocation (`malloc`/`free`), avoiding fixed queue size limits, and allow $O(1)$ dequeue from the front and organized ordered insertion.

3. **How does tie-breaking work when two patients have the same priority?**  
   *Answer:* The insertion loop uses `<=`, so new patients of the same triage level are placed behind existing patients with the same level, strictly preserving First-In-First-Out (FIFO) fairness among peers.

4. **Which files are maintained for persistence?**  
   *Answer:* `er_patient_log.txt` maintains an audit trail of every patient event, and `daily_er_report.txt` contains aggregate operational summaries.
