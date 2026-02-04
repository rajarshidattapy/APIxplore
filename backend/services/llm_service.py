import json
from typing import Any, Dict, List, Optional
from openai import OpenAI
from config import settings



class LLMService:
    """LLM service for enhanced safety analysis."""
    
    def __init__(self):
        self.provider = settings.LLM_PROVIDER
        self.client = None
        self._initialize_client()
    
    def _initialize_client(self):
        """Initialize the appropriate LLM client based on provider."""
        if self.provider == "openai":
            if not settings.OPENAI_API_KEY:
                raise ValueError("OPENAI_API_KEY is required when using OpenAI provider")
            
            # Debug: check API key length
            key_len = len(settings.OPENAI_API_KEY)
            print(f"[LLM] Initializing OpenAI client. Key length: {key_len}")
            
            # Use AsyncOpenAI for async operations
            from openai import AsyncOpenAI
            self.client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
            self.model = settings.LLM_MODEL or "gpt-4o-mini"
            
        elif self.provider == "gemini":
            if not settings.GEMINI_API_KEY:
                raise ValueError("GEMINI_API_KEY is required when using Gemini provider")
            
            import google.generativeai as genai
            genai.configure(api_key=settings.GEMINI_API_KEY)
            self.client = genai
            self.model = settings.LLM_MODEL or "gemini-2.0-flash-exp" # Default to latest flash
            print(f"[LLM] Initialized Gemini client with model {self.model}")
            
        else:
            raise ValueError(f"Unknown LLM provider: {self.provider}")
    
    async def analyze_safety(
        self,
        api_spec: str,
        user_intent: str,
        example_payloads: List[Dict[str, Any]],
        constructed_input: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Use LLM to perform deep safety analysis of an API request.
        """
        prompt = self._build_safety_prompt(
            api_spec, user_intent, example_payloads, constructed_input
        )
        
        try:
            print(f"[LLM] Sending safety analysis request to {self.provider}...")
            
            if self.provider == "openai":
                response = await self.client.chat.completions.create(
                    model=self.model,
                    messages=[
                        {
                            "role": "system",
                            "content": self._get_system_prompt()
                        },
                        {
                            "role": "user",
                            "content": prompt
                        }
                    ],
                    temperature=0.1,
                    response_format={"type": "json_object"}
                )
                result = json.loads(response.choices[0].message.content)
                
            elif self.provider == "gemini":
                # Combine system prompt and user prompt because simple generate_content doesn't have system role easily separate in all versions
                full_prompt = f"{self._get_system_prompt()}\n\nUser Request:\n{prompt}"
                
                model = self.client.GenerativeModel(self.model)
                # Ensure JSON response
                response = await model.generate_content_async(
                    full_prompt,
                    generation_config={"response_mime_type": "application/json"}
                )
                result = json.loads(response.text)
            
            print("[LLM] Received analysis response")
            return self._validate_response(result)
            
        except Exception as e:
            import traceback
            traceback.print_exc()
            print(f"LLM analysis error: {e}")
            return {
                "urgency": True,
                "threat": False,
                "sensitive_request": True,
                "explanation": f"LLM analysis failed: {str(e)}. Applying conservative safety measures.",
                "risk_score": 7,
                "recommendations": ["Manual review recommended"],
                "detected_patterns": ["analysis_error"]
            }

    def _get_system_prompt(self):
        return """You are a security analyst specialized in API safety. 
Analyze the provided API request for potential security risks, sensitive data exposure, 
and threat patterns. Return your analysis as JSON with the following structure:
{
    "urgency": boolean,
    "threat": boolean,
    "sensitive_request": boolean,
    "explanation": "detailed explanation string",
    "risk_score": 1-10 integer,
    "recommendations": ["list", "of", "suggestions"],
    "detected_patterns": ["list", "of", "detected", "issues"]
}"""
    
    def _build_safety_prompt(
        self,
        api_spec: str,
        user_intent: str,
        example_payloads: List[Dict[str, Any]],
        constructed_input: Dict[str, Any]
    ) -> str:
        """Build the prompt for safety analysis."""
        return f"""Analyze this API request for security risks:

## API Specification
{api_spec}

## User Intent
{user_intent}

## Example Payloads
{json.dumps(example_payloads, indent=2)}

## Constructed Input
{json.dumps(constructed_input, indent=2)}

Evaluate for:
1. Sensitive data exposure (PII, credentials, financial data)
2. Potential injection attacks or malicious patterns
3. Urgency manipulation or social engineering
4. Authorization/authentication concerns
5. Data validation issues
6. Rate limiting or abuse potential

Provide your analysis as JSON."""
    
    def _validate_response(self, result: Dict[str, Any]) -> Dict[str, Any]:
        """Validate and normalize the LLM response."""
        return {
            "urgency": bool(result.get("urgency", False)),
            "threat": bool(result.get("threat", False)),
            "sensitive_request": bool(result.get("sensitive_request", False)),
            "explanation": str(result.get("explanation", "No explanation provided")),
            "risk_score": min(10, max(1, int(result.get("risk_score", 5)))),
            "recommendations": list(result.get("recommendations", [])),
            "detected_patterns": list(result.get("detected_patterns", []))
        }
    
    async def generate_ui_suggestions(
        self,
        verdict: Dict[str, Any],
        api_spec: str
    ) -> Dict[str, Any]:
        """
        Use LLM to generate intelligent UI component suggestions.
        """
        prompt = f"""Based on this safety verdict, suggest appropriate UI components:

## Safety Verdict
{json.dumps(verdict, indent=2)}

## API Specification
{api_spec}

Suggest UI components and restrictions. Return as JSON:
{{
    "suggested_components": ["list of component names"],
    "component_configs": {{"component_name": {{"config": "values"}}}},
    "warnings": ["user-facing warnings to display"],
    "field_restrictions": {{"field_name": "restriction_type"}}
}}"""
        system_prompt = "You are a UI/UX expert focusing on secure API interfaces."

        try:
            if self.provider == "openai":
                response = await self.client.chat.completions.create(
                    model=self.model,
                    messages=[
                        {
                            "role": "system",
                            "content": system_prompt
                        },
                        {
                            "role": "user",
                            "content": prompt
                        }
                    ],
                    temperature=0.2,
                    response_format={"type": "json_object"}
                )
                result = json.loads(response.choices[0].message.content)
            
            elif self.provider == "gemini":
                full_prompt = f"{system_prompt}\n\n{prompt}"
                model = self.client.GenerativeModel(self.model)
                response = await model.generate_content_async(
                    full_prompt,
                    generation_config={"response_mime_type": "application/json"}
                )
                result = json.loads(response.text)
                
            return result
            
        except Exception as e:
            print(f"UI suggestion error: {e}")
            import traceback
            traceback.print_exc()
            return {
                "suggested_components": ["SafetyInspector"],
                "component_configs": {},
                "warnings": ["Unable to generate AI suggestions"],
                "field_restrictions": {}
            }



# Singleton instance
_llm_service: Optional[LLMService] = None


def get_llm_service() -> LLMService:
    """Get the LLM service singleton instance."""
    global _llm_service
    if _llm_service is None:
        _llm_service = LLMService()
    return _llm_service
