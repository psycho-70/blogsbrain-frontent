'use client'

import { useEffect, useRef, useCallback } from 'react'
import * as THREE from 'three'

type Phase = 'intact' | 'exploding' | 'scattered' | 'rejoining'

interface Fragment {
  mesh: THREE.Mesh
  homePos: THREE.Vector3
  explodePos: THREE.Vector3
  explodeRot: THREE.Euler
  angVel: THREE.Vector3
  delay: number
  _exploding: boolean
  _rejoining: boolean
  _rejoinDelay: number
  _rejoinProgress: number
}

export default function BoxExplosion() {
  const mountRef = useRef<HTMLDivElement>(null)
  const shockwaveRef = useRef<HTMLDivElement>(null)
  const flashRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const animFrameRef = useRef<number>(0)
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
  }, [])

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    // Nuke any leftover canvases from React StrictMode's double-invoke
    mount.querySelectorAll('canvas').forEach(c => c.remove())

    const W = mount.clientWidth  || 600
    const H = mount.clientHeight || 500

    // ─── Renderer ────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    // ─── Scene / Camera ──────────────────────────────────────────────────────
    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100)
    camera.position.set(4, 3.5, 6)
    camera.lookAt(0, 0, 0)
    const camOrigin = camera.position.clone()

    // ─── Lights ──────────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0x6366f1, 0.6))

    const keyLight = new THREE.PointLight(0xfbbf24, 2, 30)
    keyLight.position.set(3, 5, 3)
    keyLight.castShadow = true
    scene.add(keyLight)

    const rimLight = new THREE.DirectionalLight(0x818cf8, 0.8)
    rimLight.position.set(-5, 3, -5)
    scene.add(rimLight)

    scene.add(new THREE.PointLight(0xec4899, 0.4, 20)).position.set(-3, -2, 4)

    const boomLight = new THREE.PointLight(0xfbbf24, 0, 20)
    scene.add(boomLight)

    // ─── Fragments (3×3×3 = 27 chunks) ──────────────────────────────────────
    const GRID     = 3
    const BOX_SIZE = 2
    const CHUNK    = BOX_SIZE / GRID
    const fragments: Fragment[] = []

    const edgeMatBase = new THREE.LineBasicMaterial({
      color: 0x818cf8, transparent: true, opacity: 0.55,
    })

    for (let ix = 0; ix < GRID; ix++) {
      for (let iy = 0; iy < GRID; iy++) {
        for (let iz = 0; iz < GRID; iz++) {
          const hue = 220 + ((ix * 9 + iy * 3 + iz) * 17) % 60
          const geo = new THREE.BoxGeometry(CHUNK * 0.92, CHUNK * 0.92, CHUNK * 0.92)
          const mat = new THREE.MeshPhongMaterial({
            color:    new THREE.Color(`hsl(${hue}, 60%, 55%)`),
            emissive: new THREE.Color(`hsl(${hue}, 50%, 8%)`),
            specular: new THREE.Color(0x8888ff),
            shininess: 80,
            transparent: true,
            opacity: 1,
          })

          const mesh = new THREE.Mesh(geo, mat)
          mesh.castShadow    = true
          mesh.receiveShadow = true

          // Edge glow lines
          const line = new THREE.LineSegments(new THREE.EdgesGeometry(geo), edgeMatBase.clone())
          mesh.add(line)

          const homeX = (ix - 1) * CHUNK
          const homeY = (iy - 1) * CHUNK
          const homeZ = (iz - 1) * CHUNK

          const dir = new THREE.Vector3(
            homeX + (Math.random() - 0.5) * 0.3,
            homeY + (Math.random() - 0.5) * 0.3,
            homeZ + (Math.random() - 0.5) * 0.3,
          ).normalize()

          const frag: Fragment = {
            mesh,
            homePos:     new THREE.Vector3(homeX, homeY, homeZ),
            explodePos:  new THREE.Vector3(
              homeX + dir.x * (2.5 + Math.random() * 3),
              homeY + dir.y * (2.5 + Math.random() * 3),
              homeZ + dir.z * (2.5 + Math.random() * 3),
            ),
            explodeRot: new THREE.Euler(
              (Math.random() - 0.5) * Math.PI * 3,
              (Math.random() - 0.5) * Math.PI * 3,
              (Math.random() - 0.5) * Math.PI * 3,
            ),
            angVel: new THREE.Vector3(
              (Math.random() - 0.5) * 0.15,
              (Math.random() - 0.5) * 0.15,
              (Math.random() - 0.5) * 0.15,
            ),
            delay:           Math.random() * 0.3,
            _exploding:      false,
            _rejoining:      false,
            _rejoinDelay:    0,
            _rejoinProgress: 0,
          }

          mesh.position.copy(frag.homePos)
          scene.add(mesh)
          fragments.push(frag)
        }
      }
    }

    // ─── Subtle grid floor (transparent) ────────────────────────────────────
    const gridHelper = new THREE.GridHelper(12, 20, 0x3333aa, 0x222244)
    gridHelper.position.y = -2.5
    ;(gridHelper.material as THREE.Material).opacity    = 0.2
    ;(gridHelper.material as THREE.Material).transparent = true
    scene.add(gridHelper)

    // ─── Particles ───────────────────────────────────────────────────────────
    const PARTICLE_COUNT = 300
    const pPositions  = new Float32Array(PARTICLE_COUNT * 3)
    const pVelocities = Array.from({ length: PARTICLE_COUNT }, () => new THREE.Vector3())
    const pLifetimes  = new Float32Array(PARTICLE_COUNT)

    const pGeo = new THREE.BufferGeometry()
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3))

    const pMat = new THREE.PointsMaterial({
      color: 0xfbbf24, size: 0.06, transparent: true, opacity: 0,
      blending: THREE.AdditiveBlending, depthWrite: false,
    })
    const particles = new THREE.Points(pGeo, pMat)
    scene.add(particles)
    let particlesActive = false

    // ─── Easing ──────────────────────────────────────────────────────────────
    function easeOutBack(t: number) {
      const c1 = 1.70158, c3 = c1 + 1
      return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
    }

    // ─── State ───────────────────────────────────────────────────────────────
    let phase:      Phase  = 'intact'
    let phaseTimer: number = 0
    let orbitAngle: number = 0
    let shakeActive = false
    let shakeTime   = 0

    function setLabel(txt: string) {
      if (labelRef.current) labelRef.current.textContent = txt
    }

    function launchParticles() {
      particlesActive = true
      const pos = pGeo.attributes.position.array as Float32Array
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        pos[i * 3]     = (Math.random() - 0.5) * 0.5
        pos[i * 3 + 1] = (Math.random() - 0.5) * 0.5
        pos[i * 3 + 2] = (Math.random() - 0.5) * 0.5
        pVelocities[i].set(
          (Math.random() - 0.5) * 0.35,
          Math.random() * 0.35 + 0.08,
          (Math.random() - 0.5) * 0.35,
        )
        pLifetimes[i] = 1 + Math.random()
      }
      pGeo.attributes.position.needsUpdate = true
      pMat.opacity = 0.9
    }

    function triggerShockwave() {
      const sw = shockwaveRef.current
      const fl = flashRef.current
      if (sw) { sw.classList.remove('sw-active'); void sw.offsetWidth; sw.classList.add('sw-active') }
      if (fl) { fl.classList.remove('fl-active'); void fl.offsetWidth; fl.classList.add('fl-active') }
    }

    function startRejoin() {
      if (phase !== 'scattered') return
      phase = 'rejoining'
      phaseTimer = 0
      setLabel('◆ RECONNECTING...')

      fragments.forEach((f, i) => {
        f._rejoining      = true
        f._rejoinDelay    = i * 18
        f._rejoinProgress = 0
        f._exploding      = false
      })

      const t = setTimeout(() => {
        phase = 'intact'
        setLabel('● INTACT')
        fragments.forEach(f => {
          f._exploding = false
          f._rejoining = false
          f.mesh.position.copy(f.homePos)
          f.mesh.rotation.set(0, 0, 0)
        })
        // Auto loop — boom again after 3s
        const t2 = setTimeout(() => triggerBoom(), 3000)
        timersRef.current.push(t2)
      }, 2500)
      timersRef.current.push(t)
    }

    function triggerBoom() {
      if (phase !== 'intact') return
      phase = 'exploding'
      phaseTimer = 0
      setLabel('💥 BOOM!')

      triggerShockwave()
      boomLight.intensity = 8
      shakeActive = true
      shakeTime   = 0
      launchParticles()

      fragments.forEach(f => {
        const t = setTimeout(() => { f._exploding = true }, f.delay * 400)
        timersRef.current.push(t)
      })

      // Settled → scattered
      const t1 = setTimeout(() => {
        phase = 'scattered'
        setLabel('◇ SCATTERED')
        // Auto rejoin after 5s
        const t2 = setTimeout(() => startRejoin(), 5000)
        timersRef.current.push(t2)
      }, 2000)
      timersRef.current.push(t1)
    }

    // ─── Animation Loop ──────────────────────────────────────────────────────
    const clock = new THREE.Clock()

    function animate() {
      animFrameRef.current = requestAnimationFrame(animate)
      const dt = Math.min(clock.getDelta(), 0.05)
      phaseTimer += dt

      // Slow orbit
      orbitAngle += dt * 0.25
      camera.position.x = camOrigin.x * Math.cos(orbitAngle) - camOrigin.z * Math.sin(orbitAngle) * 0.3
      camera.position.z = camOrigin.z * Math.cos(orbitAngle) + camOrigin.x * Math.sin(orbitAngle) * 0.3
      camera.lookAt(0, 0.3, 0)

      // Camera shake
      if (shakeActive) {
        shakeTime += dt
        const s = Math.max(0, 0.25 - shakeTime) * 15
        camera.position.x += (Math.random() - 0.5) * s * 0.1
        camera.position.y += (Math.random() - 0.5) * s * 0.1
        if (shakeTime > 0.5) shakeActive = false
      }

      // Fragment physics
      fragments.forEach(f => {
        if (f._exploding) {
          const dir = new THREE.Vector3().subVectors(f.explodePos, f.homePos).normalize()
          f.mesh.position.addScaledVector(dir, 0.08 + Math.random() * 0.04)
          f.mesh.rotation.x += f.angVel.x
          f.mesh.rotation.y += f.angVel.y
          f.mesh.rotation.z += f.angVel.z
          f.mesh.position.y -= 0.008

          if (f.mesh.position.distanceTo(f.explodePos) < 0.15) {
            f.mesh.position.copy(f.explodePos)
            f._exploding = false
          }
        } else if (f._rejoining) {
          const delay = f._rejoinDelay / 1000
          const raw   = Math.max(0, Math.min(1, (phaseTimer - delay) * 1.1))
          if (raw <= 0) return
          const ease = easeOutBack(raw)
          f.mesh.position.lerpVectors(f.explodePos, f.homePos, ease)
          f.mesh.rotation.x = f.explodeRot.x * (1 - ease)
          f.mesh.rotation.y = f.explodeRot.y * (1 - ease)
          f.mesh.rotation.z = f.explodeRot.z * (1 - ease)
        } else if (phase === 'intact') {
          // Breathing idle
          f.mesh.position.y = f.homePos.y +
            Math.sin(phaseTimer * 1.2 + fragments.indexOf(f) * 0.1) * 0.004
        }
      })

      // Particles
      if (particlesActive) {
        const pos = pGeo.attributes.position.array as Float32Array
        let anyAlive = false
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          if (pLifetimes[i] > 0) {
            pLifetimes[i]  -= dt
            pos[i * 3]     += pVelocities[i].x
            pos[i * 3 + 1] += pVelocities[i].y
            pos[i * 3 + 2] += pVelocities[i].z
            pVelocities[i].y -= 0.008
            anyAlive = true
          }
        }
        pGeo.attributes.position.needsUpdate = true
        if (!anyAlive) { particlesActive = false; pMat.opacity = 0 }
        else pMat.opacity = Math.max(0, pMat.opacity - dt * 0.3)
      }

      // Boom light decay
      if (boomLight.intensity > 0) {
        boomLight.intensity = Math.max(0, boomLight.intensity - dt * 12)
      }

      renderer.render(scene, camera)
    }

    animate()

    // Auto-start
    const initTimer = setTimeout(() => triggerBoom(), 1200)
    timersRef.current.push(initTimer)

    // Resize handler
    const handleResize = () => {
      const w = mount.clientWidth
      const h = mount.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', handleResize)

    // ─── Cleanup ─────────────────────────────────────────────────────────────
    return () => {
      clearAllTimers()
      cancelAnimationFrame(animFrameRef.current)
      window.removeEventListener('resize', handleResize)
      renderer.dispose()
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement)
      }
      fragments.forEach(f => {
        f.mesh.geometry.dispose()
        ;(f.mesh.material as THREE.Material).dispose()
      })
    }
  }, [clearAllTimers])

  return (
    <div className="relative w-full h-full">
      {/* Three.js canvas mount */}
      <div ref={mountRef} className="absolute inset-0" />

      {/* Shockwave ring */}
      <div
        ref={shockwaveRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{ width: 0, height: 0, border: '3px solid rgba(251,191,36,0.8)', opacity: 0 }}
      />

      {/* Flash overlay */}
      <div
        ref={flashRef}
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{ background: 'rgba(255,220,100,0)' }}
      />

      {/* Phase label
      <span
        ref={labelRef}
        className="absolute bottom-3 left-1/2 -translate-x-1/2 text-indigo-400/70 text-[10px] tracking-[3px] uppercase pointer-events-none font-mono"
      >
        ● INTACT
      </span> */}

      {/* CSS for shockwave + flash animations */}
      <style>{`
        .sw-active {
          animation: sw-anim 0.8s ease-out forwards !important;
        }
        .fl-active {
          animation: fl-anim 0.5s ease-out forwards !important;
        }
        @keyframes sw-anim {
          0%   { width: 0;     height: 0;     opacity: 0.9; }
          100% { width: 800px; height: 800px; opacity: 0;   }
        }
        @keyframes fl-anim {
          0%   { background: rgba(255,220,100,0.55); }
          100% { background: rgba(255,220,100,0);    }
        }
      `}</style>
    </div>
  )
}