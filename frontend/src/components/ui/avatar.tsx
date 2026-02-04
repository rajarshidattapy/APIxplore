import * as React from "react"

function Avatar({ className = "", children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`}
            {...props}
        >
            {children}
        </div>
    )
}

function AvatarImage({ src, alt = "", className = "" }: { src?: string; alt?: string; className?: string }) {
    if (!src) return null
    return (
        <img
            src={src}
            alt={alt}
            className={`aspect-square h-full w-full object-cover ${className}`}
        />
    )
}

function AvatarFallback({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={`flex h-full w-full items-center justify-center rounded-full bg-gray-700 text-gray-200 ${className}`}>
            {children}
        </div>
    )
}

export { Avatar, AvatarImage, AvatarFallback }
