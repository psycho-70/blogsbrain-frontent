'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'

export type AIAction = 'greet' | 'tour' | 'find' | 'explore' | 'question' | 'surprise' | null
export type AIMode = 'tour' | 'chat' | null
export type EntranceDirection = 'top' | 'bottom' | 'left' | 'right' | null

interface AIContextType {
  showAI: boolean
  setShowAI: (show: boolean) => void
  currentAction: AIAction
  interactWithAI: (action: AIAction) => void
  mode: AIMode
  setMode: (mode: AIMode) => void
  entranceDirection: EntranceDirection
  setEntranceDirection: (direction: EntranceDirection) => void
  triggerTourFromVideo: () => void
}

const AIContext = createContext<AIContextType | undefined>(undefined)

export function AIProvider({ children }: { children: React.ReactNode }) {
  const [showAI, setShowAI] = useState(false) // Changed to false initially
  const [currentAction, setCurrentAction] = useState<AIAction>(null)
  const [mode, setMode] = useState<AIMode>(null)
  const [entranceDirection, setEntranceDirection] = useState<EntranceDirection>(null)

  const interactWithAI = useCallback((action: AIAction) => {
    setCurrentAction(action)
  }, [])

  const triggerTourFromVideo = useCallback(() => {
    // Random entrance direction
    const directions: EntranceDirection[] = ['top', 'bottom', 'left', 'right']
    const randomDirection = directions[Math.floor(Math.random() * directions.length)]

    setEntranceDirection(randomDirection)
    setMode('tour')
    setShowAI(true)
  }, [])

  return (
    <AIContext.Provider
      value={{
        showAI,
        setShowAI,
        currentAction,
        interactWithAI,
        mode,
        setMode,
        entranceDirection,
        setEntranceDirection,
        triggerTourFromVideo,
      }}
    >
      {children}
    </AIContext.Provider>
  )
}

export function useAI() {
  const ctx = useContext(AIContext)
  if (!ctx) throw new Error('useAI must be used within AIProvider')
  return ctx
}
