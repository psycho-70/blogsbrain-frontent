'use client'

import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { useTheme } from '@/contexts/ThemeContext'

const GlobeStarsBackground = () => {
    const mountRef = useRef<HTMLDivElement>(null)
    const sceneRef = useRef<THREE.Scene | null>(null)
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
    const globeRef = useRef<THREE.Mesh | null>(null)
    const starsRef = useRef<THREE.Points | null>(null)
    const frameRef = useRef<number | null>(null)
    const { isDark } = useTheme()

    useEffect(() => {
        if (!mountRef.current) return

        const mount = mountRef.current
        const width = window.innerWidth
        const height = window.innerHeight

        /* ── Scene ── */
        const scene = new THREE.Scene()
        sceneRef.current = scene

        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
        camera.position.z = 3.5
        cameraRef.current = camera

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        renderer.setSize(width, height)
        renderer.setClearColor(0x000000, 0)
        mount.appendChild(renderer.domElement)
        rendererRef.current = renderer

        /* ── Globe / Earth ── */
        const geometry = new THREE.SphereGeometry(1.2, 64, 64)
        const textureLoader = new THREE.TextureLoader()
        const earthTexture = textureLoader.load(
            'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg'
        )
        earthTexture.colorSpace = THREE.SRGBColorSpace

        const material = new THREE.MeshPhongMaterial({
            map: earthTexture,
            shininess: isDark ? 5 : 15,
            specular: new THREE.Color(isDark ? 0x111111 : 0x4422aa),
        })

        const earth = new THREE.Mesh(geometry, material)
        scene.add(earth)
        globeRef.current = earth

        /* ── Atmosphere ── */
        const atmosphereGeometry = new THREE.SphereGeometry(1.22, 64, 64)
        const atmosphereMaterial = new THREE.MeshPhongMaterial({
            color: isDark ? 0x3a6eff : 0x8b5cf6,
            transparent: true,
            opacity: isDark ? 0.15 : 0.08,
            side: THREE.BackSide,
        })
        const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial)
        scene.add(atmosphere)

        /* ── Stars (dark mode only) ── */
        let starsMaterial: THREE.PointsMaterial | null = null
        let twinkleMaterial: THREE.PointsMaterial | null = null

        if (isDark) {
            const starsGeometry = new THREE.BufferGeometry()
            const starsCount = 10000
            const starsPositions = new Float32Array(starsCount * 3)
            for (let i = 0; i < starsCount; i++) {
                starsPositions[i * 3] = (Math.random() - 0.5) * 200
                starsPositions[i * 3 + 1] = (Math.random() - 0.5) * 100
                starsPositions[i * 3 + 2] = (Math.random() - 0.5) * 50 - 20
            }
            starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPositions, 3))
            starsMaterial = new THREE.PointsMaterial({
                color: 0xffffff,
                size: 0.08,
                transparent: true,
                opacity: 0.6,
            })
            const stars = new THREE.Points(starsGeometry, starsMaterial)
            scene.add(stars)
            starsRef.current = stars

            /* Twinkling stars */
            const twinkleCount = 5000
            const twinklePositions = new Float32Array(twinkleCount * 3)
            for (let i = 0; i < twinkleCount; i++) {
                twinklePositions[i * 3] = (Math.random() - 0.5) * 180
                twinklePositions[i * 3 + 1] = (Math.random() - 0.5) * 90
                twinklePositions[i * 3 + 2] = (Math.random() - 0.5) * 40 - 15
            }
            const twinkleGeometry = new THREE.BufferGeometry()
            twinkleGeometry.setAttribute('position', new THREE.BufferAttribute(twinklePositions, 3))
            twinkleMaterial = new THREE.PointsMaterial({
                color: 0xaaccff,
                size: 0.04,
                transparent: true,
                opacity: 0.4,
            })
            scene.add(new THREE.Points(twinkleGeometry, twinkleMaterial))
        } else {
            /* ── Light mode: floating soft orbs instead of stars ── */
            const orbCount = 120
            const orbPositions = new Float32Array(orbCount * 3)
            for (let i = 0; i < orbCount; i++) {
                orbPositions[i * 3] = (Math.random() - 0.5) * 30
                orbPositions[i * 3 + 1] = (Math.random() - 0.5) * 20
                orbPositions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5
            }
            const orbGeo = new THREE.BufferGeometry()
            orbGeo.setAttribute('position', new THREE.BufferAttribute(orbPositions, 3))
            starsMaterial = new THREE.PointsMaterial({
                color: 0x8b5cf6,
                size: 0.06,
                transparent: true,
                opacity: 0.15,
            })
            scene.add(new THREE.Points(orbGeo, starsMaterial))
        }

        /* ── Lights ── */
        if (isDark) {
            scene.add(new THREE.AmbientLight(0x404060, 0.5))
            const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
            directionalLight.position.set(5, 3, 5)
            scene.add(directionalLight)
            const backLight = new THREE.PointLight(0x4466ff, 0.3)
            backLight.position.set(-2, 1, -3)
            scene.add(backLight)
        } else {
            scene.add(new THREE.AmbientLight(0xc4b5fd, 0.9))
            const sunLight = new THREE.DirectionalLight(0xffffff, 1.6)
            sunLight.position.set(5, 3, 5)
            scene.add(sunLight)
            const fillLight = new THREE.DirectionalLight(0xddd6fe, 0.5)
            fillLight.position.set(-3, 2, -3)
            scene.add(fillLight)
        }

        /* ── Animation ── */
        let time = 0
        const animate = () => {
            frameRef.current = requestAnimationFrame(animate)
            time += 0.002

            if (globeRef.current) {
                globeRef.current.rotation.y = time * 0.2
            }
            atmosphere.rotation.y = time * 0.2

            if (starsRef.current) {
                starsRef.current.rotation.y = time * 0.02
                starsRef.current.rotation.x = Math.sin(time * 0.05) * 0.1
            }

            if (isDark && twinkleMaterial && starsMaterial) {
                twinkleMaterial.opacity = 0.4 + Math.sin(time * 3) * 0.1
                starsMaterial.opacity = 0.6 + Math.sin(time * 2) * 0.1
            } else if (!isDark && starsMaterial) {
                // gentle pulse for light mode orbs
                starsMaterial.opacity = 0.12 + Math.sin(time * 1.5) * 0.05
            }

            if (cameraRef.current) {
                cameraRef.current.position.x = Math.sin(time * 0.1) * 0.05
                cameraRef.current.position.y = Math.cos(time * 0.15) * 0.03
                cameraRef.current.lookAt(0, 0, 0)
            }

            if (rendererRef.current && sceneRef.current && cameraRef.current) {
                rendererRef.current.render(sceneRef.current, cameraRef.current)
            }
        }
        animate()

        /* ── Resize ── */
        const handleResize = () => {
            if (!mountRef.current) return
            const newWidth = window.innerWidth
            const newHeight = window.innerHeight
            if (cameraRef.current && rendererRef.current) {
                cameraRef.current.aspect = newWidth / newHeight
                cameraRef.current.updateProjectionMatrix()
                rendererRef.current.setSize(newWidth, newHeight)
            }
        }
        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
            if (frameRef.current) cancelAnimationFrame(frameRef.current)
            if (rendererRef.current) rendererRef.current.dispose()
            if (mountRef.current && rendererRef.current) {
                mountRef.current.removeChild(rendererRef.current.domElement)
            }
        }
    }, [isDark]) // re-init when theme changes

    return (
        <div
            ref={mountRef}
            className="absolute inset-0 pointer-events-none"
            style={{
                zIndex: 0,
                // In light mode the globe is very faint — it's purely decorative bg texture
                opacity: isDark ? 1 : 0.18,
            }}
        />
    )
}

export default GlobeStarsBackground