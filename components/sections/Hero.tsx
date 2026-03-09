'use client'

import { motion } from 'framer-motion'
import NeonButton from '../ui/NeonButton'
import { useState, useEffect, useRef, useCallback } from 'react'
import TypeWriter from "../ui/Typewriter"
import { useAI } from '@/contexts/AIContext'
import BoxExplosion from './Boxexpo'

const words = ["Power of AI", "Future", "Innovation", "Intelligence"]

const Hero = () => {
  const [videoEnded, setVideoEnded] = useState(false)
  const [contentVisible, setContentVisible] = useState(false)
  const [glowIntensity, setGlowIntensity] = useState(1)
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)
  const { triggerTourFromVideo, setShowAI, setMode } = useAI()

  // words array moved outside or useMemo, but since it's static we can just move it out or keep as is if we handle callback properly. 
  // Actually, easiest is to ensure handleTypewriterComplete doesn't trigger effect.

  // ... (variants logic omitted as it's fine) ...
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.5,
        duration: 1.2,
        ease: [0.215, 0.61, 0.355, 1.0]
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
        ease: [0.215, 0.61, 0.355, 1.0]
      }
    }
  }

  const imageVariants = {
    hidden: { opacity: 0, x: 50, scale: 0.8 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 1.2,
        ease: "easeOut",
        delay: 0.8
      }
    }
  }

  // Enhanced glow animation effect
  useEffect(() => {
    if (!contentVisible) return

    let animationFrameId: number
    let time = 0

    const animateGlow = () => {
      time += 0.02
      // Multi-layered glow with different frequencies
      const intensity = 1 +
        Math.sin(time) * 0.15 +
        Math.sin(time * 1.5) * 0.1 +
        Math.sin(time * 2.5) * 0.05

      setGlowIntensity(intensity)
      animationFrameId = requestAnimationFrame(animateGlow)
    }

    animateGlow()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [contentVisible])

  const handleVideoEnded = () => {
    setVideoEnded(true)
    setTimeout(() => setContentVisible(true), 300)
    // Trigger AI tour after a short delay
    setTimeout(() => {
      triggerTourFromVideo()
    }, 1500)
  }

  // Use useCallback to prevent recreating this function on every render (frame) which resets Typewriter
  const handleTypewriterComplete = useCallback(() => {
    setTimeout(() => {
      setCurrentWordIndex((prev) => (prev + 1) % words.length)
    }, 1500)
  }, [])

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(e => {
        console.log("Auto-play prevented, showing content immediately")
        setVideoEnded(true)
        setContentVisible(true)
      })
    }
  }, [])

  return (
    <section id="hero" className="relative mt-20 flex items-center justify-center overflow-hidden">
      {/* Video Background - Plays first */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          onEnded={handleVideoEnded}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${videoEnded ? 'opacity-0' : 'opacity-100'
            }`}
          style={{
            objectFit: 'cover',
            filter: 'brightness(0.4)'
          }}
        >
          <source src="/0202.mp4" type="video/mp4" />
        </video>

        {/* Background - Shows after video ends */}
        <div
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${videoEnded ? 'opacity-100' : 'opacity-0'
            }`}
          style={{
            backgroundImage: "url('/herobackgrond.svg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: '#000'
          }}
        >
          {/* Enhanced overlay for better text contrast */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-purple-900/10 to-black/60" />

          {/* Animated gradient overlay for dynamic background */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent animate-gradient-x" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/10 to-transparent animate-gradient-y" />
          </div>
        </div>
      </div>

      {!videoEnded && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 2 }}
          onClick={() => {
            if (videoRef.current) {
              videoRef.current.currentTime = videoRef.current.duration
            }
            handleVideoEnded()
          }}
          className="absolute bottom-8 right-8 z-30 px-4 py-2 bg-black/50 text-white rounded-full text-sm hover:bg-black/70 transition-colors backdrop-blur-sm border border-white/20"
        >
          Skip intro
        </motion.button>
      )}

      {/* Main Content */}
      <div className={`relative z-20 h-[600px] mt-20 max-w-7xl mx-auto px-4 transition-all duration-1000 ${contentVisible ? 'opacity-100' : 'opacity-0'
        }`}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={contentVisible ? "visible" : "hidden"}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          {/* Left Column: Text */}
          <div className="text-left">
            <motion.div variants={itemVariants} className="mb-6">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight text-white">
                Discover the <br />
                <span
                  ref={textRef}
                  className="power-text relative inline-block text-white"
                  style={{
                    color: 'white',
                    textShadow: '0 0 15px rgba(168, 85, 247, 0.6), 0 0 30px rgba(59, 130, 246, 0.4)'
                  }}
                >
                  <TypeWriter
                    key={currentWordIndex}
                    speed={50}
                    text={words[currentWordIndex]}
                    onComplete={handleTypewriterComplete}
                    className="relative"
                  />
                  {/* Enhanced glow effect around the typing text - REMOVED per user request */}
                  {/* <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 blur-xl opacity-30 animate-pulse" /> */}
                </span>
              </h1>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="text-xl text-gray-300 mb-10 max-w-xl leading-relaxed glow-text"
            >
              Experience AI-powered interactive blogging with{' '}
              <span className="font-bold text-white relative">
                Einsteine
                <span className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-xl opacity-70" />
              </span>
              . Your intelligent companion that brings content to life with real-time adaptation and smart insights.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-5"
            >
              <NeonButton
                onClick={() => window.location.href = '/blogs'}
                className="text-lg px-8 py-4 glow-button"
              >
                <span className="relative z-10">🚀 Start Exploring</span>
                <span className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-xl opacity-70" />
              </NeonButton>

              <NeonButton
                variant="outline"
                onClick={() => {
                  setMode('chat')
                  setShowAI(true)
                }}
                className="text-lg px-8 py-4 border-2 glow-border"
              >
                <span className="relative z-10">🤖 Meet Einsteine</span>
                <span className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-md opacity-50" />
              </NeonButton>
            </motion.div>
          </div>

          {/* Right Column: Video */}
          <motion.div variants={imageVariants} className="relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-lg aspect-video">
              {/* <BoxExplosion /> */}
              <img src="world2.png" alt="" />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating particles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20"
            style={{
              width: Math.random() * 6 + 2 + 'px',
              height: Math.random() * 6 + 2 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animation: `float-particle ${Math.random() * 10 + 15}s linear infinite`,
              animationDelay: Math.random() * 5 + 's',
              filter: 'blur(1px)',
            }}
          />
        ))}
      </div>

      {/* Custom Styles for Enhanced Effects */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(1deg); }
        }

        @keyframes gradient-x {
          0%, 100% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
        }

        @keyframes gradient-y {
          0%, 100% { transform: translateY(-100%); }
          50% { transform: translateY(100%); }
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }

        @keyframes float-particle {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) translateX(calc(var(--random-x) * 100px));
            opacity: 0;
          }
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
            box-shadow: 
              0 0 20px rgba(255, 255, 255, 0.3),
              0 0 40px rgba(255, 255, 255, 0.2),
              0 0 60px rgba(255, 255, 255, 0.1);
          }
          50% {
            box-shadow: 
              0 0 40px rgba(255, 255, 255, 0.6),
              0 0 80px rgba(255, 255, 255, 0.4),
              0 0 120px rgba(255, 255, 255, 0.2);
          }
        }

        .power-text {
          animation: lightning 8s infinite;
        }

        .animate-gradient-x {
          animation: gradient-x 15s ease-in-out infinite;
        }

        .animate-gradient-y {
          animation: gradient-y 20s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        .glow-text {
          text-shadow: 0 0 10px rgba(168, 85, 247, 0.3),
                       0 0 20px rgba(59, 130, 246, 0.2);
        }

        .glow-button {
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.4),
                      0 0 40px rgba(168, 85, 247, 0.3),
                      0 0 60px rgba(236, 72, 153, 0.2);
        }

        .glow-border {
          border-image: linear-gradient(45deg, #3b82f6, #8b5cf6, #ec4899) 1;
          box-shadow: 0 0 15px rgba(59, 130, 246, 0.3),
                      inset 0 0 15px rgba(59, 130, 246, 0.2);
        }

        /* Typewriter cursor glow */
        .typewriter-cursor {
          animation: typing-glow 1.5s ease-in-out infinite;
        }

        /* Smooth transitions */
        .animate-float {
          transition: transform 6s ease-in-out;
        }
      `}</style>
    </section>
  )
}

export default Hero