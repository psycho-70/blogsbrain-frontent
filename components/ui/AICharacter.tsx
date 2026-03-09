'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAI } from '@/contexts/AIContext'
import { useTour } from '@/contexts/TourContext'
import Typewriter from './Typewriter'
import { einsteineChat } from '@/lib/api'
import Image from 'next/image'
import Link from 'next/link'

const QUICK_ACTION_PROMPTS: Record<string, string> = {
  tour: 'Give me a quick 30-second tour of the platform.',
  find: "I'm looking for specific information. Help me find content for my level.",
  explore: "I'm just exploring. Show me what you have.",
  question: "I have a question about the content or platform.",
  surprise: 'Surprise me with something interesting!',
}

// ---------------------------------------------------------------------------
// Inline renderer: handles **bold**, *italic*, /blogs/slug links, http URLs
// ---------------------------------------------------------------------------
function renderInlineContent(text: string, keyPrefix: string): React.ReactNode[] {
  // Order matters: bold before italic, internal paths before URLs
  const pattern = /(\*\*(.+?)\*\*)|(\*(.+?)\*)|(\/blogs\/[\w-]+)|(https?:\/\/[^\s)]+)/g
  const nodes: React.ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = pattern.exec(text)) !== null) {
    const start = match.index

    // Plain text before this match
    if (start > lastIndex) {
      nodes.push(text.slice(lastIndex, start))
    }

    if (match[1]) {
      // **bold**
      nodes.push(
        <strong key={`${keyPrefix}-b-${start}`} className="font-semibold text-white">
          {match[2]}
        </strong>
      )
    } else if (match[3]) {
      // *italic*
      nodes.push(
        <em key={`${keyPrefix}-i-${start}`} className="italic text-purple-200">
          {match[4]}
        </em>
      )
    } else if (match[5]) {
      // /blogs/slug — internal Next.js link
      const href = match[5]
      nodes.push(
        <Link
          key={`${keyPrefix}-l-${start}`}
          href={href}
          className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 underline underline-offset-2 font-semibold transition-colors cursor-pointer"
        >
          🔗 {href}
        </Link>
      )
    } else if (match[6]) {
      // Full http(s) URL — external link
      const href = match[6]
      nodes.push(
        <a
          key={`${keyPrefix}-a-${start}`}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 underline underline-offset-2 font-semibold transition-colors cursor-pointer"
        >
          🔗 {href}
        </a>
      )
    }

    lastIndex = start + match[0].length
  }

  // Remaining plain text
  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex))
  }

  return nodes.length > 0 ? nodes : [text]
}

// ---------------------------------------------------------------------------
// Full message renderer: handles line-by-line markdown (bullets, blank lines)
// ---------------------------------------------------------------------------
function renderMessageContent(content: string): React.ReactNode {
  const lines = content.split('\n')

  return (
    <div className="space-y-0.5">
      {lines.map((line, lineIdx) => {
        const trimmed = line.trim()

        // Empty line → small gap
        if (trimmed === '') {
          return <div key={lineIdx} className="h-2" />
        }

        // Bullet line: starts with "- "
        if (trimmed.startsWith('- ')) {
          const bulletText = trimmed.slice(2)
          return (
            <div key={lineIdx} className="flex items-start gap-2 my-0.5">
              <span className="mt-0.5 text-purple-400 flex-shrink-0 font-bold">•</span>
              <span className="flex-1 flex flex-wrap gap-x-1 items-baseline leading-snug">
                {renderInlineContent(bulletText, String(lineIdx))}
              </span>
            </div>
          )
        }

        // Regular line
        return (
          <div key={lineIdx} className="leading-snug">
            {renderInlineContent(line, String(lineIdx))}
          </div>
        )
      })}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
const AICharacter = () => {
  const { showAI, mode, setMode, entranceDirection, setShowAI } = useAI()
  const { isTourActive, currentStep, nextStep, skipTour, currentStepIndex, startTour, isLastStep } = useTour()
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [greetingShown, setGreetingShown] = useState(false)
  const [tourMessageComplete, setTourMessageComplete] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const autoAdvanceTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Start tour when mode changes to 'tour'
  useEffect(() => {
    if (mode === 'tour' && entranceDirection && !isTourActive) {
      startTour(entranceDirection)
    }
  }, [mode, entranceDirection, isTourActive, startTour])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Reset tour message complete when step changes and clear any pending auto-advance
  useEffect(() => {
    setTourMessageComplete(false)
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current)
      autoAdvanceTimerRef.current = null
    }
  }, [currentStepIndex])

  // Auto-advance to next step or open chat after typewriter completes
  useEffect(() => {
    if (tourMessageComplete && mode === 'tour') {
      autoAdvanceTimerRef.current = setTimeout(() => {
        if (isLastStep) {
          handleOpenChat()
        } else {
          nextStep()
        }
      }, 2000)
    }
    return () => {
      if (autoAdvanceTimerRef.current) {
        clearTimeout(autoAdvanceTimerRef.current)
      }
    }
  }, [tourMessageComplete, mode, nextStep, isLastStep])

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return
    const userMsg = text.trim()
    setInput('')
    setError(null)
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }])
    setIsLoading(true)

    try {
      const chatHistory = messages.map((m) => ({ role: m.role, content: m.content }))
      const response = await einsteineChat({
        message: userMsg,
        chat_history: chatHistory,
      })
      setMessages((prev) => [...prev, { role: 'assistant', content: response }])
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to get response'
      setError(msg)
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: "I'm having trouble connecting right now. Please check your connection and try again." },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickAction = (actionId: string) => {
    const prompt = QUICK_ACTION_PROMPTS[actionId]
    if (prompt) sendMessage(prompt)
  }

  const handleOpenChat = () => {
    setMode('chat')
    skipTour()
    setMessages([
      { role: 'assistant', content: "Great! I'm here to help. What would you like to know?" }
    ])
  }

  const handleContinueTour = () => {
    nextStep()
  }

  const quickActions = [
    { id: 'tour', label: 'Show me around', icon: '🚀' },
    { id: 'find', label: 'Find content', icon: '📚' },
    { id: 'explore', label: 'Explore', icon: '✨' },
    { id: 'question', label: 'Ask question', icon: '💭' },
    { id: 'surprise', label: 'Surprise me!', icon: '🤖' },
  ]

  // Get entrance animation variants based on direction
  const getEntranceVariants = () => {
    const baseDistance = 500
    switch (entranceDirection) {
      case 'top':
        return {
          initial: { opacity: 0, y: -baseDistance, x: 0 },
          animate: { opacity: 1, y: 0, x: 0 },
          exit: { opacity: 0, y: -baseDistance, x: 0 }
        }
      case 'bottom':
        return {
          initial: { opacity: 0, y: baseDistance, x: 0 },
          animate: { opacity: 1, y: 0, x: 0 },
          exit: { opacity: 0, y: baseDistance, x: 0 }
        }
      case 'left':
        return {
          initial: { opacity: 0, x: -baseDistance, y: 0 },
          animate: { opacity: 1, x: 0, y: 0 },
          exit: { opacity: 0, x: -baseDistance, y: 0 }
        }
      case 'right':
        return {
          initial: { opacity: 0, x: baseDistance, y: 0 },
          animate: { opacity: 1, x: 0, y: 0 },
          exit: { opacity: 0, x: baseDistance, y: 0 }
        }
      default:
        return {
          initial: { opacity: 0, scale: 0.5 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.5 }
        }
    }
  }

  const variants = getEntranceVariants()

  // Tour Mode UI
  if (mode === 'tour' && currentStep) {
    return (
      <AnimatePresence>
        {showAI && (
          <motion.div
            initial={variants.initial}
            animate={variants.animate}
            exit={variants.exit}
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 120,
              duration: 0.8
            }}
            className="fixed bottom-10 right-10 z-50"
          >
            <div className="relative">
              {/* Robot Character */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="relative"
              >
                <div className="w-40 h-40 relative">
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-blue-500/30 rounded-full blur-2xl animate-pulse" />

                  {/* Robot Image */}
                  <Image
                    src="/robot3.png"
                    alt="Einsteine AI Guide"
                    width={120}
                    height={160}
                    className="relative z-10 drop-shadow-2xl"
                    priority
                  />

                  {/* Chat Button on Robot */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleOpenChat}
                    className="absolute top-0  left-2 -translate-x-1/2 w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white/30 hover:border-white/60 transition-all z-20"
                    title="Open Chat"
                  >
                    <span className="text-xl">💬</span>
                  </motion.button>
                </div>

                {/* ── Premium Speech Bubble ── */}
                <motion.div
                  key={currentStepIndex}
                  initial={{ opacity: 0, x: 20, scale: 0.92 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -20, scale: 0.92 }}
                  transition={{ type: 'spring', damping: 22, stiffness: 180, delay: 0.2 }}
                  className="absolute top-1/2 -translate-y-1/2 -left-[340px] w-80"
                  style={{ filter: 'drop-shadow(0 0 18px rgba(139,92,246,0.35))' }}
                >
                  {/* Gradient border wrapper */}
                  <div
                    className="relative rounded-2xl p-[1.5px]"
                    style={{ background: 'linear-gradient(135deg, #a855f7 0%, #3b82f6 50%, #a855f7 100%)' }}
                  >
                    {/* Inner card */}
                    <div className="relative rounded-2xl bg-[#0d0d1a]/95 backdrop-blur-2xl overflow-hidden">

                      {/* Top accent bar */}
                      <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #a855f7, #3b82f6, #a855f7)' }} />

                      {/* Header row: icon + step badge */}
                      <div className="flex items-center justify-between px-4 pt-3 pb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🤖</span>
                          <span
                            className="text-xs font-bold tracking-widest uppercase"
                            style={{ background: 'linear-gradient(90deg,#c084fc,#60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                          >
                            Einsteine
                          </span>
                        </div>
                        {/* Step counter pill */}
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border border-purple-500/40 text-purple-300 bg-purple-900/30">
                          Step {currentStepIndex + 1}
                        </span>
                      </div>

                      {/* Divider */}
                      <div className="mx-4 border-t border-purple-500/20 mb-3" />

                      {/* Message body */}
                      <div
                        className="mx-4 mb-3 px-3 py-3 rounded-xl text-sm leading-relaxed text-gray-100 font-medium"
                        style={{ background: 'rgba(139,92,246,0.07)', border: '1px solid rgba(139,92,246,0.18)' }}
                      >
                        <Typewriter
                          text={currentStep.message}
                          speed={28}
                          onComplete={() => setTourMessageComplete(true)}
                        />
                      </div>

                      {/* Action buttons */}
                      <AnimatePresence>
                        {tourMessageComplete && (
                          <motion.div
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 6 }}
                            transition={{ duration: 0.25 }}
                            className="flex items-center justify-between gap-2 px-4 pb-4"
                          >
                            {/* Skip button */}
                            <button
                              onClick={() => { skipTour(); setMode(null); setShowAI(false) }}
                              className="text-xs text-gray-400 hover:text-red-400 transition-colors underline underline-offset-2"
                            >
                              Skip Tour
                            </button>

                            {/* Next / Finish button */}
                            <motion.button
                              whileHover={{ scale: 1.04 }}
                              whileTap={{ scale: 0.96 }}
                              onClick={isLastStep ? handleOpenChat : handleContinueTour}
                              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold text-white shadow-lg transition-all"
                              style={{ background: 'linear-gradient(90deg, #a855f7, #3b82f6)' }}
                            >
                              {isLastStep ? '🚀 Start Chat' : 'Next →'}
                            </motion.button>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Typing indicator while message is still typing */}
                      <AnimatePresence>
                        {!tourMessageComplete && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-1.5 px-4 pb-3 text-purple-400"
                          >
                            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" />
                            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.12s' }} />
                            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.24s' }} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Arrow pointing right toward the robot */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 -right-2 w-4 h-4 rotate-45"
                    style={{ background: '#0d0d1a', border: '1.5px solid #a855f7', borderLeft: 'none', borderTop: 'none' }}
                  />
                </motion.div>
              </motion.div>

              {/* Close (X) Button */}
              <motion.button
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 0.75, scale: 1 }}
                whileHover={{ opacity: 1, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => { skipTour(); setMode(null); setShowAI(false) }}
                className="absolute -top-2 -right-2 w-8 h-8 bg-gray-800/90 hover:bg-red-600 rounded-full flex items-center justify-center text-xs text-white transition-all border border-gray-600/60 shadow-lg z-50 cursor-pointer"
                title="Close Tour"
              >
                ✕
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    )
  }

  // Chat Mode UI
  return (
    <AnimatePresence>
      {showAI && mode === 'chat' && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-6 right-6 z-50 w-[400px] max-w-[calc(100vw-2rem)]"
        >
          <div className="relative">
            <div className="bg-gray-800/90 backdrop-blur-xl rounded-2xl border border-purple-500/30 shadow-2xl neon-glow overflow-hidden">
              {/* Header */}
              <div className="p-4 border-b border-purple-500/30 bg-gradient-to-r from-purple-900/30 to-blue-900/30">
                <div className="flex items-center space-x-3">
                  <div className="relative w-12 h-12">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-pulse" />
                    <div className="absolute inset-1 bg-gray-800 rounded-full flex items-center justify-center">
                      <span className="text-2xl">🤖</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold neon-text">Einsteine</h3>
                    <p className="text-sm text-purple-300">Your Intelligent Guide</p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="h-72 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 && !greetingShown && (
                  <div className="mb-4">
                    <p className="text-lg mb-2">
                      <Typewriter
                        text="Salam/Hello! I'm Einsteine. I can give you a quick tour — or help you find what you need."
                        onComplete={() => setGreetingShown(true)}
                      />
                    </p>
                  </div>
                )}
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[88%] p-3 rounded-xl text-sm ${msg.role === 'user'
                        ? 'bg-purple-600/50 text-white'
                        : 'bg-purple-900/30 border border-purple-500/30 text-gray-100'
                        }`}
                    >
                      {msg.role === 'assistant'
                        ? renderMessageContent(msg.content)
                        : msg.content
                      }
                    </div>
                  </div>
                ))}
                {error && (
                  <p className="text-red-400 text-xs">{error}</p>
                )}
                {isLoading && (
                  <div className="flex items-center gap-2 text-purple-300">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                    <span className="text-sm">Thinking...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Actions */}
              <div className="px-4 pb-2">
                <div className="flex flex-wrap gap-2">
                  {quickActions.map((action) => (
                    <motion.button
                      key={action.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleQuickAction(action.id)}
                      disabled={isLoading}
                      className="px-3 py-1.5 text-xs bg-gray-700/50 hover:bg-purple-700/30 rounded-lg border border-purple-500/20 transition-all"
                    >
                      {action.icon} {action.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Input */}
              <div className="p-4 border-t border-purple-500/30">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    sendMessage(input)
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask Einsteine..."
                    className="flex-1 bg-gray-700/50 border border-purple-500/30 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
                  >
                    Send
                  </button>
                </form>
              </div>

              {/* Footer */}
              <div className="px-4 py-2 border-t border-purple-500/30 bg-gray-900/50 flex justify-between items-center">
                <span className="text-xs text-purple-300">AI-Powered</span>
                <button
                  onClick={() => setMode(null)}
                  className="text-xs text-gray-400 hover:text-white transition-colors"
                >
                  Hide
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
      {/* Floating Toggle Button - Visible when AI is inactive */}
      {(!showAI || !mode) && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1, y: -5 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            setShowAI(true)
            setMode('chat')
          }}
          className="fixed bottom-25 right-6 z-50 w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(147,51,234,0.5)] border-2 border-white/20 hover:border-white/40 transition-all group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-pulse opacity-50 group-hover:opacity-100" />
          <span className="text-3xl relative z-10">🤖</span>

          {/* Tooltip */}
          <div className="absolute right-full mr-4 px-3 py-1 bg-gray-900/90 text-white text-xs rounded-lg border border-purple-500/30 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Chat with Einsteine
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  )
}

export default AICharacter
