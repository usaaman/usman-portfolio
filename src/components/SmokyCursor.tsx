import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  life: number
  maxLife: number
  color: string
}

function getBrandColors(): string[] {
  if (typeof window === 'undefined') return ['#a855f7', '#22d3ee', '#f472b6']
  const style = getComputedStyle(document.documentElement)
  const purple = style.getPropertyValue('--neon-purple').trim() || 'oklch(0.68 0.28 300)'
  const cyan = style.getPropertyValue('--neon-cyan').trim() || 'oklch(0.78 0.19 210)'
  const coral = style.getPropertyValue('--neon-coral').trim() || 'oklch(0.72 0.22 25)'
  return [purple, cyan, coral]
}

export function SmokyCursor() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const isMobile = window.matchMedia('(max-width: 768px)').matches
    const maxParticles = isMobile ? 30 : 100
    const particles: Particle[] = []
    let colors = getBrandColors()
    const pointer = { x: -9999, y: -9999, active: false }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas!.width = window.innerWidth * dpr
      canvas!.height = window.innerHeight * dpr
      canvas!.style.width = window.innerWidth + 'px'
      canvas!.style.height = window.innerHeight + 'px'
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    let resizeTimer: ReturnType<typeof setTimeout>
    function onResize() {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        resize()
        colors = getBrandColors()
      }, 100)
    }

    function spawn(x: number, y: number) {
      if (particles.length >= maxParticles) return
      const count = isMobile ? 1 : 2
      for (let i = 0; i < count; i++) {
        particles.push({
          x: x + (Math.random() - 0.5) * 12,
          y: y + (Math.random() - 0.5) * 12,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6 - 0.3,
          size: 8 + Math.random() * 32,
          life: 0,
          maxLife: 60 + Math.random() * 60,
          color: colors[Math.floor(Math.random() * colors.length)],
        })
      }
    }

    function onPointer(e: PointerEvent) {
      pointer.x = e.clientX
      pointer.y = e.clientY
      pointer.active = true
      spawn(pointer.x, pointer.y)
    }
    function onPointerLeave() {
      pointer.active = false
    }

    function loop() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height)
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.life++
        p.x += p.vx
        p.y += p.vy
        p.vy -= 0.005
        const t = p.life / p.maxLife
        if (t >= 1) {
          particles.splice(i, 1)
          continue
        }
        const opacity = (0.1 + 0.5 * (1 - t)).toFixed(3)
        const grad = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size)
        grad.addColorStop(
          0,
          `color-mix(in oklab, ${p.color} ${Math.round(Number(opacity) * 100)}%, transparent)`,
        )
        grad.addColorStop(1, `color-mix(in oklab, ${p.color} 0%, transparent)`)
        ctx!.fillStyle = grad
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx!.fill()
      }
      rafRef.current = requestAnimationFrame(loop)
    }

    resize()
    window.addEventListener('resize', onResize)
    window.addEventListener('pointermove', onPointer)
    window.addEventListener('pointerleave', onPointerLeave)
    rafRef.current = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onPointer)
      window.removeEventListener('pointerleave', onPointerLeave)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
      style={{ mixBlendMode: 'screen' }}
    />
  )
}
