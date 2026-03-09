'use client'

import { useState, useEffect } from 'react'
import { getComments, postComment, Comment } from '@/lib/api'
import { User, MessageSquare, Send } from 'lucide-react'
import NeonButton from '@/components/ui/NeonButton'

export default function CommentSection({ blogId }: { blogId: number }) {
    const [comments, setComments] = useState<Comment[]>([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [formData, setFormData] = useState({ name: '', email: '', content: '' })
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null)

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
        } catch (err) {
            setMessage({ text: 'Failed to submit comment.', type: 'error' })
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="mt-16 pt-12 border-t border-gray-800">
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
                <MessageSquare className="text-purple-500" />
                Comments ({comments.length})
            </h3>

            {/* Comment Form */}
            <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800 mb-12 backdrop-blur-sm">
                <h4 className="text-lg font-semibold text-white mb-4">Leave a Reply</h4>
                {message && (
                    <div className={`p-4 mb-4 rounded-lg ${message.type === 'success' ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}>
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
                            className="w-full px-4 py-3 bg-gray-800 rounded-xl border border-gray-700 text-white focus:outline-none focus:border-purple-500 transition-colors"
                            required
                        />
                        <input
                            type="email"
                            placeholder="Email (optional)"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-800 rounded-xl border border-gray-700 text-white focus:outline-none focus:border-purple-500 transition-colors"
                        />
                    </div>
                    <textarea
                        placeholder="Your comment *"
                        value={formData.content}
                        onChange={e => setFormData({ ...formData, content: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-800 rounded-xl border border-gray-700 text-white focus:outline-none focus:border-purple-500 transition-colors min-h-[120px]"
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
                    <div className="text-center text-gray-500">Loading comments...</div>
                ) : comments.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">Be the first to comment!</div>
                ) : (
                    comments.map(comment => (
                        <div key={comment.id} className="bg-gray-800/30 p-6 rounded-2xl border border-gray-800/50">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-purple-900/50 flex items-center justify-center text-purple-300 shrink-0">
                                    <User size={20} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h5 className="font-semibold text-white">{comment.name}</h5>
                                            <span className="text-xs text-gray-500">
                                                {new Date(comment.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-gray-300 text-sm leading-relaxed">{comment.content}</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
