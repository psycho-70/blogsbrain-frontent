'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { CategoryItem } from '@/lib/api'
import NeonButton from '@/components/ui/NeonButton'
import { useTheme } from '@/contexts/ThemeContext'
import { X, Camera, Trash2, Hash, Search, FileText, Layout, Save, Send } from 'lucide-react'

interface BlogForEdit {
  id: number
  title: string
  content: string
  excerpt: string | null
  category_id: number | null
  is_published: boolean
  is_featured: boolean
  slug: string
  meta_title?: string | null
  meta_description?: string | null
  featured_image?: string | null
  tags?: string[] | string
}

interface EditBlogModalProps {
  blog: BlogForEdit
  categories: CategoryItem[]
  onClose: () => void
  onSave: (data: any) => Promise<void>
  isSaving: boolean
}

export default function EditBlogModal({ blog, categories, onClose, onSave, isSaving }: EditBlogModalProps) {
  const { isDark } = useTheme()
  const [formData, setFormData] = useState({
    title: blog.title,
    excerpt: blog.excerpt || '',
    content: blog.content || '',
    is_published: blog.is_published,
    is_featured: blog.is_featured,
    category_id: blog.category_id,
    meta_title: blog.meta_title || '',
    meta_description: blog.meta_description || '',
    featured_image: blog.featured_image || '',
    tags: Array.isArray(blog.tags) ? blog.tags : typeof blog.tags === 'string' ? blog.tags.split(',') : []
  })
  const [tagInput, setTagInput] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setFormData({
      title: blog.title,
      excerpt: blog.excerpt || '',
      content: blog.content || '',
      is_published: blog.is_published,
      is_featured: blog.is_featured,
      category_id: blog.category_id,
      meta_title: blog.meta_title || '',
      meta_description: blog.meta_description || '',
      featured_image: blog.featured_image || '',
      tags: Array.isArray(blog.tags) ? blog.tags : typeof blog.tags === 'string' ? blog.tags.split(',') : []
    })
  }, [blog])

  const handleSubmit = async (e: React.FormEvent, isPublished?: boolean) => {
    e.preventDefault()
    try {
      const dataToSave = { ...formData }
      if (typeof isPublished !== 'undefined') {
        dataToSave.is_published = isPublished
      }
      await onSave(dataToSave)
    } catch (error) {
      console.error('Failed to save blog:', error)
    }
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

      setFormData((prev) => ({
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const textPrimary = isDark ? 'text-white' : 'text-slate-900'
  const textMuted = isDark ? 'text-gray-400' : 'text-slate-500'
  const inputBg = isDark ? 'bg-gray-900/50 border-gray-700 text-white' : 'bg-white border-slate-300 text-slate-900'
  const modalBg = isDark ? 'bg-gray-900' : 'bg-white'

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className={`relative w-full max-w-5xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${isDark ? 'border-purple-500/20 bg-gray-950' : 'border-slate-200 bg-white'
          }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`p-8 border-b flex items-center justify-between ${isDark ? 'border-white/5 bg-gray-900/40' : 'bg-slate-50/80 border-slate-200'}`}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white shadow-lg">
              <FileText size={24} />
            </div>
            <div>
              <h2 className={`text-2xl font-black ${textPrimary}`}>Edit Masterpiece</h2>
              <p className={textMuted}>Refining your blog post for the audience</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-3 rounded-2xl transition-all ${isDark ? 'hover:bg-white/10 text-gray-400 hover:text-white' : 'hover:bg-black/5 text-slate-400 hover:text-slate-900'}`}
          >
            <X size={24} />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-8 py-10 custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column: Editor */}
            <div className="lg:col-span-8 space-y-8">
              <div className="space-y-2">
                <label className={`block text-xs font-bold uppercase tracking-[0.2em] ${textMuted}`}>Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full px-6 py-4 rounded-2xl border transition-all font-bold text-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none ${inputBg}`}
                />
              </div>

              <div className="space-y-2">
                <label className={`block text-xs font-bold uppercase tracking-[0.2em] ${textMuted}`}>Content</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows={15}
                  className={`w-full px-8 py-6 rounded-3xl border transition-all font-mono text-sm leading-relaxed resize-none focus:border-purple-500 outline-none ${inputBg}`}
                />
              </div>

              {/* SEO Sub-section */}
              <div className={`p-8 rounded-3xl border ${isDark ? 'bg-gray-900/40 border-white/5' : 'bg-slate-50 border-slate-100 shadow-inner'}`}>
                <h3 className={`text-lg font-black mb-6 flex items-center gap-3 ${textPrimary}`}>
                  <Search size={20} className="text-blue-500" />
                  SEO Optimization
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className={`block text-xs font-bold uppercase tracking-[0.2em] ${textMuted}`}>Meta Title</label>
                    <input
                      type="text"
                      name="meta_title"
                      value={formData.meta_title}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border focus:border-purple-500 outline-none text-sm font-bold ${inputBg}`}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className={`block text-xs font-bold uppercase tracking-[0.2em] ${textMuted}`}>Meta Description</label>
                    <textarea
                      name="meta_description"
                      value={formData.meta_description}
                      onChange={handleChange}
                      rows={2}
                      className={`w-full px-4 py-3 rounded-xl border focus:border-purple-500 outline-none text-sm resize-none ${inputBg}`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Settings */}
            <div className="lg:col-span-4 space-y-8">
              {/* Image Section */}
              <div className="space-y-3">
                <label className={`block text-xs font-bold uppercase tracking-[0.2em] ${textMuted}`}>Featured Image</label>
                {formData.featured_image ? (
                  <div className="relative group rounded-2xl overflow-hidden border-2 border-purple-500/20 shadow-xl">
                    <img
                      src={getImageUrl(formData.featured_image)}
                      alt="Preview"
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => setFormData((prev: any) => ({ ...prev, featured_image: '' }))}
                        className="p-3 bg-red-600 text-white rounded-xl shadow-lg hover:scale-110 active:scale-95 transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => !isUploading && fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer group flex flex-col items-center justify-center min-h-[192px] ${isDark ? 'border-gray-800 hover:border-purple-500/50 hover:bg-gray-800/20' : 'border-slate-200 hover:border-purple-200 hover:bg-slate-50'
                      }`}
                  >
                    {isUploading ? (
                      <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Camera size={24} className={`mb-3 ${textMuted}`} />
                        <p className={`text-xs font-bold uppercase tracking-widest ${textMuted}`}>Upload Image</p>
                      </>
                    )}
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </div>
                )}
              </div>

              {/* Classification */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className={`block text-xs font-bold uppercase tracking-[0.2em] ${textMuted}`}>Classification</label>
                  <div className="relative">
                    <Layout size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${textMuted}`} />
                    <select
                      name="category_id"
                      value={formData.category_id || ''}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:border-purple-500 outline-none font-bold text-sm appearance-none ${inputBg}`}
                    >
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={`block text-xs font-bold uppercase tracking-[0.2em] ${textMuted}`}>Tags</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Hash size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 ${textMuted}`} />
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                        placeholder="Add tag..."
                        className={`w-full pl-9 pr-3 py-2.5 rounded-xl border focus:border-purple-500 outline-none text-xs font-bold ${inputBg}`}
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {formData.tags.map(tag => (
                      <span key={tag} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-500/10 text-purple-400 text-[10px] font-black uppercase tracking-wider border border-purple-500/20 group">
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-red-500 opacity-40 group-hover:opacity-100"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Excerpt */}
              <div className="space-y-2">
                <label className={`block text-xs font-bold uppercase tracking-[0.2em] ${textMuted}`}>Quick Hook (Excerpt)</label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full px-4 py-3 rounded-xl border focus:border-purple-500 outline-none text-sm resize-none ${inputBg}`}
                />
              </div>

              {/* Options */}
              <div className="space-y-3 pt-4">
                <label className="flex items-center justify-between group cursor-pointer">
                  <span className={`text-sm font-bold ${textPrimary}`}>Pin to Featured</span>
                  <div className="relative">
                    <input type="checkbox" name="is_featured" checked={formData.is_featured} onChange={handleChange} className="sr-only" />
                    <div className={`w-12 h-6 rounded-full transition-all ${formData.is_featured ? 'bg-purple-600 shadow-[0_0_10px_rgba(147,51,234,0.5)]' : 'bg-gray-700'}`} />
                    <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${formData.is_featured ? 'translate-x-6' : ''}`} />
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`p-8 border-t flex flex-wrap items-center justify-end gap-4 ${isDark ? 'border-white/5 bg-gray-900/40' : 'bg-slate-50/80 border-slate-200'}`}>
          <button
            onClick={onClose}
            className={`px-8 py-3 rounded-2xl font-bold transition-all ${isDark ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-slate-900 hover:bg-black/5'}`}
            disabled={isSaving}
          >
            Cancel
          </button>

          <button
            onClick={(e) => handleSubmit(e, false)}
            className={`px-8 py-3 rounded-2xl border font-bold transition-all flex items-center gap-2 ${isDark ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            disabled={isSaving}
          >
            <Save size={18} />
            Save Draft
          </button>

          <NeonButton
            onClick={(e) => handleSubmit(e, true)}
            disabled={isSaving}
            className="px-10 py-3 rounded-2xl shadow-xl hover:scale-105 active:scale-95"
          >
            {isSaving ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Syncing...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Send size={18} />
                <span>Publish Now</span>
              </div>
            )}
          </NeonButton>
        </div>

        <style jsx>{`
            .custom-scrollbar::-webkit-scrollbar {
                width: 4px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
                background: transparent;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
                background: ${isDark ? '#1f2937' : '#e2e8f0'};
                border-radius: 20px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background: ${isDark ? '#374151' : '#cbd5e1'};
            }
        `}</style>
      </motion.div>
    </div>
  )
}