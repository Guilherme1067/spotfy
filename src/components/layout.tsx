import { ReactNode } from "react"

interface LayoutProps {
    children: ReactNode
}

export const Layout = ({ children }: LayoutProps) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-6 animate-show">
            <div className="max-w-7xl mx-auto">
                {children}
            </div>
        </div>
    )
} 