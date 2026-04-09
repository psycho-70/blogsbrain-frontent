'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { getBlog, BlogDetail } from '@/lib/api'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Clock, Calendar, User, Tag, ArrowRight } from 'lucide-react'
import CommentSection from '@/components/comments/CommentSection'
import BlogCard3D from '@/components/ui/BlogCard3D'


import ReactMarkdown from 'react-markdown'
import { useRef } from 'react'

// Markdown components configuration
const MarkdownComponents = {
    h1: ({ node, ...props }: any) => <h1 className="text-4xl font-bold mt-8 mb-6 text-white" {...props} />,
    h2: ({ node, ...props }: any) => <h2 className="text-3xl font-bold mt-8 mb-4 text-white" {...props} />,
    h3: ({ node, ...props }: any) => <h3 className="text-2xl font-bold mt-6 mb-4 text-white" {...props} />,
    p: ({ node, ...props }: any) => <p className="mb-4 text-gray-300 leading-relaxed" {...props} />,
    ul: ({ node, ...props }: any) => <ul className="list-disc ml-6 mb-4 space-y-2" {...props} />,
    ol: ({ node, ...props }: any) => <ol className="list-decimal ml-6 mb-4 space-y-2" {...props} />,
    li: ({ node, ...props }: any) => <li className="text-gray-300" {...props} />,
    a: ({ node, ...props }: any) => <a className="text-purple-400 hover:text-purple-300 underline transition-colors" {...props} />,
    blockquote: ({ node, ...props }: any) => <blockquote className="border-l-4 border-purple-500 pl-4 py-2 my-4 bg-gray-800/50 italic text-gray-400 rounded-r" {...props} />,
    code: ({ node, inline, className, children, ...props }: any) => {
        return inline ? (
            <code className="bg-gray-800 px-1 py-0.5 rounded text-purple-300 font-mono text-sm" {...props}>{children}</code>
        ) : (
            <pre className="bg-gray-900 p-4 rounded-lg overflow-x-auto mb-4 border border-gray-800">
                <code className="text-gray-300 font-mono text-sm" {...props}>{children}</code>
            </pre>
        )
    },
    img: ({ node, ...props }: any) => <img className="rounded-xl my-8 border border-gray-800 w-full" {...props} />,
}

export default function BlogDetailPage() {
    const params = useParams()
    const [blog, setBlog] = useState<BlogDetail | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isContentExpanded, setIsContentExpanded] = useState(false)

    const hasFetched = useRef(false)

    useEffect(() => {
        async function fetchBlogData() {
            if (hasFetched.current) return
            hasFetched.current = true

            try {
                setLoading(true)
                // params.id is string | string[] depending on route, but for [...id] it is string[]
                const idOrSlug = Array.isArray(params.id) ? params.id[0] : params.id
                if (!idOrSlug) throw new Error("Invalid blog ID")

                const data = await getBlog(idOrSlug)
                setBlog(data)
            } catch (err) {
                console.error(err)
                setError('Failed to load blog post')
            } finally {
                setLoading(false)
            }
        }

        if (params.id) {
            fetchBlogData()
        }

        // Cleanup function to reset ref if component unmounts (e.g. navigation away)
        // But in StrictMode dev double-invoke, we want to KEEP the ref true for the second invoke.
        // So we do NOT reset it in cleanup unless we want to allow re-fetching on re-mount.
        // For production, this doesn't matter as much.
        return () => {
            // intentinally keeping hasFetched true for strict mode dev behavior
        }
    }, [params.id])

    if (loading) {
        return (
            <div className="min-h-screen py-32 flex justify-center items-center">
                <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        )
    }

    if (error || !blog) {
        return (
            <div className="min-h-screen py-32 text-center text-white">
                <h1 className="text-3xl font-bold mb-4">Blog not found</h1>
                <p className="text-gray-400 mb-8">{error || "The requested blog post could not be found."}</p>
                <Link href="/blogs" className="text-purple-400 hover:text-purple-300 flex items-center justify-center gap-2">
                    <ArrowLeft size={20} /> Back to Blogs
                </Link>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#050505] pt-24 pb-20 relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

            <article className="container mx-auto px-4 max-w-4xl relative z-10">
                {/* Back Link */}
                <Link href="/blogs" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft size={20} className="mr-2" />
                    Back to Blogs
                </Link>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex gap-2 mb-4">
                        {blog.category && (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-900/50 text-purple-300 border border-purple-500/30">
                                {blog.category.name}
                            </span>
                        )}
                        {blog.is_featured && (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-900/50 text-yellow-300 border border-yellow-500/30">
                                Featured
                            </span>
                        )}
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                        {blog.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 text-gray-400 text-sm border-b border-gray-800 pb-8">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                                {blog.author && blog.author.profile_image ? (
                                    <img
                                        src={blog.author.profile_image.startsWith('http') ? blog.author.profile_image : `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000'}${blog.author.profile_image}`}
                                        alt={blog.author.username || 'Author'}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <User size={16} />
                                )}
                            </div>
                            <span>{blog.author?.username || 'Unknown Author'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar size={16} />
                            <span>{new Date(blog.created_at || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                        {blog.reading_time && (
                            <div className="flex items-center gap-2">
                                <Clock size={16} />
                                <span>{blog.reading_time} min read</span>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Featured Image */}
                {blog.featured_image && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1, duration: 0.5 }}
                        className="mb-12 rounded-2xl overflow-hidden shadow-2xl border border-gray-800"
                    >
                        <img
                            src={blog.featured_image.startsWith('http') ? blog.featured_image : `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000'}${blog.featured_image}`}
                            alt={blog.title}
                            className="w-full h-auto object-cover max-h-[600px]"
                        />
                    </motion.div>
                )}

                {/* Content */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="relative"
                >
                    <div className={`prose prose-invert prose-lg max-w-none text-gray-300 leading-relaxed overflow-hidden transition-all duration-700 ${!isContentExpanded ? 'max-h-[800px]' : 'max-h-full'}`}>
                        <ReactMarkdown components={MarkdownComponents}>
                            {blog.content}
                        </ReactMarkdown>
                    </div>

                    {!isContentExpanded && blog.content.length > 1000 && (
                        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent flex items-end justify-center pb-4">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsContentExpanded(true)}
                                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-full shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all flex items-center gap-2 group"
                            >
                                Continue Reading Article
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </motion.button>
                        </div>
                    )}

                    {isContentExpanded && (
                        <div className="mt-8 flex justify-center">
                            <button
                                onClick={() => {
                                    setIsContentExpanded(false)
                                    window.scrollTo({ top: 300, behavior: 'smooth' })
                                }}
                                className="text-gray-400 hover:text-white text-sm font-bold flex items-center gap-2 transition-colors"
                            >
                                <ArrowLeft size={16} /> Show Less
                            </button>
                        </div>
                    )}
                </motion.div>

                {/* Tags */}
                {blog.tags && blog.tags.length > 0 && (
                    <div className="mt-12 pt-8 border-t border-gray-800">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <Tag size={18} /> Related Tags
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {blog.tags.map((tag, index) => (
                                <span key={index} className="px-3 py-1 bg-gray-800 text-gray-300 rounded-lg text-sm">
                                    #{typeof tag === 'string' ? tag : (tag as any).name}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </article>

            {/* Related Articles Section */}
            {blog.related_blogs && blog.related_blogs.length > 0 && (
                <section className="container mx-auto px-4 max-w-6xl mt-24">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h2 className="text-3xl font-black text-white">Continue Reading</h2>
                            <p className="text-gray-400 mt-2">More insights you might find interesting</p>
                        </div>
                        <Link href="/blogs" className="hidden sm:flex items-center gap-2 text-purple-400 font-bold hover:text-purple-300 transition-colors">
                            View All <ArrowRight size={20} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blog.related_blogs.slice(0, 3).map((relatedBlog) => (
                            <BlogCard3D key={relatedBlog.id} blog={relatedBlog} />
                        ))}
                    </div>
                </section>
            )}

            {blog && <div className="container mx-auto px-4 max-w-4xl mt-20">
                <CommentSection blogId={blog.id} />
            </div>}
        </div>
    )
}
