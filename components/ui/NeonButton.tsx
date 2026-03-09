import { ButtonHTMLAttributes, ReactNode } from 'react'
import { motion } from 'framer-motion'

interface NeonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'outline'
  glow?: boolean
}

const NeonButton = ({ children, variant = 'primary', glow = true, className = '', ...props }: NeonButtonProps) => {
  const baseClasses = 'relative px-6 py-3 rounded-lg font-semibold transition-all duration-300 overflow-hidden group'
  
  const variants = {
    primary: 'bg-gradient-to-r from-purple-600 to-blue-500 text-white',
    secondary: 'bg-gray-800 text-white border border-purple-500/50',
    outline: 'bg-transparent text-white border border-purple-500',
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`${baseClasses} ${variants[variant]} ${glow ? 'hover:shadow-lg hover:shadow-purple-500/30' : ''} ${className}`}
      {...props}
    >
      {/* Glow effect */}
      {glow && (
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
      )}
      
      {/* Border animation */}
      <div className="absolute inset-0 rounded-lg">
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg blur opacity-0 group-hover:opacity-75 transition duration-500 group-hover:duration-200"></div>
      </div>

      {/* Content */}
      <span className="relative flex items-center justify-center gap-2">
        {children}
      </span>

      {/* Shine effect */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700">
        <div className="w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      </div>
    </motion.button>
  )
}

export default NeonButton