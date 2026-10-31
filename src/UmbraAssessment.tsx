import { useCallback, useEffect, useRef, useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import UmbraScene from './UmbraScene'
import TribalJourney from './TribalJourney'
import AuspiceScene from './AuspiceScene'
import type { BackgroundValues } from './backgrounds'
import { UMBRA_QUESTIONS, canContinueUmbra, chooseUmbraAnswer, completeUmbra, visitUmbraQuestion } from './umbraQuestionnaire'
import type { UmbraQuestion } from './umbraQuestions'
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

type Props = { draft: UmbraDraft; setDraft: Dispatch<SetStateAction<UmbraDraft>>; backgroundValues: BackgroundValues; onBack: () => void; onRestart?: () => void }
type PanelProps = Props & { travelling: boolean; navigate: (to: number) => void }

function QuestionPanel({ draft, setDraft, backgroundValues, travelling, navigate, onBack, onRestart }: PanelProps) {
    const heading = useRef<HTMLHeadingElement>(null)
    const question: UmbraQuestion = UMBRA_QUESTIONS[draft.questionIndex]
    const selected = draft.answers[UMBRA_QUESTIONS[draft.questionIndex].id]
    useEffect(() => {
        if (travelling) return
        const frame = requestAnimationFrame(() => {
            heading.current?.focus({ preventScroll: true })
            heading.current?.scrollIntoView({ block: 'nearest', behavior: 'instant' })
        })
        return () => cancelAnimationFrame(frame)
    }, [travelling, draft.questionIndex, draft.completed])

    if (draft.completed) return <TribalJourney draft={draft} setDraft={setDraft} backgroundValues={backgroundValues} onReview={() => setDraft(current => ({ ...current, completed: false, tribalStage: 'reveal', ...(current.auspiceStage ? { auspiceStage: undefined } : {}) }))} onBack={onBack} onRestart={onRestart} />

    return <form className="umbra-question-panel" onSubmit={event => {
        event.preventDefault()
        if (travelling || !canContinueUmbra(draft)) return
        if (draft.questionIndex === UMBRA_QUESTIONS.length - 1) setDraft(completeUmbra)
        else navigate(draft.questionIndex + 1)
    }}>
        <p className="umbra-situation-label">Situation · {String(draft.questionIndex + 1).padStart(2, '0')} / {UMBRA_QUESTIONS.length}</p>
        <h1 ref={heading} tabIndex={-1}>{question.quote}</h1>
        <p className="umbra-attribution">— {question.attribution}</p>
        {question.note && <p className="umbra-quote-note">{question.note}</p>}
        {question.title && <h2 className="umbra-situation-title">{question.title}</h2>}
        <div className="umbra-question-description">{question.situation.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
        <fieldset className="umbra-choices" disabled={travelling}>
            <legend className="sr-only">Votre réaction</legend>
            {question.answers.map(option => <label className="umbra-choice" key={option.id}>
                <input className="sr-only" type="radio" name={question.id} value={option.id} checked={selected === option.id} onChange={() => setDraft(current => chooseUmbraAnswer(current, option.id))} required />
                <span className="umbra-choice-letter" aria-hidden="true">{option.id}</span><span>{option.text}</span><span className="umbra-choice-mark" aria-hidden="true">◇</span>
            </label>)}
        </fieldset>
        <div className="umbra-question-actions"><button type="submit" className="umbra-descend" disabled={!canContinueUmbra(draft)} aria-disabled={travelling}>{draft.questionIndex === UMBRA_QUESTIONS.length - 1 ? 'Achever la traversée' : 'Valider et descendre'} <span aria-hidden="true">↓</span></button><button type="button" className="umbra-text-button" aria-disabled={travelling} onClick={() => {
            if (travelling) return
            if (draft.questionIndex > 0) navigate(draft.questionIndex - 1)
            else onBack()
        }}>{draft.questionIndex > 0 ? 'Situation précédente' : 'Retour au dossier'}</button>{onRestart && <button type="button" className="umbra-text-button umbra-replay" onClick={onRestart}>Rejouer la traversée</button>}</div>
    </form>
}

export default function UmbraAssessment({ draft, setDraft, backgroundValues, onBack, onRestart }: Props) {
    const [storageError, setStorageError] = useState(false)
    useEffect(() => {
        const failed = () => setStorageError(true)
        window.addEventListener('questionnaire-storage-error', failed)
        return () => window.removeEventListener('questionnaire-storage-error', failed)
    }, [])
    const visit = useCallback((index: number) => setDraft(current => visitUmbraQuestion(current, index)), [setDraft])
    const finishIntro = useCallback(() => setDraft(current => ({ ...current, introSeen: true })), [setDraft])
    const mode = !draft.introSeen ? 'intro' : draft.completed ? 'complete' : 'questions'
    if (draft.completed && draft.tribalStage === 'chosen' && draft.tribeChoice && draft.auspiceStage) return <AuspiceScene draft={draft} setDraft={setDraft} storageError={storageError} />
    return <UmbraScene initialDepth={draft.questionIndex} stepCount={UMBRA_QUESTIONS.length} mode={mode} onDepthChange={visit}>
        {controls => <>{!draft.introSeen ? <Appeal still={controls.still} hidden={controls.hidden} onComplete={finishIntro} /> : <QuestionPanel draft={draft} setDraft={setDraft} backgroundValues={backgroundValues} onBack={onBack} onRestart={onRestart} travelling={controls.travelling} navigate={controls.navigate} />}{storageError && <p className="umbra-save-error" role="alert">La sauvegarde sur cet appareil est indisponible. Gardez cet onglet ouvert pour conserver vos réponses.</p>}</>}
    </UmbraScene>
}
