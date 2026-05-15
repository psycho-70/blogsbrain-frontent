'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { adminGetContacts, adminMarkContactRead, adminDeleteContact, ContactMessage } from '@/lib/api'
import { Mail, Trash2, MailOpen, Clock, Tag, Search, Filter, AlertCircle, CheckCircle2, User } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

const INQUIRY_COLORS: Record<string, string> = {
    general: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    partnership: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    'guest-post': 'bg-green-500/10 text-green-500 border-green-500/20',
    advertising: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    support: 'bg-red-500/10 text-red-500 border-red-500/20',
    feedback: 'bg-pink-500/10 text-pink-500 border-pink-500/20',
}

const INQUIRY_LABELS: Record<string, string> = {
    general: 'General',
    partnership: 'Partnership',
    'guest-post': 'Guest Post',
    advertising: 'Advertising',
    support: 'Support',
    feedback: 'Feedback',
}

export default function AdminContactsPage() {
    const { isDark } = useTheme()
    const router = useRouter()
    const [contacts, setContacts] = useState<ContactMessage[]>([])
    const [filtered, setFiltered] = useState<ContactMessage[]>([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selected, setSelected] = useState<ContactMessage | null>(null)
    const [statusFilter, setStatusFilter] = useState<'all' | 'read' | 'unread'>('all')
    const [search, setSearch] = useState('')
    const [deletingId, setDeletingId] = useState<number | null>(null)

    const fetchContacts = async () => {
        const token = localStorage.getItem('token')
        if (!token) { router.push('/admin/login'); return }
        try {
            const data = await adminGetContacts(token, statusFilter)
            setContacts(data.contacts)
            setUnreadCount(data.unread_count)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load messages')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => { fetchContacts() }, [statusFilter])

    useEffect(() => {
        const q = search.toLowerCase()
        setFiltered(
            q
                ? contacts.filter(c =>
                    c.name.toLowerCase().includes(q) ||
                    c.email.toLowerCase().includes(q) ||
                    c.subject.toLowerCase().includes(q) ||
                    c.message.toLowerCase().includes(q)
                )
                : contacts
        )
    }, [contacts, search])

    const handleOpen = async (contact: ContactMessage) => {
        setSelected(contact)
        if (!contact.is_read) {
            const token = localStorage.getItem('token') || ''
            try {
                await adminMarkContactRead(token, contact.id)
                setContacts(prev => prev.map(c => c.id === contact.id ? { ...c, is_read: true } : c))
                setUnreadCount(prev => Math.max(0, prev - 1))
            } catch {/* silently ignore */ }
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this message? This cannot be undone.')) return
        const token = localStorage.getItem('token') || ''
        setDeletingId(id)
        try {
            await adminDeleteContact(token, id)
            setContacts(prev => prev.filter(c => c.id !== id))
            if (selected?.id === id) setSelected(null)
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to delete')
        } finally {
            setDeletingId(null)
        }
    }

    const textPrimary = isDark ? 'text-white' : 'text-slate-900'
    const textMuted = isDark ? 'text-gray-400' : 'text-slate-500'
    const cardBg = isDark ? 'bg-gray-800/30 backdrop-blur-sm border-gray-700' : 'bg-white/60 backdrop-blur-sm border-slate-200 shadow-sm'
    const inputBg = isDark ? 'bg-gray-900/50 border-gray-700 text-white' : 'bg-white border-slate-300 text-slate-900'

    return (
        <div className="space-y-8 relative z-10">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className={`text-3xl font-bold mb-2 ${textPrimary}`}>Contact Messages</h1>
                    <div className="flex items-center gap-3">
                        <p className={textMuted}>Inbox from the Contact Us form</p>
                        {unreadCount > 0 && (
                            <span className="px-2 py-0.5 bg-purple-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg shadow-purple-500/20">
                                {unreadCount} New
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Search bar */}
                    <div className="relative">
                        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${textMuted}`} />
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search inbox..."
                            className={`pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all ${inputBg}`}
                        />
                    </div>

                    <div className={`p-1 rounded-xl border flex ${isDark ? 'bg-gray-900/50 border-gray-700' : 'bg-slate-100 border-slate-200'}`}>
                        {(['all', 'unread', 'read'] as const).map(s => (
                            <button
                                key={s}
                                onClick={() => setStatusFilter(s)}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${statusFilter === s
                                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                                        : `${textMuted} hover:text-purple-400`
                                    }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="grid lg:grid-cols-5 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className={`h-24 animate-pulse rounded-2xl ${isDark ? 'bg-gray-800/20' : 'bg-slate-100'}`} />
                        ))}
                    </div>
                    <div className={`lg:col-span-3 rounded-2xl animate-pulse ${isDark ? 'bg-gray-800/20' : 'bg-slate-100'}`} />
                </div>
            ) : filtered.length === 0 ? (
                <div className={`text-center py-20 rounded-3xl border-2 border-dashed ${isDark ? 'border-gray-800' : 'border-slate-200'}`}>
                    <Mail className={`w-12 h-12 mx-auto mb-4 opacity-20 ${textPrimary}`} />
                    <h3 className={`text-xl font-bold mb-1 ${textPrimary}`}>No messages found</h3>
                    <p className={textMuted}>Your inbox is currently clear.</p>
                </div>
            ) : (
                <div className="grid lg:grid-cols-5 gap-6 h-[calc(100vh-280px)]">
                    {/* Message List */}
                    <div className="lg:col-span-2 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
                        <AnimatePresence>
                            {filtered.map(contact => (
                                <motion.div
                                    key={contact.id}
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    onClick={() => handleOpen(contact)}
                                    className={`relative cursor-pointer rounded-2xl border p-5 transition-all group ${selected?.id === contact.id
                                            ? 'border-purple-500/60 bg-purple-500/10 shadow-lg shadow-purple-500/5'
                                            : !contact.is_read
                                                ? (isDark ? 'border-purple-500/30 bg-purple-500/5' : 'border-purple-200 bg-purple-50')
                                                : (isDark ? 'border-gray-800 bg-gray-800/20 hover:bg-gray-800/40' : 'border-slate-100 bg-white hover:bg-slate-50 shadow-sm')
                                        }`}
                                >
                                    {!contact.is_read && (
                                        <div className="absolute top-5 right-5 w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                                    )}

                                    <div className="flex items-start gap-4">
                                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center flex-shrink-0 text-sm font-bold text-transparent bg-clip-text bg-gradient-to-br from-purple-500 to-blue-500 border ${isDark ? 'border-gray-700' : 'border-purple-100'}`}>
                                            {contact.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`font-bold text-sm truncate ${textPrimary}`}>{contact.name}</span>
                                                <span className={`text-[9px] px-1.5 py-0.5 rounded-full border font-bold uppercase tracking-widest ${INQUIRY_COLORS[contact.inquiry_type] || INQUIRY_COLORS.general}`}>
                                                    {INQUIRY_LABELS[contact.inquiry_type] || contact.inquiry_type}
                                                </span>
                                            </div>
                                            <p className={`text-xs font-semibold truncate ${selected?.id === contact.id ? 'text-purple-400' : textPrimary}`}>{contact.subject}</p>
                                            <p className={`text-xs mt-1 line-clamp-1 ${textMuted}`}>{contact.message}</p>

                                            <div className="flex items-center justify-between mt-4">
                                                <div className={`flex items-center gap-1 text-[10px] ${textMuted}`}>
                                                    <Clock className="w-3 h-3" />
                                                    {new Date(contact.created_at).toLocaleDateString()}
                                                </div>
                                                <button
                                                    onClick={e => { e.stopPropagation(); handleDelete(contact.id) }}
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Message Detail Panel */}
                    <div className="lg:col-span-3">
                        <AnimatePresence mode="wait">
                            {selected ? (
                                <motion.div
                                    key={selected.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className={`h-full flex flex-col rounded-3xl border overflow-hidden ${cardBg}`}
                                >
                                    {/* Detail Header */}
                                    <div className={`p-8 border-b ${isDark ? 'border-white/5 bg-gray-900/40' : 'bg-slate-50/80 border-slate-200'}`}>
                                        <div className="flex items-start justify-between gap-6">
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <span className={`text-xs px-2.5 py-1 rounded-full border font-bold uppercase tracking-widest ${INQUIRY_COLORS[selected.inquiry_type] || INQUIRY_COLORS.general}`}>
                                                        {INQUIRY_LABELS[selected.inquiry_type] || selected.inquiry_type}
                                                    </span>
                                                    <div className={`flex items-center gap-1 text-xs ${textMuted}`}>
                                                        <Clock className="w-3.5 h-3.5" />
                                                        {new Date(selected.created_at).toLocaleString()}
                                                    </div>
                                                </div>
                                                <h2 className={`text-2xl font-black ${textPrimary}`}>{selected.subject}</h2>

                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-purple-500/20">
                                                        {selected.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className={`font-bold ${textPrimary}`}>{selected.name}</p>
                                                        <p className={`text-sm ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>{selected.email}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex gap-2">
                                                {selected.is_read && (
                                                    <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-green-500 mr-2">
                                                        <MailOpen size={14} /> Read
                                                    </div>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(selected.id)}
                                                    className="p-3 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-500/5 group"
                                                >
                                                    <Trash2 size={20} className="transition-transform group-hover:scale-110" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Message body */}
                                    <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
                                        <div className={`p-6 rounded-2xl leading-relaxed whitespace-pre-wrap ${isDark ? 'bg-gray-900/50 text-gray-300' : 'bg-white text-slate-700 shadow-sm'}`}>
                                            {selected.message}
                                        </div>

                                        <div className={`mt-8 p-6 rounded-3xl border border-dashed flex flex-col md:flex-row md:items-center justify-between gap-4 ${isDark ? 'bg-purple-900/5 border-purple-500/20' : 'bg-purple-50 border-purple-200'}`}>
                                            <div>
                                                <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${textMuted}`}>Quick Action</p>
                                                <p className={`text-sm font-medium ${textPrimary}`}>Respond to {selected.name} via email</p>
                                            </div>
                                            <a
                                                href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
                                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold transition-all hover:scale-[1.02] hover:shadow-xl shadow-purple-500/20"
                                            >
                                                <Mail className="w-4 h-4" />
                                                Send Reply
                                            </a>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className={`h-full flex flex-col items-center justify-center rounded-3xl border-2 border-dashed ${isDark ? 'border-gray-800' : 'border-slate-200'}`}>
                                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${isDark ? 'bg-gray-800/50' : 'bg-slate-50'}`}>
                                        <MailOpen className={`w-8 h-8 opacity-20 ${textPrimary}`} />
                                    </div>
                                    <h3 className={`text-xl font-bold mb-2 ${textPrimary}`}>Select a message</h3>
                                    <p className={textMuted}>Click on an item in the sidebar to read the full content.</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            )}

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
