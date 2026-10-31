import { useEffect, useRef } from 'react'
import { umbraPalette } from './umbraPalette'
import type { UmbraColor } from './umbraPalette'

const tint = (color: UmbraColor, opacity: number) => `rgba(${color.join(',')},${opacity})`

function seed(value: number) {
    const n = Math.sin(value * 127.1 + 311.7) * 43758.5453
    return n - Math.floor(n)
}

export default function UmbraAtmosphere({ depth, still }: { depth: number; still: boolean }) {
    const canvas = useRef<HTMLCanvasElement>(null)
    const sceneTime = useRef(0)

    useEffect(() => {
        const element = canvas.current
        const context = element?.getContext('2d', { alpha: true })
        if (!element || !context) return
        let width = 0
        let height = 0
        let animation = 0
        let lastFrame = 0
        let time = sceneTime.current
        const palette = umbraPalette(depth)

        function point(t: number, i: number) {
            const phase = i * 2.39
            return {
                x: width * (0.5 + Math.sin(t * 0.21 + phase) * (0.3 + depth * 0.018) + Math.sin(t * 0.7 + phase) * 0.055),
                y: height * (0.49 + Math.cos(t * 0.17 + phase) * 0.34 + Math.sin(t * 0.49 + phase) * 0.07),
            }
        }

        function paint() {
            if (!context) return
            context.clearRect(0, 0, width, height)
            context.globalCompositeOperation = 'screen'
            const stars = width < 600 ? 65 : 130
            for (let i = 0; i < stars; i++) {
                const x = seed(i + 3) * width
                const y = seed(i + 113) * height
                const a = (0.15 + seed(i + 60) * 0.4) * (0.7 + Math.sin(time * 0.3 + i) * 0.3) * palette.starPresence
                context.fillStyle = `rgba(184,216,244,${a})`
                context.beginPath()
                context.arc(x, y, i % 17 === 0 ? 1.25 : 0.55, 0, Math.PI * 2)
                context.fill()
            }
            const count = width < 600 ? 5 : 8
            for (let i = 0; i < count; i++) {
                const p = point(time + 3, i)
                const radius = 45 + seed(i + 20) * 40 + depth * 6
                const glow = context.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius)
                glow.addColorStop(0, tint(palette.halo, 0.24))
                glow.addColorStop(0.18, tint(palette.glow, 0.16))
                glow.addColorStop(1, tint(palette.glow, 0))
                context.fillStyle = glow
                context.fillRect(p.x - radius, p.y - radius, radius * 2, radius * 2)
                for (let strand = 0; strand < 4; strand++) {
                    context.beginPath()
                    for (let j = 0; j <= 42; j++) {
                        const tail = (42 - j) / 42
                        const q = point(time + 3 - tail * (1.5 + strand * 0.18), i)
                        const spread = Math.sin(tail * Math.PI) * (5 + strand * 4)
                        const x = q.x + Math.sin(tail * 6 + time + strand) * spread
                        const y = q.y + Math.cos(tail * 7 + time * 0.6 + strand) * spread
                        if (j === 0) context.moveTo(x, y)
                        else context.lineTo(x, y)
                    }
                    const tail = point(time + 3 - (1.5 + strand * 0.18), i)
                    const light = context.createLinearGradient(tail.x, tail.y, p.x, p.y)
                    light.addColorStop(0, tint(palette.glow, 0))
                    light.addColorStop(0.55, tint(strand === 0 ? palette.halo : palette.glow, strand === 0 ? 0.18 : 0.07))
                    light.addColorStop(1, tint(strand === 0 ? palette.filament : palette.glow, strand === 0 ? 0.65 : 0.22))
                    context.strokeStyle = light
                    context.lineWidth = strand === 0 ? 0.9 : 2 + strand
                    context.lineCap = 'round'
                    context.stroke()
                }
                const core = context.createRadialGradient(p.x, p.y, 0, p.x, p.y, 9)
                core.addColorStop(0, tint(palette.core, 0.96))
                core.addColorStop(0.2, tint(palette.halo, 0.8))
                core.addColorStop(1, tint(palette.glow, 0))
                context.fillStyle = core
                context.beginPath()
                context.arc(p.x, p.y, 9, 0, Math.PI * 2)
                context.fill()
            }
            context.globalCompositeOperation = 'source-over'
        }

        function tick(now: number) {
            if (document.hidden || still) return
            if (now - lastFrame >= 33) {
                // L'horloge avance seulement quand la scène est visible, à 30 images/s au plus.
                time += Math.min((now - lastFrame) / 1000, 0.05)
                lastFrame = now
                paint()
            }
            animation = requestAnimationFrame(tick)
        }
        function resume() {
            cancelAnimationFrame(animation)
            lastFrame = performance.now()
            if (!document.hidden && !still) animation = requestAnimationFrame(tick)
        }
        function resize() {
            if (!element || !context) return
            const bounds = element.getBoundingClientRect()
            width = bounds.width
            height = bounds.height
            const ratio = Math.min(window.devicePixelRatio || 1, 1.5)
            element.width = Math.round(width * ratio)
            element.height = Math.round(height * ratio)
            context.setTransform(ratio, 0, 0, ratio, 0, 0)
            paint()
        }
        const observer = new ResizeObserver(resize)
        observer.observe(element)
        resize()
        resume()
        document.addEventListener('visibilitychange', resume)
        return () => {
            sceneTime.current = time
            cancelAnimationFrame(animation)
            observer.disconnect()
            document.removeEventListener('visibilitychange', resume)
        }
    }, [depth, still])

    return <canvas className="umbra-atmosphere" ref={canvas} aria-hidden="true" />
}
