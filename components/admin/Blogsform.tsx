'use client'

import { useState, useRef, useImperativeHandle, forwardRef } from 'react'
import { motion } from 'framer-motion'

interface BlogFormProps {
  categories: any[]
  onSubmit: (data: any) => void
  isSubmitting: boolean
  initialData?: any
}

const BlogForm = forwardRef(({ categories, onSubmit, isSubmitting, initialData }: BlogFormProps, ref) => {
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
        featured_image: result.filename // Save ONLY the filename to the DB
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
    // Assuming backend serves uploads at /uploads/ or proxied/direct URL
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000'
    if (path.startsWith('/uploads/')) return `${baseUrl}${path}`
    return `${baseUrl}/uploads/${path}`
  }

  return (
    <form id="blog-form" onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Blog Title *
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="Enter blog title..."
          className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:border-purple-500 focus:outline-none text-white"
        />
        <p className="mt-1 text-sm text-gray-500">Make it clear and SEO-friendly</p>
      </div>

      {/* Content */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Content *
        </label>
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          required
          rows={15}
          placeholder="Write your blog content here... (Markdown supported)"
          className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:border-purple-500 focus:outline-none text-white font-mono resize-y"
        />
      </div>

      {/* Category & Excerpt */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Category *
          </label>
          <select
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:border-purple-500 focus:outline-none text-white"
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
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
            placeholder="Brief summary of your blog..."
            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:border-purple-500 focus:outline-none text-white resize-y"
          />
          <p className="mt-1 text-sm text-gray-500">Max 300 characters</p>
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Tags
        </label>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
            placeholder="Add tag and press Enter"
            className="flex-1 px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg focus:border-purple-500 focus:outline-none text-white"
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="px-4 py-2 bg-purple-600/20 text-purple-400 rounded-lg hover:bg-purple-600/30 transition-colors"
          >
            Add
          </button>
        </div>

        {formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag: any) => (
              <motion.span
                key={tag}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="inline-flex items-center px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-sm"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-2 text-xs hover:text-white"
                >
                  ×
                </button>
              </motion.span>
            ))}
          </div>
        )}
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Blog Image
        </label>

        {formData.featured_image ? (
          <div className="relative">
            <img
              src={getImageUrl(formData.featured_image)}
              alt="Preview"
              className="w-full h-64 object-cover rounded-lg"
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
            className={`border-2 border-dashed border-gray-700 rounded-lg p-8 text-center transition-colors cursor-pointer ${isUploading ? 'bg-gray-800/50 cursor-not-allowed' : 'hover:border-purple-500/50'
              }`}
          >
            {isUploading ? (
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                <p className="text-gray-400">Uploading image...</p>
              </div>
            ) : (
              <>
                <div className="text-4xl mb-2">📷</div>
                <p className="text-gray-400">Click to upload blog image</p>
                <p className="text-sm text-gray-500 mt-1">Recommended: 1200×630px</p>
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

      {/* Publish options */}
      {/* <div className="flex flex-wrap gap-6">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            name="is_published"
            checked={!!formData.is_published}
            onChange={handleChange}
            className="rounded border-gray-600 bg-gray-900"
          />
          <span className="text-sm text-gray-300">Publish immediately</span>
        </label>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            name="is_featured"
            checked={!!formData.is_featured}
            onChange={handleChange}
            className="rounded border-gray-600 bg-gray-900"
          />
          <span className="text-sm text-gray-300">Mark as featured</span>
        </label>
      </div> */}

      {/* SEO Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            SEO Title
          </label>
          <input
            type="text"
            name="meta_title"
            value={formData.meta_title}
            onChange={handleChange}
            placeholder="Custom title for search engines..."
            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:border-purple-500 focus:outline-none text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            SEO Description
          </label>
          <textarea
            name="meta_description"
            value={formData.meta_description}
            onChange={handleChange}
            rows={3}
            placeholder="Description for search results..."
            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg focus:border-purple-500 focus:outline-none text-white resize-y"
          />
        </div>
      </div>
    </form>
  )
})

export default BlogForm