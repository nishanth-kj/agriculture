# Defer heavy imports
# from google import genai
import sys
from pathlib import Path
BASE_DIR = Path(__file__).resolve().parent
from dotenv import load_dotenv
load_dotenv()
import os
# Add the parent directory to sys.path to allow absolute imports
sys.path.append(str(BASE_DIR))

# from filter import filter

# Lazily initialized client
_client = None

def get_genai_client():
    global _client
    if _client is None:
        from google import genai
        GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
        _client = genai.Client(api_key=GEMINI_API_KEY or "AIzaSyAc8Fm4e8P51IvYNaAjeHMZcAxrPW-j1K8")
    return _client

def run(prompt):
    client = get_genai_client()
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=prompt
    )
    return response.text#filter(response.text)