/**
 * Auth redirect utilities
 */

const ALLOWED_REDIRECT_PATHS = [
    "/dashboard",
    "/explorer",
    "/account",
    "/chat",
    "/admin",
    "/pharmacist",
    "/profile",
    "/settings",
];

/**
 * Sanitize redirect path to prevent open redirect vulnerabilities
 * Only allows internal paths that start with allowed prefixes
 */
export function sanitizeRedirectPath(path: string | null | undefined, defaultPath: string = "/dashboard"): string {
    if (!path) {
        return defaultPath;
    }

    // Remove any leading/trailing whitespace
    const sanitized = path.trim();

    // Block external URLs (starting with http://, https://, or //)
    if (sanitized.startsWith("http://") || sanitized.startsWith("https://") || sanitized.startsWith("//")) {
        return defaultPath;
    }

    // Ensure path starts with /
    if (!sanitized.startsWith("/")) {
        return defaultPath;
    }

    // Block paths with protocol in them (e.g., /http://evil.com)
    if (sanitized.includes("://")) {
        return defaultPath;
    }

    // Check if path is in the allowed list or starts with allowed prefix
    const isAllowed = ALLOWED_REDIRECT_PATHS.some(
        (allowed) => sanitized === allowed || sanitized.startsWith(`${allowed}/`)
    );

    if (isAllowed) {
        return sanitized;
    }

    // For root path, allow it
    if (sanitized === "/") {
        return defaultPath;
    }

    return defaultPath;
}

/**
 * Build a safe callback URL for OAuth
 */
export function buildCallbackUrl(origin: string, redirectTo?: string): string {
    const callbackUrl = new URL(`${origin}/auth/callback`);

    if (redirectTo) {
        const safeRedirect = sanitizeRedirectPath(redirectTo);
        callbackUrl.searchParams.set("next", safeRedirect);
    }

    return callbackUrl.toString();
}
