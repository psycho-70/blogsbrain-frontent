// app/privacy/page.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useCallback } from 'react';
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
    Share2
} from 'lucide-react';
import { motion } from 'framer-motion';
import Typewriter from '@/components/ui/Typewriter';

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
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    
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

    return (
        <div className="min-h-screen bg-transparent">
            {/* Hero Section - Same design as About page */}
            <section
                className="relative py-32 overflow-hidden"
                style={{
                    backgroundImage: "url('/herobackgrond.svg')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundColor: '#000'
                }}
            >
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-purple-900/10 to-black/60" />
                    <div className="absolute inset-0 opacity-30">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent animate-gradient-x" />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/10 to-transparent animate-gradient-y" />
                    </div>
                    <div
                        className="absolute inset-x-0 bottom-0 h-full opacity-40 mix-blend-screen"
                        style={{
                            backgroundImage: "url('/bottomsection.svg')",
                            backgroundSize: 'cover',
                            backgroundPosition: 'bottom',
                            backgroundRepeat: 'no-repeat'
                        }}
                    />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                        className="text-center"
                    >
                        <motion.h1
                            variants={itemVariants}
                            className="text-6xl md:text-8xl font-bold text-white mb-8 tracking-tight leading-tight"
                        >
                            Your Privacy, <br />
                            <span
                                className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 inline-block relative"
                                style={{
                                    textShadow: '0 0 15px rgba(168, 85, 247, 0.6), 0 0 30px rgba(59, 130, 246, 0.4)'
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
                        <motion.p variants={itemVariants} className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
                            We respect your privacy and are committed to protecting your personal data. 
                            Read on to learn how we collect, use, and safeguard your <span className="text-white font-semibold underline decoration-purple-500/50">information</span>.
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
                                className="border-2 border-gray-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-white/10 transition-all backdrop-blur-sm"
                            >
                                Terms of Service
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>

                <style jsx>{`
                    @keyframes gradient-x {
                        0%, 100% { transform: translateX(-50%); }
                        50% { transform: translateX(50%); }
                    }
                    @keyframes gradient-y {
                        0%, 100% { transform: translateY(-50%); }
                        50% { transform: translateY(50%); }
                    }
                    .animate-gradient-x { animation: gradient-x 15s ease-in-out infinite; }
                    .animate-gradient-y { animation: gradient-y 20s ease-in-out infinite; }
                `}</style>
            </section>

            {/* Privacy Stats */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-8"
                    >
                        {privacyStats.map((stat, index) => (
                            <div key={index} className="text-center p-6 bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 hover:border-purple-500/30 transition-colors">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-full mb-4">
                                    <stat.icon className="w-8 h-8 text-blue-400" />
                                </div>
                                <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
                                <div className="text-gray-400">{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Last Updated */}
            <section className="py-8">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <div className="inline-flex items-center space-x-2 bg-gray-900/30 px-6 py-3 rounded-full border border-gray-800">
                        <FileText className="w-5 h-5 text-blue-400" />
                        <span className="text-gray-300">Last Updated: January 15, 2024</span>
                    </div>
                </div>
            </section>

            {/* Privacy Sections Grid */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-white mb-4">Privacy Policy</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
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
                                className="group bg-gray-900/30 p-8 rounded-2xl border border-gray-800 hover:border-blue-500/50 transition-all hover:-translate-y-2"
                            >
                                <div className="flex items-start space-x-4">
                                    <div className="flex-shrink-0">
                                        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-xl group-hover:scale-110 transition-transform">
                                            <section.icon className="w-6 h-6 text-blue-400" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-3">{section.title}</h3>
                                        <p className="text-gray-400 leading-relaxed">{section.content}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Cookie Policy Section */}
            <section className="py-20 bg-gradient-to-b from-transparent to-gray-900/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className="text-3xl font-bold text-white mb-6">Cookie Policy</h2>
                            <p className="text-gray-300 mb-6 leading-relaxed">
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
                                        className="flex items-start space-x-3 bg-gray-900/30 p-4 rounded-xl border border-gray-800"
                                    >
                                        <Cookie className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                                        <div>
                                            <h4 className="text-white font-semibold">{cookie.name}</h4>
                                            <p className="text-gray-400 text-sm">{cookie.description}</p>
                                            <p className="text-xs text-gray-500 mt-1">Duration: {cookie.duration}</p>
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
                            className="relative h-96 rounded-2xl overflow-hidden shadow-2xl border border-gray-800"
                        >
                            <Image
                                src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop"
                                alt="Privacy and security concept"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Your Rights Section */}
            <section className="py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-br from-gray-900/80 to-gray-900/40 backdrop-blur-sm rounded-3xl border border-gray-800 p-10"
                    >
                        <UserCheck className="w-16 h-16 text-blue-400 mx-auto mb-6" />
                        <h2 className="text-3xl font-bold text-white mb-4">Your Privacy Rights</h2>
                        <p className="text-gray-300 mb-8 leading-relaxed">
                            Depending on your location, you may have additional privacy rights under applicable laws, 
                            including the right to access, correct, or delete your personal information.
                        </p>
                        <div className="grid sm:grid-cols-2 gap-4 mb-8">
                            <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
                                <h3 className="text-white font-semibold mb-2">GDPR (EU Users)</h3>
                                <p className="text-gray-400 text-sm">Right to access, rectification, erasure, and data portability</p>
                            </div>
                            <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
                                <h3 className="text-white font-semibold mb-2">CCPA (California)</h3>
                                <p className="text-gray-400 text-sm">Right to know, delete, and opt-out of data sales</p>
                            </div>
                        </div>
                        <Link
                            href="/contactus"
                            className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold transition-all hover:shadow-purple-500/40"
                        >
                            Exercise Your Rights
                            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-12 border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center space-x-4">
                            <Mail className="w-5 h-5 text-blue-400" />
                            <span className="text-gray-300">Privacy Questions? Email us at:</span>
                            <a href="mailto:privacy@yourblog.com" className="text-blue-400 hover:underline">
                                privacy@yourblog.com
                            </a>
                        </div>
                        <p className="text-gray-500 text-sm">
                            © 2024 Your Blog Name. All rights reserved.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}