'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'framer-motion'
import { useAI } from '@/contexts/AIContext'
import { useTour } from '@/contexts/TourContext'
import Typewriter from './Typewriter'
import { einsteineChat } from '@/lib/api'
import Image from 'next/image'
import Link from 'next/link'
import AnimatedRobot from './AnimatedRobot'
import { getTopInterests, trackLead } from '@/lib/tracking'
import { useTheme } from '@/contexts/ThemeContext'
import { X, Send, MessageCircle, Minimize2, Maximize2 } from 'lucide-react'

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
  const pattern = /(\*\*(.+?)\*\*)|(\*(.+?)\*)|(\/blogs\/[\w-]+)|(https?:\/\/[^\s)]+)/g
  const nodes: React.ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = pattern.exec(text)) !== null) {
    const start = match.index

    if (start > lastIndex) {
      nodes.push(text.slice(lastIndex, start))
    }

    if (match[1]) {
      nodes.push(
        <strong key={`${keyPrefix}-b-${start}`} className="font-semibold">
          {match[2]}
        </strong>
      )
    } else if (match[3]) {
      nodes.push(
        <em key={`${keyPrefix}-i-${start}`} className="italic">
          {match[4]}
        </em>
      )
    } else if (match[5]) {
      const href = match[5]
      nodes.push(
        <Link
          key={`${keyPrefix}-l-${start}`}
          href={href}
          className="inline-flex items-center gap-1 text-blue-500 hover:text-blue-400 underline underline-offset-2 font-semibold transition-colors cursor-pointer"
        >
          🔗 {href}
        </Link>
      )
    } else if (match[6]) {
      const href = match[6]
      nodes.push(
        <a
          key={`${keyPrefix}-a-${start}`}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-blue-500 hover:text-blue-400 underline underline-offset-2 font-semibold transition-colors cursor-pointer"
        >
          🔗 {href}
        </a>
      )
    }

    lastIndex = start + match[0].length
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex))
  }

  return nodes.length > 0 ? nodes : [text]
}

// ---------------------------------------------------------------------------
// Full message renderer: handles line-by-line markdown (bullets, blank lines)
// ---------------------------------------------------------------------------
function renderMessageContent(content: string, isDark: boolean): React.ReactNode {
  const lines = content.split('\n')

  return (
    <div className="space-y-0.5">
      {lines.map((line, lineIdx) => {
        const trimmed = line.trim()

        if (trimmed === '') {
          return <div key={lineIdx} className="h-2" />
        }

        if (trimmed.startsWith('- ')) {
          const bulletText = trimmed.slice(2)
          return (
            <div key={lineIdx} className="flex items-start gap-2 my-0.5">
              <span className={`mt-0.5 flex-shrink-0 font-bold ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>•</span>
              <span className="flex-1 flex flex-wrap gap-x-1 items-baseline leading-snug">
                {renderInlineContent(bulletText, String(lineIdx))}
              </span>
            </div>
          )
        }

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
  const { isDark } = useTheme()
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [greetingShown, setGreetingShown] = useState(false)
  const [tourMessageComplete, setTourMessageComplete] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 })
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const autoAdvanceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const buttonRef = useRef<HTMLDivElement>(null)

  // Draggable button constraints
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Start tour when mode changes to 'tour'
  useEffect(() => {
    if (mode === 'tour' && entranceDirection && !isTourActive) {
      startTour(entranceDirection)
    }
  }, [mode, entranceDirection, isTourActive, startTour])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Reset tour message complete when step changes
  useEffect(() => {
    setTourMessageComplete(false)
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current)
      autoAdvanceTimerRef.current = null
    }
  }, [currentStepIndex])

  // Auto-advance to next step
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

    const emailMatch = userMsg.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)
    if (emailMatch) {
      trackLead({
        email: emailMatch[0],
        interests: getTopInterests().join(', '),
        source: 'chatbot'
      })
    }

    try {
      const chatHistory = messages.map((m) => ({ role: m.role, content: m.content }))
      const interests = getTopInterests()

      const response = await einsteineChat({
        message: userMsg,
        chat_history: chatHistory,
        landing_context: interests.length > 0
          ? `User is interested in: ${interests.join(', ')}`
          : 'First-time visitor',
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

  const handleDragEnd = (_event: any, info: any) => {
    setIsDragging(false)
    const newX = x.get()
    const newY = y.get()
    setButtonPosition({ x: newX, y: newY })
    localStorage.setItem('einsteine-button-pos', JSON.stringify({ x: newX, y: newY }))
  }

  // Load saved position
  useEffect(() => {
    const saved = localStorage.getItem('einsteine-button-pos')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (typeof parsed.x === 'number' && typeof parsed.y === 'number') {
          x.set(parsed.x)
          y.set(parsed.y)
          setButtonPosition(parsed)
        }
      } catch (e) {
        console.error("Failed to load position", e)
      }
    }
  }, [x, y])

  const quickActions = [
    { id: 'tour', label: 'Show me around', icon: '🚀' },
    { id: 'find', label: 'Find content', icon: '📚' },
    { id: 'explore', label: 'Explore', icon: '✨' },
    { id: 'question', label: 'Ask question', icon: '💭' },
    { id: 'surprise', label: 'Surprise me!', icon: '🤖' },
  ]

  // Theme-aware styles
  const chatBg = isDark
    ? 'bg-gray-800/90 backdrop-blur-xl border-purple-500/30'
    : 'bg-white/95 backdrop-blur-xl border-purple-300/50 shadow-xl'
  const headerBg = isDark
    ? 'bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-purple-500/30'
    : 'bg-gradient-to-r from-purple-100/80 to-blue-100/80 border-purple-300/50'
  const messageUserBg = isDark ? 'bg-purple-600/50 text-white' : 'bg-purple-500 text-white'
  const messageAssistantBg = isDark
    ? 'bg-purple-900/30 border-purple-500/30 text-gray-100'
    : 'bg-purple-50 border-purple-200 text-gray-800'
  const inputBg = isDark
    ? 'bg-gray-700/50 border-purple-500/30 focus:ring-purple-500/50 text-white'
    : 'bg-gray-100/80 border-purple-300/50 focus:ring-purple-500/30 text-gray-900'
  const quickActionBg = isDark
    ? 'bg-gray-700/50 hover:bg-purple-700/30 border-purple-500/20'
    : 'bg-gray-200/70 hover:bg-purple-100 border-purple-300/30 text-gray-700'

  // Get entrance animation variants
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
            className="fixed bottom-4 right-4 md:bottom-10 md:right-10 z-50"
          >
            <div className="relative flex flex-col items-end md:block">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="relative"
              >
                <div className="w-40 h-40 relative">
                  <div className={`absolute inset-0 bg-gradient-to-r from-purple-500/30 to-blue-500/30 rounded-full blur-2xl animate-pulse ${!isDark && 'opacity-50'}`} />
                  <AnimatedRobot mode="auto" size={150} />

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleOpenChat}
                    className={`absolute top-0 left-2 -translate-x-1/2 w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg border-2 transition-all z-20 ${isDark ? 'border-white/30 hover:border-white/60' : 'border-white/60 hover:border-white'}`}
                    title="Open Chat"
                  >
                    <MessageCircle size={18} className="text-white" />
                  </motion.button>
                </div>

                {/* Speech Bubble */}
                <motion.div
                  key={currentStepIndex}
                  initial={{ opacity: 0, x: 20, scale: 0.92 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -20, scale: 0.92 }}
                  transition={{ type: 'spring', damping: 22, stiffness: 180, delay: 0.2 }}
                  className="absolute bottom-full right-0 mb-4 md:mb-0 md:top-1/2 md:-translate-y-1/2 md:-left-[340px] md:bottom-auto md:right-auto w-[calc(100vw-2rem)] max-w-[320px] md:w-80"
                  style={{ filter: `drop-shadow(0 0 18px ${isDark ? 'rgba(139,92,246,0.35)' : 'rgba(139,92,246,0.2)'})` }}
                >
                  <div
                    className="relative rounded-2xl p-[1.5px]"
                    style={{ background: 'linear-gradient(135deg, #a855f7 0%, #3b82f6 50%, #a855f7 100%)' }}
                  >
                    <div className={`relative rounded-2xl overflow-hidden ${isDark ? 'bg-[#0d0d1a]/95 backdrop-blur-2xl' : 'bg-white/95 backdrop-blur-2xl'}`}>
                      <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #a855f7, #3b82f6, #a855f7)' }} />

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
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${isDark ? 'border-purple-500/40 text-purple-300 bg-purple-900/30' : 'border-purple-400/60 text-purple-600 bg-purple-100'}`}>
                          Step {currentStepIndex + 1}
                        </span>
                      </div>

                      <div className="mx-4 border-t border-purple-500/20 mb-3" />

                      <div
                        className={`mx-4 mb-3 px-3 py-3 rounded-xl text-sm leading-relaxed font-medium ${isDark ? 'text-gray-100 bg-purple-500/10 border-purple-500/20' : 'text-gray-800 bg-purple-100/50 border-purple-300/40'}`}
                        style={{ border: '1px solid' }}
                      >
                        <Typewriter
                          text={currentStep.message}
                          speed={28}
                          onComplete={() => setTourMessageComplete(true)}
                        />
                      </div>

                      <AnimatePresence>
                        {tourMessageComplete && (
                          <motion.div
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 6 }}
                            transition={{ duration: 0.25 }}
                            className="flex items-center justify-between gap-2 px-4 pb-4"
                          >
                            <button
                              onClick={() => { skipTour(); setMode(null); setShowAI(false) }}
                              className={`text-xs transition-colors underline underline-offset-2 ${isDark ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-600'}`}
                            >
                              Skip Tour
                            </button>
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

                  <div
                    className="absolute hidden md:block top-1/2 -translate-y-1/2 -right-2 w-4 h-4 rotate-45"
                    style={{ background: isDark ? '#0d0d1a' : '#fff', border: `1.5px solid #a855f7`, borderLeft: 'none', borderTop: 'none' }}
                  />
                  <div
                    className="absolute md:hidden -bottom-2 right-[60px] w-4 h-4 rotate-45"
                    style={{ background: isDark ? '#0d0d1a' : '#fff', border: `1.5px solid #a855f7`, borderLeft: 'none', borderTop: 'none' }}
                  />
                </motion.div>
              </motion.div>

              <motion.button
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 0.75, scale: 1 }}
                whileHover={{ opacity: 1, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => { skipTour(); setMode(null); setShowAI(false) }}
                className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-xs transition-all shadow-lg z-50 cursor-pointer ${isDark ? 'bg-gray-800/90 hover:bg-red-600 border-gray-600/60' : 'bg-gray-200 hover:bg-red-500 border-gray-300'}`}
                title="Close Tour"
              >
                <X size={14} />
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
          className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[60] w-[400px] max-w-[calc(100vw-2rem)]"
        >
          <div className="relative">
            <div className={`rounded-2xl border shadow-2xl overflow-hidden transition-all duration-300 ${chatBg}`}>
              {/* Header */}
              <div className={`p-4 border-b ${headerBg}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative w-12 h-12">
                      <img src="/robot3.png" width={40} height={40} alt="Einsteine" />
                    </div>
                    <div>
                      <h3 className={`text-xl font-bold ${isDark ? 'neon-text' : 'text-purple-800'}`}>Einsteine</h3>
                      <p className={`text-sm ${isDark ? 'text-purple-300' : 'text-purple-600'}`}>Your Intelligent Guide</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setMode(null)}
                    className={`p-1 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                  >
                    <Minimize2 size={18} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="h-72 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 && !greetingShown && (
                  <div className="mb-4">
                    <p className={`text-lg mb-2 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
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
                      className={`max-w-[88%] p-3 rounded-xl text-sm ${msg.role === 'user' ? messageUserBg : messageAssistantBg}`}
                    >
                      {msg.role === 'assistant'
                        ? renderMessageContent(msg.content, isDark)
                        : msg.content
                      }
                    </div>
                  </div>
                ))}
                {error && (
                  <p className="text-red-400 text-xs">{error}</p>
                )}
                {isLoading && (
                  <div className={`flex items-center gap-2 ${isDark ? 'text-purple-300' : 'text-purple-600'}`}>
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
                      className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${quickActionBg}`}
                    >
                      {action.icon} {action.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Input */}
              <div className={`p-4 border-t ${isDark ? 'border-purple-500/30' : 'border-purple-300/30'}`}>
                <form onSubmit={(e) => { e.preventDefault(); sendMessage(input) }} className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask Einsteine..."
                    className={`flex-1 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 transition-all ${inputBg}`}
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg text-sm font-medium text-white hover:opacity-90 disabled:opacity-50 transition-opacity"
                  >
                    <Send size={16} />
                  </button>
                </form>
              </div>

              {/* Footer */}
              <div className={`px-4 py-2 border-t flex justify-between items-center ${isDark ? 'bg-gray-900/50 border-purple-500/30' : 'bg-gray-100/50 border-purple-300/30'}`}>
                <span className={`text-xs ${isDark ? 'text-purple-300' : 'text-purple-600'}`}>AI-Powered</span>
                <button
                  onClick={() => setMode(null)}
                  className={`text-xs transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  Hide
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Draggable Floating Toggle Button */}
      {(!showAI || !mode) && (
        <motion.div
          ref={buttonRef}
          drag
          dragMomentum={false}
          dragElastic={0.1}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={handleDragEnd}
          style={{ x, y }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            if (!isDragging) {
              setShowAI(true)
              setMode('chat')
            }
          }}
          className="fixed bottom-6 right-4 md:bottom-12 md:right-10 z-[60] cursor-grab active:cursor-grabbing"
        >
          <div className="relative w-14 h-14 md:w-16 md:h-16">
            {/* Pulse ring animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full animate-ping opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full animate-pulse opacity-50" />

            {/* Main button */}
            <div className="relative w-full h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(147,51,234,0.5)] border-2 border-white/20 hover:border-white/40 transition-all group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <img src="/robot3.png" width={40} height={40} alt="Einsteine" className="drop-shadow-lg" />
              </div>
            </div>

            {/* Drag indicator dots */}
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 flex gap-1">
              <div className={`w-1 h-1 rounded-full ${isDark ? 'bg-gray-500' : 'bg-gray-400'}`} />
              <div className={`w-1 h-1 rounded-full ${isDark ? 'bg-gray-500' : 'bg-gray-400'}`} />
              <div className={`w-1 h-1 rounded-full ${isDark ? 'bg-gray-500' : 'bg-gray-400'}`} />
            </div>

            {/* Tooltip */}
            <div className={`absolute right-full mr-4 px-3 py-1 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg border ${isDark ? 'bg-gray-900/90 text-white border-purple-500/30' : 'bg-white text-gray-800 border-purple-300 shadow-md'}`}>
              <div className="flex items-center gap-2">
                <span>🤖</span>
                Chat with Einsteine
                <span className="text-[10px] opacity-60">(Drag anywhere)</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default AICharacter