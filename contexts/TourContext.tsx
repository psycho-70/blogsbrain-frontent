'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

export type TourStep = {
    id: string
    message: string
    page?: string // Optional page to navigate to
    section?: string // Optional section ID to scroll to
    position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center'
}

interface TourContextType {
    isTourActive: boolean
    currentStepIndex: number
    currentStep: TourStep | null
    startTour: (entranceDirection: 'top' | 'bottom' | 'left' | 'right') => void
    nextStep: () => void
    skipTour: () => void
    completeTour: () => void
    entranceDirection: 'top' | 'bottom' | 'left' | 'right' | null
    isLastStep: boolean
}

const TourContext = createContext<TourContextType | undefined>(undefined)

// Tour steps configuration
const TOUR_STEPS: TourStep[] = [
    {
        id: 'welcome',
        message: "Salam! 👋 I'm Einsteine, your AI guide. Let me show you around this amazing platform!",
        position: 'center'
    },
    {
        id: 'hero-section',
        message: "Welcome to the home page! This is where your learning journey begins. Let me scroll down to show you more...",
        position: 'center',
        section: 'hero'
    },
    {
        id: 'features-section',
        message: "Here are the amazing features we offer - AI-powered learning, personalized content, and much more!",
        position: 'center',
        section: 'features'
    },
    {
        id: 'home-bottom',
        message: "Let me scroll to the bottom to show you everything on the home page...",
        position: 'center',
        section: 'footer'
    },
    {
        id: 'blogs-intro',
        message: "Now let's explore our blog section where you'll find amazing content!",
        page: '/blogs',
        position: 'center'
    },
    {
        id: 'blogs-content',
        message: "Here you can browse all our blog posts, filter by categories, and search for topics that interest you!",
        position: 'center'
    },
    {
        id: 'about-intro',
        message: "Let me take you to the About Us page to learn more about our mission!",
        page: '/aboutus',
        position: 'center'
    },
    {
        id: 'about-content',
        message: "This is where you can learn about our team, our vision, and what makes us unique!",
        position: 'center'
    },
    {
        id: 'contact-intro',
        message: "Finally, let's visit the Contact Us page!",
        page: '/contactus',
        position: 'center'
    },
    {
        id: 'contact-content',
        message: "Here you can reach out to us anytime! We're always happy to help.",
        position: 'center'
    },
    {
        id: 'tour-complete',
        message: "That's the complete tour! 🎉 Click the chat button on my head anytime you need help. Enjoy exploring!",
        position: 'center'
    }
]

export function TourProvider({ children }: { children: React.ReactNode }) {
    const [isTourActive, setIsTourActive] = useState(false)
    const [currentStepIndex, setCurrentStepIndex] = useState(0)
    const [entranceDirection, setEntranceDirection] = useState<'top' | 'bottom' | 'left' | 'right' | null>(null)
    const router = useRouter()

    const currentStep = isTourActive && currentStepIndex < TOUR_STEPS.length
        ? TOUR_STEPS[currentStepIndex]
        : null

    const startTour = useCallback((direction: 'top' | 'bottom' | 'left' | 'right') => {
        setEntranceDirection(direction)
        setIsTourActive(true)
        setCurrentStepIndex(0)
    }, [])

    const nextStep = useCallback(() => {
        if (currentStepIndex < TOUR_STEPS.length - 1) {
            const nextStepIndex = currentStepIndex + 1
            const nextStep = TOUR_STEPS[nextStepIndex]

            // Navigate to page if specified
            if (nextStep.page) {
                router.push(nextStep.page)
            }

            // Scroll to section if specified
            if (nextStep.section) {
                setTimeout(() => {
                    const element = document.getElementById(nextStep.section!)
                    element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                }, 300)
            }

            setCurrentStepIndex(nextStepIndex)
        } else {
            completeTour()
        }
    }, [currentStepIndex, router])

    const skipTour = useCallback(() => {
        setIsTourActive(false)
        setCurrentStepIndex(0)
        setEntranceDirection(null)
    }, [])

    const completeTour = useCallback(() => {
        setIsTourActive(false)
        setCurrentStepIndex(0)
        // Keep entrance direction for smooth exit animation
        setTimeout(() => setEntranceDirection(null), 1000)
    }, [])

    const isLastStep = currentStepIndex === TOUR_STEPS.length - 1

    return (
        <TourContext.Provider
            value={{
                isTourActive,
                currentStepIndex,
                currentStep,
                startTour,
                nextStep,
                skipTour,
                completeTour,
                entranceDirection,
                isLastStep,
            }}
        >
            {children}
        </TourContext.Provider>
    )
}

export function useTour() {
    const ctx = useContext(TourContext)
    if (!ctx) throw new Error('useTour must be used within TourProvider')
    return ctx
}
