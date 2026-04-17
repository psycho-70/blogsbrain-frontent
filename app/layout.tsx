import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ConditionalLayout from '@/components/layout/ConditionalLayout'
// import ParticleBackground from '@/components/ui/ParticleBackground'
import AICharacter from '@/components/ui/AICharacter'
import CustomCursor from '@/components/ui/CustomCursor'
import { AIProvider } from '@/contexts/AIContext'
import { TourProvider } from '@/contexts/TourContext'

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
      <body suppressHydrationWarning className={`${inter.className} min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 bg-fixed text-white overflow-x-hidden`}>
        <AIProvider>
          <TourProvider>
            <CustomCursor />
            {/* <ParticleBackground /> */}
            <div className="relative z-10">
              <ConditionalLayout>{children}</ConditionalLayout>
            </div>
            <AICharacter />
          </TourProvider>
        </AIProvider>
      </body>
    </html>
  )
}