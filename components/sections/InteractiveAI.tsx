'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import ScrollSectionHeader from '../ui/ScrollSectionHeader'

const messages = [
  { role: 'user', text: 'Tell me about quantum computing basics.' },
  { role: 'ai', text: 'Quantum computing uses qubits instead of bits, allowing for superposition and entanglement…' },
  { role: 'user', text: 'How does that help with encryption?' },
  { role: 'ai', text: 'It creates possibilities for unbreakable encryption using quantum key distribution (QKD).' },
]

// Spring config reused across all message bubbles
const bubbleTransition = {
  type: 'spring' as const,
  stiffness: 260,
  damping: 24,
}

export default function InteractiveAI() {
  const [visibleCount, setVisibleCount] = useState(0)

  // Reveal one message every 2.6 s, then loop
  useEffect(() => {
    const id = setInterval(() => {
      setVisibleCount(prev => {
        if (prev >= messages.length) return 0     // reset → loop
        return prev + 1
      })
    }, 2600)
    return () => clearInterval(id)
  }, [])

  return (
    <section className="py-24 px-4 relative overflow-hidden bg-transparent">
      {/* Background blobs */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-purple-900/20 rounded-full blur-[100px] -translate-y-1/2 -translate-x-1/2 opacity-60" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-900/20 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3 opacity-60" />

      <div className="max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16 relative z-10">

        {/* ── Left: Text Content ── */}
        <div className="lg:w-1/2 text-left">
          <ScrollSectionHeader
            badge="AI Intelligence"
            titlePrefix="Meet"
            titleHighlight="Einsteine AI"
            description="Don't just read—interact. Our intelligent AI companion guides you through complex topics and personalises your learning journey."
          />

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.42 }}
            viewport={{ once: true }}
            className="mt-8"
          >
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: '0 10px 32px rgba(147,51,234,0.45)' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => window.dispatchEvent(new CustomEvent('show-ai-tour'))}
              className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold transition-all duration-300 shadow-lg"
            >
              Start Chatting
              <span className="inline-block ml-2 transition-transform group-hover:translate-x-1">→</span>
            </motion.button>
          </motion.div>
        </div>

        {/* ── Right: Animated Chat Mockup ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.82, rotate: 4 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.85, ease: 'easeOut', delay: 0.1 }}
          viewport={{ once: true }}
          className="lg:w-1/2 w-full"
        >
          <motion.div
            whileHover={{ y: -6, boxShadow: '0 30px 60px rgba(0,0,0,0.4)' }}
            transition={{ duration: 0.3 }}
            className="relative bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-700 p-6 shadow-2xl max-w-md mx-auto"
          >
            {/* Corner dots */}
            <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 shadow-lg" />
            <div className="absolute -bottom-3 -left-3 w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg" />

            {/* Header */}
            <div className="flex items-center gap-4 mb-6 border-b border-gray-700 pb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold shadow-md">
                EA
              </div>
              <div>
                <div className="font-bold text-white">Einsteine AI</div>
                <div className="text-xs text-green-400 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  Online • Available now
                </div>
              </div>
            </div>

            {/* Message list */}
            <div className="space-y-3 font-mono text-sm h-[280px] overflow-hidden relative">
              {/* Bottom fade */}
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-gray-900/80 to-transparent z-10 pointer-events-none" />

              <AnimatePresence initial={false}>
                {messages.slice(0, visibleCount).map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{
                      opacity: 0,
                      x: msg.role === 'user' ? 40 : -40,
                      scale: 0.88,
                    }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.88, transition: { duration: 0.25 } }}
                    transition={{ ...bubbleTransition, delay: 0.04 * idx }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl shadow-sm ${msg.role === 'user'
                        ? 'bg-gradient-to-r from-purple-900/60 to-blue-900/60 border border-purple-500/30 text-purple-100'
                        : 'bg-gray-800 border border-gray-700 text-gray-300'
                        }`}
                    >
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Fake input bar */}
            <div className="mt-6 pt-4 border-t border-gray-700">
              <div className="flex items-center gap-2">
                <div className="h-10 bg-gray-800 rounded-lg flex-1 shadow-inner border border-gray-700" />
                <motion.div
                  whileHover={{ scale: 1.12 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white shadow-md cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  )
}