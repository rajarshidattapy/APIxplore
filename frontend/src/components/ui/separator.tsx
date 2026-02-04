import * as React from "react"

function Separator({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={`shrink-0 bg-gray-700 h-[1px] w-full ${className}`}
            {...props}
        />
    )
}

export { Separator }
