'use client'

import { useState, useEffect } from 'react'
import { adminGetComments, adminPublishComment, adminDenyComment, adminDeleteComment, Comment } from '@/lib/api'
import { Check, X, Trash2, MessageSquare, Clock, Filter, AlertCircle, CheckCircle2, BookOpen } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { motion, AnimatePresence } from 'framer-motion'

export default function AdminCommentsPage() {
    const { isDark } = useTheme()
    const [comments, setComments] = useState<Comment[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<'all' | 'pending' | 'published'>('all')

    useEffect(() => {
        loadComments()
    }, [filter])

    async function loadComments() {
        try {
            setLoading(true)
            const token = localStorage.getItem('token')
            if (!token) return

            const status = filter === 'all' ? undefined : filter
            const res = await adminGetComments(token, status)
            setComments(res.comments)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    async function handlePublish(id: number) {
        try {
            const token = localStorage.getItem('token')
            if (!token) return
            await adminPublishComment(token, id)
            loadComments()
        } catch (err) {
            console.error(err)
        }
    }

    async function handleDeny(id: number) {
        try {
            const token = localStorage.getItem('token')
            if (!token) return
            await adminDenyComment(token, id)
            loadComments()
        } catch (err) {
            console.error(err)
        }
    }

    async function handleDelete(id: number) {
        if (!confirm('Are you sure you want to delete this comment?')) return
        try {
            const token = localStorage.getItem('token')
            if (!token) return
            await adminDeleteComment(token, id)
            loadComments()
        } catch (err) {
            console.error(err)
        }
    }

    const textPrimary = isDark ? 'text-white' : 'text-slate-900'
    const textMuted = isDark ? 'text-gray-400' : 'text-slate-500'
    const cardBg = isDark ? 'bg-gray-800/30 backdrop-blur-sm border-gray-700' : 'bg-white/60 backdrop-blur-sm border-slate-200 shadow-sm'

    return (
        <div className="space-y-8 relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className={`text-3xl font-bold mb-2 ${textPrimary}`}>Comments Management</h1>
                    <p className={textMuted}>Review and moderate user interactions on your blogs</p>
                </div>

                <div className={`flex p-1 rounded-xl border ${isDark ? 'bg-gray-900/50 border-gray-700' : 'bg-slate-100 border-slate-200'}`}>
                    {(['all', 'pending', 'published'] as const).map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg capitalize text-sm font-medium transition-all ${filter === f
                                ? 'bg-purple-600 text-white shadow-lg'
                                : `${textMuted} hover:text-purple-400`
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                {loading ? (
                    <div className="p-12 text-center">
                        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className={textMuted}>Loading comments...</p>
                    </div>
                ) : comments.length === 0 ? (
                    <div className={`p-12 text-center rounded-2xl border border-dashed ${isDark ? 'border-gray-700' : 'border-slate-300'}`}>
                        <MessageSquare className={`w-12 h-12 mx-auto mb-4 opacity-20 ${textPrimary}`} />
                        <h3 className={`text-xl font-bold mb-1 ${textPrimary}`}>No comments found</h3>
                        <p className={textMuted}>There are no comments matching your current filter.</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        <AnimatePresence>
                            {comments.map(comment => (
                                <motion.div
                                    key={comment.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className={`p-6 rounded-2xl border transition-all ${cardBg} hover:border-purple-500/30 group`}
                                >
                                    <div className="flex flex-col md:flex-row gap-6 justify-between items-start">
                                        <div className="flex-1 space-y-3">
                                            <div className="flex items-center gap-3 flex-wrap">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
                                                    {comment.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <h4 className={`font-bold ${textPrimary}`}>{comment.name}</h4>
                                                    <div className="flex items-center gap-2 text-xs">
                                                        <span className={textMuted}>{new Date(comment.created_at).toLocaleDateString()}</span>
                                                        <span className={`px-2 py-0.5 rounded-full font-bold tracking-wider uppercase text-[10px] ${comment.is_published
                                                            ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                                            : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                                                            }`}>
                                                            {comment.is_published ? 'Published' : 'Pending'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className={`text-sm font-medium flex items-center gap-1.5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                                                <BookOpen size={14} />
                                                On: {comment.blog_title || 'Blog #' + comment.blog_id}
                                            </div>

                                            <p className={`leading-relaxed ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
                                                {comment.content}
                                            </p>
                                        </div>

                                        <div className="flex md:flex-col gap-2 w-full md:w-auto">
                                            {!comment.is_published && (
                                                <button
                                                    onClick={() => handlePublish(comment.id)}
                                                    className="flex-1 md:w-10 md:h-10 flex items-center justify-center bg-green-500/10 text-green-500 border border-green-500/20 rounded-xl hover:bg-green-500 hover:text-white transition-all"
                                                    title="Approve"
                                                >
                                                    <Check size={18} />
                                                    <span className="md:hidden ml-2 font-medium">Approve</span>
                                                </button>
                                            )}
                                            {comment.is_published && (
                                                <button
                                                    onClick={() => handleDeny(comment.id)}
                                                    className="flex-1 md:w-10 md:h-10 flex items-center justify-center bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded-xl hover:bg-yellow-500 hover:text-white transition-all"
                                                    title="Hide"
                                                >
                                                    <X size={18} />
                                                    <span className="md:hidden ml-2 font-medium">Hide</span>
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(comment.id)}
                                                className="flex-1 md:w-10 md:h-10 flex items-center justify-center bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                                <span className="md:hidden ml-2 font-medium">Delete</span>
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    )
}
