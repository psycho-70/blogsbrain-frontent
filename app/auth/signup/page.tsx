'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, ArrowLeft, Sparkles, UserPlus } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

export default function SignUpPage() {
    const router = useRouter()
    const { isDark } = useTheme()
    const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setSuccess('')

        if (form.password !== form.confirm) {
            setError('Passwords do not match')
            return
        }
        if (form.password.length < 6) {
            setError('Password must be at least 6 characters')
            return
        }

        setIsLoading(true)
        try {
            const res = await fetch('/api/users/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: form.name,
                    username: form.email,
                    password: form.password,
                    confirm_password: form.confirm,
                }),
            })
            const data = await res.json()
            if (res.ok) {
                localStorage.setItem('token', data.token)
                localStorage.setItem('userRole', 'user')
                localStorage.setItem('userData', JSON.stringify(data.user))
                setSuccess('Account created! Redirecting...')
                setTimeout(() => router.push('/dashboard'), 1200)
            } else {
                setError(data.message || 'Signup failed. Please try again.')
            }
        } catch {
            setError('Network error. Please check your connection.')
        } finally {
            setIsLoading(false)
        }
    }

    const card = isDark
        ? 'bg-white/[0.04] border-purple-500/20 shadow-[0_0_0_1px_rgba(147,51,234,0.2),0_30px_80px_rgba(0,0,0,0.6)]'
        : 'bg-white/90 border-purple-200/60 shadow-[0_8px_60px_rgba(147,51,234,0.12),0_2px_20px_rgba(0,0,0,0.06)]'

    const inputClass = isDark
        ? 'w-full px-4 py-3 rounded-xl bg-purple-900/10 border-2 border-purple-500/25 text-white placeholder-white/25 focus:border-purple-500 focus:bg-purple-900/20 outline-none transition-all duration-200 text-sm'
        : 'w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-purple-500 focus:bg-white outline-none transition-all duration-200 text-sm'

    const labelClass = isDark
        ? 'flex items-center gap-1.5 text-[11px] font-semibold text-purple-300/70 uppercase tracking-wider mb-2'
        : 'flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2'

    // Password strength
    const strength = form.password.length === 0 ? 0 : form.password.length < 6 ? 1 : form.password.length < 10 ? 2 : 3
    const strengthLabel = ['', 'Weak', 'Good', 'Strong']
    const strengthColor = ['', 'bg-red-500', 'bg-yellow-500', 'bg-green-500']

    return (
        <div className={`min-h-screen flex items-center justify-center px-4 py-10 relative overflow-hidden transition-colors duration-500 ${isDark
            ? 'bg-gradient-to-br from-[#0a0118] via-[#13002e] to-[#080c18]'
            : 'bg-gradient-to-br from-slate-50 via-white to-purple-50'
            }`}>
            {/* Grid background */}
            <div className="absolute inset-0" style={{
                backgroundImage: `linear-gradient(rgba(147,51,234,${isDark ? '0.07' : '0.04'}) 1px, transparent 1px), linear-gradient(90deg, rgba(147,51,234,${isDark ? '0.07' : '0.04'}) 1px, transparent 1px)`,
                backgroundSize: '50px 50px',
            }} />

            {/* Ambient glows */}
            <div className={`absolute top-[8%] right-[5%] w-80 h-80 rounded-full blur-[90px] ${isDark ? 'bg-purple-900/25' : 'bg-purple-200/40'}`} />
            <div className={`absolute bottom-[8%] left-[5%] w-72 h-72 rounded-full blur-[80px] ${isDark ? 'bg-blue-900/20' : 'bg-blue-200/30'}`} />

            <motion.div
                initial={{ opacity: 0, y: 28, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className={`relative w-full max-w-md rounded-3xl border backdrop-blur-2xl p-8 ${card}`}
            >
                {isDark && (
                    <motion.div
                        className="absolute inset-[-1px] rounded-3xl -z-10"
                        style={{ background: 'linear-gradient(135deg, #9333ea, #3b82f6, #06b6d4)', opacity: 0.15 }}
                        animate={{ opacity: [0.1, 0.25, 0.1] }}
                        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                    />
                )}

                {/* Header */}
                <div className="text-center mb-8">
                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 ${isDark ? 'bg-purple-500/15' : 'bg-purple-100'}`}>
                        <Sparkles size={24} className="text-purple-500" />
                    </div>
                    <h1 className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Create Account
                    </h1>
                    <p className={`text-sm ${isDark ? 'text-white/40' : 'text-slate-500'}`}>
                        Join Einsteine and start reading today
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div>
                        <label className={labelClass}><User size={11} className="text-purple-500" /> Full Name</label>
                        <input
                            type="text"
                            placeholder="John Doe"
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                            required
                            className={inputClass}
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className={labelClass}><Mail size={11} className="text-purple-500" /> Email Address</label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                            required
                            className={inputClass}
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className={labelClass}><Lock size={11} className="text-purple-500" /> Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Min. 6 characters"
                                value={form.password}
                                onChange={e => setForm({ ...form, password: e.target.value })}
                                required
                                className={`${inputClass} pr-12`}
                            />
                            <button type="button" onClick={() => setShowPassword(p => !p)}
                                className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 transition-colors ${isDark ? 'text-white/30 hover:text-purple-400' : 'text-slate-400 hover:text-purple-500'}`}>
                                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                            </button>
                        </div>
                        {/* Strength bar */}
                        {form.password && (
                            <div className="mt-2 flex items-center gap-2">
                                <div className="flex gap-1 flex-1">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength ? strengthColor[strength] : isDark ? 'bg-white/10' : 'bg-slate-200'}`} />
                                    ))}
                                </div>
                                <span className={`text-[10px] font-medium ${strength === 1 ? 'text-red-500' : strength === 2 ? 'text-yellow-500' : 'text-green-500'}`}>
                                    {strengthLabel[strength]}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className={labelClass}><Lock size={11} className="text-purple-500" /> Confirm Password</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Re-enter password"
                            value={form.confirm}
                            onChange={e => setForm({ ...form, confirm: e.target.value })}
                            required
                            className={`${inputClass} ${form.confirm && form.confirm !== form.password ? (isDark ? '!border-red-500/60' : '!border-red-400') : ''}`}
                        />
                        {form.confirm && form.confirm !== form.password && (
                            <p className="text-red-400 text-xs mt-1 ml-1">Passwords don't match</p>
                        )}
                    </div>

                    {/* Error / Success */}
                    <AnimatePresence>
                        {error && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                                className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-sm">
                                <AlertCircle size={14} className="shrink-0" />{error}
                            </motion.div>
                        )}
                        {success && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                                className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-green-500/10 border border-green-500/25 text-green-400 text-sm">
                                ✓ {success}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Submit */}
                    <motion.button
                        type="submit"
                        disabled={isLoading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-shadow disabled:opacity-70 cursor-pointer disabled:cursor-not-allowed relative overflow-hidden mt-2"
                    >
                        <motion.div
                            className="absolute inset-0"
                            style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)' }}
                            animate={{ x: ['-100%', '100%'] }}
                            transition={{ repeat: Infinity, duration: 2.2, ease: 'linear' }}
                        />
                        <span className="relative flex items-center gap-2">
                            {isLoading ? (
                                <>
                                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                                    </motion.div>
                                    Creating account...
                                </>
                            ) : (
                                <><UserPlus size={16} /> Create Account</>
                            )}
                        </span>
                    </motion.button>
                </form>

                {/* Footer */}
                <div className="mt-6 space-y-3 text-center">
                    <p className={`text-sm ${isDark ? 'text-white/40' : 'text-slate-500'}`}>
                        Already have an account?{' '}
                        <Link href="/auth/signin" className="text-purple-500 hover:text-purple-400 font-semibold transition-colors">
                            Sign in
                        </Link>
                    </p>
                    <Link href="/" className={`inline-flex items-center gap-1.5 text-xs transition-colors group ${isDark ? 'text-white/30 hover:text-white/60' : 'text-slate-400 hover:text-slate-600'}`}>
                        <ArrowLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" />
                        Back to Home
                    </Link>
                </div>
            </motion.div>
        </div>
    )
}
