'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Clock, Eye } from 'lucide-react'

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

export default function BlogsSection() {
  return (
    <section
      className="py-24 px-4 relative"
    >
      {/* Decorative Elements */}
      <div className="absolute top-20 right-0 w-72 h-72 bg-blue-600/10 rounded-full blur-[80px]"></div>
      <div className="absolute bottom-20 left-0 w-72 h-72 bg-purple-600/10 rounded-full blur-[80px]"></div>

      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Latest <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Insights</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Stay ahead of the curve with our expert articles on AI, Technology, and Development.
          </p>
        </motion.div>

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
              <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl transform transition-transform duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl border border-gray-700 hover:border-purple-500/50">
                <div className={`h-2 bg-gradient-to-r ${blog.color} rounded-t-2xl`}></div>
                <div className="p-8">
                  <div className="flex justify-between items-center mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-gray-700/50 border border-gray-600`}>
                      {blog.category}
                    </span>
                    <div className="flex items-center text-gray-500 text-xs gap-3">
                      <span className="flex items-center gap-1"><Clock size={12} /> {blog.readTime}</span>
                      <span className="flex items-center gap-1"><Eye size={12} /> {blog.views}</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold mb-3 text-white group-hover:text-purple-400 transition-colors">
                    {blog.title}
                  </h3>

                  <p className="text-gray-400 mb-6 text-sm leading-relaxed line-clamp-2">
                    {blog.excerpt}
                  </p>

                  <div className="flex items-center text-sm font-semibold text-gray-300 group-hover:text-white transition-colors">
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
