import { flushSync } from 'react-dom'

type FadeOptions = { night?: boolean; resetScroll?: boolean }
type Change = { update: () => void; options: FadeOptions }

let waiting: Change[] = []
let scheduled = false
let active: ViewTransition | undefined
let committing = false

/** Regroupe les changements d'un même geste dans un seul fondu. */
export function fadeScene(update: () => void, options: FadeOptions = {}) {
    if (committing) { update(); return }
    waiting.push({ update, options })
    if (scheduled) return
    scheduled = true
    queueMicrotask(() => {
        scheduled = false
        const changes = waiting
        waiting = []
        let committed = false
        const commit = () => {
            if (committed) return
            committed = true
            committing = true
            try { flushSync(() => changes.forEach(change => change.update())) }
            finally { committing = false }
            if (changes.some(change => change.options.resetScroll !== false)) window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
        }
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        active?.skipTransition()
        if (reduced || document.hidden) { commit(); return }

        const night = changes.some(change => change.options.night)
        document.documentElement.dataset.sceneFade = night ? 'night' : 'paper'
        if (typeof document.startViewTransition === 'function') {
            // React doit avoir peint la nouvelle étape avant sa capture par le navigateur.
            let transition: ViewTransition
            try { transition = document.startViewTransition(commit) }
            catch { commit(); delete document.documentElement.dataset.sceneFade; return }
            active = transition
            void transition.ready.catch(() => { /* Une capture interrompue ne bloque pas la navigation. */ })
            void transition.finished.catch(() => {}).finally(() => {
                if (active === transition) {
                    active = undefined
                    delete document.documentElement.dataset.sceneFade
                }
            })
            return
        }

        // Même passage par une couleur pleine dans les navigateurs sans captures natives.
        const veil = document.createElement('div')
        veil.className = 'scene-fade-veil'
        veil.setAttribute('aria-hidden', 'true')
        veil.style.background = night ? '#000' : '#edf0ea'
        document.body.append(veil)
        try {
            const out = veil.animate([{ opacity: 0 }, { opacity: 1 }], { duration: night ? 420 : 180, fill: 'forwards', easing: 'ease-in' })
            void out.finished.then(() => {
                commit()
                return veil.animate([{ opacity: 1 }, { opacity: 0 }], { duration: night ? 750 : 340, fill: 'forwards', easing: 'ease-out' }).finished
            }).catch(() => {}).finally(() => { commit(); veil.remove(); delete document.documentElement.dataset.sceneFade })
        } catch { commit(); veil.remove(); delete document.documentElement.dataset.sceneFade }
    })
}
