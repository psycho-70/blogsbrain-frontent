'use client'

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { useTheme } from "@/contexts/ThemeContext"

export default function AdvancedCursor() {
  const mountRef = useRef<HTMLDivElement>(null)
  const { isDark } = useTheme()

  useEffect(() => {
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 30

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 0)
    mountRef.current?.appendChild(renderer.domElement)

    const maxPoints = 60

    // Dark mode: full rainbow HSL trails
    // Light mode: cooler blue/indigo/violet tones (hue 0.55–0.80 range)
    const trailConfigs = [
      { lerp: 0.12, colorOffset: 0,    lineWidth: 1,   cx: 0, cy: 0 },
      { lerp: 0.07, colorOffset: 0.33, lineWidth: 0.7, cx: 0, cy: 0 },
      { lerp: 0.04, colorOffset: 0.66, lineWidth: 0.4, cx: 0, cy: 0 },
    ]

    const trails = trailConfigs.map((cfg) => {
      const points = Array(maxPoints).fill(null).map(() => new THREE.Vector3(0, 0, 0))
      const geometry = new THREE.BufferGeometry().setFromPoints(points)

      const colors = new Float32Array(maxPoints * 3)
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3))

      const material = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: isDark ? 0.9 : 0.65,
        linewidth: cfg.lineWidth,
      })

      const line = new THREE.Line(geometry, material)
      scene.add(line)

      return { ...cfg, points, geometry, line, material }
    })

    const mouseTarget = new THREE.Vector2()
    const mouseCurrents = trailConfigs.map(() => new THREE.Vector2())

    const onMouseMove = (e: MouseEvent) => {
      mouseTarget.x = (e.clientX / window.innerWidth) * 2 - 1
      mouseTarget.y = -(e.clientY / window.innerHeight) * 2 + 1

      const dot = document.getElementById('custom-cursor-dot')
      if (dot) {
        dot.style.opacity = '1'
        dot.style.left = `${e.clientX}px`
        dot.style.top = `${e.clientY}px`
      }
    }
    window.addEventListener("mousemove", onMouseMove)

    // Background particles — muted in light, vibrant in dark
    const particlesGeometry = new THREE.BufferGeometry()
    const particlesCount = 200
    const posArray = new Float32Array(particlesCount * 3)
    for (let i = 0; i < particlesCount * 3; i += 3) {
      posArray[i]     = (Math.random() - 0.5) * 150
      posArray[i + 1] = (Math.random() - 0.5) * 150
      posArray[i + 2] = (Math.random() - 0.5) * 150
    }
    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(posArray, 3))
    const particlesMaterial = new THREE.PointsMaterial({
      size: isDark ? 0.2 : 0.15,
      color: isDark ? "#8b5cf6" : "#6366f1",
      transparent: true,
      opacity: isDark ? 0.4 : 0.18,
      blending: THREE.AdditiveBlending,
    })
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial)
    scene.add(particlesMesh)

    let colorTime = 0

    function animate() {
      requestAnimationFrame(animate)
      colorTime += 0.005

      trails.forEach((trail, ti) => {
        mouseCurrents[ti].lerp(mouseTarget, trail.lerp)

        const vector = new THREE.Vector3(
          mouseCurrents[ti].x,
          mouseCurrents[ti].y,
          0.5
        ).unproject(camera)

        trail.points.push(vector.clone())
        if (trail.points.length > maxPoints) trail.points.shift()

        trail.geometry.setFromPoints(trail.points)

        const colorAttr = trail.geometry.attributes.color
        for (let i = 0; i < maxPoints; i++) {
          let hue: number
          if (isDark) {
            // Full spectrum rainbow
            hue = ((i / maxPoints) + colorTime + trail.colorOffset) % 1
          } else {
            // Constrained to blue → indigo → violet (0.55–0.80)
            hue = 0.55 + (((i / maxPoints) + colorTime * 0.5 + trail.colorOffset) % 1) * 0.25
          }

          const lightness = isDark ? 0.6 : 0.45
          const saturation = isDark ? 1.0 : 0.8

          const color = new THREE.Color().setHSL(hue, saturation, lightness)
          colorAttr.array[i * 3]     = color.r
          colorAttr.array[i * 3 + 1] = color.g
          colorAttr.array[i * 3 + 2] = color.b
        }
        colorAttr.needsUpdate = true
      })

      particlesMesh.rotation.y += 0.0002
      particlesMesh.rotation.x += 0.0001

      renderer.render(scene, camera)
    }

    animate()

    const resize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener("resize", resize)

    return () => {
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", onMouseMove)
      if (mountRef.current?.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
      trails.forEach(t => {
        t.geometry.dispose()
        t.line.material.dispose()
      })
      particlesGeometry.dispose()
      particlesMaterial.dispose()
    }
  }, [isDark]) // re-run when theme changes

  // Dot styles adapt to theme
  const dotGlow = isDark
    ? "0 0 10px rgba(255,255,255,0.8), 0 0 20px #8b5cf6"
    : "0 0 8px rgba(99,102,241,0.6), 0 0 16px rgba(99,102,241,0.3)"

  const dotColor = isDark ? "#ffffff" : "#4f46e5"

  return (
    <>
      <style jsx global>{`
        * { cursor: none !important; }

        canvas {
          display: block;
          position: fixed;
          top: 0;
          left: 0;
          pointer-events: none;
          z-index: 9998;
          background: transparent !important;
        }

        .custom-cursor-dot {
          position: fixed;
          top: 0;
          left: 0;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
          z-index: 9999;
          opacity: 0;
          transition: opacity 0.3s, background-color 0.4s, box-shadow 0.4s;
        }
      `}</style>

      <div
        id="custom-cursor-dot"
        className="custom-cursor-dot"
        style={{ backgroundColor: dotColor, boxShadow: dotGlow }}
      />

      <div
        ref={mountRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{ background: 'transparent' }}
      />
    </>
  )
}