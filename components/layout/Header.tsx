'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useAI } from '@/contexts/AIContext'
import { useTheme } from '@/contexts/ThemeContext'
import { Sun, Moon, LogIn, LogOut, LayoutDashboard } from 'lucide-react'

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState<string>('')
  const pathname = usePathname()
  const router = useRouter()
  const { setMode, setShowAI } = useAI()
  const { theme, toggleTheme, isDark } = useTheme()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    const checkToken = () => {
      setIsLoggedIn(!!localStorage.getItem('token'))
      setUserRole(localStorage.getItem('userRole') || '')
    }

    checkToken()
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('storage', checkToken)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('storage', checkToken)
    }
  }, [])

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'))
    setUserRole(localStorage.getItem('userRole') || '')
  }, [pathname])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userRole')
    localStorage.removeItem('userData')
    setIsLoggedIn(false)
    setUserRole('')
    router.push('/')
  }

  const isAdmin = userRole === 'admin' || userRole === 'author' || userRole === 'editor'
  const dashboardHref = isAdmin ? '/admin/dashboard' : '/dashboard'

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
          ? isDark
            ? 'bg-gray-900/95 backdrop-blur-xl border-b border-purple-500/30 header-scrolled'
            : 'bg-white/97 backdrop-blur-xl border-b border-purple-200/50 shadow-sm header-scrolled'
          : isDark
            ? 'bg-gray-900/40 backdrop-blur-md border-b border-white/10 header-top'
            : 'bg-white/75 backdrop-blur-md border-b border-gray-100 header-top'
          }`}
      >
        <div className="container mx-auto px-4 py-4 relative">
          <div className="flex items-center justify-end md:justify-between h-14">

            {/* ── Logo ── */}
            <Link href="/" className="absolute top-0 left-4 z-50 flex items-center h-25 w-auto group">
              <img
                src="/headerlogo.png"
                alt="Einsteine AI"
                className={`h-full w-auto object-contain drop-shadow-xl transition-all duration-300 ${isDark
                  ? 'brightness-100'                        // original colours on dark bg
                  : 'brightness-0 saturate-0 opacity-90'   // turns white logo → dark/black on light bg
                  }`}
              />
            </Link>

            {/* ── Desktop Navigation – Centre ── */}
            <nav
              className={`hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center space-x-2 p-1 rounded-full border backdrop-blur-md nav-pill ${isDark
                ? 'bg-gray-900/50 border-gray-700/50'
                : 'bg-slate-100/80 border-slate-200/70'
                }`}
            >
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative px-6 py-2 rounded-full transition-all duration-300 text-sm font-medium nav-link-inactive ${isActive(item.href)
                    ? '!text-white bg-gradient-to-r from-purple-600 to-blue-500 shadow-lg shadow-purple-500/25'
                    : isDark
                      ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                    }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* ── Desktop Right Buttons ── */}
            <div className="hidden md:flex items-center space-x-3 ml-auto">

              {/* Theme Toggle */}
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

              {/* ── Auth Buttons ── */}
              {isLoggedIn ? (
                <>
                  <Link href={dashboardHref}>
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      className={`flex items-center gap-1.5 text-sm px-4 py-2 rounded-full border font-medium transition-all duration-200 ${isDark
                          ? 'border-purple-500/60 text-purple-300 hover:text-white hover:border-purple-400 hover:bg-purple-500/10'
                          : 'border-purple-500 text-purple-700 hover:text-purple-900 hover:border-purple-600 hover:bg-purple-50'
                        }`}
                    >
                      <LayoutDashboard size={14} /> Dashboard
                    </motion.button>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${isDark ? 'text-gray-400 hover:text-red-400' : 'text-slate-500 hover:text-red-600'}`}
                  >
                    <LogOut size={14} /> Logout
                  </button>
                </>
              ) : (
                <Link href="/auth/signin">
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    className="flex items-center gap-2 text-sm px-5 py-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold shadow-md shadow-purple-500/20 hover:shadow-purple-500/35 transition-shadow"
                  >
                    <LogIn size={14} /> Sign In
                  </motion.button>
                </Link>
              )}
            </div>

            {/* ── Mobile: Theme Toggle + Hamburger ── */}
            <div className="flex items-center gap-2 md:hidden ml-auto">
              <motion.button
                id="theme-toggle-mobile-btn"
                onClick={toggleTheme}
                whileTap={{ scale: 0.9 }}
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                className={`flex items-center justify-center w-9 h-9 rounded-lg border transition-all duration-300 cursor-pointer ${isDark
                  ? 'bg-gray-800/70 border-gray-700 text-yellow-300'
                  : 'bg-amber-50 border-amber-200 text-amber-600'
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
                    {isDark ? <Sun size={16} /> : <Moon size={16} />}
                  </motion.span>
                </AnimatePresence>
              </motion.button>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-2 rounded-lg border mobile-menu-btn ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-slate-100 border-slate-200'
                  }`}
              >
                <div className="w-6 h-6 flex flex-col justify-center items-center">
                  <span
                    className={`block w-5 h-0.5 transition-transform duration-300 ${isDark ? 'bg-white' : 'bg-slate-800'
                      } ${isMenuOpen ? 'rotate-45 translate-y-1' : ''}`}
                  />
                  <span
                    className={`block w-5 h-0.5 mt-1 transition-opacity duration-300 ${isDark ? 'bg-white' : 'bg-slate-800'
                      } ${isMenuOpen ? 'opacity-0' : ''}`}
                  />
                  <span
                    className={`block w-5 h-0.5 mt-1 transition-transform duration-300 ${isDark ? 'bg-white' : 'bg-slate-800'
                      } ${isMenuOpen ? '-rotate-45 -translate-y-1' : ''}`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-4 right-4 z-40 md:hidden"
          >
            <div
              className={`backdrop-blur-xl rounded-2xl border shadow-2xl overflow-hidden mobile-menu-bg ${isDark
                ? 'bg-gray-900/97 border-purple-500/30'
                : 'bg-white/98 border-purple-200/40 shadow-purple-100/20'
                }`}
            >
              <div className="p-4 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-4 py-3 rounded-lg transition-all duration-300 mobile-menu-link-inactive ${isActive(item.href)
                      ? 'text-white bg-gradient-to-r from-purple-600/20 to-blue-500/20'
                      : isDark
                        ? 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                      }`}
                  >
                    {item.name}
                  </Link>
                ))}

                {isLoggedIn ? (
                  <>
                    <Link
                      href={dashboardHref}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-lg border text-center transition-colors ${isDark ? 'border-purple-500/50 text-purple-300 hover:bg-purple-500/10' : 'border-purple-500 text-purple-700 hover:bg-purple-50'}`}
                    >
                      <LayoutDashboard size={15} /> Dashboard
                    </Link>
                    <button
                      onClick={() => { handleLogout(); setIsMenuOpen(false) }}
                      className={`w-full px-4 py-3 rounded-lg border text-center transition-colors flex items-center justify-center gap-2 ${isDark ? 'border-red-500/50 text-red-400 hover:bg-red-500/10' : 'border-red-400 text-red-600 hover:bg-red-50'}`}
                    >
                      <LogOut size={15} /> Logout
                    </button>
                  </>
                ) : (
                  <Link
                    href="/auth/signin"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold text-sm"
                  >
                    <LogIn size={15} /> Sign In
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