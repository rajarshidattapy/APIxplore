"use client";
import { useState } from "react";

export default function RequestBuilder({ onSend }: { onSend?: (url: string) => void }) {
    const [url, setUrl] = useState("");
    return (
        <>
            <h4 className="text-lg font-semibold">Request Builder</h4>
            <input className="mt-2 p-2 border" placeholder="https://api.example.com/..." value={url} onChange={e => setUrl(e.target.value)} />
            <button className="mt-2 btn" onClick={() => onSend?.(url)}>Send</button>
        </>
    )
}