'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'

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

import ScrollSectionHeader from '../ui/ScrollSectionHeader'

export default function AffiliateSection() {
    const ref = useRef<HTMLDivElement>(null)
    const isInView = useInView(ref, { once: true, margin: '-100px' })

    return (
        <section ref={ref} className="relative py-28 px-4 overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-950/40 via-black to-gray-950 pointer-events-none" />
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/8 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-pink-600/8 rounded-full blur-3xl pointer-events-none" />

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
                            className={`relative bg-gradient-to-br ${b.bg} border border-white/5 rounded-2xl p-6 group hover:border-purple-500/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
                        >
                            <div className="text-3xl mb-4">{b.icon}</div>
                            <h3 className={`font-bold text-white mb-2 bg-gradient-to-r ${b.color} bg-clip-text text-transparent`}>
                                {b.title}
                            </h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{b.desc}</p>
                            {/* Hover glow */}
                            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${b.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                        </motion.div>
                    ))}
                </div>

                {/* Earnings Preview Row */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.4, duration: 0.7 }}
                    className="relative rounded-3xl overflow-hidden border border-purple-500/20 bg-gradient-to-r from-purple-900/30 via-gray-900/60 to-pink-900/30 p-8 mb-20"
                >
                    <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
                    <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8">
                        {/* Left: Tiers */}
                        <div className="flex-1 w-full">
                            <h3 className="text-2xl font-black text-white mb-6">Commission Tiers at a Glance</h3>
                            <div className="space-y-3">
                                {[
                                    { name: 'Starter', rate: '20%', range: '0–10 referrals', color: 'from-blue-500 to-cyan-400', w: 'w-1/2' },
                                    { name: 'Pro', rate: '30%', range: '11–50 referrals', color: 'from-purple-500 to-pink-500', w: 'w-3/4' },
                                    { name: 'Elite', rate: '40%', range: '51+ referrals', color: 'from-amber-400 to-orange-500', w: 'w-full' },
                                ].map((tier) => (
                                    <div key={tier.name} className="flex items-center gap-4">
                                        <span className="text-gray-400 text-sm w-16">{tier.name}</span>
                                        <div className="flex-1 bg-gray-800 rounded-full h-3 overflow-hidden">
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
                                        <span className="text-gray-600 text-xs hidden sm:block w-28">{tier.range}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="hidden lg:block w-px h-32 bg-gray-700" />

                        {/* Right: CTA */}
                        <div className="text-center lg:text-right lg:flex-shrink-0">
                            <div className="text-5xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                                $2M+
                            </div>
                            <p className="text-gray-400 mb-6">paid to affiliates to date</p>
                            <Link
                                href="/affiliate"
                                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300"
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
                    <h3 className="text-center text-2xl font-black text-white mb-8">
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
                                className="bg-gray-900/60 backdrop-blur border border-gray-800 rounded-2xl p-6 hover:border-purple-500/30 hover:-translate-y-1 transition-all duration-300"
                            >
                                <p className="text-gray-300 text-sm leading-relaxed mb-5">"{t.text}"</p>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${t.color} flex items-center justify-center text-white font-bold text-sm`}>
                                            {t.avatar}
                                        </div>
                                        <div>
                                            <p className="text-white font-semibold text-sm">{t.name}</p>
                                            <p className="text-gray-500 text-xs">{t.role}</p>
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
                        className="inline-flex items-center gap-3 px-10 py-5 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white font-bold text-xl shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300"
                    >
                        <span>Join the Affiliate Program</span>
                        <span className="text-2xl">→</span>
                    </Link>
                    <p className="text-gray-600 text-sm mt-4">Free to join · No minimum traffic · Instant approval</p>
                </motion.div>
            </div>
        </section>
    )
}
