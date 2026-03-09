'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CategoryItem } from '@/lib/api'
import NeonButton from '@/components/ui/NeonButton'
import { useRef } from 'react'

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
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000'
    if (path.startsWith('/uploads/')) return `${baseUrl}${path}`
    return `${baseUrl}/uploads/${path}`
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-4xl bg-gray-900 rounded-2xl border border-purple-500/30 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-purple-500/30 bg-gradient-to-r from-purple-900/20 to-blue-900/20">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center">
              <span className="mr-3">📝</span>
              Edit Blog Post
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-800 transition-colors text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          <p className="text-gray-400 mt-2">Edit blog details and content</p>
        </div>

        {/* Content */}
        <div className="max-h-[70vh] overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-white"
                    placeholder="Enter blog title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Excerpt
                  </label>
                  <textarea
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none text-white"
                    placeholder="Brief summary of the blog post"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    name="category_id"
                    value={formData.category_id || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-white"
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-6">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        name="is_featured"
                        checked={formData.is_featured}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className={`w-12 h-6 rounded-full transition-colors ${formData.is_featured ? 'bg-purple-500' : 'bg-gray-700'
                        }`}>
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${formData.is_featured ? 'left-7' : 'left-1'
                          }`}></div>
                      </div>
                    </div>
                    <span className="text-gray-300">Featured</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Blog Image
                </label>
                {formData.featured_image ? (
                  <div className="relative">
                    <img
                      src={getImageUrl(formData.featured_image)}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setFormData((prev: any) => ({ ...prev, featured_image: '' }))}
                      className="absolute top-2 right-2 p-2 bg-red-600/80 rounded-full hover:bg-red-600 transition-colors"
                    >
                      🗑️
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => !isUploading && fileInputRef.current?.click()}
                    className={`border-2 border-dashed border-gray-700 rounded-lg p-6 text-center transition-colors cursor-pointer ${isUploading ? 'bg-gray-800/50 cursor-not-allowed' : 'hover:border-purple-500/50'
                      }`}
                  >
                    {isUploading ? (
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                        <p className="text-gray-400 text-sm">Uploading...</p>
                      </div>
                    ) : (
                      <>
                        <div className="text-2xl mb-2">📷</div>
                        <p className="text-gray-400 text-sm">Click to upload image</p>
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

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tags
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    className="flex-1 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-white"
                    placeholder="Add tags..."
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-2 bg-purple-600/20 text-purple-400 rounded-xl hover:bg-purple-600/30 transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 text-purple-300 hover:text-white"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* SEO Section */}
          <div className="pt-4 border-t border-gray-800">
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <span className="mr-2">🔍</span> SEO Settings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Meta Title
                </label>
                <input
                  type="text"
                  name="meta_title"
                  value={formData.meta_title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-white"
                  placeholder="SEO title (recommended: 50-60 characters)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.meta_title.length}/60 characters
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Meta Description
                </label>
                <textarea
                  name="meta_description"
                  value={formData.meta_description}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none text-white"
                  placeholder="SEO description (recommended: 150-160 characters)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.meta_description.length}/160 characters
                </p>
              </div>
            </div>
          </div>

          {/* Content Editor */}
          <div className="pt-4 border-t border-gray-800">
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <span className="mr-2">📄</span> Content
            </h3>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={12}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all font-mono text-sm resize-none text-white"
              placeholder="Write your blog content here..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-800 bg-gray-900/50 flex justify-end space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 rounded-xl border border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, false)}
            className="px-6 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white hover:bg-gray-700 transition-colors"
            disabled={isSaving}
          >
            Save as Draft
          </button>
          <NeonButton
            type="button"
            onClick={(e) => handleSubmit(e, true)}
            disabled={isSaving}
            className="min-w-[120px] justify-center"
          >
            {isSaving ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                Saving...
              </>
            ) : 'Publish'}
          </NeonButton>
        </div>
      </motion.div>
    </div>
  )
}