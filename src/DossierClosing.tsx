import { useEffect, useRef } from 'react'
import { closingFrame, closingMessage } from './finaleModel'
import useRitualClock from './useRitualClock'

export default function DossierClosing({ name, onSeen, onClose }: { name: string; onSeen: () => void; onClose: () => void }) {
    const { elapsed, reduced, paused, togglePause } = useRitualClock(13000)
    const frame = closingFrame(name, reduced ? 13000 : elapsed)
    const seen = useRef(false)
    const heading = useRef<HTMLHeadingElement>(null)
    useEffect(() => { const raf = requestAnimationFrame(() => heading.current?.focus()); return () => cancelAnimationFrame(raf) }, [])
    useEffect(() => {
        if (frame.phase !== 'revealed' || seen.current) return
        seen.current = true
        onSeen()
    }, [frame.phase, onSeen])
    return <div className="dossier-closing" role="dialog" aria-modal="true" aria-labelledby="closing-title" data-phase={frame.phase} data-still={reduced || paused} onKeyDown={event => {
        if (event.key === 'Escape') { onSeen(); onClose() }
        if (event.key !== 'Tab') return
        const buttons = event.currentTarget.querySelectorAll<HTMLButtonElement>('button:not([disabled])')
        if (event.shiftKey && (document.activeElement === buttons[0] || document.activeElement === heading.current)) { event.preventDefault(); buttons[buttons.length - 1]?.focus() }
        else if (!event.shiftKey && document.activeElement === buttons[buttons.length - 1]) { event.preventDefault(); buttons[0]?.focus() }
    }}>
        <h2 id="closing-title" className="sr-only" ref={heading} tabIndex={-1}>Confirmation de votre dossier</h2>
        <p className="sr-only" role="status" aria-live="polite">{frame.phase === 'revealed' ? closingMessage(name) : 'La confirmation du dossier est perturbée. Le message final va apparaître.'}</p>
        <div className="closing-display" aria-hidden="true"><p>{frame.text}</p>{frame.phase === 'storm' && <span className="closing-echo">{frame.text}</span>}</div>
        <nav className="ritual-controls" aria-label="Confirmation du dossier"><button type="button" disabled={reduced || frame.phase === 'revealed'} onClick={togglePause}>{paused ? 'Reprendre' : 'Lire à mon rythme'}</button><button type="button" onClick={() => { onSeen(); onClose() }}>Afficher le dossier</button></nav>
    </div>
}
