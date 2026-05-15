'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { trackPageView } from '@/lib/tracking'
import Script from 'next/script'

declare global {
    interface Window {
        gtag: (command: string, id: string, config?: any) => void;
        dataLayer: any[];
    }
}

const GA_ID = 'G-XXXXXXXXXX' // System set placeholder

export default function MetaTracking() {
    const pathname = usePathname()
    const searchParams = useSearchParams()

    useEffect(() => {
        if (pathname) {
            const url = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`

            // 1. Backend tracking
            trackPageView(url)

            // 2. Google Analytics tracking (if window.gtag exists)
            if (typeof window.gtag === 'function') {
                window.gtag('config', GA_ID, {
                    page_path: url,
                })
            }
        }
    }, [pathname, searchParams])

    return (
        <>
            {/* Google Analytics Global Base */}
            <Script
                strategy="afterInteractive"
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            />
            <Script
                id="google-analytics"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', '${GA_ID}', {
                            page_path: window.location.pathname,
                        });
                    `,
                }}
            />
        </>
    )
}
