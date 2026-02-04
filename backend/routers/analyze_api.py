from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from typing import Any, Dict, List, Optional

from config import settings
from services.safety_service import analyze_request, get_conservative_verdict
from services.supabase_service import SupabaseService
from services.llm_service import get_llm_service

router = APIRouter()


class APISpecInput(BaseModel):
    """API specification object."""
    endpoint: str = Field(..., description="API endpoint path")
    method: str = Field(..., description="HTTP method")


class AnalyzeRequest(BaseModel):
    """Request schema for /analyze-api."""
    api_spec: APISpecInput = Field(..., description="API specification object")
    user_intent: str = Field(..., description="User's intent description")
    urgency: Optional[bool] = Field(default=False, description="Urgency flag")
    threat: Optional[bool] = Field(default=False, description="Threat flag")
    sensitive_request: Optional[bool] = Field(default=False, description="Sensitive data flag")
    explanation: Optional[str] = Field(default="", description="Explanation")
    
    model_config = {
        "json_schema_extra": {
            "example": {
                "api_spec": {"endpoint": "/payments", "method": "POST"},
                "user_intent": "Explore a payments API",
                "urgency": True,
                "threat": False,
                "sensitive_request": True,
                "explanation": "API requests card number and CVV"
            }
        }
    }


class SafetyVerdict(BaseModel):
    """Response schema for safety verdict."""
    urgency: bool = Field(..., description="Whether urgency was detected")
    threat: bool = Field(..., description="Whether threat was detected")
    sensitive_request: bool = Field(..., description="Whether sensitive data involved")
    explanation: str = Field(..., description="Explanation of the verdict")
    
    model_config = {
        "json_schema_extra": {
            "example": {
                "urgency": True,
                "threat": False,
                "sensitive_request": True,
                "explanation": "API requests card number and CVV"
            }
        }
    }


def get_supabase_service() -> SupabaseService:
    """Dependency for Supabase service."""
    return SupabaseService()


@router.post("/analyze-api", response_model=SafetyVerdict)
async def analyze_api(
    request: AnalyzeRequest,
    supabase: SupabaseService = Depends(get_supabase_service)
):
    """
    Analyze an API request for safety concerns.
    Returns a safety verdict with urgency, threat, sensitive_request flags.
    
    When LOCAL_MODE=0, uses OpenAI LLM for enhanced analysis.
    When LOCAL_MODE=1, uses rules-based analysis only.
    """
    try:
        # Convert api_spec object to string for analysis
        api_spec_str = f"{request.api_spec.method} {request.api_spec.endpoint}"
        
        # Use LLM-powered analysis when LOCAL_MODE is disabled
        if not settings.LOCAL_MODE:
            print(f"Using {settings.LLM_PROVIDER} LLM for safety analysis...", flush=True)
            llm_service = get_llm_service()
            verdict = await llm_service.analyze_safety(
                api_spec=api_spec_str,
                user_intent=request.user_intent,
                example_payloads=[],
                constructed_input={}
            )
            # Extract core verdict fields for response
            verdict = {
                "urgency": verdict.get("urgency", False),
                "threat": verdict.get("threat", False),
                "sensitive_request": verdict.get("sensitive_request", False),
                "explanation": verdict.get("explanation", "")
            }
        else:
            # Rules-based analysis (LOCAL_MODE=1)
            verdict = analyze_request(
                api_spec=api_spec_str,
                user_intent=request.user_intent,
                example_payloads=[],
                constructed_input={}
            )
        
        # Log to Supabase
        spec_id = supabase.insert_api_spec(
            name="API Spec",
            spec_text=api_spec_str
        )
        
        supabase.insert_verdict(
            api_spec_id=spec_id,
            user_intent=request.user_intent,
            verdict=verdict,
            ui_contract={},
            risk_score=1.0 if verdict.get("threat") else 0.5 if verdict.get("sensitive_request") else 0.0
        )
        
        return SafetyVerdict(**verdict)
    
    except Exception as e:
        print(f"Error in analyze_api: {e}")
        return SafetyVerdict(**get_conservative_verdict())

