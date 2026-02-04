"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function CallbackHandler() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [error, setError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(true);

    useEffect(() => {
        const handleCallback = async () => {
            try {
                const supabase = createClient();
                const next = searchParams.get("next") ?? "/explorer";

                // Check if there's a hash with access_token (implicit flow from Google OAuth)
                if (typeof window !== "undefined" && window.location.hash) {
                    const hashParams = new URLSearchParams(
                        window.location.hash.substring(1)
                    );
                    const accessToken = hashParams.get("access_token");
                    const refreshToken = hashParams.get("refresh_token");

                    if (accessToken) {
                        console.log("Found access token in hash, setting session...");

                        // Set the session from hash tokens
                        const { error: sessionError } = await supabase.auth.setSession({
                            access_token: accessToken,
                            refresh_token: refreshToken || "",
                        });

                        if (!sessionError) {
                            console.log("Session set successfully, redirecting to:", next);
                            router.replace(next);
                            return;
                        } else {
                            console.error("Session error:", sessionError);
                            setError(sessionError.message);
                            setIsProcessing(false);
                            return;
                        }
                    }
                }

                // Check for code parameter (PKCE flow)
                const code = searchParams.get("code");
                if (code) {
                    console.log("Found code, exchanging for session...");
                    const { error: codeError } = await supabase.auth.exchangeCodeForSession(code);
                    if (!codeError) {
                        router.replace(next);
                        return;
                    } else {
                        setError(codeError.message);
                        setIsProcessing(false);
                        return;
                    }
                }

                // If we get here, check if user is already authenticated
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    console.log("User already authenticated, redirecting...");
                    router.replace(next);
                    return;
                }

                // No auth method worked
                setError("No authentication credentials found. Please try again.");
                setIsProcessing(false);
            } catch (err) {
                console.error("Callback error:", err);
                setError(err instanceof Error ? err.message : "Authentication failed");
                setIsProcessing(false);
            }
        };

        handleCallback();
    }, [router, searchParams]);

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-950">
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-6 py-4 rounded-lg max-w-md text-center">
                    <p className="font-semibold text-lg">Authentication Error</p>
                    <p className="text-sm mt-2">{error}</p>
                    <button
                        onClick={() => router.push("/auth/login")}
                        className="mt-4 px-6 py-2 bg-cyan-500 text-gray-900 rounded-lg hover:bg-cyan-400 transition font-medium"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        );
    }

    if (isProcessing) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-950">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
                    <p className="text-white text-lg">Completing sign in...</p>
                    <p className="text-gray-500 text-sm mt-2">Please wait while we verify your credentials</p>
                </div>
            </div>
        );
    }

    return null;
}

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-950">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
                    <p className="text-white text-lg">Loading...</p>
                </div>
            </div>
        }>
            <CallbackHandler />
        </Suspense>
    );
}
