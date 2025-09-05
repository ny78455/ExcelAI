from app.utils.gemini_client import chat_with_gemini

REPORT_PROMPT = """
You are an AI evaluator. 
Given the transcript of a mock Excel interview, generate:
1. Scores for skills: Formulas, Pivot Tables, Charts, Data Cleaning (0-100).
2. A short roadmap of what to improve.
Return JSON only.
"""

# In real use, collect full transcript from DB
mock_transcript = """
Q: What is VLOOKUP? 
A: It finds values in a column but candidate confused with HLOOKUP.
Q: Show me a Pivot Table.
A: Candidate built a basic pivot but missed grouping feature.
"""

def generate_report():
    prompt = f"{REPORT_PROMPT}\nTranscript:\n{mock_transcript}"
    reply = chat_with_gemini(prompt)

    # In practice, parse JSON properly
    return {
        "skills": {
            "Formulas": 70,
            "Pivot Tables": 55,
            "Charts": 40,
            "Data Cleaning": 50
        },
        "roadmap": [
            "Review difference between VLOOKUP and HLOOKUP",
            "Practice grouping in Pivot Tables",
            "Learn basic chart customization"
        ],
        "ai_feedback": reply
    }
