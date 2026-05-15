'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import NeonButton from '@/components/ui/NeonButton'
import { useTheme } from '@/contexts/ThemeContext'
import {
    User, Mail, Shield, Calendar, Trash2, Lock, Unlock, Camera,
    AtSign, FileText, CheckCircle2, AlertCircle, Plus
} from 'lucide-react'
import {
    adminGetUsers,
    adminCreateUser,
    adminToggleUserStatus,
    adminDeleteUser,
    adminUploadImage,
    type UserItem,
} from '@/lib/api'

export default function AdminUsersPage() {
    const { isDark } = useTheme()
    const [users, setUsers] = useState<UserItem[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [activeToggle, setActiveToggle] = useState<number | null>(null)
    const [form, setForm] = useState({
        username: '',
        password: '',
        name: '',
        profile_image: '',
        role: 'author',
        bio: ''
    })

    const fetchUsers = useCallback(async () => {
        const token = localStorage.getItem('token')
        if (!token) return
        try {
            setIsLoading(true)
            const data = await adminGetUsers(token)
            setUsers(data.users)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load users')
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchUsers()
    }, [fetchUsers])

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const token = localStorage.getItem('token') || ''
        try {
            setIsUploading(true)
            const data = await adminUploadImage(token, file)
            setForm(prev => ({ ...prev, profile_image: data.filename }))
            setSuccess('Profile image uploaded successfully')
        } catch (err) {
            setError('Failed to upload image')
        } finally {
            setIsUploading(false)
        }
    }

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault()
        const token = localStorage.getItem('token')
        if (!token) return

        setIsSubmitting(true)
        setError('')
        try {
            await adminCreateUser(token, form)
            setSuccess('Admin user created successfully')
            setShowModal(false)
            setForm({ username: '', password: '', name: '', profile_image: '', role: 'author', bio: '' })
            fetchUsers()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create user')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleToggleStatus = async (user: UserItem) => {
        const token = localStorage.getItem('token')
        if (!token) return

        setActiveToggle(user.id)
        try {
            await adminToggleUserStatus(token, user.id)
            setSuccess(`User ${user.is_active ? 'deactivated' : 'activated'} successfully`)
            fetchUsers()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update status')
        } finally {
            setActiveToggle(null)
        }
    }

    const handleDeleteUser = async (user: UserItem) => {
        if (!confirm(`Are you sure you want to delete user "${user.username}"?`)) return

        const token = localStorage.getItem('token')
        if (!token) return

        try {
            await adminDeleteUser(token, user.id)
            setSuccess('User deleted successfully')
            fetchUsers()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete user')
        }
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
    const inputBg = isDark ? 'bg-gray-900/50 border-gray-700 text-white' : 'bg-white border-slate-300 text-slate-900'

    return (
        <div className="space-y-8 relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className={`text-3xl font-bold mb-2 ${textPrimary}`}>Users Management</h1>
                    <p className={textMuted}>View and manage administrative access and permissions</p>
                </div>
                <NeonButton onClick={() => setShowModal(true)}>
                    <Plus size={18} className="mr-2" /> Create New Admin
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
                        <p className={textMuted}>Loading users...</p>
                    </div>
                ) : users.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="text-6xl mb-4">👥</div>
                        <h3 className={`text-xl font-bold mb-2 ${textPrimary}`}>No users found</h3>
                        <p className={textMuted}>Wait, you are logged in, so there should be at least one user!</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className={isDark ? 'bg-gray-900/50' : 'bg-slate-50/50'}>
                                <tr className={`border-b ${isDark ? 'border-gray-700' : 'border-slate-200'}`}>
                                    <th className={`py-4 px-6 font-medium ${textMuted}`}>User Detail</th>
                                    <th className={`py-4 px-6 font-medium ${textMuted}`}>Role</th>
                                    <th className={`py-4 px-6 font-medium ${textMuted}`}>Joined</th>
                                    <th className={`py-4 px-6 font-medium ${textMuted}`}>Status</th>
                                    <th className={`py-4 px-6 font-medium text-right ${textMuted}`}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <motion.tr
                                        key={user.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`border-b last:border-0 transition-colors ${isDark ? 'border-gray-800 hover:bg-gray-800/30' : 'border-slate-100 hover:bg-slate-50/50'}`}
                                    >
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-4">
                                                <div className="relative group/avatar">
                                                    {user.profile_image ? (
                                                        <img
                                                            src={user.profile_image.startsWith('http') ? user.profile_image : (user.profile_image.startsWith('/uploads/') ? user.profile_image : `/uploads/${user.profile_image}`)}
                                                            alt={user.name}
                                                            className="w-12 h-12 rounded-2xl object-cover border-2 shadow-lg transition-transform group-hover/avatar:scale-110 border-purple-500/20"
                                                        />
                                                    ) : (
                                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-purple-500/20">
                                                            {user.name ? user.name[0].toUpperCase() : user.username[0].toUpperCase()}
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className={`font-bold ${textPrimary}`}>{user.name || 'Anonymous Admin'}</p>
                                                    <div className="flex items-center gap-1.5 mt-0.5">
                                                        <AtSign size={12} className={textMuted} />
                                                        <p className={`text-xs ${textMuted} truncate flex-1`}>{user.username}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${user.role === 'admin'
                                                    ? 'bg-purple-500/10 text-purple-500 border border-purple-500/20'
                                                    : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                                                }`}>
                                                <Shield size={12} />
                                                {user.role}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className={`flex items-center gap-1.5 text-xs font-medium ${textMuted}`}>
                                                <Calendar size={14} />
                                                {user.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`px-3 py-1 text-[10px] uppercase font-bold tracking-wider rounded-full ${user.is_active
                                                    ? (isDark ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-green-100 text-green-700 border border-green-200')
                                                    : (isDark ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-red-100 text-red-700 border border-red-200')
                                                }`}>
                                                {user.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center justify-end gap-2 text-right">
                                                <button
                                                    onClick={() => handleToggleStatus(user)}
                                                    disabled={activeToggle === user.id}
                                                    className={`p-2 rounded-xl transition-all disabled:opacity-50 ${isDark ? 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700' : 'bg-slate-100 text-slate-500 hover:text-slate-700 hover:bg-slate-200'}`}
                                                    title={user.is_active ? 'Deactivate User' : 'Activate User'}
                                                >
                                                    {activeToggle === user.id ? '…' : (user.is_active ? <Lock size={18} /> : <Unlock size={18} />)}
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUser(user)}
                                                    className={`p-2 rounded-xl transition-all ${isDark ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
                                                    title="Delete User"
                                                >
                                                    <Trash2 size={18} />
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

            {/* User Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md" onClick={() => setShowModal(false)}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            onClick={(e) => e.stopPropagation()}
                            className={`border rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'}`}
                        >
                            <div className="p-8">
                                <h2 className={`text-2xl font-bold mb-8 ${textPrimary}`}>Create New Administrator</h2>
                                <form onSubmit={handleCreateUser} className="space-y-6">
                                    <div className="flex justify-center mb-8">
                                        <label className="relative cursor-pointer group/upload">
                                            {form.profile_image ? (
                                                <img
                                                    src={form.profile_image.startsWith('http') ? form.profile_image : (form.profile_image.startsWith('/uploads/') ? form.profile_image : `/uploads/${form.profile_image}`)}
                                                    className="w-24 h-24 rounded-3xl object-cover border-4 shadow-2xl shadow-purple-500/20 border-purple-500"
                                                    alt="Preview"
                                                />
                                            ) : (
                                                <div className={`w-24 h-24 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center transition-all group-hover/upload:border-purple-500 ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-slate-50 border-slate-300'}`}>
                                                    <Camera size={24} className={textMuted} />
                                                    <span className={`text-[10px] mt-1 uppercase font-bold tracking-widest ${textMuted}`}>Avatar</span>
                                                </div>
                                            )}
                                            <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-3xl opacity-0 group-hover/upload:opacity-100 transition-opacity">
                                                <span className="text-xs text-white font-bold">{isUploading ? 'WAIT...' : 'REPLACE'}</span>
                                            </div>
                                        </label>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2 md:col-span-1">
                                            <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${textMuted}`}>Full Name</label>
                                            <div className="relative">
                                                <User size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${textMuted}`} />
                                                <input
                                                    type="text"
                                                    value={form.name}
                                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                                    className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:border-purple-500 focus:outline-none transition-colors ${inputBg}`}
                                                    placeholder="John Doe"
                                                />
                                            </div>
                                        </div>

                                        <div className="col-span-2 md:col-span-1">
                                            <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${textMuted}`}>Role</label>
                                            <div className="relative">
                                                <Shield size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${textMuted}`} />
                                                <select
                                                    value={form.role}
                                                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                                                    className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:border-purple-500 focus:outline-none transition-colors appearance-none ${inputBg}`}
                                                >
                                                    <option value="admin">Admin</option>
                                                    <option value="author">Author</option>
                                                    <option value="editor">Editor</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${textMuted}`}>Email / Username *</label>
                                        <div className="relative">
                                            <Mail size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${textMuted}`} />
                                            <input
                                                type="email"
                                                value={form.username}
                                                onChange={(e) => setForm({ ...form, username: e.target.value })}
                                                className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:border-purple-500 focus:outline-none transition-colors ${inputBg}`}
                                                placeholder="admin@blog.com"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${textMuted}`}>Password *</label>
                                        <div className="relative">
                                            <Lock size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${textMuted}`} />
                                            <input
                                                type="password"
                                                value={form.password}
                                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                                className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:border-purple-500 focus:outline-none transition-colors ${inputBg}`}
                                                placeholder="••••••••"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${textMuted}`}>Short Bio</label>
                                        <textarea
                                            value={form.bio}
                                            onChange={(e) => setForm({ ...form, bio: e.target.value })}
                                            rows={3}
                                            className={`w-full px-4 py-3 rounded-xl border focus:border-purple-500 focus:outline-none transition-colors resize-none ${inputBg}`}
                                            placeholder="Write a brief introduction about this admin..."
                                        />
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <NeonButton type="submit" disabled={isSubmitting} className="flex-1 justify-center py-4">
                                            {isSubmitting ? 'Creating...' : 'Create Admin Access'}
                                        </NeonButton>
                                        <button
                                            type="button"
                                            onClick={() => setShowModal(false)}
                                            className={`px-6 py-2 rounded-xl font-bold transition-all ${isDark ? 'text-gray-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'}`}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
