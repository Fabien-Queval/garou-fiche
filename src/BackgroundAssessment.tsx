import { useCallback, useEffect, useRef, useState } from 'react'
import type { CSSProperties, Dispatch, SetStateAction } from 'react'
import { BACKGROUNDS, BACKGROUND_POINTS, allocatedBackgroundPoints, canCompleteBackgrounds, revealBackground, selectBackgroundLevel, setBackgroundDetail } from './backgrounds'
import type { BackgroundDefinition, BackgroundDraft, BackgroundId, BackgroundLevel, DetailField } from './backgrounds'
import { corruptText, distortionAt, SCRAMBLE_DURATION } from './scramble'
import { useCentralAnomaly } from './useCentralAnomaly'
import type { TotemRepository, TotemSummary } from './totemRepository'
import './Assessment.css'
import './AbilityAssessment.css'
import './BackgroundAssessment.css'

type FieldProps = { field: DetailField; id: string; value: string; onChange: (value: string) => void }
function DetailInput({ field, id, value, onChange }: FieldProps) {
    return (
        <div className="background-detail-field" data-discordant={field.key === 'spiritType' && /banes/i.test(value)}>
            <label htmlFor={id}>{field.label}{field.required && <span className="field-required"> — obligatoire</span>}</label>
            {field.kind === 'select' ? (
                <select id={id} value={value} onChange={event => onChange(event.target.value)}>
                    <option value="">Choisissez une option</option>
                    {field.options?.map(option => <option key={option}>{option}</option>)}
                </select>
            ) : field.kind === 'textarea' ? (
                <textarea id={id} value={value} rows={3} maxLength={500} onChange={event => onChange(event.target.value)} aria-describedby={field.hint ? `${id}-hint` : undefined} />
            ) : (
                <input id={id} value={value} maxLength={160} required={field.required} onChange={event => onChange(event.target.value)} />
            )}
            {field.hint && <p className="background-field-hint" id={`${id}-hint`}>{field.hint}</p>}
            {field.suggestions && <div className="detail-suggestions">
                <span>Par exemple :</span>
                {field.suggestions.map(example => <button type="button" key={example} onClick={() => onChange(example)}>{example}</button>)}
            </div>}
        </div>
    )
}

function LevelReference({ levels, value, caption }: { levels: BackgroundLevel[]; value: number; caption?: string }) {
    const level = levels[value - 1]
    return (
        <>
            {level && <div className="level-description"><p className="level-caption">{caption ?? `Niveau ${value}`}</p><p>{level.title}</p>{level.description && <p>{level.description}</p>}</div>}
            <details className="associated-domains background-level-reference">
                <summary>{caption ? `Repères — ${caption}` : 'Voir tous les repères'}</summary>
                <ol>{levels.map((item, index) => <li key={index}><strong>{item.title}</strong>{item.description && <p>{item.description}</p>}</li>)}</ol>
            </details>
        </>
    )
}

function TotemPanel({ draft, repository }: { draft: BackgroundDraft; repository?: TotemRepository }) {
    const [summary, setSummary] = useState<TotemSummary | null>(null)
    const [busy, setBusy] = useState(false)
    const [error, setError] = useState('')
    const controller = useRef<AbortController | null>(null)
    useEffect(() => {
        if (!repository) return
        const request = new AbortController()
        repository.getSummary(request.signal).then(setSummary).catch(error => {
            if (!request.signal.aborted) setError(error instanceof Error ? error.message : 'Le total de la meute est indisponible.')
        })
        return () => request.abort()
    }, [repository])
    useEffect(() => () => controller.current?.abort(), [])
    async function refresh(publish = false) {
        if (!repository || busy) return
        controller.current?.abort()
        controller.current = new AbortController()
        setBusy(true)
        setError('')
        try {
            if (publish) await repository.saveBackgrounds(draft, controller.current.signal)
            setSummary(await repository.getSummary(controller.current.signal))
        } catch (error) {
            if (!controller.current.signal.aborted) setError(error instanceof Error ? error.message : 'La meute est momentanément indisponible.')
        } finally { setBusy(false) }
    }
    return <div className="totem-summary">
        <p>Votre contribution : <strong>{draft.values.totemContribution}</strong></p>
        <p>Puissance actuellement investie par la meute : <strong>{summary?.total ?? 'indisponible'}</strong></p>
        {!repository && <p className="background-field-hint">Le total collectif sera disponible lorsque votre groupe sera relié. Votre contribution est conservée dans vos réponses.</p>}
        {repository && <div className="totem-actions">
            <button type="button" disabled={busy} onClick={() => refresh(true)}>Partager ma contribution</button>
            <button type="button" disabled={busy} onClick={() => refresh()}>Actualiser la meute</button>
        </div>}
        {summary && summary.ownContribution !== draft.values.totemContribution && <p className="background-field-hint">Actualisez cette vue pour prendre en compte votre nouvelle contribution.</p>}
        {busy && <p role="status">La meute est interrogée…</p>}
        {error && <p role="alert">{error}</p>}
        <p className="background-field-hint">Le choix du Totem se fera avec la meute.</p>
    </div>
}

type CardProps = {
    definition: BackgroundDefinition; draft: BackgroundDraft; remaining: number
    onChoose: (id: BackgroundId, value: number) => void
    onDetail: (id: BackgroundId, index: number, key: string, value: string) => void
    onReveal: (id: BackgroundId) => void
    onOpen: (id: BackgroundId, button: HTMLButtonElement) => void
    totemRepository?: TotemRepository
}
function BackgroundCard({ definition, draft, remaining, onChoose, onDetail, onReveal, onOpen, totemRepository }: CardProps) {
    const value = draft.values[definition.id]
    const revealed = draft.revealed.includes(definition.id)
    const [revealedOnArrival] = useState(revealed)
    const handleEnter = useCallback(() => onReveal(definition.id), [definition.id, onReveal])
    const enabled = definition.presentationMode === 'foreign' || (definition.presentationMode === 'hybrid' && !revealedOnArrival)
    const { card, centerProbe, elapsed, intensity, reducedMotion } = useCentralAnomaly(enabled, SCRAMBLE_DURATION, handleEnter)
    const strength = reducedMotion ? 0 : intensity * definition.intensity
    const stage = strength > 0 ? distortionAt(elapsed) : 'quiet'
    const foreign = definition.presentationMode === 'foreign'
    const layered = definition.presentationMode === 'hybrid' && revealed
    const visualTitle = (text: string) => <span className="background-echo-title"><span className="sr-only">{text}</span><span aria-hidden="true">{corruptText(text, elapsed, strength * 0.65)}</span></span>
    return <fieldset ref={card} className="criterion-card ability-card background-card" data-background={definition.id} data-background-mode={definition.presentationMode} data-layered={layered} data-anomaly-stage={stage} style={{ '--anomaly-strength': strength } as CSSProperties}>
        <legend>{foreign ? visualTitle(definition.title) : definition.title}</legend>
        <span ref={centerProbe} className="anomaly-center-probe" aria-hidden="true" />
        <div className="anomaly-surface" aria-hidden="true"><span className="anomaly-grain" /><span className="anomaly-tear" /><span className="anomaly-tear anomaly-tear--second" /></div>
        <p className="criterion-description">{definition.description}</p>
        {definition.extraDescription && <p className="criterion-description">{definition.extraDescription}</p>}
        {definition.inlineAlways && definition.fields.map(field => <DetailInput key={field.key} field={field} id={`${definition.id}-${field.key}`} value={draft.details[definition.id]?.[0]?.[field.key] ?? ''} onChange={text => onDetail(definition.id, 0, field.key, text)} />)}
        {layered && <div className="background-garou-layer">
            <h3>{visualTitle(definition.garouTitle!)}</h3>
            <p>{definition.garouDescription}</p>
            {definition.garouExtra && <p>{definition.garouExtra}</p>}
        </div>}
        {definition.emphasis && <p className="totem-emphasis">{definition.emphasis}</p>}
        <div className="rating-levels background-levels">
            {[0, 1, 2, 3, 4, 5].map(level => <label className="level-control" key={level}>
                <input type="radio" className="sr-only level-input" name={definition.id} aria-label={level === 0 ? 'Niveau 0 — Aucun point' : `Niveau ${level}`} aria-describedby={`${definition.id}-current-level`} checked={value === level} disabled={level - value > remaining} onChange={() => onChoose(definition.id, level)} />
                <span className={`level-dot ${level === 0 ? 'zero-level' : ''}`} aria-hidden="true">{level === 0 ? '0' : level <= value ? '●' : '○'}</span>
            </label>)}
        </div>
        <div id={`${definition.id}-current-level`}>
            {value === 0 && <p className="background-field-hint">Aucun point attribué à cet appui.</p>}
            {definition.humanLevels && <LevelReference levels={definition.humanLevels} value={value} caption="Votre référent" />}
            {(definition.presentationMode !== 'hybrid' || layered) && <LevelReference levels={definition.levels} value={value} caption={definition.id === 'mentor' ? 'Rang Garou' : undefined} />}
        </div>
        {value > 0 && definition.inline && !definition.inlineAlways && definition.fields.map(field => <DetailInput key={field.key} field={field} id={`${definition.id}-${field.key}`} value={draft.details[definition.id]?.[0]?.[field.key] ?? ''} onChange={text => onDetail(definition.id, 0, field.key, text)} />)}
        {value > 0 && !definition.inline && definition.fields.length > 0 && <button type="button" className="background-details-button" aria-haspopup="dialog" onClick={event => onOpen(definition.id, event.currentTarget)}>Détails{definition.optionalDetails ? ' (facultatifs)' : ''}<span className="sr-only"> — {layered ? definition.garouTitle : definition.title}</span></button>}
        {definition.id === 'totemContribution' && <TotemPanel draft={draft} repository={totemRepository} />}
    </fieldset>
}

function BackgroundDetailsDialog({ definition, draft, onDetail, onClose }: { definition: BackgroundDefinition; draft: BackgroundDraft; onDetail: CardProps['onDetail']; onClose: () => void }) {
    const dialog = useRef<HTMLDialogElement>(null)
    useEffect(() => { if (!dialog.current?.open) dialog.current?.showModal() }, [])
    const count = definition.repeated ? draft.values[definition.id] : 1
    return <dialog ref={dialog} className="background-dialog" aria-labelledby="background-dialog-title" onClose={onClose}>
        <div className="background-dialog-header"><h2 id="background-dialog-title">{draft.revealed.includes(definition.id) ? definition.garouTitle : definition.title} — Détails</h2><button type="button" aria-label="Fermer les détails" onClick={() => dialog.current?.close()}>×</button></div>
        <p className="background-field-hint">Quelques phrases suffisent. Vos réponses sont conservées lorsque vous fermez cette fenêtre.</p>
        {Array.from({ length: count }, (_, index) => <fieldset className="background-detail-sheet" key={index}>
            {definition.repeated && <legend>{definition.repeated} {index + 1}</legend>}
            {definition.fields.map(field => <DetailInput key={field.key} field={field} id={`details-${definition.id}-${index}-${field.key}`} value={draft.details[definition.id]?.[index]?.[field.key] ?? ''} onChange={value => onDetail(definition.id, index, field.key, value)} />)}
        </fieldset>)}
        <button type="button" onClick={() => dialog.current?.close()}>Terminer</button>
    </dialog>
}

type Props = { draft: BackgroundDraft; setDraft: Dispatch<SetStateAction<BackgroundDraft>>; onBack: () => void; onContinue: () => void; totemRepository?: TotemRepository }
export default function BackgroundAssessment({ draft, setDraft, onBack, onContinue, totemRepository }: Props) {
    const [active, setActive] = useState<BackgroundId | null>(null)
    const [storageError, setStorageError] = useState(false)
    const opener = useRef<HTMLButtonElement | null>(null)
    const remaining = BACKGROUND_POINTS - allocatedBackgroundPoints(draft.values)
    const complete = canCompleteBackgrounds(draft)
    const activeDefinition = BACKGROUNDS.find(definition => definition.id === active)
    const reveal = useCallback((id: BackgroundId) => setDraft(current => revealBackground(current, id)), [setDraft])
    const detail = (id: BackgroundId, index: number, key: string, value: string) => setDraft(current => setBackgroundDetail(current, id, index, key, value))
    useEffect(() => {
        const failed = () => setStorageError(true)
        window.addEventListener('questionnaire-storage-error', failed)
        return () => window.removeEventListener('questionnaire-storage-error', failed)
    }, [])
    return <section className="assessment background-assessment" aria-labelledby="background-title">
        <p className="eyebrow">Votre parcours — Environnement et appuis</p>
        <h2 id="background-title" tabIndex={-1}>Environnement, ressources et appuis</h2>
        <p className="assessment-intro">Les éléments suivants décrivent les ressources, relations, circonstances et héritages susceptibles d’avoir une influence durable sur votre parcours. Vous disposez de 5 points à répartir.</p>
        <p className="ability-instructions">Choisissez de 0 à 5 pour chaque appui. Le bouton 0 permet de rendre les points.</p>
        <div className="budget-summary" role="status"><span>Points disponibles : <strong>5</strong></span><span>Restants : <strong>{remaining}</strong></span></div>
        <form onSubmit={event => { event.preventDefault(); if (complete) { setDraft(current => ({ ...current, confirmed: true })); onContinue() } }}>
            <div className="assessment-criteria">{BACKGROUNDS.map(definition => <BackgroundCard key={definition.id} definition={definition} draft={draft} remaining={remaining} onChoose={(id, level) => setDraft(current => selectBackgroundLevel(current, id, level))} onDetail={detail} onReveal={reveal} onOpen={(id, button) => { opener.current = button; setActive(id) }} totemRepository={totemRepository} />)}</div>
            <p className="assessment-help">{remaining > 0 ? `Répartissez encore ${remaining} ${remaining === 1 ? 'point' : 'points'} pour continuer.` : complete ? 'Tous les points ont été répartis.' : 'Précisez le type d’esprits auquel vous êtes lié pour continuer.'}</p>
            {storageError && <p role="alert">La sauvegarde sur cet appareil est indisponible. Gardez cet onglet ouvert pour conserver vos réponses.</p>}
            {draft.confirmed && <p className="assessment-confirmation" role="status">Vos réponses pour ce volet sont validées.</p>}
            <div className="assessment-actions"><button type="button" className="secondary-button" onClick={onBack}>Retour aux compétences</button><button type="submit" disabled={!complete}>Continuer</button></div>
        </form>
        {activeDefinition && <BackgroundDetailsDialog definition={activeDefinition} draft={draft} onDetail={detail} onClose={() => { setActive(null); requestAnimationFrame(() => opener.current?.focus()) }} />}
    </section>
}
