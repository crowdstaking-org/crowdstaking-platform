'use client'

import React, { useEffect, useRef } from 'react'

interface GravityMeshProps {
  theme: 'light' | 'dark'
}

/**
 * Gravity Mesh - Animated grid with undulating wave patterns and gravity wells
 * Creates a mesmerizing fabric-like effect with smooth, continuous motion
 * @param theme Current theme (light/dark) for color adaptation
 */
export function GravityMesh({ theme }: GravityMeshProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Dense grid for fabric effect
    const gridSize = 15
    const cols = Math.ceil(canvas.width / gridSize) + 1
    const rows = Math.ceil(canvas.height / gridSize) + 1

    // Create grid points array for cohesive movement
    const gridPoints: {
      x: number
      y: number
      baseX: number
      baseY: number
    }[][] = []

    for (let row = 0; row < rows; row++) {
      gridPoints[row] = []
      for (let col = 0; col < cols; col++) {
        const x = col * gridSize
        const y = row * gridSize
        gridPoints[row][col] = {
          x,
          y,
          baseX: x,
          baseY: y,
        }
      }
    }

    // Gravity wells with undulating movement
    const wells = [
      {
        x: 0.3,
        y: 0.4,
        strength: 150,
        speedX: 0.0002,
        speedY: 0.00015,
        phaseX: 0,
        phaseY: 0,
      },
      {
        x: 0.7,
        y: 0.6,
        strength: 120,
        speedX: -0.00015,
        speedY: 0.0002,
        phaseX: Math.PI,
        phaseY: Math.PI / 2,
      },
      {
        x: 0.5,
        y: 0.3,
        strength: 100,
        speedX: 0.00015,
        speedY: -0.00015,
        phaseX: Math.PI / 2,
        phaseY: Math.PI,
      },
    ]

    let time = 0

    const animate = () => {
      time += 1

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update well positions with undulating motion
      wells.forEach((well) => {
        well.x += well.speedX
        well.y += well.speedY

        // Bounce off edges
        if (well.x < 0.1 || well.x > 0.9) well.speedX *= -1
        if (well.y < 0.1 || well.y > 0.9) well.speedY *= -1
      })

      // Update all grid points with undulating, wavy motion
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const point = gridPoints[row][col]
          const x = point.baseX
          const y = point.baseY

          let offsetX = 0
          let offsetY = 0

          // Calculate combined influence from all gravity wells
          wells.forEach((well) => {
            const wellX = well.x * canvas.width
            const wellY = well.y * canvas.height
            const dx = x - wellX
            const dy = y - wellY
            const distance = Math.sqrt(dx * dx + dy * dy)

            // Smoother falloff for fabric-like movement
            const normalizedDistance = distance / 150
            const force =
              well.strength / (normalizedDistance * normalizedDistance + 0.5)

            // Pull towards center with smooth interpolation
            offsetX -= (dx / (distance + 1)) * force * 0.6
            offsetY -= (dy / (distance + 1)) * force * 0.6
          })

          // Multiple overlapping wave patterns for undulating effect
          // Large slow waves
          offsetX += Math.sin(y * 0.008 + time * 0.02) * 8
          offsetY += Math.cos(x * 0.008 + time * 0.02) * 8

          // Medium waves at different frequency
          offsetX += Math.sin(y * 0.015 + x * 0.01 + time * 0.025) * 5
          offsetY += Math.cos(x * 0.015 + y * 0.01 + time * 0.025) * 5

          // Small fast ripples
          offsetX += Math.sin(x * 0.03 + y * 0.02 + time * 0.04) * 2
          offsetY += Math.cos(y * 0.03 + x * 0.02 + time * 0.04) * 2

          // Circular undulation pattern
          const centerX = canvas.width / 2
          const centerY = canvas.height / 2
          const distFromCenter = Math.sqrt(
            (x - centerX) ** 2 + (y - centerY) ** 2,
          )
          const angle = Math.atan2(y - centerY, x - centerX)

          offsetX += Math.sin(distFromCenter * 0.01 + time * 0.03 + angle) * 4
          offsetY += Math.cos(distFromCenter * 0.01 + time * 0.03 + angle) * 4

          // Pulsing/breathing effect
          const breathe = Math.sin(time * 0.015) * 3
          offsetX += Math.sin(x * 0.01 + y * 0.01 + time * 0.02) * breathe
          offsetY += Math.cos(x * 0.01 + y * 0.01 + time * 0.02) * breathe

          point.x = x + offsetX
          point.y = y + offsetY
        }
      }

      // Set line style based on theme
      ctx.strokeStyle =
        theme === 'light'
          ? 'rgba(59, 130, 246, 0.2)'
          : 'rgba(96, 165, 250, 0.15)'
      ctx.lineWidth = 0.5

      // Draw horizontal lines using pre-calculated grid points
      for (let row = 0; row < rows; row++) {
        ctx.beginPath()
        for (let col = 0; col < cols; col++) {
          const point = gridPoints[row][col]
          if (col === 0) {
            ctx.moveTo(point.x, point.y)
          } else {
            ctx.lineTo(point.x, point.y)
          }
        }
        ctx.stroke()
      }

      // Draw vertical lines using pre-calculated grid points
      for (let col = 0; col < cols; col++) {
        ctx.beginPath()
        for (let row = 0; row < rows; row++) {
          const point = gridPoints[row][col]
          if (row === 0) {
            ctx.moveTo(point.x, point.y)
          } else {
            ctx.lineTo(point.x, point.y)
          }
        }
        ctx.stroke()
      }

      // Draw gravity well centers with pulsing effect
      wells.forEach((well) => {
        const x = well.x * canvas.width
        const y = well.y * canvas.height
        const pulse = Math.sin(time * 0.025) * 0.3 + 1

        // Outer glow with undulation
        const outerGradient = ctx.createRadialGradient(
          x,
          y,
          0,
          x,
          y,
          well.strength * 1.5 * pulse,
        )
        outerGradient.addColorStop(
          0,
          theme === 'light'
            ? 'rgba(147, 51, 234, 0.15)'
            : 'rgba(168, 85, 247, 0.12)',
        )
        outerGradient.addColorStop(
          0.5,
          theme === 'light'
            ? 'rgba(147, 51, 234, 0.08)'
            : 'rgba(168, 85, 247, 0.06)',
        )
        outerGradient.addColorStop(1, 'rgba(147, 51, 234, 0)')

        ctx.fillStyle = outerGradient
        ctx.beginPath()
        ctx.arc(x, y, well.strength * 1.5 * pulse, 0, Math.PI * 2)
        ctx.fill()

        // Dark core with undulating pulse
        const coreGradient = ctx.createRadialGradient(x, y, 0, x, y, 30 * pulse)
        coreGradient.addColorStop(
          0,
          theme === 'light'
            ? 'rgba(79, 70, 229, 0.3)'
            : 'rgba(99, 102, 241, 0.25)',
        )
        coreGradient.addColorStop(1, 'rgba(79, 70, 229, 0)')

        ctx.fillStyle = coreGradient
        ctx.beginPath()
        ctx.arc(x, y, 30 * pulse, 0, Math.PI * 2)
        ctx.fill()
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [theme])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{
        opacity: 0.7,
      }}
    />
  )
}





