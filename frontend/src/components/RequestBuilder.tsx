"use client";

import { useState } from "react";
import { Endpoint } from "./EndPointList";
import { Lock, Send, Search, AlertOctagon } from "lucide-react";

interface RequestBuilderProps {
    endpoint?: Endpoint | null;
    onAnalyze?: (request: RequestConfig) => void;
    onSend?: (request: RequestConfig) => void;
    disabled?: boolean;
    restrictions?: {
        execute_requests?: boolean;
        editable_fields?: string[];
        [key: string]: unknown;
    };
    isBlocked?: boolean;
}

export interface RequestConfig {
    method: string;
    url: string;
    headers: Record<string, string>;
    body: string;
}

export default function RequestBuilder({
    endpoint,
    onAnalyze,
    onSend,
    disabled = false,
    restrictions,
    isBlocked = false,
}: RequestBuilderProps) {
    const [headers, setHeaders] = useState<string>('{\n  "Content-Type": "application/json"\n}');
    const [body, setBody] = useState<string>('{\n  \n}');
    const [baseUrl, setBaseUrl] = useState('https://api.example.com');

    const buildRequest = (): RequestConfig => ({
        method: endpoint?.method || 'GET',
        url: `${baseUrl}${endpoint?.path || ''}`,
        headers: JSON.parse(headers || '{}'),
        body: body,
    });

    // Check if execution is allowed
    const canExecute = restrictions?.execute_requests !== false && !isBlocked;

    return (
        <div className="bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden">
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Request Builder</h3>
                {isBlocked && (
                    <span className="flex items-center gap-1.5 px-2.5 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">
                        <AlertOctagon className="w-3.5 h-3.5" />
                        Execution Blocked
                    </span>
                )}
                {!canExecute && !isBlocked && (
                    <span className="flex items-center gap-1.5 px-2.5 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
                        <Lock className="w-3.5 h-3.5" />
                        Read-Only Mode
                    </span>
                )}
            </div>

            <div className="p-4 space-y-4">
                {/* URL Bar */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Base URL</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={baseUrl}
                            onChange={(e) => setBaseUrl(e.target.value)}
                            className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            placeholder="https://api.example.com"
                        />
                    </div>
                </div>

                {/* Selected Endpoint */}
                {endpoint && (
                    <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                        <span className={`px-2 py-0.5 text-xs font-bold rounded mr-2 ${endpoint.method === 'GET' ? 'bg-green-500/20 text-green-400' :
                                endpoint.method === 'POST' ? 'bg-blue-500/20 text-blue-400' :
                                    endpoint.method === 'DELETE' ? 'bg-red-500/20 text-red-400' :
                                        'bg-yellow-500/20 text-yellow-400'
                            }`}>
                            {endpoint.method}
                        </span>
                        <span className="text-white font-mono text-sm">{endpoint.path}</span>
                    </div>
                )}

                {/* Headers */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Headers (JSON)</label>
                    <textarea
                        value={headers}
                        onChange={(e) => setHeaders(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                    />
                </div>

                {/* Body */}
                {endpoint?.method !== 'GET' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Request Body (JSON)</label>
                        <textarea
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            rows={6}
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                        />
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                    <button
                        onClick={() => onAnalyze?.(buildRequest())}
                        disabled={!endpoint || disabled}
                        className="flex-1 py-2.5 px-4 bg-gradient-to-r from-cyan-600 to-cyan-500 text-white font-medium rounded-lg hover:from-cyan-500 hover:to-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                    >
                        <Search className="w-4 h-4" />
                        Analyze Safety
                    </button>

                    {/* Conditionally render Send button based on restrictions */}
                    {canExecute ? (
                        <button
                            onClick={() => onSend?.(buildRequest())}
                            disabled={!endpoint || disabled}
                            className="flex-1 py-2.5 px-4 bg-gray-700 text-white font-medium rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                        >
                            <Send className="w-4 h-4" />
                            Send Request
                        </button>
                    ) : (
                        <button
                            disabled
                            className="flex-1 py-2.5 px-4 bg-gray-800 text-gray-500 font-medium rounded-lg cursor-not-allowed flex items-center justify-center gap-2 border border-gray-700"
                            title={isBlocked ? "Execution blocked due to threat detection" : "Execution restricted by safety policy"}
                        >
                            <Lock className="w-4 h-4" />
                            {isBlocked ? 'Blocked' : 'Restricted'}
                        </button>
                    )}
                </div>

                {/* Restriction Notice */}
                {!canExecute && (
                    <div className={`text-xs p-3 rounded-lg ${isBlocked ? 'bg-red-500/10 text-red-400 border border-red-500/30' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'}`}>
                        {isBlocked ? (
                            <>
                                <strong>⛔ Execution Blocked:</strong> This API has been flagged as potentially dangerous.
                                The execute button has been disabled to prevent unsafe operations.
                            </>
                        ) : (
                            <>
                                <strong>🔒 Restricted Mode:</strong> This API handles sensitive data.
                                Review the safety analysis before proceeding.
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}