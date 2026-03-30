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

    const maxPoints = 60

    // Three trail configs — speed, color offset, line width
    const trailConfigs = [
      { lerp: 0.12, colorOffset: 0,    lineWidth: 1,   cx: 0, cy: 0 },
      { lerp: 0.07, colorOffset: 0.33, lineWidth: 0.7, cx: 0, cy: 0 },
      { lerp: 0.04, colorOffset: 0.66, lineWidth: 0.4, cx: 0, cy: 0 },
    ]

    // Build a line + geometry for each trail
    const trails = trailConfigs.map((cfg) => {
      const points = Array(maxPoints).fill(null).map(() => new THREE.Vector3(0, 0, 0))
      const geometry = new THREE.BufferGeometry().setFromPoints(points)

      const colors = new Float32Array(maxPoints * 3)
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3))

      const material = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        linewidth: cfg.lineWidth, // note: only works in WebGL2 with specific extensions
      })

      const line = new THREE.Line(geometry, material)
      scene.add(line)

      return { ...cfg, points, geometry, line }
    })

    // Shared mouse target
    const mouseTarget = new THREE.Vector2()

    // Per-trail current mouse position (each lerps independently)
    const mouseCurrents = trailConfigs.map(() => new THREE.Vector2())

    window.addEventListener("mousemove", (e) => {
      mouseTarget.x = (e.clientX / window.innerWidth) * 2 - 1
      mouseTarget.y = -(e.clientY / window.innerHeight) * 2 + 1
    })

    // Background particles
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
      size: 0.2,
      color: "#8b5cf6",
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
    })
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial)
    scene.add(particlesMesh)

    let colorTime = 0

    function animate() {
      requestAnimationFrame(animate)
      colorTime += 0.005

      trails.forEach((trail, ti) => {
        // Each trail lerps toward the mouse at its own speed
        mouseCurrents[ti].lerp(mouseTarget, trail.lerp)

        const vector = new THREE.Vector3(
          mouseCurrents[ti].x,
          mouseCurrents[ti].y,
          0.5
        ).unproject(camera)

        trail.points.push(vector.clone())
        if (trail.points.length > maxPoints) trail.points.shift()

        trail.geometry.setFromPoints(trail.points)

        // Animate colors with per-trail hue offset
        const colorAttr = trail.geometry.attributes.color
        for (let i = 0; i < maxPoints; i++) {
          const hue = ((i / maxPoints) + colorTime + trail.colorOffset) % 1
          const color = new THREE.Color().setHSL(hue, 1, 0.6)
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
      window.removeEventListener("mousemove", () => {})
      mountRef.current?.removeChild(renderer.domElement)
      renderer.dispose()
      trails.forEach(t => {
        t.geometry.dispose()
        t.line.material.dispose()
      })
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