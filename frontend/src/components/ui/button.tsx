import * as React from "react"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "ghost" | "outline" | "secondary"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className = "", variant = "default", ...props }, ref) => {
        const variants = {
            default: "bg-cyan-500 text-black hover:bg-cyan-400",
            ghost: "hover:bg-gray-800 text-gray-300",
            outline: "border border-gray-600 hover:bg-gray-800",
            secondary: "bg-gray-700 hover:bg-gray-600 text-white",
        }

        return (
            <button
                className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 disabled:pointer-events-none disabled:opacity-50 px-4 py-2 ${variants[variant]} ${className}`}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }
