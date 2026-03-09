'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import NeonButton from '@/components/ui/NeonButton'
import {
    adminGetUsers,
    adminCreateUser,
    adminToggleUserStatus,
    adminDeleteUser,
    adminUploadImage,
    type UserItem,
} from '@/lib/api'

export default function AdminUsersPage() {
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

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Users Management</h1>
                    <p className="text-gray-400">View and manage administrative users</p>
                </div>
                <NeonButton onClick={() => setShowModal(true)}>
                    + Create New Admin
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
                        <p className="text-gray-400">Loading users...</p>
                    </div>
                ) : users.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="text-6xl mb-4">👥</div>
                        <h3 className="text-xl font-bold mb-2">No users found</h3>
                        <p className="text-gray-400">Wait, you are logged in, so there should be at least one user!</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-900/50">
                                <tr className="border-b border-gray-700">
                                    <th className="py-4 px-6 text-gray-400 font-medium">User</th>
                                    <th className="py-4 px-6 text-gray-400 font-medium">Role</th>
                                    <th className="py-4 px-6 text-gray-400 font-medium">Joined Date</th>
                                    <th className="py-4 px-6 text-gray-400 font-medium">Status</th>
                                    <th className="py-4 px-6 text-gray-400 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <motion.tr
                                        key={user.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors"
                                    >
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                {user.profile_image ? (
                                                    <img
                                                        src={user.profile_image.startsWith('http') ? user.profile_image : `http://127.0.0.1:5000${user.profile_image}`}
                                                        alt={user.name}
                                                        className="w-10 h-10 rounded-full object-cover border border-purple-500/30"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center text-lg font-bold">
                                                        {user.name ? user.name[0].toUpperCase() : user.username[0].toUpperCase()}
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-medium text-white">{user.name || 'No Name'}</p>
                                                    <p className="text-xs text-gray-500 truncate max-w-[200px]">{user.username}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`px-3 py-1 text-xs rounded-full ${user.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-gray-400 text-sm">
                                            {user.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`px-3 py-1 text-xs rounded-full ${user.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                                {user.is_active ? 'Active' : 'Deactivated'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleToggleStatus(user)}
                                                    disabled={activeToggle === user.id}
                                                    className="p-2 rounded-lg bg-gray-700 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                                                    title={user.is_active ? 'Deactivate' : 'Activate'}
                                                >
                                                    {activeToggle === user.id ? '…' : (user.is_active ? '🔒' : '🔓')}
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUser(user)}
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

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl w-full max-w-md p-6"
                    >
                        <h2 className="text-xl font-bold mb-4">Create New Admin User</h2>
                        <form onSubmit={handleCreateUser} className="space-y-4">
                            <div className="flex justify-center mb-4">
                                <label className="relative cursor-pointer group">
                                    {form.profile_image ? (
                                        <img
                                            src={`http://127.0.0.1:5000/uploads/${form.profile_image}`}
                                            className="w-20 h-20 rounded-full object-cover border-2 border-purple-500 shadow-lg shadow-purple-500/20"
                                            alt="Preview"
                                        />
                                    ) : (
                                        <div className="w-20 h-20 rounded-full bg-gray-700 border-2 border-dashed border-gray-600 flex items-center justify-center group-hover:border-purple-500 transition-colors">
                                            <span className="text-2xl">📷</span>
                                        </div>
                                    )}
                                    <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-xs text-white font-medium">{isUploading ? '...' : 'Upload'}</span>
                                    </div>
                                </label>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg focus:border-purple-500 focus:outline-none text-white"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Email Address *</label>
                                <input
                                    type="email"
                                    value={form.username}
                                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                                    className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg focus:border-purple-500 focus:outline-none text-white"
                                    placeholder="admin@example.com"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Password *</label>
                                <input
                                    type="password"
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg focus:border-purple-500 focus:outline-none text-white"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
                                <select
                                    value={form.role}
                                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                                    className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg focus:border-purple-500 focus:outline-none text-white"
                                >
                                    <option value="admin">Admin</option>
                                    <option value="author">Author</option>
                                    <option value="editor">Editor</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                                <textarea
                                    value={form.bio}
                                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                                    rows={2}
                                    className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg focus:border-purple-500 focus:outline-none text-white resize-none"
                                    placeholder="A short bio about the user"
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <NeonButton type="submit" disabled={isSubmitting} className="flex-1 justify-center">
                                    {isSubmitting ? 'Creating...' : 'Create User'}
                                </NeonButton>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
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
