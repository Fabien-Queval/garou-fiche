import { useCallback, useEffect, useState } from 'react'
import useFadingSetter from './useFadingSetter'
import { fadeScene } from './sceneTransition'
import './SceneTransition.css'
import AttributeRanking from './AttributeRanking'
import AbilityRanking from './AbilityRanking'
import AbilityAssessment from './AbilityAssessment'
import BackgroundAssessment from './BackgroundAssessment'
import { canCompleteBackgrounds, createBackgroundDraft } from './backgrounds'
import UmbraAssessment from './UmbraAssessment'
import UmbraTakeover from './UmbraTakeover'
import { createUmbraDraft, completeUmbra, visitUmbraQuestion } from './umbraQuestionnaire'
import type { UmbraDraft } from './umbraQuestionnaire'
import { browseAuspice } from './auspices'
import Apotheosis from './Apotheosis'
import MedicalDossier from './MedicalDossier'
import PrivacyLink from './PrivacyLink'
import { createFinaleDraft, canBeginFinale, beginFinale, nextFinaleStage } from './finaleModel'
import type { FinaleStage } from './finaleModel'
import type { DossierData, DossierSection } from './dossierModel'
import { useQuestionnaireState, QuestionnaireStorageContext, QuestionnaireStoragePortContext } from './questionnaireStorage'
import { canReplayExperience, createReplayStorage } from './experienceReplay'
import type { ReplayPoint } from './experienceReplay'
import './ExperienceReplay.css'
import type { TotemRepository } from './totemRepository'
import { abilityBudget } from './abilities'
import type { AbilityBlock } from './abilities'
import { TALENTS, allocatedAbilityPoints, createAbilityValues } from './talents'
import { SKILLS } from './skills'
import { KNOWLEDGES } from './knowledges'
import type { AbilityDetails } from './talents'
import FunctionalAssessment from './FunctionalAssessment'
import RelationalAssessment from './RelationalAssessment'
import CognitiveAssessment from './CognitiveAssessment'
import { allocatedPhysicalPoints, allocatedSocialPoints, allocatedMentalPoints, attributeBudget } from './attributes'
import type { AttributeBlock, PhysicalValues, SocialValues, MentalValues } from './attributes'
import {
    JOB_QUESTION,
    CONCEPT_QUESTION,
    SCRAMBLE_DURATION,
    scrambleFrame,
    corruptText,
    distortionAt,
} from './scramble'

type Phase = 'job' | 'scramble' | 'concept' | 'attributes' | 'evaluation' | 'abilities' | 'abilityEvaluation' | 'backgrounds' | 'umbra' | 'finale' | 'dossier'

const changed = <T,>(before: T, after: T) => before !== after
const neverFade = () => false
const takeoverEnded = (before: boolean, after: boolean) => before && !after
const nightPassage = (before: Phase, after: Phase) => [before, after].some(phase => phase === 'umbra' || phase === 'finale')
function umbraScene(draft: UmbraDraft) {
    if (!draft.introSeen) return 'intro'
    if (!draft.completed) return 'questions'
    if (draft.tribalStage === 'chosen' && draft.tribeChoice && draft.auspiceStage) return `lunar-${draft.auspiceStage}`
    return draft.tribalStage ?? (draft.tribeChoice ? 'chosen' : 'reveal')
}
const umbraSceneChanged = (before: UmbraDraft, after: UmbraDraft) => umbraScene(before) !== umbraScene(after)
const finaleNeedsFade = (before: { stage: FinaleStage }, after: { stage: FinaleStage }) => before.stage !== after.stage && ['diagnostic', 'dossier'].includes(after.stage)

const attributePreview = import.meta.env.DEV &&
    new URLSearchParams(window.location.search).get('screen') === 'attributes'
const functionalPreview = import.meta.env.DEV &&
    new URLSearchParams(window.location.search).get('screen') === 'functional'
const relationalPreview = import.meta.env.DEV &&
    new URLSearchParams(window.location.search).get('screen') === 'relational'
const cognitivePreview = import.meta.env.DEV &&
    new URLSearchParams(window.location.search).get('screen') === 'cognitive'
const abilityPreview = import.meta.env.DEV &&
    new URLSearchParams(window.location.search).get('screen') === 'abilities'
const talentsPreview = import.meta.env.DEV &&
    new URLSearchParams(window.location.search).get('screen') === 'talents'
const skillsPreview = import.meta.env.DEV &&
    new URLSearchParams(window.location.search).get('screen') === 'skills'
const knowledgesPreview = import.meta.env.DEV &&
    new URLSearchParams(window.location.search).get('screen') === 'knowledges'
const backgroundsPreview = import.meta.env.DEV &&
    ['backgrounds', 'passage'].includes(new URLSearchParams(window.location.search).get('screen') ?? '')

function App({ totemRepository, replay }: { totemRepository?: TotemRepository; replay?: { point: ReplayPoint; onExit: () => void } }) {
    const [playerName, setPlayerName] = useQuestionnaireState('playerName', '')
    const [started, saveStarted] = useQuestionnaireState('started', attributePreview || functionalPreview || relationalPreview || cognitivePreview || abilityPreview || talentsPreview || skillsPreview || knowledgesPreview || backgroundsPreview)
    const [profession, setProfession] = useQuestionnaireState('profession', '')
    const [concept, setConcept] = useQuestionnaireState('concept', '')

    const [phase, savePhase] = useQuestionnaireState<Phase>('phase', backgroundsPreview ? 'backgrounds' : talentsPreview || skillsPreview || knowledgesPreview ? 'abilityEvaluation' : abilityPreview ? 'abilities' : functionalPreview || relationalPreview || cognitivePreview ? 'evaluation' : attributePreview ? 'attributes' : 'job')
    const [elapsed, setElapsed] = useState(0)
    // L'ordre vit dans le parent pour rester disponible après le classement.
    const [attributeOrder, setAttributeOrder] = useQuestionnaireState<AttributeBlock[]>('attributeOrder', ['physical', 'social', 'mental'])
    const [abilityOrder, setAbilityOrder] = useQuestionnaireState<AbilityBlock[]>('abilityOrder', ['talents', 'skills', 'knowledges'])
    const [abilityIndex, saveAbilityIndex] = useQuestionnaireState('abilityIndex', knowledgesPreview ? 2 : skillsPreview ? 1 : 0)
    const [talentValues, setTalentValues] = useQuestionnaireState('talentValues', createAbilityValues(TALENTS))
    const [talentDetails, setTalentDetails] = useQuestionnaireState<AbilityDetails>('talentDetails', {})
    const [skillValues, setSkillValues] = useQuestionnaireState('skillValues', createAbilityValues(SKILLS))
    const [skillDetails, setSkillDetails] = useQuestionnaireState<AbilityDetails>('skillDetails', {})
    const [knowledgeValues, setKnowledgeValues] = useQuestionnaireState('knowledgeValues', createAbilityValues(KNOWLEDGES))
    const [knowledgeDetails, setKnowledgeDetails] = useQuestionnaireState<AbilityDetails>('knowledgeDetails', {})
    const [backgroundDraft, setBackgroundDraft] = useQuestionnaireState('backgroundDraft', createBackgroundDraft())
    const [umbraDraft, saveUmbraDraft] = useQuestionnaireState('umbraDraft', createUmbraDraft())
    const [takingOver, saveTakingOver] = useState(replay?.point === 'answers')
    const setTakingOver = useFadingSetter(takingOver, saveTakingOver, takeoverEnded, true)
    const finishTakingOver = useCallback(() => setTakingOver(false), [setTakingOver])
    const [evaluationIndex, saveEvaluationIndex] = useQuestionnaireState('evaluationIndex', cognitivePreview ? 2 : relationalPreview ? 1 : 0)
    const [physicalValues, setPhysicalValues] = useQuestionnaireState<PhysicalValues>('physicalValues', { strength: 1, dexterity: 1, stamina: 1 })
    const [socialValues, setSocialValues] = useQuestionnaireState<SocialValues>('socialValues', { charisma: 1, manipulation: 1, appearance: 1 })
    const [mentalValues, setMentalValues] = useQuestionnaireState<MentalValues>('mentalValues', { perception: 1, intelligence: 1, wits: 1 })
    const [finaleDraft, saveFinaleDraft] = useQuestionnaireState('finaleDraft', createFinaleDraft())
    const [replayPoint, saveReplayPoint] = useState<ReplayPoint | null>(null)
    const [replayIntro, setReplayIntro] = useState(Boolean(replay && !['tribe', 'auspice', 'finale'].includes(replay.point)))
    const finishReplayIntro = useCallback(() => { if (replayIntro) fadeScene(() => setReplayIntro(false), { night: true }) }, [replayIntro])
    const postFinale = finaleDraft.stage === 'dossier'
    const phaseNeedsFade = useCallback((before: Phase, after: Phase) => before !== after && after !== 'scramble' && !(before === 'scramble' && after === 'concept') && !(after === 'umbra' && (!umbraDraft.introSeen || replayIntro) && !postFinale), [umbraDraft.introSeen, postFinale, replayIntro])
    const setPhase = useFadingSetter(phase, savePhase, phaseNeedsFade, nightPassage)
    const setStarted = useFadingSetter(started, saveStarted, changed)
    const setEvaluationIndex = useFadingSetter(evaluationIndex, saveEvaluationIndex, phase === 'evaluation' ? changed : neverFade)
    const setAbilityIndex = useFadingSetter(abilityIndex, saveAbilityIndex, phase === 'abilityEvaluation' ? changed : neverFade)
    const setUmbraDraft = useFadingSetter(umbraDraft, saveUmbraDraft, phase === 'umbra' ? umbraSceneChanged : neverFade, true)
    const setFinaleDraft = useFadingSetter(finaleDraft, saveFinaleDraft, finaleNeedsFade, true)
    const setReplayPoint = useFadingSetter(replayPoint, saveReplayPoint, changed, true)
    const dossierData: DossierData = { playerName, profession, concept, attributeOrder, physicalValues, socialValues, mentalValues, abilityOrder, talentValues, talentDetails, skillValues, skillDetails, knowledgeValues, knowledgeDetails, backgroundDraft, umbraDraft }

    useEffect(() => {
        if (phase !== 'scramble') return

        const reducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)',
        ).matches

        const duration = reducedMotion ? 450 : SCRAMBLE_DURATION
        const start = performance.now()

        let animationId = 0
        let lastUpdate = -55

        function animate(now: number) {
            const elapsed = now - start

            if (elapsed >= duration) {
                setPhase('concept')
                return
            }

            // La page entière partage la même horloge, avec environ 18 images/s.
            if (!reducedMotion && elapsed - lastUpdate >= 55) {
                setElapsed(elapsed)
                lastUpdate = elapsed
            }

            animationId = requestAnimationFrame(animate)
        }

        animationId = requestAnimationFrame(animate)

        // Arrête la boucle quand React quitte cette phase.
        return () => cancelAnimationFrame(animationId)
    }, [phase, setPhase])

    const stage = phase === 'scramble' ? distortionAt(elapsed) : 'quiet'
    const headerTitle = phase === 'backgrounds' || phase === 'umbra' ? 'Environnement, ressources et appuis' : phase === 'abilityEvaluation'
        ? 'Évaluation des compétences acquises'
        : phase === 'abilities'
            ? 'Analyse du parcours et des compétences'
        : phase === 'evaluation'
            ? 'Évaluation multidimensionnelle du profil'
            : 'Évaluation médico-professionnelle'
    const evaluationBlock = attributeOrder[evaluationIndex]
    const physicalBudget = attributeBudget(attributeOrder, 'physical')
    const physicalNeedsReset = allocatedPhysicalPoints(physicalValues) > physicalBudget
    const socialBudget = attributeBudget(attributeOrder, 'social')
    const socialNeedsReset = allocatedSocialPoints(socialValues) > socialBudget
    const mentalBudget = attributeBudget(attributeOrder, 'mental')
    const mentalNeedsReset = allocatedMentalPoints(mentalValues) > mentalBudget
    const talentBudget = abilityBudget(abilityOrder, 'talents')
    const talentsNeedsReset = allocatedAbilityPoints(talentValues) > talentBudget
    const skillBudget = abilityBudget(abilityOrder, 'skills')
    const skillsNeedsReset = allocatedAbilityPoints(skillValues) > skillBudget
    const knowledgeBudget = abilityBudget(abilityOrder, 'knowledges')
    const knowledgesNeedsReset = allocatedAbilityPoints(knowledgeValues) > knowledgeBudget
    const abilityBlock = abilityOrder[abilityIndex]
    const question = phase === 'concept' ? CONCEPT_QUESTION
        : phase === 'scramble' ? scrambleFrame(elapsed) : JOB_QUESTION
    const distort = (text: string, strength?: number) =>
        phase === 'scramble' ? corruptText(text, elapsed, strength) : text

    // Les lecteurs d'écran conservent les textes stables pendant l'incident.
    const visualText = (text: string, strength?: number) => (
        <>
            <span className="sr-only">{text}</span>
            <span aria-hidden="true">{distort(text, strength)}</span>
        </>
    )
    const echoes = (text: string) => (
        <span className="text-echoes" aria-hidden="true">
            <span className="text-echo text-echo--first">{text}</span>
            <span className="text-echo text-echo--second">{text}</span>
        </span>
    )

    function startScramble() {
        setElapsed(0)
        setPhase('scramble')
    }

    function startAssessments() {
        if (postFinale) { returnToDossier(); return }
        if (physicalNeedsReset) setPhysicalValues({ strength: 1, dexterity: 1, stamina: 1 })
        if (socialNeedsReset) setSocialValues({ charisma: 1, manipulation: 1, appearance: 1 })
        if (mentalNeedsReset) setMentalValues({ perception: 1, intelligence: 1, wits: 1 })
        setEvaluationIndex(0)
        setPhase('evaluation')
    }

    function nextAssessment() {
        if (postFinale) { returnToDossier(); return }
        if (evaluationIndex < attributeOrder.length - 1) {
            setEvaluationIndex(index => index + 1)
        } else {
            setPhase('abilities')
        }
    }

    function returnToRanking() {
        setPhase('attributes')
    }

    function startAbilities() {
        if (postFinale) { returnToDossier(); return }
        if (talentsNeedsReset) setTalentValues(createAbilityValues(TALENTS))
        if (skillsNeedsReset) setSkillValues(createAbilityValues(SKILLS))
        if (knowledgesNeedsReset) setKnowledgeValues(createAbilityValues(KNOWLEDGES))
        setAbilityIndex(0)
        setPhase('abilityEvaluation')
    }

    function nextAbility() {
        if (postFinale) { returnToDossier(); return }
        if (abilityIndex < abilityOrder.length - 1) {
            setAbilityIndex(index => index + 1)
        } else {
            setPhase('backgrounds')
        }
    }

    function returnToAbilityRanking() {
        setPhase('abilities')
    }

    function startUmbra() {
        if (postFinale) { returnToDossier(); return }
        if (!canCompleteBackgrounds(backgroundDraft)) return
        setTakingOver(!umbraDraft.introSeen || replayIntro)
        setPhase('umbra')
    }

    function returnFromUmbra() {
        if (postFinale) { returnToDossier(); return }
        fadeScene(() => {
            setPhase('backgrounds')
            requestAnimationFrame(() => document.getElementById('background-title')?.focus({ preventScroll: true }))
        }, { night: true })
    }

    function returnToDossier() { setPhase('dossier') }
    function editDossier(section: DossierSection) {
        if (section === 'attributeOrder') setPhase('attributes')
        else if (['physical', 'social', 'mental'].includes(section)) { setEvaluationIndex(Math.max(0, attributeOrder.indexOf(section as AttributeBlock))); setPhase('evaluation') }
        else if (section === 'abilityOrder') setPhase('abilities')
        else if (['talents', 'skills', 'knowledges'].includes(section)) { setAbilityIndex(Math.max(0, abilityOrder.indexOf(section as AbilityBlock))); setPhase('abilityEvaluation') }
        else if (section === 'backgrounds') setPhase('backgrounds')
        else if (['tribe', 'auspice', 'answers'].includes(section)) {
            setUmbraDraft(current => {
                if (section === 'answers') return visitUmbraQuestion(current, 0)
                const completed = completeUmbra({ ...current, questionIndex: 15 })
                if (!completed.completed) return current
                if (section === 'tribe') return { ...completed, tribalStage: 'explore', auspiceStage: undefined }
                return browseAuspice({ ...completed, tribalStage: 'chosen' }, completed.auspiceChoice?.auspiceId ?? 'ragabash')
            })
            setPhase('umbra')
        }
    }
    const finishFinale = useCallback(() => {
        if (replay) { replay.onExit(); return }
        setFinaleDraft(current => ({ ...current, stage: 'dossier' })); setPhase('dossier')
    }, [replay, setFinaleDraft, setPhase])
    const advanceFinale = useCallback(() => {
        if (finaleDraft.stage === 'rupture') finishFinale()
        else setFinaleDraft(nextFinaleStage)
    }, [finaleDraft.stage, finishFinale, setFinaleDraft])
    const closingSeen = useCallback(() => setFinaleDraft(current => current.closingSeen ? current : { ...current, closingSeen: true }), [setFinaleDraft])
    function startFinale() {
        if (postFinale) { returnToDossier(); return }
        if (!canBeginFinale(umbraDraft)) return
        setFinaleDraft(current => beginFinale(current, umbraDraft))
        setPhase('finale')
    }
    if (replayPoint) return <ReplayExperience data={dossierData} point={replayPoint} onExit={() => setReplayPoint(null)} />
    if (phase === 'dossier' || phase === 'finale' && postFinale) return <MedicalDossier data={dossierData} finale={finaleDraft} onEdit={editDossier} onReplay={point => { if (canReplayExperience(dossierData, point)) setReplayPoint(point) }} onIdentity={patch => {
        if (patch.playerName !== undefined) setPlayerName(patch.playerName)
        if (patch.profession !== undefined) setProfession(patch.profession)
        if (patch.concept !== undefined) setConcept(patch.concept)
    }} onConfirm={fingerprint => setFinaleDraft(current => ({ ...current, stage: 'dossier', confirmedFingerprint: fingerprint, closingSeen: false }))} onClosingSeen={closingSeen} />
    if (phase === 'finale' && finaleDraft.stage !== 'ready' && finaleDraft.stage !== 'dossier' && canBeginFinale(umbraDraft)) return <Apotheosis key={finaleDraft.stage} stage={finaleDraft.stage} auspice={umbraDraft.auspiceChoice!.auspiceId} onNext={advanceFinale} onFinish={finishFinale} />
    if ((phase === 'umbra' || phase === 'finale') && !takingOver && canCompleteBackgrounds(backgroundDraft)) {
        return <><UmbraAssessment draft={umbraDraft} setDraft={setUmbraDraft} backgroundValues={backgroundDraft.values} onBack={returnFromUmbra} onFinale={startFinale} finaleReturn={postFinale} showIntro={replayIntro} onIntroComplete={finishReplayIntro} onRestart={import.meta.env.DEV && !postFinale && !replay ? () => { setUmbraDraft(createUmbraDraft()); returnFromUmbra() } : undefined} />{postFinale && <button type="button" className="dossier-return" onClick={returnToDossier}>Retour à la synthèse du dossier</button>}</>
    }

    return (
        <div className="site-shell" data-distortion={stage} data-takeover={takingOver}>
            <div className="signal-interference" aria-hidden="true">
                <div className="signal-grain" />
                <div className="signal-tear signal-tear--first" />
                <div className="signal-tear signal-tear--second" />
                <div className="signal-echo">{CONCEPT_QUESTION}</div>
                <div className="signal-echo signal-echo--second">{JOB_QUESTION}</div>
            </div>
            <main aria-busy={phase === 'scramble'} inert={takingOver}>
                {postFinale && <button className="dossier-editor-return" type="button" onClick={returnToDossier}>← Retour à la synthèse du dossier</button>}
                <header>
                    <p className="eyebrow">{visualText('Service de santé au travail')}</p>
                    <h1 aria-label={headerTitle}>
                        {visualText(headerTitle, 0.5)}
                        {echoes(distort(headerTitle, 0.5))}
                    </h1>
                    <p className="subtitle">{visualText('Dossier individuel — Confidentiel')}</p>
                </header>

                {started ? (
                    phase === 'backgrounds' || phase === 'umbra' ? (
                        <BackgroundAssessment draft={backgroundDraft} setDraft={setBackgroundDraft} totemRepository={totemRepository} onContinue={startUmbra} onBack={() => { setAbilityIndex(2); setPhase('abilityEvaluation') }} />
                    ) : phase === 'abilities' ? (
                        <AbilityRanking abilityOrder={abilityOrder} setAbilityOrder={setAbilityOrder} talentsNeedsReset={talentsNeedsReset} skillsNeedsReset={skillsNeedsReset} knowledgesNeedsReset={knowledgesNeedsReset} onContinue={startAbilities} />
                    ) : phase === 'abilityEvaluation' ? (
                        abilityBlock === 'talents' ? (
                            <AbilityAssessment
                                key="talents"
                                title="Aptitudes spontanées"
                                introduction={`Ce volet porte sur les aptitudes que vous mobilisez naturellement dans l’action ou que vous avez développées principalement par l’expérience directe. Vous disposez de ${talentBudget} points à répartir entre les domaines ci-dessous. Un niveau nul indique simplement l’absence d’expérience particulière dans ce domaine.`}
                                definitions={TALENTS}
                                budget={talentBudget}
                                values={talentValues}
                                setValues={setTalentValues}
                                details={talentDetails}
                                setDetails={setTalentDetails}
                                onBack={returnToAbilityRanking}
                                onContinue={nextAbility}
                            />
                        ) : abilityBlock === 'skills' ? (
                            <AbilityAssessment
                                key="skills"
                                title="Compétences opérationnelles"
                                introduction={`Ce volet porte sur les savoir-faire acquis par l’apprentissage, l’entraînement ou la pratique encadrée. Vous disposez de ${skillBudget} points à répartir entre les domaines ci-dessous. Un niveau nul indique que vous ne disposez pas d’une formation ou d’une expérience particulière dans ce domaine.`}
                                definitions={SKILLS}
                                budget={skillBudget}
                                values={skillValues}
                                setValues={setSkillValues}
                                details={skillDetails}
                                setDetails={setSkillDetails}
                                onBack={returnToAbilityRanking}
                                onContinue={nextAbility}
                            />
                        ) : (
                            <AbilityAssessment
                                key="knowledges"
                                title="Connaissances spécialisées"
                                introduction={`Ce volet porte sur les connaissances acquises par les études, la formation, la recherche personnelle ou une expérience intellectuelle approfondie. Vous disposez de ${knowledgeBudget} points à répartir entre les domaines ci-dessous. Un niveau nul indique que vous ne disposez pas de connaissances spécialisées particulières dans ce domaine.`}
                                definitions={KNOWLEDGES}
                                budget={knowledgeBudget}
                                values={knowledgeValues}
                                setValues={setKnowledgeValues}
                                details={knowledgeDetails}
                                setDetails={setKnowledgeDetails}
                                onBack={returnToAbilityRanking}
                                onContinue={nextAbility}
                            />
                        )
                    ) : phase === 'attributes' ? (
                        <AttributeRanking
                            attributeOrder={attributeOrder}
                            setAttributeOrder={setAttributeOrder}
                            physicalNeedsReset={physicalNeedsReset}
                            socialNeedsReset={socialNeedsReset}
                            mentalNeedsReset={mentalNeedsReset}
                            onContinue={startAssessments}
                        />
                    ) : phase === 'evaluation' ? (
                        evaluationBlock === 'physical' ? (
                            <FunctionalAssessment
                                budget={physicalBudget}
                                position={evaluationIndex}
                                values={physicalValues}
                                setValues={setPhysicalValues}
                                onBack={returnToRanking}
                                onContinue={nextAssessment}
                            />
                        ) : evaluationBlock === 'social' ? (
                            <RelationalAssessment
                                budget={socialBudget}
                                position={evaluationIndex}
                                values={socialValues}
                                setValues={setSocialValues}
                                onBack={returnToRanking}
                                onContinue={nextAssessment}
                            />
                        ) : (
                            <CognitiveAssessment
                                budget={mentalBudget}
                                position={evaluationIndex}
                                values={mentalValues}
                                setValues={setMentalValues}
                                onBack={returnToRanking}
                                onContinue={nextAssessment}
                            />
                        )
                    ) : (
                        <section>
                            <p className="eyebrow">{visualText('Situation individuelle', 0.6)}</p>

                            <h2
                                className="question"
                                aria-label={
                                    phase === 'concept' ? CONCEPT_QUESTION : JOB_QUESTION
                                }
                            >
                                <span aria-hidden="true">{question}</span>
                                {echoes(question)}
                            </h2>

                            <p
                                className={`status ${phase === 'scramble' ? 'processing' : ''}`}
                                role="status"
                            >
                                {phase === 'scramble'
                                    ? 'Reformulation en cours.'
                                    : phase === 'concept'
                                        ? 'Veuillez répondre librement.'
                                        : 'Entretien en cours.'}
                            </p>

                            {phase !== 'concept' && (
                                <form
                                    onSubmit={(event) => {
                                        event.preventDefault()

                                        if (phase !== 'job' || !profession.trim()) return

                                        setProfession(profession.trim())
                                        startScramble()
                                    }}
                                >
                                    <label htmlFor="profession">{visualText('Emploi actuel', 0.6)}</label>

                                    <input
                                        id="profession"
                                        value={profession}
                                        onChange={(event) => setProfession(event.target.value)}
                                        placeholder="Métier ou situation actuelle"
                                        required
                                        disabled={phase === 'scramble'}
                                        autoFocus
                                    />

                                    <button type="submit" disabled={phase === 'scramble' || !profession.trim()}>
                                        {visualText('Valider', 0.8)}
                                    </button>
                                </form>
                            )}

                            {phase === 'concept' && (
                                <form
                                    className="concept-answer"
                                    onSubmit={(event) => {
                                        event.preventDefault()
                                        if (!concept.trim()) return
                                        setConcept(concept.trim())
                                        setPhase('attributes')
                                    }}
                                >
                                    <label htmlFor="concept">Votre présentation</label>

                                    <textarea
                                        id="concept"
                                        value={concept}
                                        onChange={(event) => setConcept(event.target.value)}
                                        rows={5}
                                        required
                                        autoFocus
                                    />

                                    <p className="subtitle">Une ou deux phrases suffisent.</p>
                                    <button type="submit" disabled={!concept.trim()}>
                                        Valider et continuer
                                    </button>
                                </form>
                            )}
                        </section>
                    )
                ) : (
                    <form
                        onSubmit={(event) => {
                            event.preventDefault()

                            if (!playerName.trim()) return

                            setPlayerName(playerName.trim())
                            setStarted(true)
                        }}
                    >
                        <label htmlFor="player-name">Votre pseudo de joueur</label>

                        <input
                            id="player-name"
                            value={playerName}
                            onChange={(event) => setPlayerName(event.target.value)}
                            required
                        />

                        <button type="submit" disabled={!playerName.trim()}>
                            Commencer
                        </button>
                    </form>
                )}

                <footer>
                    {visualText('Création de personnage — Répondez pour votre personnage fictif.', 0.4)}
                    <br /><PrivacyLink />
                </footer>
            </main>
            {takingOver && <UmbraTakeover onComplete={finishTakingOver} />}
            {import.meta.env.DEV && phase === 'concept' && (
                <aside className="preview-controls" aria-label="Aperçu local">
                    <span>Aperçu local</span>
                    <button type="button" onClick={startScramble}>Rejouer la rupture</button>
                </aside>
            )}
        </div>
    )
}

function ReplayExperience({ data, point, onExit }: { data: DossierData; point: ReplayPoint; onExit: () => void }) {
    const [storage] = useState(() => createReplayStorage(data, point))
    return <QuestionnaireStoragePortContext.Provider value={storage}><QuestionnaireStorageContext.Provider value="experience-replay">
        <div className="experience-replay">
            <nav className="experience-replay-banner" aria-label="Relecture de l’expérience"><p>Relecture de l’expérience<span>Votre dossier enregistré reste conservé.</span></p><button type="button" onClick={onExit}>Revenir à mon dossier <span aria-hidden="true">↗</span></button></nav>
            <App replay={{ point, onExit }} />
        </div>
    </QuestionnaireStorageContext.Provider></QuestionnaireStoragePortContext.Provider>
}

export default App
