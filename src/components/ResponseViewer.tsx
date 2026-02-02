"use client";
export default function ResponseViewer({ data }: { data: any }) {
    return (
        <div className="card p-4">
            <h4 className="text-lg font-semibold">Response</h4>
            <pre className="mt-2 text-sm overflow-auto max-h-64">{JSON.stringify(data, null, 2)}</pre>
        </div>
    )
}