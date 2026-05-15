import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ConditionalLayout from '@/components/layout/ConditionalLayout'
import ThemeBodyWrapper from '@/components/layout/ThemeBodyWrapper'
import AICharacter from '@/components/ui/AICharacter'
import CustomCursor from '@/components/ui/CustomCursor'
import { AIProvider } from '@/contexts/AIContext'
import { TourProvider } from '@/contexts/TourContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import MetaTracking from '@/components/analytics/MetaTracking'
import { Suspense } from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Einsteine AI - Next-Level Interactive Blogging Platform',
  description: 'Experience AI-powered interactive blogging with Einsteine, your intelligent AI companion',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${inter.className} overflow-x-hidden`}>
        <ThemeProvider>
          <ThemeBodyWrapper>
            <Suspense fallback={null}>
              <MetaTracking />
            </Suspense>
            <AIProvider>
              <TourProvider>
                <CustomCursor />
                <div className="relative z-10">
                  <ConditionalLayout>{children}</ConditionalLayout>
                </div>
                <AICharacter />
              </TourProvider>
            </AIProvider>
          </ThemeBodyWrapper>
        </ThemeProvider>
      </body>
    </html>
  )
}