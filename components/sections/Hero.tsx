'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import CTAButton from '../ui/CTAButton'
import { useState, useEffect, useRef, useCallback } from 'react'
import TypeWriter from "../ui/Typewriter"
import { useAI } from '@/contexts/AIContext'
import { useTheme } from '@/contexts/ThemeContext'
import dynamic from 'next/dynamic'
import GlobeStarsBackground from '../ui/GlobeStarsBackground'
const GlobeMap = dynamic(() => import('../ui/GlobeMap'), { ssr: false })

const words = ["Power of AI", "Future", "Innovation", "Intelligence"]

const Hero = () => {
  const [videoEnded, setVideoEnded] = useState(false)
  const [contentVisible, setContentVisible] = useState(false)
  const [glowIntensity, setGlowIntensity] = useState(1)
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [isPlayingVideo, setIsPlayingVideo] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)
  const { triggerTourFromVideo, setShowAI, setMode } = useAI()
  const { isDark } = useTheme()

  const playSound = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3')
    audio.play().catch(e => console.error("Sound play failed", e))
  }

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  })

  const contentScale = useTransform(scrollYProgress, [0, 1], [1, 0.9])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.5,
        duration: 1.2,
        ease: 'easeOut' as const,
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 1,
        ease: 'easeOut' as const,
      }
    }
  }

  useEffect(() => {
    if (!contentVisible) return
    let animationFrameId: number
    let time = 0
    const animateGlow = () => {
      time += 0.02
      const intensity = 1 +
        Math.sin(time) * 0.15 +
        Math.sin(time * 1.5) * 0.1 +
        Math.sin(time * 2.5) * 0.05
      setGlowIntensity(intensity)
      animationFrameId = requestAnimationFrame(animateGlow)
    }
    animateGlow()
    return () => cancelAnimationFrame(animationFrameId)
  }, [contentVisible])

  const handleVideoEnded = () => {
    setVideoEnded(true)
    setTimeout(() => setContentVisible(true), 300)
    setTimeout(() => triggerTourFromVideo(), 1500)
  }

  const handleTypewriterComplete = useCallback(() => {
    setTimeout(() => {
      setCurrentWordIndex((prev) => (prev + 1) % words.length)
    }, 1500)
  }, [])

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => handleVideoEnded())
    } else {
      handleVideoEnded()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section
      ref={sectionRef}
      id="hero"
      className={`relative mt-20 flex items-center justify-center overflow-hidden transition-colors duration-500 ${
        isDark
          ? 'bg-black'
          : 'bg-gradient-to-br from-slate-50 via-purple-50/30 to-blue-50/40'
      }`}
    >
      {/* ── Background Layer ── */}
      <div className="absolute inset-0 z-0">
        {isDark ? (
          /* Dark mode: existing SVG + globe stars */
          <div
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
              videoEnded ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: "url('/herobackgrond.svg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundColor: '#000',
            }}
          >
            <GlobeStarsBackground />
            <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-purple-900/10 to-black/60" />
            <div className="absolute inset-0 opacity-30">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent animate-gradient-x" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/10 to-transparent animate-gradient-y" />
            </div>
          </div>
        ) : (
          /* Light mode: herobackgrond.svg with white overlay */
          <div className="absolute inset-0">
            {/* Same SVG as dark mode, heavily washed out to appear light */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: "url('/herobackgrond.svg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundColor: '#fff',
              }}
            />

            {/* White wash — lightens the dark SVG */}
            <div className="absolute inset-0 bg-white/82" />

            {/* Soft purple-blue tint */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50/60 via-white/40 to-blue-50/70" />

            {/* Colour blobs */}
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
            <div
              className="absolute top-1/2 left-1/2 w-[800px] h-[400px] opacity-15 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse, rgba(168,85,247,0.15) 0%, transparent 60%)',
                transform: 'translate(-50%, -50%)',
              }}
            />

            {/* Black grid */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: `linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                                  linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)`,
                backgroundSize: '60px 60px',
              }}
            />

            {/* Moving shimmer */}
            <div className="absolute inset-0 opacity-15">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-200/50 to-transparent animate-gradient-x" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-100/40 to-transparent animate-gradient-y" />
            </div>
          </div>
        )}
      </div>

      {/* ── Main Content ── */}
      <motion.div
        style={{ scale: contentScale, opacity: contentOpacity }}
        className={`relative z-20 min-h-[600px] h-auto lg:h-[600px] py-10 lg:py-0 mt-20 max-w-7xl mx-auto px-4 flex items-center transition-all duration-1000 ${
          contentVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={contentVisible ? "visible" : "hidden"}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full"
        >
          {/* ── Left Column: Text ── */}
          <div className="text-left">
            <motion.div variants={itemVariants} className="mb-6">
              <h1
                className={`text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                Discover the <br />
                <span
                  ref={textRef}
                  className="power-text relative inline-block"
                  style={{
                    color: isDark ? 'white' : 'transparent',
                    backgroundImage: isDark
                      ? 'none'
                      : 'linear-gradient(135deg, #7c3aed 0%, #2563eb 50%, #7c3aed 100%)',
                    WebkitBackgroundClip: isDark ? 'unset' : 'text',
                    backgroundClip: isDark ? 'unset' : 'text',
                    textShadow: isDark
                      ? '0 0 15px rgba(168, 85, 247, 0.6), 0 0 30px rgba(59, 130, 246, 0.4)'
                      : 'none',
                  }}
                >
                  <TypeWriter
                    key={currentWordIndex}
                    speed={50}
                    text={words[currentWordIndex]}
                    onComplete={handleTypewriterComplete}
                    className="relative"
                  />
                </span>
              </h1>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className={`text-xl mb-10 max-w-xl leading-relaxed ${
                isDark ? 'text-gray-300 glow-text' : 'text-slate-600'
              }`}
            >
              Experience AI-powered interactive blogging with{' '}
              <span
                className={`font-bold relative ${
                  isDark ? 'text-white' : 'text-purple-700'
                }`}
              >
                Einsteine
                {isDark && (
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-xl opacity-70" />
                )}
              </span>
              . Your intelligent companion that brings content to life with real-time adaptation and smart insights.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-5"
            >
              <CTAButton
                buttonId="hero-start-exploring"
                onClick={() => window.location.href = '/blogs'}
                className={`text-lg px-8 py-4 ${isDark ? 'glow-button' : 'light-glow-button'}`}
              >
                <span className="relative z-10">🚀 Start Exploring</span>
              </CTAButton>

              <CTAButton
                buttonId="hero-meet-einsteine"
                onClick={() => {
                  setMode('chat')
                  setShowAI(true)
                }}
                className={`text-lg px-8 py-4 border-2 ${isDark ? 'glow-border' : 'light-glow-border'}`}
              >
                <div className="relative z-10 flex items-center gap-2">
                  <img src="./robot3.png" width={20} height={20} alt="" />
                  Meet Einsteine
                </div>
                <span
                  className={`absolute inset-0 blur-md opacity-50 ${
                    isDark
                      ? 'bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10'
                      : 'bg-gradient-to-r from-purple-100/30 via-blue-100/30 to-purple-100/30'
                  }`}
                />
              </CTAButton>
            </motion.div>
          </div>

          {/* ── Right Column: 3D Globe ── */}
          <motion.div
            className="relative flex items-center justify-center lg:justify-end"
            initial={{ opacity: 0, scale: 0.3 }}
            animate={contentVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.3 }}
            transition={{ type: 'spring', stiffness: 45, damping: 16, delay: 0.35 }}
          >
            <div
              className={`w-full max-w-md aspect-square relative rounded-full transition-all duration-500 ${
                isDark
                  ? ''
                  : 'shadow-[0_0_60px_rgba(139,92,246,0.15),0_0_120px_rgba(59,130,246,0.08)]'
              }`}
            >
              {contentVisible ? (
                <div className="w-full h-full">
                  <GlobeMap contentVisible={contentVisible} />
                </div>
              ) : (
                <div
                  className="w-full h-full opacity-20 border-2 border-dashed border-purple-500/50 rounded-full"
                  style={{
                    background: isDark
                      ? 'radial-gradient(circle at 35% 35%, #0f0328 0%, #050010 100%)'
                      : 'radial-gradient(circle at 35% 35%, #ede9fe 0%, #dbeafe 100%)',
                    boxShadow: isDark
                      ? '0 0 40px 8px rgba(147,51,234,0.12)'
                      : '0 0 40px 8px rgba(139,92,246,0.08)',
                  }}
                />
              )}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* ── 3D Yellow Play Button ── */}
      {contentVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', delay: 1.2 }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-40 hidden lg:block"
        >
          <motion.button
            whileHover={{ scale: 1.15, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              playSound()
              setIsPlayingVideo(true)
            }}
            className="relative group"
          >
            <div className="absolute inset-0 translate-y-2 bg-yellow-700 rounded-full blur-md opacity-40 group-hover:translate-y-3 transition-transform" />
            <div className="absolute inset-0 translate-y-1.5 bg-yellow-800 rounded-full" />
            <div className="relative w-20 h-20 bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600 rounded-full border-4 border-white/20 flex items-center justify-center shadow-2xl group-active:translate-y-1 transition-transform overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full duration-700 transition-transform" />
              <svg className="w-8 h-8 text-yellow-950 fill-current ml-1" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </motion.button>
        </motion.div>
      )}

      {/* ── Video Modal ── */}
      {isPlayingVideo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-4xl aspect-video bg-gray-900 rounded-3xl overflow-hidden border-4 border-yellow-500 shadow-[0_0_80px_rgba(234,179,8,0.3)]"
          >
            <video
              autoPlay
              controls
              className="w-full h-full object-contain"
              onEnded={() => setIsPlayingVideo(false)}
            >
              <source src="/new.mp4" type="video/mp4" />
            </video>
            <button
              onClick={() => setIsPlayingVideo(false)}
              className="absolute top-4 right-4 z-50 w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold hover:scale-110 transition-transform"
            >
              ✕
            </button>
            <div className="absolute -inset-10 bg-yellow-500/10 blur-[60px] pointer-events-none" />
          </motion.div>
        </div>
      )}

      {/* ── Custom Styles ── */}
      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
        }
        @keyframes gradient-y {
          0%, 100% { transform: translateY(-100%); }
          50% { transform: translateY(100%); }
        }
        @keyframes lightning {
          0%, 100% {
            filter: drop-shadow(0 0 30px rgba(168, 85, 247, 0.6))
                    drop-shadow(0 0 60px rgba(59, 130, 246, 0.4))
                    drop-shadow(0 0 90px rgba(236, 72, 153, 0.2));
          }
          45% {
            filter: drop-shadow(0 0 30px rgba(168, 85, 247, 0.6))
                    drop-shadow(0 0 60px rgba(59, 130, 246, 0.4))
                    drop-shadow(0 0 90px rgba(236, 72, 153, 0.2));
          }
          46% {
            filter: drop-shadow(0 0 60px rgba(255, 255, 255, 0.9))
                    drop-shadow(0 0 120px rgba(168, 85, 247, 0.8))
                    drop-shadow(0 0 180px rgba(59, 130, 246, 0.6));
          }
          48% {
            filter: drop-shadow(0 0 30px rgba(168, 85, 247, 0.6))
                    drop-shadow(0 0 60px rgba(59, 130, 246, 0.4))
                    drop-shadow(0 0 90px rgba(236, 72, 153, 0.2));
          }
          50% {
            filter: drop-shadow(0 0 80px rgba(255, 255, 255, 0.9))
                    drop-shadow(0 0 160px rgba(168, 85, 247, 0.8))
                    drop-shadow(0 0 240px rgba(59, 130, 246, 0.6));
          }
          55% {
            filter: drop-shadow(0 0 30px rgba(168, 85, 247, 0.6))
                    drop-shadow(0 0 60px rgba(59, 130, 246, 0.4))
                    drop-shadow(0 0 90px rgba(236, 72, 153, 0.2));
          }
        }
        @keyframes typing-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(255,255,255,0.3), 0 0 40px rgba(255,255,255,0.2), 0 0 60px rgba(255,255,255,0.1);
          }
          50% {
            box-shadow: 0 0 40px rgba(255,255,255,0.6), 0 0 80px rgba(255,255,255,0.4), 0 0 120px rgba(255,255,255,0.2);
          }
        }
        .power-text { animation: lightning 8s infinite; }
        .animate-gradient-x { animation: gradient-x 15s ease-in-out infinite; }
        .animate-gradient-y { animation: gradient-y 20s ease-in-out infinite; }

        /* Dark mode text glow */
        .glow-text {
          text-shadow: 0 0 10px rgba(168,85,247,0.3), 0 0 20px rgba(59,130,246,0.2);
        }

        /* Dark mode button glows */
        .glow-button {
          box-shadow: 0 0 20px rgba(59,130,246,0.4), 0 0 40px rgba(168,85,247,0.3), 0 0 60px rgba(236,72,153,0.2);
        }
        .glow-border {
          border-image: linear-gradient(45deg, #3b82f6, #8b5cf6, #ec4899) 1;
          box-shadow: 0 0 15px rgba(59,130,246,0.3), inset 0 0 15px rgba(59,130,246,0.2);
        }

        /* Light mode button glows */
        .light-glow-button {
          box-shadow: 0 4px 20px rgba(124,58,237,0.25), 0 8px 40px rgba(59,130,246,0.15);
        }
        .light-glow-border {
          border-color: rgba(124,58,237,0.4);
          box-shadow: 0 4px 15px rgba(124,58,237,0.15), inset 0 0 10px rgba(124,58,237,0.05);
        }

        .typewriter-cursor { animation: typing-glow 1.5s ease-in-out infinite; }
      `}</style>
    </section>
  )
}

export default Hero