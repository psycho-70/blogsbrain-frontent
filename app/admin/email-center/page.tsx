'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { adminGetSubscribers, adminSendEmail, adminSendNewsletter } from '@/lib/api'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Users, Send, BookOpen, Check, X, Loader2, AlertCircle, Sparkles, CheckCircle2, Tag } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import NeonButton from '@/components/ui/NeonButton'

interface Subscriber {
    email: string
    name: string
}

export default function EmailCenter() {
    const { isDark } = useTheme()
    const router = useRouter()
    const [token, setToken] = useState<string | null>(null)
    const [subscribers, setSubscribers] = useState<Subscriber[]>([])
    const [selectedEmails, setSelectedEmails] = useState<string[]>([])
    const [subject, setSubject] = useState('')
    const [content, setContent] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [isSending, setIsSending] = useState(false)
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null)

    useEffect(() => {
        const storedToken = localStorage.getItem('token')
        if (!storedToken) {
            router.push('/admin/login')
            return
        }
        setToken(storedToken)
        fetchSubscribers(storedToken)
    }, [router])

    const fetchSubscribers = async (t: string) => {
        try {
            setIsLoading(true)
            const data = await adminGetSubscribers(t)
            setSubscribers(data)
            setSelectedEmails(data.map(s => s.email))
        } catch (err) {
            console.error('Failed to fetch subscribers', err)
            setMessage({ text: 'Failed to load subscribers. Check your connection.', type: 'error' })
        } finally {
            setIsLoading(false)
        }
    }

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedEmails(subscribers.map(s => s.email))
        } else {
            setSelectedEmails([])
        }
    }

    const toggleRecipient = (email: string) => {
        setSelectedEmails(prev =>
            prev.includes(email) ? prev.filter(e => e !== email) : [...prev, email]
        )
    }

    const handleSendCustom = async () => {
        if (!token || !subject || !content || selectedEmails.length === 0) {
            setMessage({ text: 'Please fill in all fields and select recipients.', type: 'error' })
            return
        }

        try {
            setIsSending(true)
            setMessage(null)
            await adminSendEmail(token, { subject, content, recipients: selectedEmails })
            setMessage({ text: `Successfully sent custom email to ${selectedEmails.length} recipients!`, type: 'success' })
            setSubject('')
            setContent('')
        } catch (err: any) {
            setMessage({ text: err.message || 'Failed to send emails.', type: 'error' })
        } finally {
            setIsSending(false)
        }
    }

    const handleSendNewsletter = async () => {
        if (!token || selectedEmails.length === 0) {
            setMessage({ text: 'Please select recipients.', type: 'error' })
            return
        }

        if (!confirm(`Are you sure you want to send the latest blogs to ${selectedEmails.length} recipients?`)) return

        try {
            setIsSending(true)
            setMessage(null)
            await adminSendNewsletter(token, selectedEmails)
            setMessage({ text: `Latest blogs newsletter sent to ${selectedEmails.length} recipients!`, type: 'success' })
        } catch (err: any) {
            setMessage({ text: err.message || 'Failed to send newsletter.', type: 'error' })
        } finally {
            setIsSending(false)
        }
    }

    const textPrimary = isDark ? 'text-white' : 'text-slate-900'
    const textMuted = isDark ? 'text-gray-400' : 'text-slate-500'
    const cardBg = isDark ? 'bg-gray-800/30 backdrop-blur-sm border-gray-700' : 'bg-white/60 backdrop-blur-sm border-slate-200 shadow-sm'
    const inputBg = isDark ? 'bg-gray-900/50 border-gray-700 text-white' : 'bg-white border-slate-300 text-slate-900'

    if (isLoading) {
        return (
            <div className="min-h-[400px] flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
                <p className={textMuted}>Preparing environment...</p>
            </div>
        )
    }

    return (
        <div className="space-y-8 relative z-10 pb-12">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <h1 className={`text-3xl font-black ${textPrimary}`}>
                        Email Marketing Center
                    </h1>
                    <p className={textMuted}>Send custom messages or latest updates to your subscribers.</p>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={handleSendNewsletter}
                        disabled={isSending || selectedEmails.length === 0}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl border font-bold transition-all disabled:opacity-50 ${isDark ? 'bg-blue-600/10 text-blue-400 border-blue-500/30 hover:bg-blue-600/20' : 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100'}`}
                    >
                        <BookOpen size={18} />
                        Send Latest News
                    </button>
                </div>
            </header>

            <AnimatePresence mode="wait">
                {message && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`p-4 rounded-xl flex items-center gap-3 border ${message.type === 'success'
                            ? 'bg-green-500/10 text-green-500 border-green-500/20'
                            : 'bg-red-500/10 text-red-500 border-red-500/20'
                            }`}
                    >
                        {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                        <span className="font-medium">{message.text}</span>
                        <button onClick={() => setMessage(null)} className="ml-auto opacity-50 hover:opacity-100 transition-opacity">
                            <X size={18} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sidebar: Recipient List */}
                <div className="lg:col-span-1 space-y-6">
                    <div className={`rounded-3xl border p-8 flex flex-col h-[700px] ${cardBg}`}>
                        <div className="flex items-center justify-between mb-8">
                            <h3 className={`text-xl font-black flex items-center gap-3 ${textPrimary}`}>
                                <Users size={24} className="text-purple-500" />
                                Recipients
                                <span className={`text-xs px-2 py-0.5 rounded-full font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20`}>
                                    {selectedEmails.length}/{subscribers.length}
                                </span>
                            </h3>
                            <label className={`flex items-center gap-2 text-sm font-bold cursor-pointer transition-colors ${textMuted} hover:text-purple-500`}>
                                <input
                                    type="checkbox"
                                    checked={selectedEmails.length === subscribers.length && subscribers.length > 0}
                                    onChange={(e) => handleSelectAll(e.target.checked)}
                                    className="rounded border-gray-700 bg-gray-800 text-purple-600 focus:ring-purple-500"
                                />
                                SELECT ALL
                            </label>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                            {subscribers.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                                    <Users size={48} className="mb-4" />
                                    <p className="font-bold uppercase tracking-widest text-xs">No Subscribers Yet</p>
                                </div>
                            ) : (
                                subscribers.map(s => (
                                    <div
                                        key={s.email}
                                        onClick={() => toggleRecipient(s.email)}
                                        className={`flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer group ${selectedEmails.includes(s.email)
                                            ? 'bg-purple-500/10 border-purple-500/30'
                                            : `border-transparent hover:${isDark ? 'bg-white/5' : 'bg-slate-50'}`
                                            }`}
                                    >
                                        <div className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-colors ${selectedEmails.includes(s.email)
                                            ? 'bg-purple-500 border-purple-500 text-white'
                                            : `${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-300'}`
                                            }`}>
                                            {selectedEmails.includes(s.email) && <Check size={14} className="stroke-[3]" />}
                                        </div>
                                        <div className="min-w-0">
                                            <p className={`text-sm font-black truncate ${selectedEmails.includes(s.email) ? 'text-purple-400' : textPrimary}`}>
                                                {s.name || 'Anonymous Reader'}
                                            </p>
                                            <p className={`text-[10px] uppercase font-bold tracking-widest truncate ${textMuted}`}>
                                                {s.email}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className={`mt-6 pt-6 border-t ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
                            <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-4 ${textMuted}`}>Quick Filter</p>
                            <div className="flex flex-wrap gap-2">
                                <button onClick={() => setSelectedEmails([])} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${isDark ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>NONE</button>
                                <button onClick={() => setSelectedEmails(subscribers.map(s => s.email))} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${isDark ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>ALL</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main: Email Composer */}
                <div className="lg:col-span-2 space-y-6">
                    <div className={`rounded-3xl border p-10 shadow-2xl flex flex-col min-h-[700px] ${cardBg}`}>
                        <div className="flex items-center gap-4 mb-10 pb-8 border-b border-white/5">
                            <div className={`p-4 rounded-2xl flex items-center justify-center ${isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-50 text-purple-600'}`}>
                                <Sparkles size={28} />
                            </div>
                            <div>
                                <h2 className={`text-2xl font-black ${textPrimary}`}>Craft Your Message</h2>
                                <p className={textMuted}>Compose a beautiful email to your selected audience</p>
                            </div>
                        </div>

                        <div className="space-y-8 flex-1">
                            <div>
                                <label className={`block text-xs font-bold uppercase tracking-[0.2em] mb-3 ${textMuted}`}>Email Subject</label>
                                <div className="relative">
                                    <Tag className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${textMuted}`} />
                                    <input
                                        type="text"
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        placeholder="What's this email about?"
                                        className={`w-full pl-12 pr-6 py-4 rounded-2xl border focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all font-bold ${inputBg}`}
                                    />
                                </div>
                            </div>

                            <div className="flex-1 flex flex-col">
                                <label className={`block text-xs font-bold uppercase tracking-[0.2em] mb-3 ${textMuted}`}>Message Content (HTML Allowed)</label>
                                <div className="relative flex-1">
                                    <textarea
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        placeholder="Start typing your masterpiece here..."
                                        className={`w-full h-full min-h-[300px] px-8 py-6 rounded-3xl border focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all font-mono text-sm leading-relaxed resize-none ${inputBg}`}
                                    />
                                </div>
                            </div>

                            <div className="pt-8">
                                <button
                                    onClick={handleSendCustom}
                                    disabled={isSending || !subject || !content || selectedEmails.length === 0}
                                    className={`w-full group relative py-6 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-black text-xl shadow-2xl transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:scale-100 disabled:shadow-none overflow-hidden`}
                                >
                                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="relative flex items-center justify-center gap-3">
                                        {isSending ? (
                                            <>
                                                <Loader2 size={24} className="animate-spin" />
                                                DISPATCHING TO {selectedEmails.length}...
                                            </>
                                        ) : (
                                            <>
                                                <Send size={24} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                                                LAUNCH NEWSLETTER
                                            </>
                                        )}
                                    </div>
                                </button>
                                <p className={`mt-4 text-center text-xs font-bold uppercase tracking-widest ${textMuted}`}>
                                    Recipients selected: {selectedEmails.length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: ${isDark ? '#1f2937' : '#e2e8f0'};
                    border-radius: 20px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: ${isDark ? '#374151' : '#cbd5e1'};
                }
            `}</style>
        </div>
    )
}
