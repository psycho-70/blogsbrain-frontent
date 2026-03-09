// app/about/page.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useCallback } from 'react';
import { CheckCircle, Users, Trophy, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import Typewriter from '@/components/ui/Typewriter';

const teamMembers = [
    {
        id: 1,
        name: 'Alex Johnson',
        role: 'CEO & Founder',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
        bio: '15+ years in tech industry',
        social: { twitter: '#', linkedin: '#' }
    },
    {
        id: 2,
        name: 'Sarah Chen',
        role: 'Chief Editor',
        image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop',
        bio: 'Former journalist at The Times',
        social: { twitter: '#', linkedin: '#' }
    },
    {
        id: 3,
        name: 'Marcus Rodriguez',
        role: 'Tech Lead',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
        bio: 'Ex-Google engineer',
        social: { twitter: '#', linkedin: '#' }
    },
    {
        id: 4,
        name: 'Priya Patel',
        role: 'Content Director',
        image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop',
        bio: 'Award-winning writer',
        social: { twitter: '#', linkedin: '#' }
    }
];

const stats = [
    { number: '50K+', label: 'Monthly Readers', icon: Users },
    { number: '5K+', label: 'Published Articles', icon: Trophy },
    { number: '100+', label: 'Expert Writers', icon: Users },
    { number: '98%', label: 'Reader Satisfaction', icon: Heart }
];

const values = [
    {
        title: 'Quality Over Quantity',
        description: 'Every piece of content is meticulously researched and reviewed by industry experts.'
    },
    {
        title: 'Authenticity',
        description: 'We believe in honest, unbiased content that truly helps our readers.'
    },
    {
        title: 'Innovation',
        description: 'Constantly exploring new formats and technologies to enhance storytelling.'
    },
    {
        title: 'Community First',
        description: 'Our readers are at the heart of everything we create.'
    }
];

const words = ["Vision", "Mission", "Growth", "Community"];

export default function AboutPage() {
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
                            Our Story: Shaping the <br />
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
                            Founded in 2015, we've grown from a small blog to one of the most trusted <span className="text-white font-semibold underline decoration-purple-500/50">content platforms</span>, reaching millions worldwide.
                        </motion.p>
                        <motion.div variants={itemVariants} className="flex justify-center space-x-6">
                            <Link
                                href="/contactus"
                                className="relative group overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-xl font-bold transition-all shadow-2xl hover:shadow-purple-500/40"
                            >
                                <span className="relative z-10">Join Our Community</span>
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            </Link>
                            <Link
                                href="#team"
                                className="border-2 border-gray-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-white/10 transition-all backdrop-blur-sm"
                            >
                                Meet Our Team
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

            {/* Stats Section */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-8"
                    >
                        {stats.map((stat, index) => (
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

            {/* Mission & Vision */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
                            <p className="text-gray-300 mb-6 leading-relaxed">
                                To empower individuals and businesses with knowledge that inspires action and drives positive change.
                                We believe that access to quality information should be democratized and available to everyone.
                            </p>
                            <ul className="space-y-4">
                                {values.map((value, index) => (
                                    <motion.li
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className="flex items-start"
                                    >
                                        <CheckCircle className="w-6 h-6 text-green-400 mr-3 mt-1 flex-shrink-0" />
                                        <div>
                                            <h3 className="font-semibold text-white">{value.title}</h3>
                                            <p className="text-gray-400 text-sm">{value.description}</p>
                                        </div>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative h-96 rounded-2xl overflow-hidden shadow-2xl border border-gray-800"
                        >
                            <Image
                                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop"
                                alt="Our team collaborating"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section id="team" className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-white mb-4">Meet Our Team</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            A diverse group of passionate professionals dedicated to delivering exceptional content
                        </p>
                    </motion.div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {teamMembers.map((member, index) => (
                            <motion.div
                                key={member.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group text-center bg-gray-900/30 p-6 rounded-2xl border border-gray-800 hover:border-blue-500/50 transition-all hover:-translate-y-2"
                            >
                                <div className="relative w-40 h-40 mx-auto mb-6 rounded-full overflow-hidden ring-4 ring-gray-800 group-hover:ring-blue-500 shadow-lg transition-colors">
                                    <Image
                                        src={member.image}
                                        alt={member.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                                <div className="text-blue-400 font-semibold mb-2">{member.role}</div>
                                <p className="text-gray-400 mb-4 text-sm">{member.bio}</p>
                                <div className="flex justify-center space-x-4">
                                    <a href={member.social.twitter} className="text-gray-500 hover:text-blue-400 transition-colors">
                                        <span className="sr-only">Twitter</span>
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                        </svg>
                                    </a>
                                    <a href={member.social.linkedin} className="text-gray-500 hover:text-blue-600 transition-colors">
                                        <span className="sr-only">LinkedIn</span>
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                        </svg>
                                    </a>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/50 to-purple-900/50 backdrop-blur-md"></div>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <h2 className="text-3xl font-bold text-white mb-6">
                        Ready to Join Our Journey?
                    </h2>
                    <p className="text-gray-300 mb-8 text-lg">
                        Whether you want to contribute, collaborate, or just learn more about what we do,
                        we'd love to hear from you.
                    </p>
                    <Link
                        href="/contactus"
                        className="inline-flex items-center bg-white text-blue-900 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-colors text-lg"
                    >
                        Get In Touch
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </Link>
                </div>
            </section>
        </div>
    );
}