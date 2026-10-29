import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { corruptText } from './scramble'
import './UmbraTakeover.css'

function subscribeMotion(callback: () => void) {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    media.addEventListener('change', callback)
    return () => media.removeEventListener('change', callback)
}
const motionSnapshot = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function UmbraTakeover({ onComplete }: { onComplete: () => void }) {
    const [elapsed, setElapsed] = useState(0)
    const reducedMotion = useSyncExternalStore(subscribeMotion, motionSnapshot, () => true)
    const status = useRef<HTMLParagraphElement>(null)
    useEffect(() => {
        document.body.classList.add('umbra-takeover-body')
        status.current?.focus({ preventScroll: true })
        let animation = 0
        let time = 0
        let last = performance.now()
        let lastPaint = 0
        const duration = reducedMotion ? 650 : 2200
        function tick(now: number) {
            if (document.hidden) return
            time += Math.min(now - last, 90)
            last = now
            if (time >= duration) { onComplete(); return }
            if (time - lastPaint >= 80) { setElapsed(time); lastPaint = time }
            animation = requestAnimationFrame(tick)
        }
        function visibility() {
            cancelAnimationFrame(animation)
            document.body.classList.toggle('umbra-takeover-paused', document.hidden)
            last = performance.now()
            if (!document.hidden) animation = requestAnimationFrame(tick)
        }
        animation = requestAnimationFrame(tick)
        document.addEventListener('visibilitychange', visibility)
        return () => {
            cancelAnimationFrame(animation)
            document.removeEventListener('visibilitychange', visibility)
            document.body.classList.remove('umbra-takeover-body', 'umbra-takeover-paused')
        }
    }, [onComplete, reducedMotion])
    const line = elapsed < 650 ? 'IDENTITÉ // HUMAINE' : elapsed < 1250 ? 'AUTORITÉ NON RECONNUE' : elapsed < 1750 ? 'CLASSIFICATION IMPOSSIBLE' : 'PASSAGE OUVERT'
    return <>
        <p className="sr-only" role="status" tabIndex={-1} ref={status}>La liaison est interrompue. Un autre passage s’ouvre.</p>
        <div className="umbra-seizure" aria-hidden="true" data-reduced={reducedMotion}>
            <div className="umbra-seizure-cut cut-first" /><div className="umbra-seizure-cut cut-second" /><div className="umbra-seizure-cut cut-third" />
            <div className="umbra-seizure-log"><span>ÉVALUATION MÉDICO-PROFESSIONNELLE</span><strong>{reducedMotion ? 'Passage en cours…' : corruptText(line, elapsed, 0.95)}</strong><span>SESSION // {elapsed < 1300 ? 'INTERROMPUE' : 'INCONNUE'}</span></div>
            <div className="umbra-seizure-mark">☾</div>
        </div>
    </>
}
