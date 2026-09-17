# SkillBridge (SIH 2026 – Problem Statement SIH26044)

> **"Connecting Talent, Academia & Industry Through Skills"**  
> A comprehensive, explainable AI-powered portal for academia–industry collaboration, skill mapping, skill-gap analysis, internships, and placement management.

---

## 1. Executive Summary & Problem Statement

### The Problem (SIH26044)
In the modern Indian higher education ecosystem, a major structural disconnect exists between university classrooms and industrial employment:
1. **Students** lack visibility into which technical proficiencies are actually demanded by industry recruiters, and are unsure why they are rejected from job applications.
2. **Colleges & Faculty** lack aggregate real-time visibility into their student cohort's practical skill proficiencies and cannot adapt curricula rapidly enough to match industrial shifts.
3. **Industries & Recruiters** spend extensive resources filtering through thousands of uncalibrated resumes without standardized proficiency metrics.
4. **Academia–Industry Collaboration** remains fragmented in ad-hoc paper MoUs rather than continuous data-driven partnerships.

### The Solution: SkillBridge
**SkillBridge** creates a unified tripartite platform connecting **Students ↔ Colleges ↔ Industries** centered around an **Explainable 5-Factor Weighted Matching Engine**, **Automated Skill Gap Analysis**, **Recruitment Pipeline Funnels**, and **Curriculum Intervention Recommendations**.

---

## 2. Core Features & Capabilities

### A. Student Module
- **LinkedIn-Grade Skill Profile**: Detailed student portfolios featuring verified technical skills, calibrated proficiencies (`Beginner`, `Intermediate`, `Advanced`, `Expert`), projects with live & GitHub links, certifications, CGPA, and PDF resume upload.
- **Explainable AI Job Recommendations**: Real-time opportunity recommendations scored and sorted by compatibility percentage, accompanied by explainable justifications (e.g. *"92% match: Satisfied 3/3 core requirements in React, Node.js, and Git. Upgrading Spring Boot proficiency will unlock 8 additional backend roles"*).
- **Dedicated Skill Gap Analysis**: Categorizes skills into **My Skills**, **Missing Industry Skills**, **Proficiency Gaps**, and delivers an action-prioritized **Recommended to Learn** roadmap with target levels.
- **Real-Time Application Lifecycle Tracker**: 5-stage visual stepper (`Applied` → `Under Review` → `Shortlisted` → `Interview` → `Selected`) with timestamps and recruiter logs.

### B. College & Faculty Module
- **Institutional Placement Dashboard**: Real-time tracking of student registration, placement conversion rates, active internships, average CTC packages, and department-wise distributions.
- **Top Competencies & Skill Radar**: Recharts visualizations aggregating student competencies across Computer Science, Data Science, IT, and Electronics.
- **Curriculum Intervention Radar (Crucial SIH Feature)**: Automated detection of **High Industry Demand + Low Student Availability** (e.g. Docker, Cloud Computing, Kubernetes, AI/ML) that prescribes actionable workshops, bootcamps, and curriculum adjustments.
- **Enrolled Student Directory**: Searchable, filterable candidate database with direct skill inspections and resume downloads.
- **Academia–Industry MoUs Tracker**: Management of formal institutional partnerships, sponsored labs, faculty training, and joint hackathons.

### C. Industry & Recruiter Module
- **Opening Publishing Studio**: Create internships and full-time jobs with calibrated required technical skills (with minimum proficiency thresholds), preferred bonus skills, academic CGPA cutoffs, degree criteria, and department restrictions.
- **"Find Best Candidates" (Reverse AI Matching)**: 1-click candidate ranking that evaluates every enrolled student against a role's exact specifications, sorting talent by fit percentage with verified skills, CGPAs, and direct resume access.
- **Applicant Pipeline Console**: 6-stage recruitment status management with automated in-app notifications dispatched to candidates upon status changes.
- **Corporate Profile Management**: Company branding, logo uploads, and multi-opening statistics.

### D. National Industry Demand Analytics
- Live comparison between **Corporate Demand (%)** and **Student Supply (%)** across 40+ standardized skills.
- Automated tagging of **Critical Deficits** (e.g., Cloud & DevOps where demand is 65% but student readiness is 22%).

---

## 3. Technology Stack

### Frontend
- **Framework**: React 18 with Vite (Ultra-fast HMR and optimized asset bundling)
- **Styling**: Tailwind CSS with custom educational & corporate blue/indigo visual identity
- **Routing**: React Router DOM v6 with role-protected route guards
- **Charts & Visualizations**: Recharts (Radar, Multi-Bar, Pie, Status Funnel)
- **Icons**: Lucide React
- **HTTP Client**: Axios with automated Bearer JWT request/response interceptors

### Backend
- **Runtime**: Node.js & Express.js
- **Database Engine**: MongoDB with Mongoose ODM
- **Dual-Mode Database Adapter**: Standard external MongoDB connection (`MONGODB_URI` / Atlas / Local) with **automatic fallback to embedded `mongodb-memory-server`** for friction-free out-of-the-box demo execution!
- **Authentication**: Stateless JSON Web Tokens (JWT) with bcryptjs (10 salt rounds) password hashing
- **File Uploads**: Multer handling multipart/form-data for PDF resumes and avatars
- **Logging & Security**: Morgan HTTP logging, CORS whitelist, input sanitization

---

## 4. System Architecture

```
                                  +---------------------------+
                                  |     React 18 + Vite       |
                                  |   (Tailwind CSS + Recharts)|
                                  +-------------+-------------+
                                                |
                                    REST API / JSON / JWT
                                                |
                                  +-------------v-------------+
                                  |     Express.js API        |
                                  |   Controllers & Routes    |
                                  +-------------+-------------+
                                                |
        +---------------------------------------+---------------------------------------+
        |                                       |                                       |
+-------v-------+                       +-------v-------+                       +-------v-------+
| Matching      |                       | Analytics     |                       | Auth & Roles  |
| Engine        |                       | Aggregator    |                       | Middleware    |
| 5-Factor AI   |                       | Demand/Supply |                       | JWT & Bcrypt  |
+-------+-------+                       +-------+-------+                       +-------+-------+
        |                                       |                                       |
        +---------------------------------------+---------------------------------------+
                                                |
                                  +-------------v-------------+
                                  |     Mongoose ODM          |
                                  +-------------+-------------+
                                                |
                        +-----------------------v-----------------------+
                        |                                               |
            +-----------v-----------+                       +-----------v-----------+
            | External MongoDB      |                       | Embedded MongoDB      |
            | (Atlas / Localhost)   |                       | (mongodb-memory-server)|
            +-----------------------+                       +-----------------------+
```

---

## 5. Explainable AI Skill Matching Algorithm

Rather than relying on opaque heuristics, SkillBridge calculates compatibility through a transparent, multi-dimensional formula:

$$\text{Overall Score} = (0.50 \times S_{\text{req}}) + (0.20 \times S_{\text{prof}}) + (0.10 \times S_{\text{edu}}) + (0.10 \times S_{\text{cgpa}}) + (0.10 \times S_{\text{exp}}) + \text{Bonus}_{\text{pref}}$$

1. **Required Skill Match ($S_{\text{req}}$ - 50%)**: Fraction of required skills possessed by the student.
2. **Proficiency Calibration ($S_{\text{prof}}$ - 20%)**: Numeric comparison of candidate proficiency (`Beginner`=1, `Intermediate`=2, `Advanced`=3, `Expert`=4) against job requirements:
   - Match $\ge$ Target: $1.0$ (Marked as `✓ Matched`)
   - Match $<$ Target: Proportional ratio (Marked as `⚠ Level Gap`)
   - Skill Absent: $0.0$ (Marked as `✗ Missing`)
3. **Education Alignment ($S_{\text{edu}}$ - 10%)**: Degree and engineering department validation.
4. **CGPA Eligibility ($S_{\text{cgpa}}$ - 10%)**: Cutoff validation against minimum criteria.
5. **Projects & Certifications ($S_{\text{exp}}$ - 10%)**: Hands-on domain work validation.
6. **Preferred Skills Bonus**: Up to $+5\%$ bonus for optional competencies.

---

## 6. One-Click Demo Credentials

For instantaneous evaluation during SIH presentations, demo persona buttons are integrated directly on the Login screen (`/login`):

| Role | Name / Institution | Email | Password |
|---|---|---|---|
| **Student** | Aarav Sharma (IIT Delhi, CSE, CGPA 8.8) | `student@skillbridge.edu` | `password123` |
| **Student 2** | Priya Patel (VJTI Mumbai, IT, CGPA 9.2) | `priya@skillbridge.edu` | `password123` |
| **College** | IIT Delhi (Faculty & Placement Cell) | `college@skillbridge.edu` | `password123` |
| **College 2** | VJTI Mumbai (Faculty & Placement Cell) | `vjti@skillbridge.edu` | `password123` |
| **Industry** | Infosys Technologies (Corporate Recruiter) | `recruiter@infosys.com` | `password123` |
| **Industry 2** | Razorpay (Fintech Recruiter) | `careers@razorpay.com` | `password123` |

---

## 7. Installation & Running Instructions

### Prerequisites
- **Node.js**: v18+ (Tested on Node v22)
- **npm**: v9+

### Quick Start (Both Backend & Frontend)

1. **Clone or Navigate to project root**:
   ```bash
   cd C:\Users\Lenovo\.gemini\antigravity\scratch\skillbridge
   ```

2. **Install Root, Server, and Client Dependencies**:
   ```bash
   npm run install:all
   ```

3. **Start the Development Servers (Concurrently)**:
   ```bash
   npm run dev
   ```
   - **Frontend**: Runs on `http://localhost:5173`
   - **Backend API**: Runs on `http://localhost:5000`

### Running Server Standalone
```bash
cd server
npm run dev
# (The server automatically seeds realistic data on first launch!)
```

### Running Client Standalone
```bash
cd client
npm run dev
```

---

## 8. Database Seeding

The platform includes a database seeder generating:
- **40 Standardized Technical Skills** across 8 categories
- **3 Top Engineering Colleges** (IIT Delhi, VJTI Mumbai, RVCE Bengaluru)
- **8 Enterprise Companies** (TCS, Infosys, Razorpay, Zomato, Flipkart, PhonePe, Persistent, InMobi)
- **22 Verified Engineering Students** with comprehensive skill matrices, projects, and certifications
- **20 Verified Opportunities** (10 Internships + 10 Full-Time Positions)
- **Candidate Applications** across multiple pipeline stages
- **Academia–Industry MoUs & Collaborations**

To manually re-seed at any time:
```bash
cd server
npm run seed
```

---

## 9. Key REST API Endpoints

- `POST /api/auth/register` – Multi-role registration (Student / College / Company)
- `POST /api/auth/login` – JWT login
- `GET /api/auth/me` – Current profile data
- `GET /api/opportunities` – Search and filter openings
- `GET /api/matching/jobs/:studentId` – Explainable AI job recommendations for student
- `GET /api/matching/candidates/:jobId` – Reverse candidate ranking for recruiters
- `GET /api/skill-gap/:studentId` – Student skill-gap diagnostics and learning roadmap
- `GET /api/analytics/industry-demand` – Demand vs. student availability benchmark
- `GET /api/analytics/college/:id` – College placement stats & curriculum intervention recommendations
- `POST /api/applications` – Submit candidate application
- `PUT /api/applications/:id/status` – Update hiring stage (`Shortlisted`, `Interview`, `Selected`, `Rejected`)
- `GET /api/collaborations` – View institutional MoUs and partnerships

---

## 10. SIH 2026 Presentation Highlights

When demonstrating SkillBridge to the jury:
1. **Highlight Explainable AI**: Emphasize that the platform does not merely output an arbitrary percentage; show the **Match Score Modal** displaying exact mathematical weights, matched skills (✓), level gaps (⚠), and missing prerequisites (✗).
2. **Demonstrate the Reverse Matching**: Log in as **Infosys** or **Razorpay**, click *"Find Best Candidates"* on an opening, and show how recruiters can evaluate candidate readiness across universities in seconds.
3. **Showcase Curriculum Interventions**: Log in as **IIT Delhi**, point out the **High Demand + Low Student Skills Alert** (e.g. Docker, Cloud, AI/ML), and show the direct recommendation to organize a faculty workshop.
4. **Demonstrate Tripartite Application Flow**:
   - Student applies to an internship.
   - Company sees the applicant in their recruitment funnel and promotes them to *"Shortlisted"*.
   - Student instantly receives an in-app notification and sees their status timeline update in real time.
