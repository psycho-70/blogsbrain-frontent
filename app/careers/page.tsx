// app/careers/page.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useCallback } from 'react';
import { 
    Briefcase, 
    MapPin, 
    Clock, 
    DollarSign,
    Heart,
    Users,
    Trophy,
    Coffee,
    GraduationCap,
    Globe,
    Zap,
    Gift,
    Calendar
} from 'lucide-react';
import { motion } from 'framer-motion';
import Typewriter from '@/components/ui/Typewriter';

const jobOpenings = [
    {
        id: 1,
        title: 'Senior Content Writer',
        department: 'Editorial',
        location: 'Remote',
        type: 'Full-time',
        salary: '$60k - $80k',
        description: 'Create engaging, well-researched content for our tech blog. 3+ years experience required.',
        requirements: ['3+ years writing experience', 'Tech background', 'SEO knowledge'],
        posted: '2 days ago'
    },
    {
        id: 2,
        title: 'Frontend Developer',
        department: 'Engineering',
        location: 'San Francisco, CA',
        type: 'Full-time',
        salary: '$100k - $130k',
        description: 'Build and maintain our Next.js blog platform with a focus on performance and user experience.',
        requirements: ['React/Next.js expertise', 'TypeScript', 'Tailwind CSS'],
        posted: '1 week ago'
    },
    {
        id: 3,
        title: 'SEO Specialist',
        department: 'Marketing',
        location: 'Remote',
        type: 'Full-time',
        salary: '$55k - $75k',
        description: 'Optimize our content for search engines and drive organic traffic growth.',
        requirements: ['SEO tools experience', 'Analytics background', 'Content strategy'],
        posted: '3 days ago'
    },
    {
        id: 4,
        title: 'Community Manager',
        department: 'Community',
        location: 'New York, NY',
        type: 'Part-time',
        salary: '$35k - $45k',
        description: 'Engage with our readers, moderate comments, and build community relationships.',
        requirements: ['Social media skills', 'Excellent communication', 'Community building'],
        posted: '5 days ago'
    },
    {
        id: 5,
        title: 'Graphic Designer',
        department: 'Creative',
        location: 'Remote',
        type: 'Full-time',
        salary: '$50k - $70k',
        description: 'Create stunning visuals, infographics, and social media assets for our blog.',
        requirements: ['Adobe Creative Suite', 'Portfolio', 'Typography skills'],
        posted: '1 week ago'
    },
    {
        id: 6,
        title: 'Data Analyst',
        department: 'Analytics',
        location: 'Austin, TX',
        type: 'Full-time',
        salary: '$70k - $90k',
        description: 'Analyze reader behavior, content performance, and provide actionable insights.',
        requirements: ['SQL', 'Data visualization', 'Google Analytics'],
        posted: '2 weeks ago'
    }
];

const departments = ['All', 'Editorial', 'Engineering', 'Marketing', 'Community', 'Creative', 'Analytics'];

const benefits = [
    {
        icon: Heart,
        title: 'Health & Wellness',
        description: 'Comprehensive health, dental, and vision insurance'
    },
    {
        icon: Coffee,
        title: 'Work-Life Balance',
        description: 'Flexible hours and remote work options'
    },
    {
        icon: GraduationCap,
        title: 'Learning Budget',
        description: '$1,000/year for courses and conferences'
    },
    {
        icon: Trophy,
        title: '401(k) Matching',
        description: '4% match to help secure your future'
    },
    {
        icon: Gift,
        title: 'Perks & Swag',
        description: 'Home office stipend and company merch'
    },
    {
        icon: Calendar,
        title: 'Unlimited PTO',
        description: 'Take time when you need it'
    }
];

const culture = [
    {
        number: '15+',
        label: 'Team Members',
        icon: Users
    },
    {
        number: '8',
        label: 'Countries Represented',
        icon: Globe
    },
    {
        number: '4.9',
        label: 'Glassdoor Rating',
        icon: Trophy
    },
    {
        number: '100%',
        label: 'Remote-Friendly',
        icon: Zap
    }
];

const words = ["Join", "Grow", "Create", "Inspire"];

export default function CareersPage() {
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [selectedDepartment, setSelectedDepartment] = useState('All');
    
    const filteredJobs = selectedDepartment === 'All' 
        ? jobOpenings 
        : jobOpenings.filter(job => job.department === selectedDepartment);

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
                            Come <br />
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
                            <br /> With Us
                        </motion.h1>
                        <motion.p variants={itemVariants} className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
                            Join a team of passionate creators, thinkers, and innovators. 
                            Help us shape the future of <span className="text-white font-semibold underline decoration-purple-500/50">digital storytelling</span>.
                        </motion.p>
                        <motion.div variants={itemVariants} className="flex justify-center space-x-6">
                            <Link
                                href="#openings"
                                className="relative group overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-xl font-bold transition-all shadow-2xl hover:shadow-purple-500/40"
                            >
                                <span className="relative z-10">View Openings</span>
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            </Link>
                            <Link
                                href="/about#team"
                                className="border-2 border-gray-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-white/10 transition-all backdrop-blur-sm"
                            >
                                Meet the Team
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

            {/* Culture Stats */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-8"
                    >
                        {culture.map((stat, index) => (
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

            {/* Why Join Us */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-white mb-4">Why Join Us?</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            We're building more than just a blog - we're building a community
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {benefits.map((benefit, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group bg-gray-900/30 p-8 rounded-2xl border border-gray-800 hover:border-blue-500/50 transition-all hover:-translate-y-2"
                            >
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-xl mb-6 group-hover:scale-110 transition-transform">
                                    <benefit.icon className="w-8 h-8 text-blue-400" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
                                <p className="text-gray-400">{benefit.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Life at Company Section */}
            <section className="py-20 bg-gradient-to-b from-transparent to-gray-900/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className="text-3xl font-bold text-white mb-6">Life at BlogName</h2>
                            <p className="text-gray-300 mb-6 leading-relaxed">
                                We believe in fostering a culture of creativity, collaboration, and continuous learning. 
                                Whether you're working from our office or remotely, you'll be part of a supportive team 
                                that values your unique perspective.
                            </p>
                            
                            <div className="space-y-4">
                                <div className="flex items-start space-x-3">
                                    <Users className="w-5 h-5 text-blue-400 mt-1" />
                                    <div>
                                        <h4 className="text-white font-semibold">Diverse & Inclusive</h4>
                                        <p className="text-gray-400 text-sm">Team members from 8+ countries, all voices matter</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <Zap className="w-5 h-5 text-blue-400 mt-1" />
                                    <div>
                                        <h4 className="text-white font-semibold">Fast-Paced Growth</h4>
                                        <p className="text-gray-400 text-sm">Double-digit growth year over year</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <Heart className="w-5 h-5 text-blue-400 mt-1" />
                                    <div>
                                        <h4 className="text-white font-semibold">Passionate Team</h4>
                                        <p className="text-gray-400 text-sm">We love what we do and it shows in our work</p>
                                    </div>
                                </div>
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
                                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop"
                                alt="Team collaboration"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Job Openings */}
            <section id="openings" className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-white mb-4">Open Positions</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Join our growing team and help us build something amazing
                        </p>
                    </motion.div>

                    {/* Department Filters */}
                    <div className="flex flex-wrap gap-4 justify-center mb-12">
                        {departments.map(dept => (
                            <button
                                key={dept}
                                onClick={() => setSelectedDepartment(dept)}
                                className={`px-6 py-2 rounded-full transition-all ${
                                    selectedDepartment === dept
                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                                        : 'bg-gray-900/50 text-gray-400 hover:text-white border border-gray-800'
                                }`}
                            >
                                {dept}
                            </button>
                        ))}
                    </div>

                    {/* Jobs Grid */}
                    <div className="grid gap-6">
                        {filteredJobs.map((job, index) => (
                            <motion.div
                                key={job.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group bg-gray-900/30 p-6 rounded-2xl border border-gray-800 hover:border-blue-500/50 transition-all"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                    <div>
                                        <div className="flex items-center space-x-3 mb-2">
                                            <h3 className="text-xl font-bold text-white">{job.title}</h3>
                                            <span className="px-3 py-1 bg-blue-900/30 text-blue-400 text-xs rounded-full border border-blue-500/30">
                                                {job.department}
                                            </span>
                                        </div>
                                        
                                        <div className="flex flex-wrap gap-4 mb-3">
                                            <div className="flex items-center text-gray-400 text-sm">
                                                <MapPin className="w-4 h-4 mr-1" />
                                                {job.location}
                                            </div>
                                            <div className="flex items-center text-gray-400 text-sm">
                                                <Clock className="w-4 h-4 mr-1" />
                                                {job.type}
                                            </div>
                                            <div className="flex items-center text-gray-400 text-sm">
                                                <DollarSign className="w-4 h-4 mr-1" />
                                                {job.salary}
                                            </div>
                                            <div className="flex items-center text-gray-400 text-sm">
                                                <Calendar className="w-4 h-4 mr-1" />
                                                Posted: {job.posted}
                                            </div>
                                        </div>
                                        
                                        <p className="text-gray-400 mb-3">{job.description}</p>
                                        
                                        <div className="flex flex-wrap gap-2">
                                            {job.requirements.map((req, i) => (
                                                <span key={i} className="px-3 py-1 bg-gray-800 text-gray-300 text-xs rounded-full">
                                                    {req}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <div className="lg:text-right">
                                        <Link
                                            href={`/careers/apply/${job.id}`}
                                            className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all whitespace-nowrap"
                                        >
                                            Apply Now
                                            <Briefcase className="w-4 h-4 ml-2" />
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {filteredJobs.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-400">No openings in this department right now. Check back later!</p>
                        </div>
                    )}
                </div>
            </section>

            {/* No Openings? */}
            <section className="py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-br from-gray-900/80 to-gray-900/40 backdrop-blur-sm rounded-3xl border border-gray-800 p-10 text-center"
                    >
                        {/* <Mail className="w-16 h-16 text-blue-400 mx-auto mb-6" /> */}
                        <h2 className="text-3xl font-bold text-white mb-4">Don't See Your Role?</h2>
                        <p className="text-gray-300 mb-8 leading-relaxed">
                            We're always looking for talented individuals to join our team. 
                            Send us your resume and tell us how you can contribute to our mission.
                        </p>
                        <Link
                            href="/contactus"
                            className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold transition-all hover:shadow-purple-500/40"
                        >
                            Send Open Application
                            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Footer Note */}
            <section className="py-12 border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-500 text-sm">
                            BlogName is an equal opportunity employer. We celebrate diversity and are committed to creating an inclusive environment for all employees.
                        </p>
                        <div className="flex space-x-4">
                            <Link href="/privacy" className="text-gray-400 hover:text-white text-sm">
                                Privacy Policy
                            </Link>
                            <Link href="/terms" className="text-gray-400 hover:text-white text-sm">
                                Terms
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}