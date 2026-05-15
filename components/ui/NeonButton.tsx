'use client'

import { ReactNode } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { useTheme } from '@/contexts/ThemeContext'

interface NeonButtonProps extends HTMLMotionProps<"button"> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'outline'
  glow?: boolean
}

const NeonButton = ({ children, variant = 'primary', glow = true, className = '', ...props }: NeonButtonProps) => {
  const { isDark } = useTheme()
  
  const baseClasses = 'relative px-6 py-3 rounded-lg font-semibold transition-all duration-300 overflow-hidden group'

  const variants = {
    primary: isDark 
      ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white'
      : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md',
    secondary: isDark
      ? 'bg-gray-800 text-white border border-purple-500/50 hover:bg-gray-700'
      : 'bg-white text-slate-700 border border-purple-300/60 hover:bg-slate-50 shadow-sm',
    outline: isDark
      ? 'bg-transparent text-white border border-purple-500 hover:bg-purple-500/10'
      : 'bg-transparent text-purple-600 border border-purple-400 hover:bg-purple-50',
  }

  const glowClasses = () => {
    if (!glow) return ''
    
    if (variant === 'primary') {
      return isDark
        ? 'hover:shadow-lg hover:shadow-purple-500/40'
        : 'hover:shadow-md hover:shadow-purple-400/30'
    }
    
    if (variant === 'secondary') {
      return isDark
        ? 'hover:shadow-lg hover:shadow-purple-500/20'
        : 'hover:shadow-md hover:shadow-purple-300/20'
    }
    
    return isDark
      ? 'hover:shadow-lg hover:shadow-purple-500/20'
      : 'hover:shadow-md hover:shadow-purple-300/15'
  }

  const getGlowGradient = () => {
    if (variant === 'primary') {
      return 'from-purple-600 to-blue-500'
    }
    return 'from-purple-500 to-blue-400'
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseClasses} ${variants[variant]} ${glowClasses()} ${className}`}
      {...props}
    >
      {/* Glow effect background */}
      {glow && variant === 'primary' && (
        <div className={`absolute inset-0 bg-gradient-to-r ${getGlowGradient()} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
      )}
      
      {glow && variant !== 'primary' && isDark && (
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      )}
      
      {glow && variant !== 'primary' && !isDark && (
        <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-blue-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      )}

      {/* Border animation for outline variant */}
      {variant === 'outline' && (
        <div className="absolute inset-0 rounded-lg">
          <div className={`absolute -inset-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg blur opacity-0 group-hover:opacity-50 transition duration-500 group-hover:duration-200 ${!isDark ? 'opacity-30' : ''}`}></div>
        </div>
      )}

      {/* Content */}
      <span className="relative flex items-center justify-center gap-2 z-10">
        {children}
      </span>

      {/* Shine effect - only for primary variant in dark mode */}
      {(variant === 'primary' && isDark) && (
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700">
          <div className="w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        </div>
      )}

      {/* Subtle shine for light mode primary */}
      {(variant === 'primary' && !isDark && glow) && (
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700">
          <div className="w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
        </div>
      )}

      {/* Ripple effect on click */}
      <div className="absolute inset-0 overflow-hidden rounded-lg">
        <div className="absolute w-full h-full scale-0 opacity-0 group-active:scale-150 group-active:opacity-100 transition-all duration-300 bg-white/10 rounded-full"></div>
      </div>
    </motion.button>
  )
}

export default NeonButton