'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { BlogListItem } from '@/lib/api'

interface BlogTableProps {
  blogs: BlogListItem[]
  onDelete: (id: number) => void
  onEdit: (id: number) => void
}

export default function BlogTable({ blogs, onDelete, onEdit }: BlogTableProps) {
  const [selectedBlogs, setSelectedBlogs] = useState<number[]>([])

  const handleSelectAll = () => {
    if (selectedBlogs.length === blogs.length) {
      setSelectedBlogs([])
    } else {
      setSelectedBlogs(blogs.map(blog => blog.id))
    }
  }

  const handleSelectBlog = (id: number) => {
    setSelectedBlogs(prev =>
      prev.includes(id)
        ? prev.filter(blogId => blogId !== id)
        : [...prev, id]
    )
  }

  const handleBulkAction = (action: string) => {
    if (action === 'delete') {
      if (confirm(`Delete ${selectedBlogs.length} selected blogs?`)) {
        selectedBlogs.forEach(onDelete)
        setSelectedBlogs([])
      }
    } else if (action === 'publish') {
      // Implement bulk publish
      console.log('Publishing:', selectedBlogs)
    }
  }

  return (
    <div className="overflow-x-auto">
      {/* Bulk Actions */}
      {selectedBlogs.length > 0 && (
        <div className="p-4 border-b border-gray-700 bg-gray-900/50 flex items-center justify-between">
          <span className="text-sm text-gray-400">
            {selectedBlogs.length} blog(s) selected
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => handleBulkAction('publish')}
              className="px-3 py-1 text-sm bg-green-600/20 text-green-400 rounded hover:bg-green-600/30 transition-colors"
            >
              Publish Selected
            </button>
            <button
              onClick={() => handleBulkAction('delete')}
              className="px-3 py-1 text-sm bg-red-600/20 text-red-400 rounded hover:bg-red-600/30 transition-colors"
            >
              Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="py-4 px-6 text-left">
              <input
                type="checkbox"
                checked={selectedBlogs.length === blogs.length}
                onChange={handleSelectAll}
                className="rounded border-gray-600 bg-gray-900"
              />
            </th>
            <th className="py-4 px-6 text-left text-gray-400 font-medium">Title</th>
            <th className="py-4 px-6 text-left text-gray-400 font-medium">Category</th>
            <th className="py-4 px-6 text-left text-gray-400 font-medium">Status</th>
            <th className="py-4 px-6 text-left text-gray-400 font-medium">Views</th>
            <th className="py-4 px-6 text-left text-gray-400 font-medium">Created</th>
            <th className="py-4 px-6 text-left text-gray-400 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map((blog, index) => (
            <motion.tr
              key={blog.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors"
            >
              <td className="py-4 px-6">
                <input
                  type="checkbox"
                  checked={selectedBlogs.includes(blog.id)}
                  onChange={() => handleSelectBlog(blog.id)}
                  className="rounded border-gray-600 bg-gray-900"
                />
              </td>
              <td className="py-4 px-6">
                <div>
                  <div className="font-medium text-white">{blog.title}</div>
                  <div className="text-sm text-gray-500 truncate max-w-xs">
                    {blog.excerpt}
                  </div>
                </div>
              </td>
              <td className="py-4 px-6">
                <span className="px-3 py-1 text-xs rounded-full bg-purple-500/20 text-purple-400">
                  {blog.category?.name ?? '—'}
                </span>
              </td>
              <td className="py-4 px-6">
                <span className={`px-3 py-1 text-xs rounded-full ${blog.is_published
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                  {blog.is_published ? 'Published' : 'Draft'}
                </span>
              </td>
              <td className="py-4 px-6 text-white">
                <div className="flex items-center">
                  <span className="mr-2">👁️</span>
                  {blog.views || 0}
                </div>
              </td>
              <td className="py-4 px-6 text-gray-400 text-sm">
                {blog.created_at ? new Date(blog.created_at).toLocaleDateString() : '—'}
              </td>
              <td className="py-4 px-6">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => onEdit(blog.id)}
                    className="p-2 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 transition-colors"
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => window.open(`/blogs/${blog.slug}`, '_blank')}
                    className="p-2 rounded-lg bg-gray-700 text-gray-400 hover:text-white transition-colors"
                    title="Preview"
                  >
                    👁️
                  </button>
                  <button
                    onClick={() => onDelete(blog.id)}
                    className="p-2 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-colors"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}