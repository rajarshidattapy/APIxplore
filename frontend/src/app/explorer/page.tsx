"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import EndpointList, { Endpoint } from '@/components/EndPointList';
import RequestBuilder, { RequestConfig } from '@/components/RequestBuilder';
import ResponseViewer from '@/components/ResponseViewer';
import SafetyInspector from '@/components/SafetyInspector';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuthContext } from '@/components/AuthProvider';
import { analyzeAndPlan, SafetyVerdict, UIPlan } from '@/services/api';
import { Shield, AlertTriangle, Lock, Zap } from 'lucide-react';

export default function ExplorerPage() {
    const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint | null>(null);
    const [verdict, setVerdict] = useState<SafetyVerdict | null>(null);
    const [uiPlan, setUiPlan] = useState<UIPlan | null>(null);
    const [response, setResponse] = useState<unknown>(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [sending, setSending] = useState(false);
    const { user, signOut } = useAuthContext();
    const router = useRouter();

    const handleAnalyze = async (request: RequestConfig) => {
        setAnalyzing(true);
        setVerdict(null);
        setUiPlan(null);

        try {
            // Use combined analyze and plan function
            const result = await analyzeAndPlan(
                {
                    endpoint: selectedEndpoint?.path || '',
                    method: request.method,
                },
                `User wants to ${selectedEndpoint?.description || 'make an API call'}`
            );

            setVerdict(result.verdict);
            setUiPlan(result.uiPlan);

            console.log('Safety Verdict:', result.verdict);
            console.log('UI Plan:', result.uiPlan);
        } catch (error) {
            console.error('Analysis failed:', error);
            setVerdict({
                urgency: false,
                threat: false,
                sensitive_request: true,
                explanation: 'Failed to analyze request. Please try again.',
            });
            setUiPlan({
                components: ['EndpointList', 'SafetyInspector'],
                restrictions: { execute_requests: false },
                warnings: ['Analysis failed - restricted mode enabled'],
            });
        } finally {
            setAnalyzing(false);
        }
    };

    const handleSend = async (request: RequestConfig) => {
        // Check UI plan restrictions
        if (uiPlan?.restrictions?.execute_requests === false) {
            alert('⛔ Execution is blocked for this request due to safety restrictions.');
            return;
        }

        // Check if there's a safety verdict and it's high risk
        if (verdict?.threat) {
            if (!confirm('⚠️ This request has been flagged as potentially dangerous. Are you sure you want to proceed?')) {
                return;
            }
        }

        setSending(true);
        try {
            const res = await fetch(request.url, {
                method: request.method,
                headers: request.headers,
                body: request.method !== 'GET' ? request.body : undefined,
            });
            const data = await res.json().catch(() => res.text());
            setResponse({ status: res.status, data });
        } catch (error) {
            setResponse({ error: String(error) });
        } finally {
            setSending(false);
        }
    };

    const handleLogout = async () => {
        await signOut();
        router.push('/auth/login');
    };

    // Determine if execute is allowed based on UI plan
    const canExecute = uiPlan?.restrictions?.execute_requests !== false;
    const isBlocked = verdict?.threat === true;
    const isSensitive = verdict?.sensitive_request === true;

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-950">
                {/* Header */}
                <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <Shield className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white">API Explorer</h1>
                                <p className="text-xs text-gray-400">Policy-Aware Security Analysis</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-gray-400 text-sm">{user?.email}</span>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm border border-gray-700"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </header>

                {/* Threat Warning Banner */}
                {isBlocked && (
                    <div className="bg-red-500/10 border-b border-red-500/30 px-4 py-3">
                        <div className="max-w-7xl mx-auto flex items-center gap-3">
                            <AlertTriangle className="w-5 h-5 text-red-400" />
                            <span className="text-red-400 font-medium">
                                ⚠️ Threat Detected: Execution has been blocked for this API request
                            </span>
                        </div>
                    </div>
                )}

                {/* Sensitive Data Warning Banner */}
                {isSensitive && !isBlocked && (
                    <div className="bg-yellow-500/10 border-b border-yellow-500/30 px-4 py-3">
                        <div className="max-w-7xl mx-auto flex items-center gap-3">
                            <Lock className="w-5 h-5 text-yellow-400" />
                            <span className="text-yellow-400 font-medium">
                                🔒 Sensitive Data: This API handles sensitive information - proceed with caution
                            </span>
                        </div>
                    </div>
                )}

                {/* UI Plan Warnings */}
                {uiPlan?.warnings && uiPlan.warnings.length > 0 && (
                    <div className="bg-orange-500/10 border-b border-orange-500/30 px-4 py-3">
                        <div className="max-w-7xl mx-auto">
                            {uiPlan.warnings.map((warning, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <Zap className="w-4 h-4 text-orange-400" />
                                    <span className="text-orange-400 text-sm">{warning}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Main Content */}
                <main className="max-w-7xl mx-auto px-4 py-6">
                    <div className="grid grid-cols-12 gap-6">
                        {/* Left Sidebar - Endpoints */}
                        <div className="col-span-3">
                            <EndpointList
                                selectedEndpoint={selectedEndpoint}
                                onSelect={(endpoint) => {
                                    setSelectedEndpoint(endpoint);
                                    setVerdict(null);
                                    setUiPlan(null);
                                    setResponse(null);
                                }}
                            />
                        </div>

                        {/* Center - Request Builder */}
                        <div className="col-span-5 space-y-6">
                            <RequestBuilder
                                endpoint={selectedEndpoint}
                                onAnalyze={handleAnalyze}
                                onSend={handleSend}
                                disabled={analyzing || sending}
                                restrictions={uiPlan?.restrictions}
                                isBlocked={isBlocked}
                            />
                            <ResponseViewer
                                data={response}
                                loading={sending}
                            />
                        </div>

                        {/* Right Sidebar - Safety Analysis */}
                        <div className="col-span-4">
                            <SafetyInspector
                                verdict={verdict}
                                uiPlan={uiPlan}
                                loading={analyzing}
                            />
                        </div>
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}
