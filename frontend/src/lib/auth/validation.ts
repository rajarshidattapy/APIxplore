/**
 * Auth validation utilities
 */

interface ValidationResult {
    isValid: boolean;
    error?: string;
}

/**
 * Validate email format
 */
export function validateEmail(email: string): ValidationResult {
    if (!email) {
        return { isValid: false, error: "Email is required" };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { isValid: false, error: "Please enter a valid email address" };
    }

    return { isValid: true };
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): ValidationResult {
    if (!password) {
        return { isValid: false, error: "Password is required" };
    }

    if (password.length < 6) {
        return { isValid: false, error: "Password must be at least 6 characters" };
    }

    return { isValid: true };
}

/**
 * Validate passwords match
 */
export function validatePasswordsMatch(password: string, confirmPassword: string): ValidationResult {
    if (password !== confirmPassword) {
        return { isValid: false, error: "Passwords do not match" };
    }

    return { isValid: true };
}

/**
 * Sanitize email (lowercase, trim)
 */
export function sanitizeEmail(email: string): string {
    return email.toLowerCase().trim();
}

/**
 * Sanitize auth error messages for user display
 * Prevents leaking sensitive information
 */
export function sanitizeAuthError(message: string): string {
    const sanitizedErrors: Record<string, string> = {
        "Invalid login credentials": "Invalid email or password",
        "Email not confirmed": "Please verify your email address",
        "User already registered": "An account with this email already exists",
        "Password should be at least 6 characters": "Password must be at least 6 characters",
        "Email rate limit exceeded": "Too many attempts. Please try again later",
        "Signups not allowed for this instance": "Registration is currently disabled",
    };

    for (const [key, value] of Object.entries(sanitizedErrors)) {
        if (message.includes(key)) {
            return value;
        }
    }

    // Generic fallback for unknown errors
    if (message.includes("rate limit")) {
        return "Too many attempts. Please try again later";
    }

    return message;
}
