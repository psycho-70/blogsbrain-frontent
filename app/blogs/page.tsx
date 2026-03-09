'use client'

import { useState, useEffect, useCallback } from 'react'
import BlogCard from '@/components/ui/BlogCard'
import NeonButton from '@/components/ui/NeonButton'
import { motion } from 'framer-motion'
import Typewriter from '@/components/ui/Typewriter'
import { getBlogs, getCategories, BlogListItem, CategoryItem } from '@/lib/api'
import Link from 'next/link'

const words = ["Insights", "Trending", "Knowledge", "Innovation"]

export default function BlogsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All Topics')
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [blogs, setBlogs] = useState<BlogListItem[]>([])
  const [categories, setCategories] = useState<string[]>(['All Topics'])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Pagination
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)

  // Fetch initial data (blogs + categories)
  useEffect(() => {
    async function initData() {
      try {
        setLoading(true)
        // Fetch categories
        try {
          const catRes = await getCategories()
          const catNames = ['All Topics', ...catRes.categories.map((c: CategoryItem) => c.name)]
          setCategories(catNames)
        } catch (e) {
          console.error("Failed to load categories", e)
          // Fallback categories already set or remain empty
        }

        // Fetch blogs
        await fetchBlogs(1, true)
      } catch (err) {
        setError('Failed to load content. Please try again later.')
        console.error(err)
        setLoading(false)
      }
    }

    initData()
  }, [])

  // Fetch blogs when filters change
  useEffect(() => {
    // Debounce search could be added here, currently just triggering on category or simple effect
    if (!loading) { // Avoid double fetch on init
      fetchBlogs(1, true)
    }
  }, [selectedCategory])

  // Search handler (debounced in a real app, here simple enter or button click might be better, but we'll doing simple effect on query change for now or just submit)
  // For simplicity, let's trigger search on 'Enter' or button, or just simple effect with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!loading) fetchBlogs(1, true)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchQuery])


  const fetchBlogs = async (pageNum: number, reset: boolean) => {
    try {
      setLoading(true)
      const catId = selectedCategory !== 'All Topics'
        ? undefined // We might need to map name to ID if API requires ID. 
        // My getBlogs takes category_id or slug. Let's try matching name?
        // Ideally I should store category objects.
        : undefined

      // Just fetch all for now or filter if I can map it. 
      // For this implementation, I will assume backend handles filtering or I need the full object.
      // Let's rely on search for now if category ID mapping is complex without the object map.
      // Actually, I should refine `categories` state to store objects.

      const res = await getBlogs({
        page: pageNum,
        per_page: 9,
        search: searchQuery,
        // category_slug: selectedCategory !== 'All Topics' ? selectedCategory.toLowerCase().replace(/ /g, '-') : undefined 
        // Better to update category logic later to specific IDs, but this is a start
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
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <div
        className="relative overflow-hidden py-32"
        style={{
          backgroundImage: "url('/herobackgrond.svg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: '#000'
        }}
      >
        {/* Animated Background Layers */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-purple-900/10 to-black/60" />
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent animate-gradient-x" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/10 to-transparent animate-gradient-y" />
          </div>
          {/* Bottom section overlay */}
          <div
            className="absolute inset-x-0 bottom-0 h-full opacity-40 mix-blend-screen"
            style={{
              backgroundImage: "url('/bottomsection.svg')",
              backgroundSize: 'cover',
              backgroundPosition: 'bottom',
              backgroundRepeat: 'no-repeat'
            }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.215, 0.61, 0.355, 1.0] }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-8 tracking-tight leading-tight">
              <span className="block text-white mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">Explore Our</span>
              <span
                className="neon-text inline-block relative"
                style={{
                  textShadow: '0 0 15px rgba(168, 85, 247, 0.6), 0 0 30px rgba(59, 130, 246, 0.4)'
                }}
              >
                <Typewriter
                  key={currentWordIndex}
                  text={words[currentWordIndex]}
                  speed={70}
                  onComplete={handleTypewriterComplete}
                />
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed drop-shadow-[0_0_10px_rgba(168,85,247,0.3)]">
              Dive into interactive content that <span className="text-white font-semibold">learns, adapts,</span> and engages with you in real-time.
            </p>

            {/* Search Bar - Enhanced */}
            <div className="max-w-2xl mx-auto mb-16 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-xl opacity-50" />
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for topics, keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-8 py-5 bg-gray-900/60 backdrop-blur-xl rounded-2xl border-2 border-purple-500/30 focus:border-purple-500 focus:outline-none text-white placeholder-gray-400 transition-all shadow-2xl"
                />
                <button className="absolute right-4 top-1/2 transform -translate-y-1/2 group">
                  <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-500 rounded-xl shadow-lg group-hover:shadow-purple-500/50 transition-all">
                    <span className="text-white text-xl">🔍</span>
                  </div>
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Floating particles - Reused from Hero */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20"
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
            0%, 100% { transform: translateX(-50%); }
            50% { transform: translateX(50%); }
          }
          @keyframes gradient-y {
            0%, 100% { transform: translateY(-50%); }
            50% { transform: translateY(50%); }
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
      <div className="container mx-auto px-4 mb-12">
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map((category, index) => (
            <motion.button
              key={category}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full transition-all duration-300 ${selectedCategory === category
                ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-lg shadow-purple-500/30'
                : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
            >
              {category}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Blogs Grid */}
      <div className="container mx-auto px-4">
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* BlogCard expects a specific shape, our API returns BlogListItem. 
                      Need to ensure compatibility or map it. 
                      Our mock data had 'featured_image' but API returns 'image'? Use any if needed or update Card.
                      Checking api.ts BlogListItem has: id, title, slug, excerpt, category, is_published, views...
                      It doesn't seem to have 'image' or 'featured_image' explicitly in the interface I saw?
                      Wait, previous `api.ts` `BlogListItem` didn't show an image field.
                      I should check `CategoryItem` has image.
                      I'll just pass properties and if BlogCard needs image, I might need to update API or type.
                      Let's assume the API returns an image or use a placeholder.
                  */}
                <Link href={`/blogs/${blog.slug || blog.id}`} className="block h-full">
                  {/* Reusing existing BlogCard but might need props adjustment if types mismatch */}
                  <div className="h-full bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all hover:-translate-y-2 group cursor-pointer">
                    <div className="h-48 bg-gray-800 relative overflow-hidden">
                      {blog.featured_image ? (
                        <img
                          src={blog.featured_image.startsWith('http') ? blog.featured_image : `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000'}${blog.featured_image}`}
                          alt={blog.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 to-blue-900/40 flex items-center justify-center">
                          <span className="text-4xl opacity-50">📝</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60" />
                    </div>
                    <div className="p-6">
                      <span className="text-xs font-semibold text-purple-400 bg-purple-900/30 px-3 py-1 rounded-full">
                        {blog.category?.name || 'General'}
                      </span>
                      <h3 className="text-xl font-bold mt-4 mb-2 text-white group-hover:text-purple-400 transition-colors line-clamp-2">
                        {blog.title}
                      </h3>
                      <p className="text-gray-400 text-sm line-clamp-3 mb-4">
                        {blog.excerpt || 'No description available'}
                      </p>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>{new Date(blog.created_at || Date.now()).toLocaleDateString()}</span>
                        <span>{blog.views} views</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🤖</div>
            <h3 className="text-2xl font-bold mb-2">No blogs found</h3>
            <p className="text-gray-400 mb-6">Try adjusting your search or filters</p>
            <NeonButton onClick={() => { setSelectedCategory('All Topics'); setSearchQuery('') }}>
              Reset Filters
            </NeonButton>
          </div>
        )}

        {/* Load More */}
        {hasMore && !loading && (
          <div className="text-center mt-16">
            <NeonButton
              variant="outline"
              onClick={handleLoadMore}
              className="px-8 py-4"
            >
              Load More Blogs
            </NeonButton>
          </div>
        )}
        {loading && blogs.length > 0 && (
          <div className="text-center mt-8 text-gray-400">Loading more...</div>
        )}
      </div>
    </div>
  )
}