'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Clock, Eye } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

const dummyBlogs = [
  {
    id: 1,
    title: "The Future of Generative AI in 2026",
    excerpt: "Exploring how LLMs are reshaping industries from healthcare to creative writing...",
    category: "Technology",
    readTime: "5 min",
    views: 1200,
    color: "from-blue-500 to-indigo-500"
  },
  {
    id: 2,
    title: "Mastering React Server Components",
    excerpt: "A deep dive into Next.js 15+ patterns for optimal performance and SEO...",
    category: "Coding",
    readTime: "8 min",
    views: 850,
    color: "from-purple-500 to-pink-500"
  },
  {
    id: 3,
    title: "Quantum Computing: A Beginner's Guide",
    excerpt: "Understanding qubits, superposition, and what it means for encryption...",
    category: "Science",
    readTime: "6 min",
    views: 940,
    color: "from-green-500 to-emerald-500"
  }
]

import ScrollSectionHeader from '../ui/ScrollSectionHeader'

export default function BlogsSection() {
  const { isDark } = useTheme()

  return (
    <section className="py-24 px-4 relative">
      {/* Decorative blurs */}
      <div className={`absolute top-20 right-0 w-72 h-72 rounded-full blur-[80px] ${isDark ? 'bg-blue-600/10' : 'bg-blue-400/15'}`}></div>
      <div className={`absolute bottom-20 left-0 w-72 h-72 rounded-full blur-[80px] ${isDark ? 'bg-purple-600/10' : 'bg-purple-400/15'}`}></div>

      <div className="container mx-auto">
        <ScrollSectionHeader
          badge="Latest Insights"
          titlePrefix="Discover"
          titleHighlight="Our Perspective"
          description="Stay ahead of the curve with our expert articles on AI, Technology, and Development."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {dummyBlogs.map((blog, index) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative"
            >
              <div className={`absolute inset-0 rounded-2xl transform transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl border ${isDark
                  ? 'bg-gradient-to-r from-gray-800 to-gray-900 border-gray-700 hover:border-purple-500/50'
                  : 'bg-gradient-to-r from-white to-slate-50 border-slate-200 hover:border-purple-400/50 shadow-sm hover:shadow-purple-100/30'
                }`}>
                <div className={`h-2 bg-gradient-to-r ${blog.color} rounded-t-2xl`}></div>
                <div className="p-8">
                  <div className="flex justify-between items-center mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${isDark
                        ? 'bg-gray-700/50 border-gray-600 text-gray-300'
                        : 'bg-slate-100 border-slate-200 text-slate-600'
                      }`}>
                      {blog.category}
                    </span>
                    <div className={`flex items-center text-xs gap-3 ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>
                      <span className="flex items-center gap-1"><Clock size={12} /> {blog.readTime}</span>
                      <span className="flex items-center gap-1"><Eye size={12} /> {blog.views}</span>
                    </div>
                  </div>

                  <h3 className={`text-xl font-bold mb-3 transition-colors group-hover:text-purple-500 ${isDark ? 'text-white' : 'text-slate-800'
                    }`}>
                    {blog.title}
                  </h3>

                  <p className={`mb-6 text-sm leading-relaxed line-clamp-2 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                    {blog.excerpt}
                  </p>

                  <div className={`flex items-center text-sm font-semibold transition-colors group-hover:text-purple-500 ${isDark ? 'text-gray-300' : 'text-slate-600'
                    }`}>
                    Read Article <ArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/blogs">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold hover:shadow-lg hover:shadow-purple-500/30 transition-all"
            >
              View All Articles
            </motion.button>
          </Link>
        </div>
      </div>
    </section>
  )
}
