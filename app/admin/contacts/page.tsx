'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { adminGetContacts, adminMarkContactRead, adminDeleteContact, ContactMessage } from '@/lib/api'
import { Mail, Trash2, MailOpen, Clock, Tag, Search, Filter } from 'lucide-react'

const INQUIRY_COLORS: Record<string, string> = {
    general: 'bg-blue-900/30 text-blue-300 border-blue-500/30',
    partnership: 'bg-purple-900/30 text-purple-300 border-purple-500/30',
    'guest-post': 'bg-green-900/30 text-green-300 border-green-500/30',
    advertising: 'bg-yellow-900/30 text-yellow-300 border-yellow-500/30',
    support: 'bg-red-900/30 text-red-300 border-red-500/30',
    feedback: 'bg-pink-900/30 text-pink-300 border-pink-500/30',
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

    // Client-side keyword filter
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

    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className="bg-gray-900/50 backdrop-blur-md border-b border-purple-500/20 mb-8">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                                Contact Messages
                            </h1>
                            <p className="text-gray-400 mt-1">
                                Inbox from the Contact Us form
                                {unreadCount > 0 && (
                                    <span className="ml-2 px-2 py-0.5 bg-purple-600/30 text-purple-300 text-xs rounded-full border border-purple-500/40">
                                        {unreadCount} unread
                                    </span>
                                )}
                            </p>
                        </div>

                        {/* Stats pill row */}
                        <div className="flex gap-3 flex-wrap">
                            {(['all', 'unread', 'read'] as const).map(s => (
                                <button
                                    key={s}
                                    onClick={() => setStatusFilter(s)}
                                    className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all capitalize ${statusFilter === s
                                            ? 'bg-purple-600/40 border-purple-500/60 text-white'
                                            : 'bg-gray-800/40 border-gray-700/40 text-gray-400 hover:border-purple-500/40 hover:text-white'
                                        }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Search bar */}
                    <div className="mt-5 relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search by name, email, subject…"
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-800/50 border border-gray-700/50 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                        />
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 pb-12">
                {isLoading ? (
                    <div className="grid gap-4">
                        {Array(5).fill(0).map((_, i) => (
                            <div key={i} className="h-20 bg-gray-800/30 animate-pulse rounded-xl" />
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-center py-20 text-red-400">
                        <Mail className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>{error}</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20 text-gray-500 border-2 border-dashed border-white/5 rounded-2xl">
                        <Mail className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p>No messages found.</p>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-5 gap-6">
                        {/* Message List */}
                        <div className="lg:col-span-2 space-y-3">
                            <AnimatePresence>
                                {filtered.map(contact => (
                                    <motion.div
                                        key={contact.id}
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        onClick={() => handleOpen(contact)}
                                        className={`relative cursor-pointer rounded-xl border p-4 transition-all ${selected?.id === contact.id
                                                ? 'border-purple-500/60 bg-purple-900/20'
                                                : contact.is_read
                                                    ? 'border-white/5 bg-gray-800/20 hover:bg-gray-800/40'
                                                    : 'border-purple-500/30 bg-purple-950/20 hover:bg-purple-950/30'
                                            }`}
                                    >
                                        {/* Unread dot */}
                                        {!contact.is_read && (
                                            <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-purple-400" />
                                        )}

                                        <div className="flex items-start gap-3">
                                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-600/40 to-blue-600/40 flex items-center justify-center flex-shrink-0 text-sm font-bold text-white border border-purple-500/20">
                                                {contact.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="font-semibold text-white text-sm truncate">{contact.name}</span>
                                                    <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${INQUIRY_COLORS[contact.inquiry_type] || INQUIRY_COLORS.general}`}>
                                                        {INQUIRY_LABELS[contact.inquiry_type] || contact.inquiry_type}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-400 truncate mt-0.5">{contact.subject}</p>
                                                <p className="text-xs text-gray-500 mt-1 line-clamp-1">{contact.message}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mt-3">
                                            <span className="text-[10px] text-gray-600 flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {new Date(contact.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                            <button
                                                onClick={e => { e.stopPropagation(); handleDelete(contact.id) }}
                                                disabled={deletingId === contact.id}
                                                className="text-gray-600 hover:text-red-400 transition-colors p-1 rounded disabled:opacity-40"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
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
                                        transition={{ duration: 0.2 }}
                                        className="bg-gray-900/50 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden"
                                    >
                                        {/* Detail Header */}
                                        <div className="p-6 border-b border-white/5 bg-gradient-to-r from-purple-900/20 to-blue-900/20">
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <h2 className="text-xl font-bold text-white">{selected.subject}</h2>
                                                    <div className="flex flex-wrap items-center gap-3 mt-2">
                                                        <span className="flex items-center gap-1.5 text-sm text-gray-300">
                                                            <div className="w-5 h-5 rounded-full bg-purple-600/50 flex items-center justify-center text-xs font-bold">
                                                                {selected.name.charAt(0).toUpperCase()}
                                                            </div>
                                                            {selected.name}
                                                        </span>
                                                        <span className="text-sm text-blue-400">{selected.email}</span>
                                                        <span className={`text-xs px-2 py-0.5 rounded border ${INQUIRY_COLORS[selected.inquiry_type] || INQUIRY_COLORS.general}`}>
                                                            {INQUIRY_LABELS[selected.inquiry_type] || selected.inquiry_type}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 flex-shrink-0">
                                                    {selected.is_read && (
                                                        <span className="flex items-center gap-1 text-xs text-green-400">
                                                            <MailOpen className="w-3.5 h-3.5" /> Read
                                                        </span>
                                                    )}
                                                    <button
                                                        onClick={() => handleDelete(selected.id)}
                                                        disabled={deletingId === selected.id}
                                                        className="p-2 rounded-lg bg-red-900/20 border border-red-500/20 text-red-400 hover:bg-red-900/40 transition-all disabled:opacity-40"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-3 flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {new Date(selected.created_at).toLocaleString('en-US', {
                                                    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
                                                    hour: '2-digit', minute: '2-digit'
                                                })}
                                            </p>
                                        </div>

                                        {/* Message body */}
                                        <div className="p-6">
                                            <p className="text-gray-100 leading-relaxed whitespace-pre-wrap">{selected.message}</p>

                                            <div className="mt-6 p-4 rounded-xl bg-gray-800/30 border border-white/5">
                                                <p className="text-xs text-gray-500 mb-1">Reply to</p>
                                                <a
                                                    href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
                                                    className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors font-medium"
                                                >
                                                    <Mail className="w-4 h-4" />
                                                    {selected.email}
                                                </a>
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="empty"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="h-80 flex flex-col items-center justify-center text-gray-600 border-2 border-dashed border-white/5 rounded-2xl"
                                    >
                                        <Mail className="w-10 h-10 mb-3 opacity-30" />
                                        <p className="text-sm">Select a message to read it</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
