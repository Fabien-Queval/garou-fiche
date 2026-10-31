import { useEffect, useReducer, useRef, useState, useSyncExternalStore } from 'react'
import type { CSSProperties, Dispatch, SetStateAction } from 'react'
import type { UmbraDraft } from './umbraQuestionnaire'
import { AUSPICES, browseAuspice, confirmAuspiceChoice, getAuspice, leaveAuspices } from './auspices'
import type { AuspiceId } from './auspices'
import { LUNAR_PASSAGE_MS, lunarJourneyReducer, nextAuspice } from './lunarJourney'
import LunarMoon from './LunarMoon'
import landscape from './assets/lunar-plain.webp'
import './AuspiceScene.css'

function subscribeMotion(callback: () => void) {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    media.addEventListener('change', callback)
    return () => media.removeEventListener('change', callback)
}
function subscribeVisibility(callback: () => void) {
    document.addEventListener('visibilitychange', callback)
    return () => document.removeEventListener('visibilitychange', callback)
}
const motionSnapshot = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const visibilitySnapshot = () => document.hidden

type Props = { draft: UmbraDraft; setDraft: Dispatch<SetStateAction<UmbraDraft>>; storageError: boolean }

export default function AuspiceScene({ draft, setDraft, storageError }: Props) {
    const chosen = draft.auspiceStage === 'chosen' && Boolean(draft.auspiceChoice)
    const [journey, dispatch] = useReducer(lunarJourneyReducer, { current: (chosen ? draft.auspiceChoice?.auspiceId : draft.viewedAuspice) ?? draft.auspiceChoice?.auspiceId ?? 'ragabash', passage: null })
    const [opened, setOpened] = useState(false)
    const [confirming, setConfirming] = useState(false)
    const [paused, setPaused] = useState(false)
    const reducedMotion = useSyncExternalStore(subscribeMotion, motionSnapshot, () => true)
    const hidden = useSyncExternalStore(subscribeVisibility, visibilitySnapshot, () => true)
    const still = paused || reducedMotion || hidden
    const currentId = (chosen ? draft.auspiceChoice?.auspiceId : undefined) ?? journey.passage?.to ?? journey.current
    const profile = getAuspice(currentId)
    const heading = useRef<HTMLHeadingElement>(null)
    const panelHeading = useRef<HTMLHeadingElement>(null)
    const panel = useRef<HTMLElement>(null)
    const moon = useRef<HTMLButtonElement>(null)
    const wasOpened = useRef(false)
    const sky = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const previousTitle = document.title
        document.title = 'Sous le regard de Luna — It\'s a kind of magic'
        document.body.classList.add('umbra-preview-body')
        return () => { document.title = previousTitle; document.body.classList.remove('umbra-preview-body') }
    }, [])
    useEffect(() => {
        const frame = requestAnimationFrame(() => {
            heading.current?.focus({ preventScroll: true })
            sky.current?.scrollIntoView({ block: 'start', behavior: 'instant' })
        })
        return () => cancelAnimationFrame(frame)
    }, [chosen])
    useEffect(() => {
        if (!journey.passage) return
        const timer = window.setTimeout(() => dispatch({ type: 'settle' }), still ? 0 : LUNAR_PASSAGE_MS + 300)
        return () => window.clearTimeout(timer)
    }, [journey.passage, still])
    useEffect(() => {
        const frame = requestAnimationFrame(() => {
            if (opened) {
                if (panel.current) panel.current.scrollTop = 0
                panelHeading.current?.focus({ preventScroll: true })
                if (window.matchMedia('(max-width: 760px)').matches) panel.current?.scrollIntoView({ block: 'start', behavior: 'instant' })
                else panelHeading.current?.scrollIntoView({ block: 'nearest', behavior: 'instant' })
            } else if (wasOpened.current) {
                moon.current?.focus({ preventScroll: true })
                sky.current?.scrollIntoView({ block: 'start', behavior: 'instant' })
            }
            wasOpened.current = opened
        })
        return () => cancelAnimationFrame(frame)
    }, [opened, confirming, chosen])

    function navigate(to: AuspiceId, direction: 1 | -1) {
        if (journey.passage || chosen || to === journey.current) return
        setOpened(false)
        setConfirming(false)
        setDraft(current => browseAuspice(current, to))
        dispatch({ type: 'navigate', to, direction, animate: !still })
    }
    function closePanel() { setOpened(false); setConfirming(false) }
    function openPanel() { if (!journey.passage) { setConfirming(false); setOpened(true) } }

    return <main className="lunar-scene" data-still={still} data-travelling={Boolean(journey.passage)} data-panel={opened} onKeyDown={event => {
        if (event.key === 'Escape' && opened) { event.preventDefault(); closePanel() }
        if (opened || chosen || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return
        event.preventDefault()
        const direction = event.key === 'ArrowRight' ? 1 : -1
        navigate(nextAuspice(journey.current, direction), direction)
    }} style={{ '--lunar-direction': journey.passage?.direction ?? 1, '--lunar-passage': `${LUNAR_PASSAGE_MS}ms` } as CSSProperties}>
        <img className="lunar-landscape" src={landscape} alt="" aria-hidden="true" />
        <div className="lunar-shade" aria-hidden="true" />
        <div className="lunar-sky" ref={sky}>
            <header className="lunar-header"><a href="/" className="lunar-brand"><span aria-hidden="true">☾</span><span>It's a kind of magic<small>Sous le regard de Luna</small></span></a><button type="button" className="lunar-back" onClick={() => setDraft(leaveAuspices)}>← Votre Tribu</button></header>
            <div className="lunar-introduction"><p className="lunar-eyebrow">Les cinq visages de Luna</p><h1 ref={heading} tabIndex={-1}>{chosen ? <>Luna a entendu<br /><em>votre choix.</em></> : <>Quelle lune<br /><em>vous appelle ?</em></>}</h1><p>{chosen ? 'Une place à inventer au sein de la meute.' : 'Un même ciel. Cinq manières de répondre à son appel.'}</p></div>
            <div className="lunar-orbit" aria-busy={Boolean(journey.passage)}>
                {journey.passage && <span className="lunar-setting-motion" aria-hidden="true"><span className="lunar-moon-setting"><LunarMoon light={getAuspice(journey.passage.from).light} /></span></span>}
                <div className={`lunar-moon-motion${journey.passage ? ' lunar-moon-rising' : ''}`} key={currentId} onAnimationEnd={event => { if (event.target === event.currentTarget && event.animationName === 'lunar-rise') dispatch({ type: 'settle' }) }}>
                <button ref={moon} type="button" className="lunar-moon-current" aria-label={`Découvrir ${profile.phase} — ${profile.name}`} aria-expanded={opened} aria-controls="lunar-auspice-card" disabled={Boolean(journey.passage)} onClick={openPanel}>
                    <span className="lunar-moon-face"><LunarMoon light={profile.light} /></span>
                    <span className="lunar-moon-caption"><span>{profile.phase}</span><strong>{profile.name}</strong><small>{chosen ? 'Votre Auspice' : 'Découvrir cet Auspice'}</small></span>
                </button>
                </div>
            </div>
            {!chosen && <div className="lunar-arrows" aria-label="Faire tourner le ciel"><button type="button" disabled={Boolean(journey.passage)} onClick={() => navigate(nextAuspice(journey.current, -1), -1)} aria-label="Lune précédente">←</button><button type="button" disabled={Boolean(journey.passage)} onClick={() => navigate(nextAuspice(journey.current, 1), 1)} aria-label="Lune suivante">→</button></div>}
            <div className="lunar-hud">
                {chosen ? <div className="lunar-chosen"><p className="lunar-eyebrow">Votre Auspice</p><h2>{profile.name} <span>· {profile.role}</span></h2><p>Votre préférence est enregistrée. Elle se prépare avec le MJ pour la séance 0.</p><button type="button" className="lunar-link" onClick={() => setDraft(current => browseAuspice(current, currentId))}>Revoir les cinq lunes</button></div> : <>
                    <p className="lunar-guidance">Approchez une lune. Écoutez ce qu’elle vous propose.</p>
                    {draft.auspiceChoice && <p className="lunar-existing">Préférence conservée : {getAuspice(draft.auspiceChoice.auspiceId).name}.</p>}
                    <nav className="lunar-phases" aria-label="Les cinq phases de la Lune">{AUSPICES.map((auspice, index) => <button key={auspice.id} type="button" aria-label={`Voir ${auspice.phase} — ${auspice.name}`} aria-current={auspice.id === currentId ? 'step' : undefined} disabled={Boolean(journey.passage)} onClick={() => navigate(auspice.id, index > AUSPICES.findIndex(item => item.id === journey.current) ? 1 : -1)}><LunarMoon light={auspice.light} /><span>{auspice.phase}</span></button>)}</nav>
                </>}
            </div>
            <footer className="lunar-footer"><span>Le loup attend. Le ciel vous écoute.</span><button type="button" disabled={reducedMotion} aria-pressed={paused || reducedMotion} onClick={() => setPaused(value => !value)}>{reducedMotion ? 'Mouvement réduit' : paused ? 'Animer les lunes' : 'Immobiliser les lunes'}</button></footer>
        </div>
        <p className="sr-only" role="status" aria-live="polite">{journey.passage ? 'Le ciel tourne.' : `${profile.phase}. ${profile.name}. ${profile.role}.`}</p>
        {opened && <article ref={panel} className="lunar-card" id="lunar-auspice-card" role="region" aria-labelledby="lunar-card-title">
            <button type="button" className="lunar-card-close" onClick={closePanel} aria-label="Fermer la fiche de l’Auspice">×</button>
            <p className="lunar-eyebrow">{profile.phase} · Informations hors-jeu</p>
            <h2 ref={panelHeading} tabIndex={-1} id="lunar-card-title">{confirming ? `Choisir ${profile.name} ?` : profile.name}</h2>
            <p className="lunar-role">{profile.role}</p>
            {confirming ? <>
                <p>Vous confirmez cet Auspice pour votre personnage. Il est indépendant des résonances et du choix de Tribu.</p>
                <p>Votre préférence précédente, si vous en aviez une, sera remplacée. La préparation du personnage et la validation avec le MJ restent à la séance 0.</p>
                <div className="lunar-card-actions"><button type="button" className="lunar-confirm" onClick={() => { wasOpened.current = false; closePanel(); setDraft(current => confirmAuspiceChoice(current, currentId)) }}>Confirmer mon Auspice <span aria-hidden="true">☾</span></button><button type="button" className="lunar-link" onClick={() => setConfirming(false)}>Relire la fiche</button><button type="button" className="lunar-link" onClick={closePanel}>Continuer à regarder le ciel</button></div>
            </> : <>
                <p className="lunar-invocation">{profile.invocation}</p><p>{profile.description}</p>
                <h3>Au sein de la meute</h3><p>{profile.pack}</p>
                <h3>Ce que cela demande</h3><p>{profile.tension}</p>
                <p className="lunar-prompt">{profile.prompt}</p>
                <p className="lunar-source">Dans W20, la lune de naissance détermine l’Auspice du Garou. Vous choisissez ici celui de votre personnage. Synthèse française du livre VO, p. {profile.pages}. Dons et finition de fiche : séance 0.</p>
                <div className="lunar-card-actions"><button type="button" className="lunar-confirm" onClick={() => setConfirming(true)}>{draft.auspiceChoice?.auspiceId === currentId ? 'Confirmer à nouveau cet Auspice' : 'Choisir cet Auspice'} <span aria-hidden="true">→</span></button><button type="button" className="lunar-link" onClick={closePanel}>Retour au ciel</button></div>
            </>}
        </article>}
        {storageError && <p className="lunar-storage-error" role="alert">La sauvegarde sur cet appareil est indisponible. Gardez cet onglet ouvert pour conserver vos réponses.</p>}
    </main>
}
