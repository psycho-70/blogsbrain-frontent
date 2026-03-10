'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

const TIER_1_COUNTRIES = [
    'US', 'GB', 'CA', 'AU', 'NZ', 'IE',
    'DE', 'FR', 'IT', 'ES', 'NL',
    'SE', 'CH', 'NO', 'DK', 'FI'
]

export default function Tier1Guard({ children }: { children: React.ReactNode }) {
    const [isAllowed, setIsAllowed] = useState<boolean | null>(null)

    useEffect(() => {
        async function checkLocation() {
            try {
                const apiKey = process.env.NEXT_PUBLIC_IPLOCATE_API_KEY 
                const baseUrl = process.env.NEXT_PUBLIC_IPLOCATE_API_URL
                const url = `${baseUrl}?apikey=${apiKey}`

                const response = await fetch(url)
                const data = await response.json()

                const countryCode = data.country_code
                console.log("Frontend Detected country:", countryCode, "IP:", data.ip)

                // In browsers connecting to localhost, IP is 127.0.0.1 and countryCode is null
                if (!countryCode) {
                    console.log("Local development environment detected (no country code). Allowing access.")
                    setIsAllowed(true)
                    return
                }

                if (TIER_1_COUNTRIES.includes(countryCode)) {
                    setIsAllowed(true)
                } else {
                    setIsAllowed(false)
                }
            } catch (error) {
                console.error("Geolocation API error frontend:", error)
                // Default to true so we don't block users if the API service goes down temporarily
                setIsAllowed(true)
            }
        }

        checkLocation()
    }, [])

    if (isAllowed === null) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center bg-transparent mt-20">
                <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <p className="mt-4 text-purple-300 font-medium animate-pulse">Checking regional availability...</p>
            </div>
        )
    }

    if (!isAllowed) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center bg-transparent px-4 text-center mt-20">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: 'spring', damping: 20 }}
                    className="bg-gray-900/80 backdrop-blur-xl border border-gray-700 p-8 md:p-12 rounded-2xl shadow-2xl max-w-lg w-full relative overflow-hidden"
                >
                    {/* Decorative gradients */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500"></div>
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-500/10 rounded-full blur-2xl"></div>

                    <div className="text-6xl mb-6 relative z-10">🌍</div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-4 relative z-10">Region Restricted</h1>
                    <p className="text-gray-400 mb-8 leading-relaxed relative z-10 text-lg">
                        We're sorry, but viewing our blog content is exclusively available to users located in Tier 1 countries at this time.
                    </p>
                    <div className="relative z-10">
                        <Link href="/" className="inline-block px-8 py-3 bg-gray-800 border border-gray-600 text-white rounded-xl hover:bg-gray-700 hover:border-gray-500 transition-all font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                            Return to Home
                        </Link>
                    </div>
                </motion.div>
            </div>
        )
    }

    return <>{children}</>
}
