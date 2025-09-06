
# 📊 AI Excel Interviewer Platform

An **AI-powered Excel Interview Simulator** that conducts structured interviews using **Gemini 2.5 Pro**, evaluates candidate answers in real-time, and generates **personalized skill reports**.  

This project is designed to help candidates practice Excel interviews with features like **formula validation, PivotTable setup, chart interpretation, report generation, authentication, proctoring, and persistent report storage**.  

---

## 🌟 Features

### ✅ Core Interview Flow
- **Step-by-step interview** powered by **Gemini 2.5 Pro**.  
- Supports **Excel formulas**, **PivotTables**, **charts**, and **reverse-style questions** (e.g., "Given this chart, what Excel entries would you create?").  
- **Interactive Q&A**: Candidate answers questions in text; interviewer evaluates and gives hints.  
- **Dynamic visuals**: Tables and charts are auto-rendered as **images** for better user experience.  
- **Final Skill Report**: At the end of the session, a structured JSON report is generated and stored in the database.  

### 🔐 Authentication
- **Signup/Login/Logout** with password hashing.  
- **Session-based authentication** for securing interview and report pages.  

### 📑 Reports
- **Reports saved in database** (`SQLite` by default).  
- **Skills breakdown**: Formulas, PivotTables, Charts.  
- **Personalized roadmap** with improvement suggestions.  
- Future-ready for **report history dashboard**.  

### 👁️ Proctoring
- **Face detection proctoring** integrated:  
  - Candidate’s camera feed is analyzed during the session.  
  - Ensures candidate presence and minimizes malpractice.  
  - Alerts if no face is detected for a configurable duration.  

### 🎨 Frontend
- **Next.js + React + TailwindCSS**.  
- Pages:
  - `/auth` → Authentication (Login/Signup).
  - `/interview` → AI-powered interview chat with visuals.
  - `/reports` → Final performance report.  
- Smooth animations with **Framer Motion**.  

### ⚙️ Backend
- **Flask + SQLAlchemy + Gemini API**.  
- REST API endpoints for interview, validation, authentication.  
- Auto-generates images for **Markdown tables** and **chart descriptions**.  

---

## 🗂️ Project Structure

```
project-root/
│
├── backend/
│   ├── app.py                # Flask entrypoint
│   ├── database/
│   │   ├── models.py         # User + Report models
│   │   └── db.sqlite3        # SQLite database
│   ├── routes/
│   │   ├── interview.py      # Interview APIs
│   │   └── auth.py           # Authentication APIs
│   ├── utils/
│   │   └── gemini_client.py  # Gemini API wrapper
│   └── requirements.txt
│
├── frontend/
│   ├── pages/
│   │   ├── auth.tsx          # Login/Signup UI
│   │   ├── interview.tsx     # Chatbot-style interview page
│   │   └── reports.tsx       # Performance report page
│   ├── components/
│   │   └── LoginForm.tsx     # Shared login form
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🛠️ Setup

### 🔹 Backend
1. Clone the repo:
   ```bash
   git clone https://github.com/your-username/ai-excel-interviewer.git
   cd ai-excel-interviewer/backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate   # (Linux/Mac)
   venv\Scripts\activate      # (Windows)
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set environment variables (create `.env`):
   ```env
   GEMINI_API_KEY=your_gemini_api_key
   FLASK_APP=app.py
   FLASK_ENV=development
   ```

5. Run Flask:
   ```bash
   flask run
   ```
   API will start at: `http://127.0.0.1:5000`

---

### 🔹 Frontend
1. Navigate to frontend:
   ```bash
   cd ../frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```
   App runs at: `http://localhost:3000`

---

## ⚙️ API Endpoints

### Auth
- `POST /api/auth/signup` → Create new user  
- `POST /api/auth/login` → Authenticate user  
- `POST /api/auth/logout` → Logout  

### Interview
- `POST /api/interview/start` → Start new interview  
- `POST /api/interview/validate` → Submit candidate answer, get feedback/next question  

---

## 🔍 Approach

1. **Interview Design**  
   - Conduct structured Excel interview with variety: formulas, tables, PivotTables, charts.  
   - AI (Gemini 2.5 Pro) ensures step-by-step flow.  

2. **Conversation Context**  
   - Transcript stored in memory during session.  
   - Sent back to Gemini each turn for continuity.  

3. **Visual Rendering**  
   - Gemini outputs tables in Markdown and charts with `"Chart:"` syntax.  
   - Flask detects and converts into **PNG images** using Matplotlib + Pandas.  

4. **Scoring & Reports**  
   - At the end, Gemini outputs a **JSON report** with scores (0–100) and roadmap.  
   - Saved in DB for each authenticated user.  

5. **Proctoring**  
   - Face detection runs in browser during interview.  
   - Alerts if no face detected, helping simulate real exam conditions.  

---

## 🚀 Future Improvements

- Multi-user **report dashboard** with filters and charts.  
- **Export reports** to PDF for easy sharing.  
- More advanced **AI proctoring** (multiple face detection, gaze tracking).  
- Integration with **Google Sheets/Excel API** for live sheet validation.  
- **Admin Dashboard** for managing users, monitoring sessions, and viewing all reports.

---

## 🙌 Credits
- **Flask** for backend APIs  
- **Next.js + React + TailwindCSS** for frontend  
- **Gemini 2.5 Pro** for AI interview logic  
- **Matplotlib + Pandas** for table/chart rendering  
- **OpenCV / Face Detection** for proctoring  

---
