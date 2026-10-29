import { useCallback, useEffect, useRef, useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import UmbraScene from './UmbraScene'
import { UMBRA_OPTIONS, UMBRA_QUESTIONS, canContinueUmbra, chooseUmbraAnswer, completeUmbra, visitUmbraQuestion } from './umbraQuestionnaire'
import type { UmbraDraft } from './umbraQuestionnaire'
import './UmbraAssessment.css'

function Appeal({ still, hidden, onComplete }: { still: boolean; hidden: boolean; onComplete: () => void }) {
    const [phase, setPhase] = useState<'read' | 'fade'>('read')
    const [hold, setHold] = useState(false)
    const heading = useRef<HTMLHeadingElement>(null)
    useEffect(() => {
        const frame = requestAnimationFrame(() => heading.current?.focus({ preventScroll: true }))
        return () => cancelAnimationFrame(frame)
    }, [])
    useEffect(() => {
        if (still || hidden || hold) return
        const timer = window.setTimeout(phase === 'read' ? () => setPhase('fade') : onComplete, phase === 'read' ? 6500 : 2700)
        return () => window.clearTimeout(timer)
    }, [phase, still, hidden, hold, onComplete])
    return <div className="umbra-appeal" data-phase={phase} data-hold={hold || still} onAnimationEnd={event => {
        if (event.target === event.currentTarget && event.animationName === 'umbra-appeal-fade') onComplete()
    }}>
        <h1 ref={heading} tabIndex={-1}>Oubliez l’humain <em>en vous…</em></h1>
        <p className="umbra-invitation">Laissez parler le Loup…</p>
        <div className="umbra-divider" aria-hidden="true"><span />◇<span /></div>
        <p className="umbra-question">Que feriez-vous,<br />débarrassé de la peau d’homme&nbsp;?</p>
        <button type="button" className="umbra-descend" onClick={onComplete}>Entrer dans le voile <span aria-hidden="true">↓</span></button>
        <button type="button" className="umbra-text-button umbra-reading" aria-pressed={hold} onClick={() => setHold(value => !value)}>{hold ? 'Reprendre le passage' : 'Lire à mon rythme'}</button>
    </div>
}

type Props = { draft: UmbraDraft; setDraft: Dispatch<SetStateAction<UmbraDraft>>; onBack: () => void; onRestart?: () => void }
type PanelProps = Props & { travelling: boolean; navigate: (to: number) => void }

function QuestionPanel({ draft, setDraft, travelling, navigate, onBack, onRestart }: PanelProps) {
    const heading = useRef<HTMLHeadingElement>(null)
    const question = UMBRA_QUESTIONS[draft.questionIndex]
    const selected = draft.answers[question.id]
    useEffect(() => {
        if (travelling) return
        const frame = requestAnimationFrame(() => {
            heading.current?.focus({ preventScroll: true })
            heading.current?.scrollIntoView({ block: 'nearest', behavior: 'instant' })
        })
        return () => cancelAnimationFrame(frame)
    }, [travelling, draft.questionIndex, draft.completed])

    if (draft.completed) return <div className="umbra-question-panel umbra-completion">
        <p className="umbra-situation-label">Parcours d’essai terminé</p>
        <h1 ref={heading} tabIndex={-1}>Vous êtes <em>de l’autre côté.</em></h1>
        <p className="umbra-question-description">Les quatre situations de démonstration sont parcourues. L’exploration des Tribus viendra ensuite.</p>
        <div className="umbra-question-actions"><button className="umbra-descend" type="button" onClick={() => setDraft(current => ({ ...current, completed: false }))}>Revoir mes réponses <span aria-hidden="true">↺</span></button><button className="umbra-text-button" type="button" onClick={onBack}>Retour au dossier</button>{onRestart && <button className="umbra-text-button" type="button" onClick={onRestart}>Rejouer la traversée</button>}</div>
    </div>

    return <form className="umbra-question-panel" onSubmit={event => {
        event.preventDefault()
        if (travelling || !canContinueUmbra(draft)) return
        if (draft.questionIndex === UMBRA_QUESTIONS.length - 1) setDraft(completeUmbra)
        else navigate(draft.questionIndex + 1)
    }}>
        <p className="umbra-situation-label">Situation provisoire · {String(draft.questionIndex + 1).padStart(2, '0')}</p>
        <h1 ref={heading} tabIndex={-1}>{question.title}</h1>
        <p className="umbra-question-description">{question.text}</p>
        <fieldset className="umbra-choices" disabled={travelling}>
            <legend className="sr-only">Votre réaction</legend>
            {UMBRA_OPTIONS.map(option => <label className="umbra-choice" key={option}>
                <input className="sr-only" type="radio" name={question.id} value={option} checked={selected === option} onChange={() => setDraft(current => chooseUmbraAnswer(current, option))} required />
                <span className="umbra-choice-letter" aria-hidden="true">{option}</span><span>Réponse {option} — texte à définir.</span><span className="umbra-choice-mark" aria-hidden="true">◇</span>
            </label>)}
        </fieldset>
        <div className="umbra-question-actions"><button type="submit" className="umbra-descend" disabled={!canContinueUmbra(draft)} aria-disabled={travelling}>{draft.questionIndex === 3 ? 'Terminer l’essai' : 'Valider et descendre'} <span aria-hidden="true">↓</span></button><button type="button" className="umbra-text-button" aria-disabled={travelling} onClick={() => {
            if (travelling) return
            if (draft.questionIndex > 0) navigate(draft.questionIndex - 1)
            else onBack()
        }}>{draft.questionIndex > 0 ? 'Situation précédente' : 'Retour au dossier'}</button>{onRestart && <button type="button" className="umbra-text-button umbra-replay" onClick={onRestart}>Rejouer la traversée</button>}</div>
        <p className="umbra-demo-note">Questions et réponses provisoires · aucune affinité calculée</p>
    </form>
}

export default function UmbraAssessment({ draft, setDraft, onBack, onRestart }: Props) {
    const [storageError, setStorageError] = useState(false)
    useEffect(() => {
        const failed = () => setStorageError(true)
        window.addEventListener('questionnaire-storage-error', failed)
        return () => window.removeEventListener('questionnaire-storage-error', failed)
    }, [])
    const visit = useCallback((index: number) => setDraft(current => visitUmbraQuestion(current, index)), [setDraft])
    const finishIntro = useCallback(() => setDraft(current => ({ ...current, introSeen: true })), [setDraft])
    const mode = !draft.introSeen ? 'intro' : draft.completed ? 'complete' : 'questions'
    return <UmbraScene initialDepth={draft.questionIndex} mode={mode} onDepthChange={visit}>
        {controls => <>{!draft.introSeen ? <Appeal still={controls.still} hidden={controls.hidden} onComplete={finishIntro} /> : <QuestionPanel draft={draft} setDraft={setDraft} onBack={onBack} onRestart={onRestart} travelling={controls.travelling} navigate={controls.navigate} />}{storageError && <p className="umbra-save-error" role="alert">La sauvegarde sur cet appareil est indisponible. Gardez cet onglet ouvert pour conserver vos réponses.</p>}</>}
    </UmbraScene>
}
