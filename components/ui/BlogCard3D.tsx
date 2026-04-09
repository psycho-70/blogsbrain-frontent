'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Clock, Eye, ArrowRight, ChevronDown, ChevronUp, Calendar } from 'lucide-react'

interface BlogCard3DProps {
    blog: {
        id: number
        title: string
        slug: string
        excerpt: string | null
        category: { name: string; slug: string } | null
        featured_image?: string | null
        views: number
        reading_time?: number | null
        created_at?: string | null
    }
}

export default function BlogCard3D({ blog }: BlogCard3DProps) {
    const [isExpanded, setIsExpanded] = useState(false)

    // Tilt animation logic
    const x = useMotionValue(0)
    const y = useMotionValue(0)
    const mouseXSpring = useSpring(x)
    const mouseYSpring = useSpring(y)
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"])
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"])

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const width = rect.width
        const height = rect.height
        const mouseX = e.clientX - rect.left
        const mouseY = e.clientY - rect.top
        const xPct = mouseX / width - 0.5
        const yPct = mouseY / height - 0.5
        x.set(xPct)
        y.set(yPct)
    }

    const handleMouseLeave = () => {
        x.set(0)
        y.set(0)
    }

    const imageUrl = blog.featured_image
        ? (blog.featured_image.startsWith('http')
            ? blog.featured_image
            : `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000'}${blog.featured_image}`)
        : null

    return (
        <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            className="relative h-full transition-all duration-200"
        >
            <div className="h-full bg-gray-900/40 backdrop-blur-xl border border-white/10 rounded-[2rem] overflow-hidden flex flex-col group hover:border-purple-500/50 shadow-2xl">
                {/* Image Container with Parallax Effect */}
                <div className="relative h-56 w-full overflow-hidden" style={{ transform: "translateZ(30px)" }}>
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={blog.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-900/50 to-blue-900/50 flex items-center justify-center">
                            <span className="text-5xl opacity-40">📝</span>
                        </div>
                    )}

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4" style={{ transform: "translateZ(40px)" }}>
                        <span className="px-4 py-1.5 bg-black/60 backdrop-blur-md border border-white/10 text-xs font-bold text-purple-400 rounded-full shadow-lg">
                            {blog.category?.name || 'General'}
                        </span>
                    </div>

                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-80" />
                </div>

                {/* Content Section */}
                <div className="p-7 flex flex-col flex-1" style={{ transform: "translateZ(20px)" }}>
                    <div className="flex items-center gap-4 text-[11px] text-gray-500 mb-4 font-semibold uppercase tracking-wider">
                        <span className="flex items-center gap-1"><Clock size={12} className="text-purple-500" /> {blog.reading_time || 5} MIN</span>
                        <span className="flex items-center gap-1"><Eye size={12} className="text-blue-500" /> {blog.views} VIEWS</span>
                        <span className="flex items-center gap-1"><Calendar size={12} className="text-pink-500" /> {new Date(blog.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    </div>

                    <h3 className="text-2xl font-black text-white mb-3 line-clamp-2 leading-tight group-hover:text-purple-400 transition-colors">
                        {blog.title}
                    </h3>

                    <div className="relative mb-6">
                        <p className={`text-gray-400 text-sm leading-relaxed transition-all duration-300 ${isExpanded ? '' : 'line-clamp-2'}`}>
                            {blog.excerpt || "Explore the fascinating world of AI and innovation with our latest insights and deep dives into technology's future."}
                        </p>

                        {/* Read More/Less Toggle for Excerpt */}
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsExpanded(!isExpanded);
                            }}
                            className="mt-2 text-purple-400 text-xs font-bold hover:text-purple-300 flex items-center gap-1 transition-colors"
                        >
                            {isExpanded ? (
                                <>Read Less <ChevronUp size={14} /></>
                            ) : (
                                <>Read More <ChevronDown size={14} /></>
                            )}
                        </button>
                    </div>

                    <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                        <Link
                            href={`/blogs/${blog.slug}`}
                            className="group/btn relative inline-flex items-center gap-2 text-sm font-black text-white py-3 px-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all overflow-hidden"
                        >
                            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 transform scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-500 origin-left" />
                            <span>Read Full Story</span>
                            <ArrowRight size={16} className="transition-transform group-hover/btn:translate-x-1 text-purple-400" />
                        </Link>

                        <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                            className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600/20 to-blue-600/20 flex items-center justify-center border border-purple-500/20 cursor-help"
                        >
                            <span className="text-lg">✨</span>
                        </motion.div>
                    </div>
                </div>

                {/* 3D Border Shine Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-transparent to-blue-500/10" />
                </div>
            </div>
        </motion.div>
    )
}
