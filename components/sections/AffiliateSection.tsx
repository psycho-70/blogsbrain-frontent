'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { useTheme } from '@/contexts/ThemeContext'
import ScrollSectionHeader from '../ui/ScrollSectionHeader'

const BENEFITS = [
    {
        icon: '💸',
        title: 'Up to 40% Commission',
        desc: 'Earn generous recurring commissions on every paying customer you refer.',
        color: 'from-purple-500 to-pink-500',
        bg: 'from-purple-500/10 to-pink-500/10',
    },
    {
        icon: '🔄',
        title: 'Recurring Revenue',
        desc: 'Get paid every month as long as your referrals remain active subscribers.',
        color: 'from-blue-500 to-cyan-400',
        bg: 'from-blue-500/10 to-cyan-400/10',
    },
    {
        icon: '📊',
        title: 'Real-time Dashboard',
        desc: 'Track clicks, conversions, and earnings live with your personal analytics.',
        color: 'from-cyan-400 to-green-400',
        bg: 'from-cyan-400/10 to-green-400/10',
    },
    {
        icon: '🎁',
        title: 'Marketing Kit',
        desc: 'Get banners, social assets, and copy ready to use from day one.',
        color: 'from-amber-400 to-orange-500',
        bg: 'from-amber-400/10 to-orange-500/10',
    },
]

const TESTIMONIALS = [
    {
        name: 'Sarah K.',
        role: 'Content Creator',
        avatar: 'SK',
        earning: '$3,240/mo',
        text: 'I\'ve tried dozens of affiliate programs. Einsteine AI pays the best commissions and the 90-day cookie window is a game changer.',
        color: 'from-purple-500 to-pink-500',
    },
    {
        name: 'James R.',
        role: 'Tech Blogger',
        avatar: 'JR',
        earning: '$8,100/mo',
        text: 'Within 3 months I hit the Elite tier. The recurring model means my income grows every single month without any extra effort.',
        color: 'from-blue-500 to-cyan-400',
    },
    {
        name: 'Priya M.',
        role: 'YouTube Creator',
        avatar: 'PM',
        earning: '$1,890/mo',
        text: 'The marketing materials are incredibly professional. My audience loves Einsteine AI and the conversion rate speaks for itself.',
        color: 'from-amber-400 to-orange-500',
    },
]

export default function AffiliateSection() {
    const ref = useRef<HTMLDivElement>(null)
    const isInView = useInView(ref, { once: true, margin: '-100px' })
    const { isDark } = useTheme()

    return (
        <section ref={ref} className="relative py-28 px-4 overflow-hidden">
            {/* Grid Background (same as Hero) */}
            <div className="absolute inset-0 z-0">
                {isDark ? (
                    /* Dark mode background */
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-950/40 via-black to-gray-950" />
                ) : (
                    /* Light mode background with grid */
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-purple-50/30 to-blue-50/40" />
                )}
                
                {/* Grid overlay for both modes */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        backgroundImage: `linear-gradient(${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.06)'} 1px, transparent 1px),
                                          linear-gradient(90deg, ${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.06)'} 1px, transparent 1px)`,
                        backgroundSize: '60px 60px',
                    }}
                />
                
                {/* Gradient overlays */}
                <div className={`absolute inset-0 ${
                    isDark 
                        ? 'bg-gradient-to-br from-purple-950/40 via-black to-gray-950' 
                        : 'bg-gradient-to-br from-slate-50/60 via-purple-50/30 to-blue-50/40'
                }`} />
                
                {/* Color blobs for light mode */}
                {!isDark && (
                    <>
                        <div
                            className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full opacity-20 pointer-events-none"
                            style={{
                                background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
                                transform: 'translate(-30%, -30%)',
                            }}
                        />
                        <div
                            className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full opacity-15 pointer-events-none"
                            style={{
                                background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)',
                                transform: 'translate(20%, 20%)',
                            }}
                        />
                        <div
                            className="absolute top-1/2 left-1/2 w-[800px] h-[400px] opacity-10 pointer-events-none"
                            style={{
                                background: 'radial-gradient(ellipse, rgba(168,85,247,0.1) 0%, transparent 60%)',
                                transform: 'translate(-50%, -50%)',
                            }}
                        />
                    </>
                )}
                
                {/* Color blobs for dark mode */}
                {isDark && (
                    <>
                        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/8 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-pink-600/8 rounded-full blur-3xl pointer-events-none" />
                    </>
                )}
                
                {/* Moving shimmer for both modes */}
                <div className={`absolute inset-0 ${isDark ? 'opacity-30' : 'opacity-15'}`}>
                    <div className={`absolute inset-0 bg-gradient-to-r from-transparent ${isDark ? 'via-purple-500/20' : 'via-purple-200/50'} to-transparent animate-gradient-x`} />
                    <div className={`absolute inset-0 bg-gradient-to-b from-transparent ${isDark ? 'via-blue-500/10' : 'via-blue-100/40'} to-transparent animate-gradient-y`} />
                </div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
                <ScrollSectionHeader
                    badge="Affiliate Program"
                    titlePrefix="Turn Your Network Into"
                    titleHighlight="Passive Income"
                    description="Join 5,000+ affiliates earning up to 40% recurring commissions by sharing Einsteine AI with their audience."
                />

                {/* Benefits Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-20">
                    {BENEFITS.map((b, i) => (
                        <motion.div
                            key={b.title}
                            initial={{ opacity: 0, y: 40 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: i * 0.12, duration: 0.6 }}
                            className={`relative rounded-2xl p-6 group hover:-translate-y-1 transition-all duration-300 ${
                                isDark
                                    ? `bg-gradient-to-br ${b.bg} border border-white/5 hover:border-purple-500/30 hover:shadow-xl`
                                    : `bg-gradient-to-br ${b.bg.replace('/10', '/20')} border border-purple-200/30 hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-500/10`
                            }`}
                        >
                            <div className="text-3xl mb-4">{b.icon}</div>
                            <h3 className={`font-bold mb-2 bg-gradient-to-r ${b.color} bg-clip-text text-transparent ${
                                isDark ? 'text-white' : ''
                            }`}>
                                {b.title}
                            </h3>
                            <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
                                {b.desc}
                            </p>
                            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${b.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                        </motion.div>
                    ))}
                </div>

                {/* Earnings Preview Row */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.4, duration: 0.7 }}
                    className={`relative rounded-3xl overflow-hidden border p-8 mb-20 ${
                        isDark 
                            ? 'border-purple-500/20 bg-gradient-to-r from-purple-900/30 via-gray-900/60 to-pink-900/30' 
                            : 'border-purple-300/30 bg-gradient-to-r from-purple-100/50 via-white/70 to-pink-100/50 shadow-lg'
                    }`}
                >
                    <div className={`absolute inset-0 pointer-events-none ${
                        isDark ? 'cyber-grid opacity-10' : ''
                    }`} />
                    
                    {/* Light mode grid overlay */}
                    {!isDark && (
                        <div
                            className="absolute inset-0 pointer-events-none opacity-20"
                            style={{
                                backgroundImage: `linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px),
                                                  linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)`,
                                backgroundSize: '40px 40px',
                            }}
                        />
                    )}
                    
                    <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8">
                        {/* Left: Tiers */}
                        <div className="flex-1 w-full">
                            <h3 className={`text-2xl font-black mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                Commission Tiers at a Glance
                            </h3>
                            <div className="space-y-3">
                                {[
                                    { name: 'Starter', rate: '20%', range: '0–10 referrals', color: 'from-blue-500 to-cyan-400', w: 'w-1/2' },
                                    { name: 'Pro', rate: '30%', range: '11–50 referrals', color: 'from-purple-500 to-pink-500', w: 'w-3/4' },
                                    { name: 'Elite', rate: '40%', range: '51+ referrals', color: 'from-amber-400 to-orange-500', w: 'w-full' },
                                ].map((tier) => (
                                    <div key={tier.name} className="flex items-center gap-4">
                                        <span className={`text-sm w-16 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                                            {tier.name}
                                        </span>
                                        <div className={`flex-1 rounded-full h-3 overflow-hidden ${
                                            isDark ? 'bg-gray-800' : 'bg-gray-200'
                                        }`}>
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={isInView ? { width: tier.w === 'w-full' ? '100%' : tier.w === 'w-3/4' ? '75%' : '50%' } : {}}
                                                transition={{ delay: 0.6, duration: 1, ease: 'easeOut' }}
                                                className={`h-full rounded-full bg-gradient-to-r ${tier.color}`}
                                            />
                                        </div>
                                        <span className={`font-bold text-lg bg-gradient-to-r ${tier.color} bg-clip-text text-transparent w-12 text-right`}>
                                            {tier.rate}
                                        </span>
                                        <span className={`text-xs hidden sm:block w-28 ${isDark ? 'text-gray-600' : 'text-slate-400'}`}>
                                            {tier.range}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Divider */}
                        <div className={`hidden lg:block w-px h-32 ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`} />

                        {/* Right: CTA */}
                        <div className="text-center lg:text-right lg:flex-shrink-0">
                            <div className="text-5xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                                $2M+
                            </div>
                            <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                                paid to affiliates to date
                            </p>
                            <Link
                                href="/affiliate"
                                className={`inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-lg shadow-lg transition-all duration-300 hover:scale-105 ${
                                    isDark
                                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-purple-500/30 hover:shadow-purple-500/50'
                                        : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-purple-400/40 hover:shadow-purple-500/60'
                                }`}
                            >
                                Start Earning →
                            </Link>
                        </div>
                    </div>
                </motion.div>

                {/* Testimonials */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.5, duration: 0.7 }}
                >
                    <h3 className={`text-center text-2xl font-black mb-8 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        What Our{' '}
                        <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Top Affiliates
                        </span>{' '}
                        Are Saying
                    </h3>
                    <div className="grid md:grid-cols-3 gap-5">
                        {TESTIMONIALS.map((t, i) => (
                            <motion.div
                                key={t.name}
                                initial={{ opacity: 0, y: 30 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ delay: 0.6 + i * 0.12, duration: 0.5 }}
                                className={`rounded-2xl p-6 border transition-all duration-300 hover:-translate-y-1 ${
                                    isDark
                                        ? 'bg-gray-900/60 backdrop-blur border-gray-800 hover:border-purple-500/30'
                                        : 'bg-white/80 backdrop-blur border-gray-200 hover:border-purple-400/50 shadow-md hover:shadow-lg'
                                }`}
                            >
                                <p className={`text-sm leading-relaxed mb-5 ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
                                    "{t.text}"
                                </p>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${t.color} flex items-center justify-center text-white font-bold text-sm`}>
                                            {t.avatar}
                                        </div>
                                        <div>
                                            <p className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                                {t.name}
                                            </p>
                                            <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>
                                                {t.role}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`font-black text-sm bg-gradient-to-r ${t.color} bg-clip-text text-transparent`}>
                                        {t.earning}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="text-center mt-16"
                >
                    <Link
                        href="/affiliate"
                        className={`inline-flex items-center gap-3 px-10 py-5 rounded-full font-bold text-xl shadow-2xl transition-all duration-300 hover:scale-105 ${
                            isDark
                                ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white shadow-purple-500/30 hover:shadow-purple-500/50'
                                : 'bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500 text-white shadow-purple-400/40 hover:shadow-purple-500/60'
                        }`}
                    >
                        <span>Join the Affiliate Program</span>
                        <span className="text-2xl">→</span>
                    </Link>
                    <p className={`text-sm mt-4 ${isDark ? 'text-gray-600' : 'text-slate-400'}`}>
                        Free to join · No minimum traffic · Instant approval
                    </p>
                </motion.div>
            </div>

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
                .cyber-grid {
                    background-image: 
                        linear-gradient(rgba(168, 85, 247, 0.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(168, 85, 247, 0.1) 1px, transparent 1px);
                    background-size: 30px 30px;
                }
            `}</style>
        </section>
    )
}