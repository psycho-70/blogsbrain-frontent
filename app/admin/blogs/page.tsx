'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import NeonButton from '@/components/ui/NeonButton'
import BlogTable from '@/components/admin/Blogstable'
import EditBlogModal from '@/components/admin/EditModel'
import {
  adminGetBlogs,
  adminDeleteBlog,
  adminGetCategories,
  adminGetBlog,
  adminUpdateBlog,
  type BlogListItem,
  type CategoryItem
} from '@/lib/api'
import { useTheme } from '@/contexts/ThemeContext'
import {
  Plus,
  Search,
  Filter,
  BookOpen,
  CheckCircle,
  FileText,
  Eye,
  X,
  Sparkles,
  TrendingUp
} from 'lucide-react'

// Define the full blog type for editing
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

export default function AdminBlogsPage() {
  const router = useRouter()
  const { isDark } = useTheme()
  const [blogs, setBlogs] = useState<BlogListItem[]>([])
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 0 })

  // Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedBlog, setSelectedBlog] = useState<BlogForEdit | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const fetchBlogs = useCallback(async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    try {
      setIsLoading(true)
      const data = await adminGetBlogs(token, {
        page: pagination.page,
        per_page: 50,
        search: searchQuery || undefined,
        category_id: selectedCategory !== 'all' ? parseInt(selectedCategory, 10) : undefined,
        status: selectedStatus !== 'all' ? selectedStatus : undefined,
      })
      setBlogs(data.blogs)
      setPagination(prev => ({
        ...prev,
        total: data.pagination.total,
        pages: data.pagination.pages,
      }))
    } catch (error) {
      console.error('Error fetching blogs:', error)
    } finally {
      setIsLoading(false)
    }
  }, [searchQuery, selectedCategory, selectedStatus, pagination.page, router])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      fetchBlogs()
    } else {
      router.push('/login')
    }
  }, [fetchBlogs, router])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    const fetchCategories = async () => {
      try {
        const data = await adminGetCategories(token)
        setCategories(data.categories)
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }

    fetchCategories()
  }, [router])

  const handleDeleteBlog = async (id: number) => {
    if (!confirm('Are you sure you want to delete this blog?')) return
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    try {
      await adminDeleteBlog(token, id)
      setBlogs(blogs.filter(blog => blog.id !== id))
    } catch (error) {
      console.error('Error deleting blog:', error)
      alert('Failed to delete blog.')
    }
  }

  const handleEditBlog = async (id: number) => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    try {
      const response = await adminGetBlog(token, id)

      if (!response || !response.blog) {
        console.error('Invalid API response:', response)
        throw new Error('Invalid blog data received')
      }

      const blogData = response.blog

      const transformedBlog: BlogForEdit = {
        id: blogData.id,
        title: blogData.title,
        content: blogData.content || '',
        excerpt: blogData.excerpt || '',
        category_id: blogData.category?.id || blogData.category_id || null,
        is_published: blogData.is_published || false,
        is_featured: blogData.is_featured || false,
        slug: blogData.slug,
        meta_title: blogData.meta_title,
        meta_description: blogData.meta_description,
        featured_image: blogData.featured_image,
        tags: blogData.tags || []
      }

      setSelectedBlog(transformedBlog)
      setIsEditModalOpen(true)
    } catch (error: any) {
      console.error('Error fetching blog details:', error)
      alert(`Failed to load blog for editing: ${error.message}`)
    }
  }

  const handleSaveBlog = async (updatedData: any) => {
    const token = localStorage.getItem('token')
    if (!token || !selectedBlog) return

    setIsSaving(true)
    try {
      const payload: any = {
        title: updatedData.title,
        content: updatedData.content,
        excerpt: updatedData.excerpt || '',
        category_id: updatedData.category_id || null,
        is_published: updatedData.is_published,
        is_featured: updatedData.is_featured,
      }

      if (updatedData.meta_title) payload.meta_title = updatedData.meta_title
      if (updatedData.meta_description) payload.meta_description = updatedData.meta_description
      if (updatedData.featured_image) payload.featured_image = updatedData.featured_image
      if (updatedData.tags) payload.tags = Array.isArray(updatedData.tags) ? updatedData.tags : []

      const response = await adminUpdateBlog(token, selectedBlog.id, payload)

      if (response.blog) {
        setBlogs(blogs.map(blog =>
          blog.id === selectedBlog.id
            ? {
              ...blog,
              title: response.blog.title,
              excerpt: response.blog.excerpt,
              category: response.blog.category,
              is_published: response.blog.is_published,
              is_featured: response.blog.is_featured,
              updated_at: new Date().toISOString()
            }
            : blog
        ))

        setIsEditModalOpen(false)
        setSelectedBlog(null)
        alert('Blog updated successfully!')
      } else {
        throw new Error('No blog data returned from update')
      }
    } catch (error: any) {
      console.error('Error updating blog:', error)
      alert(`Error: ${error.message || 'Failed to update blog'}`)
    } finally {
      setIsSaving(false)
    }
  }

  const textPrimary = isDark ? 'text-white' : 'text-slate-900'
  const textMuted = isDark ? 'text-gray-400' : 'text-slate-500'
  const cardBg = isDark ? 'bg-gray-800/30 backdrop-blur-sm border-gray-700' : 'bg-white/60 backdrop-blur-sm border-slate-200/50 shadow-sm'
  const inputBg = isDark ? 'bg-gray-900/50 border-gray-700 focus:border-purple-500 text-white placeholder-gray-400' : 'bg-slate-50/80 border-slate-200 focus:border-purple-500 text-slate-900 placeholder-slate-400'

  const stats = [
    { label: 'Total Blogs', value: blogs.length, icon: BookOpen, gradient: 'from-purple-500 to-pink-500' },
    { label: 'Published', value: blogs.filter(b => b.is_published).length, icon: CheckCircle, gradient: 'from-blue-500 to-cyan-500' },
    { label: 'Drafts', value: blogs.filter(b => !b.is_published).length, icon: FileText, gradient: 'from-green-500 to-emerald-500' },
    { label: 'Total Views', value: blogs.reduce((sum, blog) => sum + (blog.views || 0), 0), icon: Eye, gradient: 'from-orange-500 to-yellow-500' },
  ]

  return (
    <div className="relative">
      {/* Main Content */}
      <div className="relative z-10 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className={`text-2xl lg:text-3xl font-bold mb-2 ${textPrimary}`}>
              Blog Management
            </h1>
            <p className={textMuted}>Create, edit, and manage your AI-powered blog posts</p>
          </div>

          <NeonButton
            onClick={() => router.push('/admin/blogs/new')}
            className="flex items-center justify-center gap-2"
          >
            <Plus size={18} />
            Create New Blog
          </NeonButton>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-500`}></div>
              <div className={`relative rounded-xl p-5 border transition-all duration-300 ${cardBg} group-hover:border-purple-500/30`}>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                    <stat.icon size={18} className="text-white" />
                  </div>
                  <TrendingUp size={14} className={`${isDark ? 'text-gray-600' : 'text-slate-300'} opacity-50`} />
                </div>
                <div className={`text-2xl lg:text-3xl font-bold ${textPrimary} mb-1`}>
                  {stat.value.toLocaleString()}
                </div>
                <div className={`text-xs uppercase tracking-wider ${textMuted}`}>
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className={`rounded-xl border p-5 lg:p-6 transition-all duration-300 ${cardBg}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                Search Blogs
              </label>
              <div className="relative">
                <Search size={16} className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-gray-500' : 'text-slate-400'}`} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title or content..."
                  className={`w-full pl-9 pr-4 py-2 rounded-lg border focus:outline-none transition-all duration-300 ${inputBg}`}
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border focus:outline-none transition-all duration-300 ${inputBg}`}
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={String(cat.id)}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border focus:outline-none transition-all duration-300 ${inputBg}`}
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
        </div>

        {/* Blogs Table */}
        <div className={`rounded-xl border overflow-hidden transition-all duration-300 ${cardBg}`}>
          {isLoading ? (
            <div className="p-12 text-center">
              <div className={`w-12 h-12 border-4 rounded-full animate-spin mx-auto mb-4 ${isDark ? 'border-purple-500 border-t-transparent' : 'border-purple-400 border-t-transparent'}`}></div>
              <p className={textMuted}>Loading blogs...</p>
            </div>
          ) : blogs.length > 0 ? (
            <BlogTable
              blogs={blogs}
              onDelete={handleDeleteBlog}
              onEdit={handleEditBlog}
            />
          ) : (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">📝</div>
              <h3 className={`text-xl font-bold mb-2 ${textPrimary}`}>No blogs found</h3>
              <p className={`mb-6 ${textMuted}`}>Create your first AI-powered blog post</p>
              <NeonButton onClick={() => router.push('/admin/blogs/new')}>
                Create First Blog
              </NeonButton>
            </div>
          )}
        </div>

        {/* Edit Blog Modal */}
        <AnimatePresence>
          {isEditModalOpen && selectedBlog && (
            <EditBlogModal
              blog={selectedBlog}
              categories={categories}
              onClose={() => {
                setIsEditModalOpen(false)
                setSelectedBlog(null)
              }}
              onSave={handleSaveBlog}
              isSaving={isSaving}
            />
          )}
        </AnimatePresence>
      </div>


    </div>
  )
}