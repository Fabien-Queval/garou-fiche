import { useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { freeSignalAreas, nextUmbraLeakDelay, pickUmbraFragment, placeUmbraFragment, planUmbraLeaks, signalFitsArea, umbraIntrusionProfile, umbraLeakFrame } from './umbraIntrusionModel'
import type { SignalPlacement, UmbraLeakPlan } from './umbraIntrusionModel'
import './UmbraIntrusions.css'

type Leak = SignalPlacement & UmbraLeakPlan & { id: number; text: string; start: number }
type VisibleLeak = Leak & { elapsed: number }
const PROTECTED = '.umbra-header, .umbra-depths, .umbra-footer, .umbra-moon, .umbra-kicker, .umbra-question-panel, .umbra-save-error'

export default function UmbraIntrusions({ questionIndex }: { questionIndex: number }) {
    const profile = useMemo(() => umbraIntrusionProfile(questionIndex), [questionIndex])
    const layer = useRef<HTMLDivElement>(null)
    const [leaks, setLeaks] = useState<VisibleLeak[]>([])

    useEffect(() => {
        let timer = 0
        let animation = 0
        let layoutFrame = 0
        let disposed = false
        let serial = 0
        let live: Leak[] = []
        let recent: string[] = []
        let pending = planUmbraLeaks(profile)
        let lastPaint = -70

        function safeAreas(occupied: readonly SignalPlacement[] = []) {
            const scene = layer.current?.closest('.umbra-preview')
            const protectedRects = Array.from(scene?.querySelectorAll(PROTECTED) ?? [])
                .map(element => element.getBoundingClientRect())
                .filter(rect => rect.width > 0 && rect.height > 0)
            return freeSignalAreas(document.documentElement.clientWidth, window.innerHeight, [...protectedRects, ...occupied])
        }

        function publish(now: number) {
            live = live.filter(leak => now - leak.start < leak.durationMs)
            setLeaks(live.map(leak => ({ ...leak, elapsed: now - leak.start })))
        }

        function frame(now: number) {
            animation = 0
            if (disposed) return
            if (now - lastPaint >= 65) {
                lastPaint = now
                publish(now)
            }
            if (live.length) animation = requestAnimationFrame(frame)
        }

        function schedule(delay: number) {
            timer = window.setTimeout(emit, delay)
        }

        function emit() {
            if (disposed || document.hidden) return
            const now = performance.now()
            live = live.filter(leak => now - leak.start < leak.durationMs)
            // Une cascade patiente si la fenêtre est déjà occupée : aucune accumulation.
            if (live.length >= profile.maxFragments) { schedule(160); return }
            const text = pickUmbraFragment(profile, [...recent, ...live.map(leak => leak.text)])
            const placement = placeUmbraFragment(text, safeAreas(live), profile)
            if (!placement) { schedule(240); return }
            const plan = pending.shift()!
            live.push({ ...placement, ...plan, id: ++serial, text, start: now })
            recent = [...recent, text].slice(-3)
            publish(now)
            if (!animation) animation = requestAnimationFrame(frame)
            if (pending.length) schedule(pending[0].offsetMs - plan.offsetMs)
            else {
                pending = planUmbraLeaks(profile)
                schedule(nextUmbraLeakDelay(profile))
            }
        }

        function followLayout() {
            if (layoutFrame || !live.length) return
            layoutFrame = requestAnimationFrame(now => {
                layoutFrame = 0
                if (disposed) return
                const available = safeAreas()
                const placed: Leak[] = []
                live = live.map(leak => {
                    const room = safeAreas(placed)
                    const placement = room.some(area => signalFitsArea(leak, area)) ? leak
                        : placeUmbraFragment(leak.text, room, profile) ?? placeUmbraFragment(leak.text, available, profile)
                    const next = placement ? { ...leak, ...placement } : leak
                    placed.push(next)
                    return next
                })
                // Identité, texte et horloge conservés : défiler ne résorbe pas une fuite.
                publish(now)
            })
        }

        schedule(nextUmbraLeakDelay(profile, true))
        window.addEventListener('scroll', followLayout, { passive: true, capture: true })
        window.addEventListener('resize', followLayout)
        return () => {
            disposed = true
            window.clearTimeout(timer)
            cancelAnimationFrame(animation)
            cancelAnimationFrame(layoutFrame)
            window.removeEventListener('scroll', followLayout, true)
            window.removeEventListener('resize', followLayout)
        }
    }, [profile])

    return <div ref={layer} className="umbra-intrusions" aria-hidden="true" data-tier={profile.tier} style={{
        '--signal-intensity': profile.intensity,
        '--signal-offset': `${profile.chromaticOffset}px`,
    } as CSSProperties}>
        {leaks.map(leak => {
            const { text, phase } = umbraLeakFrame(leak.text, leak.elapsed, leak, profile.intensity)
            return <div key={leak.id} className="umbra-intrusion" data-leak-id={leak.id} data-kind={leak.kind} data-phase={phase} data-vertical={leak.vertical} style={{
                left: leak.x, top: leak.y, width: leak.width, height: leak.height, fontSize: leak.fontSize,
                '--signal-duration': `${leak.durationMs}ms`,
            } as CSSProperties}><span className="umbra-intrusion-text" data-echo={text}>{text}</span><i className="umbra-signal-tear" /></div>
        })}
    </div>
}
