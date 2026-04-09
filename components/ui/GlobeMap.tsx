'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface GlobeMapProps {
    contentVisible?: boolean
}

export default function GlobeMap({ contentVisible = true }: GlobeMapProps) {
    const mountRef = useRef<HTMLDivElement>(null)
    const frameRef = useRef<number | null>(null)

    useEffect(() => {
        const mount = mountRef.current
        if (!mount) return

        // Use getBoundingClientRect for accurate dimensions after layout
        const rect = mount.getBoundingClientRect()
        const W = rect.width || mount.offsetWidth || 400
        const H = rect.height || mount.offsetHeight || 400

        /* ── Renderer ── */
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        renderer.setSize(W, H)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.setClearColor(0x000000, 0)

        // Pin the canvas inside the mount div — this is what fixes the top-left escape
        const canvas = renderer.domElement
        canvas.style.display = 'block'
        canvas.style.position = 'absolute'
        canvas.style.top = '0'
        canvas.style.left = '0'
        canvas.style.width = '100%'
        canvas.style.height = '100%'

        mount.appendChild(canvas)

        /* ── Scene & Camera ── */
        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100)
        camera.position.z = 2.8

        /* ── Texture loader ── */
        const loader = new THREE.TextureLoader()

        /* ── Globe ── */
        const globe = new THREE.Group()
        scene.add(globe)

        const sphereGeo = new THREE.SphereGeometry(1, 64, 64)
        const worldTex = loader.load('/world2.png')
        worldTex.colorSpace = THREE.SRGBColorSpace
        worldTex.anisotropy = renderer.capabilities.getMaxAnisotropy()
        worldTex.minFilter = THREE.LinearFilter

        const sphereMat = new THREE.MeshPhongMaterial({
            map: worldTex,
            specular: new THREE.Color(0x333366),
            shininess: 18,
        })
        globe.add(new THREE.Mesh(sphereGeo, sphereMat))

        /* ── Atmosphere / Blur completely removed ── */
        // (Atmosphere shells removed to make the globe edges super sharp without fuzzy glows)

        /* ── Stars ── */
        const starCount = 800
        const starPositions = new Float32Array(starCount * 3)
        for (let i = 0; i < starCount; i++) {
            const theta = Math.random() * Math.PI * 2
            const phi = Math.acos(2 * Math.random() - 1)
            const r = 8 + Math.random() * 4
            starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
            starPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
            starPositions[i * 3 + 2] = r * Math.cos(phi)
        }
        const starGeo = new THREE.BufferGeometry()
        starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))
        scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.04, transparent: true, opacity: 0.7 })))

        /* ── Hotspot markers ── */
        const latLonTo3D = (lat: number, lon: number, radius = 1.015) => {
            const phi = (90 - lat) * (Math.PI / 180)
            const theta = (lon + 180) * (Math.PI / 180)
            return new THREE.Vector3(
                -radius * Math.sin(phi) * Math.cos(theta),
                radius * Math.cos(phi),
                radius * Math.sin(phi) * Math.sin(theta),
            )
        }

        const hotspots = [
            { lat: 40, lon: -74, color: 0x818cf8 },
            { lat: 51, lon: 0, color: 0x34d399 },
            { lat: 30, lon: 31, color: 0xfb923c },
            { lat: 28, lon: 77, color: 0xf472b6 },
            { lat: -23, lon: -46, color: 0x4ade80 },
            { lat: 25, lon: 45, color: 0xfbbf24 },
            { lat: -25, lon: 135, color: 0x38bdf8 },
        ]

        const dotGroup = new THREE.Group()
        globe.add(dotGroup)

        hotspots.forEach(hs => {
            const pos = latLonTo3D(hs.lat, hs.lon)
            const dot = new THREE.Mesh(
                new THREE.SphereGeometry(0.022, 12, 12),
                new THREE.MeshBasicMaterial({ color: hs.color })
            )
            dot.position.copy(pos)
            dotGroup.add(dot)

            const ring = new THREE.Mesh(
                new THREE.TorusGeometry(0.045, 0.007, 8, 32),
                new THREE.MeshBasicMaterial({
                    color: hs.color,
                    transparent: true,
                    opacity: 0.7,
                    blending: THREE.AdditiveBlending,
                    depthWrite: false,
                })
            )
            ring.position.copy(pos)
            ring.lookAt(0, 0, 0)
            dotGroup.add(ring)
        })

        /* ── Lights ── */
        scene.add(new THREE.AmbientLight(0x334466, 0.7))
        const sun = new THREE.DirectionalLight(0xffffff, 1.4)
        sun.position.set(5, 3, 5)
        scene.add(sun)
        const rim = new THREE.DirectionalLight(0x4444ff, 0.5)
        rim.position.set(-5, -2, -5)
        scene.add(rim)

        /* ── Resize Observer for sharp rendering ── */
        const resizeObserver = new ResizeObserver((entries) => {
            if (!entries.length) return
            const { width, height } = entries[0].contentRect
            if (width > 0 && height > 0) {
                camera.aspect = width / height
                camera.updateProjectionMatrix()
                renderer.setSize(width, height)
            }
        })
        resizeObserver.observe(mount)

        /* ── Render loop ── */
        const clock = new THREE.Clock()
        let t = 0

        const tick = () => {
            frameRef.current = requestAnimationFrame(tick)
            const delta = clock.getDelta()
            t += delta

            globe.rotation.y += delta * 0.12
            globe.rotation.x = Math.sin(t * 0.15) * 0.08

            const zCenter = (1.9 + 3.2) / 2
            const zAmp = (3.2 - 1.9) / 2
            camera.position.z = zCenter + Math.sin((t / 8) * Math.PI * 2) * zAmp

            dotGroup.children.forEach((child, i) => {
                if (child instanceof THREE.Mesh && child.geometry instanceof THREE.TorusGeometry) {
                    child.scale.setScalar(1 + 0.35 * Math.sin(t * 2.2 + i * 0.9));
                    (child.material as THREE.MeshBasicMaterial).opacity =
                        0.55 + 0.45 * Math.abs(Math.sin(t * 1.8 + i * 0.7))
                }
            })

            renderer.render(scene, camera)
        }
        tick()

        /* ── Cleanup ── */
        return () => {
            resizeObserver.disconnect()
            if (frameRef.current) cancelAnimationFrame(frameRef.current)
            renderer.dispose()
            if (mount.contains(canvas)) mount.removeChild(canvas)
        }
    }, [])

    return (
        <div
            ref={mountRef}
            style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                overflow: 'hidden',
            }}
        />
    )
}