from flask import Blueprint, request, jsonify
from app.utils.gemini_client import chat_with_gemini

interview_bp = Blueprint("interview", __name__)

SYSTEM_PROMPT = """
You are an AI Excel Interviewer powered by Gemini 2.5 Pro.
Your job:
- Conduct a structured, step-by-step Excel interview.
- You can ask questions about:
  1. Excel formulas (SUM, VLOOKUP, IF, etc.)
  2. Data analysis using PivotTables
  3. Chart interpretation and creation (bar, line, pie)
- Format responses for the frontend:
  - Always start with feedback on the last candidate answer.
  - If not completed, follow feedback with the next question.
  - Ask one question at a time.
- If an answer is incorrect, provide a **hint** and ask candidate to try again.
- Keep questions scoped so the candidate can answer either:
  - In the Excel grid (formulas or table manipulations)
  - In free text (explaining PivotTable steps, chart choices, etc.)
- At the end of 3 questions:
  - Output a **JSON report only** in the following format:

{
  "status": "completed",
  "skills": {
    "Formulas": <0-100>,
    "PivotTables": <0-100>,
    "Charts": <0-100>
  },
  "roadmap": [
    "First improvement suggestion",
    "Second improvement suggestion",
    "Third improvement suggestion"
  ]
}

Do not include any text outside of this JSON block when interview is over.
"""

# In-memory state (replace with DB in production)
conversation = {"transcript": [], "completed": False}


@interview_bp.route("/start", methods=["POST"])
def start_interview():
    conversation["transcript"] = []
    conversation["completed"] = False

    # Kick off the interview
    prompt = f"{SYSTEM_PROMPT}\nCandidate: Start\nInterviewer:"
    reply = chat_with_gemini(prompt)

    conversation["transcript"].append({"role": "interviewer", "text": reply})

    return jsonify({
        "message": reply,
        "qid": 1
    })


@interview_bp.route("/validate", methods=["POST"])
def validate_answer():
    data = request.json
    answer = data.get("answer", "")

    # Append candidate answer
    conversation["transcript"].append({"role": "candidate", "text": answer})

    # Prepare transcript
    transcript_text = "\n".join([f"{m['role'].capitalize()}: {m['text']}" for m in conversation["transcript"]])

    # Send back to Gemini
    prompt = f"""{SYSTEM_PROMPT}

Here is the conversation so far:
{transcript_text}

Task:
- Evaluate the candidate's last answer.
- If interview not over:
  - Give feedback
  - Then ask the next question
- If interview is finished:
  - Respond ONLY with JSON report as specified earlier
"""

    reply = chat_with_gemini(prompt)

    # Save AI response
    conversation["transcript"].append({"role": "interviewer", "text": reply})

    return jsonify({"message": reply})
