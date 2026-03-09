'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import NeonButton from '@/components/ui/NeonButton'
import {
  adminGetCategories,
  adminCreateCategory,
  adminUpdateCategory,
  adminDeleteCategory,
  type CategoryItem,
} from '@/lib/api'

export default function AdminCategoriesPage() {
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Categories</h1>
          <p className="text-gray-400">Manage blog categories</p>
        </div>
        <NeonButton onClick={() => { setForm({ name: '', description: '', image: '' }); setModal('create'); setError(''); }}>
          + Add Category
        </NeonButton>
      </div>

      {error && (
        <div className="p-4 bg-red-900/30 border border-red-500/30 rounded-lg text-red-400">{error}</div>
      )}
      {success && (
        <div className="p-4 bg-green-900/30 border border-green-500/30 rounded-lg text-green-400">{success}</div>
      )}

      <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading categories...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">📁</div>
            <h3 className="text-xl font-bold mb-2">No categories yet</h3>
            <p className="text-gray-400 mb-6">Create a category to organize your blogs</p>
            <NeonButton onClick={() => setModal('create')}>Add Category</NeonButton>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="py-4 px-6 text-left text-gray-400 font-medium">Name</th>
                  <th className="py-4 px-6 text-left text-gray-400 font-medium">Slug</th>
                  <th className="py-4 px-6 text-left text-gray-400 font-medium">Description</th>
                  <th className="py-4 px-6 text-left text-gray-400 font-medium">Status</th>
                  <th className="py-4 px-6 text-left text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <motion.tr
                    key={cat.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="py-4 px-6 font-medium">{cat.name}</td>
                    <td className="py-4 px-6 text-gray-400 text-sm">{cat.slug}</td>
                    <td className="py-4 px-6 text-gray-400 text-sm max-w-xs truncate">{cat.description || '—'}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 text-xs rounded-full ${cat.is_active ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                        {cat.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(cat)}
                          className="p-2 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 transition-colors"
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleToggleActive(cat)}
                          disabled={activeToggle === cat.id}
                          className="p-2 rounded-lg bg-gray-700 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                          title={cat.is_active ? 'Deactivate' : 'Activate'}
                        >
                          {activeToggle === cat.id ? '…' : (cat.is_active ? '🔒' : '🔓')}
                        </button>
                        <button
                          onClick={() => handleDelete(cat)}
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
        )}
      </div>

      {/* Create / Edit Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setModal(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl w-full max-w-md p-6"
          >
            <h2 className="text-xl font-bold mb-4">{modal === 'create' ? 'Add Category' : 'Edit Category'}</h2>
            <form onSubmit={modal === 'create' ? handleCreate : handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg focus:border-purple-500 focus:outline-none text-white"
                  placeholder="Category name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg focus:border-purple-500 focus:outline-none text-white resize-y"
                  placeholder="Optional description"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <NeonButton type="submit" disabled={isSubmitting} className="flex-1 justify-center">
                  {isSubmitting ? 'Saving...' : modal === 'create' ? 'Create' : 'Save'}
                </NeonButton>
                <button
                  type="button"
                  onClick={() => setModal(null)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
