'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface AdminHeaderProps {
  onMenuClick: () => void
}

const AdminHeader = ({ onMenuClick }: AdminHeaderProps) => {
  const [notifications] = useState(3)
  const [user] = useState({
    name: 'Admin User',
    role: 'Super Admin'
  })

  return (
    <header className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur-xl border-b border-purple-500/30">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left side */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onMenuClick}
              className="p-2 rounded-lg bg-gray-800/50 border border-gray-700 hover:border-purple-500/50 transition-colors md:hidden"
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span className="block w-5 h-0.5 bg-white"></span>
                <span className="block w-5 h-0.5 bg-white mt-1"></span>
                <span className="block w-5 h-0.5 bg-white mt-1"></span>
              </div>
            </button>

            {/* Breadcrumb */}
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-400">
              <span className="hover:text-purple-400 cursor-pointer">Admin</span>
              <span className="text-gray-600">/</span>
              <span className="text-white">Dashboard</span>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            {/* <div className="hidden md:block relative">
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:border-purple-500 focus:outline-none text-white text-sm w-64"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                🔍
              </div>
            </div> */}

            {/* Notifications */}
            {/* <button className="relative p-2 rounded-lg bg-gray-800/50 border border-gray-700 hover:border-purple-500/50 transition-colors">
              <span className="text-xl">🔔</span>
              {notifications > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full text-xs flex items-center justify-center"
                >
                  {notifications}
                </motion.span>
              )}
            </button> */}

            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-gray-400">{user.role}</p>
              </div>
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full"></div>
                <div className="absolute inset-1 bg-gray-900 rounded-full flex items-center justify-center">
                  <span className="text-lg">👤</span>
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