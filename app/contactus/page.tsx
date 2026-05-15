// app/contact/page.tsx
'use client';

import { useState, useCallback } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Typewriter from '@/components/ui/Typewriter';
import CTAButton from '@/components/ui/CTAButton';
import { submitContactForm } from '@/lib/api';
import { useTheme } from '@/contexts/ThemeContext';
import { trackLead } from '@/lib/tracking';

const contactInfo = [
    {
        icon: Mail,
        title: 'Email Us',
        details: ['aiittechjournal@gmail.com'],
        description: 'We typically respond within 24 hours'
    },
    {
        icon: Phone,
        title: 'Call Us',
        details: ['+1 (959) 223-7583'],
        description: 'Mon-Fri from 9am to 6pm EST'
    },
    {
        icon: MapPin,
        title: 'Visit Us',
        details: ['Lake St, Vernon Rockville', 'CT 06066, United States'],
        description: 'Schedule a meeting in advance'
    },
    {
        icon: Clock,
        title: 'Business Hours',
        details: ['Monday - Friday: 9am - 6pm', 'Saturday: 10am - 4pm'],
        description: 'Closed on Sundays'
    }
];

const words = ["Support", "Feedback", "Inquiry", "Collaboration"];

export default function ContactPage() {
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const { isDark } = useTheme();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
        inquiryType: 'general'
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            await submitContactForm({
                name: formData.name,
                email: formData.email,
                subject: formData.subject,
                message: formData.message,
                inquiry_type: formData.inquiryType,
            });

            // Track as a lead
            await trackLead({
                name: formData.name,
                email: formData.email,
                interests: formData.inquiryType,
                source: 'contact_form'
            });

            setIsSubmitted(true);
            setTimeout(() => {
                setIsSubmitted(false);
                setFormData({ name: '', email: '', subject: '', message: '', inquiryType: 'general' });
            }, 4000);
        } catch (err) {
            setSubmitError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

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
        <div className={`min-h-screen ${isDark ? 'bg-transparent' : 'bg-gradient-to-br from-slate-50 via-purple-50/30 to-blue-50/40'}`}>
            {/* Hero Section */}
            <div className="relative py-32 overflow-hidden">
                {/* Background with grid pattern */}
                <div className="absolute inset-0 z-0">
                    {isDark ? (
                        /* Dark mode background */
                        <>
                            <div
                                className="absolute inset-0"
                                style={{
                                    backgroundImage: "url('/herobackgrond.svg')",
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundColor: '#000'
                                }}
                            />
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
                        </>
                    ) : (
                        /* Light mode background with grid */
                        <>
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

                            {/* Color blobs */}
                            <div
                                className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full opacity-25 pointer-events-none"
                                style={{
                                    background: 'radial-gradient(circle, rgba(139,92,246,0.22) 0%, transparent 70%)',
                                    transform: 'translate(-30%, -30%)',
                                }}
                            />
                            <div
                                className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full opacity-20 pointer-events-none"
                                style={{
                                    background: 'radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%)',
                                    transform: 'translate(20%, 20%)',
                                }}
                            />

                            {/* Grid overlay */}
                            <div
                                className="absolute inset-0 pointer-events-none"
                                style={{
                                    backgroundImage: `linear-gradient(rgba(0,0,0,0.08) 1px, transparent 1px),
                                                      linear-gradient(90deg, rgba(0,0,0,0.08) 1px, transparent 1px)`,
                                    backgroundSize: '60px 60px',
                                }}
                            />

                            {/* Moving shimmer */}
                            <div className="absolute inset-0 opacity-15">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-200/50 to-transparent animate-gradient-x" />
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-100/40 to-transparent animate-gradient-y" />
                            </div>
                        </>
                    )}
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
                            className={`text-6xl md:text-8xl font-bold mb-8 tracking-tight leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}
                        >
                            Get in{' '}
                            <span
                                className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 inline-block relative"
                                style={{
                                    textShadow: isDark
                                        ? '0 0 15px rgba(168, 85, 247, 0.6), 0 0 30px rgba(59, 130, 246, 0.4)'
                                        : 'none'
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
                        <motion.p
                            variants={itemVariants}
                            className={`text-xl md:text-2xl max-w-3xl mx-auto ${isDark
                                ? 'text-gray-300 drop-shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                                : 'text-slate-600'
                                }`}
                        >
                            Have questions, suggestions, or partnership inquiries? <br />
                            <span className={`font-medium ${isDark ? 'text-white' : 'text-purple-700'}`}>
                                We'd love to hear from you.
                            </span>
                        </motion.p>
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
                `}</style>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Contact Information */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className={`text-3xl font-bold mb-8 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            Contact Information
                        </h2>
                        <p className={`mb-10 ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
                            Reach out to us through any of these channels. We're always here to help
                            and eager to connect with our readers and partners.
                        </p>

                        <div className="grid sm:grid-cols-2 gap-6 mb-12">
                            {contactInfo.map((info, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ scale: 1.02 }}
                                    className={`p-6 rounded-xl shadow-lg border transition-all ${isDark
                                        ? 'bg-gray-900/50 backdrop-blur-md border-gray-800 hover:border-blue-500/50'
                                        : 'bg-white/70 backdrop-blur-md border-gray-200 hover:border-blue-400/50'
                                        }`}
                                >
                                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 ${isDark
                                        ? 'bg-gradient-to-br from-blue-900/50 to-purple-900/50'
                                        : 'bg-gradient-to-br from-blue-100 to-purple-100'
                                        }`}>
                                        <info.icon className={`w-6 h-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                                    </div>
                                    <h3 className={`font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                        {info.title}
                                    </h3>
                                    <div className="space-y-1 mb-3">
                                        {info.details.map((detail, idx) => (
                                            <p key={idx} className={isDark ? 'text-gray-400' : 'text-slate-500'}>
                                                {detail}
                                            </p>
                                        ))}
                                    </div>
                                    <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>
                                        {info.description}
                                    </p>
                                </motion.div>
                            ))}
                        </div>

                        {/* FAQ Section */}
                        <div className={`rounded-xl shadow-lg p-8 border ${isDark
                            ? 'bg-gray-900/30 backdrop-blur-md border-gray-800'
                            : 'bg-white/60 backdrop-blur-md border-gray-200'
                            }`}>
                            <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                Frequently Asked Questions
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <h4 className={`font-semibold mb-2 ${isDark ? 'text-gray-200' : 'text-slate-800'}`}>
                                        How long does it take to get a response?
                                    </h4>
                                    <p className={isDark ? 'text-gray-400' : 'text-slate-500'}>
                                        We typically respond within 24 hours on business days.
                                    </p>
                                </div>
                                <div>
                                    <h4 className={`font-semibold mb-2 ${isDark ? 'text-gray-200' : 'text-slate-800'}`}>
                                        Do you accept guest posts?
                                    </h4>
                                    <p className={isDark ? 'text-gray-400' : 'text-slate-500'}>
                                        Yes! We welcome submissions from experienced writers. Email us your pitch.
                                    </p>
                                </div>
                                <div>
                                    <h4 className={`font-semibold mb-2 ${isDark ? 'text-gray-200' : 'text-slate-800'}`}>
                                        Can I advertise on your platform?
                                    </h4>
                                    <p className={isDark ? 'text-gray-400' : 'text-slate-500'}>
                                        We offer various advertising opportunities. Contact our sales team for details.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className={`rounded-2xl shadow-xl p-8 border ${isDark
                            ? 'bg-gray-900/50 backdrop-blur-xl border-gray-800'
                            : 'bg-white/80 backdrop-blur-xl border-gray-200'
                            }`}
                    >
                        <h2 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            Send us a Message
                        </h2>
                        <p className={`mb-8 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                            Fill out the form below and we'll get back to you as soon as possible.
                        </p>

                        {isSubmitted ? (
                            <div className="text-center py-12">
                                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 ${isDark ? 'bg-green-900/30' : 'bg-green-100'
                                    }`}>
                                    <CheckCircle className={`w-8 h-8 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
                                </div>
                                <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    Message Sent!
                                </h3>
                                <p className={isDark ? 'text-gray-400' : 'text-slate-500'}>
                                    Thank you for contacting us. We'll get back to you within 24 hours.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="name" className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${isDark
                                                ? 'bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500'
                                                : 'bg-gray-50 border border-gray-200 text-slate-900 placeholder-slate-400'
                                                }`}
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${isDark
                                                ? 'bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500'
                                                : 'bg-gray-50 border border-gray-200 text-slate-900 placeholder-slate-400'
                                                }`}
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="inquiryType" className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                                        Type of Inquiry *
                                    </label>
                                    <select
                                        id="inquiryType"
                                        name="inquiryType"
                                        value={formData.inquiryType}
                                        onChange={handleChange}
                                        required
                                        className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${isDark
                                            ? 'bg-gray-800/50 border border-gray-700 text-white'
                                            : 'bg-gray-50 border border-gray-200 text-slate-900'
                                            }`}
                                    >
                                        <option value="general" className={isDark ? 'bg-gray-900' : 'bg-white'}>General Inquiry</option>
                                        <option value="partnership" className={isDark ? 'bg-gray-900' : 'bg-white'}>Partnership Opportunity</option>
                                        <option value="guest-post" className={isDark ? 'bg-gray-900' : 'bg-white'}>Guest Post Submission</option>
                                        <option value="advertising" className={isDark ? 'bg-gray-900' : 'bg-white'}>Advertising Inquiry</option>
                                        <option value="support" className={isDark ? 'bg-gray-900' : 'bg-white'}>Technical Support</option>
                                        <option value="feedback" className={isDark ? 'bg-gray-900' : 'bg-white'}>Feedback/Suggestion</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="subject" className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                                        Subject *
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${isDark
                                            ? 'bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500'
                                            : 'bg-gray-50 border border-gray-200 text-slate-900 placeholder-slate-400'
                                            }`}
                                        placeholder="What is this regarding?"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="message" className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                                        Message *
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={6}
                                        className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none ${isDark
                                            ? 'bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500'
                                            : 'bg-gray-50 border border-gray-200 text-slate-900 placeholder-slate-400'
                                            }`}
                                        placeholder="Tell us how we can help you..."
                                    />
                                </div>

                                <CTAButton
                                    buttonId="contact-submit"
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`w-full py-4 px-6 rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center hover:scale-[1.02] active:scale-[0.98] ${isDark
                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/30'
                                        : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg hover:shadow-purple-400/40'
                                        }`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5 mr-2" />
                                            Send Message
                                        </>
                                    )}
                                </CTAButton>

                                {/* Error message */}
                                {submitError && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`flex items-start gap-3 p-4 rounded-lg ${isDark
                                            ? 'bg-red-900/30 border border-red-500/40 text-red-300'
                                            : 'bg-red-50 border border-red-300 text-red-700'
                                            } text-sm`}
                                    >
                                        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                        <span>{submitError}</span>
                                    </motion.div>
                                )}

                                <p className={`text-sm text-center ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>
                                    By submitting this form, you agree to our privacy policy and terms of service.
                                </p>
                            </form>
                        )}
                    </motion.div>
                </div>
            </div>

            {/* Map Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                <div className={`rounded-2xl shadow-xl overflow-hidden border ${isDark
                    ? 'bg-gray-900/50 backdrop-blur-md border-gray-800'
                    : 'bg-white/70 backdrop-blur-md border-gray-200'
                    }`}>
                    <div className="p-8">
                        <h2 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            Find Our Office
                        </h2>
                        <p className={isDark ? 'text-gray-400' : 'text-slate-500'}>
                            Visit us at our headquarters in Vernon Rockville, CT
                        </p>
                    </div>
                    <div className={`relative h-96 ${isDark ? 'bg-gray-800/50' : 'bg-gray-100'}`}>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <MapPin className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-blue-500' : 'text-blue-600'}`} />
                                <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    Lake St, Vernon Rockville
                                </h3>
                                <p className={isDark ? 'text-gray-400' : 'text-slate-500'}>
                                    CT 06066, United States
                                </p>
                                <CTAButton
                                    buttonId="contact-open-maps"
                                    className={`mt-4 px-6 py-2 rounded-lg transition-colors z-10 relative ${isDark
                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                        : 'bg-blue-500 text-white hover:bg-blue-600'
                                        }`}
                                >
                                    Open in Maps
                                </CTAButton>
                            </div>
                        </div>
                        <div className={`absolute inset-0 bg-gradient-to-t pointer-events-none ${isDark ? 'from-gray-900/50 to-transparent' : 'from-white/50 to-transparent'
                            }`}></div>
                    </div>
                </div>
            </div>
        </div>
    );
}