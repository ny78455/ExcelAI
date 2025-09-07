import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Default and fallback models
DEFAULT_MODEL = "gemini-2.5-pro"
FALLBACK_MODEL = "gemini-1.5-flash"

def chat_with_gemini(prompt: str) -> str:
    try:
        # Try with default model first
        model = genai.GenerativeModel(DEFAULT_MODEL)
        response = model.generate_content(prompt)
        return response.text

    except Exception as e:
        # If quota exceeded or any other failure, switch to fallback
        if "quota" in str(e).lower() or "exceeded" in str(e).lower():
            try:
                model = genai.GenerativeModel(FALLBACK_MODEL)
                response = model.generate_content(prompt)
                return response.text
            except Exception as e2:
                return f"Error with fallback: {str(e2)}"
        else:
            return f"Error: {str(e)}"
