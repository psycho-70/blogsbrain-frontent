'use client'

import { useTheme } from '@/contexts/ThemeContext'
import { useEffect } from 'react'

export default function ThemeBodyWrapper({ children }: { children: React.ReactNode }) {
    const { theme } = useTheme()

    // Apply theme class to <html> element
    useEffect(() => {
        const root = document.documentElement
        root.classList.remove('light', 'dark')
        root.classList.add(theme)
    }, [theme])

    return (
        <div
            data-theme={theme}
            className={`min-h-screen bg-fixed overflow-x-hidden transition-colors duration-500 ${theme === 'dark'
                    ? 'bg-gradient-to-br from-gray-900 via-black to-purple-900 text-white'
                    : 'bg-gradient-to-br from-slate-50 via-white to-purple-50 text-gray-900'
                }`}
        >
            {children}
        </div>
    )
}
