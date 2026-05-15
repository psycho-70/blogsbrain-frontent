'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardStats from '@/components/admin/DashboardStats'
import DashboardCharts from '@/components/admin/DashboardCharts'
import { adminGetStats, adminGetAnalytics, BlogListItem } from '@/lib/api'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useTheme } from '@/contexts/ThemeContext'
import { Plus, Eye, Calendar, User as UserIcon, BookOpen, Tag, Users, TrendingUp, Clock, ArrowRight, MessageSquare } from 'lucide-react'

const Dashboard = () => {
  const router = useRouter()
  const { isDark } = useTheme()
  const [stats, setStats] = useState({
    totalBlogs: 0,
    totalCategories: 0,
    totalUsers: 0,
    totalViews: 0
  })
  const [recentBlogs, setRecentBlogs] = useState<BlogListItem[]>([])
  const [ctaStats, setCtaStats] = useState<{ id: number, buttonId: string, clickCount: number }[]>([])
  const [analytics, setAnalytics] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<{ username: string, profile_image?: string } | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')

    if (!token) {
      router.push('/admin/login')
      return
    }

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        console.error(e)
      }
    }

    const fetchDashboardData = async () => {
      try {
        const data = await adminGetStats(token)
        setStats({
          totalBlogs: data.stats.total_blogs,
          totalCategories: data.stats.total_categories,
          totalUsers: data.stats.total_users,
          totalViews: data.stats.total_views
        })
        setRecentBlogs(data.latest_blogs)

        try {
          const analyticsData = await adminGetAnalytics(token)
          let ctas: any[] = []
          try {
            const ctaRes = await fetch(`/api/cta/stats`)
            if (ctaRes.ok) {
              ctas = await ctaRes.json()
              setCtaStats(ctas)
            }
          } catch (e) {
            console.error('Failed to fetch CTA stats:', e)
          }

          setAnalytics({
            ...analyticsData,
            categoryDistribution: data.category_distribution,
            ctaStats: ctas
          })
        } catch (e) {
          console.error('Failed to fetch analytics:', e)
        }
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [router])

  const textMuted = isDark ? 'text-gray-400' : 'text-slate-500'
  const textPrimary = isDark ? 'text-white' : 'text-slate-900'
  const cardBg = isDark ? 'bg-gray-800/20 backdrop-blur-md border-white/5' : 'bg-white/70 backdrop-blur-md border-slate-200/50 shadow-sm'

  return (
    <div className="min-h-screen">
      {/* Welcome Header */}
      <div className={`relative z-10 border-b transition-colors duration-300 ${isDark ? 'bg-gray-900/50 backdrop-blur-md border-purple-500/20' : 'bg-white/40 backdrop-blur-md border-purple-500/20'}`}>
        <div className="container mx-auto px-4 py-8 lg:py-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="relative group">
                <div className={`absolute inset-0 rounded-full blur transition-all opacity-20 group-hover:blur-md ${isDark ? 'bg-purple-500' : 'bg-purple-400'}`} />
                <div className={`w-16 h-16 lg:w-20 lg:h-20 rounded-full border-2 overflow-hidden flex items-center justify-center shrink-0 relative transition-colors ${isDark ? 'bg-gray-800 border-purple-500/50' : 'bg-white border-purple-500/30 shadow-md'}`}>
                  {user?.profile_image ? (
                    <img
                      src={user.profile_image.startsWith('http') ? user.profile_image : (user.profile_image.startsWith('/uploads/') ? user.profile_image : `/uploads/${user.profile_image}`)}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserIcon size={28} className={isDark ? 'text-gray-400' : 'text-purple-500'} />
                  )}
                </div>
              </div>
              <div>
                <h1 className={`text-2xl lg:text-4xl font-bold transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Dashboard Overview
                </h1>
                <p className={`mt-1 transition-colors ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                  Welcome back, <span className="text-purple-500 font-semibold">{user?.username?.split('@')[0] || 'Admin'}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 lg:py-8 relative z-10">
        {/* Stats Blocks */}
        <DashboardStats stats={stats} />

        {/* Charts Section */}
        {analytics && <DashboardCharts data={analytics} />}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mt-6 lg:mt-8">
          {/* Recent Blogs */}
          <div className="lg:col-span-2 space-y-6">
            <div className={`rounded-2xl p-5 lg:p-6 transition-all duration-300 ${cardBg} hover:border-purple-500/30`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-lg lg:text-xl font-bold flex items-center gap-2 ${textPrimary}`}>
                  <BookOpen size={22} className="text-purple-500" />
                  Recent Blog Posts
                  <span className={`ml-2 px-2.5 py-0.5 text-xs rounded-full border ${isDark ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : 'bg-purple-100 text-purple-700 border-purple-200'}`}>
                    {stats.totalBlogs} Total
                  </span>
                </h3>
                <Link href="/admin/blogs" className={`text-sm transition-colors ${isDark ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-700'}`}>
                  View All →
                </Link>
              </div>

              <div className="space-y-3 lg:space-y-4">
                {isLoading ? (
                  Array(3).fill(0).map((_, i) => (
                    <div key={i} className={`h-20 rounded-xl animate-pulse ${isDark ? 'bg-gray-700/20' : 'bg-slate-200/50'}`} />
                  ))
                ) : recentBlogs.length > 0 ? (
                  recentBlogs.map((blog) => (
                    <motion.div
                      key={blog.id}
                      whileHover={{ x: 4 }}
                      className={`group flex items-center gap-4 p-3 lg:p-4 rounded-xl transition-all ${isDark ? 'bg-gray-700/10 border border-white/5 hover:bg-gray-700/20' : 'bg-slate-50/50 border border-slate-200/50 hover:bg-slate-100/50'}`}
                    >
                      <div className={`hidden sm:block w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                        {blog.featured_image ? (
                          <img
                            src={blog.featured_image.startsWith('http') ? blog.featured_image : (blog.featured_image.startsWith('/uploads/') ? blog.featured_image : `/uploads/${blog.featured_image}`)}
                            className="w-full h-full object-cover"
                            alt=""
                          />
                        ) : (
                          <div className={`w-full h-full flex items-center justify-center text-xs ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>No Image</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-semibold truncate transition-colors group-hover:text-purple-500 ${textPrimary}`}>
                          {blog.title}
                        </h4>
                        <div className={`flex items-center gap-4 mt-1 text-xs ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>
                          <span className="flex items-center gap-1">
                            <Calendar size={12} /> {new Date(blog.created_at || '').toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye size={12} /> {blog.views}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className={`text-center py-12 border-2 border-dashed rounded-2xl transition-colors ${isDark ? 'text-gray-500 border-white/5' : 'text-slate-400 border-slate-200'}`}>
                    No blogs yet. Get started by creating your first post!
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Info / Sidebar */}
          <div className="space-y-6">
            <div className={`rounded-2xl p-5 lg:p-6 transition-all duration-300 ${isDark ? 'bg-gradient-to-br from-purple-900/40 to-blue-900/40 border-purple-500/20' : 'bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200/60 shadow-sm'}`}>
              <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${textPrimary}`}>
                <TrendingUp size={20} className="text-purple-500" />
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Link href="/admin/categories" className={`flex items-center justify-between w-full p-3 rounded-xl transition-all text-sm font-medium ${isDark ? 'bg-white/5 hover:bg-white/10 border border-white/10' : 'bg-white/60 hover:bg-white border border-slate-200/50'}`}>
                  <span className="flex items-center gap-2">
                    <Tag size={16} /> Manage Categories
                  </span>
                  <ArrowRight size={14} />
                </Link>
                <Link href="/admin/users" className={`flex items-center justify-between w-full p-3 rounded-xl transition-all text-sm font-medium ${isDark ? 'bg-white/5 hover:bg-white/10 border border-white/10' : 'bg-white/60 hover:bg-white border border-slate-200/50'}`}>
                  <span className="flex items-center gap-2">
                    <Users size={16} /> User Management
                  </span>
                  <ArrowRight size={14} />
                </Link>
                <Link href="/admin/comments" className={`flex items-center justify-between w-full p-3 rounded-xl transition-all text-sm font-medium ${isDark ? 'bg-white/5 hover:bg-white/10 border border-white/10' : 'bg-white/60 hover:bg-white border border-slate-200/50'}`}>
                  <span className="flex items-center gap-2">
                    <MessageSquare size={16} /> Moderate Comments
                  </span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* CTA Stats */}
            <div className={`rounded-2xl p-5 lg:p-6 transition-all duration-300 ${cardBg}`}>
              <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${textPrimary}`}>
                <TrendingUp size={20} className="text-purple-500" />
                CTA Click Stats
              </h3>
              <div className="space-y-3">
                {ctaStats.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className={`text-xs uppercase ${isDark ? 'text-gray-400 bg-gray-700/30' : 'text-slate-500 bg-slate-100/50'}`}>
                        <tr>
                          <th className="px-3 py-2 rounded-l-lg">Button ID</th>
                          <th className="px-3 py-2 rounded-r-lg text-right">Clicks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ctaStats.map(stat => (
                          <tr key={stat.id} className={`border-b transition-colors ${isDark ? 'border-white/5 hover:bg-gray-700/20' : 'border-slate-200/50 hover:bg-slate-50/50'}`}>
                            <td className={`px-3 py-3 font-medium ${isDark ? 'text-gray-200' : 'text-slate-700'}`}>{stat.buttonId}</td>
                            <td className={`px-3 py-3 font-bold text-right ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>{stat.clickCount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className={`text-sm text-center py-6 border border-dashed rounded-xl transition-colors ${isDark ? 'text-gray-500 border-white/10' : 'text-slate-400 border-slate-200'}`}>
                    No CTA clicks yet
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>
  )
}

export default Dashboard