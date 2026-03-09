'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

const TIERS = [
    {
        name: 'Starter',
        commission: '20%',
        minSales: 0,
        maxSales: 10,
        color: 'from-blue-500 to-cyan-400',
        bg: 'from-blue-500/10 to-cyan-400/10',
        border: 'border-blue-500/40',
        glow: 'shadow-blue-500/20',
        perks: ['Monthly payouts', 'Dedicated dashboard', 'Marketing materials'],
    },
    {
        name: 'Pro',
        commission: '30%',
        minSales: 11,
        maxSales: 50,
        color: 'from-purple-500 to-pink-500',
        bg: 'from-purple-500/10 to-pink-500/10',
        border: 'border-purple-500/40',
        glow: 'shadow-purple-500/20',
        perks: ['Bi-weekly payouts', 'Priority support', 'Custom referral links', 'Performance bonuses'],
        featured: true,
    },
    {
        name: 'Elite',
        commission: '40%',
        minSales: 51,
        maxSales: Infinity,
        color: 'from-amber-400 to-orange-500',
        bg: 'from-amber-400/10 to-orange-500/10',
        border: 'border-amber-400/40',
        glow: 'shadow-amber-400/20',
        perks: ['Weekly payouts', 'Dedicated manager', 'Co-marketing deals', 'VIP events', 'Custom commission'],
    },
]

const STEPS = [
    {
        num: '01',
        title: 'Sign Up Free',
        desc: 'Create your affiliate account in seconds. No credit card required.',
        icon: '🖊️',
        color: 'from-purple-500 to-blue-500',
    },
    {
        num: '02',
        title: 'Get Your Link',
        desc: 'Receive a unique referral link and access your personalised marketing kit.',
        icon: '🔗',
        color: 'from-blue-500 to-cyan-400',
    },
    {
        num: '03',
        title: 'Share & Promote',
        desc: 'Share Einsteine AI across social media, blogs, newsletters, and more.',
        icon: '📣',
        color: 'from-cyan-400 to-pink-500',
    },
    {
        num: '04',
        title: 'Earn Commissions',
        desc: 'Earn up to 40% recurring commissions for every customer you refer.',
        icon: '💰',
        color: 'from-pink-500 to-amber-400',
    },
]

const FAQS = [
    {
        q: 'How do I track my referrals?',
        a: 'Your personal dashboard provides real-time analytics including clicks, conversions, earnings, and payout history. All tracking is cookie-based with a 90-day attribution window.',
    },
    {
        q: 'When and how do I get paid?',
        a: 'Payments are processed based on your tier — monthly, bi-weekly, or weekly. We support PayPal, bank transfer, and cryptocurrency payouts with a minimum threshold of $50.',
    },
    {
        q: 'Is there a cost to join?',
        a: 'Zero cost. Joining the Einsteine AI affiliate program is completely free and there are no hidden fees or minimum traffic requirements.',
    },
    {
        q: 'What marketing materials are provided?',
        a: 'You get access to a full creative kit — banners, social media templates, email swipe copy, demo videos, and product screenshots — all professionally designed.',
    },
    {
        q: 'How long does the cookie window last?',
        a: 'Our attribution cookie lasts 90 days. If your referred visitor converts any time within 90 days of clicking your link, you earn the commission.',
    },
    {
        q: 'Can I be an affiliate if I\'m already a customer?',
        a: 'Absolutely! Many of our best affiliates are existing customers who genuinely love the product. You can earn commissions on top of using the platform yourself.',
    },
]

const STATS = [
    { value: '$2M+', label: 'Paid to Affiliates' },
    { value: '5,000+', label: 'Active Affiliates' },
    { value: '90 Days', label: 'Cookie Window' },
    { value: '40%', label: 'Max Commission' },
]

export default function AffiliatePage() {
    const [openFaq, setOpenFaq] = useState<number | null>(null)
    const [form, setForm] = useState({ name: '', email: '', website: '', audience: '' })
    const [submitted, setSubmitted] = useState(false)
    const [animatedStats, setAnimatedStats] = useState(false)
    const statsRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setAnimatedStats(true) },
            { threshold: 0.3 }
        )
        if (statsRef.current) observer.observe(statsRef.current)
        return () => observer.disconnect()
    }, [])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitted(true)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-purple-950 text-white overflow-x-hidden">
            {/* ── Hero ── */}
            <section className="relative pt-32 pb-24 px-4 text-center overflow-hidden">
                {/* Background blobs */}
                <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -top-20 -right-20 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-pink-600/5 rounded-full blur-3xl pointer-events-none" />

                {/* Cyber grid */}
                <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10 max-w-4xl mx-auto"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/40 bg-purple-500/10 text-purple-300 text-sm font-medium mb-6">
                        <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                        Affiliate Program — Now Open
                    </div>

                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight mb-6">
                        Earn Up To{' '}
                        <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
                            40% Commission
                        </span>
                        <br />
                        Sharing AI
                    </h1>

                    <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
                        Join thousands of creators, bloggers, and marketers earning recurring revenue by promoting
                        Einsteine AI — the future of AI-powered content creation.
                    </p>

                    <div className="flex flex-wrap gap-4 justify-center">
                        <a
                            href="#apply"
                            className="px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300"
                        >
                            Join for Free →
                        </a>
                        <a
                            href="#how-it-works"
                            className="px-8 py-4 rounded-full border border-gray-600 text-gray-300 font-medium text-lg hover:border-purple-500 hover:text-white transition-all duration-300"
                        >
                            Learn More
                        </a>
                    </div>
                </motion.div>

                {/* Floating badges */}
                <motion.div
                    initial={{ opacity: 0, x: -60 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="hidden lg:block absolute left-8 top-1/2 -translate-y-1/2 bg-gray-900/80 backdrop-blur border border-purple-500/30 rounded-2xl p-4 text-left shadow-2xl"
                >
                    <p className="text-xs text-gray-500 mb-1">This month</p>
                    <p className="text-2xl font-black text-white">$12,480</p>
                    <p className="text-sm text-green-400">↑ earned by top affiliate</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 60 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="hidden lg:block absolute right-8 top-1/3 bg-gray-900/80 backdrop-blur border border-pink-500/30 rounded-2xl p-4 text-left shadow-2xl"
                >
                    <p className="text-xs text-gray-500 mb-1">New affiliates</p>
                    <p className="text-2xl font-black text-white">+347</p>
                    <p className="text-sm text-blue-400">joined this week</p>
                </motion.div>
            </section>

            {/* ── Stats Bar ── */}
            <section ref={statsRef} className="py-12 border-y border-gray-800 bg-gray-900/40 backdrop-blur">
                <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
                    {STATS.map((s, i) => (
                        <motion.div
                            key={s.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={animatedStats ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            className="text-center"
                        >
                            <p className="text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                {s.value}
                            </p>
                            <p className="text-gray-500 text-sm mt-1">{s.label}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── How It Works ── */}
            <section id="how-it-works" className="py-24 px-4">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-black mb-4">
                            How It{' '}
                            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                                Works
                            </span>
                        </h2>
                        <p className="text-gray-400 text-lg max-w-xl mx-auto">
                            Start earning in 4 simple steps. No technical knowledge required.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {STEPS.map((step, i) => (
                            <motion.div
                                key={step.num}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15 }}
                                className="relative group"
                            >
                                {/* Connector line */}
                                {i < STEPS.length - 1 && (
                                    <div className="hidden lg:block absolute top-10 left-full w-full h-px bg-gradient-to-r from-purple-500/50 to-transparent z-0" />
                                )}
                                <div className={`relative z-10 bg-gradient-to-br ${step.color} p-px rounded-2xl group-hover:shadow-xl transition-all duration-300`}>
                                    <div className="bg-gray-950 rounded-2xl p-6 h-full">
                                        <div className="text-4xl mb-4">{step.icon}</div>
                                        <span className={`text-6xl font-black bg-gradient-to-r ${step.color} bg-clip-text text-transparent opacity-20 absolute top-4 right-4`}>
                                            {step.num}
                                        </span>
                                        <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                                        <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Commission Tiers ── */}
            <section id="tiers" className="py-24 px-4 bg-gray-900/30">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-black mb-4">
                            Commission{' '}
                            <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                                Tiers
                            </span>
                        </h2>
                        <p className="text-gray-400 text-lg max-w-xl mx-auto">
                            The more you refer, the more you earn. Tiers upgrade automatically.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-6 items-center">
                        {TIERS.map((tier, i) => (
                            <motion.div
                                key={tier.name}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15 }}
                                className={`relative rounded-2xl border ${tier.border} bg-gradient-to-br ${tier.bg} p-px ${tier.featured ? 'scale-105 shadow-2xl ' + tier.glow : ''}`}
                            >
                                {tier.featured && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold shadow-lg">
                                        MOST POPULAR
                                    </div>
                                )}
                                <div className="bg-gray-950/80 backdrop-blur rounded-2xl p-8">
                                    <h3 className={`text-xl font-black bg-gradient-to-r ${tier.color} bg-clip-text text-transparent mb-2`}>
                                        {tier.name}
                                    </h3>
                                    <div className={`text-6xl font-black bg-gradient-to-r ${tier.color} bg-clip-text text-transparent mb-1`}>
                                        {tier.commission}
                                    </div>
                                    <p className="text-gray-500 text-sm mb-6">
                                        {tier.maxSales === Infinity
                                            ? `${tier.minSales}+ referrals/month`
                                            : `${tier.minSales}–${tier.maxSales} referrals/month`}
                                    </p>
                                    <ul className="space-y-3 mb-8">
                                        {tier.perks.map((perk) => (
                                            <li key={perk} className="flex items-center gap-3 text-gray-300 text-sm">
                                                <span className={`w-5 h-5 rounded-full bg-gradient-to-r ${tier.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                                                    ✓
                                                </span>
                                                {perk}
                                            </li>
                                        ))}
                                    </ul>
                                    <a
                                        href="#apply"
                                        className={`block w-full py-3 rounded-xl text-center font-bold text-sm bg-gradient-to-r ${tier.color} text-white hover:opacity-90 hover:scale-105 transition-all duration-300`}
                                    >
                                        Get Started
                                    </a>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Earnings Calculator ── */}
            <EarningsCalculator />

            {/* ── FAQ ── */}
            <section className="py-24 px-4">
                <div className="max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-black mb-4">
                            Frequently Asked{' '}
                            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                Questions
                            </span>
                        </h2>
                    </motion.div>

                    <div className="space-y-4">
                        {FAQS.map((faq, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="border border-gray-800 rounded-2xl overflow-hidden bg-gray-900/40 backdrop-blur hover:border-purple-500/40 transition-colors"
                            >
                                <button
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    className="w-full px-6 py-5 text-left flex items-center justify-between gap-4"
                                >
                                    <span className="font-semibold text-white">{faq.q}</span>
                                    <span
                                        className={`text-purple-400 text-2xl font-light transition-transform duration-300 ${openFaq === i ? 'rotate-45' : ''}`}
                                    >
                                        +
                                    </span>
                                </button>
                                <AnimatePresence>
                                    {openFaq === i && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <p className="px-6 pb-5 text-gray-400 leading-relaxed">{faq.a}</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Apply Form ── */}
            <section id="apply" className="py-24 px-4 bg-gray-900/40">
                <div className="max-w-xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-10"
                    >
                        <h2 className="text-4xl font-black mb-3">
                            Apply{' '}
                            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                Now
                            </span>
                        </h2>
                        <p className="text-gray-400">Join thousands of affiliates earning with Einsteine AI.</p>
                    </motion.div>

                    {submitted ? (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-center py-16 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-3xl"
                        >
                            <div className="text-6xl mb-4">🎉</div>
                            <h3 className="text-2xl font-black mb-2">Application Received!</h3>
                            <p className="text-gray-400 mb-6">
                                We'll review your application and email you within 24 hours.
                            </p>
                            <Link
                                href="/"
                                className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:opacity-90 transition"
                            >
                                Back to Home
                            </Link>
                        </motion.div>
                    ) : (
                        <motion.form
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            onSubmit={handleSubmit}
                            className="bg-gray-900/60 backdrop-blur border border-gray-800 rounded-3xl p-8 space-y-5 hover:border-purple-500/30 transition-colors"
                        >
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    placeholder="Jane Doe"
                                    className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    placeholder="jane@example.com"
                                    className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Website / Social Profile <span className="text-gray-600">(optional)</span></label>
                                <input
                                    type="url"
                                    value={form.website}
                                    onChange={(e) => setForm({ ...form, website: e.target.value })}
                                    placeholder="https://yourblog.com"
                                    className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Describe your audience</label>
                                <textarea
                                    required
                                    value={form.audience}
                                    onChange={(e) => setForm({ ...form, audience: e.target.value })}
                                    placeholder="E.g. tech enthusiasts, content creators, SaaS buyers..."
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition resize-none"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300"
                            >
                                Submit Application
                            </button>
                            <p className="text-center text-gray-600 text-xs">
                                By applying, you agree to our{' '}
                                <Link href="/terms" className="text-purple-400 hover:underline">
                                    Terms & Conditions
                                </Link>{' '}
                                and{' '}
                                <Link href="/security" className="text-purple-400 hover:underline">
                                    Privacy Policy
                                </Link>.
                            </p>
                        </motion.form>
                    )}
                </div>
            </section>
        </div>
    )
}

/* ── Earnings Calculator Component ── */
function EarningsCalculator() {
    const [referrals, setReferrals] = useState(20)
    const [planValue, setPlanValue] = useState(49)

    const getTier = (r: number) => {
        if (r <= 10) return { name: 'Starter', rate: 0.2, color: 'from-blue-500 to-cyan-400' }
        if (r <= 50) return { name: 'Pro', rate: 0.3, color: 'from-purple-500 to-pink-500' }
        return { name: 'Elite', rate: 0.4, color: 'from-amber-400 to-orange-500' }
    }

    const tier = getTier(referrals)
    const monthly = Math.round(referrals * planValue * tier.rate)
    const annual = monthly * 12

    return (
        <section className="py-24 px-4">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl font-black mb-4">
                        Earnings{' '}
                        <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                            Calculator
                        </span>
                    </h2>
                    <p className="text-gray-400 text-lg max-w-xl mx-auto">
                        See how much you could earn based on your referrals.
                    </p>
                </motion.div>

                <div className="bg-gray-900/60 backdrop-blur border border-gray-800 rounded-3xl p-8 hover:border-purple-500/30 transition-colors">
                    <div className="grid md:grid-cols-2 gap-10 items-center">
                        <div className="space-y-8">
                            {/* Referrals Slider */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <label className="text-gray-300 font-medium">Monthly Referrals</label>
                                    <span className={`text-2xl font-black bg-gradient-to-r ${tier.color} bg-clip-text text-transparent`}>
                                        {referrals}
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min={1}
                                    max={200}
                                    value={referrals}
                                    onChange={(e) => setReferrals(Number(e.target.value))}
                                    className="w-full h-2 bg-gray-700 rounded-full appearance-none cursor-pointer accent-purple-500"
                                />
                                <div className="flex justify-between text-xs text-gray-600 mt-1">
                                    <span>1</span>
                                    <span>200</span>
                                </div>
                            </div>

                            {/* Plan Value */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <label className="text-gray-300 font-medium">Average Plan Value ($/mo)</label>
                                    <span className={`text-2xl font-black bg-gradient-to-r ${tier.color} bg-clip-text text-transparent`}>
                                        ${planValue}
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min={9}
                                    max={299}
                                    step={10}
                                    value={planValue}
                                    onChange={(e) => setPlanValue(Number(e.target.value))}
                                    className="w-full h-2 bg-gray-700 rounded-full appearance-none cursor-pointer accent-purple-500"
                                />
                                <div className="flex justify-between text-xs text-gray-600 mt-1">
                                    <span>$9</span>
                                    <span>$299</span>
                                </div>
                            </div>

                            {/* Tier badge */}
                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${tier.color} bg-opacity-10 border border-white/10`}>
                                <span className="text-sm font-bold text-white">Your Tier: {tier.name}</span>
                                <span className="text-sm text-white opacity-80">({Math.round(tier.rate * 100)}% commission)</span>
                            </div>
                        </div>

                        {/* Results */}
                        <div className="space-y-4">
                            <div className={`relative bg-gradient-to-br ${tier.color} p-px rounded-2xl`}>
                                <div className="bg-gray-950 rounded-2xl p-6 text-center">
                                    <p className="text-gray-500 text-sm mb-2">Monthly Earnings</p>
                                    <p className={`text-5xl font-black bg-gradient-to-r ${tier.color} bg-clip-text text-transparent`}>
                                        ${monthly.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <div className="bg-gray-800/50 rounded-2xl p-5 text-center border border-gray-700/50">
                                <p className="text-gray-500 text-sm mb-1">Annual Potential</p>
                                <p className="text-3xl font-black text-white">${annual.toLocaleString()}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-gray-800/40 rounded-xl p-4 text-center border border-gray-700/30">
                                    <p className="text-xs text-gray-500">Rate</p>
                                    <p className="text-lg font-bold text-white">{Math.round(tier.rate * 100)}%</p>
                                </div>
                                <div className="bg-gray-800/40 rounded-xl p-4 text-center border border-gray-700/30">
                                    <p className="text-xs text-gray-500">Tier</p>
                                    <p className={`text-lg font-bold bg-gradient-to-r ${tier.color} bg-clip-text text-transparent`}>{tier.name}</p>
                                </div>
                            </div>
                            <a
                                href="#apply"
                                className={`block w-full py-4 rounded-xl text-center font-bold bg-gradient-to-r ${tier.color} text-white hover:opacity-90 hover:scale-105 transition-all duration-300`}
                            >
                                Start Earning ${monthly.toLocaleString()}/mo →
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
