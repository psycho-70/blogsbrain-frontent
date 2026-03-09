'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import NeonButton from '../ui/NeonButton'
import { useAI } from '@/contexts/AIContext'

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { setMode, setShowAI } = useAI()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    // Check for admin token
    const token = localStorage.getItem('token')
    setIsAdminLoggedIn(!!token)

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('storage', () => { // Listen for storage changes in other tabs/windows or login actions
      const token = localStorage.getItem('token')
      setIsAdminLoggedIn(!!token)
    })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Re-check auth on pathname change (e.g. after login redirect)
  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsAdminLoggedIn(!!token)
  }, [pathname])

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsAdminLoggedIn(false)
    router.push('/')
  }

  const handleAIChat = () => {
    setShowAI(true)
    setMode('chat')
  }

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Blogs', href: '/blogs' },
    { name: 'Affiliate', href: '/affiliate' },
    { name: 'About', href: '/aboutus' },
    { name: 'Contact', href: '/contactus' },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? 'bg-gray-900/95 backdrop-blur-xl border-b border-purple-500/30'
          : 'bg-gray-900/40 backdrop-blur-md border-b border-white/10'
          }`}
      >
        <div className="container mx-auto px-4 py-4 relative">
          <div className="flex items-center justify-end md:justify-between h-14"> {/* Fixed height container */}

            {/* Logo - Absolutely positioned to overflow/resize independently */}
            <Link href="/" className="absolute top-0 left-4 z-50 flex items-center h-25 w-auto group">
              <img src="/headerlogo.png" alt="Einsteine AI" className="h-full w-auto object-contain drop-shadow-xl filter" />
            </Link>

            {/* Desktop Navigation - Center */}
            <nav className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center space-x-2 bg-gray-900/50 p-1 rounded-full border border-gray-700/50 backdrop-blur-md">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative px-6 py-2 rounded-full transition-all duration-300 text-sm font-medium ${isActive(item.href)
                    ? 'text-white bg-gradient-to-r from-purple-600 to-blue-500 shadow-lg shadow-purple-500/25'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Desktop Buttons - Right */}
            <div className="hidden md:flex items-center space-x-4 ml-auto">
              {isAdminLoggedIn ? (
                <>
                  <Link href="/admin/dashboard">
                    <NeonButton variant="outline" className="text-sm px-4 py-2">
                      Dashboard
                    </NeonButton>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-gray-400 hover:text-white text-sm font-medium transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link href="/admin/login">
                  <NeonButton variant="outline" className="text-sm px-4 py-2">
                    Admin
                  </NeonButton>
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-gray-800/50 border border-gray-700 ml-auto"
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span className={`block w-5 h-0.5 bg-white transition-transform duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1' : ''}`}></span>
                <span className={`block w-5 h-0.5 bg-white mt-1 transition-opacity duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`block w-5 h-0.5 bg-white mt-1 transition-transform duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1' : ''}`}></span>
              </div>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-4 right-4 z-40 md:hidden"
          >
            <div className="bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-purple-500/30 shadow-2xl overflow-hidden">
              <div className="p-4 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-4 py-3 rounded-lg transition-all duration-300 ${isActive(item.href)
                      ? 'text-white bg-gradient-to-r from-purple-600/20 to-blue-500/20'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                      }`}
                  >
                    {item.name}
                  </Link>
                ))}


                {isAdminLoggedIn ? (
                  <>
                    <Link
                      href="/admin/dashboard"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-3 rounded-lg border border-purple-500/50 text-center hover:bg-purple-500/10 transition-colors"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout()
                        setIsMenuOpen(false)
                      }}
                      className="w-full px-4 py-3 rounded-lg border border-red-500/50 text-center hover:bg-red-500/10 transition-colors text-red-400"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    href="/admin/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-3 rounded-lg border border-purple-500/50 text-center hover:bg-purple-500/10 transition-colors"
                  >
                    Admin Login
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Header