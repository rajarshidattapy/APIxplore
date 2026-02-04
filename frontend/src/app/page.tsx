"use client";

import Link from 'next/link';
import { useAuthContext } from '@/components/AuthProvider';
import { Zap } from 'lucide-react';

export default function Home() {
  const { isAuthenticated, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden">
      {/* Particle/Wave Background */}
      <div className="absolute inset-0 overflow-hidden">
        <svg className="absolute w-full h-full opacity-40" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#06b6d4', stopOpacity: 0.3 }} />
              <stop offset="50%" style={{ stopColor: '#8b5cf6', stopOpacity: 0.2 }} />
              <stop offset="100%" style={{ stopColor: '#06b6d4', stopOpacity: 0.1 }} />
            </linearGradient>
          </defs>
          {/* Wave lines */}
          {[...Array(40)].map((_, i) => (
            <path
              key={i}
              d={`M0 ${350 + i * 8} Q300 ${300 + Math.sin(i * 0.5) * 80} 600 ${350 + i * 8} T1200 ${350 + i * 8}`}
              fill="none"
              stroke="url(#waveGrad)"
              strokeWidth="1.5"
              opacity={0.3 + (i % 5) * 0.1}
            />
          ))}
          {/* Dots pattern */}
          {[...Array(100)].map((_, i) => (
            <circle
              key={`dot-${i}`}
              cx={Math.random() * 1200}
              cy={300 + Math.random() * 300}
              r={1 + Math.random() * 2}
              fill="#fff"
              opacity={0.1 + Math.random() * 0.2}
            />
          ))}
        </svg>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 lg:px-12 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-sm">🔐</span>
          </div>
          <span className="text-lg font-semibold text-white">API Explorer</span>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <Link
              href="/explorer"
              className="px-5 py-2 bg-cyan-500 text-black font-medium rounded-lg hover:bg-cyan-400 transition"
            >
              Open Explorer
            </Link>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-gray-300 hover:text-white transition font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="px-5 py-2 bg-cyan-500 text-black font-medium rounded-lg hover:bg-cyan-400 transition"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-6 text-center">
        {/* Trust Badge */}
        <div className="flex items-center gap-2 mb-8 px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-full">
          <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-400">Trusted by developers worldwide</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Policy-Aware{' '}
          <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-purple-500 bg-clip-text text-transparent">
            AI
          </span>{' '}
          <span className="block md:inline">API Explorer</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-12 leading-relaxed">
          Get instant access to API safety analysis, threat detection, and
          policy-aware restrictions. Built for developers who need secure
          API exploration fast.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            href={isAuthenticated ? "/explorer" : "/auth/signup"}
            className="px-8 py-3 bg-white text-gray-900 font-semibold rounded-full hover:bg-gray-100 transition shadow-lg shadow-white/10"
          >
            Get Started
          </Link>
          <Link
            href="/auth/login"
            className="text-gray-300 hover:text-white transition font-medium flex items-center gap-2"
          >
            <Zap className="w-4 h-4" />
            Try the Explorer
          </Link>
        </div>

        {/* Feature Pills */}
        <div className="mt-20 flex flex-wrap justify-center gap-4">
          <div className="px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-lg text-sm text-gray-400">
            🛡️ Real-time threat detection
          </div>
          <div className="px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-lg text-sm text-gray-400">
            🤖 Gemini AI-powered analysis
          </div>
          <div className="px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-lg text-sm text-gray-400">
            🔒 Policy-aware restrictions
          </div>
          <div className="px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-lg text-sm text-gray-400">
            ⚡ Instant risk scoring
          </div>
        </div>
      </main>

      {/* Gradient overlay at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-950 to-transparent pointer-events-none"></div>
    </div>
  );
}
