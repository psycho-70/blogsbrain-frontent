'use client'

import { useState, useEffect, useRef } from 'react'

interface TypewriterProps {
  text: string
  speed?: number
  onComplete?: () => void
  className?: string
}

export default function Typewriter({ text, speed = 60, onComplete, className = '' }: TypewriterProps) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  // Stable ref for the callback so we don't restart the effect
  const onCompleteRef = useRef(onComplete)
  useEffect(() => { onCompleteRef.current = onComplete }, [onComplete])

  useEffect(() => {
    setDisplayed('')
    setDone(false)
    let i = 0
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1))
        i++
      } else {
        clearInterval(timer)
        setDone(true)
        onCompleteRef.current?.()
      }
    }, speed)
    return () => clearInterval(timer)
  }, [text, speed])

  return (
    <span className={`relative inline-block ${className}`}>
      {/* Visible text */}
      <span className="relative z-10 text-white">{displayed}</span>

      {/* Subtle static glow — no per-character flash */}
      <span
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.08), transparent)',
          filter: 'blur(12px)',
        }}
      />

      {/* Blinking cursor */}
      {!done && (
        <span
          className="inline-block align-middle ml-[2px]"
          style={{
            width: 2,
            height: '0.85em',
            background: 'linear-gradient(to bottom, #fff, #c084fc)',
            borderRadius: 2,
            animation: 'tw-blink 1s step-start infinite',
            boxShadow: '0 0 6px rgba(192,132,252,0.7)',
          }}
        />
      )}

      <style>{`
        @keyframes tw-blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
      `}</style>
    </span>
  )
}