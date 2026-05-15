'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import { getBlog, BlogDetail } from '@/lib/api'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Clock, Calendar, User, Tag, ArrowRight } from 'lucide-react'
import CommentSection from '@/components/comments/CommentSection'
import BlogCard3D from '@/components/ui/BlogCard3D'
import ReactMarkdown from 'react-markdown'
import { useTheme } from '@/contexts/ThemeContext'

// Markdown components configuration
const MarkdownComponents = ({ isDark }: { isDark: boolean }) => ({
    h1: ({ node, ...props }: any) => <h1 className={`text-4xl font-bold mt-8 mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`} {...props} />,
    h2: ({ node, ...props }: any) => <h2 className={`text-3xl font-bold mt-8 mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`} {...props} />,
    h3: ({ node, ...props }: any) => <h2 className={`text-2xl font-bold mt-6 mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`} {...props} />,
    p: ({ node, children, ...props }: any) => {
        const hasBlock = node?.children?.some(
            (child: any) => child.tagName === 'pre' || child.tagName === 'code'
        )
        if (hasBlock) return <div className={`mb-4 leading-relaxed ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>{children}</div>
        return <p className={`mb-4 leading-relaxed ${isDark ? 'text-gray-300' : 'text-slate-600'}`} {...props}>{children}</p>
    },
    ul: ({ node, ...props }: any) => <ul className="list-disc ml-6 mb-4 space-y-2" {...props} />,
    ol: ({ node, ...props }: any) => <ol className="list-decimal ml-6 mb-4 space-y-2" {...props} />,
    li: ({ node, ...props }: any) => <li className={isDark ? 'text-gray-300' : 'text-slate-600'} {...props} />,
    a: ({ node, ...props }: any) => <a className="text-purple-400 hover:text-purple-300 underline transition-colors" {...props} />,
    blockquote: ({ node, ...props }: any) => <blockquote className={`border-l-4 border-purple-500 pl-4 py-2 my-4 italic rounded-r ${isDark ? 'bg-gray-800/50 text-gray-400' : 'bg-gray-100/80 text-slate-500'}`} {...props} />,
    pre: ({ node, children, ...props }: any) => (
        <pre className={`p-4 rounded-lg overflow-x-auto mb-4 border ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-gray-100 border-gray-200'}`} {...props}>
            {children}
        </pre>
    ),
    code: ({ node, inline, className, children, ...props }: any) => {
        return inline ? (
            <code className={`px-1 py-0.5 rounded font-mono text-sm ${isDark ? 'bg-gray-800 text-purple-300' : 'bg-gray-200 text-purple-700'}`} {...props}>{children}</code>
        ) : (
            <code className={`font-mono text-sm ${isDark ? 'text-gray-300' : 'text-slate-700'}`} {...props}>{children}</code>
        )
    },
    img: ({ node, ...props }: any) => <img className="rounded-xl my-8 border w-full" {...props} />,
})

export default function BlogDetailPage() {
    const params = useParams()
    const [blog, setBlog] = useState<BlogDetail | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isContentExpanded, setIsContentExpanded] = useState(false)
    const { isDark } = useTheme()
    const hasFetched = useRef(false)

    useEffect(() => {
        async function fetchBlogData() {
            if (hasFetched.current) return
            hasFetched.current = true

            try {
                setLoading(true)
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

        return () => {
            // intentionally keeping hasFetched true
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
            <div className={`min-h-screen py-32 text-center ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <h1 className="text-3xl font-bold mb-4">Blog not found</h1>
                <p className={`mb-8 ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>{error || "The requested blog post could not be found."}</p>
                <Link href="/blogs" className="text-purple-400 hover:text-purple-300 flex items-center justify-center gap-2">
                    <ArrowLeft size={20} /> Back to Blogs
                </Link>
            </div>
        )
    }

    return (
        <div className={`min-h-screen pt-24 pb-20 relative overflow-hidden ${isDark ? 'bg-[#050505]' : 'bg-gradient-to-br from-slate-50 via-purple-50/30 to-blue-50/40'}`}>
            {/* Background with grid pattern */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                {isDark ? (
                    <>
                        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]" />
                        <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px]" />
                    </>
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

            <article className="container mx-auto px-4 max-w-4xl relative z-10">
                {/* Back Link */}
                <Link href="/blogs" className={`inline-flex items-center mb-8 transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}>
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
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                                isDark
                                    ? 'bg-purple-900/50 text-purple-300 border-purple-500/30'
                                    : 'bg-purple-100 text-purple-700 border-purple-200'
                            }`}>
                                {blog.category.name}
                            </span>
                        )}
                        {blog.is_featured && (
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                                isDark
                                    ? 'bg-yellow-900/50 text-yellow-300 border-yellow-500/30'
                                    : 'bg-yellow-100 text-yellow-700 border-yellow-200'
                            }`}>
                                Featured
                            </span>
                        )}
                    </div>

                    <h1 className={`text-4xl md:text-5xl font-bold mb-6 leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {blog.title}
                    </h1>

                    <div className={`flex flex-wrap items-center gap-6 text-sm pb-8 ${isDark ? 'text-gray-400 border-b border-gray-800' : 'text-slate-500 border-b border-gray-200'}`}>
                        <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                                {blog.author && blog.author.profile_image ? (
                                    <img
                                        src={blog.author.profile_image.startsWith('http') ? blog.author.profile_image : (blog.author.profile_image.startsWith('/uploads/') ? blog.author.profile_image : `/uploads/${blog.author.profile_image}`)}
                                        alt={blog.author.username || 'Author'}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <User size={16} className={isDark ? 'text-gray-400' : 'text-slate-500'} />
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
                        className={`mb-12 rounded-2xl overflow-hidden shadow-2xl border ${isDark ? 'border-gray-800' : 'border-gray-200'}`}
                    >
                        <img
                            src={blog.featured_image.startsWith('http') ? blog.featured_image : (blog.featured_image.startsWith('/uploads/') ? blog.featured_image : `/uploads/${blog.featured_image}`)}
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
                    <div className={`leading-relaxed overflow-hidden transition-all duration-700 ${!isContentExpanded ? 'max-h-[800px]' : 'max-h-full'}`}>
                        <ReactMarkdown components={MarkdownComponents({ isDark })}>
                            {blog.content}
                        </ReactMarkdown>
                    </div>

                    {!isContentExpanded && blog.content.length > 1000 && (
                        <div className={`absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t flex items-end justify-center pb-4 ${
                            isDark
                                ? 'from-[#050505] via-[#050505]/80 to-transparent'
                                : 'from-white via-white/80 to-transparent'
                        }`}>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsContentExpanded(true)}
                                className={`px-8 py-3 font-bold rounded-full shadow-lg transition-all flex items-center gap-2 group ${
                                    isDark
                                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-purple-500/20 hover:shadow-purple-500/40'
                                        : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-purple-400/30 hover:shadow-purple-500/50'
                                }`}
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
                                className={`text-sm font-bold flex items-center gap-2 transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}
                            >
                                <ArrowLeft size={16} /> Show Less
                            </button>
                        </div>
                    )}
                </motion.div>

                {/* Tags */}
                {blog.tags && blog.tags.length > 0 && (
                    <div className={`mt-12 pt-8 border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
                        <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            <Tag size={18} /> Related Tags
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {blog.tags.map((tag, index) => (
                                <span key={index} className={`px-3 py-1 rounded-lg text-sm ${
                                    isDark
                                        ? 'bg-gray-800 text-gray-300'
                                        : 'bg-gray-100 text-slate-600'
                                }`}>
                                    #{typeof tag === 'string' ? tag : (tag as any).name}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </article>

            {/* Related Articles Section */}
            {blog.related_blogs && blog.related_blogs.length > 0 && (
                <section className="container mx-auto px-4 max-w-6xl mt-24 relative z-10">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h2 className={`text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Continue Reading</h2>
                            <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>More insights you might find interesting</p>
                        </div>
                        <Link href="/blogs" className={`hidden sm:flex items-center gap-2 font-bold transition-colors ${isDark ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-700'}`}>
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

            {/* Comments Section */}
            {blog && (
                <div className="container mx-auto px-4 max-w-4xl mt-20 relative z-10">
                    <CommentSection blogId={blog.id} />
                </div>
            )}

            <style jsx>{`
                @keyframes gradient-x {
                    0%, 100% { transform: translateX(-100%); }
                    50% { transform: translateX(100%); }
                }
                @keyframes gradient-y {
                    0%, 100% { transform: translateY(-100%); }
                    50% { transform: translateY(100%); }
                }
                .animate-gradient-x { animation: gradient-x 15s ease-in-out infinite; }
                .animate-gradient-y { animation: gradient-y 20s ease-in-out infinite; }
            `}</style>
        </div>
    )
}