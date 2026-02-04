
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()


class Settings:
    """Application configuration."""
    APP_NAME = "Policy-Aware AI API Explorer"
    APP_DESCRIPTION = "Safety enforcement layer for AI-generated UIs"
    APP_VERSION = "0.1.0"
    
    # Environment
    LOCAL_MODE = int(os.getenv("LOCAL_MODE", 1)) == 1
    
    # LLM Configuration
    LLM_PROVIDER = os.getenv("LLM_PROVIDER", "openai")  # "openai" or "gemini"
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    LLM_MODEL = os.getenv("LLM_MODEL", "gpt-4o-mini")  # Default model
    
    # Server
    HOST = os.getenv("HOST", "0.0.0.0")
    PORT = int(os.getenv("PORT", 8000))
    
    # CORS
    CORS_ORIGINS = os.getenv("ALLOWED_ORIGINS", "*").split(",")
    CORS_ALLOW_CREDENTIALS = True
    CORS_ALLOW_METHODS = ["*"]
    CORS_ALLOW_HEADERS = ["*"]

    # Supabase
    SUPABASE_URL = os.getenv("SUPABASE_URL")
    SUPABASE_KEY = os.getenv("SUPABASE_KEY")


settings = Settings()
