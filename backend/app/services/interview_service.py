from app.utils.gemini_client import chat_with_gemini

# System prompt ensures consistency
SYSTEM_PROMPT = """
You are an Excel Interviewer AI. 
Your job:
1. Conduct a structured Excel skills interview.
2. Ask step-by-step Excel-related questions (formulas, pivot tables, charts).
3. Evaluate candidate answers fairly.
4. Give hints if they are stuck.
5. Save insights for a final performance report.
Keep answers concise and professional.
"""

def process_interview(user_message: str):
    prompt = f"{SYSTEM_PROMPT}\nCandidate: {user_message}\nInterviewer:"
    reply = chat_with_gemini(prompt)

    return {
        "interviewer_message": reply,
        "next_question": "Continue solving in the Excel grid."
    }
