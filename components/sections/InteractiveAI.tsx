'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function InteractiveAI() {
  const [activeMessage, setActiveMessage] = useState(0)

  const messages = [
    { role: 'user', text: "Tell me about quantum computing basics." },
    { role: 'ai', text: "Quantum computing uses qubits instead of bits, allowing for superposition and entanglement..." },
    { role: 'user', text: "How does that help with encryption?" },
    { role: 'ai', text: "It creates possibilities for unbreakable encryption using quantum key distribution (QKD)." }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveMessage(prev => (prev + 1) % messages.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [messages.length])

  return (
    <section className="py-24 px-4 relative overflow-hidden bg-transparent">
      {/* Subtle background elements */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-purple-900/20 rounded-full blur-[100px] -translate-y-1/2 -translate-x-1/2 opacity-60"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-900/20 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3 opacity-60"></div>

      <div className="max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16 relative z-10">

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="lg:w-1/2 text-left"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-900/50 to-blue-900/50 border border-purple-500/30 rounded-full text-purple-300 text-sm font-semibold mb-6 shadow-sm">
            <span className="text-lg">✨</span>
            <span>Advanced AI Companion</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Meet <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Einsteine AI</span>
          </h2>
          <p className="text-gray-300 text-lg mb-8 leading-relaxed">
            Don't just read—interact. Our intelligent AI companion guides you through complex topics, answers your questions in real-time, and personalizes your learning journey.
          </p>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('show-ai-tour'))}
            className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            Start Chatting
            <span className="inline-block ml-2 transition-transform group-hover:translate-x-1">→</span>
          </button>
        </motion.div>

        {/* Chat Mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="lg:w-1/2 w-full"
        >
          <div className="relative bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-700 p-6 shadow-2xl max-w-md mx-auto transform hover:-translate-y-2 transition-all duration-500 hover:shadow-3xl">
            {/* Decorative elements */}
            <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 shadow-lg"></div>
            <div className="absolute -bottom-3 -left-3 w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg"></div>

            {/* Header */}
            <div className="flex items-center gap-4 mb-6 border-b border-gray-700 pb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold shadow-md">
                EA
              </div>
              <div>
                <div className="font-bold text-white">Einsteine AI</div>
                <div className="text-xs text-green-400 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Online • Available now
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="space-y-4 font-mono text-sm h-[300px] overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent z-10 pointer-events-none"></div>
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                  animate={{ opacity: idx <= activeMessage ? 1 : 0.3, x: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${msg.role === 'user'
                    ? 'bg-gradient-to-r from-purple-900/50 to-blue-900/50 border border-purple-500/30 text-purple-100'
                    : 'bg-gray-800 border border-gray-700 text-gray-300'
                    }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Input Fake */}
            <div className="mt-6 pt-4 border-t border-gray-700">
              <div className="flex items-center gap-2">
                <div className="h-10 bg-gray-800 rounded-lg flex-1 shadow-inner border border-gray-700"></div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white shadow-md">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}