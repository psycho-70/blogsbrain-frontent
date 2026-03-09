'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import NeonButton from '@/components/ui/NeonButton'
import BlogForm from '@/components/admin/Blogsform'
import { adminGetCategories, adminCreateBlog, adminAutoGenerateBlog, type CategoryItem } from '@/lib/api'

export default function NewBlogPage() {
  const router = useRouter()
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Create New Blog</h1>
          <p className="text-gray-400">Create an AI-powered interactive blog post</p>
        </div>

        <button
          onClick={() => router.back()}
          className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
        >
          ← Back
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-900/30 border border-red-500/30 rounded-lg text-red-400">{error}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700 p-6"
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
            className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700 p-6"
          >
            <h3 className="text-lg font-bold mb-4">Post Actions</h3>

            <div className="space-y-4">
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => triggerFormSubmit(false)}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center justify-center"
                >
                  {isSubmitting ? 'Processing...' : 'Save as Draft'}
                </button>

                <NeonButton
                  type="button"
                  onClick={() => triggerFormSubmit(true)}
                  disabled={isSubmitting}
                  className="w-full justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Publishing...
                    </>
                  ) : (
                    'Publish Blog'
                  )}
                </NeonButton>
              </div>
            </div>
          </motion.div>

          {/* AI Assistant Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-xl border border-purple-500/30 p-6"
          >
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full flex items-center justify-center mr-3">
                <span className="text-xl">🤖</span>
              </div>
              <div>
                <h3 className="font-bold">AI Blog Generator</h3>
                <p className="text-sm text-gray-400">Auto-fill all fields</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-purple-300 mb-1 uppercase tracking-wider">
                  What should it be about?
                </label>
                <input
                  type="text"
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  placeholder="e.g., The future of AI in 2026"
                  className="w-full px-3 py-2 bg-gray-900/50 border border-purple-500/30 rounded-lg focus:border-purple-500 focus:outline-none text-sm text-white"
                />
              </div>

              <button
                type="button"
                onClick={handleAutoGenerate}
                disabled={isGenerating || !aiTopic}
                className={`w-full px-4 py-3 rounded-lg flex items-center justify-center transition-all ${isGenerating
                  ? 'bg-purple-900/50 text-purple-300 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-500/20'
                  }`}
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-purple-300 border-t-transparent rounded-full animate-spin mr-2"></div>
                    Generating...
                  </>
                ) : (
                  '✨ Auto-Generate Blog'
                )}
              </button>

              <p className="text-[10px] text-gray-500 text-center">
                This will fill title, content, excerpt, SEO tags & more.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
