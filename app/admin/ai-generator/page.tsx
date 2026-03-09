'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import NeonButton from '@/components/ui/NeonButton'
import { blogGeneratorChat } from '@/lib/api'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export default function AIGeneratorPage() {
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [categoryHint, setCategoryHint] = useState('')
  const [levelHint, setLevelHint] = useState<'beginner' | 'intermediate' | 'advanced' | ''>('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const t = localStorage.getItem('token')
    if (!t) router.push('/admin/login')
    else setToken(t)
  }, [router])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || !token || isLoading) return
    const userMsg = input.trim()
    setInput('')
    setError(null)
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }])
    setIsLoading(true)

    try {
      const chatHistory = messages.map((m) => ({ role: m.role, content: m.content }))
      const response = await blogGeneratorChat(
        {
          message: userMsg,
          chat_history: chatHistory,
          category_hint: categoryHint || undefined,
          level_hint: levelHint || undefined,
        },
        token
      )
      setMessages((prev) => [...prev, { role: 'assistant', content: response }])
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to generate content'
      setError(msg)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Unable to connect to the AI. Please check CANOPY_API_KEY is set and try again.',
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const suggestions = [
    'Write a blog post about AI in education',
    'Generate 5 SEO-optimized title options for a crypto article',
    'Create an FAQ section for a beauty blog',
    'Write an excerpt for a business startup guide',
    'Suggest meta description for my tech article',
  ]

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-b border-purple-500/30">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/dashboard"
                className="text-gray-400 hover:text-white transition-colors"
              >
                ← Dashboard
              </Link>
              <div>
                <h1 className="text-2xl font-bold">AI Blog Generator</h1>
                <p className="text-gray-400 text-sm">
                  Generate drafts, titles, excerpts, FAQs & SEO content
                </p>
              </div>
            </div>
            <NeonButton variant="outline" onClick={() => router.push('/admin/dashboard')}>
              Back
            </NeonButton>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Context hints */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Category hint (optional)</label>
            <input
              type="text"
              value={categoryHint}
              onChange={(e) => setCategoryHint(e.target.value)}
              placeholder="e.g. Technology, Beauty, Business"
              className="w-full bg-gray-800 border border-purple-500/30 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Target level (optional)</label>
            <select
              value={levelHint}
              onChange={(e) => setLevelHint(e.target.value as typeof levelHint)}
              className="w-full bg-gray-800 border border-purple-500/30 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            >
              <option value="">Any level</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* Chat area */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-purple-500/30 overflow-hidden">
          <div className="h-[450px] overflow-y-auto p-6 space-y-6">
            {messages.length === 0 && (
              <div className="text-center text-gray-400 py-12">
                <p className="text-lg mb-4">Ask the AI to generate blog content.</p>
                <p className="text-sm mb-6">Try one of these:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => setInput(s)}
                      className="px-4 py-2 bg-gray-700/50 hover:bg-purple-700/30 rounded-lg text-sm border border-purple-500/20 transition-all"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-4 rounded-xl ${
                    msg.role === 'user'
                      ? 'bg-purple-600/50 text-white'
                      : 'bg-gray-700/50 border border-purple-500/20 text-gray-100'
                  }`}
                >
                  <pre className="whitespace-pre-wrap font-sans text-sm">{msg.content}</pre>
                </div>
              </div>
            ))}
            {error && <p className="text-red-400 text-sm">{error}</p>}
            {isLoading && (
              <div className="flex items-center gap-2 text-purple-300">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
                <span className="text-sm">Generating...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-purple-500/30">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                sendMessage()
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe what you want to create..."
                className="flex-1 bg-gray-700/50 border border-purple-500/30 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                disabled={isLoading}
              />
              <NeonButton type="submit" disabled={isLoading || !input.trim()}>
                Generate
              </NeonButton>
            </form>
          </div>
        </div>

        <p className="text-gray-500 text-sm mt-4 text-center">
          AI Draft → Admin Review → Approve → Publish. Always review before publishing.
        </p>
      </div>
    </div>
  )
}
