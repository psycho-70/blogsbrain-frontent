'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { BlogListItem } from '@/lib/api'
import { useTheme } from '@/contexts/ThemeContext'
import { Edit, Eye, Trash2, Check, Send, FileText } from 'lucide-react'

interface BlogTableProps {
  blogs: BlogListItem[]
  onDelete: (id: number) => void
  onEdit: (id: number) => void
}

export default function BlogTable({ blogs, onDelete, onEdit }: BlogTableProps) {
  const { isDark } = useTheme()
  const [selectedBlogs, setSelectedBlogs] = useState<number[]>([])

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedBlogs(blogs.map(blog => blog.id))
    } else {
      setSelectedBlogs([])
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
      console.log('Publishing:', selectedBlogs)
    }
  }

  const textPrimary = isDark ? 'text-white' : 'text-slate-900'
  const textMuted = isDark ? 'text-gray-400' : 'text-slate-500'
  const borderClass = isDark ? 'border-gray-800' : 'border-slate-100'
  const headBg = isDark ? 'bg-gray-900/50' : 'bg-slate-50/50'

  return (
    <div className="overflow-x-auto">
      {/* Bulk Actions */}
      {selectedBlogs.length > 0 && (
        <div className={`p-4 border-b flex items-center justify-between ${isDark ? 'bg-purple-900/20 border-purple-500/20' : 'bg-purple-50 border-purple-200'}`}>
          <span className={`text-sm font-bold ${isDark ? 'text-purple-400' : 'text-purple-700'}`}>
            {selectedBlogs.length} blog(s) selected
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => handleBulkAction('publish')}
              className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider bg-green-500/10 text-green-500 border border-green-500/20 rounded-lg hover:bg-green-500 hover:text-white transition-all shadow-lg shadow-green-500/5"
            >
              Publish
            </button>
            <button
              onClick={() => handleBulkAction('delete')}
              className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-500/5"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <table className="w-full text-left">
        <thead className={headBg}>
          <tr className={`border-b ${isDark ? 'border-gray-700' : 'border-slate-200'}`}>
            <th className="py-4 px-6">
              <input
                type="checkbox"
                checked={selectedBlogs.length === blogs.length && blogs.length > 0}
                onChange={handleSelectAll}
                className={`rounded border-gray-600 focus:ring-purple-500 ${isDark ? 'bg-gray-800' : 'bg-white'}`}
              />
            </th>
            <th className={`py-4 px-6 font-bold uppercase tracking-widest text-[10px] ${textMuted}`}>Blog Detail</th>
            <th className={`py-4 px-6 font-bold uppercase tracking-widest text-[10px] ${textMuted}`}>Category</th>
            <th className={`py-4 px-6 font-bold uppercase tracking-widest text-[10px] ${textMuted}`}>Status</th>
            <th className={`py-4 px-6 font-bold uppercase tracking-widest text-[10px] ${textMuted}`}>Performance</th>
            <th className={`py-4 px-6 font-bold uppercase tracking-widest text-[10px] ${textMuted}`}>Date</th>
            <th className={`py-4 px-6 font-bold uppercase tracking-widest text-[10px] text-right ${textMuted}`}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map((blog, index) => (
            <motion.tr
              key={blog.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`border-b transition-colors group ${borderClass} ${isDark ? 'hover:bg-gray-800/30' : 'hover:bg-slate-50/50'}`}
            >
              <td className="py-4 px-6">
                <input
                  type="checkbox"
                  checked={selectedBlogs.includes(blog.id)}
                  onChange={() => handleSelectBlog(blog.id)}
                  className={`rounded border-gray-600 focus:ring-purple-500 ${isDark ? 'bg-gray-800' : 'bg-white'}`}
                />
              </td>
              <td className="py-4 px-6 max-w-sm">
                <div className="flex items-center gap-3">
                  {blog.featured_image ? (
                    <img
                      src={blog.featured_image.startsWith('http') ? blog.featured_image : `/uploads/${blog.featured_image}`}
                      alt=""
                      className="w-10 h-10 rounded-lg object-cover border border-purple-500/20"
                    />
                  ) : (
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDark ? 'bg-gray-800' : 'bg-slate-100'}`}>
                      <FileText size={18} className={textMuted} />
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className={`font-bold truncate ${textPrimary}`}>{blog.title}</div>
                    <div className={`text-xs truncate ${textMuted}`}>
                      {blog.excerpt || 'No excerpt provided'}
                    </div>
                  </div>
                </div>
              </td>
              <td className="py-4 px-6 text-sm">
                <span className={`px-2.5 py-1 rounded-lg border font-bold uppercase tracking-widest text-[9px] ${isDark ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-purple-50 text-purple-600 border-purple-100'
                  }`}>
                  {blog.category?.name ?? 'Uncategorized'}
                </span>
              </td>
              <td className="py-4 px-6">
                <div className="flex items-center gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${blog.is_published ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-yellow-500 shadow-[0_0_8px_#eab308]'}`} />
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${blog.is_published ? 'text-green-500' : 'text-yellow-500'}`}>
                    {blog.is_published ? 'Live' : 'Draft'}
                  </span>
                </div>
              </td>
              <td className="py-4 px-6">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <span className={`text-xs font-bold ${textPrimary}`}>{blog.views || 0}</span>
                    <span className={`text-[9px] uppercase font-black tracking-widest ${textMuted}`}>Views</span>
                  </div>
                  {blog.is_featured && (
                    <span className="w-6 h-6 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center border border-orange-500/20" title="Featured Post">
                      ★
                    </span>
                  )}
                </div>
              </td>
              <td className={`py-4 px-6 text-xs font-medium ${textMuted}`}>
                {blog.created_at ? new Date(blog.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
              </td>
              <td className="py-4 px-6">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onEdit(blog.id)}
                    className={`p-2 rounded-xl transition-all ${isDark ? 'bg-blue-600/10 text-blue-400 hover:bg-blue-600/20' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                    title="Edit"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => window.open(`/blogs/${blog.slug}`, '_blank')}
                    className={`p-2 rounded-xl transition-all ${isDark ? 'bg-gray-800 text-gray-400 hover:text-white' : 'bg-slate-100 text-slate-500 hover:text-slate-700'}`}
                    title="Preview"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(blog.id)}
                    className={`p-2 rounded-xl transition-all ${isDark ? 'bg-red-600/10 text-red-400 hover:bg-red-600/20' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
                    title="Delete"
                  >
                    <Trash2 size={16} />
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