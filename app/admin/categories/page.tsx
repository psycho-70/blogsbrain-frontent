'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import NeonButton from '@/components/ui/NeonButton'
import { useTheme } from '@/contexts/ThemeContext'
import {
  Folder, Edit, Trash, Lock, Unlock, AlertCircle, CheckCircle2,
  Plus
} from 'lucide-react'
import {
  adminGetCategories,
  adminCreateCategory,
  adminUpdateCategory,
  adminDeleteCategory,
  type CategoryItem,
} from '@/lib/api'

export default function AdminCategoriesPage() {
  const { isDark } = useTheme()
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [modal, setModal] = useState<'create' | 'edit' | null>(null)
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null)
  const [form, setForm] = useState({ name: '', description: '', image: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeToggle, setActiveToggle] = useState<number | null>(null)

  const fetchCategories = useCallback(async () => {
    const token = localStorage.getItem('token')
    if (!token) return
    try {
      setIsLoading(true)
      const data = await adminGetCategories(token)
      setCategories(data.categories)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load categories')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const getToken = () => localStorage.getItem('token')

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = getToken()
    if (!token) return
    if (!form.name.trim()) {
      setError('Name is required')
      return
    }
    setIsSubmitting(true)
    setError('')
    try {
      await adminCreateCategory(token, {
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        image: form.image.trim() || undefined,
      })
      setSuccess('Category created successfully')
      setModal(null)
      setForm({ name: '', description: '', image: '' })
      fetchCategories()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create category')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = getToken()
    if (!token || !editingCategory) return
    if (!form.name.trim()) {
      setError('Name is required')
      return
    }
    setIsSubmitting(true)
    setError('')
    try {
      await adminUpdateCategory(token, editingCategory.id, {
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        image: form.image.trim() || undefined,
      })
      setSuccess('Category updated successfully')
      setModal(null)
      setEditingCategory(null)
      setForm({ name: '', description: '', image: '' })
      fetchCategories()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update category')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleToggleActive = async (cat: CategoryItem) => {
    const token = getToken()
    if (!token) return
    setActiveToggle(cat.id)
    try {
      await adminUpdateCategory(token, cat.id, { is_active: !cat.is_active })
      setSuccess(cat.is_active ? 'Category deactivated' : 'Category activated')
      fetchCategories()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update')
    } finally {
      setActiveToggle(null)
    }
  }

  const handleDelete = async (cat: CategoryItem) => {
    if (!confirm(`Delete category "${cat.name}"? This will fail if any blogs use it.`)) return
    const token = getToken()
    if (!token) return
    try {
      await adminDeleteCategory(token, cat.id)
      setSuccess('Category deleted')
      fetchCategories()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete category')
    }
  }

  const openEdit = (cat: CategoryItem) => {
    setEditingCategory(cat)
    setForm({
      name: cat.name,
      description: cat.description || '',
      image: cat.image || '',
    })
    setModal('edit')
  }

  useEffect(() => {
    if (success || error) {
      const t = setTimeout(() => {
        setSuccess('')
        setError('')
      }, 4000)
      return () => clearTimeout(t)
    }
  }, [success, error])

  const textPrimary = isDark ? 'text-white' : 'text-slate-900'
  const textMuted = isDark ? 'text-gray-400' : 'text-slate-500'
  const cardBg = isDark ? 'bg-gray-800/30 backdrop-blur-sm border-gray-700' : 'bg-white/60 backdrop-blur-sm border-slate-200 shadow-sm'
  const trayBg = isDark ? 'bg-gray-900/50' : 'bg-slate-50/50'
  const inputBg = isDark ? 'bg-gray-900/50 border-gray-700 text-white' : 'bg-white border-slate-300 text-slate-900'

  return (
    <div className="space-y-6 relative z-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-3xl font-bold mb-2 ${textPrimary}`}>Categories</h1>
          <p className={textMuted}>Manage blog categories to organize your content</p>
        </div>
        <NeonButton onClick={() => { setForm({ name: '', description: '', image: '' }); setModal('create'); setError(''); }}>
          <Plus size={18} className="mr-2" /> Add Category
        </NeonButton>
      </div>

      {error && (
        <div className={`p-4 rounded-lg border flex items-center gap-3 ${isDark ? 'bg-red-900/30 border-red-500/30 text-red-400' : 'bg-red-50 border-red-200 text-red-600'}`}>
          <AlertCircle size={20} />
          {error}
        </div>
      )}
      {success && (
        <div className={`p-4 rounded-lg border flex items-center gap-3 ${isDark ? 'bg-green-900/30 border-green-500/30 text-green-400' : 'bg-green-50 border-green-200 text-green-600'}`}>
          <CheckCircle2 size={20} />
          {success}
        </div>
      )}

      <div className={`rounded-xl border overflow-hidden ${cardBg}`}>
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className={textMuted}>Loading categories...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">📁</div>
            <h3 className={`text-xl font-bold mb-2 ${textPrimary}`}>No categories yet</h3>
            <p className={`${textMuted} mb-6`}>Create a category to organize your blogs</p>
            <NeonButton onClick={() => setModal('create')}>Add Category</NeonButton>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={trayBg}>
                <tr className={`border-b ${isDark ? 'border-gray-700' : 'border-slate-200'}`}>
                  <th className={`py-4 px-6 text-left font-medium ${textMuted}`}>Name</th>
                  <th className={`py-4 px-6 text-left font-medium ${textMuted}`}>Slug</th>
                  <th className={`py-4 px-6 text-left font-medium ${textMuted}`}>Description</th>
                  <th className={`py-4 px-6 text-left font-medium ${textMuted}`}>Status</th>
                  <th className={`py-4 px-6 text-right font-medium ${textMuted}`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <motion.tr
                    key={cat.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`border-b last:border-0 transition-colors ${isDark ? 'border-gray-800 hover:bg-gray-800/30' : 'border-slate-100 hover:bg-slate-50/50'}`}
                  >
                    <td className={`py-4 px-6 font-medium ${textPrimary}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDark ? 'bg-purple-500/10 text-purple-400' : 'bg-purple-100 text-purple-600'}`}>
                          <Folder size={16} />
                        </div>
                        {cat.name}
                      </div>
                    </td>
                    <td className={`py-4 px-6 text-sm ${textMuted}`}>{cat.slug}</td>
                    <td className={`py-4 px-6 text-sm max-w-xs truncate ${textMuted}`}>{cat.description || '—'}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 text-[10px] uppercase font-bold tracking-wider rounded-full ${cat.is_active ? (isDark ? 'bg-green-500/20 text-green-400 border border-green-500/20' : 'bg-green-100 text-green-700 border border-green-200') : (isDark ? 'bg-gray-500/20 text-gray-400 border border-gray-500/20' : 'bg-gray-100 text-gray-500 border border-gray-200')}`}>
                        {cat.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(cat)}
                          className={`p-2 rounded-lg transition-colors ${isDark ? 'bg-blue-600/10 text-blue-400 hover:bg-blue-600/20' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleToggleActive(cat)}
                          disabled={activeToggle === cat.id}
                          className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${isDark ? 'bg-gray-700 text-gray-400 hover:text-white' : 'bg-slate-200 text-slate-500 hover:text-slate-700'}`}
                          title={cat.is_active ? 'Deactivate' : 'Activate'}
                        >
                          {activeToggle === cat.id ? '…' : (cat.is_active ? <Lock size={16} /> : <Unlock size={16} />)}
                        </button>
                        <button
                          onClick={() => handleDelete(cat)}
                          className={`p-2 rounded-lg transition-colors ${isDark ? 'bg-red-600/10 text-red-400 hover:bg-red-600/20' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
                          title="Delete"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      <AnimatePresence>
        {modal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setModal(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className={`border rounded-xl shadow-2xl w-full max-w-md p-6 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'}`}
            >
              <h2 className={`text-xl font-bold mb-6 ${textPrimary}`}>{modal === 'create' ? 'Add New Category' : 'Edit Category'}</h2>
              <form onSubmit={modal === 'create' ? handleCreate : handleUpdate} className="space-y-5">
                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${textMuted}`}>Category Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className={`w-full px-4 py-3 rounded-lg border focus:border-purple-500 focus:outline-none transition-colors ${inputBg}`}
                    placeholder="e.g., Artificial Intelligence"
                    required
                  />
                </div>
                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${textMuted}`}>Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    rows={4}
                    className={`w-full px-4 py-3 rounded-lg border focus:border-purple-500 focus:outline-none transition-colors resize-none ${inputBg}`}
                    placeholder="Briefly describe what this category covers..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <NeonButton type="submit" disabled={isSubmitting} className="flex-1 justify-center">
                    {isSubmitting ? 'Saving...' : modal === 'create' ? 'Create' : 'Save Changes'}
                  </NeonButton>
                  <button
                    type="button"
                    onClick={() => setModal(null)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
