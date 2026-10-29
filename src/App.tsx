import { useCallback, useEffect, useState } from 'react'
import AttributeRanking from './AttributeRanking'
import AbilityRanking from './AbilityRanking'
import AbilityAssessment from './AbilityAssessment'
import BackgroundAssessment from './BackgroundAssessment'
import { canCompleteBackgrounds, createBackgroundDraft } from './backgrounds'
import UmbraAssessment from './UmbraAssessment'
import UmbraTakeover from './UmbraTakeover'
import { createUmbraDraft } from './umbraQuestionnaire'
import { useQuestionnaireState } from './questionnaireStorage'
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

type Phase = 'job' | 'scramble' | 'concept' | 'attributes' | 'evaluation' | 'abilities' | 'abilityEvaluation' | 'backgrounds' | 'umbra'

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

function App({ totemRepository }: { totemRepository?: TotemRepository }) {
    const [playerName, setPlayerName] = useQuestionnaireState('playerName', '')
    const [started, setStarted] = useQuestionnaireState('started', attributePreview || functionalPreview || relationalPreview || cognitivePreview || abilityPreview || talentsPreview || skillsPreview || knowledgesPreview || backgroundsPreview)
    const [profession, setProfession] = useQuestionnaireState('profession', '')
    const [concept, setConcept] = useQuestionnaireState('concept', '')

    const [phase, setPhase] = useQuestionnaireState<Phase>('phase', backgroundsPreview ? 'backgrounds' : talentsPreview || skillsPreview || knowledgesPreview ? 'abilityEvaluation' : abilityPreview ? 'abilities' : functionalPreview || relationalPreview || cognitivePreview ? 'evaluation' : attributePreview ? 'attributes' : 'job')
    const [elapsed, setElapsed] = useState(0)
    // L'ordre vit dans le parent pour rester disponible après le classement.
    const [attributeOrder, setAttributeOrder] = useQuestionnaireState<AttributeBlock[]>('attributeOrder', ['physical', 'social', 'mental'])
    const [abilityOrder, setAbilityOrder] = useQuestionnaireState<AbilityBlock[]>('abilityOrder', ['talents', 'skills', 'knowledges'])
    const [abilityIndex, setAbilityIndex] = useQuestionnaireState('abilityIndex', knowledgesPreview ? 2 : skillsPreview ? 1 : 0)
    const [talentValues, setTalentValues] = useQuestionnaireState('talentValues', createAbilityValues(TALENTS))
    const [talentDetails, setTalentDetails] = useQuestionnaireState<AbilityDetails>('talentDetails', {})
    const [skillValues, setSkillValues] = useQuestionnaireState('skillValues', createAbilityValues(SKILLS))
    const [skillDetails, setSkillDetails] = useQuestionnaireState<AbilityDetails>('skillDetails', {})
    const [knowledgeValues, setKnowledgeValues] = useQuestionnaireState('knowledgeValues', createAbilityValues(KNOWLEDGES))
    const [knowledgeDetails, setKnowledgeDetails] = useQuestionnaireState<AbilityDetails>('knowledgeDetails', {})
    const [backgroundDraft, setBackgroundDraft] = useQuestionnaireState('backgroundDraft', createBackgroundDraft())
    const [umbraDraft, setUmbraDraft] = useQuestionnaireState('umbraDraft', createUmbraDraft())
    const [takingOver, setTakingOver] = useState(false)
    const finishTakingOver = useCallback(() => setTakingOver(false), [])
    const [evaluationIndex, setEvaluationIndex] = useQuestionnaireState('evaluationIndex', cognitivePreview ? 2 : relationalPreview ? 1 : 0)
    const [physicalValues, setPhysicalValues] = useQuestionnaireState<PhysicalValues>('physicalValues', { strength: 1, dexterity: 1, stamina: 1 })
    const [socialValues, setSocialValues] = useQuestionnaireState<SocialValues>('socialValues', { charisma: 1, manipulation: 1, appearance: 1 })
    const [mentalValues, setMentalValues] = useQuestionnaireState<MentalValues>('mentalValues', { perception: 1, intelligence: 1, wits: 1 })

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
        if (physicalNeedsReset) setPhysicalValues({ strength: 1, dexterity: 1, stamina: 1 })
        if (socialNeedsReset) setSocialValues({ charisma: 1, manipulation: 1, appearance: 1 })
        if (mentalNeedsReset) setMentalValues({ perception: 1, intelligence: 1, wits: 1 })
        setEvaluationIndex(0)
        setPhase('evaluation')
        window.scrollTo(0, 0)
    }

    function nextAssessment() {
        if (evaluationIndex < attributeOrder.length - 1) {
            setEvaluationIndex(index => index + 1)
        } else {
            setPhase('abilities')
        }
        window.scrollTo(0, 0)
    }

    function returnToRanking() {
        setPhase('attributes')
        window.scrollTo(0, 0)
    }

    function startAbilities() {
        if (talentsNeedsReset) setTalentValues(createAbilityValues(TALENTS))
        if (skillsNeedsReset) setSkillValues(createAbilityValues(SKILLS))
        if (knowledgesNeedsReset) setKnowledgeValues(createAbilityValues(KNOWLEDGES))
        setAbilityIndex(0)
        setPhase('abilityEvaluation')
        window.scrollTo(0, 0)
    }

    function nextAbility() {
        if (abilityIndex < abilityOrder.length - 1) {
            setAbilityIndex(index => index + 1)
        } else {
            setPhase('backgrounds')
        }
        window.scrollTo(0, 0)
    }

    function returnToAbilityRanking() {
        setPhase('abilities')
        window.scrollTo(0, 0)
    }

    function startUmbra() {
        if (!canCompleteBackgrounds(backgroundDraft)) return
        setTakingOver(!umbraDraft.introSeen)
        setPhase('umbra')
        window.scrollTo(0, 0)
    }

    function returnFromUmbra() {
        setPhase('backgrounds')
        window.scrollTo(0, 0)
        requestAnimationFrame(() => document.getElementById('background-title')?.focus({ preventScroll: true }))
    }

    if (phase === 'umbra' && !takingOver && canCompleteBackgrounds(backgroundDraft)) {
        return <UmbraAssessment draft={umbraDraft} setDraft={setUmbraDraft} onBack={returnFromUmbra} onRestart={import.meta.env.DEV ? () => { setUmbraDraft(createUmbraDraft()); returnFromUmbra() } : undefined} />
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
                        <BackgroundAssessment draft={backgroundDraft} setDraft={setBackgroundDraft} totemRepository={totemRepository} onContinue={startUmbra} onBack={() => { setAbilityIndex(2); setPhase('abilityEvaluation'); window.scrollTo(0, 0) }} />
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
                                        window.scrollTo(0, 0)
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

export default App
