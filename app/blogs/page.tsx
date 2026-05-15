'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import BlogCard3D from '@/components/ui/BlogCard3D'
import CTAButton from '@/components/ui/CTAButton'
import { motion } from 'framer-motion'
import Typewriter from '@/components/ui/Typewriter'
import { getBlogs, getCategories, BlogListItem } from '@/lib/api'
import Link from 'next/link'
import { useTheme } from '@/contexts/ThemeContext'

const words = ["Insights", "Trending", "Knowledge", "Innovation"]

export default function BlogsPage() {
  const [selectedCategory, setSelectedCategory] = useState<any>({ name: 'All Topics', slug: 'all', id: null })
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [blogs, setBlogs] = useState<BlogListItem[]>([])
  const [categories, setCategories] = useState<any[]>([{ name: 'All Topics', slug: 'all', id: null }])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const { isDark } = useTheme()

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Fetch initial data (blogs + categories)
  useEffect(() => {
    async function initData() {
      try {
        setLoading(true)
        try {
          const catRes = await getCategories()
          const catList = [{ name: 'All Topics', slug: 'all', id: null }, ...catRes.categories]
          setCategories(catList)
        } catch (e) {
          console.error("Failed to load categories", e)
        }
        await fetchBlogs(1, true)
      } catch (err) {
        setError('Failed to load content. Please try again later.')
        console.error(err)
        setLoading(false)
      }
    }
    initData()
  }, [])

  const isInitialMount = useRef(true)

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }
    const timer = setTimeout(() => {
      fetchBlogs(1, true)
    }, searchQuery ? 500 : 50)
    return () => clearTimeout(timer)
  }, [selectedCategory.slug, searchQuery])

  const fetchBlogs = async (pageNum: number, reset: boolean) => {
    try {
      setLoading(true)
      const res = await getBlogs({
        page: pageNum,
        per_page: 6,
        search: searchQuery,
        category_id: selectedCategory.id || undefined,
        category_slug: selectedCategory.slug !== 'all' ? selectedCategory.slug : undefined
      })

      if (reset) {
        setBlogs(res.blogs)
      } else {
        setBlogs(prev => [...prev, ...res.blogs])
      }

      setHasMore(res.pagination.has_next)
      setPage(pageNum)
      setError(null)
    } catch (err) {
      console.error(err)
      setError('Failed to fetch blogs')
    } finally {
      setLoading(false)
    }
  }

  const handleLoadMore = () => {
    fetchBlogs(page + 1, false)
  }

  const handleTypewriterComplete = useCallback(() => {
    setTimeout(() => {
      setCurrentWordIndex((prev) => (prev + 1) % words.length)
    }, 1500)
  }, [])

  return (
    <div className={`min-h-screen pb-20 ${isDark ? 'bg-transparent' : 'bg-gradient-to-br from-slate-50 via-purple-50/30 to-blue-50/40'}`}>
      {/* Background with grid pattern */}
      <div className="fixed inset-0 z-0 pointer-events-none">
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
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent animate-gradient-x" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/10 to-transparent animate-gradient-y" />
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
            <div className="absolute inset-0 bg-white/82" />
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50/60 via-white/40 to-blue-50/70" />
            
            <div
              className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full opacity-25 pointer-events-none"
              style={{
                background: 'radial-gradient(circle, rgba(139,92,246,0.22) 0%, transparent 70%)',
                transform: 'translate(-30%, -30%)',
              }}
            />
            <div
              className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full opacity-20 pointer-events-none"
              style={{
                background: 'radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%)',
                transform: 'translate(20%, 20%)',
              }}
            />
            
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: `linear-gradient(rgba(0,0,0,0.08) 1px, transparent 1px),
                                  linear-gradient(90deg, rgba(0,0,0,0.08) 1px, transparent 1px)`,
                backgroundSize: '60px 60px',
              }}
            />
            
            <div className="absolute inset-0 opacity-15">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-200/50 to-transparent animate-gradient-x" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-100/40 to-transparent animate-gradient-y" />
            </div>
          </div>
        )}
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden py-32">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.215, 0.61, 0.355, 1.0] }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className={`text-6xl md:text-8xl font-bold mb-8 tracking-tight leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <span className={`block mb-4 ${isDark ? 'drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]' : ''}`}>Explore Our</span>
              <span
                className="inline-block relative"
                style={{
                  textShadow: isDark 
                    ? '0 0 15px rgba(168, 85, 247, 0.6), 0 0 30px rgba(59, 130, 246, 0.4)'
                    : 'none'
                }}
              >
                <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                  <Typewriter
                    key={currentWordIndex}
                    text={words[currentWordIndex]}
                    speed={70}
                    onComplete={handleTypewriterComplete}
                  />
                </span>
              </span>
            </h1>
            <p className={`text-xl md:text-2xl mb-12 max-w-2xl mx-auto leading-relaxed ${isDark ? 'text-gray-300 drop-shadow-[0_0_10px_rgba(168,85,247,0.3)]' : 'text-slate-600'}`}>
              Dive into interactive content that <span className={`font-semibold ${isDark ? 'text-white' : 'text-purple-700'}`}>learns, adapts,</span> and engages with you in real-time.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-16 relative">
              <div className={`absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-xl opacity-50 ${isDark ? '' : 'hidden'}`} />
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for topics, keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full px-8 py-5 rounded-2xl border-2 transition-all shadow-2xl ${
                    isDark
                      ? 'bg-gray-900/60 backdrop-blur-xl border-purple-500/30 focus:border-purple-500 text-white placeholder-gray-400'
                      : 'bg-white/80 backdrop-blur-xl border-purple-300/50 focus:border-purple-500 text-slate-900 placeholder-slate-400'
                  }`}
                />
                <button className="absolute right-4 top-1/2 transform -translate-y-1/2 group">
                  <div className={`p-3 rounded-xl shadow-lg transition-all ${
                    isDark
                      ? 'bg-gradient-to-r from-purple-600 to-blue-500 group-hover:shadow-purple-500/50'
                      : 'bg-gradient-to-r from-purple-500 to-blue-500 group-hover:shadow-purple-400/50'
                  }`}>
                    <span className="text-white text-xl">🔍</span>
                  </div>
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50">
          {mounted && [...Array(10)].map((_, i) => (
            <div
              key={i}
              className={`absolute rounded-full ${isDark ? 'bg-gradient-to-r from-blue-400/20 to-purple-400/20' : 'bg-gradient-to-r from-blue-500/15 to-purple-500/15'}`}
              style={{
                width: Math.random() * 6 + 2 + 'px',
                height: Math.random() * 6 + 2 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                animation: `float-particle ${Math.random() * 10 + 15}s linear infinite`,
                animationDelay: Math.random() * 5 + 's',
                filter: 'blur(1px)',
              }}
            />
          ))}
        </div>

        <style jsx>{`
          @keyframes gradient-x {
            0%, 100% { transform: translateX(-100%); }
            50% { transform: translateX(100%); }
          }
          @keyframes gradient-y {
            0%, 100% { transform: translateY(-100%); }
            50% { transform: translateY(100%); }
          }
          @keyframes float-particle {
            0% { transform: translateY(0) translateX(0); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translateY(-100vh) translateX(100px); opacity: 0; }
          }
          .animate-gradient-x { animation: gradient-x 15s ease-in-out infinite; }
          .animate-gradient-y { animation: gradient-y 20s ease-in-out infinite; }
        `}</style>
      </div>

      {/* Categories */}
      <div className="container mx-auto px-4 py-10 relative z-10">
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map((category, index) => (
            <motion.button
              key={category.slug}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full transition-all duration-300 ${
                selectedCategory.slug === category.slug
                  ? isDark
                    ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-lg shadow-purple-500/30'
                    : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-400/40'
                  : isDark
                    ? 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50'
                    : 'bg-gray-200/70 text-slate-600 hover:text-slate-900 hover:bg-gray-300/70'
              }`}
            >
              {category.name}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Blogs Grid */}
      <div className="container mx-auto px-4 relative z-10">
        {loading && blogs.length === 0 ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-400">
            <p>{error}</p>
            <button onClick={() => fetchBlogs(1, true)} className="mt-4 text-white underline">Try Again</button>
          </div>
        ) : blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog, index) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <BlogCard3D blog={blog} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🤖</div>
            <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>No blogs found</h3>
            <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>Try adjusting your search or filters</p>
            <CTAButton buttonId="blogs-reset-filters" onClick={() => { setSelectedCategory({ name: 'All Topics', slug: 'all', id: null }); setSearchQuery('') }}>
              Reset Filters
            </CTAButton>
          </div>
        )}

        {/* Load More */}
        {hasMore && !loading && (
          <div className="text-center mt-16">
            <CTAButton
              buttonId="blogs-load-more"
              className={`px-8 py-4 border-2 transition-all duration-300 !bg-none ${
                isDark
                  ? 'bg-transparent border-purple-500 hover:border-blue-500 text-white'
                  : 'bg-transparent border-purple-500 text-purple-700 hover:border-blue-500 hover:text-blue-700'
              }`}
              onClick={handleLoadMore}
            >
              Load More Blogs
            </CTAButton>
          </div>
        )}
        {loading && blogs.length > 0 && (
          <div className={`text-center mt-8 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>Loading more...</div>
        )}
      </div>
    </div>
  )
}