import os
import re
import uuid
import matplotlib.pyplot as plt
import pandas as pd
from flask import Blueprint, request, jsonify
from app.utils.gemini_client import chat_with_gemini

interview_bp = Blueprint("interview", __name__)

SYSTEM_PROMPT = """
You are an AI Excel Interviewer powered by Gemini 2.5 Pro.

Interview Format:
- Conduct 3–5 Excel-related questions.
- Ask one question at a time.
- After each candidate answer:
  - Evaluate correctness
  - Provide short feedback
  - If correct, ask the next question
  - If incorrect, provide a **hint** and re-ask until correct

Types of Questions (rotate for variety):
1. Formula writing (SUM, IF, VLOOKUP, etc.)
2. PivotTable setup (which fields go where)
3. Chart creation or interpretation
4. Reverse questions: show a chart/table and ask “what Excel entries would you need to create this?”

Formatting rules for visuals:
- If you need to show a **table**, always output it in **Markdown table** format with `|` and `---`.
- If you need to show a **chart**, always begin with:
  `Chart: <bar/line/pie> of <X> vs <Y>`
  Example: `Chart: bar of Category vs Total Units Sold`
- Never output plain text tables or CSV.

End of Interview:
- After the last question, output ONLY a JSON report in this format:

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
"""



conversation = {"transcript": [], "completed": False}

STATIC_DIR = "app/static/generated"
os.makedirs(STATIC_DIR, exist_ok=True)


def maybe_generate_image(text: str):
    """
    Detect markdown tables or chart descriptions and generate image.
    Returns (text, image_url or None)
    """
    # Detect markdown table
    if "|" in text and "---" in text:
        try:
            # Extract table rows
            lines = [line.strip() for line in text.splitlines() if "|" in line]
            headers = [h.strip() for h in lines[0].split("|")[1:-1]]
            rows = [[c.strip() for c in row.split("|")[1:-1]] for row in lines[2:]]
            df = pd.DataFrame(rows, columns=headers)

            # Plot table
            fig, ax = plt.subplots(figsize=(6, len(df) * 0.5 + 1))
            ax.axis("off")
            tbl = ax.table(cellText=df.values, colLabels=df.columns, cellLoc="center", loc="center")
            tbl.auto_set_font_size(False)
            tbl.set_fontsize(10)

            fname = f"table_{uuid.uuid4().hex[:8]}.png"
            path = os.path.join(STATIC_DIR, fname)
            plt.savefig(path, bbox_inches="tight")
            plt.close(fig)

            return text, f"/static/generated/{fname}"
        except Exception as e:
            print("Table parse failed:", e)

    # Detect chart description
    chart_match = re.search(r"Chart:\s*(\w+)\s+of\s+(.*)", text, re.I)
    if chart_match:
        chart_type = chart_match.group(1).lower()
        desc = chart_match.group(2)

        # Dummy chart for demo
        values = [10, 20, 30]
        labels = ["A", "B", "C"]

        fig, ax = plt.subplots()
        if chart_type == "bar":
            ax.bar(labels, values)
        elif chart_type == "line":
            ax.plot(labels, values, marker="o")
        elif chart_type == "pie":
            ax.pie(values, labels=labels, autopct="%1.1f%%")
        ax.set_title(desc)

        fname = f"chart_{uuid.uuid4().hex[:8]}.png"
        path = os.path.join(STATIC_DIR, fname)
        plt.savefig(path, bbox_inches="tight")
        plt.close(fig)

        return text, f"/static/generated/{fname}"

    return text, None


@interview_bp.route("/start", methods=["POST"])
def start_interview():
    conversation["transcript"] = []
    conversation["completed"] = False

    prompt = f"{SYSTEM_PROMPT}\nCandidate: Start\nInterviewer:"
    reply = chat_with_gemini(prompt)
    text, image_url = maybe_generate_image(reply)

    conversation["transcript"].append({"role": "interviewer", "text": text})

    return jsonify({"message": text, "image_url": image_url, "qid": 1})


@interview_bp.route("/validate", methods=["POST"])
def validate_answer():
    data = request.json
    answer = data.get("answer", "")
    conversation["transcript"].append({"role": "candidate", "text": answer})

    transcript_text = "\n".join(
        [f"{m['role'].capitalize()}: {m['text']}" for m in conversation["transcript"]]
    )

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
    text, image_url = maybe_generate_image(reply)

    conversation["transcript"].append({"role": "interviewer", "text": text})

    return jsonify({"message": text, "image_url": image_url})
