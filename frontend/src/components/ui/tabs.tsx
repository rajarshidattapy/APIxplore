"use client"

import * as React from "react"

interface TabsContextValue {
    value: string
    onValueChange: (value: string) => void
}

const TabsContext = React.createContext<TabsContextValue | undefined>(undefined)

function Tabs({
    value,
    onValueChange,
    children,
    className = "",
}: {
    value: string
    onValueChange: (value: string) => void
    children: React.ReactNode
    className?: string
}) {
    return (
        <TabsContext.Provider value={{ value, onValueChange }}>
            <div className={className}>{children}</div>
        </TabsContext.Provider>
    )
}

function TabsList({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={`inline-flex h-10 items-center justify-center rounded-md bg-gray-800 p-1 text-gray-400 ${className}`}>
            {children}
        </div>
    )
}

function TabsTrigger({
    value,
    children,
    className = "",
}: {
    value: string
    children: React.ReactNode
    className?: string
}) {
    const context = React.useContext(TabsContext)
    if (!context) throw new Error("TabsTrigger must be used within Tabs")

    const isActive = context.value === value

    return (
        <button
            onClick={() => context.onValueChange(value)}
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none ${isActive
                    ? "bg-gray-900 text-white shadow-sm"
                    : "text-gray-400 hover:text-gray-200"
                } ${className}`}
        >
            {children}
        </button>
    )
}

function TabsContent({
    value,
    children,
    className = "",
}: {
    value: string
    children: React.ReactNode
    className?: string
}) {
    const context = React.useContext(TabsContext)
    if (!context) throw new Error("TabsContent must be used within Tabs")

    if (context.value !== value) return null

    return <div className={className}>{children}</div>
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
