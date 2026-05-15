'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  FaGithub,
  FaTwitter,
  FaLinkedin,
  FaDiscord,
  FaArrowUp,
  FaWhatsapp,
} from 'react-icons/fa'
import { useTheme } from '@/contexts/ThemeContext'

export default function Footer() {
  const [isVisible, setIsVisible] = useState(false)
  const [currentYear, setCurrentYear] = useState(2024)
  const { isDark } = useTheme()

  useEffect(() => {
    setCurrentYear(new Date().getFullYear())

    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  const socialLinks = [
    { icon: <FaGithub />, href: 'https://github.com', label: 'GitHub' },
    { icon: <FaTwitter />, href: 'https://twitter.com', label: 'Twitter' },
    { icon: <FaLinkedin />, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: <FaDiscord />, href: 'https://discord.com', label: 'Discord' },
  ]

  const footerLinks = {
    Product: [
      { name: 'Affiliate', href: '/affiliate' },
    ],
    Company: [
      { name: 'About', href: '/aboutus' },
      { name: 'Blog', href: '/blogs' },
      { name: 'Contact', href: '/contactus' },
    ],
    Legal: [
      { name: 'Privacy', href: '/privacy' },
      { name: 'Terms', href: '/terms' },
    ],
  }

  return (
    <>
      {/* Floating Action Buttons */}
      <div className="fixed bottom-8 right-4 md:right-8 z-50 flex flex-col gap-4 items-center mb-20 md:mb-24">
        {/* WhatsApp Button */}
        <a
          href="https://wa.me/19592237583"
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 md:p-4 rounded-full bg-[#25D366] text-white shadow-[0_0_15px_rgba(37,211,102,0.4)] hover:shadow-[0_0_25px_rgba(37,211,102,0.8)] hover:scale-110 transition-all duration-300"
          aria-label="Contact us on WhatsApp"
          title="Contact us on WhatsApp"
        >
          <FaWhatsapp className="w-5 h-5 md:w-6 md:h-6" />
        </a>

        {/* Back to Top Button */}
        {isVisible && (
          <button
            onClick={scrollToTop}
            className="p-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 animate-bounce-once"
            aria-label="Back to top"
          >
            <FaArrowUp className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Main Footer */}
      <footer id="footer" className={`${
        isDark 
          ? 'bg-gradient-to-br from-gray-900 via-black to-purple-900 border-purple-500/20' 
          : 'bg-gradient-to-br from-gray-50 via-white to-purple-50 border-purple-200/50'
      } border-t mt-auto relative overflow-hidden`}>
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl ${
            isDark ? 'bg-purple-500/10' : 'bg-purple-400/15'
          }`}></div>
          <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl ${
            isDark ? 'bg-pink-500/10' : 'bg-pink-400/15'
          }`}></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-10 left-1/4 animate-float">
          <div className={`w-4 h-4 rounded-full ${isDark ? 'bg-purple-500' : 'bg-purple-400'}`}></div>
        </div>
        <div className="absolute bottom-20 right-1/4 animate-float-delayed">
          <div className={`w-6 h-6 rounded-full ${isDark ? 'bg-pink-500/30' : 'bg-pink-400/40'}`}></div>
        </div>

        <div className="container mx-auto px-4 py-12 relative z-10">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <Link href="/" className="absolute top-0 left-4 z-50 flex items-center h-40 w-auto group">
                <img 
                  src="/headerlogo.png" 
                  alt="Einsteine AI" 
                  className={`h-full w-auto object-contain drop-shadow-xl transition-all duration-300 ${
                    isDark 
                      ? 'brightness-100' 
                      : 'brightness-0 saturate-0 opacity-90'
                  }`} 
                />
              </Link>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} mb-6 mt-15 pl-10 max-w-xs`}>
                Revolutionizing content creation with AI-powered insights and interactive experiences.
              </p>
              <div className="flex pl-10 space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 rounded-full ${
                      isDark 
                        ? 'bg-gray-800 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 text-gray-300 hover:text-white' 
                        : 'bg-gray-200 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 text-gray-600 hover:text-white'
                    } flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg`}
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Footer Links */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'} mb-4 text-lg`}>
                  {category}
                </h3>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} hover:pl-2 transition-all duration-300 flex items-center group`}
                      >
                        <span className={`w-1 h-1 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity ${
                          isDark ? 'bg-purple-500' : 'bg-purple-600'
                        }`}></span>
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom Bar */}
          <div className={`border-t ${isDark ? 'border-gray-800' : 'border-gray-200'} flex item-center justify-center pt-8`}>
            <p className={`flex items-center justify-center md:justify-end space-x-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              <span>© {currentYear} Einsteine AI. All rights reserved.</span>
            </p>
          </div>
        </div>
      </footer>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        @keyframes float-delayed {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 7s ease-in-out infinite;
          animation-delay: 1s;
        }
        .animate-bounce-once {
          animation: bounce 2s infinite;
        }
      `}</style>
    </>
  )
}