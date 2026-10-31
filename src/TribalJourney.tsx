import { useEffect, useMemo, useRef, useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import TribalReveal, { Seal } from './TribalReveal'
import { getUmbraAssessmentResult } from './umbraQuestionnaire'
import type { UmbraDraft } from './umbraQuestionnaire'
import { UMBRA_TRIBES } from './umbraTribes'
import type { TribeId } from './umbraTribes'
import type { BackgroundValues } from './backgrounds'
import { getTribeProfile, tribeCreationReview, TRIBAL_GIFTS } from './tribeProfiles'
import { confirmTribeChoice, exploreTribes, revealTribes } from './tribeSelection'
import { enterAuspices } from './auspices'
import './TribalJourney.css'

const nameOf = (id: TribeId) => UMBRA_TRIBES.find(tribe => tribe.id === id)!.name
const sealIndex = (id: TribeId) => UMBRA_TRIBES.findIndex(tribe => tribe.id === id)
const RANK_LABEL = { major: 'Résonance majeure', near: 'Résonance proche', open: 'Voix ouverte' }

function TribeDialog({ id, backgroundValues, onClose, onConfirm }: { id: TribeId; backgroundValues: BackgroundValues; onClose: () => void; onConfirm: () => void }) {
    const dialog = useRef<HTMLDialogElement>(null)
    const title = useRef<HTMLHeadingElement>(null)
    const opener = useRef<HTMLElement | null>(null)
    const [confirming, setConfirming] = useState(false)
    const profile = getTribeProfile(id)
    const issues = tribeCreationReview(id, backgroundValues)
    const backgroundIssues = issues.filter(issue => issue !== profile.originReview)
    useEffect(() => {
        const modal = dialog.current!
        if (!opener.current && document.activeElement instanceof HTMLElement) opener.current = document.activeElement
        modal.showModal()
        title.current?.focus({ preventScroll: true })
        return () => {
            if (modal.open) modal.close()
            if (opener.current?.isConnected) opener.current.focus({ preventScroll: true })
        }
    }, [])
    useEffect(() => {
        const frame = requestAnimationFrame(() => {
            if (dialog.current) dialog.current.scrollTop = 0
            title.current?.focus({ preventScroll: true })
        })
        return () => cancelAnimationFrame(frame)
    }, [confirming])

    return <dialog ref={dialog} className="tribe-dialog" aria-labelledby="tribe-dialog-title" aria-describedby="tribe-dialog-context" onClose={() => { if (!dialog.current?.open) onClose() }} onCancel={event => { event.preventDefault(); onClose() }} onClick={event => { if (event.target === event.currentTarget) onClose() }} onKeyDown={event => {
        if (event.key !== 'Tab') return
        const buttons = event.currentTarget.querySelectorAll<HTMLButtonElement>('button:not([disabled])')
        const first = buttons[0]
        const last = buttons[buttons.length - 1]
        if (event.shiftKey && (document.activeElement === first || document.activeElement === title.current)) {
            event.preventDefault()
            last?.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault()
            first?.focus()
        }
    }}>
        <div className="tribe-dialog-content">
            <button type="button" className="tribe-dialog-close" aria-label="Fermer la fiche" onClick={onClose}>×</button>
            <p className="tribe-hrp" id="tribe-dialog-context">Informations hors-jeu · W20</p>
            <div className="tribe-detail-seal" aria-hidden="true"><Seal index={sealIndex(id)} /></div>
            <h2 ref={title} tabIndex={-1} id="tribe-dialog-title">{confirming ? `Rejoindre la voie des ${nameOf(id)} ?` : nameOf(id)}</h2>
            <p className="tribe-manifesto">{profile.manifesto}</p>
            {confirming ? <>
                <p className="tribe-confirm-copy">Vous confirmez votre préférence pour cette Tribu. Les résonances du questionnaire vous laissent entièrement libre de ce choix.</p>
                {issues.length > 0 && <div className="tribe-review-note"><h3>À examiner avec le MJ</h3><ul>{issues.map(issue => <li key={issue}>{issue}</li>)}</ul></div>}
                <p className="tribe-confirm-copy">Cette préférence ne vaut pas validation des conditions de création par le MJ. Vos réponses et vos points d’Historiques restent conservés.</p>
                <div className="tribe-dialog-actions"><button type="button" className="umbra-descend" onClick={onConfirm}>Confirmer ma préférence <span aria-hidden="true">☾</span></button><button type="button" className="umbra-text-button" onClick={() => setConfirming(false)}>Relire la fiche</button><button type="button" className="umbra-text-button" onClick={onClose}>Continuer à explorer</button></div>
            </> : <>
                <div className="tribe-detail-section"><h3>Une manière de voir le monde</h3><p>{profile.philosophy}</p><p>{profile.identity}</p></div>
                <div className="tribe-detail-section"><h3>Ce que cette Tribu défend</h3><ul>{profile.values.map(value => <li key={value}>{value}</li>)}</ul></div>
                <div className="tribe-detail-section"><h3>Ses contradictions</h3>{profile.tensions.map(tension => <p key={tension}>{tension}</p>)}</div>
                <div className="tribe-detail-section"><h3>Totem tribal · {profile.totem.name}</h3><p>{profile.totem.meaning}</p><p className="tribe-note">Le Totem tribal est distinct du Totem de votre meute, qui se choisit ensemble.</p></div>
                <div className="tribe-detail-section"><h3>Particularités de création</h3><p>Volonté initiale W20 : <strong>{profile.willpower}</strong>.</p>{profile.originReview && <p>{profile.originReview}</p>}{profile.creation.map(note => <p key={note}>{note}</p>)}{backgroundIssues.length > 0 && <div className="tribe-review-note"><h4>Avec votre dossier actuel</h4><ul>{backgroundIssues.map(issue => <li key={issue}>{issue}</li>)}</ul></div>}</div>
                <div className="tribe-detail-section"><h3>Dons tribaux de départ</h3><p className="tribe-note">Des possibilités de rang 1 pour préparer votre personnage. Le choix des Dons et la finition de la fiche se font avec le MJ, en séance 0.</p><dl className="tribe-gifts">{profile.gifts.map(name => <div key={name}><dt>{name}</dt><dd>{TRIBAL_GIFTS[name].summary} <small>W20, p. {TRIBAL_GIFTS[name].page}</small></dd></div>)}</dl></div>
                <div className="tribe-detail-section"><h3>Pour en faire un personnage</h3><p>{profile.advice}</p></div>
                <p className="tribe-source">Synthèse française du livre de base W20 (VO), p. {profile.pages[0]}–{profile.pages[1]}. Noms des Dons conservés en VO.</p>
                <div className="tribe-dialog-actions"><button type="button" className="umbra-descend" onClick={() => setConfirming(true)}>Choisir cette Tribu <span aria-hidden="true">→</span></button><button type="button" className="umbra-text-button" onClick={onClose}>Revenir aux treize voix</button></div>
            </>}
        </div>
    </dialog>
}

type Props = { draft: UmbraDraft; setDraft: Dispatch<SetStateAction<UmbraDraft>>; backgroundValues: BackgroundValues; onReview: () => void; onBack: () => void; onRestart?: () => void }

export default function TribalJourney({ draft, setDraft, backgroundValues, onReview, onBack, onRestart }: Props) {
    const [opened, setOpened] = useState<TribeId | null>(null)
    const heading = useRef<HTMLHeadingElement>(null)
    const stage = draft.tribalStage ?? (draft.tribeChoice ? 'chosen' : 'reveal')
    const result = useMemo(() => getUmbraAssessmentResult(draft), [draft])
    const rank = (id: TribeId) => result.majorResonances.includes(id) ? 'major' : result.nearResonances.includes(id) ? 'near' : 'open'
    const tribes = [...UMBRA_TRIBES].sort((a, b) => ['major', 'near', 'open'].indexOf(rank(a.id)) - ['major', 'near', 'open'].indexOf(rank(b.id)))
    useEffect(() => {
        const frame = requestAnimationFrame(() => {
            heading.current?.focus({ preventScroll: true })
            heading.current?.scrollIntoView({ block: 'start', behavior: 'instant' })
        })
        return () => cancelAnimationFrame(frame)
    }, [stage])

    if (stage === 'reveal') return <TribalReveal draft={draft} onExplore={() => setDraft(exploreTribes)} onReview={onReview} onBack={onBack} onRestart={onRestart} />

    if (stage === 'chosen' && draft.tribeChoice) {
        const { tribeId } = draft.tribeChoice
        const profile = getTribeProfile(tribeId)
        const issues = tribeCreationReview(tribeId, backgroundValues)
        return <section className="tribal-chosen" aria-labelledby="tribal-chosen-title">
            <p className="tribe-hrp">Votre préférence</p>
            <h1 ref={heading} tabIndex={-1} id="tribal-chosen-title">Votre choix<br /><em>a été entendu.</em></h1>
            <div className="tribe-chosen-seal" aria-hidden="true"><Seal index={sealIndex(tribeId)} /></div>
            <h2>{nameOf(tribeId)}</h2><p className="tribe-manifesto">{profile.manifesto}</p>
            <p className="tribe-chosen-totem">Sous le regard de {profile.totem.name}.</p>
            {issues.length > 0 ? <div className="tribe-review-note"><h3>Votre préférence est conservée</h3><p>Ces points restent à examiner avec le MJ :</p><ul>{issues.map(issue => <li key={issue}>{issue}</li>)}</ul></div> : <p className="tribe-confirm-copy">Votre préférence est enregistrée. La validation des conditions de création par le MJ reste distincte.</p>}
            <div className="tribe-chosen-actions"><button className="umbra-descend" type="button" onClick={() => setDraft(enterAuspices)}>{draft.auspiceChoice ? 'Retrouver mon Auspice' : 'Choisir mon Auspice'} <span aria-hidden="true">☾</span></button><button className="umbra-text-button" type="button" onClick={() => setDraft(exploreTribes)}>Modifier mon choix de Tribu</button><button className="umbra-text-button" type="button" onClick={() => setDraft(revealTribes)}>Revoir les résonances</button><button className="umbra-text-button" type="button" onClick={onReview}>Revoir mes réponses</button><button className="umbra-text-button" type="button" onClick={onBack}>Retour au dossier</button></div>
        </section>
    }

    return <section className="tribal-exploration" aria-labelledby="tribal-exploration-title">
        <p className="tribe-hrp">Informations hors-jeu · Découvrir et choisir</p>
        <h1 ref={heading} tabIndex={-1} id="tribal-exploration-title">Treize voix.<br /><em>Votre voie.</em></h1>
        <p className="tribe-gallery-intro">Explorez leurs philosophies, leurs contradictions et leurs possibilités de jeu. Les résonances vous accompagnent ; toutes les Tribus restent ouvertes à votre choix.</p>
        {draft.tribeChoice && <p className="tribe-current-choice">Votre préférence actuelle : <strong>{nameOf(draft.tribeChoice.tribeId)}</strong>. Elle reste conservée pendant votre exploration.</p>}
        <ul className="tribe-card-grid" aria-label="Les treize cartes de Tribus">{tribes.map(tribe => {
            const profile = getTribeProfile(tribe.id)
            return <li key={tribe.id} className="tribe-card" data-resonance={rank(tribe.id)}>
                <div className="tribe-card-top"><span className="tribe-card-seal" aria-hidden="true"><Seal index={sealIndex(tribe.id)} /></span><span className="tribe-card-rank">{RANK_LABEL[rank(tribe.id)]}</span></div>
                <h2>{tribe.name}</h2><p className="tribe-card-totem">Totem tribal · {profile.totem.name}</p><p className="tribe-card-manifesto">{profile.manifesto}</p><p className="tribe-card-philosophy">{profile.philosophy}</p>
                {draft.tribeChoice?.tribeId === tribe.id && <p className="tribe-preference-mark">Votre préférence actuelle</p>}
                <button type="button" className="tribe-discover" aria-label={`Découvrir ${tribe.name}`} onClick={() => setOpened(tribe.id)}>Découvrir la Tribu <span aria-hidden="true">↗</span></button>
            </li>
        })}</ul>
        <div className="tribe-explore-actions">{draft.tribeChoice && <button className="umbra-descend" type="button" onClick={() => setDraft(current => ({ ...current, tribalStage: 'chosen' }))}>Retrouver ma préférence <span aria-hidden="true">→</span></button>}<button className="umbra-text-button" type="button" onClick={() => setDraft(revealTribes)}>Revenir au Cercle des Treize</button><button className="umbra-text-button" type="button" onClick={onReview}>Revoir mes réponses</button><button className="umbra-text-button" type="button" onClick={onBack}>Retour au dossier</button></div>
        {opened && <TribeDialog key={opened} id={opened} backgroundValues={backgroundValues} onClose={() => setOpened(null)} onConfirm={() => { const id = opened; setOpened(null); setDraft(current => confirmTribeChoice(current, id)) }} />}
    </section>
}
