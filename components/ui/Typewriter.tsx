'use client'

import { useState, useEffect, useRef } from 'react'
import { useTheme } from '@/contexts/ThemeContext'

interface TypewriterProps {
  text: string
  speed?: number
  onComplete?: () => void
  className?: string
}

export default function Typewriter({ text, speed = 60, onComplete, className = '' }: TypewriterProps) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  const { isDark } = useTheme()

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
      <span
        className="relative z-10"
        style={{
          color: isDark ? 'white' : 'transparent',
          backgroundImage: isDark
            ? 'none'
            : 'linear-gradient(135deg, #7c3aed 0%, #2563eb 50%, #7c3aed 100%)',
          WebkitBackgroundClip: isDark ? 'unset' : 'text',
          backgroundClip: isDark ? 'unset' : 'text',
        }}
      >
        {displayed}
      </span>

      {/* Subtle glow behind text */}
      <span
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isDark
            ? 'linear-gradient(90deg, transparent, rgba(168,85,247,0.08), transparent)'
            : 'linear-gradient(90deg, transparent, rgba(124,58,237,0.05), transparent)',
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
            background: isDark
              ? 'linear-gradient(to bottom, #fff, #c084fc)'
              : 'linear-gradient(to bottom, #7c3aed, #2563eb)',
            borderRadius: 2,
            animation: 'tw-blink 1s step-start infinite',
            boxShadow: isDark
              ? '0 0 6px rgba(192,132,252,0.7)'
              : '0 0 6px rgba(124,58,237,0.5)',
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