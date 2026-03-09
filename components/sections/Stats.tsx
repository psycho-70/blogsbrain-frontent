'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'

const AnimatedCounter = ({ value, label }: { value: number; label: string }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (isInView) {
      const duration = 1500 // 1.5 seconds
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
    }
  }, [isInView, value])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="text-center p-8 bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 group"
    >
      <div className="relative">
        {/* Icon background */}
        <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
          className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400 mb-3 relative z-10"
        >
          {count}{value > 100 ? '+' : ''}
        </motion.div>
        <div className="text-gray-400 font-medium text-lg tracking-wide mt-4 relative z-10">
          {label}
        </div>

        {/* Decorative line */}
        <div className="mt-6 w-16 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mx-auto transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
      </div>
    </motion.div>
  )
}

export default function Stats() {
  return (
    <section className="py-24 px-4 relative bg-transparent overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-purple-900/20 rounded-full blur-[80px] opacity-30"></div>
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-900/20 rounded-full blur-[80px] opacity-30"></div>

      <div className="container mx-auto relative z-10">
        {/* Section header */}


        {/* Stats grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
        >
          <AnimatedCounter value={500} label="AI Generated Articles" />
          <AnimatedCounter value={98} label="SEO Score Average" />
          <AnimatedCounter value={1000} label="Daily Interactions" />
        </motion.div>


      </div>
    </section>
  )
}