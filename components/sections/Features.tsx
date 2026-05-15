'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { useTheme } from '@/contexts/ThemeContext'

const features = [
  {
    title: 'AI Writing Assistant',
    description: 'Get intelligent suggestions and improvements for your blog posts',
    icon: '✍️',
    color: 'from-blue-500 to-cyan-500',
    gradient: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
    gradientColors: ['#3b82f6', '#06b6d4'],
    glowColor: 'rgba(59,130,246,0.4)',
    glowColorLight: 'rgba(59,130,246,0.15)',
    details: ['Grammar and style improvements', 'SEO optimization suggestions', 'Content structure recommendations', 'Readability analysis'],
  },
  {
    title: 'Smart Publishing',
    description: 'Schedule and publish your blogs with advanced features',
    icon: '📅',
    color: 'from-green-500 to-emerald-500',
    gradient: 'linear-gradient(135deg, #22c55e, #10b981)',
    gradientColors: ['#22c55e', '#10b981'],
    glowColor: 'rgba(34,197,94,0.4)',
    glowColorLight: 'rgba(34,197,94,0.15)',
    details: ['Auto-scheduling posts', 'Multi-platform publishing', 'Draft version control', 'Collaborative editing'],
  },
  {
    title: 'Reader Engagement',
    description: 'Tools to increase reader interaction and retention',
    icon: '👥',
    color: 'from-purple-500 to-pink-500',
    gradient: 'linear-gradient(135deg, #a855f7, #ec4899)',
    gradientColors: ['#a855f7', '#ec4899'],
    glowColor: 'rgba(168,85,247,0.4)',
    glowColorLight: 'rgba(168,85,247,0.15)',
    details: ['Reading time estimates', 'Related posts suggestions', 'Comment moderation tools', 'Newsletter integration'],
  },
  {
    title: 'Analytics Dashboard',
    description: 'Track your blog performance and reader insights',
    icon: '📊',
    color: 'from-orange-500 to-yellow-500',
    gradient: 'linear-gradient(135deg, #f97316, #eab308)',
    gradientColors: ['#f97316', '#eab308'],
    glowColor: 'rgba(249,115,22,0.4)',
    glowColorLight: 'rgba(249,115,22,0.15)',
    details: ['Visitor statistics', 'Popular content tracking', 'Reader demographics', 'Engagement metrics'],
  },
]

// Floating particles
const Particles = ({ isDark }: { isDark: boolean }) => {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 18 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 3 + 1.5,
            height: Math.random() * 3 + 1.5,
            left: `${Math.random() * 100}%`,
            background: features[i % 4].gradientColors[0],
            opacity: 0,
          }}
          animate={{
            y: ['100vh', '-20px'],
            opacity: [0, isDark ? 0.8 : 0.4, isDark ? 0.6 : 0.3, 0],
            scale: [0, 1, 1, 0],
          }}
          transition={{
            duration: Math.random() * 12 + 10,
            delay: Math.random() * 8,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  )
}

// Enhanced 3D Tilt Card
const TiltCard3D = ({
  children,
  index,
  glowColor,
  glowColorLight,
  gradient,
  isDark,
}: {
  children: React.ReactNode
  index: number
  glowColor: string
  glowColorLight: string
  gradient: string
  isDark: boolean
}) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0, tx: 0, ty: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const cx = rect.width / 2
    const cy = rect.height / 2
    setTilt({
      x: ((cy - y) / cy) * 10,
      y: ((x - cx) / cx) * 12,
      tx: ((x - cx) / cx) * 4,
      ty: ((y - cy) / cy) * 4,
    })
  }

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0, tx: 0, ty: 0 })
    setIsHovered(false)
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setIsHovered(true)}
      className="h-full relative"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true, margin: '-50px' }}
      style={{
        transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateX(${tilt.tx}px) translateY(${tilt.ty}px) translateZ(${isHovered ? 10 : 0}px)`,
        transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.6s cubic-bezier(0.23,1,0.32,1)',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Outer glow */}
      <motion.div
        className="absolute -inset-1 rounded-2xl pointer-events-none"
        style={{
          background: isDark ? glowColor : glowColorLight,
          filter: 'blur(16px)',
          zIndex: -1,
        }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      />

      {/* Shine overlay */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: isDark
            ? 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%)'
            : 'linear-gradient(135deg, rgba(255,255,255,0.6) 0%, transparent 50%)',
        }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Radial top glow */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: isDark
            ? `radial-gradient(circle at 50% 0%, ${glowColor.replace('0.4', '0.2')}, transparent 70%)`
            : `radial-gradient(circle at 50% 0%, ${glowColorLight.replace('0.15', '0.25')}, transparent 70%)`,
        }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {children}
    </motion.div>
  )
}

// Feature Card
const FeatureCard = ({
  feature,
  index,
  isDark,
}: {
  feature: (typeof features)[0]
  index: number
  isDark: boolean
}) => {
  const [hovered, setHovered] = useState(false)

  return (
    <TiltCard3D
      index={index}
      glowColor={feature.glowColor}
      glowColorLight={feature.glowColorLight}
      gradient={feature.gradient}
      isDark={isDark}
    >
      <div
        className={`relative backdrop-blur-sm rounded-2xl p-6 border h-full flex flex-col overflow-hidden transition-all duration-300 ${
          isDark
            ? 'bg-white/[0.04] border-white/10'
            : 'bg-white/85 border-white/60 shadow-md backdrop-blur-md'
        }`}
        style={
          hovered
            ? isDark
              ? { borderColor: 'rgba(255,255,255,0.22)', background: 'rgba(255,255,255,0.065)' }
              : { borderColor: 'rgba(139,92,246,0.4)', background: 'rgba(255,255,255,0.95)', boxShadow: '0 12px 40px rgba(0,0,0,0.12)' }
            : {}
        }
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Icon */}
        <motion.div
          className={`w-[52px] h-[52px] rounded-xl bg-gradient-to-br ${feature.color} p-[1.5px] mb-5`}
          animate={hovered ? { scale: 1.08, rotateY: 8 } : { scale: 1, rotateY: 0 }}
          style={{ transformStyle: 'preserve-3d' }}
          transition={{ duration: 0.3 }}
        >
          <div
            className={`w-full h-full rounded-xl flex items-center justify-center text-xl ${
              isDark ? 'bg-gray-900/80' : 'bg-white/90'
            }`}
          >
            {feature.icon}
          </div>
        </motion.div>

        {/* Title */}
        <h3
          className="text-[17px] font-bold mb-2 transition-all duration-300"
          style={
            hovered
              ? { background: feature.gradient, WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }
              : { color: isDark ? '#fff' : '#1e1b4b' }
          }
        >
          {feature.title}
        </h3>

        {/* Description */}
        <p className={`text-sm leading-relaxed mb-0 flex-1 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
          {feature.description}
        </p>

        {/* Details on hover */}
        <motion.div
          animate={{ height: hovered ? 'auto' : 0, opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          style={{ overflow: 'hidden' }}
        >
          <div className={`border-t pt-3 mt-4 ${isDark ? 'border-white/[0.08]' : 'border-slate-200'}`}>
            <p className={`text-[10px] font-bold tracking-widest uppercase mb-2.5 ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>
              What's included →
            </p>
            <ul className="space-y-1.5">
              {feature.details.map((d, i) => (
                <motion.li
                  key={i}
                  className={`flex items-start gap-2 text-xs ${isDark ? 'text-gray-400' : 'text-slate-500'}`}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : -6 }}
                  transition={{ delay: i * 0.05, duration: 0.2 }}
                >
                  <span
                    className="mt-0.5 text-xs flex-shrink-0"
                    style={{ background: feature.gradient, WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                  >
                    ✦
                  </span>
                  {d}
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Learn more */}
        <motion.a
          href="#"
          className={`mt-4 inline-flex items-center gap-1.5 text-xs font-semibold transition-colors ${
            isDark ? 'text-gray-500 hover:text-gray-300' : 'text-slate-400 hover:text-purple-600'
          }`}
          whileHover={{ x: 3 }}
        >
          Learn more
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.a>
      </div>
    </TiltCard3D>
  )
}

import ScrollSectionHeader from '../ui/ScrollSectionHeader'

const Features = () => {
  const { isDark } = useTheme()

  return (
    <section id="features" className={`relative py-20 overflow-hidden transition-colors duration-500 ${isDark ? '' : 'bg-slate-50'}`}>

      {/* ── Background ── */}
      <div className="absolute inset-0 z-0">
        {isDark ? (
          /* Dark mode: mountain photo with dark overlay */
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop')`,
              backgroundAttachment: 'fixed',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
          </div>
        ) : (
          /* Light mode: professional tech/workspace photo, full opacity */
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
         backgroundImage: `url('https://images.unsplash.com/photo-1511818966892-d7d671e672a2?q=80&w=2070&auto=format&fit=crop')`
,
               backgroundAttachment: 'fixed',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Very light overlay — keeps image fully visible, just softens contrast slightly */}
            <div className="absolute inset-0 bg-white/20" />
          </div>
        )}
      </div>

      {/* ── Grid lines – dark mode only ── */}
      {isDark && (
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            backgroundImage: `linear-gradient(rgba(99,102,241,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.4) 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
            opacity: 0.04,
          }}
        />
      )}

      {/* Floating particles */}
      <Particles isDark={isDark} />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <ScrollSectionHeader
          badge="Features"
          titlePrefix="Blogging Made"
          titleHighlight="Simple & Powerful"
          description="Everything you need to create, manage, and grow your blog. Upload your content and let our platform handle the rest."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} isDark={isDark} />
          ))}
        </div>

        {/* ── CTA Buttons ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center mt-14"
        >
          <div className="inline-flex gap-4 flex-wrap justify-center">
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="px-7 py-2.5 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300"
            >
              Get Started Free
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              className={`px-7 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 ${
                isDark
                  ? 'bg-white/[0.05] backdrop-blur-sm border border-white/10 text-white hover:bg-white/10 hover:border-white/20'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm'
              }`}
            >
              Watch Demo
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Features