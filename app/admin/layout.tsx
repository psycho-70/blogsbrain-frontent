'use client'

import { ReactNode, useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import AdminSidebar from '@/components/admin/Adminsidebar'
import AdminHeader from '@/components/admin/Adminheader'
import { motion } from 'framer-motion'
import { useTheme } from '@/contexts/ThemeContext'

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { isDark } = useTheme()
  const [isLoading, setIsLoading] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token && pathname !== '/admin/login') {
      router.push('/admin/login')
    } else {
      setIsLoading(false)
    }
  }, [router, pathname])

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-slate-50'}`}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className={isDark ? 'text-gray-400' : 'text-slate-500'}>Loading admin panel...</p>
        </div>
      </div>
    )
  }

  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  return (
    <>
      {/* Background Grid Pattern - Fixed across all admin pages */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {isDark ? (
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "url('/herobackgrond.svg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundColor: '#000'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-purple-900/10 to-black/60" />
            <div className="absolute inset-0 opacity-30">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent animate-[gradient-x_15s_ease-in-out_infinite]" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/10 to-transparent animate-[gradient-y_20s_ease-in-out_infinite]" />
            </div>
          </div>
        ) : (
          <div className="absolute inset-0">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: "url('/herobackgrond.svg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: '#fff'
              }}
            />
            <div className="absolute inset-0 bg-white/85" />
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50/60 via-white/40 to-blue-50/70" />

            <div
              className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full opacity-30"
              style={{
                background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
                transform: 'translate(-30%, -30%)',
              }}
            />
            <div
              className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full opacity-25"
              style={{
                background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)',
                transform: 'translate(20%, 20%)',
              }}
            />

            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `linear-gradient(rgba(139,92,246,0.06) 1px, transparent 1px),
                                  linear-gradient(90deg, rgba(139,92,246,0.06) 1px, transparent 1px)`,
                backgroundSize: '50px 50px',
              }}
            />

            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-300/30 to-transparent animate-[gradient-x_15s_ease-in-out_infinite]" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-200/20 to-transparent animate-[gradient-y_20s_ease-in-out_infinite]" />
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes gradient-x {
          0%, 100% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
        }
        @keyframes gradient-y {
          0%, 100% { transform: translateY(-100%); }
          50% { transform: translateY(100%); }
        }
      `}</style>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className={`min-h-screen relative flex transition-colors duration-500 ${isDark ? 'bg-gray-950' : 'bg-slate-50'}`}>
        {/* Sidebar - Fixed on desktop, absolute on mobile */}
        <div className={`
          fixed md:fixed left-0 top-0 h-full z-50
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0 md:z-40
          transition-transform duration-300
        `}>
          <AdminSidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
        </div>

        {/* Main Content - With margin-left for sidebar on desktop */}
        <div className="flex-1 flex flex-col md:ml-[280px] w-full relative z-10">
          {/* Header - Sticky at top */}
          <div className="sticky top-0 z-30">
            <AdminHeader onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
          </div>

          {/* Content - Scrollable */}
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex-1 p-4 md:p-6 overflow-auto"
          >
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </motion.main>
        </div>
      </div>
    </>
  )
}
