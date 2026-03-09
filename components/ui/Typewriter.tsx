'use client'

import { useState, useEffect, useRef } from 'react'

interface TypewriterProps {
  text: string
  speed?: number
  onComplete?: () => void
  className?: string
}

export default function Typewriter({ text, speed = 30, onComplete, className = '' }: TypewriterProps) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  const [isFlashing, setIsFlashing] = useState(false)

  // Use a ref for onComplete to avoid resetting the effect if the callback identity changess
  const onCompleteRef = useRef(onComplete)
  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    setDisplayed('')
    setDone(false)
    setIsFlashing(false)
    let i = 0
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1))
        i++
        // Trigger flash effect on certain characters
        if (i % 3 === 0) {
          setIsFlashing(true)
          setTimeout(() => setIsFlashing(false), 100)
        }
      } else {
        clearInterval(timer)
        setDone(true)
        if (onCompleteRef.current) onCompleteRef.current()
      }
    }, speed)
    return () => clearInterval(timer)
  }, [text, speed]) // Removed onComplete from dependency

  return (
    <span className={`relative ${className}`}>
      {/* Main text */}
      <span className="relative z-10 text-white">
        {displayed}
      </span>

      {/* Reduced glow effects for better readability */}
      {isFlashing && (
        <span className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/20 to-purple-500/0 blur-lg opacity-30 transition-opacity duration-100" />
      )}

      {/* Pulsing glow behind text */}
      <span className="absolute inset-0 bg-gradient-to-r from-blue-400/5 via-purple-400/5 to-pink-400/5 blur-xl animate-pulse" />

      {/* Cursor with enhanced glow */}
      {!done && (
        <span className="inline-block w-[2px] h-8 ml-0.5 bg-gradient-to-b from-white via-purple-200 to-pink-200 typewriter-cursor relative">
          <span className="absolute inset-0 bg-white blur-sm opacity-70" />
          <span className="absolute inset-0 bg-gradient-to-b from-blue-400 via-purple-400 to-pink-400 blur-md opacity-50" />
        </span>
      )}
    </span>
  )
}