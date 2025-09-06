from flask import Blueprint, request, jsonify
from app.utils.gemini_client import chat_with_gemini

interview_bp = Blueprint("interview", __name__)

SYSTEM_PROMPT = """
You are an Excel Interviewer AI. 
Your job:
- Run a step-by-step Excel interview.
- Start with greeting and Question 1.
- After candidate answers, evaluate correctness and give feedback.
- If correct, ask the next question. If not, provide a hint.
- After 3 questions, conclude and summarize candidate's performance in JSON.
"""

# Store conversation state in memory (replace with DB in prod)
conversation = {"transcript": [], "completed": False}

@interview_bp.route("/start", methods=["POST"])
def start_interview():
    conversation["transcript"] = []
    conversation["completed"] = False

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

    # Ask Gemini for evaluation + next step
    transcript_text = "\n".join([f"{m['role'].capitalize()}: {m['text']}" for m in conversation["transcript"]])
    prompt = f"""{SYSTEM_PROMPT}
Here is the conversation so far:
{transcript_text}

Evaluate the last candidate answer. 
If correct, give feedback and next question. 
If interview is over, return JSON:
{{
  "status": "completed",
  "skills": {{"Formulas": 80, "Pivot Tables": 60, "Charts": 70}},
  "roadmap": ["Improve PivotTables", "Practice chart formatting"]
}}
"""

    reply = chat_with_gemini(prompt)
    conversation["transcript"].append({"role": "interviewer", "text": reply})

    return jsonify({"message": reply})
