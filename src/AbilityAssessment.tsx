import { useState } from 'react'
import type { CSSProperties, Dispatch, SetStateAction } from 'react'
import { allocatedAbilityPoints, canCompleteAbilities, requiresAbilityDetail, selectAbilityLevel } from './talents'
import type { AbilityDefinition, AbilityDetails, AbilityValues } from './talents'
import { referenceFrame } from './referenceWriting'
import { useCentralAnomaly } from './useCentralAnomaly'
import { distortionAt } from './scramble'
import './Assessment.css'
import './AbilityAssessment.css'

type CardProps = {
    definition: AbilityDefinition
    value: number
    detail: string
    remaining: number
    onChoose: (id: string, level: number) => void
    onDetail: (id: string, text: string) => void
}

function AbilityCard({ definition, value, detail, remaining, onChoose, onDetail }: CardProps) {
    const hasAnomaly = definition.presentationMode !== 'stable' || Boolean(definition.fragmentIntrusions?.length)
    const { card, centerProbe, elapsed, intensity: centralStrength, reducedMotion } = useCentralAnomaly(hasAnomaly)

    const strength = definition.anomalyIntensity ?? (definition.presentationMode === 'foreign' ? 1 : 0.55)
    const intensity = reducedMotion ? 0 : centralStrength * strength
    const frame = referenceFrame(definition, value, elapsed, reducedMotion, intensity)
    // Une contamination de fragment ne fracture pas toute la carte stable.
    const stage = intensity > 0 && definition.presentationMode !== 'stable' ? distortionAt(elapsed) : 'quiet'
    const suggestions = definition.specialtySuggestions.filter(suggestion => !suggestion.foreign)
    const showDetail = value > 0 && definition.specialtyMode !== 'normal'
    const required = requiresAbilityDetail(definition.specialtyMode)

    return (
        <fieldset
            ref={card}
            className="criterion-card ability-card"
            data-presentation={definition.presentationMode}
            data-reference-phase={frame.phase}
            data-anomaly-stage={stage}
            style={{ '--anomaly-strength': intensity } as CSSProperties}
        >
            <legend>
                <span className="sr-only">{definition.label}</span>
                <span aria-hidden="true" className="reference-heading">
                    <span className="reference-measure">{definition.label}</span>
                    <span className="reference-title">{frame.label}</span>
                    <span className="reference-title-echo reference-title-echo--first">{frame.label}</span>
                    <span className="reference-title-echo reference-title-echo--second">{frame.label}</span>
                </span>
            </legend>
            <span ref={centerProbe} className="anomaly-center-probe" aria-hidden="true" />
            <div className="anomaly-surface" aria-hidden="true">
                <span className="anomaly-grain" />
                <span className="anomaly-tear anomaly-tear--first" />
                <span className="anomaly-tear anomaly-tear--second" />
                <span className="anomaly-document-echo">{definition.intrusionLabel}</span>
            </div>
            <div className="ability-reference">
                <p className="reference-description">{definition.description}</p>
                <span className="reference-ghost" aria-hidden="true">{frame.ghost}</span>
            </div>

            <div className="rating-levels ability-levels">
                {[0, 1, 2, 3].map(level => (
                    <label className="level-control" key={level}>
                        <input
                            className="sr-only level-input"
                            type="radio"
                            name={definition.id}
                            aria-label={level === 0 ? 'Niveau 0 — Aucune expérience particulière' : `Niveau ${level}`}
                            checked={value === level}
                            disabled={level - value > remaining}
                            onChange={() => onChoose(definition.id, level)}
                            aria-describedby={`${definition.id}-level-description`}
                        />
                        <span className={`level-dot ${level === 0 ? 'zero-level' : ''}`} aria-hidden="true">
                            {level === 0 ? '0' : level <= value ? '●' : '○'}
                        </span>
                    </label>
                ))}
            </div>
            <div className="level-description" id={`${definition.id}-level-description`}>
                <p className="level-caption">Niveau {value}{value === 0 ? ' — Aucune expérience particulière' : ''}</p>
                <p>{value === 0 ? 'Aucune expérience particulière déclarée dans ce domaine.' : definition.levels[value - 1]}</p>
            </div>
            <p className="reference-note" aria-hidden="true">{frame.note || '\u00a0'}</p>

            {showDetail ? (
                <div className="ability-detail">
                    <label htmlFor={`${definition.id}-detail`}>{definition.detailLabel}</label>
                    <input
                        id={`${definition.id}-detail`}
                        value={detail}
                        required={required}
                        maxLength={160}
                        onChange={event => onDetail(definition.id, event.target.value)}
                        aria-describedby={`${definition.id}-examples`}
                    />
                    <div className="detail-suggestions" id={`${definition.id}-examples`}>
                        <span>Par exemple :</span>
                        {suggestions.map(suggestion => (
                            <button type="button" key={suggestion.label} onClick={() => onDetail(definition.id, suggestion.displayLabel ?? suggestion.label)}>
                                {suggestion.displayLabel ?? suggestion.label}
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <details className="associated-domains">
                    <summary>Domaines associés</summary>
                    <p>{suggestions.map(suggestion => suggestion.displayLabel ?? suggestion.label).join(' · ')}</p>
                </details>
            )}
        </fieldset>
    )
}

type Props = {
    title: string
    introduction: string
    definitions: AbilityDefinition[]
    budget: number
    values: AbilityValues
    setValues: Dispatch<SetStateAction<AbilityValues>>
    details: AbilityDetails
    setDetails: Dispatch<SetStateAction<AbilityDetails>>
    onBack: () => void
    onContinue: () => void
}

export default function AbilityAssessment({ title, introduction, definitions, budget, values, setValues, details, setDetails, onBack, onContinue }: Props) {
    const [confirmed, setConfirmed] = useState(false)
    const remaining = budget - allocatedAbilityPoints(values)
    const complete = canCompleteAbilities(definitions, values, details, budget)

    function chooseLevel(id: string, level: number) {
        setValues(current => selectAbilityLevel(current, id, level, budget))
        setConfirmed(false)
    }

    function chooseDetail(id: string, text: string) {
        setDetails(current => ({ ...current, [id]: text }))
        setConfirmed(false)
    }

    return (
        <section className="assessment ability-assessment" aria-labelledby="ability-assessment-title">
            <p className="eyebrow">Votre parcours — Compétences acquises</p>
            <h2 id="ability-assessment-title">{title}</h2>
            <p className="assessment-intro">{introduction}</p>
            <p className="ability-instructions">Choisissez de 0 à 3 pour chaque domaine. Le bouton 0 permet de rendre tous les points de ce domaine.</p>
            <div className="budget-summary" role="status">
                <span>Points disponibles : <strong>{budget}</strong></span>
                <span>Restants : <strong>{remaining}</strong></span>
            </div>
            <form onSubmit={event => {
                event.preventDefault()
                if (!complete) return
                setConfirmed(true)
                onContinue()
            }}>
                <div className="assessment-criteria">
                    {definitions.map(definition => (
                        <AbilityCard
                            key={definition.id}
                            definition={definition}
                            value={values[definition.id] ?? 0}
                            detail={details[definition.id] ?? ''}
                            remaining={remaining}
                            onChoose={chooseLevel}
                            onDetail={chooseDetail}
                        />
                    ))}
                </div>
                <p className="assessment-help">
                    {remaining > 0
                        ? `Répartissez encore ${remaining} ${remaining === 1 ? 'point' : 'points'} pour continuer.`
                        : complete ? 'Tous les points ont été répartis.' : 'Complétez les précisions obligatoires des domaines sélectionnés pour continuer.'}
                    {' '}Les niveaux grisés dépassent le budget disponible. Vous pouvez réduire une valeur pour réattribuer les points.
                </p>
                {confirmed && <p className="assessment-confirmation" role="status">Vos réponses pour ce volet sont validées.</p>}
                <div className="assessment-actions">
                    <button type="button" className="secondary-button" onClick={onBack}>Retour au classement</button>
                    <button type="submit" disabled={!complete || confirmed}>{confirmed ? 'Validé' : 'Continuer'}</button>
                </div>
            </form>
        </section>
    )
}
