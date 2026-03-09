'use client'

import { useState, useEffect } from 'react'
import { adminGetComments, adminPublishComment, adminDenyComment, adminDeleteComment, Comment } from '@/lib/api'
import { Check, X, Trash2, MessageSquare, Clock } from 'lucide-react'

export default function AdminCommentsPage() {
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

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-8">Comments Management</h1>

            <div className="flex gap-4 mb-8">
                {['all', 'pending', 'published'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f as any)}
                        className={`px-4 py-2 rounded-lg capitalize ${filter === f ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400'}`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            <div className="space-y-4">
                {loading ? (
                    <div className="text-center text-gray-400">Loading...</div>
                ) : comments.length === 0 ? (
                    <div className="text-center text-gray-400">No comments found.</div>
                ) : (
                    comments.map(comment => (
                        <div key={comment.id} className="bg-gray-800 p-6 rounded-xl border border-gray-700 flex flex-col md:flex-row gap-4 justify-between items-start">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="font-bold text-white">{comment.name}</span>
                                    <span className="text-sm text-gray-500">{new Date(comment.created_at).toLocaleDateString()}</span>
                                    <span className={`text-xs px-2 py-1 rounded ${comment.is_published ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>
                                        {comment.is_published ? 'Published' : 'Pending'}
                                    </span>
                                </div>
                                <div className="text-sm text-purple-400 mb-2">
                                    On: {comment.blog_title || 'Blog #' + comment.blog_id}
                                </div>
                                <p className="text-gray-300">{comment.content}</p>
                            </div>

                            <div className="flex gap-2">
                                {!comment.is_published && (
                                    <button onClick={() => handlePublish(comment.id)} className="p-2 bg-green-900/50 text-green-300 rounded hover:bg-green-900 transition-colors" title="Approve">
                                        <Check size={18} />
                                    </button>
                                )}
                                {comment.is_published && (
                                    <button onClick={() => handleDeny(comment.id)} className="p-2 bg-yellow-900/50 text-yellow-300 rounded hover:bg-yellow-900 transition-colors" title="Hide">
                                        <X size={18} />
                                    </button>
                                )}
                                <button onClick={() => handleDelete(comment.id)} className="p-2 bg-red-900/50 text-red-300 rounded hover:bg-red-900 transition-colors" title="Delete">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
