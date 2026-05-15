'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/contexts/ThemeContext'
import { Sun, Moon, Search, Bell, User } from 'lucide-react'

interface AdminHeaderProps {
  onMenuClick: () => void
}

const AdminHeader = ({ onMenuClick }: AdminHeaderProps) => {
  const { theme, toggleTheme, isDark } = useTheme()
  const [notifications] = useState(3)
  const [user, setUser] = useState({
    name: 'Admin User',
    role: 'Super Admin',
    profile_image: ''
  })

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser({
          name: parsedUser.username?.split('@')[0] || 'Admin User',
          role: 'Super Admin',
          profile_image: parsedUser.profile_image || ''
        })
      } catch (e) {
        console.error('Failed to parse user from localStorage', e)
      }
    }
  }, [])

  return (
    <header className={`sticky top-0 z-40 transition-colors duration-300 ${isDark
      ? "bg-gray-900/95 backdrop-blur-xl border-b border-purple-500/30"
      : "bg-white/95 backdrop-blur-xl border-b border-purple-500/30"
      }`}>
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left side */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onMenuClick}
              className={`p-2 rounded-lg transition-colors md:hidden ${isDark
                ? "bg-gray-800/50 border border-gray-700 hover:border-purple-500/50"
                : "bg-gray-100/50 border border-gray-200 hover:border-purple-500/50"
                }`}
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span className={`block w-5 h-0.5 transition-colors ${isDark ? "bg-white" : "bg-gray-800"
                  }`}></span>
                <span className={`block w-5 h-0.5 transition-colors mt-1 ${isDark ? "bg-white" : "bg-gray-800"
                  }`}></span>
                <span className={`block w-5 h-0.5 transition-colors mt-1 ${isDark ? "bg-white" : "bg-gray-800"
                  }`}></span>
              </div>
            </button>

            {/* Breadcrumb */}
            <div className="hidden md:flex items-center space-x-2 text-sm">
              <span className={`transition-colors cursor-pointer ${isDark ? "text-gray-400 hover:text-purple-400" : "text-gray-500 hover:text-purple-600"
                }`}>Admin</span>
              <span className={isDark ? "text-gray-600" : "text-gray-300"}>/</span>
              <span className={isDark ? "text-white" : "text-gray-900"}>Dashboard</span>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle Button */}
            <motion.button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className={`relative flex items-center justify-center w-10 h-10 rounded-full border transition-all duration-300 cursor-pointer ${isDark
                ? 'bg-gray-800/80 border-gray-600 hover:border-yellow-400/60 hover:bg-gray-700 text-yellow-300'
                : 'bg-amber-50 border-amber-200 hover:border-amber-400 hover:bg-amber-100 text-amber-600'
                }`}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={theme}
                  initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-center"
                >
                  {isDark ? <Sun size={17} /> : <Moon size={17} />}
                </motion.span>
              </AnimatePresence>
            </motion.button>

            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <div className="hidden md:block text-right">
                <p className={`text-sm font-medium transition-colors ${isDark ? "text-white" : "text-gray-900"
                  }`}>{user.name}</p>
                <p className={`text-xs transition-colors ${isDark ? "text-gray-400" : "text-gray-500"
                  }`}>{user.role}</p>
              </div>
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full overflow-hidden flex items-center justify-center">
                  {user.profile_image ? (
                    <img
                      src={user.profile_image.startsWith('http') ? user.profile_image : (user.profile_image.startsWith('/uploads/') ? user.profile_image : `/uploads/${user.profile_image}`)}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={18} className="text-white" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default AdminHeader