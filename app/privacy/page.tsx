// app/privacy/page.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useCallback, useEffect } from 'react';
import {
    Shield,
    Lock,
    Eye,
    Cookie,
    Mail,
    Database,
    UserCheck,
    Trash2,
    FileText,
    Globe,
    Bell,
    Share2,
    ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Typewriter from '@/components/ui/Typewriter';
import { useTheme } from '@/contexts/ThemeContext';

const privacySections = [
    {
        id: 1,
        title: 'Information We Collect',
        icon: Database,
        content: 'We collect information you provide directly, such as when you subscribe to our newsletter, leave comments, or contact us. This may include your name, email address, and any content you post. We also automatically collect certain information about your device and usage, including IP address, browser type, and pages visited.'
    },
    {
        id: 2,
        title: 'How We Use Your Information',
        icon: Eye,
        content: 'Your information helps us provide, maintain, and improve our services. We use it to send newsletters, respond to comments, analyze site traffic, personalize your experience, and communicate with you about updates or promotions. We never sell your personal information to third parties.'
    },
    {
        id: 3,
        title: 'Cookies & Tracking',
        icon: Cookie,
        content: 'We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and understand where our visitors come from. You can control cookies through your browser settings, though disabling them may affect site functionality.'
    },
    {
        id: 4,
        title: 'Data Security',
        icon: Lock,
        content: 'We implement industry-standard security measures to protect your personal information. This includes encryption, secure servers, and regular security audits. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.'
    },
    {
        id: 5,
        title: 'Third-Party Services',
        icon: Share2,
        content: 'We may use third-party services for analytics, advertising, or content delivery. These services have their own privacy policies, and we encourage you to review them. We are not responsible for the practices of third-party websites or services.'
    },
    {
        id: 6,
        title: 'Your Rights',
        icon: UserCheck,
        content: 'You have the right to access, correct, or delete your personal information. You may opt out of marketing communications at any time. To exercise these rights, please contact us using the information provided below.'
    },
    {
        id: 7,
        title: 'Data Retention',
        icon: Trash2,
        content: 'We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this policy. When we no longer need your information, we will securely delete or anonymize it.'
    },
    {
        id: 8,
        title: 'Children\'s Privacy',
        icon: Bell,
        content: 'Our blog is not intended for children under 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us so we can delete it.'
    }
];

const privacyStats = [
    { number: 'GDPR', label: 'Compliant', icon: Globe },
    { number: '256-bit', label: 'Encryption', icon: Lock },
    { number: '0', label: 'Data Breaches', icon: Shield },
    { number: '24/7', label: 'Monitoring', icon: Eye }
];

const cookies = [
    {
        name: 'Essential Cookies',
        description: 'Required for basic site functionality',
        duration: 'Session'
    },
    {
        name: 'Analytics Cookies',
        description: 'Help us understand how visitors use our site',
        duration: '30 days'
    },
    {
        name: 'Preference Cookies',
        description: 'Remember your settings and preferences',
        duration: '1 year'
    }
];

const words = ["Privacy", "Security", "Trust", "Protection"];

export default function PrivacyPage() {
    const { isDark } = useTheme();
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    const handleTypewriterComplete = useCallback(() => {
        setTimeout(() => {
            setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }, 1500);
    }, []);

    const textPrimary = isDark ? 'text-white' : 'text-slate-900';
    const textMuted = isDark ? 'text-gray-400' : 'text-slate-500';
    const cardBg = isDark ? 'bg-gray-900/30 border-gray-800 hover:border-purple-500/50' : 'bg-white/70 border-slate-200 hover:border-purple-300 shadow-sm';

    return (
        <div className={`min-h-screen pb-20 ${isDark ? 'bg-transparent' : 'bg-gradient-to-br from-slate-50 via-purple-50/30 to-blue-50/40'}`}>
            {/* Background with grid pattern */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                {isDark ? (
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage: "url('/herobackgrond.svg')",
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundColor: '#000'
                        }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-purple-900/10 to-black/60" />
                        <div className="absolute inset-0 opacity-30">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent animate-gradient-x" />
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/10 to-transparent animate-gradient-y" />
                        </div>
                    </div>
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
                            className="absolute inset-0 pointer-events-none"
                            style={{
                                backgroundImage: `linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px),
                                                linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)`,
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

            {/* Hero Section */}
            <section className="relative py-32 overflow-hidden z-10">
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                        className="text-center"
                    >
                        <motion.h1
                            variants={itemVariants}
                            className={`text-6xl md:text-8xl font-bold mb-8 tracking-tight leading-tight ${textPrimary}`}
                        >
                            Your Privacy, <br />
                            <span
                                className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 inline-block relative"
                                style={{
                                    textShadow: isDark ? '0 0 15px rgba(168, 85, 247, 0.6), 0 0 30px rgba(59, 130, 246, 0.4)' : 'none'
                                }}
                            >
                                <Typewriter
                                    key={currentWordIndex}
                                    text={words[currentWordIndex]}
                                    speed={70}
                                    onComplete={handleTypewriterComplete}
                                />
                            </span>
                        </motion.h1>
                        <motion.p variants={itemVariants} className={`text-xl md:text-2xl max-w-3xl mx-auto mb-12 leading-relaxed ${isDark ? 'text-gray-300 drop-shadow-[0_0_10px_rgba(168,85,247,0.3)]' : 'text-slate-600'}`}>
                            We respect your privacy and are committed to protecting your personal data.
                            Read on to learn how we collect, use, and safeguard your <span className={`font-semibold underline ${isDark ? 'text-white decoration-purple-500/50' : 'text-purple-700 decoration-purple-500/30'}`}>information</span>.
                        </motion.p>
                        <motion.div variants={itemVariants} className="flex justify-center space-x-6">
                            <Link
                                href="/contactus"
                                className="relative group overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-xl font-bold transition-all shadow-2xl hover:shadow-purple-500/40"
                            >
                                <span className="relative z-10">Contact Us</span>
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            </Link>
                            <Link
                                href="/terms"
                                className={`border-2 px-10 py-4 rounded-xl font-bold transition-all backdrop-blur-sm ${isDark ? 'border-gray-600 text-white hover:bg-white/10' : 'border-slate-300 text-slate-700 hover:bg-white/50'}`}
                            >
                                Terms of Service
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Privacy Stats */}
            <section className="py-16 relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-8"
                    >
                        {privacyStats.map((stat, index) => (
                            <div key={index} className={`text-center p-6 backdrop-blur-sm rounded-2xl border transition-all hover:scale-105 ${cardBg}`}>
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-full mb-4">
                                    <stat.icon className="w-8 h-8 text-blue-500" />
                                </div>
                                <div className={`text-4xl font-bold mb-2 ${textPrimary}`}>{stat.number}</div>
                                <div className={textMuted}>{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Privacy Sections Grid */}
            <section className="py-20 relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className={`text-4xl font-bold mb-4 ${textPrimary}`}>Privacy Policy</h2>
                        <p className={`max-w-2xl mx-auto ${textMuted}`}>
                            How we handle your personal information and protect your privacy
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {privacySections.map((section, index) => (
                            <motion.div
                                key={section.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className={`group p-8 rounded-2xl border transition-all hover:-translate-y-2 ${cardBg}`}
                            >
                                <div className="flex items-start space-x-4">
                                    <div className="flex-shrink-0">
                                        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-xl group-hover:scale-110 transition-transform">
                                            <section.icon className="w-6 h-6 text-purple-500" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className={`text-xl font-bold mb-3 ${textPrimary}`}>{section.title}</h3>
                                        <p className={`${textMuted} leading-relaxed`}>{section.content}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Cookie Policy Section */}
            <section className="py-20 relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className={`text-3xl font-bold mb-6 ${textPrimary}`}>Cookie Policy</h2>
                            <p className={`${textMuted} mb-8 leading-relaxed text-lg`}>
                                We use cookies to enhance your browsing experience and analyze our traffic.
                                You can choose to accept or decline cookies through your browser settings.
                            </p>

                            <div className="space-y-4">
                                {cookies.map((cookie, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className={`flex items-start space-x-4 p-5 rounded-2xl border transition-all ${cardBg}`}
                                    >
                                        <div className="mt-1 p-2 bg-blue-500/10 rounded-lg">
                                            <Cookie className="w-6 h-6 text-blue-500" />
                                        </div>
                                        <div>
                                            <h4 className={`font-bold text-lg ${textPrimary}`}>{cookie.name}</h4>
                                            <p className={`${textMuted} text-sm mb-2`}>{cookie.description}</p>
                                            <span className="px-2 py-1 bg-purple-500/10 text-purple-500 text-[10px] uppercase font-black tracking-widest rounded-md border border-purple-500/20">
                                                Duration: {cookie.duration}
                                            </span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative h-96 lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl border border-purple-500/20 group"
                        >
                            <Image
                                src="https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=1000&fit=crop"
                                alt="Privacy and security concept"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className={`absolute inset-0 bg-gradient-to-t ${isDark ? 'from-black/80' : 'from-slate-900/40'} via-transparent to-transparent`} />
                            <div className="absolute bottom-8 left-8 right-8">
                                <div className="p-6 backdrop-blur-md bg-white/10 rounded-2xl border border-white/20">
                                    <p className="text-white font-bold text-lg">"Privacy is not an option, it's a fundamental right."</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Your Rights Section */}
            <section className="py-20 relative z-10">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className={`backdrop-blur-md rounded-3xl border p-12 overflow-hidden relative group ${isDark ? 'bg-gray-900/40 border-gray-800 shadow-2xl shadow-purple-500/5' : 'bg-white/80 border-slate-200 shadow-xl'}`}
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 opacity-50" />
                        <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-3xl mb-8 group-hover:rotate-6 transition-transform`}>
                            <UserCheck className="w-10 h-10 text-blue-500" />
                        </div>
                        <h2 className={`text-3xl lg:text-4xl font-black mb-6 ${textPrimary}`}>Your Privacy Rights</h2>
                        <p className={`${textMuted} mb-10 leading-relaxed text-lg`}>
                            Depending on your location, you may have additional privacy rights under applicable laws,
                            including the right to access, correct, or delete your personal information.
                        </p>
                        <div className="grid sm:grid-cols-2 gap-6 mb-10">
                            <div className={`p-6 rounded-2xl border transition-all ${isDark ? 'bg-black/40 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                                <h3 className={`font-bold mb-3 ${textPrimary}`}>GDPR (EU Users)</h3>
                                <p className={`text-sm ${textMuted}`}>Right to access, rectification, erasure, and data portability</p>
                            </div>
                            <div className={`p-6 rounded-2xl border transition-all ${isDark ? 'bg-black/40 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                                <h3 className={`font-bold mb-3 ${textPrimary}`}>CCPA (California)</h3>
                                <p className={`text-sm ${textMuted}`}>Right to know, delete, and opt-out of data sales</p>
                            </div>
                        </div>
                        <Link
                            href="/contactus"
                            className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-2xl font-black transition-all hover:scale-105 shadow-xl shadow-purple-500/20 group"
                        >
                            Exercise Your Rights
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Footer Notice */}
            <section className="py-12 mt-20 border-t relative z-10 overflow-hidden ${isDark ? 'border-white/5' : 'border-slate-200'}">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex items-center space-x-6">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDark ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
                                <Mail className="w-6 h-6 text-purple-500" />
                            </div>
                            <div>
                                <p className={`text-xs font-black uppercase tracking-widest mb-1 ${textMuted}`}>Privacy Assistance</p>
                                <a href="mailto:privacy@brainblog.com" className={`text-lg font-bold hover:text-purple-500 transition-colors ${textPrimary}`}>
                                    privacy@brainblog.com
                                </a>
                            </div>
                        </div>
                        <div className="text-center md:text-right">
                            <p className={`text-sm font-medium ${textMuted}`}>
                                © {new Date().getFullYear()} Brain Blog. All rights reserved.
                            </p>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-500/50 mt-2">Industrial Security Verified</p>
                        </div>
                    </div>
                </div>
            </section>

            <style jsx global>{`
                @keyframes gradient-x {
                    0%, 100% { transform: translateX(-5%); opacity: 0.3; }
                    50% { transform: translateX(5%); opacity: 0.6; }
                }
                @keyframes gradient-y {
                    0%, 100% { transform: translateY(-5%); opacity: 0.3; }
                    50% { transform: translateY(5%); opacity: 0.6; }
                }
                .animate-gradient-x { animation: gradient-x 15s ease-in-out infinite; }
                .animate-gradient-y { animation: gradient-y 20s ease-in-out infinite; }
            `}</style>
        </div>
    );
}