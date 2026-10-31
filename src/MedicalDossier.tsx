import { useEffect, useRef, useState } from 'react'
import { PHYSICAL_CRITERIA, SOCIAL_CRITERIA, MENTAL_CRITERIA, SECTION_LABELS } from './attributes'
import { ABILITY_BLOCKS } from './abilities'
import { TALENTS } from './talents'
import { SKILLS } from './skills'
import { KNOWLEDGES } from './knowledges'
import { BACKGROUNDS } from './backgrounds'
import { UMBRA_TRIBES } from './umbraTribes'
import { UMBRA_QUESTIONS } from './umbraQuestionnaire'
import { getAuspice } from './auspices'
import { tribeCreationReview } from './tribeProfiles'
import type { FinaleDraft } from './finaleModel'
import { INTERVIEW_NOTICE, PRINT_NOTICE } from './finaleModel'
import type { DossierData, DossierSection } from './dossierModel'
import { dossierIssues, dossierFingerprint } from './dossierModel'
import DossierClosing from './DossierClosing'
import useStorageProblem from './useStorageProblem'
import { fadeScene } from './sceneTransition'
import { canReplayExperience } from './experienceReplay'
import type { ReplayPoint } from './experienceReplay'
import './MedicalDossier.css'
import PrivacyLink from './PrivacyLink'

type Props = { data: DossierData; finale: FinaleDraft; onEdit: (section: DossierSection) => void; onIdentity: (patch: Partial<Pick<DossierData, 'playerName' | 'profession' | 'concept'>>) => void; onConfirm: (fingerprint: string) => void; onClosingSeen: () => void; onReplay: (point: ReplayPoint) => void }

export default function MedicalDossier({ data, finale, onEdit, onIdentity, onConfirm, onClosingSeen, onReplay }: Props) {
    const issues = dossierIssues(data)
    const storageProblem = useStorageProblem()
    const fingerprint = dossierFingerprint(data)
    const confirmed = issues.length === 0 && finale.confirmedFingerprint === fingerprint
    const [closingOpen, setClosingOpen] = useState(confirmed && !finale.closingSeen)
    const [identityOpen, setIdentityOpen] = useState(false)
    const [answersOpen, setAnswersOpen] = useState(false)
    const heading = useRef<HTMLHeadingElement>(null)
    const confirmButton = useRef<HTMLButtonElement>(null)
    const printButton = useRef<HTMLButtonElement>(null)
    const sheet = useRef<HTMLElement>(null)
    const tribe = data.umbraDraft.tribeChoice?.tribeId
    const auspice = data.umbraDraft.auspiceChoice?.auspiceId
    const reviews = tribe ? tribeCreationReview(tribe, data.backgroundDraft.values) : []
    useEffect(() => { document.title = 'Dossier individuel — It\'s a kind of magic'; const raf = requestAnimationFrame(() => { window.scrollTo(0, 0); heading.current?.focus({ preventScroll: true }) }); return () => cancelAnimationFrame(raf) }, [])
    function closeClosing() { fadeScene(() => { setClosingOpen(false); requestAnimationFrame(() => printButton.current?.focus({ preventScroll: true })) }, { resetScroll: false }) }
    const edit = (section: DossierSection, title: string) => <div className="dossier-section-actions"><button className="dossier-edit-button" type="button" onClick={() => section === 'identity' ? setIdentityOpen(value => !value) : onEdit(section)} aria-label={`Modifier ${title}`}>Modifier <span aria-hidden="true">↗</span></button><button className="dossier-replay-button" type="button" onClick={() => onReplay(section)} disabled={!canReplayExperience(data, section)} aria-label={`Rejouer l’expérience : ${title}`}>Rejouer l’expérience à partir d’ici <span aria-hidden="true">↻</span></button></div>
    return <>
        <main ref={sheet} className="dossier-sheet" inert={closingOpen && confirmed}>
            <header><p className="eyebrow">Service de santé au travail</p><h1 ref={heading} tabIndex={-1}>Évaluation médico-professionnelle</h1><p className="subtitle">Dossier individuel — Confidentiel</p><div className="dossier-stamp">SYNTHÈSE D’ENTRETIEN<span>{confirmed ? 'Confirmée par le participant' : 'À relire et confirmer'}</span></div></header>
            <p className="dossier-lead">Votre parcours a été reconstitué. Retrouvez ci-dessous l’ensemble de vos choix et apportez les corrections nécessaires avant de confirmer votre dossier.</p><p className="dossier-note dossier-controls">« Modifier » corrige votre dossier. « Rejouer l’expérience à partir d’ici » relance le parcours avec vos choix, sans modifier le dossier enregistré.</p>
            <section className="dossier-section"><div className="dossier-section-heading"><h2>Identité et présentation</h2>{edit('identity', 'l’identité et la présentation')}</div>
                {identityOpen ? <form className="dossier-identity-form" onSubmit={event => { event.preventDefault(); setIdentityOpen(false) }}><label>Pseudo du joueur<input autoFocus value={data.playerName} onChange={event => onIdentity({ playerName: event.target.value })} required /></label><label>Emploi ou situation actuelle<input value={data.profession} onChange={event => onIdentity({ profession: event.target.value })} required /></label><label>Présentation du personnage<textarea value={data.concept} onChange={event => onIdentity({ concept: event.target.value })} rows={5} required /></label><button type="submit">Revenir à la synthèse</button></form> : <dl className="dossier-identity"><dt>Pseudo du joueur</dt><dd>{data.playerName || 'Non renseigné'}</dd><dt>Emploi ou situation actuelle</dt><dd>{data.profession || 'Non renseigné'}</dd><dt>Présentation du personnage</dt><dd className="dossier-prose">{data.concept || 'Non renseignée'}</dd></dl>}
            </section>
            <section className="dossier-section"><div className="dossier-section-heading"><h2>Capacités évaluées</h2>{edit('attributeOrder', 'le classement des capacités')}</div><p className="dossier-priorities">Ordre retenu : {data.attributeOrder.map(block => SECTION_LABELS[block]).join(' → ')}</p><div className="dossier-three-columns">{([
                ['physical', PHYSICAL_CRITERIA, data.physicalValues, 'Physique'], ['social', SOCIAL_CRITERIA, data.socialValues, 'Social'], ['mental', MENTAL_CRITERIA, data.mentalValues, 'Mental'],
            ] as const).map(([block, definitions, values, title]) => <div className="dossier-domain" key={block}><div className="dossier-section-heading"><h3>{SECTION_LABELS[block]} <small>{title}</small></h3>{edit(block, `les capacités ${block === 'physical' ? 'physiques' : block === 'social' ? 'sociales' : 'mentales'}`)}</div><dl className="dossier-ratings">{definitions.map(definition => <div key={definition.id}><dt>{definition.title}</dt><dd>{values[definition.id as keyof typeof values]} <span aria-hidden="true">/ 5</span></dd></div>)}</dl></div>)}</div></section>
            <section className="dossier-section"><div className="dossier-section-heading"><h2>Compétences acquises</h2>{edit('abilityOrder', 'le classement des compétences')}</div><p className="dossier-priorities">Ordre retenu : {data.abilityOrder.map(block => ABILITY_BLOCKS[block].title).join(' → ')}</p><div className="dossier-three-columns">{([
                ['talents', TALENTS, data.talentValues, data.talentDetails], ['skills', SKILLS, data.skillValues, data.skillDetails], ['knowledges', KNOWLEDGES, data.knowledgeValues, data.knowledgeDetails],
            ] as const).map(([block, definitions, values, details]) => <div className="dossier-domain" key={block}><div className="dossier-section-heading"><h3>{ABILITY_BLOCKS[block].title}</h3>{edit(block, `les ${ABILITY_BLOCKS[block].title.toLowerCase()}`)}</div><dl className="dossier-ratings">{definitions.map(definition => <div key={definition.id}><dt>{definition.label}{values[definition.id] > 0 && details[definition.id] && <small>{details[definition.id]}</small>}</dt><dd>{values[definition.id] ?? 0} <span aria-hidden="true">/ 3</span></dd></div>)}</dl></div>)}</div></section>
            <section className="dossier-section"><div className="dossier-section-heading"><h2>Environnement, ressources et appuis</h2>{edit('backgrounds', 'les Historiques')}</div><dl className="dossier-ratings dossier-backgrounds">{BACKGROUNDS.map(definition => <div key={definition.id}><dt>{definition.title}{definition.garouTitle && definition.garouTitle !== definition.title && <small>{definition.garouTitle}</small>}{(data.backgroundDraft.values[definition.id] > 0 || definition.inlineAlways) && data.backgroundDraft.details[definition.id]?.map((row, index) => <small key={index}>{definition.fields.filter(field => row?.[field.key]?.trim()).map(field => `${field.label} ${row[field.key]}`).join(' · ')}</small>)}</dt><dd>{data.backgroundDraft.values[definition.id]} <span aria-hidden="true">/ 5</span></dd></div>)}</dl><p className="dossier-note">Totem : contribution individuelle au lien de meute, distincte du Totem tribal.</p></section>
            <section className="dossier-section">
                <h2>Orientation du profil</h2>
                <div className="dossier-orientations">
                    <article className="dossier-orientation-block" aria-labelledby="dossier-tribe-title">
                        <h3 id="dossier-tribe-title">Tribu</h3>
                        <p className="dossier-choice">{UMBRA_TRIBES.find(item => item.id === tribe)?.name ?? 'À confirmer'}</p>
                        {edit('tribe', 'la Tribu')}
                    </article>
                    <article className="dossier-orientation-block" aria-labelledby="dossier-auspice-title">
                        <h3 id="dossier-auspice-title">Auspice</h3>
                        <p className="dossier-choice">{auspice ? getAuspice(auspice).name : 'À confirmer'}</p>
                        <p className="dossier-note">{auspice && `${getAuspice(auspice).phase} · ${getAuspice(auspice).role}`}</p>
                        {edit('auspice', 'l’Auspice')}
                    </article>
                </div>
                {reviews.length > 0 && <div className="dossier-review"><h3>À examiner lors de l’entretien</h3><ul>{reviews.map(review => <li key={review}>{review}</li>)}</ul></div>}
                <p className="dossier-note">Ces préférences sont les vôtres. L’origine du personnage, les Dons et la finalisation des règles seront préparés avec le responsable de la séance.</p>
            </section>
            <section className="dossier-section dossier-answers" data-expanded={answersOpen}><div className="dossier-section-heading"><h2>Réponses de la Traversée</h2>{edit('answers', 'les réponses de la Traversée')}</div><button type="button" className="dossier-disclosure dossier-controls" onClick={() => setAnswersOpen(value => !value)} aria-expanded={answersOpen}>{answersOpen ? 'Masquer' : 'Afficher'} les seize réponses</button><ol className="dossier-answer-list">{UMBRA_QUESTIONS.map((question, index) => { const answer = question.answers.find(item => item.id === data.umbraDraft.answers[question.id]); return <li key={question.id}><h3>Situation {String(index + 1).padStart(2, '0')}{'title' in question && ` · ${question.title}`}</h3><p>{question.situation.join(' ')}</p><p><strong>Réponse {answer?.id ?? 'non renseignée'}.</strong> {answer?.text}</p></li> })}</ol></section>
            <section className="dossier-section dossier-notice"><p>{INTERVIEW_NOTICE}</p><p>{PRINT_NOTICE}</p></section>
            <div className="dossier-controls">{issues.length > 0 && <div className="dossier-incomplete" role="status"><h2>Quelques rubriques restent à compléter</h2><ul>{issues.map(issue => <li key={issue.section}><button type="button" onClick={() => issue.section === 'identity' ? setIdentityOpen(true) : onEdit(issue.section)}>{issue.message}</button></li>)}</ul></div>}{finale.confirmedFingerprint && !confirmed && <p className="dossier-note">Votre dossier a été modifié depuis sa dernière confirmation. Relisez-le avant de le confirmer à nouveau.</p>}<div className="dossier-actions"><button ref={confirmButton} type="button" disabled={issues.length > 0 || confirmed} onClick={() => { onConfirm(fingerprint); fadeScene(() => setClosingOpen(true), { resetScroll: false }) }}>{confirmed ? 'Dossier confirmé' : 'Confirmer mon dossier'}</button><button ref={printButton} type="button" className="secondary-button" disabled={!confirmed} onClick={() => window.print()}>Imprimer mon dossier</button></div>{!confirmed && <p className="dossier-note">L’impression sera disponible après confirmation du dossier.</p>}</div>
            <footer>Création de personnage — Campagne « It's a kind of magic » · Préparation de la séance du 08 Novembre 2026 à 14h00.<br /><PrivacyLink /></footer>
            {storageProblem && <p className="dossier-controls" role="alert">La sauvegarde sur cet appareil est indisponible. Gardez cet onglet ouvert pour conserver vos réponses.</p>}
            <div className="dossier-controls dossier-replay"><button type="button" className="dossier-disclosure" onClick={() => onReplay('finale')} disabled={!canReplayExperience(data, 'finale')}>Rejouer le final</button><p className="dossier-note">Vous pouvez interrompre la relecture à tout moment pour retrouver ce dossier.</p></div>
        </main>
        {closingOpen && confirmed && <DossierClosing name={data.playerName} onSeen={onClosingSeen} onClose={closeClosing} />}
    </>
}
