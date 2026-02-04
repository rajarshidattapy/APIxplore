"use client";

interface ResponseViewerProps {
    data: unknown;
    statusCode?: number;
    loading?: boolean;
}

export default function ResponseViewer({ data, statusCode, loading }: ResponseViewerProps) {
    if (loading) {
        return (
            <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
                <div className="p-4 border-b border-gray-700">
                    <h3 className="text-lg font-semibold text-white">Response</h3>
                </div>
                <div className="p-8 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                </div>
            </div>
        );
    }

    const getStatusColor = (code?: number) => {
        if (!code) return 'text-gray-400';
        if (code >= 200 && code < 300) return 'text-green-400';
        if (code >= 400 && code < 500) return 'text-yellow-400';
        if (code >= 500) return 'text-red-400';
        return 'text-blue-400';
    };

    return (
        <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">Response</h3>
                {statusCode && (
                    <span className={`font-mono font-bold ${getStatusColor(statusCode)}`}>
                        {statusCode}
                    </span>
                )}
            </div>

            <div className="p-4">
                {data ? (
                    <div className="relative">
                        <pre className="bg-gray-900 rounded-lg p-4 overflow-auto max-h-[400px] text-sm font-mono text-gray-300 whitespace-pre-wrap">
                            {typeof data === 'string' ? data : JSON.stringify(data, null, 2)}
                        </pre>
                        <button
                            onClick={() => navigator.clipboard.writeText(
                                typeof data === 'string' ? data : JSON.stringify(data, null, 2)
                            )}
                            className="absolute top-2 right-2 p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-300 transition-colors"
                            title="Copy to clipboard"
                        >
                            📋
                        </button>
                    </div>
                ) : (
                    <p className="text-gray-400 text-center py-8">
                        No response yet. Send a request to see results.
                    </p>
                )}
            </div>
        </div>
    );
}