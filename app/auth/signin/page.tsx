'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, LogIn, AlertCircle, ArrowLeft, Sparkles, UserPlus } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

/* ─────────────── HAND component ─────────────── */
function Hand({ cx, cy, mirror = false }: { cx: number; cy: number; mirror?: boolean }) {
    const s = mirror ? -1 : 1
    return (
        <g transform={`translate(${cx},${cy}) scale(${s},1)`}>
            <rect x="-22" y="-8" width="44" height="34" rx="10" fill="#c084fc" />
            <ellipse cx="-5" cy="6" rx="10" ry="8" fill="rgba(255,255,255,0.15)" />
            <path d="M-18 8 Q0 5 18 8" stroke="rgba(120,50,200,0.25)" strokeWidth="1.5" fill="none" />
            <path d="M-18 18 Q0 15 18 18" stroke="rgba(120,50,200,0.18)" strokeWidth="1.2" fill="none" />
            {/* THUMB */}
            <g transform="rotate(-32,-22,8)">
                <rect x="-34" y="0" width="14" height="26" rx="7" fill="#c084fc" />
                <ellipse cx="-27" cy="-1" rx="7" ry="6" fill="#d8b4fe" />
                <path d="M-33 13 Q-27 11 -21 13" stroke="rgba(120,50,200,0.25)" strokeWidth="1.2" fill="none" />
            </g>
            {/* INDEX */}
            <g transform="translate(-14,-8)">
                <rect x="-6" y="-32" width="13" height="38" rx="6.5" fill="#d8b4fe" />
                <ellipse cx="0" cy="-32" rx="6.5" ry="6" fill="#d8b4fe" />
                <path d="M-5 -15 Q0 -17 5 -15" stroke="rgba(120,50,200,0.2)" strokeWidth="1.2" fill="none" />
                <path d="M-5 -4  Q0 -6  5 -4" stroke="rgba(120,50,200,0.2)" strokeWidth="1.2" fill="none" />
            </g>
            {/* MIDDLE */}
            <g transform="translate(0,-8)">
                <rect x="-6.5" y="-38" width="13" height="42" rx="6.5" fill="#d8b4fe" />
                <ellipse cx="0" cy="-38" rx="6.5" ry="6" fill="#d8b4fe" />
                <path d="M-5 -19 Q0 -21 5 -19" stroke="rgba(120,50,200,0.2)" strokeWidth="1.2" fill="none" />
                <path d="M-5 -7  Q0 -9  5 -7" stroke="rgba(120,50,200,0.2)" strokeWidth="1.2" fill="none" />
            </g>
            {/* RING */}
            <g transform="translate(14,-8)">
                <rect x="-6" y="-34" width="13" height="38" rx="6.5" fill="#d8b4fe" />
                <ellipse cx="0" cy="-34" rx="6.5" ry="6" fill="#d8b4fe" />
                <path d="M-5 -16 Q0 -18 5 -16" stroke="rgba(120,50,200,0.2)" strokeWidth="1.2" fill="none" />
                <path d="M-5 -5  Q0 -7  5 -5" stroke="rgba(120,50,200,0.2)" strokeWidth="1.2" fill="none" />
            </g>
            {/* PINKY */}
            <g transform="rotate(8,22,0) translate(24,-8)">
                <rect x="-5.5" y="-26" width="11" height="30" rx="5.5" fill="#c084fc" />
                <ellipse cx="0" cy="-26" rx="5.5" ry="5" fill="#c084fc" />
                <path d="M-4 -11 Q0 -13 4 -11" stroke="rgba(120,50,200,0.2)" strokeWidth="1.2" fill="none" />
                <path d="M-4 -1  Q0 -3  4 -1" stroke="rgba(120,50,200,0.2)" strokeWidth="1.2" fill="none" />
            </g>
        </g>
    )
}

/* ─────────────── CHIBI CHARACTER ─────────────── */
interface ChibiProps {
    expression: string
    mousePosition: { x: number; y: number }
    isBlinking: boolean
    focusField: string | null
    showPassword: boolean
}

function ChibiCharacter({ expression, mousePosition, isBlinking, focusField, showPassword }: ChibiProps) {
    const pupilX = focusField === 'email' ? 5
        : focusField === 'password' ? 0
            : mousePosition.x * 0.5
    const pupilY = focusField === 'email' ? 6
        : focusField === 'password' ? 8
            : mousePosition.y * 0.4

    const eyesClosed = focusField === 'password'
    const leftHandCovers = focusField === 'password'
    const rightHandCovers = focusField === 'password' && !showPassword

    return (
        <svg viewBox="0 0 240 280" width="180" height="210"
            xmlns="http://www.w3.org/2000/svg"
            style={{ filter: 'drop-shadow(0 14px 35px rgba(147,51,234,0.3))', overflow: 'visible' }}>

            {/* Glow ring behind character */}
            <circle cx="120" cy="140" r="100" fill="rgba(147,51,234,0.05)" />
            <circle cx="120" cy="140" r="85" fill="none" stroke="rgba(147,51,234,0.1)" strokeWidth="1" />

            {/* ── LEGS ── */}
            <rect x="84" y="218" width="27" height="42" rx="9" fill="#1e1b4b" />
            <rect x="129" y="218" width="27" height="42" rx="9" fill="#1e1b4b" />
            <ellipse cx="97" cy="262" rx="20" ry="10" fill="#0f0a2e" />
            <ellipse cx="143" cy="262" rx="20" ry="10" fill="#0f0a2e" />

            {/* ── BODY ── */}
            <rect x="64" y="155" width="112" height="72" rx="22" fill="#7c3aed" />
            <ellipse cx="96" cy="167" rx="24" ry="12" fill="rgba(255,255,255,0.16)" />
            {/* cyan center stripe */}
            <rect x="117" y="155" width="6" height="72" rx="3" fill="#06b6d4" opacity="0.9" />
            {/* neon collar */}
            <path d="M73 163 Q96 153 120 156 Q144 153 167 163"
                stroke="#22d3ee" strokeWidth="3" fill="none" strokeLinecap="round" />
            {/* stars */}
            <text x="89" y="197" fontSize="17" fill="#22d3ee" textAnchor="middle">★</text>
            <text x="148" y="202" fontSize="12" fill="#22d3ee" textAnchor="middle">★</text>

            {/* ── SHOULDER CAPS ── */}
            <circle cx="64" cy="170" r="15" fill="#8b5cf6" />
            <circle cx="176" cy="170" r="15" fill="#8b5cf6" />

            {/* ── LEFT ARM ── */}
            <AnimatePresence>
                {leftHandCovers && (
                    <motion.g key="left-cover"
                        initial={{ y: 100, x: -30, opacity: 0, rotate: -25 }}
                        animate={{ y: 0, x: 0, opacity: 1, rotate: 0 }}
                        exit={{ y: 100, x: -30, opacity: 0, rotate: -25 }}
                        transition={{ type: 'spring', stiffness: 180, damping: 17 }}>
                        <path d="M64 178 Q66 155 74 136 Q80 120 90 106"
                            stroke="#c084fc" strokeWidth="20" fill="none" strokeLinecap="round" />
                        <Hand cx={94} cy={96} mirror={false} />
                    </motion.g>
                )}
            </AnimatePresence>

            {/* ── RIGHT ARM ── */}
            <AnimatePresence>
                {rightHandCovers && (
                    <motion.g key="right-cover"
                        initial={{ y: 100, x: 30, opacity: 0, rotate: 25 }}
                        animate={{ y: 0, x: 0, opacity: 1, rotate: 0 }}
                        exit={{ y: 100, x: 30, opacity: 0, rotate: 25 }}
                        transition={{ type: 'spring', stiffness: 180, damping: 17, delay: 0.07 }}>
                        <path d="M176 178 Q174 155 166 136 Q160 120 150 106"
                            stroke="#c084fc" strokeWidth="20" fill="none" strokeLinecap="round" />
                        <Hand cx={146} cy={96} mirror={true} />
                    </motion.g>
                )}
            </AnimatePresence>

            {/* ── NECK ── */}
            <path d="M100 145 Q120 157 140 145 L142 159 Q120 171 98 159 Z" fill="#fcd5a0" />

            {/* ── HEAD ── */}
            <ellipse cx="120" cy="102" rx="70" ry="74" fill="#fcd5a0" />

            {/* ── CHEEK BLUSH ── */}
            <AnimatePresence>
                {expression === 'happy' && (
                    <>
                        <motion.ellipse
                            initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 0.45, scale: 1 }} exit={{ opacity: 0, scale: 0 }}
                            cx="68" cy="120" rx="15" ry="9" fill="#d946ef"
                            style={{ filter: 'blur(4px)', transformOrigin: '68px 120px' }} />
                        <motion.ellipse
                            initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 0.45, scale: 1 }} exit={{ opacity: 0, scale: 0 }}
                            cx="172" cy="120" rx="15" ry="9" fill="#d946ef"
                            style={{ filter: 'blur(4px)', transformOrigin: '172px 120px' }} />
                    </>
                )}
            </AnimatePresence>

            {/* ── HAIR ── */}
            <ellipse cx="120" cy="52" rx="66" ry="42" fill="#1e0a3c" />
            <path d="M54 78 Q52 60 60 46 Q84 30 120 28 Q156 30 180 46 Q188 60 186 78" fill="#1e0a3c" />
            <rect x="46" y="66" width="20" height="38" rx="10" fill="#1e0a3c" />
            <rect x="174" y="66" width="20" height="38" rx="10" fill="#1e0a3c" />

            {/* ── EYEBROWS ── */}
            <motion.path d="M70 84 Q86 76 102 80" stroke="#1e0a3c" strokeWidth="5.5" fill="none" strokeLinecap="round"
                animate={{
                    d: expression === 'angry' ? 'M70 88 Q86 83 102 88'
                        : expression === 'surprised' ? 'M70 78 Q86 68 102 72'
                            : 'M70 84 Q86 76 102 80'
                }} transition={{ duration: 0.3 }} />
            <motion.path d="M138 80 Q154 76 170 84" stroke="#1e0a3c" strokeWidth="5.5" fill="none" strokeLinecap="round"
                animate={{
                    d: expression === 'angry' ? 'M138 88 Q154 83 170 88'
                        : expression === 'surprised' ? 'M138 72 Q154 68 170 78'
                            : 'M138 80 Q154 76 170 84'
                }} transition={{ duration: 0.3 }} />

            {/* ── EYES ── */}
            <motion.g animate={{ scaleY: (isBlinking || eyesClosed) ? 0.08 : 1 }}
                transition={{ duration: 0.12 }} style={{ transformOrigin: '90px 108px' }}>
                <ellipse cx="90" cy="108" rx="21" ry="21" fill="white" />
                <motion.ellipse cx={90 + pupilX} cy={108 + pupilY} rx="11" ry="13" fill="#4c1d95"
                    animate={{ ry: expression === 'surprised' ? 16 : 13 }} />
                <motion.ellipse cx={90 + pupilX} cy={108 + pupilY} rx="6.5" ry="8" fill="#0d0020"
                    animate={{ ry: expression === 'surprised' ? 10 : 8 }} />
                <ellipse cx={84 + pupilX * 0.3} cy={102 + pupilY * 0.3} rx="3" ry="3.5" fill="white" />
            </motion.g>

            <motion.g animate={{ scaleY: (isBlinking || eyesClosed) ? 0.08 : 1 }}
                transition={{ duration: 0.12 }} style={{ transformOrigin: '150px 108px' }}>
                <ellipse cx="150" cy="108" rx="21" ry="21" fill="white" />
                <motion.ellipse cx={150 + pupilX} cy={108 + pupilY} rx="11" ry="13" fill="#4c1d95"
                    animate={{ ry: expression === 'surprised' ? 16 : 13 }} />
                <motion.ellipse cx={150 + pupilX} cy={108 + pupilY} rx="6.5" ry="8" fill="#0d0020"
                    animate={{ ry: expression === 'surprised' ? 10 : 8 }} />
                <ellipse cx={144 + pupilX * 0.3} cy={102 + pupilY * 0.3} rx="3" ry="3.5" fill="white" />
            </motion.g>

            {/* ── NOSE ── */}
            <ellipse cx="120" cy="126" rx="7" ry="5" fill="#f0a060" />

            {/* ── MOUTH ── */}
            {expression === 'happy' ? (
                <>
                    <path d="M94 144 Q120 166 146 144" fill="#9333ea" />
                    <path d="M94 144 Q120 164 146 144 Q132 176 120 173 Q108 176 94 144 Z" fill="#7e22ce" />
                </>
            ) : expression === 'angry' ? (
                <path d="M100 150 Q120 140 140 150" stroke="#4c1d95" strokeWidth="4.5" fill="none" strokeLinecap="round" />
            ) : expression === 'surprised' ? (
                <ellipse cx="120" cy="150" rx="11" ry="13" fill="#9333ea" />
            ) : (
                <path d="M104 146 Q120 152 136 146" fill="#9333ea" />
            )}
        </svg>
    )
}

export default function SignInPage() {
    const router = useRouter()
    const { isDark } = useTheme()
    const [credentials, setCredentials] = useState({ email: '', password: '' })
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [focusField, setFocusField] = useState<string | null>(null)

    // Character state
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const [expression, setExpression] = useState('neutral')
    const [isBlinking, setIsBlinking] = useState(false)
    const faceRef = useRef<HTMLDivElement>(null)

    // button dodge
    const [btnPos, setBtnPos] = useState({ x: 0, y: 0, rotateX: 0, rotateY: 0, rotateZ: 0 })
    const dodgeDir = useRef(1)

    /* Mouse tracking */
    useEffect(() => {
        const move = (e: MouseEvent) => {
            if (faceRef.current && !focusField) {
                const r = faceRef.current.getBoundingClientRect()
                setMousePosition({
                    x: Math.min(8, Math.max(-8, (e.clientX - r.left - r.width / 2) / 28)),
                    y: Math.min(5, Math.max(-5, (e.clientY - r.top - r.height / 2) / 28)),
                })
            }
        }
        window.addEventListener('mousemove', move)
        return () => window.removeEventListener('mousemove', move)
    }, [focusField])

    /* Blinking */
    useEffect(() => {
        const id = setInterval(() => {
            if (focusField !== 'password') {
                setIsBlinking(true)
                setTimeout(() => setIsBlinking(false), 130)
            }
        }, 3600)
        return () => clearInterval(id)
    }, [focusField])

    /* Expression logic */
    useEffect(() => {
        if (isLoading) { setExpression('surprised'); return }
        if (error) { setExpression('angry'); return }
        if (credentials.password.length > 3 || (credentials.email.includes('@') && credentials.email.length > 4)) {
            setExpression('happy'); return
        }
        setExpression('neutral')
    }, [credentials, isLoading, error])

    const handleBtnHover = useCallback(() => {
        if (!credentials.email.trim() || !credentials.password.trim() || error) {
            dodgeDir.current *= -1
            setBtnPos(prev => {
                const x = prev.x + dodgeDir.current * (70 + Math.random() * 70)
                const y = prev.y + (Math.random() > 0.5 ? 1 : -1) * (40 + Math.random() * 50)
                return {
                    x: Math.max(-130, Math.min(130, x)),
                    y: Math.max(-70, Math.min(70, y)),
                    rotateX: (Math.random() > 0.5 ? 1 : -1) * (20 + Math.random() * 20),
                    rotateY: dodgeDir.current * (20 + Math.random() * 20),
                    rotateZ: (Math.random() - 0.5) * 30
                }
            })
        }
    }, [credentials, error])

    useEffect(() => {
        if (focusField) setBtnPos({ x: 0, y: 0, rotateX: 0, rotateY: 0, rotateZ: 0 })
    }, [focusField])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')
        try {
            const res = await fetch('/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: credentials.email, password: credentials.password }),
            })
            const data = await res.json()
            if (res.ok) {
                localStorage.setItem('token', data.token)
                localStorage.setItem('userRole', data.role)
                localStorage.setItem('userData', JSON.stringify(data.user))
                if (data.role === 'admin' || data.role === 'author' || data.role === 'editor') {
                    router.push('/admin/dashboard')
                } else {
                    router.push('/dashboard')
                }
            } else {
                setError(data.message || 'Invalid email or password')
                setBtnPos({
                    x: (Math.random() > 0.5 ? 1 : -1) * (90 + Math.random() * 60),
                    y: (Math.random() > 0.5 ? 1 : -1) * (50 + Math.random() * 40),
                    rotateX: (Math.random() > 0.5 ? 1 : -1) * 30,
                    rotateY: (Math.random() > 0.5 ? 1 : -1) * 30,
                    rotateZ: (Math.random() > 0.5 ? 1 : -1) * 15
                })
                setTimeout(() => {
                    setBtnPos({ x: 0, y: 0, rotateX: 0, rotateY: 0, rotateZ: 0 });
                    setError('');
                    setExpression('neutral');
                }, 3000)
            }
        } catch {
            setError('Network error. Please check your connection.')
        } finally {
            setIsLoading(false)
        }
    }

    const hint = focusField === 'password' && !showPassword ? "🙈 I won't look!"
        : focusField === 'password' && showPassword ? "👀 Oh, I see it!"
            : focusField === 'email' ? "👀 Hello there!"
                : expression === 'happy' ? "😊 Looking good!"
                    : expression === 'angry' ? "😠 Oops!"
                        : "👋 Welcome back!"

    const card = isDark
        ? 'bg-white/[0.04] border-purple-500/20 shadow-[0_0_0_1px_rgba(147,51,234,0.2),0_30px_80px_rgba(0,0,0,0.6)]'
        : 'bg-white/90 border-purple-200/60 shadow-[0_8px_60px_rgba(147,51,234,0.12),0_2px_20px_rgba(0,0,0,0.06)]'

    const inputClass = isDark
        ? 'w-full px-4 py-3 rounded-xl bg-purple-900/10 border-2 border-purple-500/25 text-white placeholder-white/25 focus:border-purple-500 focus:bg-purple-900/20 outline-none transition-all duration-200 text-sm'
        : 'w-full px-4 py-3 rounded-xl bg-slate-50 border-2 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-purple-500 focus:bg-white outline-none transition-all duration-200 text-sm'

    const labelClass = isDark
        ? 'flex items-center gap-1.5 text-[11px] font-semibold text-purple-300/70 uppercase tracking-wider mb-2'
        : 'flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2'

    return (
        <div className={`min-h-screen flex items-center justify-center px-4 relative overflow-hidden transition-colors duration-500 ${isDark
                ? 'bg-gradient-to-br from-[#0a0118] via-[#13002e] to-[#080c18]'
                : 'bg-gradient-to-br from-slate-50 via-white to-purple-50'
            }`}>
            <div className="absolute inset-0" style={{
                backgroundImage: `linear-gradient(rgba(147,51,234,${isDark ? '0.07' : '0.04'}) 1px, transparent 1px), linear-gradient(90deg, rgba(147,51,234,${isDark ? '0.07' : '0.04'}) 1px, transparent 1px)`,
                backgroundSize: '50px 50px',
            }} />

            <motion.div
                initial={{ opacity: 0, y: 28, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className={`relative w-full max-w-md rounded-3xl border backdrop-blur-2xl p-6 md:p-8 ${card}`}
            >
                {isDark && (
                    <motion.div
                        className="absolute inset-[-1px] rounded-3xl -z-10"
                        style={{ background: 'linear-gradient(135deg, #9333ea, #3b82f6, #06b6d4)', opacity: 0.15 }}
                        animate={{ opacity: [0.1, 0.25, 0.1] }}
                        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                    />
                )}

                {/* Character Section */}
                <div ref={faceRef} className="flex flex-col items-center mb-4">
                    <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}>
                        <ChibiCharacter
                            expression={expression}
                            mousePosition={mousePosition}
                            isBlinking={isBlinking}
                            focusField={focusField}
                            showPassword={showPassword}
                        />
                    </motion.div>
                    <motion.p key={hint} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className={`text-[11px] font-medium mt-1 ${isDark ? 'text-purple-300/60' : 'text-slate-400'}`}>
                        {hint}
                    </motion.p>
                </div>

                <div className="text-center mb-6">
                    <h1 className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Welcome Back
                    </h1>
                    <p className={`text-sm ${isDark ? 'text-white/40' : 'text-slate-500'}`}>
                        Sign in to your account
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className={labelClass}>
                            <Mail size={11} className="text-purple-500" /> Email Address
                        </label>
                        <input
                            type="email"
                            value={credentials.email}
                            placeholder="you@example.com"
                            onChange={e => setCredentials({ ...credentials, email: e.target.value })}
                            onFocus={() => setFocusField('email')}
                            onBlur={() => setFocusField(null)}
                            required
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label className={labelClass}>
                            <Lock size={11} className="text-purple-500" /> Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={credentials.password}
                                placeholder="••••••••"
                                onChange={e => setCredentials({ ...credentials, password: e.target.value })}
                                onFocus={() => setFocusField('password')}
                                onBlur={() => setFocusField(null)}
                                required
                                className={`${inputClass} pr-12`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(p => !p)}
                                className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 transition-colors ${isDark ? 'text-white/30 hover:text-purple-400' : 'text-slate-400 hover:text-purple-500'}`}
                            >
                                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                            </button>
                        </div>
                    </div>

                    <AnimatePresence>
                        {error && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                                className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-sm">
                                <AlertCircle size={14} className="shrink-0" /> {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="flex justify-center pt-1" style={{ perspective: 1000 }}>
                        <motion.button
                            type="submit"
                            disabled={isLoading}
                            onMouseEnter={handleBtnHover}
                            animate={{
                                x: btnPos.x,
                                y: btnPos.y,
                                rotateX: btnPos.rotateX,
                                rotateY: btnPos.rotateY,
                                rotateZ: btnPos.rotateZ
                            }}
                            transition={{ type: 'spring', stiffness: 220, damping: 16 }}
                            whileHover={(!credentials.email || !credentials.password || !!error) ? {} : { scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                            className="px-10 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold text-sm flex items-center gap-2 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-shadow disabled:opacity-70 cursor-pointer disabled:cursor-not-allowed relative overflow-hidden"
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
                                        Authenticating...
                                    </>
                                ) : (
                                    <><LogIn size={16} /> Sign In</>
                                )}
                            </span>
                        </motion.button>
                    </div>
                </form>

                <div className="mt-8 space-y-3 text-center">
                    <p className={`text-sm ${isDark ? 'text-white/40' : 'text-slate-500'}`}>
                        Don't have an account?{' '}
                        <Link href="/auth/signup" className="text-purple-500 hover:text-purple-400 font-semibold transition-colors">
                            Sign up free
                        </Link>
                    </p>
                    <Link href="/" className={`inline-flex items-center gap-1.5 text-xs transition-colors group ${isDark ? 'text-white/30 hover:text-white/60' : 'text-slate-400 hover:text-slate-600'}`}>
                        <ArrowLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" /> Back to Home
                    </Link>
                </div>
            </motion.div>
        </div>
    )
}
