"use client";

import { SafetyVerdict, UIPlan } from '@/services/api';
import { Shield, AlertTriangle, Lock, Zap, CheckCircle, XCircle, Eye, EyeOff } from 'lucide-react';

interface SafetyInspectorProps {
    verdict: SafetyVerdict | null;
    uiPlan?: UIPlan | null;
    loading?: boolean;
}

export default function SafetyInspector({ verdict, uiPlan, loading }: SafetyInspectorProps) {
    if (loading) {
        return (
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
                <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-cyan-500"></div>
                    <span className="text-gray-300">Analyzing request safety...</span>
                </div>
            </div>
        );
    }

    if (!verdict) {
        return (
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
                <div className="text-center py-8">
                    <Shield className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400">
                        Select an endpoint and click &quot;Analyze Safety&quot; to see the security analysis
                    </p>
                </div>
            </div>
        );
    }

    const getRiskLevel = () => {
        if (verdict.threat) return {
            label: 'HIGH RISK',
            color: 'red',
            bg: 'bg-red-500/10',
            border: 'border-red-500/30',
            icon: XCircle
        };
        if (verdict.sensitive_request) return {
            label: 'SENSITIVE',
            color: 'yellow',
            bg: 'bg-yellow-500/10',
            border: 'border-yellow-500/30',
            icon: Lock
        };
        if (verdict.urgency) return {
            label: 'CAUTION',
            color: 'orange',
            bg: 'bg-orange-500/10',
            border: 'border-orange-500/30',
            icon: AlertTriangle
        };
        return {
            label: 'SAFE',
            color: 'green',
            bg: 'bg-green-500/10',
            border: 'border-green-500/30',
            icon: CheckCircle
        };
    };

    const risk = getRiskLevel();
    const RiskIcon = risk.icon;

    return (
        <div className="space-y-4">
            {/* Safety Verdict Card */}
            <div className={`rounded-xl p-6 border ${risk.bg} ${risk.border}`}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        Safety Analysis
                    </h3>
                    <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase ${risk.bg} text-${risk.color}-400`}>
                        <RiskIcon className="w-3.5 h-3.5" />
                        {risk.label}
                    </span>
                </div>

                {/* Risk Score */}
                {verdict.risk_score !== undefined && (
                    <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-400">Risk Score</span>
                            <span className="text-white font-medium">{verdict.risk_score}/10</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-2">
                            <div
                                className={`h-2 rounded-full transition-all duration-500 ${verdict.risk_score >= 7 ? 'bg-red-500' :
                                        verdict.risk_score >= 4 ? 'bg-yellow-500' : 'bg-green-500'
                                    }`}
                                style={{ width: `${verdict.risk_score * 10}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Flags */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {verdict.urgency && (
                        <span className="flex items-center gap-1 px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-full">
                            <Zap className="w-3 h-3" />
                            Urgency Detected
                        </span>
                    )}
                    {verdict.threat && (
                        <span className="flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">
                            <AlertTriangle className="w-3 h-3" />
                            Threat Detected
                        </span>
                    )}
                    {verdict.sensitive_request && (
                        <span className="flex items-center gap-1 px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
                            <Lock className="w-3 h-3" />
                            Sensitive Data
                        </span>
                    )}
                    {!verdict.urgency && !verdict.threat && !verdict.sensitive_request && (
                        <span className="flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                            <CheckCircle className="w-3 h-3" />
                            No Issues Found
                        </span>
                    )}
                </div>

                {/* Explanation */}
                <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Analysis</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        {verdict.explanation}
                    </p>
                </div>

                {/* Recommendations */}
                {verdict.recommendations && verdict.recommendations.length > 0 && (
                    <div>
                        <h4 className="text-sm font-medium text-gray-300 mb-2">Recommendations</h4>
                        <ul className="space-y-1">
                            {verdict.recommendations.map((rec, idx) => (
                                <li key={idx} className="text-sm text-gray-400 flex items-start gap-2">
                                    <span className="text-cyan-400 mt-1">•</span>
                                    {rec}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* UI Plan Card */}
            {uiPlan && (
                <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Eye className="w-5 h-5" />
                        UI Policy
                    </h3>

                    {/* Components */}
                    <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-300 mb-2">Allowed Components</h4>
                        <div className="flex flex-wrap gap-2">
                            {uiPlan.components.map((component, idx) => (
                                <span key={idx} className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded-lg border border-gray-700">
                                    {component}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Restrictions */}
                    <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-300 mb-2">Restrictions</h4>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-400">Execute Requests</span>
                                {uiPlan.restrictions.execute_requests !== false ? (
                                    <span className="flex items-center gap-1 text-green-400">
                                        <Eye className="w-4 h-4" />
                                        Allowed
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1 text-red-400">
                                        <EyeOff className="w-4 h-4" />
                                        Blocked
                                    </span>
                                )}
                            </div>
                            {uiPlan.restrictions.editable_fields && (
                                <div className="text-sm">
                                    <span className="text-gray-400">Editable Fields: </span>
                                    <span className="text-gray-300">
                                        {uiPlan.restrictions.editable_fields.length > 0
                                            ? uiPlan.restrictions.editable_fields.join(', ')
                                            : 'None'
                                        }
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Warnings */}
                    {uiPlan.warnings && uiPlan.warnings.length > 0 && (
                        <div>
                            <h4 className="text-sm font-medium text-gray-300 mb-2">Warnings</h4>
                            <ul className="space-y-1">
                                {uiPlan.warnings.map((warning, idx) => (
                                    <li key={idx} className="text-sm text-orange-400 flex items-start gap-2">
                                        <AlertTriangle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                                        {warning}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
