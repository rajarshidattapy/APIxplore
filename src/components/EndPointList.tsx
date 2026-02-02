"use client"
export default function EndPointList({ endpoints = [] }: { endpoints?: string[] }) {
    return (
        <div className="card p-4">
            <h4 className="text-lg font-semibold">Endpoints</h4>
            <ul className="mt-2">
                {endpoints.map((e: string) => <li key={e} className="py-1">{e}</li>)}
            </ul>
        </div>
    )
}