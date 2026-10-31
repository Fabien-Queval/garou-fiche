import { useEffect, useMemo, useReducer, useState, useSyncExternalStore } from 'react'
import type { CSSProperties } from 'react'
import type { ReactNode } from 'react'
import UmbraAtmosphere from './UmbraAtmosphere'
import UmbraIntrusions from './UmbraIntrusions.tsx'
import { corruptText, SCRAMBLE_DURATION } from './scramble'
import { createUmbraJourneyReducer, INITIAL_UMBRA_JOURNEY, UMBRA_LEAVE_MS, UMBRA_ARRIVE_MS, umbraVisualDepth } from './umbraJourney'
import { umbraPalette } from './umbraPalette'
import './UmbraPreview.css'

const DEPTHS = [
    { name: 'La lisière', word: 'Écouter', fragments: ['LUNA // SIGNAL DETECTED', 'Tu l’entends aussi ?', 'LE VOILE TIENT'] },
    { name: 'Le voile', word: 'Traverser', fragments: ['LA LUNE TE CONNAÎT', 'Le territoire a une mémoire.', 'SOMETHING CROSSED THE GAUNTLET'] },
    { name: 'La profondeur', word: 'Se souvenir', fragments: ['FOLLOW THE MEANING', 'La meute manque d’un membre.', 'INTENT HAS MASS'] },
    { name: 'La résonance', word: 'Répondre', fragments: ['Nous vous entendons.', 'Vos réponses ont tracé un chemin.', 'Quelque chose répond.'] },
]

function subscribeMotion(callback: () => void) {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    media.addEventListener('change', callback)
    return () => media.removeEventListener('change', callback)
}
const motionSnapshot = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
function subscribeVisibility(callback: () => void) {
    document.addEventListener('visibilitychange', callback)
    return () => document.removeEventListener('visibilitychange', callback)
}
const visibilitySnapshot = () => document.hidden

function Whisper({ fragments, still }: { fragments: string[]; still: boolean }) {
    const [message, setMessage] = useState({ text: fragments[0], elapsed: 0, serial: 0 })
    useEffect(() => {
        if (still) return
        let animation = 0
        let timer = 0
        let index = 0
        let start = performance.now()
        let lastFrame = 0
        let serial = 0
        function animate(now: number) {
            if (document.hidden) return
            const elapsed = Math.min(now - start, SCRAMBLE_DURATION)
            if (now - lastFrame > 75 || elapsed === SCRAMBLE_DURATION) {
                lastFrame = now
                setMessage({ text: fragments[index], elapsed, serial })
            }
            if (elapsed < SCRAMBLE_DURATION) animation = requestAnimationFrame(animate)
            else timer = window.setTimeout(next, 10500 + Math.random() * 5000)
        }
        function next() {
            index = (index + 1 + Math.floor(Math.random() * (fragments.length - 1))) % fragments.length
            serial++
            start = performance.now()
            animation = requestAnimationFrame(animate)
        }
        function visibility() {
            cancelAnimationFrame(animation)
            window.clearTimeout(timer)
            if (!document.hidden) {
                start = performance.now() - SCRAMBLE_DURATION
                animation = requestAnimationFrame(animate)
            }
        }
        animation = requestAnimationFrame(animate)
        document.addEventListener('visibilitychange', visibility)
        return () => {
            cancelAnimationFrame(animation)
            window.clearTimeout(timer)
            document.removeEventListener('visibilitychange', visibility)
        }
    }, [fragments, still])
    return <div className="umbra-whisper" aria-hidden="true"><span className="umbra-whisper-mark">⌁</span><span key={message.serial} className="umbra-whisper-text">{still ? message.text : corruptText(message.text, message.elapsed, 0.62)}</span></div>
}

function Moon() {
    return <svg className="umbra-moon" viewBox="0 0 160 160" fill="none" aria-hidden="true">
        <defs>
            <radialGradient id="moon-light" cx="34%" cy="28%" r="80%"><stop stopColor="#f1f5ed" /><stop offset="0.45" stopColor="#a5bbc8" /><stop offset="1" stopColor="#374d64" /></radialGradient>
            <mask id="moon-phase"><circle cx="80" cy="80" r="50" fill="white" /><circle cx="101" cy="68" r="48" fill="black" /></mask>
        </defs>
        <circle cx="80" cy="80" r="72" stroke="currentColor" strokeOpacity="0.12" />
        <circle cx="80" cy="80" r="60" stroke="currentColor" strokeOpacity="0.18" strokeDasharray="1 9" />
        <g mask="url(#moon-phase)"><circle cx="80" cy="80" r="50" fill="url(#moon-light)" /><circle cx="52" cy="65" r="12" fill="#435e74" opacity="0.22" /><circle cx="67" cy="109" r="16" fill="#435e74" opacity="0.24" /><circle cx="44" cy="91" r="7" fill="#e6eeee" opacity="0.22" /><circle cx="65" cy="42" r="6" fill="#435e74" opacity="0.18" /></g>
        <path d="M80 1v7M80 152v7M1 80h7M152 80h7" stroke="currentColor" strokeOpacity="0.4" />
    </svg>
}

function Seals() {
    return <svg className="umbra-seals" viewBox="0 0 1000 850" fill="none" aria-hidden="true">
        <ellipse cx="500" cy="425" rx="340" ry="318" stroke="currentColor" strokeWidth="0.6" opacity="0.25" />
        <ellipse cx="500" cy="425" rx="357" ry="335" stroke="currentColor" strokeWidth="0.6" strokeDasharray="1 12" opacity="0.25" />
        <path d="M500 80V20M500 770v60M140 425H80M860 425h60" stroke="currentColor" opacity="0.3" />
        {Array.from({ length: 13 }, (_, i) => {
            const angle = i * Math.PI * 2 / 13 - Math.PI / 2
            const x = 500 + Math.cos(angle) * 340
            const y = 425 + Math.sin(angle) * 318
            return <g key={i} transform={`translate(${x},${y}) rotate(${i * 27.69})`} className={i % 5 === 0 ? 'umbra-seal luminous' : 'umbra-seal'}>
                <circle r="19" stroke="currentColor" strokeWidth="0.7" />
                <path d={i % 3 === 0 ? 'M0-13 10 7H-10ZM0-7V13M-13 0H13' : i % 3 === 1 ? 'M-7-12 7 0-7 12M7-12-7 0 7 12M0-17V17' : 'M-11 0 0-12 11 0 0 12ZM-16 0H16M0-17V17'} stroke="currentColor" strokeWidth="0.85" />
            </g>
        })}
    </svg>
}

type SceneControls = { depth: number; travelling: boolean; still: boolean; hidden: boolean; navigate: (to: number) => void }
type SceneProps = {
    initialDepth?: number
    stepCount?: number
    mode?: 'preview' | 'intro' | 'questions' | 'complete'
    onDepthChange?: (depth: number) => void
    children?: (controls: SceneControls) => ReactNode
}

export default function UmbraScene({ initialDepth = 0, stepCount = DEPTHS.length, mode = 'preview', onDepthChange, children }: SceneProps) {
    const journeyReducer = useMemo(() => createUmbraJourneyReducer(stepCount), [stepCount])
    const [journey, dispatch] = useReducer(journeyReducer, { ...INITIAL_UMBRA_JOURNEY, depth: initialDepth })
    const [paused, setPaused] = useState(false)
    const reducedMotion = useSyncExternalStore(subscribeMotion, motionSnapshot, () => true)
    const hidden = useSyncExternalStore(subscribeVisibility, visibilitySnapshot, () => true)
    const still = paused || reducedMotion
    const { depth: stepIndex, passage } = journey
    // Chaque question traverse le voile ; quatre ambiances couvrent l'ensemble du parcours.
    const depth = umbraVisualDepth(stepIndex, stepCount, DEPTHS.length)
    const current = DEPTHS[depth]
    const palette = umbraPalette(depth)

    function goToDepth(to: number) {
        if (passage || to === stepIndex || !Number.isInteger(to) || to < 0 || to >= stepCount) return
        if (still) onDepthChange?.(to)
        dispatch({ type: 'navigate', to, animate: !still })
    }

    function togglePause() {
        if (passage) onDepthChange?.(passage.to)
        dispatch({ type: 'settle' })
        setPaused(value => !value)
    }

    useEffect(() => {
        if (!passage) return
        // Une arrivée propre reste possible si l'onglet disparaît ou si une animation est interrompue.
        const timer = window.setTimeout(() => {
            onDepthChange?.(passage.to)
            dispatch({ type: 'settle' })
        }, still || hidden ? 0 : 1500)
        return () => window.clearTimeout(timer)
    }, [passage, still, hidden, onDepthChange])

    useEffect(() => {
        const title = document.title
        document.title = 'La traversée — It\'s a kind of magic'
        document.body.classList.add('umbra-preview-body')
        return () => { document.title = title; document.body.classList.remove('umbra-preview-body') }
    }, [])

    return <main className="umbra-preview" data-mode={mode} data-depth={depth} data-travel={passage?.direction ?? 'idle'} data-crossing={passage?.phase ?? 'idle'} data-still={still} data-paused={hidden || still} aria-busy={passage !== null} style={{
        '--depth': depth,
        '--umbra-sky': palette.sky.join(' '), '--umbra-middle': palette.middle.join(' '), '--umbra-ground': palette.ground.join(' '),
        '--umbra-mist': palette.mist.join(' '), '--umbra-edge': palette.edge.join(' '), '--umbra-glow': palette.glow.join(' '), '--umbra-filament': palette.filament.join(' '),
        '--haze-presence': palette.hazePresence, '--horizon-presence': palette.horizonPresence,
        '--journey-direction': passage?.direction === 'up' ? -1 : 1,
        '--leave-time': `${UMBRA_LEAVE_MS}ms`, '--arrive-time': `${UMBRA_ARRIVE_MS}ms`, '--journey-time': `${UMBRA_LEAVE_MS + UMBRA_ARRIVE_MS}ms`,
    } as CSSProperties}>
        <div className="umbra-world" aria-hidden="true" onAnimationEnd={event => {
            if (event.target !== event.currentTarget) return
            if (event.animationName === 'umbra-world-out') {
                if (passage?.phase === 'leaving') onDepthChange?.(passage.to)
                dispatch({ type: 'cross' })
            }
            if (event.animationName === 'umbra-world-in') dispatch({ type: 'arrive' })
        }}><div className="umbra-haze haze-one" /><div className="umbra-haze haze-two" /><div className="umbra-horizon" /><Seals /><UmbraAtmosphere depth={depth} still={still} /><div className="umbra-vignette" /></div>
        <div className="umbra-veil" aria-hidden="true"><div className="umbra-veil-curtain" /><div className="umbra-veil-ring" /><div className="umbra-veil-ring" /><div className="umbra-veil-ring" /><div className="umbra-veil-grain" /></div>
        <header className="umbra-header"><a href="/" className="umbra-brand"><span aria-hidden="true">☾</span><span>It's a kind of magic<small>Une traversée du voile</small></span></a><span className="umbra-preview-label"><i /> {mode === 'preview' ? 'Aperçu d’ambiance' : 'La traversée'}</span></header>
        <nav className="umbra-depths" aria-label="Paliers de la traversée"><ol>{DEPTHS.map((step, index) => <li key={step.name}>{mode === 'preview' ? <button type="button" aria-current={index === depth ? 'step' : undefined} aria-disabled={passage !== null} onClick={() => goToDepth(index)} aria-label={`Palier ${index + 1} : ${step.name}`}><span className="umbra-depth-number">0{index + 1}</span><span className="umbra-depth-name">{step.name}</span><span className="umbra-depth-dot" /></button> : <span className="umbra-depth-step" aria-current={index === depth ? 'step' : undefined}><span className="umbra-depth-number">0{index + 1}</span><span className="umbra-depth-name">{step.name}</span><span className="umbra-depth-dot" /></span>}</li>)}</ol></nav>
        <div className="umbra-copy">
            <Moon />
            <p className="umbra-kicker"><span /> Gaïa se souvient. Luna veille. <span /></p>
            {children ? children({ depth, travelling: passage !== null, still, hidden, navigate: goToDepth }) : <>
            <h1>Oubliez <em>l’Humain.</em></h1>
            <p className="umbra-invitation">Laissez parler le Loup en vous.</p>
            <div className="umbra-divider" aria-hidden="true"><span />◇<span /></div>
            <p className="umbra-question">Que feriez-vous vraiment,<br />débarrassé de la peau d’homme&nbsp;?</p>
            <div className="umbra-current" role="status" aria-live="polite"><span className="umbra-current-number">0{depth + 1}</span><span>{current.name}<small>{passage ? 'Traversée…' : current.word}</small></span></div>
            <button type="button" className="umbra-descend" aria-disabled={passage !== null} onClick={() => goToDepth((depth + 1) % DEPTHS.length)}><span>{depth === 3 ? 'Revenir à la lisière' : 'Descendre d’un voile'}</span><span aria-hidden="true">{depth === 3 ? '↺' : '↓'}</span></button>
            <p className="umbra-demo-note">Démonstration · quatre paliers à explorer</p>
            </>}
        </div>
        {mode === 'questions' ? !still && !hidden && !passage && <UmbraIntrusions key={stepIndex} questionIndex={stepIndex} /> : mode !== 'complete' && <Whisper key={`${depth}-${still}`} fragments={current.fragments} still={still} />}
        <footer className="umbra-footer"><span>Le monde a une autre face.</span><button type="button" className="umbra-pause" onClick={togglePause} disabled={reducedMotion} aria-pressed={still}>{reducedMotion ? 'Mouvement réduit' : paused ? 'Animer la scène' : 'Immobiliser la scène'}</button><span className="umbra-footer-depth">Au-delà du voile <b>0{depth + 1} / 04</b></span></footer>
    </main>
}
