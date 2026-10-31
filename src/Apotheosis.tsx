import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import type { AuspiceId } from './auspices'
import type { FinaleStage } from './finaleModel'
import { APPEAL_TEXT, SATURATION_FRAGMENTS, diagnosticLines, saturationCount, stageDuration } from './finaleModel'
import useRitualClock from './useRitualClock'
import useStorageProblem from './useStorageProblem'
import landscape from './assets/lunar-plain.webp'
import './Apotheosis.css'

export default function Apotheosis({ stage, auspice, onNext, onFinish }: { stage: FinaleStage; auspice: AuspiceId; onNext: () => void; onFinish: () => void }) {
    const { elapsed, reduced, hidden, paused, togglePause } = useRitualClock(stageDuration(stage, auspice))
    const storageProblem = useStorageProblem()
    const heading = useRef<HTMLHeadingElement>(null)
    const terminal = useRef<HTMLDivElement>(null)
    const lines = diagnosticLines(auspice)
    const count = stage === 'silence' || reduced ? SATURATION_FRAGMENTS.length : saturationCount(elapsed)
    const visibleLines = reduced ? lines.length : Math.min(lines.length, 1 + Math.floor(elapsed / 780))
    useEffect(() => {
        const title = document.title
        document.title = 'Incident de synthèse — It\'s a kind of magic'
        document.body.classList.add('ritual-body')
        const frame = requestAnimationFrame(() => { window.scrollTo(0, 0); heading.current?.focus({ preventScroll: true }) })
        return () => { cancelAnimationFrame(frame); document.title = title; document.body.classList.remove('ritual-body') }
    }, [])
    useEffect(() => {
        if (reduced || paused || hidden || elapsed < stageDuration(stage, auspice)) return
        onNext()
    }, [elapsed, reduced, paused, hidden, stage, auspice, onNext])
    useEffect(() => { if (terminal.current) terminal.current.scrollTop = terminal.current.scrollHeight }, [visibleLines])
    return <main className={`apotheosis stage-${stage}`} data-still={reduced || paused}>
        <h1 ref={heading} tabIndex={-1} className="sr-only">{stage === 'appeal' ? 'Un appel dans le silence' : stage === 'diagnostic' ? 'Recherche de l’origine du message' : stage === 'rupture' ? 'Rupture de l’affichage' : 'Accumulation de fragments'}</h1>
        {(stage === 'saturation' || stage === 'silence') && <div className="apotheosis-cloud" aria-hidden="true">
            <img src={landscape} alt="" className="apotheosis-landscape" />
            <div className="apotheosis-ghost">Service de santé au travail<br />SYNTHÈSE DU DOSSIER<br />Traitement en cours.</div>
            {SATURATION_FRAGMENTS.slice(0, count).map((text, index) => <span className="apotheosis-fragment" key={index} style={{ '--x': `${(index * 37.71) % 94}%`, '--y': `${(index * 23.67) % 91}%`, '--size': `${12 + index % 7 * 4}px`, '--turn': `${index % 5 === 0 ? -90 : (index % 7 - 3) * 2}deg` } as CSSProperties}>{text}</span>)}
        </div>}
        {stage === 'appeal' && <div className="apotheosis-appeal"><p>{APPEAL_TEXT}</p><span aria-hidden="true">☾</span></div>}
        {stage === 'diagnostic' && <>
            <div className="apotheosis-terminal" role="region" aria-label="Console de diagnostic"><div className="terminal-bar"><span aria-hidden="true">● ● ●</span><span>INCIDENT RESPONSE / SOURCE VERIFICATION</span></div><div ref={terminal} className="terminal-output" tabIndex={0}>{lines.slice(0, visibleLines).map((line, index) => <p key={index} data-error={/FAILED|ERROR|UNKNOWN|AMBIGUOUS|NOT FOUND|INVALID|FALSE/.test(line)}><span className="terminal-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>{line}</p>)}<span className="terminal-cursor" aria-hidden="true">▌</span></div><p className="terminal-progress">{String(visibleLines).padStart(2, '0')} / {lines.length} · Analyse de la source</p></div>
            {visibleLines > 12 && <p className="terminal-foreign" aria-hidden="true">{visibleLines < 20 ? 'REMEMBER' : visibleLines < 27 ? 'THE WORLD IS DYING' : 'LUNA HAS SEEN YOU'}</p>}
        </>}
        {stage === 'rupture' && <div className="apotheosis-break" aria-hidden="true"><p>PROTECTOR // REQUIRED</p><div>REALITY // ERROR<br />CONSENSUS // ERROR<br />THE OBSERVER IS PART OF THE INCIDENT</div></div>}
        <nav className="ritual-controls" aria-label="Lecture de la séquence">
            <button type="button" onClick={togglePause} disabled={reduced}>{reduced ? 'Mouvement réduit' : paused ? 'Reprendre' : 'Lire à mon rythme'}</button>
            {(paused || reduced) && <button type="button" onClick={onNext}>Continuer</button>}
            <button type="button" onClick={onFinish}>Passer au dossier</button>
        </nav>
        {storageProblem && <p className="ritual-save-error" role="alert">La sauvegarde sur cet appareil est indisponible. Gardez cet onglet ouvert pour conserver vos réponses.</p>}
    </main>
}
