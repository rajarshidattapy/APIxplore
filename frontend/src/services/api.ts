/**
 * API Service for Policy-Aware AI API Explorer
 * Connects frontend to FastAPI backend for safety analysis and UI plan generation
 */

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

// ============================================================================
// Types
// ============================================================================

export interface SafetyVerdict {
    urgency: boolean;
    threat: boolean;
    sensitive_request: boolean;
    explanation: string;
    risk_score?: number;
    recommendations?: string[];
    detected_patterns?: string[];
}

export interface UIPlan {
    components: string[];
    restrictions: {
        execute_requests?: boolean;
        editable_fields?: string[];
        [key: string]: unknown;
    };
    warnings?: string[];
}

export interface ApiSpec {
    endpoint: string;
    method: string;
    headers?: Record<string, string>;
    body?: unknown;
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * Analyze an API request for safety concerns.
 * Returns a safety verdict with urgency, threat, and sensitive_request flags.
 */
export async function analyzeApi(
    apiSpec: ApiSpec,
    userIntent: string
): Promise<SafetyVerdict> {
    try {
        const response = await fetch(`${BACKEND_URL}/analyze-api`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                api_spec: {
                    endpoint: apiSpec.endpoint,
                    method: apiSpec.method,
                },
                user_intent: userIntent,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Backend error:', errorText);
            throw new Error(`Backend error: ${response.status}`);
        }

        return response.json();
    } catch (error) {
        console.error('analyzeApi error:', error);
        // Return a conservative fallback verdict
        return {
            urgency: false,
            threat: false,
            sensitive_request: true,
            explanation: 'Unable to analyze request. Please try again.',
        };
    }
}

/**
 * Generate a UI plan based on safety verdict.
 * Returns components to render and restrictions to apply.
 */
export async function generateUIPlan(
    verdict: Partial<SafetyVerdict>,
    apiSpec: string
): Promise<UIPlan> {
    try {
        const response = await fetch(`${BACKEND_URL}/generate-ui-plan`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                urgency: verdict.urgency ?? false,
                threat: verdict.threat ?? false,
                sensitive_request: verdict.sensitive_request ?? false,
                api_spec: apiSpec,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Backend error:', errorText);
            throw new Error(`Backend error: ${response.status}`);
        }

        return response.json();
    } catch (error) {
        console.error('generateUIPlan error:', error);
        // Return a conservative fallback UI plan
        return {
            components: ['EndpointList', 'SchemaViewer', 'SafetyInspector'],
            restrictions: {
                execute_requests: false,
                editable_fields: [],
            },
            warnings: ['Unable to generate UI plan. Restricted mode enabled.'],
        };
    }
}

/**
 * Analyze API and get UI plan in one call.
 * This combines both API calls for convenience.
 */
export async function analyzeAndPlan(
    apiSpec: ApiSpec,
    userIntent: string
): Promise<{ verdict: SafetyVerdict; uiPlan: UIPlan }> {
    // First, analyze the API for safety
    const verdict = await analyzeApi(apiSpec, userIntent);

    // Then, generate the UI plan based on the verdict
    const apiSpecStr = `${apiSpec.method} ${apiSpec.endpoint}`;
    const uiPlan = await generateUIPlan(verdict, apiSpecStr);

    return { verdict, uiPlan };
}
