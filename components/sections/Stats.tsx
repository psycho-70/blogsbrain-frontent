'use client'

import { motion, useInView, Variants } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import ScrollSectionHeader from '../ui/ScrollSectionHeader'

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.92 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.18,
      duration: 0.65,
      ease: 'easeOut',
      type: 'spring',
      stiffness: 90,
      damping: 14,
    },
  }),
}

const AnimatedCounter = ({
  value,
  label,
  index,
}: {
  value: number
  label: string
  index: number
}) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const [count, setCount] = useState(0)
  const { isDark } = useTheme()

  useEffect(() => {
    if (!isInView) return
    const duration = 1800
    const steps = 60
    const stepValue = value / steps
    const stepTime = duration / steps
    let current = 0
    const timer = setInterval(() => {
      current += stepValue
      if (current >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, stepTime)
    return () => clearInterval(timer)
  }, [isInView, value])

  return (
    <motion.div
      ref={ref}
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      whileHover={{ y: -8, boxShadow: isDark ? '0 16px 40px rgba(147,51,234,0.30)' : '0 16px 40px rgba(147,51,234,0.15)', transition: { duration: 0.25 } }}
      className={`relative text-center p-8 backdrop-blur-md rounded-2xl border shadow-lg group overflow-hidden transition-colors duration-300 ${isDark
          ? 'bg-gray-900/60 border-gray-700/60'
          : 'bg-white/80 border-slate-200/80 shadow-slate-100'
        }`}
    >
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none"
        style={{
          background: isDark
            ? 'linear-gradient(135deg, rgba(147,51,234,0.08) 0%, rgba(59,130,246,0.06) 100%)'
            : 'linear-gradient(135deg, rgba(147,51,234,0.05) 0%, rgba(59,130,246,0.04) 100%)',
        }}
        transition={{ duration: 0.3 }}
      />

      <div className={`absolute -top-10 -right-10 w-24 h-24 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl ${isDark ? 'bg-gradient-to-br from-purple-900/30 to-blue-900/30' : 'bg-gradient-to-br from-purple-200/40 to-blue-200/40'
        }`} />

      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.18 + 0.3, duration: 0.5, type: 'spring', stiffness: 110 }}
        className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400 mb-3 relative z-10"
      >
        {count}{value > 100 ? '+' : '%'}
      </motion.div>

      <div className={`font-medium text-lg tracking-wide mt-2 relative z-10 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
        {label}
      </div>

      <div className="mt-5 w-16 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mx-auto transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
    </motion.div>
  )
}

export default function Stats() {
  const sectionRef = useRef(null)
  const { isDark } = useTheme()

  return (
    <section ref={sectionRef} className="py-24 px-4 relative overflow-hidden">
      {/* Background with grid pattern (same as Hero) */}
      <div className="absolute inset-0 z-0">
        {isDark ? (
          <div
            className="absolute inset-0 bg-cover bg-center"
            // style={{
            //   backgroundImage: "url('/herobackgrond.svg')",
            //   backgroundSize: 'cover',
            //   backgroundPosition: 'center',
            //   backgroundColor: '#000',
            // }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-purple-900/10 to-black/60" />
            <div className="absolute inset-0 opacity-30">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent animate-gradient-x" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/10 to-transparent animate-gradient-y" />
            </div>
          </div>
        ) : (
          <div className="absolute inset-0">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: "url('/herobackgrond.svg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: '#fff',
              }}
            />
            <div className="absolute inset-0 bg-white/82" />
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50/60 via-white/40 to-blue-50/70" />
            
            <div
              className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full opacity-25 pointer-events-none"
              style={{
                background: 'radial-gradient(circle, rgba(139,92,246,0.22) 0%, transparent 70%)',
                transform: 'translate(-30%, -30%)',
              }}
            />
            <div
              className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full opacity-20 pointer-events-none"
              style={{
                background: 'radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%)',
                transform: 'translate(20%, 20%)',
              }}
            />
            
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: `linear-gradient(rgba(0,0,0,0.08) 1px, transparent 1px),
                                  linear-gradient(90deg, rgba(0,0,0,0.08) 1px, transparent 1px)`,
                backgroundSize: '60px 60px',
              }}
            />
            
            <div className="absolute inset-0 opacity-15">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-200/50 to-transparent animate-gradient-x" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-100/40 to-transparent animate-gradient-y" />
            </div>
          </div>
        )}
      </div>

      <div className="container mx-auto relative z-10">
        <ScrollSectionHeader
          badge="Statistics"
          titlePrefix="Trusted by"
          titleHighlight="Creators Worldwide"
          description="Numbers that reflect our growing community and AI-powered platform."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <AnimatedCounter index={0} value={500} label="AI Generated Articles" />
          <AnimatedCounter index={1} value={98} label="SEO Score Average" />
          <AnimatedCounter index={2} value={1000} label="Daily Interactions" />
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
        }
        @keyframes gradient-y {
          0%, 100% { transform: translateY(-100%); }
          50% { transform: translateY(100%); }
        }
        .animate-gradient-x { animation: gradient-x 15s ease-in-out infinite; }
        .animate-gradient-y { animation: gradient-y 20s ease-in-out infinite; }
      `}</style>
    </section>
  )
}