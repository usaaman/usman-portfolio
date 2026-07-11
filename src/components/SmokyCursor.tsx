import { useEffect, useRef } from 'react'

interface SmokyCursorProps {
  containerSelector: string
}

interface Particle {
  x: number
  y: number
  size: number
  alpha: number
  life: number
  maxLife: number
  vx: number
  vy: number
  color: [number, number, number]
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function parseColor(input: string) {
  const value = input.trim()

  if (value.startsWith('#')) {
    const hex = value.slice(1)
    const fullHex =
      hex.length === 3
        ? hex
            .split('')
            .map((char) => char + char)
            .join('')
        : hex

    const int = Number.parseInt(fullHex, 16)
    return [(int >> 16) & 255, (int >> 8) & 255, int & 255] as [number, number, number]
  }

  const match = value.match(/\d+(\.\d+)?/g)
  if (!match) {
    return [125, 211, 252] as [number, number, number]
  }

  return [Number(match[0]), Number(match[1]), Number(match[2])] as [number, number, number]
}

function lerpColor(
  from: [number, number, number],
  to: [number, number, number],
  mix: number,
): [number, number, number] {
  return [
    Math.round(from[0] + (to[0] - from[0]) * mix),
    Math.round(from[1] + (to[1] - from[1]) * mix),
    Math.round(from[2] + (to[2] - from[2]) * mix),
  ]
}

export function SmokyCursor({ containerSelector }: SmokyCursorProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = document.querySelector<HTMLElement>(containerSelector)
    if (!canvas || !container) {
      return
    }

    const context = canvas.getContext('2d')
    if (!context) {
      return
    }

    let animationFrame = 0
    let resizeTimeout = window.setTimeout(() => undefined, 0)
    const particles: Particle[] = []
    const isMobile = window.matchMedia('(max-width: 768px)').matches
    const maxParticles = isMobile ? 30 : 100
    const particleBurst = isMobile ? 2 : 4

    const syncCanvasSize = () => {
      const bounds = container.getBoundingClientRect()
      const ratio = window.devicePixelRatio || 1
      canvas.width = bounds.width * ratio
      canvas.height = bounds.height * ratio
      canvas.style.width = `${bounds.width}px`
      canvas.style.height = `${bounds.height}px`
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
    }

    const getPalette = () => {
      const styles = getComputedStyle(document.documentElement)
      return [
        parseColor(styles.getPropertyValue('--color-primary')),
        parseColor(styles.getPropertyValue('--color-secondary')),
        parseColor(styles.getPropertyValue('--color-accent')),
      ]
    }

    const emit = (clientX: number, clientY: number) => {
      const bounds = container.getBoundingClientRect()
      const x = clientX - bounds.left
      const y = clientY - bounds.top

      if (x < 0 || y < 0 || x > bounds.width || y > bounds.height) {
        return
      }

      const palette = getPalette()
      for (let index = 0; index < particleBurst; index += 1) {
        const from = palette[Math.floor(Math.random() * palette.length)]!
        const to = palette[Math.floor(Math.random() * palette.length)]!
        particles.push({
          x: x + (Math.random() - 0.5) * 16,
          y: y + (Math.random() - 0.5) * 16,
          size: 8 + Math.random() * 32,
          alpha: 0.1 + Math.random() * 0.5,
          life: 0,
          maxLife: 1000 + Math.random() * 1000,
          vx: (Math.random() - 0.5) * 0.5,
          vy: -0.3 - Math.random() * 0.7,
          color: lerpColor(from, to, Math.random()),
        })
      }

      if (particles.length > maxParticles) {
        particles.splice(0, particles.length - maxParticles)
      }
    }

    let previousTime = performance.now()
    const render = (now: number) => {
      const delta = now - previousTime
      previousTime = now
      const bounds = container.getBoundingClientRect()

      context.clearRect(0, 0, bounds.width, bounds.height)
      context.globalCompositeOperation = 'screen'

      for (let index = particles.length - 1; index >= 0; index -= 1) {
        const particle = particles[index]!
        particle.life += delta
        const progress = particle.life / particle.maxLife

        if (progress >= 1) {
          particles.splice(index, 1)
          continue
        }

        particle.x += particle.vx * delta * 0.08
        particle.y += particle.vy * delta * 0.08
        particle.size += delta * 0.01

        const currentAlpha = clamp((1 - progress) * particle.alpha, 0, 1)
        const gradient = context.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.size,
        )

        gradient.addColorStop(0, `rgba(${particle.color.join(',')}, ${currentAlpha})`)
        gradient.addColorStop(0.55, `rgba(${particle.color.join(',')}, ${currentAlpha * 0.45})`)
        gradient.addColorStop(1, `rgba(${particle.color.join(',')}, 0)`)

        context.fillStyle = gradient
        context.beginPath()
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        context.fill()
      }

      animationFrame = window.requestAnimationFrame(render)
    }

    const handlePointerMove = (event: PointerEvent) => emit(event.clientX, event.clientY)
    const handleTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0]
      if (touch) {
        emit(touch.clientX, touch.clientY)
      }
    }

    const handleResize = () => {
      window.clearTimeout(resizeTimeout)
      resizeTimeout = window.setTimeout(syncCanvasSize, 120)
    }

    syncCanvasSize()
    animationFrame = window.requestAnimationFrame(render)

    container.addEventListener('pointermove', handlePointerMove, { passive: true })
    container.addEventListener('touchmove', handleTouchMove, { passive: true })
    window.addEventListener('resize', handleResize)

    return () => {
      window.cancelAnimationFrame(animationFrame)
      window.clearTimeout(resizeTimeout)
      container.removeEventListener('pointermove', handlePointerMove)
      container.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('resize', handleResize)
    }
  }, [containerSelector])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-0 opacity-90 blur-[2px]"
      aria-hidden="true"
    />
  )
}
