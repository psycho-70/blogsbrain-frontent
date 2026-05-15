'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Star, Clock, LogOut, User, Settings, Sun, Moon, ArrowRight, Sparkles, TrendingUp, Menu, X } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

interface UserData {
    id: number
    name: string
    username: string
    bio: string
    created_at: string
}

const recentArticles = [
    { title: 'The Future of Generative AI in 2026', category: 'Technology', readTime: '5 min', color: 'from-blue-500 to-indigo-500' },
    { title: 'Mastering React Server Components', category: 'Coding', readTime: '8 min', color: 'from-purple-500 to-pink-500' },
    { title: 'Quantum Computing: A Beginner\'s Guide', category: 'Science', readTime: '6 min', color: 'from-green-500 to-emerald-500' },
]

export default function UserDashboard() {
    const router = useRouter()
    const { isDark, toggleTheme, theme } = useTheme()
    const [user, setUser] = useState<UserData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem('token')
        const role = localStorage.getItem('userRole')
        const stored = localStorage.getItem('userData')

        if (!token) {
            router.push('/auth/signin')
            return
        }
        // Admins shouldn't be here
        if (role === 'admin' || role === 'author' || role === 'editor') {
            router.push('/admin/dashboard')
            return
        }
        if (stored) {
            try { setUser(JSON.parse(stored)) } catch { /* ignore */ }
        }
        setIsLoading(false)
    }, [router])

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('userRole')
        localStorage.removeItem('userData')
        router.push('/')
    }

    if (isLoading) {
        return (
            <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${isDark ? 'bg-gray-950' : 'bg-slate-50'}`}>
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}>
                    <div className={`w-10 h-10 border-3 border-t-transparent rounded-full ${isDark ? 'border-purple-500' : 'border-purple-600'}`} style={{ borderWidth: 3 }} />
                </motion.div>
            </div>
        )
    }

    const cardBase = isDark
        ? 'bg-gray-900/60 border-gray-700/50 backdrop-blur-sm'
        : 'bg-white border-slate-200/80 shadow-sm'

    const textMuted = isDark ? 'text-gray-400' : 'text-slate-500'
    const textPrimary = isDark ? 'text-white' : 'text-slate-900'

    const stats = [
        { label: 'Articles Read', value: '24', icon: BookOpen, color: 'text-blue-400', bg: isDark ? 'bg-blue-500/10' : 'bg-blue-50' },
        { label: 'Bookmarked', value: '8', icon: Star, color: 'text-yellow-400', bg: isDark ? 'bg-yellow-500/10' : 'bg-yellow-50' },
        { label: 'Reading Time', value: '3h 24m', icon: Clock, color: 'text-green-400', bg: isDark ? 'bg-green-500/10' : 'bg-green-50' },
        { label: 'Streak Days', value: '5', icon: TrendingUp, color: 'text-purple-400', bg: isDark ? 'bg-purple-500/10' : 'bg-purple-50' },
    ]

    return (
        <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-950' : 'bg-slate-50'}`}>
            {/* Top bar - Mobile Responsive */}
            <header className={`sticky top-0 z-40 border-b backdrop-blur-xl transition-colors duration-300 ${isDark ? 'bg-gray-900/90 border-gray-800' : 'bg-white/90 border-slate-200'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <img src="/headerlogo.png" alt="Einsteine" className="h-10 w-auto object-contain" />
                    </Link>
                    
                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-3">
                        <motion.button
                            onClick={toggleTheme}
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.9 }}
                            className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-300 ${isDark ? 'bg-gray-800 border-gray-700 text-yellow-300 hover:bg-gray-700' : 'bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100'}`}
                        >
                            <AnimatePresence mode="wait" initial={false}>
                                <motion.span
                                    key={theme}
                                    initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                                    exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {isDark ? <Sun size={15} /> : <Moon size={15} />}
                                </motion.span>
                            </AnimatePresence>
                        </motion.button>
                        <button
                            onClick={handleLogout}
                            className={`flex items-center gap-1.5 text-sm font-medium transition-colors duration-300 ${isDark ? 'text-gray-400 hover:text-red-400' : 'text-slate-500 hover:text-red-500'}`}
                        >
                            <LogOut size={15} /> Logout
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex md:hidden items-center gap-2">
                        <motion.button
                            onClick={toggleTheme}
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.9 }}
                            className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-300 ${isDark ? 'bg-gray-800 border-gray-700 text-yellow-300' : 'bg-amber-50 border-amber-200 text-amber-600'}`}
                        >
                            {isDark ? <Sun size={15} /> : <Moon size={15} />}
                        </motion.button>
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-800' : 'hover:bg-slate-100'}`}
                        >
                            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className={`md:hidden border-t ${isDark ? 'bg-gray-900/95 border-gray-800' : 'bg-white/95 border-slate-200'}`}
                        >
                            <div className="px-4 py-3 space-y-2">
                                <button
                                    onClick={handleLogout}
                                    className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${isDark ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
                                >
                                    <LogOut size={15} /> Sign Out
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                {/* Welcome banner - Responsive */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`rounded-2xl p-4 sm:p-6 mb-6 border relative overflow-hidden ${isDark ? 'bg-gradient-to-r from-purple-900/40 to-blue-900/30 border-purple-500/20' : 'bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200/60'}`}
                >
                    <div className="absolute inset-0 pointer-events-none">
                        <div className={`absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 rounded-full blur-[80px] ${isDark ? 'bg-purple-600/10' : 'bg-purple-300/20'}`} />
                    </div>
                    <div className="relative">
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles size={14} className="text-purple-400" />
                            <span className={`text-xs sm:text-sm font-medium ${isDark ? 'text-purple-300' : 'text-purple-600'}`}>Welcome back</span>
                        </div>
                        <h1 className={`text-xl sm:text-2xl font-bold mb-1 ${textPrimary}`}>
                            Hello, {user?.name?.split(' ')[0] || 'Reader'} 👋
                        </h1>
                        <p className={`text-xs sm:text-sm ${textMuted}`}>
                            Your reading journey continues. Discover new articles tailored for you.
                        </p>
                    </div>
                </motion.div>

                {/* Stats row - Responsive Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 }}
                            className={`rounded-xl sm:rounded-2xl p-3 sm:p-4 border ${cardBase}`}
                        >
                            <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl ${stat.bg} flex items-center justify-center mb-2 sm:mb-3`}>
                                <stat.icon size={16} className={stat.color} />
                            </div>
                            <div className={`text-xl sm:text-2xl font-bold ${textPrimary}`}>{stat.value}</div>
                            <div className={`text-[11px] sm:text-xs mt-0.5 ${textMuted}`}>{stat.label}</div>
                        </motion.div>
                    ))}
                </div>

                {/* Main Content Grid - Responsive */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
                    {/* Recent articles */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className={`lg:col-span-2 rounded-xl sm:rounded-2xl border p-4 sm:p-5 ${cardBase}`}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h2 className={`font-semibold text-sm sm:text-base ${textPrimary}`}>Recommended Articles</h2>
                            <Link href="/blogs" className="text-purple-500 text-xs hover:text-purple-400 transition-colors flex items-center gap-1">
                                View all <ArrowRight size={12} />
                            </Link>
                        </div>
                        <div className="space-y-2 sm:space-y-3">
                            {recentArticles.map((article, i) => (
                                <Link key={i} href="/blogs">
                                    <motion.div
                                        whileHover={{ x: 4 }}
                                        className={`flex items-center gap-3 p-2 sm:p-3 rounded-xl transition-colors cursor-pointer group ${isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}
                                    >
                                        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br ${article.color} flex-shrink-0`} />
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-xs sm:text-sm font-medium truncate group-hover:text-purple-500 transition-colors ${textPrimary}`}>{article.title}</p>
                                            <p className={`text-[10px] sm:text-xs ${textMuted}`}>{article.category} · {article.readTime} read</p>
                                        </div>
                                        <ArrowRight size={12} className={`flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ${isDark ? 'text-purple-400' : 'text-purple-500'}`} />
                                    </motion.div>
                                </Link>
                            ))}
                        </div>
                    </motion.div>

                    {/* Profile card - Responsive */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className={`rounded-xl sm:rounded-2xl border p-4 sm:p-5 ${cardBase}`}
                    >
                        <h2 className={`font-semibold text-sm sm:text-base mb-4 ${textPrimary}`}>My Profile</h2>
                        <div className="text-center mb-4">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mx-auto mb-3">
                                <span className="text-white text-xl sm:text-2xl font-bold">
                                    {user?.name?.[0]?.toUpperCase() || 'U'}
                                </span>
                            </div>
                            <p className={`font-semibold text-sm sm:text-base ${textPrimary}`}>{user?.name || 'User'}</p>
                            <p className={`text-xs ${textMuted} mt-0.5`}>@{user?.username}</p>
                            <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full mt-2 ${isDark ? 'bg-purple-500/15 text-purple-400' : 'bg-purple-100 text-purple-700'}`}>
                                <Sparkles size={9} /> Member
                            </span>
                        </div>

                        <div className={`text-[11px] sm:text-xs text-center ${textMuted} mb-4`}>
                            Member since {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '2026'}
                        </div>

                        <div className="space-y-2">
                            <Link href="/blogs" className="block">
                                <button className="w-full py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 text-white text-xs sm:text-sm font-medium flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300">
                                    <BookOpen size={14} /> Browse Articles
                                </button>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className={`w-full py-2 sm:py-2.5 rounded-xl border text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition-all duration-300 ${isDark ? 'border-gray-700 text-gray-400 hover:border-red-500/50 hover:text-red-400' : 'border-slate-200 text-slate-500 hover:border-red-300 hover:text-red-500'}`}
                            >
                                <LogOut size={14} /> Sign Out
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* Additional Section - Recently Viewed (Optional) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className={`mt-6 rounded-xl sm:rounded-2xl border p-4 sm:p-5 ${cardBase}`}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className={`font-semibold text-sm sm:text-base ${textPrimary}`}>Recently Viewed</h2>
                        <button className={`text-xs transition-colors ${isDark ? 'text-gray-400 hover:text-purple-400' : 'text-slate-500 hover:text-purple-600'}`}>
                            Clear History
                        </button>
                    </div>
                    <div className="text-center py-6 sm:py-8">
                        <Clock size={24} className={`mx-auto mb-2 opacity-30 ${isDark ? 'text-gray-500' : 'text-slate-400'}`} />
                        <p className={`text-xs sm:text-sm ${textMuted}`}>No recently viewed articles</p>
                        <Link href="/blogs">
                            <button className={`mt-3 text-xs font-medium transition-colors ${isDark ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-700'}`}>
                                Start exploring →
                            </button>
                        </Link>
                    </div>
                </motion.div>
            </main>
        </div>
    )
}