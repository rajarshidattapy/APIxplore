"use client";

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react';

export default function AuthSignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
            });
            if (error) throw error;
            setSuccess(true);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to sign up');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setError('');
        setGoogleLoading(true);

        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback?next=/explorer`,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    },
                },
            });
            if (error) throw error;
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to sign in with Google');
            setGoogleLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
                <div className="w-full max-w-md text-center">
                    <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Check your email</h2>
                    <p className="text-gray-400 mb-6">
                        We&apos;ve sent you a confirmation link. Please verify your email to continue.
                    </p>
                    <Link
                        href="/auth/login"
                        className="inline-block px-6 py-3 bg-cyan-500 text-black font-medium rounded-lg hover:bg-cyan-400 transition"
                    >
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex">
            {/* Left side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gray-950 flex-col justify-between p-12 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-30">
                    <svg className="w-full h-full" viewBox="0 0 800 800">
                        <defs>
                            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style={{ stopColor: '#06b6d4', stopOpacity: 0.3 }} />
                                <stop offset="100%" style={{ stopColor: '#8b5cf6', stopOpacity: 0.1 }} />
                            </linearGradient>
                        </defs>
                        {[...Array(20)].map((_, i) => (
                            <path
                                key={i}
                                d={`M0 ${300 + i * 15} Q400 ${250 + i * 10} 800 ${300 + i * 15}`}
                                fill="none"
                                stroke="url(#grad1)"
                                strokeWidth="1"
                            />
                        ))}
                    </svg>
                </div>

                {/* Logo */}
                <div className="relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <span className="text-xl">🔐</span>
                        </div>
                        <span className="text-xl font-bold text-white">API Explorer</span>
                    </div>
                </div>

                {/* Quote */}
                <div className="relative z-10">
                    <blockquote className="text-xl text-gray-300 leading-relaxed mb-4">
                        &ldquo;AI-powered safety analysis ensures your API requests are secure, compliant, and risk-aware before execution.&rdquo;
                    </blockquote>
                    <p className="text-sm text-gray-500">— Design principle</p>
                </div>

                {/* Feature badges */}
                <div className="relative z-10 grid grid-cols-2 gap-3">
                    <div className="bg-gray-900/50 border border-gray-800 rounded-lg px-4 py-3">
                        <p className="text-sm text-gray-400">Safety: real-time threat detection</p>
                    </div>
                    <div className="bg-gray-900/50 border border-gray-800 rounded-lg px-4 py-3">
                        <p className="text-sm text-gray-400">Policy: rule-based restrictions</p>
                    </div>
                    <div className="bg-gray-900/50 border border-gray-800 rounded-lg px-4 py-3">
                        <p className="text-sm text-gray-400">AI: Gemini-powered analysis</p>
                    </div>
                    <div className="bg-gray-900/50 border border-gray-800 rounded-lg px-4 py-3">
                        <p className="text-sm text-gray-400">Secure: RLS, auth verification</p>
                    </div>
                </div>
            </div>

            {/* Right side - Form */}
            <div className="w-full lg:w-1/2 bg-gray-900 flex flex-col">
                {/* Header */}
                <div className="p-6">
                    <Link href="/" className="inline-flex items-center text-sm text-gray-400 hover:text-white transition">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Home
                    </Link>
                </div>

                {/* Form Container */}
                <div className="flex-1 flex items-center justify-center px-6 pb-12">
                    <div className="w-full max-w-sm">
                        <div className="mb-8">
                            <h1 className="text-2xl font-bold text-white mb-2">Create your account</h1>
                            <p className="text-gray-400">Join to access AI-powered API safety analysis.</p>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm mb-6">
                                {error}
                            </div>
                        )}

                        {/* Google Button */}
                        <button
                            type="button"
                            onClick={handleGoogleSignIn}
                            disabled={googleLoading}
                            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-cyan-500 text-black font-semibold rounded-lg hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 mb-6"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                            {googleLoading ? 'Signing in...' : 'Continue with Google'}
                        </button>

                        <div className="relative mb-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-700"></div>
                            </div>
                            <div className="relative flex justify-center text-xs">
                                <span className="px-3 bg-gray-900 text-gray-500">Or</span>
                            </div>
                        </div>

                        <p className="text-xs text-gray-500 mb-4">
                            Use your email to create an account (confirmation email required).
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                                    placeholder="your.email@example.com"
                                />
                            </div>

                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full pl-10 pr-12 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                                    placeholder="Create a password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-400"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>

                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="w-full pl-10 pr-12 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                                    placeholder="Confirm password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-400"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 px-4 bg-cyan-500 text-black font-semibold rounded-lg hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            >
                                {loading ? 'Creating account...' : 'Create account'}
                            </button>
                        </form>

                        <p className="mt-6 text-sm text-gray-400">
                            Already have an account?{' '}
                            <Link href="/auth/login" className="text-cyan-400 hover:text-cyan-300 underline">
                                Sign in
                            </Link>
                        </p>

                        <p className="mt-4 text-xs text-gray-600">
                            By continuing, you agree to our{' '}
                            <Link href="#" className="text-gray-500 hover:text-gray-400 underline">Terms of Service</Link>
                            {' '}and{' '}
                            <Link href="#" className="text-gray-500 hover:text-gray-400 underline">Privacy Policy</Link>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
