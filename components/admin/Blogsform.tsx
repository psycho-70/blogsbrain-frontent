'use client'

import { useState, useRef, useImperativeHandle, forwardRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/contexts/ThemeContext'
import { Camera, Trash2, X, Plus, AlertCircle, FileText, Layout, Hash, Search } from 'lucide-react'

interface BlogFormProps {
  categories: any[]
  onSubmit: (data: any) => void
  isSubmitting: boolean
  initialData?: any
}

const BlogForm = forwardRef(({ categories, onSubmit, isSubmitting, initialData }: BlogFormProps, ref) => {
  const { isDark } = useTheme()
  const [formData, setFormData] = useState(initialData || {
    title: '',
    content: '',
    excerpt: '',
    category_id: '',
    tags: [],
    featured_image: '',
    meta_title: '',
    meta_description: '',
    is_published: true,
    is_featured: false
  })

  useImperativeHandle(ref, () => ({
    setFormData: (data: any) => {
      setFormData((prev: any) => ({
        ...prev,
        ...data
      }))
    },
    getFormData: () => formData
  }))

  const [tagInput, setTagInput] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData((prev: any) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev: any) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev: any) => ({
      ...prev,
      tags: prev.tags.filter((tag: any) => tag !== tagToRemove)
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const token = localStorage.getItem('token')
    if (!token) return

    setIsUploading(true)
    try {
      const { adminUploadImage } = await import('@/lib/api')
      const result = await adminUploadImage(token, file)

      setFormData((prev: any) => ({
        ...prev,
        featured_image: result.filename
      }))
    } catch (err) {
      console.error('Upload failed:', err)
      alert('Failed to upload image')
    } finally {
      setIsUploading(false)
    }
  }

  const getImageUrl = (path: string) => {
    if (!path) return ''
    if (path.startsWith('data:') || path.startsWith('http')) return path
    if (path.startsWith('/uploads/')) return path
    return `/uploads/${path}`
  }

  const textPrimary = isDark ? 'text-white' : 'text-slate-900'
  const textMuted = isDark ? 'text-gray-400' : 'text-slate-500'
  const inputBg = isDark ? 'bg-gray-900/50 border-gray-700 text-white' : 'bg-white border-slate-300 text-slate-900'

  return (
    <form id="blog-form" onSubmit={handleSubmit} className="space-y-8">
      {/* Title */}
      <div className="space-y-2">
        <label className={`block text-xs font-bold uppercase tracking-[0.2em] ${textMuted}`}>
          Blog Title *
        </label>
        <div className="relative">
          <FileText className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${textMuted}`} />
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Enter a compelling title..."
            className={`w-full pl-12 pr-6 py-4 rounded-2xl border focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all font-bold text-lg ${inputBg}`}
          />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2">
        <label className={`block text-xs font-bold uppercase tracking-[0.2em] ${textMuted}`}>
          Story Content *
        </label>
        <div className="relative">
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows={12}
            placeholder="Unleash your creativity here... (Markdown is supported)"
            className={`w-full px-8 py-6 rounded-3xl border focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all font-mono text-sm leading-relaxed resize-none ${inputBg}`}
          />
        </div>
      </div>

      {/* Image Upload */}
      <div className="space-y-2">
        <label className={`block text-xs font-bold uppercase tracking-[0.2em] ${textMuted}`}>
          Visual Representation
        </label>
        {formData.featured_image ? (
          <div className="relative group rounded-3xl overflow-hidden border-4 border-purple-500/20 shadow-2xl">
            <img
              src={getImageUrl(formData.featured_image)}
              alt="Preview"
              className="w-full h-80 object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                type="button"
                onClick={() => setFormData((prev: any) => ({ ...prev, featured_image: '' }))}
                className="p-4 bg-red-600 text-white rounded-2xl hover:scale-110 active:scale-95 transition-all shadow-xl"
              >
                <Trash2 size={24} />
              </button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => !isUploading && fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-12 text-center transition-all cursor-pointer group flex flex-col items-center justify-center min-h-[300px] ${isUploading
              ? 'bg-gray-800/20 border-purple-500/30'
              : `${isDark ? 'border-gray-800 hover:border-purple-500/50 hover:bg-gray-800/20' : 'border-slate-200 hover:border-purple-200 hover:bg-slate-50'}`
              }`}
          >
            {isUploading ? (
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className={`font-bold uppercase tracking-widest text-xs ${textMuted}`}>Uploading Masterpiece...</p>
              </div>
            ) : (
              <>
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${isDark ? 'bg-gray-800 text-purple-400' : 'bg-slate-100 text-purple-600'}`}>
                  <Camera size={32} />
                </div>
                <p className={`text-lg font-bold ${textPrimary}`}>Drop your featured image here</p>
                <p className={`text-xs mt-2 uppercase tracking-widest font-bold ${textMuted}`}>Click to browse archives (Recommended: 1200×630px)</p>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Category */}
        <div className="space-y-2">
          <label className={`block text-xs font-bold uppercase tracking-[0.2em] ${textMuted}`}>
            Classification *
          </label>
          <div className="relative">
            <Layout className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${textMuted}`} />
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              required
              className={`w-full pl-12 pr-10 py-4 rounded-2xl border focus:border-purple-500 outline-none transition-all font-bold appearance-none ${inputBg}`}
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Excerpt */}
        <div className="space-y-2">
          <label className={`block text-xs font-bold uppercase tracking-[0.2em] ${textMuted}`}>
            The Hook (Excerpt)
          </label>
          <textarea
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            rows={3}
            placeholder="A short teaser to grab attention..."
            className={`w-full px-6 py-4 rounded-2xl border focus:border-purple-500 outline-none transition-all font-medium text-sm leading-relaxed resize-none ${inputBg}`}
          />
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <label className={`block text-xs font-bold uppercase tracking-[0.2em] ${textMuted}`}>
          Discoverability Tags
        </label>
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Hash className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${textMuted}`} />
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              placeholder="Add keywords..."
              className={`w-full pl-10 pr-6 py-3 rounded-2xl border focus:border-purple-500 outline-none transition-all font-medium text-sm ${inputBg}`}
            />
          </div>
          <button
            type="button"
            onClick={handleAddTag}
            className="px-6 py-3 bg-purple-500/10 text-purple-500 border border-purple-500/20 rounded-2xl hover:bg-purple-500 hover:text-white transition-all font-bold text-xs uppercase tracking-widest"
          >
            <Plus size={18} />
          </button>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          <AnimatePresence>
            {formData.tags.map((tag: any) => (
              <motion.span
                key={tag}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="inline-flex items-center px-4 py-1.5 rounded-xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold shadow-lg shadow-purple-500/5 group"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-2 hover:text-red-500 transition-colors opacity-40 group-hover:opacity-100"
                >
                  <X size={14} />
                </button>
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* SEO Section */}
      <div className={`p-8 rounded-3xl border ${isDark ? 'bg-gray-900/40 border-white/5' : 'bg-slate-50 border-slate-100 shadow-inner'}`}>
        <div className="flex items-center gap-3 mb-8">
          <Search size={20} className="text-blue-500" />
          <h3 className={`text-lg font-black ${textPrimary}`}>Search Engine Optimization</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className={`block text-xs font-bold uppercase tracking-[0.2em] ${textMuted}`}>Meta Title</label>
            <input
              type="text"
              name="meta_title"
              value={formData.meta_title}
              onChange={handleChange}
              placeholder="Custom SEO Title"
              className={`w-full px-6 py-4 rounded-2xl border focus:border-purple-500 outline-none transition-all font-bold text-sm ${inputBg}`}
            />
          </div>
          <div className="space-y-2">
            <label className={`block text-xs font-bold uppercase tracking-[0.2em] ${textMuted}`}>Meta Description</label>
            <textarea
              name="meta_description"
              value={formData.meta_description}
              onChange={handleChange}
              rows={3}
              placeholder="Search result summary..."
              className={`w-full px-6 py-4 rounded-2xl border focus:border-purple-500 outline-none transition-all text-sm leading-relaxed resize-none ${inputBg}`}
            />
          </div>
        </div>
      </div>
    </form>
  )
})

BlogForm.displayName = 'BlogForm'
export default BlogForm