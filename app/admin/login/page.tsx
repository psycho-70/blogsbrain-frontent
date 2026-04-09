'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, Shield, LogIn, AlertCircle, Sparkles } from 'lucide-react'

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
    <svg viewBox="0 0 240 280" width="200" height="240"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: 'drop-shadow(0 14px 35px rgba(147,51,234,0.35))', overflow: 'visible' }}>

      {/* Glow ring behind character */}
      <circle cx="120" cy="140" r="100" fill="rgba(147,51,234,0.05)" />
      <circle cx="120" cy="140" r="85" fill="none" stroke="rgba(147,51,234,0.1)" strokeWidth="1" />

      {/* ── LEGS ── */}
      <rect x="84" y="218" width="27" height="42" rx="9" fill="#1e1b4b" />
      <rect x="129" y="218" width="27" height="42" rx="9" fill="#1e1b4b" />
      <ellipse cx="97" cy="262" rx="20" ry="10" fill="#0f0a2e" />
      <ellipse cx="143" cy="262" rx="20" ry="10" fill="#0f0a2e" />
      <ellipse cx="91" cy="259" rx="11" ry="4" fill="rgba(255,255,255,0.06)" />
      <ellipse cx="137" cy="259" rx="11" ry="4" fill="rgba(255,255,255,0.06)" />

      {/* ── BODY ── */}
      <rect x="64" y="155" width="112" height="72" rx="22" fill="#7c3aed" />
      <ellipse cx="96" cy="167" rx="24" ry="12" fill="rgba(255,255,255,0.16)" />
      {/* cyan center stripe */}
      <rect x="117" y="155" width="6" height="72" rx="3" fill="#06b6d4" opacity="0.9" />
      {/* neon collar */}
      <path d="M73 163 Q96 153 120 156 Q144 153 167 163"
        stroke="#22d3ee" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* bottom band */}
      <rect x="64" y="218" width="112" height="10" rx="5" fill="#5b21b6" />
      {/* stars */}
      <text x="89" y="197" fontSize="17" fill="#22d3ee" textAnchor="middle">★</text>
      <text x="148" y="202" fontSize="12" fill="#22d3ee" textAnchor="middle">★</text>
      <text x="144" y="183" fontSize="9" fill="#22d3ee" textAnchor="middle">★</text>

      {/* ── SHOULDER CAPS ── */}
      <circle cx="64" cy="170" r="15" fill="#8b5cf6" />
      <circle cx="176" cy="170" r="15" fill="#8b5cf6" />
      <circle cx="60" cy="166" r="5" fill="rgba(255,255,255,0.22)" />
      <circle cx="180" cy="166" r="5" fill="rgba(255,255,255,0.22)" />

      {/* ── LEFT ARM — covers left eye in password mode ── */}
      <AnimatePresence>
        {leftHandCovers && (
          <motion.g key="left-cover"
            initial={{ y: 100, x: -30, opacity: 0, rotate: -25 }}
            animate={{ y: 0, x: 0, opacity: 1, rotate: 0 }}
            exit={{ y: 100, x: -30, opacity: 0, rotate: -25 }}
            transition={{ type: 'spring', stiffness: 180, damping: 17 }}>
            <path d="M64 178 Q66 155 74 136 Q80 120 90 106"
              stroke="#c084fc" strokeWidth="20" fill="none" strokeLinecap="round" />
            <ellipse cx="71" cy="154" rx="10" ry="6" fill="#7c3aed" opacity="0.7" />
            <Hand cx={94} cy={96} mirror={false} />
          </motion.g>
        )}
      </AnimatePresence>

      {/* ── RIGHT ARM — covers right eye only when password hidden ── */}
      <AnimatePresence>
        {rightHandCovers && (
          <motion.g key="right-cover"
            initial={{ y: 100, x: 30, opacity: 0, rotate: 25 }}
            animate={{ y: 0, x: 0, opacity: 1, rotate: 0 }}
            exit={{ y: 100, x: 30, opacity: 0, rotate: 25 }}
            transition={{ type: 'spring', stiffness: 180, damping: 17, delay: 0.07 }}>
            <path d="M176 178 Q174 155 166 136 Q160 120 150 106"
              stroke="#c084fc" strokeWidth="20" fill="none" strokeLinecap="round" />
            <ellipse cx="169" cy="154" rx="10" ry="6" fill="#7c3aed" opacity="0.7" />
            <Hand cx={146} cy={96} mirror={true} />
          </motion.g>
        )}
      </AnimatePresence>

      {/* ── NECK ── */}
      <path d="M100 145 Q120 157 140 145 L142 159 Q120 171 98 159 Z" fill="#fcd5a0" />

      {/* ── EARS ── */}
      <ellipse cx="48" cy="106" rx="16" ry="20" fill="#fcd5a0" />
      <ellipse cx="192" cy="106" rx="16" ry="20" fill="#fcd5a0" />
      <ellipse cx="48" cy="106" rx="9" ry="13" fill="#f0b070" />
      <ellipse cx="192" cy="106" rx="9" ry="13" fill="#f0b070" />

      {/* ── HEAD ── */}
      <ellipse cx="120" cy="102" rx="70" ry="74" fill="#fcd5a0" />
      <ellipse cx="94" cy="76" rx="32" ry="24" fill="rgba(255,255,255,0.22)" />
      <ellipse cx="144" cy="134" rx="30" ry="20" fill="rgba(0,0,0,0.04)" />

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
      {/* hair shimmer — purple tint */}
      <path d="M84 36 Q104 26 128 30" stroke="rgba(216,180,254,0.35)" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M90 44 Q112 36 134 40" stroke="rgba(216,180,254,0.18)" strokeWidth="3" fill="none" strokeLinecap="round" />

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
        <ellipse cx={94 + pupilX * 0.3} cy={114 + pupilY * 0.3} rx="1.5" ry="1.5" fill="rgba(255,255,255,0.5)" />
      </motion.g>

      <motion.g animate={{ scaleY: (isBlinking || eyesClosed) ? 0.08 : 1 }}
        transition={{ duration: 0.12 }} style={{ transformOrigin: '150px 108px' }}>
        <ellipse cx="150" cy="108" rx="21" ry="21" fill="white" />
        <motion.ellipse cx={150 + pupilX} cy={108 + pupilY} rx="11" ry="13" fill="#4c1d95"
          animate={{ ry: expression === 'surprised' ? 16 : 13 }} />
        <motion.ellipse cx={150 + pupilX} cy={108 + pupilY} rx="6.5" ry="8" fill="#0d0020"
          animate={{ ry: expression === 'surprised' ? 10 : 8 }} />
        <ellipse cx={144 + pupilX * 0.3} cy={102 + pupilY * 0.3} rx="3" ry="3.5" fill="white" />
        <ellipse cx={154 + pupilX * 0.3} cy={114 + pupilY * 0.3} rx="1.5" ry="1.5" fill="rgba(255,255,255,0.5)" />
      </motion.g>

      {/* ── NOSE ── */}
      <ellipse cx="120" cy="126" rx="7" ry="5" fill="#f0a060" />
      <ellipse cx="116" cy="125" rx="2.5" ry="2" fill="rgba(0,0,0,0.12)" />
      <ellipse cx="124" cy="125" rx="2.5" ry="2" fill="rgba(0,0,0,0.12)" />

      {/* ── MOUTH ── */}
      {expression === 'happy' ? (
        <>
          <path d="M94 144 Q120 166 146 144" fill="#9333ea" />
          <path d="M94 144 Q120 164 146 144 Q132 176 120 173 Q108 176 94 144 Z" fill="#7e22ce" />
          <path d="M97 146 Q120 162 143 146 L143 154 Q120 168 97 154 Z" fill="white" />
          <line x1="120" y1="146" x2="120" y2="163" stroke="#e9d5ff" strokeWidth="1" />
          <line x1="109" y1="147" x2="109" y2="162" stroke="#e9d5ff" strokeWidth="1" />
          <line x1="131" y1="147" x2="131" y2="162" stroke="#e9d5ff" strokeWidth="1" />
        </>
      ) : expression === 'angry' ? (
        <path d="M100 150 Q120 140 140 150" stroke="#4c1d95" strokeWidth="4.5" fill="none" strokeLinecap="round" />
      ) : expression === 'surprised' ? (
        <>
          <ellipse cx="120" cy="150" rx="11" ry="13" fill="#9333ea" />
          <ellipse cx="120" cy="152" rx="7" ry="8" fill="#4c1d95" />
        </>
      ) : (
        <>
          <path d="M104 146 Q120 152 136 146" fill="#9333ea" />
          <path d="M104 146 Q120 151 136 146 Q130 160 120 158 Q110 160 104 146 Z" fill="#7e22ce" />
        </>
      )}

      {/* ── SPARKLE ── */}
      <motion.g animate={{ rotate: [0, 18, -18, 0], scale: [1, 1.12, 1] }}
        transition={{ repeat: Infinity, duration: 4.5 }}
        style={{ transformOrigin: '205px 255px' }}>
        <path d="M205 245 L207 253 L215 255 L207 257 L205 265 L203 257 L195 255 L203 253 Z"
          fill="#22d3ee" opacity="0.9" />
      </motion.g>
    </svg>
  )
}

/* ─────────────── MAIN LOGIN PAGE ─────────────── */
export default function AdminLogin() {
  const router = useRouter()
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [expression, setExpression] = useState('neutral')
  const [isBlinking, setIsBlinking] = useState(false)
  const [focusField, setFocusField] = useState<string | null>(null)
  const faceRef = useRef<HTMLDivElement>(null)

  // Button dodge / shake state
  const [btnX, setBtnX] = useState(0)        // horizontal offset in px
  const [btnShake, setBtnShake] = useState(false) // wrong-password shake
  const dodgeDir = useRef(1)                  // alternating dodge direction

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

  /* Expression */
  useEffect(() => {
    if (isLoading) { setExpression('surprised'); return }
    if (error) { setExpression('angry'); return }
    if (credentials.password.length > 4 ||
      (credentials.email.includes('@') && credentials.email.length > 5)) {
      setExpression('happy'); return
    }
    setExpression('neutral')
  }, [credentials, isLoading, error])

  /* Submit — calls real API */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFocusField(null)
    setIsLoading(true)
    setError('')
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Backend reads 'username' field (not 'email')
        body: JSON.stringify({ username: credentials.email, password: credentials.password }),
      })
      const data = await response.json()
      if (response.ok) {
        localStorage.setItem('token', data.token)
        setExpression('happy')
        router.push('/admin/dashboard')
      } else {
        setExpression('angry')
        setError(data.message || 'Invalid credentials. Please try again.')
        // Slide button to the left as a "punishment"
        setBtnX(-120)
        setBtnShake(true)
        setTimeout(() => {
          setBtnShake(false)
          setBtnX(0)
          setExpression('neutral')
          setError('')
        }, 3500)
      }
    } catch {
      setExpression('angry')
      setError('Network error. Please check your connection.')
      setBtnX(-120)
      setBtnShake(true)
      setTimeout(() => {
        setBtnShake(false)
        setBtnX(0)
        setExpression('neutral')
        setError('')
      }, 3500)
    } finally {
      setIsLoading(false)
    }
  }

  /* Dodge handler – called when cursor enters the button while fields are empty */
  const handleBtnMouseEnter = useCallback(() => {
    const isEmpty = !credentials.email.trim() && !credentials.password.trim()
    if (!isEmpty || isLoading) return
    const maxDodge = 110
    dodgeDir.current = dodgeDir.current * -1
    setBtnX(prev => {
      const next = prev + dodgeDir.current * (60 + Math.random() * 50)
      return Math.max(-maxDodge, Math.min(maxDodge, next))
    })
  }, [credentials, isLoading])

  const hint =
    focusField === 'password' && !showPassword ? "🙈 I won't peek at your password!"
      : focusField === 'password' && showPassword ? "👀 Okay! I can see it now..."
        : focusField === 'email' ? "👀 Watching you type..."
          : expression === 'happy' ? "😊 Looking great!"
            : expression === 'angry' ? "😠 That doesn't seem right!"
              : expression === 'surprised' ? "😮 One moment..."
                : "👋 Welcome! Please sign in."

  /* Styled input base — typed so boxSizing doesn't error */
  const inputBase: React.CSSProperties = {
    width: '100%', padding: '13px 16px', borderRadius: '12px',
    background: 'rgba(147,51,234,0.08)', border: '2px solid rgba(147,51,234,0.25)',
    color: 'white', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.2s, background 0.2s', fontFamily: 'inherit',
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #0a0118 0%, #13002e 50%, #080c18 100%)',
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Cyber grid (matches site's .cyber-grid) */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(147,51,234,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(147,51,234,0.08) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
      }} />

      {/* Ambient glows — purple + blue, matching site palette */}
      <div style={{ position: 'absolute', top: '8%', left: '5%', width: 340, height: 340, borderRadius: '50%', background: 'rgba(147,51,234,0.12)', filter: 'blur(80px)' }} />
      <div style={{ position: 'absolute', bottom: '8%', right: '5%', width: 300, height: 300, borderRadius: '50%', background: 'rgba(59,130,246,0.1)', filter: 'blur(80px)' }} />
      <div style={{ position: 'absolute', top: '50%', left: '50%', width: 200, height: 200, borderRadius: '50%', background: 'rgba(6,182,212,0.06)', filter: 'blur(60px)', transform: 'translate(-50%,-50%)' }} />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        style={{
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(32px)',
          width: '100%', maxWidth: '420px',
          borderRadius: '28px',
          boxShadow: '0 0 0 1px rgba(147,51,234,0.25), 0 30px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)',
          padding: '24px 38px 40px',
          position: 'relative', zIndex: 10,
        }}
      >
        {/* Animated neon border glow */}
        <motion.div
          style={{
            position: 'absolute', inset: -1, borderRadius: '28px', zIndex: -1,
            background: 'linear-gradient(135deg, #9333ea, #3b82f6, #06b6d4)',
            opacity: 0.18,
          }}
          animate={{ opacity: [0.12, 0.28, 0.12] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        />
        <div className="flex items-center justify-center">

          {/* <img src="/robot3.png" width={100} height={100} alt="" /> */}
        </div>
        {/* Character */}
        <div ref={faceRef} style={{ display: 'flex', justifyContent: 'center' }}>
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 3.2, ease: 'easeInOut' }}
          >
            <ChibiCharacter
              expression={expression}
              mousePosition={mousePosition}
              isBlinking={isBlinking}
              focusField={focusField}
              showPassword={showPassword}
            />
          </motion.div>
        </div>

        {/* Hint */}
        <motion.p
          key={hint} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', fontSize: '12.5px', color: 'rgba(216,180,254,0.65)', marginBottom: '4px' }}
        >
          {hint}
        </motion.p>

        {/* Title */}
        <h2 style={{
          textAlign: 'center', fontSize: '26px', fontWeight: 700, margin: '0 0 4px', letterSpacing: '-0.3px',
          background: 'linear-gradient(to right, #c084fc, #ec4899, #60a5fa)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        }}>
          Welcome Back
        </h2>
        <p style={{
          textAlign: 'center', color: 'rgba(255,255,255,0.38)', fontSize: '12.5px',
          marginBottom: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
        }}>
          <Shield size={12} style={{ color: '#9333ea' }} />
          Secure Admin Portal
          <Sparkles size={12} style={{ color: '#06b6d4' }} />
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '17px' }}>

          {/* Email */}
          <div>
            <label style={{
              display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px',
              color: 'rgba(216,180,254,0.7)', marginBottom: '7px', fontWeight: 600,
              letterSpacing: '0.5px', textTransform: 'uppercase',
            }}>
              <Mail size={11} style={{ color: '#9333ea' }} /> Email Address
            </label>
            <input
              type="email"
              placeholder="admin@gmail.com"
              value={credentials.email}
              onChange={e => setCredentials({ ...credentials, email: e.target.value })}
              onFocus={e => {
                e.currentTarget.style.borderColor = '#9333ea'
                e.currentTarget.style.background = 'rgba(147,51,234,0.14)'
                setFocusField('email')
              }}
              onBlur={e => {
                e.currentTarget.style.borderColor = 'rgba(147,51,234,0.25)'
                e.currentTarget.style.background = 'rgba(147,51,234,0.08)'
                setFocusField(null)
              }}
              required
              style={inputBase}
            />
          </div>

          {/* Password */}
          <div>
            <label style={{
              display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px',
              color: 'rgba(216,180,254,0.7)', marginBottom: '7px', fontWeight: 600,
              letterSpacing: '0.5px', textTransform: 'uppercase',
            }}>
              <Lock size={11} style={{ color: '#9333ea' }} /> Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={credentials.password}
                onChange={e => setCredentials({ ...credentials, password: e.target.value })}
                onFocus={e => {
                  e.currentTarget.style.borderColor = '#9333ea'
                  e.currentTarget.style.background = 'rgba(147,51,234,0.14)'
                  setFocusField('password')
                }}
                onBlur={e => {
                  e.currentTarget.style.borderColor = 'rgba(147,51,234,0.25)'
                  e.currentTarget.style.background = 'rgba(147,51,234,0.08)'
                  setFocusField(null)
                }}
                required
                style={{ ...inputBase, paddingRight: '48px' }}
              />
              <motion.button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.85 }}
                style={{
                  position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: showPassword ? '#9333ea' : 'rgba(255,255,255,0.35)',
                  display: 'flex', alignItems: 'center', padding: '4px',
                  transition: 'color 0.2s',
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </motion.button>
            </div>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{
                  padding: '10px 14px', borderRadius: '10px',
                  background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.28)',
                  display: 'flex', alignItems: 'flex-start', gap: '8px',
                }}
              >
                <AlertCircle size={14} style={{ color: '#f87171', flexShrink: 0, marginTop: 1 }} />
                <span style={{ color: '#f87171', fontSize: '13px', lineHeight: 1.4 }}>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit – centered, smaller, dodges when empty, slides left on wrong password */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4px' }}>
            <motion.button
              type="submit"
              disabled={isLoading}
              onMouseEnter={handleBtnMouseEnter}
              animate={{
                x: btnX,
                rotate: btnShake ? [0, -6, 6, -4, 4, 0] : 0,
              }}
              transition={{
                x: { type: 'spring', stiffness: 220, damping: 20 },
                rotate: { duration: 0.45, ease: 'easeInOut' },
              }}
              whileHover={
                !credentials.email.trim() && !credentials.password.trim()
                  ? {}
                  : { scale: 1.04, boxShadow: '0 8px 30px rgba(147,51,234,0.5)' }
              }
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '11px 32px',
                borderRadius: '13px',
                background: 'linear-gradient(135deg, #9333ea, #3b82f6)',
                color: 'white', fontWeight: 700, fontSize: '14px',
                border: 'none',
                cursor: isLoading ? 'not-allowed'
                  : (!credentials.email.trim() && !credentials.password.trim()) ? 'none'
                    : 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: '7px',
                boxShadow: '0 4px 20px rgba(147,51,234,0.35)',
                position: 'relative', overflow: 'hidden',
                letterSpacing: '0.3px',
                opacity: isLoading ? 0.82 : 1,
                minWidth: '130px',
                justifyContent: 'center',
              }}
            >
              {/* Shimmer sweep */}
              <motion.div
                style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)' }}
                animate={{ x: ['-100%', '100%'] }}
                transition={{ repeat: Infinity, duration: 2.2, ease: 'linear' }}
              />
              <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '7px' }}>
                {isLoading ? (
                  <>
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.85, ease: 'linear' }}>
                      <div style={{ width: 16, height: 16, border: '2.5px solid white', borderTopColor: 'transparent', borderRadius: '50%' }} />
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
      </motion.div>
    </div>
  )
}