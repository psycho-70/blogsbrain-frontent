// app/terms/page.tsx
'use client';

import Link from 'next/link';
import { useState, useCallback } from 'react';
import { Shield, FileText, Scale, Lock, Globe, AlertCircle, BookOpen, Eye, Mail, Award, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import Typewriter from '@/components/ui/Typewriter';

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
            {/* Hero Section */}
            <section
                className="relative py-32 overflow-hidden"
                style={{
                    backgroundImage: "url('/herobackgrond.svg')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundColor: '#000'
                }}
            >
                {/* Animated Background Layers */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-purple-900/10 to-black/60" />
                    <div className="absolute inset-0 opacity-30">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent animate-gradient-x" />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/10 to-transparent animate-gradient-y" />
                    </div>
                    {/* Bottom section overlay */}
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
                            Terms & <br />
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
                        <motion.p variants={itemVariants} className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed drop-shadow-[0_0_10px_rgba(168,85,247,0.3)]">
                            Please read these terms carefully before using our blog. By accessing our platform, you agree to be bound by these <span className="text-white font-semibold underline decoration-purple-500/50">conditions</span> and our community guidelines.
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
                                className="border-2 border-gray-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-white/10 transition-all backdrop-blur-sm"
                            >
                                Privacy Policy
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

            {/* Key Points Section */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    >
                        {keyPoints.map((point, index) => (
                            <div key={index} className="text-center p-6 bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 hover:border-purple-500/30 transition-colors">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-full mb-4">
                                    <point.icon className="w-8 h-8 text-blue-400" />
                                </div>
                                <div className="text-xl font-bold text-white mb-2">{point.title}</div>
                                <div className="text-gray-400">{point.description}</div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Terms Sections */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-white mb-4">Terms and Conditions</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
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

            {/* Important Notice Section */}
            <section className="py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-br from-gray-900/80 to-gray-900/40 backdrop-blur-sm rounded-3xl border border-gray-800 p-10 text-center"
                    >
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-900/50 to-orange-900/50 rounded-full mb-6">
                            <AlertCircle className="w-10 h-10 text-yellow-400" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-4">Important Legal Notice</h2>
                        <p className="text-gray-300 mb-6 leading-relaxed">
                            These terms constitute a legally binding agreement between you and our blog platform. 
                            If you have any questions or concerns about these terms, please contact our legal team 
                            before proceeding to use our services. We recommend consulting with legal counsel if 
                            you need clarification on any of these provisions.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link
                                href="/contactus"
                                className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold transition-all hover:shadow-purple-500/40"
                            >
                                Contact Legal Team
                                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </Link>
                            <Link
                                href="/"
                                className="inline-flex items-center justify-center border-2 border-gray-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/10 transition-all"
                            >
                                Return to Home
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

          
        </div>
    );
}