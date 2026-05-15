'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Clock, Eye, ArrowRight, ChevronDown, ChevronUp, Calendar } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

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
    const [mounted, setMounted] = useState(false)
    const { isDark } = useTheme()

    useEffect(() => {
        setMounted(true)
    }, [])

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
            : (blog.featured_image.startsWith('/uploads/') ? blog.featured_image : `/uploads/${blog.featured_image}`))
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
            <div className={`h-full backdrop-blur-xl border rounded-[2rem] overflow-hidden flex flex-col group shadow-2xl transition-all duration-300 ${
                isDark
                    ? 'bg-gray-900/40 border-white/10 hover:border-purple-500/50'
                    : 'bg-white/80 border-gray-200/80 hover:border-purple-400/50 shadow-gray-300/20'
            }`}>
                {/* Image Container with Parallax Effect */}
                <div className="relative h-56 w-full overflow-hidden" style={{ transform: "translateZ(30px)" }}>
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={blog.title}
                            className="w-full h-full cursor-pointer object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                    ) : (
                        <div className={`w-full h-full bg-gradient-to-br flex items-center justify-center ${
                            isDark
                                ? 'from-purple-900/50 to-blue-900/50'
                                : 'from-purple-200/50 to-blue-200/50'
                        }`}>
                            <span className="text-5xl opacity-40">📝</span>
                        </div>
                    )}

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4" style={{ transform: "translateZ(40px)" }}>
                        <span className={`px-4 py-1.5 backdrop-blur-md border text-xs font-bold rounded-full shadow-lg ${
                            isDark
                                ? 'bg-black/60 border-white/10 text-purple-400'
                                : 'bg-white/80 border-gray-200/50 text-purple-600'
                        }`}>
                            {blog.category?.name || 'General'}
                        </span>
                    </div>

                    {/* Overlay Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-t opacity-80 ${
                        isDark
                            ? 'from-gray-900 via-transparent to-transparent'
                            : 'from-white via-transparent to-transparent'
                    }`} />
                </div>

                {/* Content Section */}
                <div className="p-7 flex flex-col flex-1" style={{ transform: "translateZ(20px)" }}>
                    <div className={`flex items-center gap-4 text-[11px] mb-4 font-semibold uppercase tracking-wider ${
                        isDark ? 'text-gray-500' : 'text-slate-400'
                    }`}>
                        <span className="flex items-center gap-1">
                            <Clock size={12} className="text-purple-500" /> 
                            {blog.reading_time || 5} MIN
                        </span>
                        <span className="flex items-center gap-1">
                            <Eye size={12} className="text-blue-500" /> 
                            {blog.views} VIEWS
                        </span>
                        <span className="flex items-center gap-1">
                            <Calendar size={12} className="text-pink-500" /> 
                            {mounted ? new Date(blog.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '...'}
                        </span>
                    </div>

                    <a href={`/blogs/${blog.slug}`}>
                        <h3 className={`text-2xl font-black mb-3 line-clamp-2 leading-tight transition-colors ${
                            isDark
                                ? 'text-white group-hover:text-purple-400'
                                : 'text-slate-900 group-hover:text-purple-600'
                        }`}>
                            {blog.title}
                        </h3>
                    </a>

                    <div className="relative mb-6">
                        <p className={`text-sm leading-relaxed transition-all duration-300 ${isExpanded ? '' : 'line-clamp-2'} ${
                            isDark ? 'text-gray-400' : 'text-slate-600'
                        }`}>
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

                    <div className={`mt-auto pt-6 border-t flex items-center justify-between ${
                        isDark ? 'border-white/5' : 'border-gray-100'
                    }`}>
                        <Link
                            href={`/blogs/${blog.slug}`}
                            className={`group/btn relative inline-flex items-center gap-2 text-sm font-black py-3 px-6 rounded-xl transition-all overflow-hidden ${
                                isDark
                                    ? 'text-white bg-white/5 hover:bg-white/10 border border-white/10'
                                    : 'text-slate-900 bg-gray-100/50 hover:bg-gray-200/70 border border-gray-200'
                            }`}
                        >
                            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 transform scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-500 origin-left" />
                            <span>Read Full Story</span>
                            <ArrowRight size={16} className="transition-transform group-hover/btn:translate-x-1 text-purple-400" />
                        </Link>

                        <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                            className={`w-10 h-10 rounded-full flex items-center justify-center border cursor-help ${
                                isDark
                                    ? 'bg-gradient-to-br from-purple-600/20 to-blue-600/20 border-purple-500/20'
                                    : 'bg-gradient-to-br from-purple-200/50 to-blue-200/50 border-purple-300/30'
                            }`}
                        >
                            <span className="text-lg">✨</span>
                        </motion.div>
                    </div>
                </div>

                {/* 3D Border Shine Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500">
                    <div className={`absolute inset-0 bg-gradient-to-tr ${
                        isDark
                            ? 'from-purple-500/10 via-transparent to-blue-500/10'
                            : 'from-purple-400/10 via-transparent to-blue-400/10'
                    }`} />
                </div>
            </div>
        </motion.div>
    )
}