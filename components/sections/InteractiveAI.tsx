'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import ScrollSectionHeader from '../ui/ScrollSectionHeader'
import { useAI } from '@/contexts/AIContext'
import { useTheme } from '@/contexts/ThemeContext'

const messages = [
  { role: 'user', text: 'Tell me about quantum computing basics.' },
  { role: 'ai', text: 'Quantum computing uses qubits instead of bits, allowing for superposition and entanglement…' },
  { role: 'user', text: 'How does that help with encryption?' },
  { role: 'ai', text: 'It creates possibilities for unbreakable encryption using quantum key distribution (QKD).' },
]

const bubbleTransition = {
  type: 'spring' as const,
  stiffness: 260,
  damping: 24,
}

export default function InteractiveAI() {
  const [visibleCount, setVisibleCount] = useState(0)
  const { setShowAI, setMode } = useAI()
  const { isDark } = useTheme()

  useEffect(() => {
    const id = setInterval(() => {
      setVisibleCount(prev => {
        if (prev >= messages.length) return 0
        return prev + 1
      })
    }, 2600)
    return () => clearInterval(id)
  }, [])

  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Background with grid pattern (same as Hero) */}
      <div className="absolute inset-0 z-0">
        {isDark ? (
          /* Dark mode: existing SVG + globe stars */
          <div
            className="absolute inset-0 bg-cover bg-center"
            // style={{
            //   backgroundImage: "url('/herobackgrond.svg')",
            //   backgroundSize: 'cover',
            //   backgroundPosition: 'center',
            //   backgroundColor: '#000',
            // }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-purple-900/10 to-black/60" />
            <div className="absolute inset-0 opacity-30">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent animate-gradient-x" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/10 to-transparent animate-gradient-y" />
            </div>
          </div>
        ) : (
          /* Light mode: grid pattern */
          <div className="absolute inset-0">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: "url('/herobackgrond.svg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: '#fff',
              }}
            />
            <div className="absolute inset-0 bg-white/82" />
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50/60 via-white/40 to-blue-50/70" />
            
            {/* Color blobs */}
            <div
              className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full opacity-25 pointer-events-none"
              style={{
                background: 'radial-gradient(circle, rgba(139,92,246,0.22) 0%, transparent 70%)',
                transform: 'translate(-30%, -30%)',
              }}
            />
            <div
              className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full opacity-20 pointer-events-none"
              style={{
                background: 'radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%)',
                transform: 'translate(20%, 20%)',
              }}
            />
            
            {/* Grid overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: `linear-gradient(rgba(0,0,0,0.08) 1px, transparent 1px),
                                  linear-gradient(90deg, rgba(0,0,0,0.08) 1px, transparent 1px)`,
                backgroundSize: '60px 60px',
              }}
            />
            
            {/* Moving shimmer */}
            <div className="absolute inset-0 opacity-15">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-200/50 to-transparent animate-gradient-x" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-100/40 to-transparent animate-gradient-y" />
            </div>
          </div>
        )}
      </div>

      <div className="max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16 relative z-10">
        {/* Left: Text Content */}
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
              onClick={() => {
                setShowAI(true)
                setMode('chat')
              }}
              className={`group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold transition-all duration-300 shadow-lg ${
                isDark ? 'glow-button' : 'light-glow-button'
              }`}
            >
              Start Chatting
              <span className="inline-block ml-2 transition-transform group-hover:translate-x-1">→</span>
            </motion.button>
          </motion.div>
        </div>

        {/* Right: Animated Chat Mockup */}
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
            className={`relative rounded-2xl border p-6 shadow-2xl max-w-md mx-auto ${
              isDark 
                ? 'bg-gray-900/80 border-gray-700' 
                : 'bg-white/90 border-gray-200 shadow-gray-300/20'
            }`}
          >
            {/* Corner dots */}
            <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 shadow-lg" />
            <div className="absolute -bottom-3 -left-3 w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg" />

            {/* Header */}
            <div className={`flex items-center gap-4 mb-6 pb-4 ${
              isDark ? 'border-b border-gray-700' : 'border-b border-gray-200'
            }`}>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold shadow-md">
                EA
              </div>
              <div>
                <div className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Einsteine AI</div>
                <div className="text-xs text-green-400 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  Online • Available now
                </div>
              </div>
            </div>

            {/* Message list */}
            <div className="space-y-3 font-mono text-sm h-[280px] overflow-hidden relative">
              <div className={`absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t z-10 pointer-events-none ${
                isDark 
                  ? 'from-gray-900/80 to-transparent' 
                  : 'from-white/80 to-transparent'
              }`} />

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
                      className={`max-w-[80%] p-3 rounded-2xl shadow-sm ${
                        msg.role === 'user'
                          ? isDark
                            ? 'bg-gradient-to-r from-purple-900/60 to-blue-900/60 border border-purple-500/30 text-purple-100'
                            : 'bg-gradient-to-r from-purple-100 to-blue-100 border border-purple-300/50 text-purple-900'
                          : isDark
                            ? 'bg-gray-800 border border-gray-700 text-gray-300'
                            : 'bg-gray-100 border border-gray-200 text-gray-700'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Fake input bar */}
            <div className={`mt-6 pt-4 ${isDark ? 'border-t border-gray-700' : 'border-t border-gray-200'}`}>
              <div className="flex items-center gap-2">
                <div className={`h-10 rounded-lg flex-1 shadow-inner ${
                  isDark ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'
                }`} />
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

      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
        }
        @keyframes gradient-y {
          0%, 100% { transform: translateY(-100%); }
          50% { transform: translateY(100%); }
        }
        .animate-gradient-x { animation: gradient-x 15s ease-in-out infinite; }
        .animate-gradient-y { animation: gradient-y 20s ease-in-out infinite; }
        
        .glow-button {
          box-shadow: 0 0 20px rgba(59,130,246,0.4), 0 0 40px rgba(168,85,247,0.3);
        }
        .light-glow-button {
          box-shadow: 0 4px 20px rgba(124,58,237,0.25), 0 8px 40px rgba(59,130,246,0.15);
        }
      `}</style>
    </section>
  )
}