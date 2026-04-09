'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

type AnimMode = 'idle' | 'wave' | 'shake' | 'dance' | 'spin' | 'think'

interface AnimatedRobotProps {
  mode?: AnimMode | 'auto'
  size?: number
  showGlow?: boolean
  yellowBg?: boolean
  onAutoCycle?: (mode: AnimMode) => void
}

export default function AnimatedRobot({
  mode = 'auto',
  size = 120,
  showGlow = true,
  yellowBg = true,
  onAutoCycle,
}: AnimatedRobotProps) {
  const wrapRef    = useRef<HTMLDivElement>(null)
  const imgRef     = useRef<HTMLDivElement>(null)
  const eyeLRef    = useRef<HTMLDivElement>(null)
  const eyeRRef    = useRef<HTMLDivElement>(null)
  const blinkLRef  = useRef<HTMLDivElement>(null)
  const blinkRRef  = useRef<HTMLDivElement>(null)
  const chestRef   = useRef<HTMLDivElement>(null)
  const ant1Ref    = useRef<HTMLDivElement>(null)
  const ant2Ref    = useRef<HTMLDivElement>(null)
  const rafRef     = useRef<number | null>(null)
  const modeRef    = useRef<AnimMode>('idle')
  const [currentMode, setCurrentMode] = useState<AnimMode>('idle')

  // Auto mode sequence with welcome behavior
  useEffect(() => {
    if (mode !== 'auto') {
      setCurrentMode(mode)
      modeRef.current = mode
      return
    }

    // Welcome sequence: first 2 seconds wave + slight bow (special intro)
    let step = 0 // 0: welcome wave, 1: rest of sequence
    let timeoutId: NodeJS.Timeout

    const runWelcome = () => {
      setCurrentMode('wave')
      modeRef.current = 'wave'
      onAutoCycle?.('wave')
      
      // After 2 seconds of waving, start the normal cycle
      timeoutId = setTimeout(() => {
        step = 1
        // Start cycling through modes
        cycleThroughModes()
      }, 2000)
    }

    const modes: AnimMode[] = ['idle', 'think', 'dance', 'shake', 'spin', 'idle', 'wave']
    let modeIndex = 0

    const cycleThroughModes = () => {
      if (mode !== 'auto') return
      
      // Skip if we're still in welcome phase
      if (step === 0) return
      
      // Update mode every 4 seconds
      modeIndex = (modeIndex + 1) % modes.length
      const newMode = modes[modeIndex]
      setCurrentMode(newMode)
      modeRef.current = newMode
      onAutoCycle?.(newMode)
      
      timeoutId = setTimeout(cycleThroughModes, 4000)
    }

    runWelcome()

    return () => {
      clearTimeout(timeoutId)
    }
  }, [mode, onAutoCycle])

  // Sync modeRef when currentMode changes (for external mode changes)
  useEffect(() => {
    if (mode !== 'auto') {
      modeRef.current = currentMode
    }
  }, [currentMode, mode])

  useEffect(() => {
    const imgEl   = imgRef.current
    const eyeL    = eyeLRef.current
    const eyeR    = eyeRRef.current
    const blinkL  = blinkLRef.current
    const blinkR  = blinkRRef.current
    const chest   = chestRef.current
    const ant1    = ant1Ref.current
    const ant2    = ant2Ref.current
    if (!imgEl) return

    /* ─── helpers ─── */
    function setImg(tx = 0, ty = 0, rot = 0, scaleX = 1, scaleY = 1, rotY = 0, rotZ = 0) {
      // Add 3D perspective transforms: rotateY for spin, rotateZ for tilt
      imgEl!.style.transform =
        `translate(${tx}px,${ty}px) rotateY(${rotY}deg) rotateX(${rotZ}deg) rotate(${rot}deg) scaleX(${scaleX}) scaleY(${scaleY})`
    }

    function autoBlink(t: number) {
      const cycle = t % 4
      return cycle < 0.12 ? Math.sin((cycle / 0.12) * Math.PI) : 0
    }

    function setBlink(v: number) {
      if (blinkL) blinkL.style.transform = `scaleY(${v})`
      if (blinkR) blinkR.style.transform = `scaleY(${v})`
    }

    function setGlowIntensity(v: number) {
      if (!showGlow) return
      const o = String(Math.max(0, Math.min(1, v)))
      if (chest) chest.style.opacity = o
      if (ant1)  ant1.style.opacity  = o
      if (ant2)  ant2.style.opacity  = o
    }

    /* ─── animation loop with 3D effects ─── */
    function tick(ts: number) {
      rafRef.current = requestAnimationFrame(tick)
      const t = ts / 1000
      const blink = autoBlink(t)
      const m = modeRef.current

      if (m === 'idle') {
        const hover = Math.sin(t * 1.4) * 5
        const sway  = Math.sin(t * 0.7) * 1.5
        const breath3D = Math.sin(t * 1.2) * 1.5  // subtle 3D tilt
        setImg(0, hover, sway, 1, 1, 0, breath3D)
        setBlink(blink)
        setGlowIntensity(0.7 + 0.3 * Math.sin(t * 2))
        if (ant1) ant1.style.transform = ''
        if (ant2) ant2.style.transform = ''
      }

      else if (m === 'wave') {
        const hover = Math.sin(t * 1.4) * 4
        const lean  = Math.sin(t * 5) * 4
        const sX    = 1 + Math.sin(t * 10) * 0.03
        // Welcome bow effect: extra tilt in first 2 seconds
        const welcomeBow = t < 2 ? Math.sin(t * Math.PI) * 8 : 0
        setImg(Math.sin(t * 3) * 3, hover + welcomeBow * 0.3, lean + welcomeBow, sX, 1)
        setBlink(blink)
        setGlowIntensity(0.8 + 0.2 * Math.sin(t * 5))
        if (ant1) ant1.style.transform = `rotate(${Math.sin(t * 5) * 20}deg)`
        if (ant2) ant2.style.transform = `rotate(${-Math.sin(t * 5) * 20}deg)`
      }

      else if (m === 'shake') {
        const intensity = Math.max(0, Math.sin(t * 1.5))
        const shakeX   = Math.sin(t * 14) * 7 * intensity
        const shakeY   = Math.cos(t * 10) * 3
        const lean     = Math.sin(t * 14) * 5
        const shake3D  = Math.sin(t * 16) * 3 * intensity  // 3D wobble
        setImg(shakeX, shakeY, lean, 1, 1, 0, shake3D)
        setBlink(blink || (Math.sin(t * 8) > 0.9 ? 0.9 : 0))
        setGlowIntensity(0.5 + 0.5 * Math.abs(Math.sin(t * 6)))
        if (ant1) ant1.style.transform = `translateX(${Math.sin(t * 14) * 4}px)`
        if (ant2) ant2.style.transform = `translateX(${-Math.sin(t * 14) * 4}px)`
      }

      else if (m === 'dance') {
        const bounce = Math.abs(Math.sin(t * 3.5)) * -14
        const tilt   = Math.sin(t * 3.5) * 14
        const sX     = 1 + Math.sin(t * 7) * 0.05
        const sY     = 1 - Math.abs(Math.sin(t * 7)) * 0.07
        const dance3D = Math.sin(t * 7) * 5  // dance with 3D rotation
        setImg(Math.sin(t * 3.5) * 6, bounce, tilt, sX, sY, 0, dance3D)
        setBlink(blink)
        setGlowIntensity(0.5 + 0.5 * Math.abs(Math.sin(t * 7)))
        if (ant1) ant1.style.transform = `rotate(${t * 200 % 360}deg)`
        if (ant2) ant2.style.transform = `rotate(${-(t * 200 % 360)}deg)`
      }

      else if (m === 'spin') {
        const deg   = (t * 160) % 360
        const hover = Math.sin(t * 2) * 4
        // Full 3D spin with perspective - rotateY gives true 3D rotation
        setImg(0, hover, 0, 1, 1, deg, 0)
        setBlink(blink)
        setGlowIntensity(0.4 + 0.6 * Math.abs(Math.sin(t * 3)))
        if (ant1) ant1.style.transform = ''
        if (ant2) ant2.style.transform = ''
      }

      else if (m === 'think') {
        const hover = Math.sin(t * 0.8) * 3
        const tilt  = Math.sin(t * 0.4) * 6
        const think3D = Math.sin(t * 0.6) * 2
        setImg(-4, hover, tilt, 1, 1, 0, think3D)
        const thinkBlink = (t % 2 < 0.1) ? Math.sin((t % 2 / 0.1) * Math.PI) : 0
        setBlink(Math.max(blink, thinkBlink))
        setGlowIntensity(0.4 + 0.6 * Math.abs(Math.sin(t * 1.2)))
        if (ant1) ant1.style.transform = `scale(${1 + 0.3 * Math.abs(Math.sin(t * 3))})`
        if (ant2) ant2.style.transform = `scale(${1 + 0.3 * Math.abs(Math.sin(t * 3 + 1))})`
      }
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [showGlow])

  /* ─── scale helpers ─── */
  const eyeW     = size * 0.136
  const eyeH     = size * 0.079
  const eyeLLeft = size * 0.236
  const eyeRRight= size * 0.236
  const eyeTop   = size * 0.264
  const chestS   = size * 0.09
  const chestTop = size * 0.581
  const antS     = size * 0.04
  const antTop   = size * 0.007
  const antLLeft = size * 0.309
  const antRRight= size * 0.309

  return (
    <div
      ref={wrapRef}
      style={{
        position: 'relative',
        width: size,
        height: size * (4 / 3),
        display: 'inline-block',
        // ...(yellowBg && {
        //   backgroundColor: '#FFD700',
        //   borderRadius: '24px',
        //   boxShadow: '0 20px 35px -10px rgba(0,0,0,0.2), inset 0 1px 4px rgba(255,255,200,0.8)',
        //   padding: '12px',
        // }),
      }}
    >
      {/* 3D Perspective Container */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          perspective: yellowBg ? '800px' : 'none',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* robot image — animated wrapper with 3D transform style */}
        <div
          ref={imgRef}
          style={{
            position: 'absolute',
            inset: 0,
            transformOrigin: '50% 95%',
            transformStyle: 'preserve-3d',
            willChange: 'transform',
          }}
        >
          <Image
            src="/robot3.png"
            alt="Einsteine AI robot"
            fill
            style={{ objectFit: 'contain' }}
            priority
          />
        </div>
      </div>

      {/* Left eye glow overlay - also gets 3D perspective if needed */}
      <div
        ref={eyeLRef}
        style={{
          position: 'absolute',
          width: eyeW,
          height: eyeH,
          top: eyeTop,
          left: eyeLLeft,
          borderRadius: '50%',
          // background: 'radial-gradient(circle at 40% 35%, #a0d8ff, #1a8fff, #003acc)',
          // boxShadow: '0 0 10px 3px #3af, 0 0 22px 7px #06f8',
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      >
        <div
          ref={blinkLRef}
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: '#c8962a',
            transform: 'scaleY(0)',
            transformOrigin: '50% 50%',
          }}
        />
      </div>

      {/* Right eye glow overlay */}
      <div
        ref={eyeRRef}
        style={{
          position: 'absolute',
          width: eyeW,
          height: eyeH,
          top: eyeTop,
          right: eyeRRight,
          borderRadius: '50%',
          // background: 'radial-gradient(circle at 40% 35%, #a0d8ff, #1a8fff, #003acc)',
          // boxShadow: '0 0 10px 3px #3af, 0 0 22px 7px #06f8',
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      >
        <div
          ref={blinkRRef}
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            // background: '#c8962a',
            transform: 'scaleY(0)',
            transformOrigin: '50% 50%',
          }}
        />
      </div>

      {/* Chest arc reactor glow */}
      {showGlow && (
        <div
          ref={chestRef}
          style={{
            position: 'absolute',
            width: chestS,
            height: chestS,
            top: chestTop,
            left: '50%',
            transform: 'translateX(-50%)',
            borderRadius: '50%',
            // background: 'radial-gradient(circle, #fff 10%, #3af 50%, transparent 80%)',
            // boxShadow: '0 0 16px 5px #3af, 0 0 32px 10px #06f5',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Antenna 1 glow */}
      {showGlow && (
        <div
          ref={ant1Ref}
          style={{
            position: 'absolute',
            width: antS,
            height: antS,
            top: antTop,
            left: antLLeft,
            borderRadius: '50%',
            // background: '#ffe066',
            // boxShadow: '0 0 8px 3px #ffd700, 0 0 18px 6px #ffa50099',
            pointerEvents: 'none',
            transformOrigin: 'center center',
          }}
        />
      )}

      {/* Antenna 2 glow */}
      {showGlow && (
        <div
          ref={ant2Ref}
          style={{
            position: 'absolute',
            width: antS,
            height: antS,
            top: antTop,
            right: antRRight,
            borderRadius: '50%',
            // background: '#ffe066',
            // boxShadow: '0 0 8px 3px #ffd700, 0 0 18px 6px #ffa50099',
            pointerEvents: 'none',
            transformOrigin: 'center center',
          }}
        />
      )}
    </div>
  )
}