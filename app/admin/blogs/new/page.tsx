'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import NeonButton from '@/components/ui/NeonButton'
import BlogForm from '@/components/admin/Blogsform'
import { adminGetCategories, adminCreateBlog, adminAutoGenerateBlog, type CategoryItem } from '@/lib/api'
import { useTheme } from '@/contexts/ThemeContext'
import { ArrowLeft, Sparkles, Save, Send, AlertCircle, Zap, Wand2 } from 'lucide-react'

export default function NewBlogPage() {
  const router = useRouter()
  const { isDark } = useTheme()
  const formRef = useRef<any>(null)
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [aiTopic, setAiTopic] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return
    adminGetCategories(token)
      .then(data => setCategories(data.categories))
      .catch(err => console.error('Error fetching categories:', err))
  }, [])

  const handleAutoGenerate = async () => {
    if (isGenerating || !aiTopic.trim()) {
      if (!aiTopic.trim()) setError('Please enter a topic for AI generation')
      return
    }

    const token = localStorage.getItem('token')
    if (!token) return

    setIsGenerating(true)
    setError('')
    try {
      const generatedBlog = await adminAutoGenerateBlog(token, { topic: aiTopic })
      if (formRef.current) {
        formRef.current.setFormData(generatedBlog)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate blog')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSubmit = async (formData: Record<string, unknown>, publishStatus?: boolean) => {
    const token = localStorage.getItem('token')
    if (!token) return
    setIsSubmitting(true)
    setError('')
    try {
      const finalData: any = {
        ...formData,
        category_id: Number(formData.category_id),
      }

      if (publishStatus !== undefined) {
        finalData.is_published = publishStatus
      }

      await adminCreateBlog(token, finalData)
      router.push('/admin/blogs')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create blog')
    } finally {
      setIsSubmitting(false)
    }
  }

  const triggerFormSubmit = (publishStatus: boolean) => {
    if (formRef.current) {
      const formData = formRef.current.getFormData()
      handleSubmit(formData, publishStatus)
    }
  }

  const textPrimary = isDark ? 'text-white' : 'text-slate-900'
  const textMuted = isDark ? 'text-gray-400' : 'text-slate-500'
  const cardBg = isDark ? 'bg-gray-800/30 backdrop-blur-sm border-gray-700' : 'bg-white/60 backdrop-blur-sm border-slate-200/50 shadow-sm'
  const inputBg = isDark ? 'bg-gray-900/50 border-purple-500/30 focus:border-purple-500 text-white placeholder-gray-400' : 'bg-slate-50/80 border-purple-300/50 focus:border-purple-500 text-slate-900 placeholder-slate-400'
  const errorBg = isDark ? 'bg-red-900/30 border-red-500/30 text-red-400' : 'bg-red-50 border-red-200 text-red-600'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className={`text-2xl lg:text-3xl font-bold mb-2 ${textPrimary}`}>
            Create New Blog
          </h1>
          <p className={textMuted}>Create an AI-powered interactive blog post</p>
        </div>

        <button
          onClick={() => router.back()}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${isDark ? 'text-gray-400 hover:text-white hover:bg-gray-800/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
        >
          <ArrowLeft size={18} />
          Back
        </button>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex items-center gap-2 p-4 rounded-lg border ${errorBg}`}
        >
          <AlertCircle size={18} />
          <span>{error}</span>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-xl border p-5 lg:p-6 transition-all duration-300 ${cardBg}`}
          >
            <BlogForm
              ref={formRef}
              categories={categories}
              onSubmit={(data) => handleSubmit(data)}
              isSubmitting={isSubmitting}
            />
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publish Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`rounded-xl border p-5 lg:p-6 transition-all duration-300 ${cardBg}`}
          >
            <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${textPrimary}`}>
              <Send size={18} className="text-purple-500" />
              Post Actions
            </h3>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => triggerFormSubmit(false)}
                disabled={isSubmitting}
                className={`w-full px-4 py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                  isDark
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isSubmitting ? (
                  <>
                    <div className={`w-4 h-4 border-2 rounded-full animate-spin ${isDark ? 'border-white border-t-transparent' : 'border-slate-700 border-t-transparent'}`} />
                    Processing...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Save as Draft
                  </>
                )}
              </button>

              <NeonButton
                type="button"
                onClick={() => triggerFormSubmit(true)}
                disabled={isSubmitting}
                className="w-full justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Publishing...
                  </>
                ) : (
                  <>
                    <Send size={16} className="mr-2" />
                    Publish Blog
                  </>
                )}
              </NeonButton>
            </div>
          </motion.div>

          {/* AI Assistant Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`rounded-xl border p-5 lg:p-6 transition-all duration-300 ${
              isDark
                ? 'bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-500/30'
                : 'bg-gradient-to-r from-purple-50/80 to-blue-50/80 border-purple-200/60 shadow-sm'
            }`}
          >
            <div className="flex items-center mb-4">
              <div className={`w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full flex items-center justify-center mr-3 shadow-lg`}>
                <Wand2 size={18} className="text-white" />
              </div>
              <div>
                <h3 className={`font-bold ${textPrimary}`}>AI Blog Generator</h3>
                <p className={`text-xs ${textMuted}`}>Auto-fill all fields</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className={`block text-xs font-medium mb-1 uppercase tracking-wider ${isDark ? 'text-purple-300' : 'text-purple-600'}`}>
                  What should it be about?
                </label>
                <input
                  type="text"
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  placeholder="e.g., The future of AI in 2026"
                  className={`w-full px-3 py-2.5 rounded-lg border focus:outline-none transition-all duration-300 ${inputBg}`}
                  onKeyPress={(e) => e.key === 'Enter' && handleAutoGenerate()}
                />
              </div>

              <button
                type="button"
                onClick={handleAutoGenerate}
                disabled={isGenerating || !aiTopic.trim()}
                className={`w-full px-4 py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 ${
                  isGenerating || !aiTopic.trim()
                    ? isDark
                      ? 'bg-purple-900/50 text-purple-300 cursor-not-allowed'
                      : 'bg-purple-200/50 text-purple-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30'
                }`}
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-purple-300 border-t-transparent rounded-full animate-spin"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    Auto-Generate Blog
                  </>
                )}
              </button>

              <div className={`flex items-center justify-center gap-1 text-[10px] ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>
                <Zap size={10} />
                <span>This will fill title, content, excerpt, SEO tags & more</span>
              </div>
            </div>
          </motion.div>

          {/* Tips Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`rounded-xl border p-5 transition-all duration-300 ${cardBg}`}
          >
            <h3 className={`text-sm font-bold mb-3 flex items-center gap-2 ${textPrimary}`}>
              <Sparkles size={14} className="text-purple-500" />
              Pro Tips
            </h3>
            <ul className={`space-y-2 text-xs ${textMuted}`}>
              <li className="flex items-start gap-2">
                <span className="text-purple-500">•</span>
                Use clear, descriptive titles for better SEO
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500">•</span>
                Add at least 3-5 tags to improve discoverability
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500">•</span>
                Featured images should be at least 1200x630px
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500">•</span>
                Save as draft and preview before publishing
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  )
}