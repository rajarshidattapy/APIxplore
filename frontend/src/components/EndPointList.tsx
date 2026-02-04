"use client";

import { Cloud, CreditCard, Shield, Trash2, User, FileText, Lock, AlertTriangle } from 'lucide-react';

interface Endpoint {
    path: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    description?: string;
    category?: 'safe' | 'sensitive' | 'dangerous';
}

interface EndpointListProps {
    endpoints?: Endpoint[];
    selectedEndpoint?: Endpoint | null;
    onSelect?: (endpoint: Endpoint) => void;
}

const methodColors: Record<string, string> = {
    GET: 'bg-green-500/20 text-green-400 border-green-500/30',
    POST: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    PUT: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    DELETE: 'bg-red-500/20 text-red-400 border-red-500/30',
    PATCH: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
};

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    safe: Cloud,
    sensitive: Lock,
    dangerous: AlertTriangle,
};

const categoryColors: Record<string, string> = {
    safe: 'text-green-400',
    sensitive: 'text-yellow-400',
    dangerous: 'text-red-400',
};

// Demo endpoints to showcase different safety levels
const defaultEndpoints: Endpoint[] = [
    // Safe APIs - Full UI
    { path: '/api/weather', method: 'GET', description: 'Get current weather data', category: 'safe' },
    { path: '/api/posts', method: 'GET', description: 'List all blog posts', category: 'safe' },
    { path: '/api/products', method: 'GET', description: 'Browse product catalog', category: 'safe' },

    // Sensitive APIs - Restricted UI
    { path: '/api/auth/login', method: 'POST', description: 'User authentication', category: 'sensitive' },
    { path: '/api/users/profile', method: 'PUT', description: 'Update user profile', category: 'sensitive' },
    { path: '/api/payments', method: 'POST', description: 'Process payment with card', category: 'sensitive' },
    { path: '/api/transfer-funds', method: 'POST', description: 'Bank transfer request', category: 'sensitive' },

    // Dangerous APIs - Blocked UI
    { path: '/admin/users', method: 'DELETE', description: 'Delete all users (ADMIN)', category: 'dangerous' },
    { path: '/admin/database/drop', method: 'DELETE', description: 'Drop database tables', category: 'dangerous' },
    { path: '/api/execute-code', method: 'POST', description: 'Execute arbitrary code', category: 'dangerous' },
];

export default function EndpointList({
    endpoints = defaultEndpoints,
    selectedEndpoint,
    onSelect
}: EndpointListProps) {
    // Group endpoints by category
    const safeEndpoints = endpoints.filter(e => e.category === 'safe');
    const sensitiveEndpoints = endpoints.filter(e => e.category === 'sensitive');
    const dangerousEndpoints = endpoints.filter(e => e.category === 'dangerous');

    const renderEndpoint = (endpoint: Endpoint, idx: number) => {
        const isSelected = selectedEndpoint?.path === endpoint.path &&
            selectedEndpoint?.method === endpoint.method;
        const CategoryIcon = categoryIcons[endpoint.category || 'safe'];

        return (
            <button
                key={`${endpoint.method}-${endpoint.path}-${idx}`}
                onClick={() => onSelect?.(endpoint)}
                className={`w-full p-3 text-left transition-all hover:bg-gray-800/50 ${isSelected ? 'bg-cyan-500/10 border-l-2 border-cyan-500' : 'border-l-2 border-transparent'
                    }`}
            >
                <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 text-xs font-bold rounded border ${methodColors[endpoint.method]}`}>
                        {endpoint.method}
                    </span>
                    <span className="text-white font-mono text-sm truncate flex-1">{endpoint.path}</span>
                    {CategoryIcon && (
                        <CategoryIcon className={`w-4 h-4 ${categoryColors[endpoint.category || 'safe']}`} />
                    )}
                </div>
                {endpoint.description && (
                    <p className="text-gray-500 text-xs mt-1 ml-12 truncate">{endpoint.description}</p>
                )}
            </button>
        );
    };

    return (
        <div className="bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden">
            <div className="p-4 border-b border-gray-800">
                <h3 className="text-lg font-semibold text-white">API Endpoints</h3>
                <p className="text-sm text-gray-400 mt-1">Select an endpoint to explore</p>
            </div>

            <div className="max-h-[600px] overflow-y-auto">
                {/* Safe APIs */}
                {safeEndpoints.length > 0 && (
                    <div>
                        <div className="px-4 py-2 bg-green-500/5 border-b border-gray-800 flex items-center gap-2">
                            <Cloud className="w-4 h-4 text-green-400" />
                            <span className="text-xs font-medium text-green-400 uppercase tracking-wide">Safe APIs</span>
                        </div>
                        <div className="divide-y divide-gray-800/50">
                            {safeEndpoints.map((endpoint, idx) => renderEndpoint(endpoint, idx))}
                        </div>
                    </div>
                )}

                {/* Sensitive APIs */}
                {sensitiveEndpoints.length > 0 && (
                    <div>
                        <div className="px-4 py-2 bg-yellow-500/5 border-y border-gray-800 flex items-center gap-2">
                            <Lock className="w-4 h-4 text-yellow-400" />
                            <span className="text-xs font-medium text-yellow-400 uppercase tracking-wide">Sensitive APIs</span>
                        </div>
                        <div className="divide-y divide-gray-800/50">
                            {sensitiveEndpoints.map((endpoint, idx) => renderEndpoint(endpoint, idx))}
                        </div>
                    </div>
                )}

                {/* Dangerous APIs */}
                {dangerousEndpoints.length > 0 && (
                    <div>
                        <div className="px-4 py-2 bg-red-500/5 border-y border-gray-800 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-400" />
                            <span className="text-xs font-medium text-red-400 uppercase tracking-wide">Dangerous APIs</span>
                        </div>
                        <div className="divide-y divide-gray-800/50">
                            {dangerousEndpoints.map((endpoint, idx) => renderEndpoint(endpoint, idx))}
                        </div>
                    </div>
                )}
            </div>

            {/* Legend */}
            <div className="p-3 border-t border-gray-800 bg-gray-900/30">
                <div className="flex items-center justify-around text-xs">
                    <span className="flex items-center gap-1 text-green-400">
                        <Cloud className="w-3 h-3" /> Safe
                    </span>
                    <span className="flex items-center gap-1 text-yellow-400">
                        <Lock className="w-3 h-3" /> Sensitive
                    </span>
                    <span className="flex items-center gap-1 text-red-400">
                        <AlertTriangle className="w-3 h-3" /> Dangerous
                    </span>
                </div>
            </div>
        </div>
    );
}

export type { Endpoint };