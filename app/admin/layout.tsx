'use client'

import { ReactNode, useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import AdminSidebar from '@/components/admin/Adminsidebar'
import AdminHeader from '@/components/admin/Adminheader'
import { motion } from 'framer-motion'

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
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
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="min-h-screen bg-gray-900 flex">
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
        <div className="flex-1 flex flex-col md:ml-[280px] w-full">
          {/* Header - Sticky at top */}
          <div className="sticky top-0 z-30">
            <AdminHeader onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
          </div>

          {/* Content - Scrollable */}
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex-1 p-4 md:p-6 overflow-auto bg-gradient-to-br from-gray-900 via-gray-900/95 to-gray-900/90"
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