import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { centralIntensity } from './referenceWriting'

const motionPreference = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
function subscribeMotion(callback: () => void) {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    media.addEventListener('change', callback)
    return () => media.removeEventListener('change', callback)
}

export function useCentralAnomaly(enabled: boolean, duration = 3600, onEnter?: () => void) {
    const card = useRef<HTMLFieldSetElement>(null)
    const centerProbe = useRef<HTMLSpanElement>(null)
    const [entered, setEntered] = useState(false)
    const [clock, setClock] = useState({ elapsed: 0, intensity: 0 })
    const reducedMotion = useSyncExternalStore(subscribeMotion, motionPreference, () => true)

    useEffect(() => {
        if (!enabled) return
        let observer: IntersectionObserver
        function observeCenter() {
            observer?.disconnect()
            const margin = Math.round(window.innerHeight * 0.35)
            observer = new IntersectionObserver(entries => {
                if (!entries[0].isIntersecting) return
                setEntered(true)
                onEnter?.()
                observer.disconnect()
                window.removeEventListener('resize', observeCenter)
            }, { rootMargin: `-${margin}px 0px -${margin}px 0px`, threshold: 0 })
            if (centerProbe.current) observer.observe(centerProbe.current)
        }
        observeCenter()
        window.addEventListener('resize', observeCenter)
        return () => {
            observer.disconnect()
            window.removeEventListener('resize', observeCenter)
        }
    }, [enabled, onEnter])

    useEffect(() => {
        if (!entered || reducedMotion || !enabled) return
        const start = performance.now()
        const timer = window.setInterval(() => {
            if (document.hidden) return
            const elapsed = performance.now() - start
            const bounds = card.current?.getBoundingClientRect()
            const intensity = bounds ? centralIntensity(bounds.top + bounds.height / 2, window.innerHeight) : 0
            setClock({ elapsed, intensity })
            // Même horloge finie pour les cartes ; aucun rejeu au changement de valeur.
            if (elapsed >= duration) window.clearInterval(timer)
        }, 90)
        return () => window.clearInterval(timer)
    }, [entered, reducedMotion, enabled, duration])

    return { card, centerProbe, ...clock, reducedMotion }
}
