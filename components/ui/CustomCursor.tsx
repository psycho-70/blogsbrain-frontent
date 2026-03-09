'use client'

import { useEffect, useRef } from "react"
import * as THREE from "three"

export default function AdvancedCursor() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 30

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 0)
    mountRef.current?.appendChild(renderer.domElement)

    const maxPoints = 60 // Reduced for better performance
    const points: THREE.Vector3[] = Array(maxPoints).fill(null).map(() => new THREE.Vector3(0, 0, 0))

    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    
    // Pre-calculate colors with smooth gradient flow
    const colors = new Float32Array(maxPoints * 3)
    const colorTime = { value: 0 }

    // Initialize colors with rainbow gradient
    for (let i = 0; i < maxPoints; i++) {
      const hue = (i / maxPoints) * 2 // Wrap around twice for more dynamic flow
      const color = new THREE.Color().setHSL(hue, 1, 0.6)
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
    }
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3))

    const material = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.9 })
    const line = new THREE.Line(geometry, material)
    scene.add(line)

    // Mouse tracking with lerp for smoothness
    const mouseTarget = new THREE.Vector2()
    const mouseCurrent = new THREE.Vector2()

    window.addEventListener("mousemove", (e) => {
      mouseTarget.x = (e.clientX / window.innerWidth) * 2 - 1
      mouseTarget.y = -(e.clientY / window.innerHeight) * 2 + 1
    })

    // Optimized particles (reduced count)
    const particlesGeometry = new THREE.BufferGeometry()
    const particlesCount = 200
    const posArray = new Float32Array(particlesCount * 3)

    for (let i = 0; i < particlesCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 150
      posArray[i + 1] = (Math.random() - 0.5) * 150
      posArray[i + 2] = (Math.random() - 0.5) * 150
    }

    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(posArray, 3))
    
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.2,
      color: "#8b5cf6",
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending
    })

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial)
    scene.add(particlesMesh)

    // Animation loop
    function animate() {
      requestAnimationFrame(animate)

      // Smooth mouse interpolation
      mouseCurrent.lerp(mouseTarget, 0.15)

      // Update trail
      const vector = new THREE.Vector3(mouseCurrent.x, mouseCurrent.y, 0.5).unproject(camera)
      
      points.push(vector)
      if (points.length > maxPoints) points.shift()
      
      geometry.setFromPoints(points)

      // Animate colors - continuous flow
      colorTime.value += 0.005
      const colorAttr = geometry.attributes.color
      
      for (let i = 0; i < maxPoints; i++) {
        // Create flowing rainbow effect - colors shift continuously
        const hue = ((i / maxPoints) + colorTime.value) % 1
        const color = new THREE.Color().setHSL(hue, 1, 0.6)
        colorAttr.array[i * 3] = color.r
        colorAttr.array[i * 3 + 1] = color.g
        colorAttr.array[i * 3 + 2] = color.b
      }
      colorAttr.needsUpdate = true

      // Animate background particles
      particlesMesh.rotation.y += 0.0002
      particlesMesh.rotation.x += 0.0001

      renderer.render(scene, camera)
    }

    animate()

    // Resize handler
    const resize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener("resize", resize)

    // Cleanup
    return () => {
      window.removeEventListener("resize", resize)
      mountRef.current?.removeChild(renderer.domElement)
      renderer.dispose()
    }
  }, [])

  return (
    <>
      <style jsx global>{`
        body { cursor: auto !important; }
        canvas {
          display: block;
          position: fixed;
          top: 0;
          left: 0;
          pointer-events: none;
          z-index: 9999;
          background: transparent !important;
        }
      `}</style>
      <div ref={mountRef} className="fixed top-0 left-0 pointer-events-none z-[9999]" style={{ background: 'transparent' }} />
    </>
  )
}