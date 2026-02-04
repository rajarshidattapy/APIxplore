from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import Any, Dict, List, Optional

from services.ui_service import generate_ui_plan, get_conservative_ui_plan

router = APIRouter()



from config import settings
from services.llm_service import get_llm_service

class VerdictInput(BaseModel):
    """Input schema - safety verdict for UI plan generation."""
    urgency: bool = Field(..., description="Whether request shows urgency")
    threat: bool = Field(..., description="Whether threat was detected")
    sensitive_request: bool = Field(..., description="Whether sensitive data involved")
    api_spec: Optional[str] = Field(default="", description="API Specification string (required for AI generation)")
    components: Optional[List[str]] = Field(default=None, description="Optional component hints")
    restrictions: Optional[Dict[str, Any]] = Field(default=None, description="Optional restriction hints")
    
    model_config = {
        "json_schema_extra": {
            "example": {
                "urgency": True,
                "threat": False,
                "sensitive_request": True,
                "api_spec": "POST /api/users",
                "components": ["EndpointList", "RequestBuilder", "ResponseViewer"],
                "restrictions": {"execute_requests": False, "editable_fields": ["email", "password"]}
            }
        }
    }


class UIPlanResponse(BaseModel):
    """Response schema for UI plan."""
    components: List[str] = Field(..., description="UI components to render")
    restrictions: Dict[str, Any] = Field(..., description="UI restrictions to apply")
    warnings: Optional[List[str]] = Field(default=[], description="Warnings to display")
    
    model_config = {
        "json_schema_extra": {
            "example": {
                "components": ["EndpointList", "RequestBuilder", "ResponseViewer"],
                "restrictions": {
                    "execute_requests": False,
                    "editable_fields": ["email", "password"]
                },
                "warnings": ["Caution: Sensitive data"]
            }
        }
    }


@router.post("/generate-ui-plan", response_model=UIPlanResponse)
async def generate_ui_plan_endpoint(verdict: VerdictInput):
    """
    Generate a UI plan based on the safety verdict.
    When LOCAL_MODE=0 and api_spec is provided, uses AI to suggest components.
    """
    try:
        if not settings.LOCAL_MODE and verdict.api_spec:
            print(f"Using {settings.LLM_PROVIDER} LLM for UI plan generation...", flush=True)
            llm_service = get_llm_service()
            suggestion = await llm_service.generate_ui_suggestions(
                verdict={
                    "urgency": verdict.urgency,
                    "threat": verdict.threat,
                    "sensitive_request": verdict.sensitive_request
                },
                api_spec=verdict.api_spec
            )
            
            # Map LLM suggestion to response format
            return UIPlanResponse(
                components=suggestion.get("suggested_components", []),
                restrictions=suggestion.get("field_restrictions", {}), # Note: mismatched structure handling might be needed
                warnings=suggestion.get("warnings", [])
            )
            
        # Fallback to rules-based
        ui_plan = generate_ui_plan({
            "urgency": verdict.urgency,
            "threat": verdict.threat,
            "sensitive_request": verdict.sensitive_request
        })
        return UIPlanResponse(
            components=ui_plan["components"],
            restrictions=ui_plan["restrictions"],
            warnings=[]
        )
    except Exception as e:
        print(f"Error in generate_ui_plan: {e}")
        import traceback
        traceback.print_exc()
        plan = get_conservative_ui_plan()
        return UIPlanResponse(
            components=plan["components"],
            restrictions=plan["restrictions"],
            warnings=["System Error generating UI plan"]
        )
