import { useEffect, useState, useSyncExternalStore } from 'react'

function subscribeMotion(callback: () => void) {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    media.addEventListener('change', callback)
    return () => media.removeEventListener('change', callback)
}
function subscribeVisibility(callback: () => void) {
    document.addEventListener('visibilitychange', callback)
    return () => document.removeEventListener('visibilitychange', callback)
}
export default function useRitualClock(limit = Infinity) {
    const reduced = useSyncExternalStore(subscribeMotion, () => window.matchMedia('(prefers-reduced-motion: reduce)').matches, () => true)
    const hidden = useSyncExternalStore(subscribeVisibility, () => document.hidden, () => true)
    const [paused, setPaused] = useState(false)
    const [elapsed, setElapsed] = useState(0)
    const finished = elapsed >= limit
    useEffect(() => {
        if (paused || hidden || reduced || finished) return
        const timer = window.setInterval(() => setElapsed(value => Math.min(limit, value + 100)), 100)
        return () => window.clearInterval(timer)
    }, [paused, hidden, reduced, limit, finished])
    return { elapsed, reduced, hidden, paused, togglePause: () => setPaused(value => !value) }
}
