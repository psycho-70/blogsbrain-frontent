'use client'

import { useState, useEffect } from 'react'
import { getComments, postComment, Comment } from '@/lib/api'
import { User, MessageSquare, Send } from 'lucide-react'
import NeonButton from '@/components/ui/NeonButton'
import { useTheme } from '@/contexts/ThemeContext'

export default function CommentSection({ blogId }: { blogId: number }) {
    const [comments, setComments] = useState<Comment[]>([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [formData, setFormData] = useState({ name: '', email: '', content: '' })
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null)
    const { isDark } = useTheme()

    useEffect(() => {
        if (blogId) {
            loadComments()
        }
    }, [blogId])

    async function loadComments() {
        try {
            setLoading(true)
            const res = await getComments(blogId)
            setComments(res.comments)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!formData.name || !formData.content) return

        try {
            setSubmitting(true)
            await postComment(blogId, formData)
            setMessage({ text: 'Comment submitted for approval!', type: 'success' })
            setFormData({ name: '', email: '', content: '' })
            // Reload comments after successful submission
            setTimeout(() => loadComments(), 1000)
        } catch (err) {
            setMessage({ text: 'Failed to submit comment.', type: 'error' })
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className={`mt-16 pt-12 border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
            <h3 className={`text-2xl font-bold mb-8 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <MessageSquare className="text-purple-500" />
                Comments ({comments.length})
            </h3>

            {/* Comment Form */}
            <div className={`p-6 rounded-2xl border backdrop-blur-sm mb-12 ${
                isDark
                    ? 'bg-gray-900/50 border-gray-800'
                    : 'bg-white/70 border-gray-200 shadow-sm'
            }`}>
                <h4 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Leave a Reply</h4>
                {message && (
                    <div className={`p-4 mb-4 rounded-lg ${
                        message.type === 'success' 
                            ? isDark 
                                ? 'bg-green-900/50 text-green-300' 
                                : 'bg-green-100 text-green-700'
                            : isDark
                                ? 'bg-red-900/50 text-red-300'
                                : 'bg-red-100 text-red-700'
                    }`}>
                        {message.text}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Name *"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className={`w-full px-4 py-3 rounded-xl border transition-colors focus:outline-none focus:border-purple-500 ${
                                isDark
                                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                                    : 'bg-gray-100 border-gray-200 text-slate-900 placeholder-slate-400'
                            }`}
                            required
                        />
                        <input
                            type="email"
                            placeholder="Email (optional)"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            className={`w-full px-4 py-3 rounded-xl border transition-colors focus:outline-none focus:border-purple-500 ${
                                isDark
                                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                                    : 'bg-gray-100 border-gray-200 text-slate-900 placeholder-slate-400'
                            }`}
                        />
                    </div>
                    <textarea
                        placeholder="Your comment *"
                        value={formData.content}
                        onChange={e => setFormData({ ...formData, content: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl border transition-colors focus:outline-none focus:border-purple-500 min-h-[120px] ${
                            isDark
                                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                                : 'bg-gray-100 border-gray-200 text-slate-900 placeholder-slate-400'
                        }`}
                        required
                    />
                    <div className="flex justify-end">
                        <NeonButton type="submit" disabled={submitting}>
                            {submitting ? 'Submitting...' : <span className="flex items-center gap-2"><Send size={16} /> Post Comment</span>}
                        </NeonButton>
                    </div>
                </form>
            </div>

            {/* Comments List */}
            <div className="space-y-6">
                {loading ? (
                    <div className={`text-center ${isDark ? 'text-gray-500' : 'text-slate-500'}`}>Loading comments...</div>
                ) : comments.length === 0 ? (
                    <div className={`text-center py-8 ${isDark ? 'text-gray-500' : 'text-slate-500'}`}>Be the first to comment!</div>
                ) : (
                    comments.map(comment => (
                        <div key={comment.id} className={`p-6 rounded-2xl border ${
                            isDark
                                ? 'bg-gray-800/30 border-gray-800/50'
                                : 'bg-gray-100/50 border-gray-200'
                        }`}>
                            <div className="flex items-start gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                                    isDark
                                        ? 'bg-purple-900/50 text-purple-300'
                                        : 'bg-purple-100 text-purple-600'
                                }`}>
                                    <User size={20} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h5 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                                {comment.name}
                                            </h5>
                                            <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>
                                                {new Date(comment.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                    <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
                                        {comment.content}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}