// app/security/page.tsx
'use client';

import Link from 'next/link';
import { useState, useCallback } from 'react';
import { 
    Shield, 
    Lock, 
    Key, 
    Eye, 
    Fingerprint, 
    Server, 
    AlertTriangle,
    CheckCircle,
    RefreshCw,
    Users,
    Globe,
    MailWarning,
    Database,
    Cloud
} from 'lucide-react';
import { motion } from 'framer-motion';
import Typewriter from '@/components/ui/Typewriter';

const securityFeatures = [
    {
        id: 1,
        title: 'End-to-End Encryption',
        icon: Lock,
        description: 'All data transmitted between your device and our servers is encrypted using AES-256 protocol.',
        status: 'Active'
    },
    {
        id: 2,
        title: 'Two-Factor Authentication',
        icon: Fingerprint,
        description: 'Optional 2FA support for user accounts using authenticator apps or SMS verification.',
        status: 'Available'
    },
    {
        id: 3,
        title: 'DDoS Protection',
        icon: Shield,
        description: 'Enterprise-grade DDoS mitigation through Cloudflare to ensure 99.9% uptime.',
        status: 'Active'
    },
    {
        id: 4,
        title: 'Regular Security Audits',
        icon: Eye,
        description: 'Weekly automated scans and quarterly third-party penetration testing.',
        status: 'Ongoing'
    },
    {
        id: 5,
        title: 'Secure Authentication',
        icon: Key,
        description: 'OAuth 2.0 and JWT-based authentication with automatic session management.',
        status: 'Active'
    },
    {
        id: 6,
        title: 'Data Backup & Recovery',
        icon: Server,
        description: 'Automated daily backups with geo-redundant storage and 30-day retention.',
        status: 'Active'
    }
];

const securityStats = [
    { number: '99.9%', label: 'Uptime SLA', icon: Server },
    { number: '24/7', label: 'Threat Monitoring', icon: Eye },
    { number: '256-bit', label: 'Encryption', icon: Lock },
    { number: '0', label: 'Data Breaches', icon: Shield }
];

const securityCertifications = [
    {
        name: 'SOC 2 Type II',
        description: 'Compliant with Trust Services Criteria',
        icon: CheckCircle
    },
    {
        name: 'GDPR Compliant',
        description: 'European data protection standards',
        icon: Globe
    },
    {
        name: 'ISO 27001',
        description: 'Information security management',
        icon: Database
    },
    {
        name: 'PCI DSS',
        description: 'Payment card industry compliant',
        icon: Cloud
    }
];

const securityPractices = [
    {
        title: 'Regular Patching',
        description: 'Automated security updates within 24 hours of release',
        icon: RefreshCw
    },
    {
        title: 'Access Control',
        description: 'Strict role-based access control (RBAC) for all systems',
        icon: Users
    },
    {
        title: 'Vulnerability Scanning',
        description: 'Daily automated scans for known vulnerabilities',
        icon: AlertTriangle
    },
    {
        title: 'Incident Response',
        description: '24/7 security team with <15min response time',
        icon: MailWarning
    }
];

const words = ["Security", "Privacy", "Trust", "Protection"];

export default function SecurityPage() {
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
                            Your Security, <br />
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
                            We implement industry-leading security measures to protect your data and privacy. 
                            Our <span className="text-white font-semibold underline decoration-purple-500/50">multi-layered security approach</span> ensures your information remains safe and confidential.
                        </motion.p>
                        <motion.div variants={itemVariants} className="flex justify-center space-x-6">
                            <Link
                                href="/security/report"
                                className="relative group overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-xl font-bold transition-all shadow-2xl hover:shadow-purple-500/40"
                            >
                                <span className="relative z-10">Report Vulnerability</span>
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

            {/* Security Stats Section */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-8"
                    >
                        {securityStats.map((stat, index) => (
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

            {/* Security Features Grid */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-white mb-4">Security Features</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Comprehensive security measures protecting your data at every layer
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {securityFeatures.map((feature, index) => (
                            <motion.div
                                key={feature.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group bg-gray-900/30 p-8 rounded-2xl border border-gray-800 hover:border-blue-500/50 transition-all hover:-translate-y-2"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-xl group-hover:scale-110 transition-transform">
                                        <feature.icon className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <span className="px-3 py-1 bg-green-900/30 text-green-400 text-xs font-semibold rounded-full border border-green-500/30">
                                        {feature.status}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Certifications Section */}
            <section className="py-20 bg-gradient-to-b from-transparent to-gray-900/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-white mb-4">Security Certifications</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Independently verified compliance with global security standards
                        </p>
                    </motion.div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {securityCertifications.map((cert, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="text-center p-6 bg-gray-900/30 rounded-2xl border border-gray-800 hover:border-purple-500/30 transition-colors"
                            >
                                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-900/30 to-blue-900/30 rounded-full mb-4">
                                    <cert.icon className="w-10 h-10 text-green-400" />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">{cert.name}</h3>
                                <p className="text-gray-400 text-sm">{cert.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Security Practices */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className="text-4xl font-bold text-white mb-6">Our Security Practices</h2>
                            <p className="text-gray-300 mb-8 leading-relaxed">
                                We follow industry best practices and maintain rigorous security protocols 
                                to ensure your data remains protected against evolving threats.
                            </p>
                            <div className="space-y-6">
                                {securityPractices.map((practice, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className="flex items-start space-x-4"
                                    >
                                        <div className="flex-shrink-0">
                                            <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-lg">
                                                <practice.icon className="w-5 h-5 text-blue-400" />
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-white mb-1">{practice.title}</h3>
                                            <p className="text-gray-400 text-sm">{practice.description}</p>
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
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20"></div>
                            <img 
                                src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=600&fit=crop"
                                alt="Cybersecurity concept"
                                className="w-full h-full object-cover opacity-80"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
                            <div className="absolute bottom-0 left-0 right-0 p-8">
                                <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
                                    <h4 className="text-white font-bold mb-2">Security First Approach</h4>
                                    <p className="text-gray-300 text-sm">
                                        We prioritize security in every decision, from infrastructure to code deployment.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Responsible Disclosure */}
            <section className="py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-md"></div>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-900/50 to-red-900/50 rounded-full mb-6">
                        <AlertTriangle className="w-10 h-10 text-yellow-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Responsible Disclosure Program
                    </h2>
                    <p className="text-gray-300 mb-8 text-lg">
                        If you discover a security vulnerability, we encourage you to report it responsibly. 
                        We offer bug bounties for qualifying submissions and guarantee no legal action against 
                        ethical researchers who follow our disclosure guidelines.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link
                            href="/security/disclosure"
                            className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold transition-all hover:shadow-purple-500/40"
                        >
                            Disclosure Guidelines
                            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </Link>
                        <Link
                            href="/security/report"
                            className="inline-flex items-center justify-center border-2 border-gray-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/10 transition-all"
                        >
                            Report a Vulnerability
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer Note */}
            <section className="py-12 border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div>
                            <h3 className="text-white font-bold mb-2">Security Contact</h3>
                            <p className="text-gray-400 text-sm">
                                For security-related inquiries, please contact our security team at{' '}
                                <a href="mailto:security@yourblog.com" className="text-blue-400 hover:underline">
                                    security@yourblog.com
                                </a>
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-gray-500 text-sm">
                                Last Security Audit: January 15, 2024 | Next Audit: April 15, 2024
                            </p>
                            <p className="text-gray-600 text-xs mt-2">
                                PGP Key Fingerprint: 3A4B 5C6D 7E8F 9G0H 1I2J 3K4L 5M6N 7O8P
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}