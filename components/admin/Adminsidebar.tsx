'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface AdminSidebarProps {
  isOpen: boolean
  onClose: () => void
}

const AdminSidebar = ({ isOpen, onClose }: AdminSidebarProps) => {
  const pathname = usePathname()

  const menuItems = [
    {
      title: 'Dashboard',
      icon: '📊',
      href: '/admin/dashboard',
    },
    {
      title: 'All Blogs',
      icon: '📝',
      href: '/admin/blogs',
    },
    {
      title: 'Create Blog',
      icon: '✨',
      href: '/admin/blogs/new',
    },
    {
      title: 'Categories',
      icon: '🏷️',
      href: '/admin/categories',
    },
    {
      title: 'Comments',
      icon: '💬',
      href: '/admin/comments',
    },
    {
      title: 'Users',
      icon: '👥',
      href: '/admin/users',
    },
    {
      title: 'Contact Messages',
      icon: '📩',
      href: '/admin/contacts',
    },

  ]


  const isActive = (href: string) => pathname === href

  return (
    <div className="h-screen w-[280px] bg-gray-900 border-r border-purple-500/30 shadow-2xl overflow-hidden flex flex-col">
      {/* Logo */}
      <div className="px-4 py-[13px] border-b border-purple-500/30 shrink-0">
        <Link
          href="/"
          className="flex items-center space-x-3 group"
          onClick={onClose}
        >
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-500 rounded-xl group-hover:rotate-180 transition-transform duration-500"></div>
            <div className="absolute inset-2 bg-gray-900 rounded-lg flex items-center justify-center">
              <span className="text-xl font-bold">⚡</span>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold neon-text">Einsteine AI</h2>
            <p className="text-xs text-gray-400">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Menu Items - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4">
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              onClick={onClose}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${isActive(item.href)
                  ? 'bg-gradient-to-r from-purple-600/20 to-blue-500/20 text-white shadow-lg shadow-purple-500/10'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50 hover:shadow-md'
                }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.title}</span>
              {isActive(item.href) && (
                <div className="ml-auto w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
              )}
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="mt-8 p-4">
          <button
            onClick={() => {
              localStorage.removeItem('token')
              window.location.href = '/admin/login'
            }}
            className="flex items-center justify-center w-full px-4 py-3 rounded-lg bg-gradient-to-r from-red-600/20 to-pink-500/20 text-red-400 hover:text-white hover:bg-red-600/30 transition-all duration-300 border border-red-500/30 hover:shadow-md hover:shadow-red-500/10"
          >
            <span className="mr-2">🚪</span>
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminSidebar