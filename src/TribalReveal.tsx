import { useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { getUmbraAssessmentResult } from './umbraQuestionnaire'
import type { UmbraDraft } from './umbraQuestionnaire'
import { UMBRA_TRIBES } from './umbraTribes'
import type { TribeId } from './umbraTribes'
import './TribalReveal.css'

// Sceaux abstraits de maquette : ces tracés ne sont pas les glyphes W20 officiels.
export function Seal({ index }: { index: number }) {
    const sides = 3 + index % 5
    const points = Array.from({ length: sides }, (_, point) => {
        const angle = point * Math.PI * 2 / sides - Math.PI / 2 + index * 0.19
        return `${50 + Math.cos(angle) * 25},${50 + Math.sin(angle) * 25}`
    }).join(' ')
    return <svg viewBox="0 0 100 100" fill="none" aria-hidden="true">
        <circle cx="50" cy="50" r="43" stroke="currentColor" strokeWidth="0.65" strokeDasharray={`${5 + index} 4 1 4`} />
        <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="0.65" opacity="0.6" />
        <polygon points={points} stroke="currentColor" strokeWidth="1.3" />
        <path d={index % 3 === 0 ? 'M50 18V82M25 50H75M36 29L64 71' : index % 3 === 1 ? 'M28 27L72 73M72 27L28 73M50 22V78' : 'M23 50H77M50 22V78M32 32L68 68M32 68L68 32'} stroke="currentColor" strokeWidth="1.1" />
        <circle cx="50" cy="50" r={index % 2 ? 7 : 3} stroke="currentColor" strokeWidth="1.1" />
        <circle cx="50" cy="7" r="2" fill="currentColor" />
    </svg>
}

function sealPosition(index: number) {
    const angle = index * Math.PI * 2 / UMBRA_TRIBES.length - Math.PI / 2
    return { x: 50 + Math.cos(angle) * 40, y: 50 + Math.sin(angle) * 39 }
}

type Props = { draft: UmbraDraft; onReview: () => void; onBack: () => void; onExplore: () => void; onRestart?: () => void }

export default function TribalReveal({ draft, onReview, onBack, onExplore, onRestart }: Props) {
    const result = useMemo(() => getUmbraAssessmentResult(draft), [draft])
    const [listening, setListening] = useState<TribeId | null>(null)
    const heading = useRef<HTMLHeadingElement>(null)
    useEffect(() => {
        const frame = requestAnimationFrame(() => {
            heading.current?.focus({ preventScroll: true })
            heading.current?.scrollIntoView({ block: 'start', behavior: 'instant' })
        })
        return () => cancelAnimationFrame(frame)
    }, [])
    const rank = (id: TribeId) => result.majorResonances.includes(id) ? 'major' : result.nearResonances.includes(id) ? 'near' : 'open'
    const labels = { major: 'Résonance majeure', near: 'Résonance proche', open: 'Voix ouverte' }
    const focused = UMBRA_TRIBES.find(tribe => tribe.id === listening)

    return <section className="tribal-reveal" aria-labelledby="tribal-reveal-title">
        <p className="umbra-situation-label">Le Cercle des Treize</p>
        <h1 id="tribal-reveal-title" ref={heading} tabIndex={-1}>Certaines voix<br /><em>vous reconnaissent.</em></h1>
        <div className="tribal-constellation">
            <svg className="tribal-filaments" viewBox="0 0 1000 740" fill="none" aria-hidden="true">
                <ellipse cx="500" cy="370" rx="400" ry="288.6" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 13" />
                <ellipse cx="500" cy="370" rx="430" ry="315" stroke="currentColor" strokeWidth="0.5" opacity="0.25" />
                {UMBRA_TRIBES.map((tribe, index) => {
                    const resonance = rank(tribe.id)
                    if (resonance === 'open') return null
                    const { x, y } = sealPosition(index)
                    return <path key={tribe.id} data-resonance={resonance} d={`M500 370Q${500 + (x * 10 - 500) * 0.65} 370 ${x * 10} ${y * 7.4}`} />
                })}
            </svg>
            <div className="tribal-reveal-heart" id="tribal-reveal-intro">
                <div className="tribal-heart-moon" aria-hidden="true">☾</div>
                <p>Votre passage dans le Voile{' '}<br />a laissé des traces.</p>
                <p>Certaines visions du monde{' '}<br />répondent davantage aux vôtres.</p>
                <p>Elles ne décident pourtant pas{' '}<br />de ce que vous êtes.</p>
                <span className="tribal-heart-mark" aria-hidden="true">⌁</span>
            </div>
            <ul className="tribal-seals" aria-label="Les treize Tribus et leurs résonances">
                {UMBRA_TRIBES.map((tribe, index) => {
                    const { x, y } = sealPosition(index)
                    const resonance = rank(tribe.id)
                    return <li key={tribe.id} style={{ '--seal-x': `${x}%`, '--seal-y': `${y}%` } as CSSProperties}>
                        <button type="button" className="tribal-seal" data-resonance={resonance} aria-label={`Écouter ${tribe.name} — ${labels[resonance]}`} aria-pressed={listening === tribe.id} onClick={() => setListening(tribe.id)}>
                            <span className="tribal-seal-symbol"><Seal index={index} /></span>
                            <span className="tribal-seal-name">{tribe.name}</span>
                            <span className="tribal-seal-rank">{labels[resonance]}</span>
                        </button>
                    </li>
                })}
            </ul>
        </div>
        <div className="tribal-listening" aria-live="polite" aria-atomic="true">
            {focused ? <><strong>{focused.name}</strong><span>{labels[rank(focused.id)]}. Votre choix reste libre.</span></> : <><strong>Toutes les voix restent à portée.</strong><span>Vous gardez le choix.</span></>}
        </div>
        <div className="umbra-question-actions"><button className="umbra-descend" type="button" onClick={onExplore}>Explorer les Tribus <span aria-hidden="true">→</span></button><button className="umbra-text-button" type="button" onClick={onReview}>Revoir mes réponses</button><button className="umbra-text-button" type="button" onClick={onBack}>Retour au dossier</button>{onRestart && <button className="umbra-text-button" type="button" onClick={onRestart}>Rejouer la traversée</button>}</div>
    </section>
}
