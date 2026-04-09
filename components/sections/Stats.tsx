'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.92 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.18,
      duration: 0.65,
      ease: 'easeOut' as const,
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
      whileHover={{ y: -8, boxShadow: '0 16px 40px rgba(147,51,234,0.30)', transition: { duration: 0.25 } }}
      className="relative text-center p-8 bg-gray-900/60 backdrop-blur-md rounded-2xl border border-gray-700/60 shadow-lg group overflow-hidden"
    >
      {/* Hover shimmer */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(147,51,234,0.08) 0%, rgba(59,130,246,0.06) 100%)',
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Decorative bg circle */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />

      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.18 + 0.3, duration: 0.5, type: 'spring', stiffness: 110 }}
        className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400 mb-3 relative z-10"
      >
        {count}{value > 100 ? '+' : '%'}
      </motion.div>

      <div className="text-gray-400 font-medium text-lg tracking-wide mt-2 relative z-10">
        {label}
      </div>

      {/* Underbar */}
      <div className="mt-5 w-16 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mx-auto transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
    </motion.div>
  )
}

import ScrollSectionHeader from '../ui/ScrollSectionHeader'

export default function Stats() {
  const sectionRef = useRef(null)
  const titleInView = useInView(sectionRef, { once: true, margin: '-60px' })

  return (
    <section ref={sectionRef} className="py-24 px-4 relative bg-transparent overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-900/20 rounded-full blur-[90px] opacity-40" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-blue-900/20 rounded-full blur-[90px] opacity-40" />

      <div className="container mx-auto relative z-10">
        <ScrollSectionHeader
          badge="Statistics"
          titlePrefix="Trusted by"
          titleHighlight="Creators Worldwide"
          description="Numbers that reflect our growing community and AI-powered platform."
        />

        {/* Stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <AnimatedCounter index={0} value={500} label="AI Generated Articles" />
          <AnimatedCounter index={1} value={98} label="SEO Score Average" />
          <AnimatedCounter index={2} value={1000} label="Daily Interactions" />
        </div>
      </div>
    </section>
  )
}