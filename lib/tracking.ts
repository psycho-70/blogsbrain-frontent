'use client'

/**
 * Utility for tracking user interactions and page views
 */

const API_BASE = '/api/tracking'

export const trackPageView = async (pageUrl: string, referrer?: string) => {
    try {
        const visitorId = getVisitorId()
        await fetch(`${API_BASE}/activity`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                visitorId,
                pageUrl,
                referrer: referrer || document.referrer || 'direct',
            }),
        })
    } catch (error) {
        console.error('Failed to track page view:', error)
    }
}

export const trackLead = async (leadData: { name?: string; email: string; interests?: string; source: string }) => {
    try {
        await fetch(`${API_BASE}/leads`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(leadData),
        })
    } catch (error) {
        console.error('Failed to capture lead:', error)
    }
}

export const trackCTAClick = async (buttonId: string) => {
    try {
        await fetch('/api/cta/click', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ buttonId }),
        })
    } catch (error) {
        console.error('Failed to track CTA click:', error)
    }
}

// Visitor ID management
const getVisitorId = () => {
    if (typeof window === 'undefined') return 'anonymous'
    let vId = localStorage.getItem('einsteine_v_id')
    if (!vId) {
        vId = crypto.randomUUID()
        localStorage.setItem('einsteine_v_id', vId)
    }
    return vId
}

// Personalization tracking (simple category-based)
export const trackInterest = (category: string) => {
    if (typeof window === 'undefined') return
    const currentInterests = JSON.parse(localStorage.getItem('einsteine_interests') || '{}')
    currentInterests[category] = (currentInterests[category] || 0) + 1
    localStorage.setItem('einsteine_interests', JSON.stringify(currentInterests))
}

export const getTopInterests = () => {
    if (typeof window === 'undefined') return []
    const interests = JSON.parse(localStorage.getItem('einsteine_interests') || '{}')
    return Object.entries(interests)
        .sort(([, a], [, b]) => (b as number) - (a as number))
        .map(([name]) => name)
        .slice(0, 3)
}
