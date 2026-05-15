// app/terms/page.tsx
'use client';

import Link from 'next/link';
import { useState, useCallback, useEffect } from 'react';
import {
    Shield,
    FileText,
    Scale,
    Lock,
    Globe,
    AlertCircle,
    BookOpen,
    Eye,
    Mail,
    Award,
    Calendar,
    ArrowRight,
    Gavel,
    CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Typewriter from '@/components/ui/Typewriter';
import { useTheme } from '@/contexts/ThemeContext';

const termsSections = [
    {
        id: 1,
        title: 'Acceptance of Terms',
        icon: FileText,
        content: 'By accessing and using this blog website, you accept and agree to be bound by the terms and conditions outlined herein. If you do not agree to these terms, please refrain from using our services. These terms constitute a legally binding agreement between you and our blog platform.'
    },
    {
        id: 2,
        title: 'User Content & Conduct',
        icon: BookOpen,
        content: 'Users are solely responsible for the content they post, including comments and contributions. We reserve the right to moderate, edit, or remove any content that violates our guidelines, including but not limited to hate speech, harassment, spam, or copyright infringement. Users must maintain respectful discourse and adhere to community standards.'
    },
    {
        id: 3,
        title: 'Intellectual Property Rights',
        icon: Scale,
        content: 'All content published on this blog, including articles, images, graphics, and logos, is protected by copyright and intellectual property laws. Users may share content for personal, non-commercial use with proper attribution. Unauthorized reproduction or distribution without explicit permission is prohibited.'
    },
    {
        id: 4,
        title: 'Privacy & Data Protection',
        icon: Lock,
        content: 'We are committed to protecting your privacy. Our data collection and processing practices are outlined in our Privacy Policy. By using our blog, you consent to the collection and use of information as described. We implement industry-standard security measures to protect your data.'
    },
    {
        id: 5,
        title: 'Third-Party Links & Content',
        icon: Globe,
        content: 'Our blog may contain links to third-party websites or services. We are not responsible for the content, privacy policies, or practices of any third-party sites. Users access external links at their own risk and should review the terms and policies of those websites.'
    },
    {
        id: 6,
        title: 'Disclaimer of Warranties',
        icon: AlertCircle,
        content: 'The content on this blog is provided "as is" without warranties of any kind, either express or implied. We do not guarantee the accuracy, completeness, or reliability of any information presented. Readers should verify information independently before making decisions based on our content.'
    },
    {
        id: 7,
        title: 'Limitation of Liability',
        icon: Shield,
        content: 'To the fullest extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of or inability to use our blog. This includes but is not limited to loss of data, profits, or business opportunities.'
    },
    {
        id: 8,
        title: 'Modifications to Terms',
        icon: Award,
        content: 'We reserve the right to modify these terms at any time without prior notice. Continued use of the blog after changes constitutes acceptance of the modified terms. Users are encouraged to review this page periodically for updates.'
    }
];

const keyPoints = [
    {
        icon: Eye,
        title: 'Transparency',
        description: 'Clear guidelines on how our blog operates'
    },
    {
        icon: Mail,
        title: 'Communication',
        description: 'How we interact with our community'
    },
    {
        icon: Calendar,
        title: 'Last Updated',
        description: 'January 15, 2024'
    }
];

const words = ["Transparency", "Trust", "Fairness", "Respect"];

export default function TermsPage() {
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
    const cardBg = isDark ? 'bg-gray-900/30 border-gray-800 hover:border-blue-500/50' : 'bg-white/70 border-slate-200 hover:border-blue-300 shadow-sm';

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
                            Terms & <br />
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
                            Please read these terms carefully before using our blog. By accessing our platform, you agree to be bound by these <span className={`font-semibold underline ${isDark ? 'text-white decoration-purple-500/50' : 'text-purple-700 decoration-purple-500/30'}`}>conditions</span> and our community guidelines.
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
                                href="/privacy"
                                className={`border-2 px-10 py-4 rounded-xl font-bold transition-all backdrop-blur-sm ${isDark ? 'border-gray-600 text-white hover:bg-white/10' : 'border-slate-300 text-slate-700 hover:bg-white/50'}`}
                            >
                                Privacy Policy
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Key Points Section */}
            <section className="py-16 relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    >
                        {keyPoints.map((point, index) => (
                            <div key={index} className={`text-center p-8 backdrop-blur-sm rounded-2xl border transition-all hover:scale-105 ${cardBg}`}>
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-full mb-4">
                                    <point.icon className="w-8 h-8 text-blue-500" />
                                </div>
                                <div className={`text-xl font-black mb-2 ${textPrimary}`}>{point.title}</div>
                                <div className={textMuted}>{point.description}</div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Terms Sections */}
            <section className="py-20 relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className={`text-4xl font-black mb-4 ${textPrimary}`}>Terms and Conditions</h2>
                        <p className={`max-w-2xl mx-auto ${textMuted}`}>
                            The following terms govern your use of our blog platform and services
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {termsSections.map((section, index) => (
                            <motion.div
                                key={section.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className={`group p-8 rounded-2xl border transition-all hover:-translate-y-2 ${cardBg}`}
                            >
                                <div className="flex items-start space-x-6">
                                    <div className="flex-shrink-0">
                                        <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-2xl group-hover:scale-110 transition-transform">
                                            <section.icon className="w-7 h-7 text-blue-500" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className={`text-xl font-black mb-4 ${textPrimary}`}>{section.title}</h3>
                                        <p className={`${textMuted} leading-relaxed font-medium`}>{section.content}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Important Notice Section */}
            <section className="py-20 relative z-10">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className={`backdrop-blur-md rounded-3xl border p-12 text-center relative overflow-hidden group ${isDark ? 'bg-gray-900/40 border-gray-800 shadow-2xl' : 'bg-white/80 border-slate-200 shadow-xl'}`}
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-500" />
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-full mb-8 group-hover:scale-110 transition-transform duration-500">
                            <Gavel className="w-12 h-12 text-yellow-500" />
                        </div>
                        <h2 className={`text-3xl lg:text-4xl font-black mb-6 ${textPrimary}`}>Important Legal Notice</h2>
                        <p className={`${textMuted} mb-10 leading-relaxed text-lg`}>
                            These terms constitute a legally binding agreement between you and our blog platform.
                            If you have any questions or concerns about these terms, please contact our legal team
                            before proceeding to use our services.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-6">
                            <Link
                                href="/contactus"
                                className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-2xl font-black transition-all hover:scale-105 shadow-xl shadow-purple-500/20 group"
                            >
                                Contact Legal Team
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                href="/"
                                className={`inline-flex items-center justify-center px-10 py-4 rounded-2xl font-black border-2 transition-all hover:bg-white/10 ${isDark ? 'border-gray-700 text-white' : 'border-slate-300 text-slate-700'}`}
                            >
                                Return to Home
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Bottom Compliance Section */}
            <section className="py-12 mt-20 border-t relative z-10 ${isDark ? 'border-white/5' : 'border-slate-200'}">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div className="flex items-center space-x-6">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isDark ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
                                <CheckCircle2 className="w-8 h-8 text-green-500" />
                            </div>
                            <div>
                                <p className={`text-xs font-black uppercase tracking-widest mb-1 ${textMuted}`}>Platform Status</p>
                                <p className={`text-xl font-black ${textPrimary}`}>Legally Compliant</p>
                            </div>
                        </div>
                        <div className="text-center md:text-right">
                            <p className={`${textMuted} text-sm font-medium`}>
                                Last Review: January 15, 2024
                            </p>
                            <div className="flex items-center justify-center md:justify-end gap-4 mt-2">
                                <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded bg-blue-500/10 text-blue-500 border border-blue-500/20`}>v2.0 Revision</span>
                                <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded bg-purple-500/10 text-purple-500 border border-purple-500/20`}>Public Release</span>
                            </div>
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