'use client'

const floatingOrbs = [
  { size: 320, left: '10%', top: '20%', delay: 0, duration: 8, color: 'rgba(147, 51, 234, 0.15)' },
  { size: 240, left: '75%', top: '60%', delay: 2, duration: 10, color: 'rgba(59, 130, 246, 0.12)' },
  { size: 200, left: '50%', top: '80%', delay: 1, duration: 7, color: 'rgba(217, 70, 239, 0.1)' },
  { size: 180, left: '85%', top: '15%', delay: 3, duration: 9, color: 'rgba(14, 165, 233, 0.12)' },
  { size: 280, left: '5%', top: '70%', delay: 1.5, duration: 11, color: 'rgba(147, 51, 234, 0.08)' },
  { size: 160, left: '60%', top: '30%', delay: 0.5, duration: 8, color: 'rgba(59, 130, 246, 0.1)' },
]

const floatingShapes = [
  { size: 24, left: '15%', top: '40%', delay: 0, duration: 6 },
  { size: 16, left: '80%', top: '25%', delay: 1, duration: 5 },
  { size: 20, left: '70%', top: '75%', delay: 2, duration: 7 },
  { size: 14, left: '25%', top: '85%', delay: 0.5, duration: 6 },
  { size: 18, left: '90%', top: '50%', delay: 1.5, duration: 8 },
  { size: 12, left: '40%', top: '15%', delay: 2.5, duration: 5 },
]

export default function FloatingElements() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {/* Soft gradient orbs */}
      {floatingOrbs.map((orb, i) => (
        <div
          key={`orb-${i}`}
          className="absolute rounded-full blur-3xl"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.left,
            top: orb.top,
            transform: 'translate(-50%, -50%)',
            background: orb.color,
            animation: `float ${orb.duration}s ease-in-out ${orb.delay}s infinite`,
          }}
        />
      ))}
      {/* Small geometric shapes */}
      {floatingShapes.map((shape, i) => (
        <div
          key={`shape-${i}`}
          className="absolute border border-purple-500/30"
          style={{
            width: shape.size,
            height: shape.size,
            left: shape.left,
            top: shape.top,
            borderRadius: i % 3 === 0 ? '4px' : '50%',
            transform: 'translate(-50%, -50%)',
            animation: `float ${shape.duration}s ease-in-out ${shape.delay}s infinite`,
          }}
        />
      ))}
    </div>
  )
}
