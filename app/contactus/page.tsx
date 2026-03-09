// app/contact/page.tsx
'use client';

import { useState, useCallback } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Typewriter from '@/components/ui/Typewriter';
import { submitContactForm } from '@/lib/api';


const contactInfo = [
    {
        icon: Mail,
        title: 'Email Us',
        details: ['hello@bloghub.com', 'support@bloghub.com'],
        description: 'We typically respond within 24 hours'
    },
    {
        icon: Phone,
        title: 'Call Us',
        details: ['+1 (555) 123-4567', '+1 (555) 987-6543'],
        description: 'Mon-Fri from 9am to 6pm EST'
    },
    {
        icon: MapPin,
        title: 'Visit Us',
        details: ['123 Tech Street', 'San Francisco, CA 94107'],
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
            setIsSubmitted(true);
            // Reset form after 4 seconds
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
        <div className="min-h-screen bg-transparent">
            {/* Hero Section */}
            <div
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
                            Get in <span
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
                        <motion.p variants={itemVariants} className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto drop-shadow-[0_0_10px_rgba(168,85,247,0.3)]">
                            Have questions, suggestions, or partnership inquiries? <br />
                            <span className="text-white font-medium">We'd love to hear from you.</span>
                        </motion.p>
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
                        <h2 className="text-3xl font-bold text-white mb-8">
                            Contact Information
                        </h2>
                        <p className="text-gray-300 mb-10">
                            Reach out to us through any of these channels. We're always here to help
                            and eager to connect with our readers and partners.
                        </p>

                        <div className="grid sm:grid-cols-2 gap-6 mb-12">
                            {contactInfo.map((info, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ scale: 1.02 }}
                                    className="bg-gray-900/50 backdrop-blur-md p-6 rounded-xl shadow-lg border border-gray-800 hover:border-blue-500/50 transition-all"
                                >
                                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-lg mb-4">
                                        <info.icon className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <h3 className="font-bold text-white mb-2">{info.title}</h3>
                                    <div className="space-y-1 mb-3">
                                        {info.details.map((detail, idx) => (
                                            <p key={idx} className="text-gray-400">{detail}</p>
                                        ))}
                                    </div>
                                    <p className="text-sm text-gray-500">{info.description}</p>
                                </motion.div>
                            ))}
                        </div>

                        {/* FAQ Section */}
                        <div className="bg-gray-900/30 backdrop-blur-md rounded-xl shadow-lg p-8 border border-gray-800">
                            <h3 className="text-xl font-bold text-white mb-4">Frequently Asked Questions</h3>
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-semibold text-gray-200 mb-2">How long does it take to get a response?</h4>
                                    <p className="text-gray-400">We typically respond within 24 hours on business days.</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-200 mb-2">Do you accept guest posts?</h4>
                                    <p className="text-gray-400">Yes! We welcome submissions from experienced writers. Email us your pitch.</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-200 mb-2">Can I advertise on your platform?</h4>
                                    <p className="text-gray-400">We offer various advertising opportunities. Contact our sales team for details.</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="bg-gray-900/50 backdrop-blur-xl rounded-2xl shadow-xl p-8 border border-gray-800"
                    >
                        <h2 className="text-3xl font-bold text-white mb-2">
                            Send us a Message
                        </h2>
                        <p className="text-gray-400 mb-8">
                            Fill out the form below and we'll get back to you as soon as possible.
                        </p>

                        {isSubmitted ? (
                            <div className="text-center py-12">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-900/30 rounded-full mb-6 text-green-400">
                                    <CheckCircle className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                                <p className="text-gray-400">
                                    Thank you for contacting us. We'll get back to you within 24 hours.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500 transition-colors"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500 transition-colors"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="inquiryType" className="block text-sm font-medium text-gray-300 mb-2">
                                        Type of Inquiry *
                                    </label>
                                    <select
                                        id="inquiryType"
                                        name="inquiryType"
                                        value={formData.inquiryType}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white transition-colors"
                                    >
                                        <option value="general" className="bg-gray-900">General Inquiry</option>
                                        <option value="partnership" className="bg-gray-900">Partnership Opportunity</option>
                                        <option value="guest-post" className="bg-gray-900">Guest Post Submission</option>
                                        <option value="advertising" className="bg-gray-900">Advertising Inquiry</option>
                                        <option value="support" className="bg-gray-900">Technical Support</option>
                                        <option value="feedback" className="bg-gray-900">Feedback/Suggestion</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                                        Subject *
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500 transition-colors"
                                        placeholder="What is this regarding?"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                                        Message *
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={6}
                                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500 transition-colors resize-none"
                                        placeholder="Tell us how we can help you..."
                                    />
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg font-bold hover:shadow-lg hover:shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
                                </motion.button>

                                {/* Error message */}
                                {submitError && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex items-start gap-3 p-4 rounded-lg bg-red-900/30 border border-red-500/40 text-red-300 text-sm"
                                    >
                                        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                        <span>{submitError}</span>
                                    </motion.div>
                                )}


                                <p className="text-sm text-gray-500 text-center">
                                    By submitting this form, you agree to our privacy policy and terms of service.
                                </p>
                            </form>
                        )}
                    </motion.div>
                </div>
            </div>

            {/* Map Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                <div className="bg-gray-900/50 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border border-gray-800">
                    <div className="p-8">
                        <h2 className="text-3xl font-bold text-white mb-2">Find Our Office</h2>
                        <p className="text-gray-400 mb-6">
                            Visit us at our headquarters in San Francisco
                        </p>
                    </div>
                    <div className="relative h-96 bg-gray-800/50">
                        {/* Placeholder for map - In a real app, you would integrate Google Maps or similar */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <MapPin className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-white mb-2">123 Tech Street</h3>
                                <p className="text-gray-400">San Francisco, CA 94107</p>
                                <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                    Open in Maps
                                </button>
                            </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent pointer-events-none"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}