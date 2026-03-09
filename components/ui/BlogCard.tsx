'use client'

import Link from 'next/link'
import Image from 'next/image'

export interface BlogCardBlog {
  id: number
  title: string
  excerpt: string
  category: string
  slug: string
  featured_image: string
  author: { username: string; profile_image: string }
  reading_time: number
  views: number
  created_at: string
  tags: string[]
}

interface BlogCardProps {
  blog: BlogCardBlog
}

export default function BlogCard({ blog }: BlogCardProps) {
  const href = `/blogs/${blog.slug}`

  return (
    <Link href={href} className="block group">
      <article className="relative h-full bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden transition-all duration-300 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20">
        {/* Gradient border glow on hover */}
        <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-purple-600 to-blue-500 opacity-0 blur group-hover:opacity-30 transition-opacity duration-500 -z-10" />

        {/* Featured image */}
        <div className="relative aspect-video overflow-hidden bg-gray-800">
          {blog.featured_image ? (
            <Image
              src={blog.featured_image}
              alt={blog.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 to-blue-900/40 flex items-center justify-center">
              <span className="text-5xl opacity-50">📝</span>
            </div>
          )}
          {/* Category badge */}
          <span className="absolute top-3 left-3 px-3 py-1 text-xs font-medium bg-purple-600/90 text-white rounded-full backdrop-blur-sm">
            {blog.category}
          </span>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 transition-all duration-300">
            {blog.title}
          </h3>
          <p className="text-gray-400 text-sm line-clamp-2 mb-4">{blog.excerpt}</p>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-4">
            <span className="flex items-center gap-1">
              <span className="text-gray-400">👤</span>
              {blog.author.username}
            </span>
            <span>{blog.reading_time} min read</span>
            <span>{blog.views.toLocaleString()} views</span>
            <time dateTime={blog.created_at}>
              {new Date(blog.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </time>
          </div>

          {/* Tags */}
          {blog.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {blog.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-xs rounded-md bg-gray-700/80 text-gray-300 border border-gray-600/50"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    </Link>
  )
}
