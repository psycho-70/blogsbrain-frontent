'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardStats from '@/components/admin/DashboardStats'
import { adminGetStats, BlogListItem } from '@/lib/api'
import { motion } from 'framer-motion'
import Link from 'next/link'

const Dashboard = () => {
  const router = useRouter()
  const [stats, setStats] = useState({
    totalBlogs: 0,
    totalCategories: 0,
    totalUsers: 0,
    totalViews: 0
  })
  const [recentBlogs, setRecentBlogs] = useState<BlogListItem[]>([])
  const [ctaStats, setCtaStats] = useState<{ id: number, buttonId: string, clickCount: number }[]>([])
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

        // Fetch CTA Stats
        try {
          const ctaRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000'}/api/cta/stats`)
          if (ctaRes.ok) {
            setCtaStats(await ctaRes.json())
          }
        } catch (e) {
          console.error('Failed to fetch CTA stats:', e)
        }
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [router])

  return (
    <div className="min-h-screen bg-transparent">
      {/* Welcome Header */}
      <div className="bg-gray-900/50 backdrop-blur-md border-b border-purple-500/20">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-purple-500 rounded-full blur group-hover:blur-md transition-all opacity-20" />
                <div className="w-20 h-20 rounded-full bg-gray-800 border-2 border-purple-500/50 overflow-hidden flex items-center justify-center shrink-0 relative">
                  {user?.profile_image ? (
                    <img
                      src={user.profile_image.startsWith('http') ? user.profile_image : `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000'}${user.profile_image}`}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl">👤</span>
                  )}
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                  Dashboard Overview
                </h1>
                <p className="text-gray-400 mt-1">
                  Welcome back, <span className="text-purple-400 font-semibold">{user?.username?.split('@')[0] || 'Admin'}</span>
                </p>
              </div>
            </div>

            {/* <div className="flex gap-3">
              <Link href="/admin/blogs/create">
                <button className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-all shadow-lg shadow-purple-900/20 font-medium">
                  + New Post
                </button>
              </Link>
            </div> */}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Blocks */}
        <DashboardStats stats={stats} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Blogs - Takes 2 columns on lg */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-800/20 backdrop-blur-md rounded-2xl border border-white/5 p-6 hover:border-purple-500/20 transition-all">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <span className="text-2xl">📈</span> Recent Blog Posts
                  <span className="ml-2 px-2.5 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded-full border border-purple-500/30">
                    {stats.totalBlogs} Total
                  </span>
                </h3>
                <Link href="/admin/blogs" className="text-sm text-purple-400 hover:underline">
                  View All
                </Link>
              </div>

              <div className="space-y-4">
                {isLoading ? (
                  Array(3).fill(0).map((_, i) => (
                    <div key={i} className="h-20 bg-gray-700/20 animate-pulse rounded-xl" />
                  ))
                ) : recentBlogs.length > 0 ? (
                  recentBlogs.map((blog) => (
                    <div
                      key={blog.id}
                      className="group flex items-center gap-4 p-4 rounded-xl bg-gray-700/10 border border-white/5 hover:bg-gray-700/20 transition-all"
                    >
                      <div className="hidden sm:block w-16 h-12 rounded-lg bg-gray-800 overflow-hidden flex-shrink-0">
                        {blog.featured_image ? (
                          <img
                            src={blog.featured_image.startsWith('http') ? blog.featured_image : `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000'}${blog.featured_image}`}
                            className="w-full h-full object-cover"
                            alt=""
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-gray-600">No Image</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-white truncate group-hover:text-purple-400 transition-colors">
                          {blog.title}
                        </h4>
                        <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                          <span>{new Date(blog.created_at || '').toLocaleDateString()}</span>
                          <span className="flex items-center gap-1">
                            <span className="text-sm">👁️</span> {blog.views}
                          </span>
                        </div>
                      </div>
                      {/* <Link href={`/admin/blogs/edit/${blog.id}`}>
                        <button className="p-2 hover:bg-purple-500/20 rounded-lg text-gray-400 hover:text-purple-400 transition-all">
                          ✏️
                        </button>
                      </Link> */}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-500 border-2 border-dashed border-white/5 rounded-2xl">
                    No blogs yet. Get started by creating your first post!
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Info / Sidebar - Takes 1 column on lg */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 backdrop-blur-md rounded-2xl border border-purple-500/20 p-6">
              <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link href="/admin/categories" className="block w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-sm font-medium">
                  🏷️ Manage Categories
                </Link>
                <Link href="/admin/users" className="block w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-sm font-medium">
                  👥 User Management
                </Link>
                <Link href="/admin/comments" className="block w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-sm font-medium">
                  💬 Moderate Comments
                </Link>
              </div>
            </div>

            {/* CTA Stats */}
            <div className="bg-gray-800/20 backdrop-blur-md rounded-2xl border border-white/5 p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span>🖱️</span> CTA Click Stats
              </h3>
              <div className="space-y-3">
                {ctaStats.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-gray-400 uppercase bg-gray-700/30">
                        <tr>
                          <th className="px-3 py-2 rounded-l-lg">Button ID</th>
                          <th className="px-3 py-2 rounded-r-lg text-right">Clicks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ctaStats.map(stat => (
                          <tr key={stat.id} className="border-b border-white/5 last:border-0 hover:bg-gray-700/20 transition-colors">
                            <td className="px-3 py-3 font-medium text-gray-200">{stat.buttonId}</td>
                            <td className="px-3 py-3 text-purple-400 font-bold text-right">{stat.clickCount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 text-center py-6 border border-dashed border-white/10 rounded-xl">No CTA clicks yet</div>
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
