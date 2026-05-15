'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from '@/contexts/ThemeContext'
import { 
  LayoutDashboard, 
  FileText, 
  PlusCircle, 
  Tag, 
  MessageCircle, 
  Users, 
  Mail, 
  Inbox,
  LogOut,
  Sparkles
} from 'lucide-react'

interface AdminSidebarProps {
  isOpen: boolean
  onClose: () => void
}

const AdminSidebar = ({ isOpen, onClose }: AdminSidebarProps) => {
  const pathname = usePathname()
  const { isDark } = useTheme()

  const menuItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      href: '/admin/dashboard',
    },
    {
      title: 'All Blogs',
      icon: FileText,
      href: '/admin/blogs',
    },
    {
      title: 'Create Blog',
      icon: PlusCircle,
      href: '/admin/blogs/new',
    },
    {
      title: 'Categories',
      icon: Tag,
      href: '/admin/categories',
    },
    {
      title: 'Comments',
      icon: MessageCircle,
      href: '/admin/comments',
    },
    {
      title: 'Users',
      icon: Users,
      href: '/admin/users',
    },
    {
      title: 'Contact Messages',
      icon: Mail,
      href: '/admin/contacts',
    },
    {
      title: 'Email Center',
      icon: Inbox,
      href: '/admin/email-center',
    },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <div className={`h-screen w-[280px] transition-colors duration-300 ${
      isDark 
        ? "bg-gray-900 border-r border-purple-500/30" 
        : "bg-white border-r border-purple-500/30 shadow-lg"
    } overflow-hidden flex flex-col`}>
      {/* Logo */}
      <div className={`px-4 py-[13px] transition-colors duration-300 shrink-0 ${
        isDark ? "border-b border-purple-500/30" : "border-b border-purple-500/30"
      }`}>
        <Link
          href="/"
          className="flex items-center space-x-3 group"
          onClick={onClose}
        >
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-500 rounded-xl group-hover:rotate-180 transition-transform duration-500"></div>
            <div className={`absolute inset-2 rounded-lg flex items-center justify-center ${
              isDark ? "bg-gray-900" : "bg-white"
            }`}>
              <Sparkles size={18} className="text-purple-500" />
            </div>
          </div>
          <div>
            <h2 className={`text-xl font-bold transition-colors duration-300 ${
              isDark ? "text-white neon-text" : "text-gray-900"
            }`}>Einsteine AI</h2>
            <p className={`text-xs transition-colors duration-300 ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}>Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Menu Items - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            
            return (
              <Link
                key={item.title}
                href={item.href}
                onClick={onClose}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                  active
                    ? isDark
                      ? 'bg-gradient-to-r from-purple-600/20 to-blue-500/20 text-white shadow-lg shadow-purple-500/10'
                      : 'bg-gradient-to-r from-purple-600/10 to-blue-500/10 text-gray-900 shadow-lg shadow-purple-500/5 border border-purple-500/20'
                    : isDark
                      ? 'text-gray-400 hover:text-white hover:bg-gray-800/50 hover:shadow-md'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/50 hover:shadow-md'
                }`}
              >
                <Icon size={20} className={active ? (isDark ? "text-purple-400" : "text-purple-600") : ""} />
                <span className="font-medium">{item.title}</span>
                {active && (
                  <div className="ml-auto w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Logout Button */}
        <div className="mt-8 p-4">
          <button
            onClick={() => {
              localStorage.removeItem('token')
              window.location.href = '/admin/login'
            }}
            className={`flex items-center justify-center w-full px-4 py-3 rounded-lg transition-all duration-300 ${
              isDark
                ? 'bg-gradient-to-r from-red-600/20 to-pink-500/20 text-red-400 hover:text-white hover:bg-red-600/30 border border-red-500/30 hover:shadow-md hover:shadow-red-500/10'
                : 'bg-gradient-to-r from-red-600/10 to-pink-500/10 text-red-600 hover:text-white hover:bg-red-600/20 border border-red-500/20 hover:shadow-md hover:shadow-red-500/5'
            }`}
          >
            <LogOut size={18} className="mr-2" />
            Logout
          </button>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${isDark ? '#1f2937' : '#f3f4f6'};
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${isDark ? '#8b5cf6' : '#a855f7'};
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${isDark ? '#a855f7' : '#d946ef'};
        }
      `}</style>
    </div>
  )
}

export default AdminSidebar