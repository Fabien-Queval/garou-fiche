import { useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import {
    allocatedMentalPoints,
    LEVEL_LABELS,
    MENTAL_CRITERIA,
    PRIORITY_LABELS,
    selectMentalLevel,
} from './attributes'
import type { MentalCriterion, MentalValues } from './attributes'
import './Assessment.css'

type Props = {
    budget: number
    position: number
    values: MentalValues
    setValues: Dispatch<SetStateAction<MentalValues>>
    onBack: () => void
    onContinue: () => void
}

export default function CognitiveAssessment({ budget, position, values, setValues, onBack, onContinue }: Props) {
    const [confirmed, setConfirmed] = useState(false)
    // Le compteur découle des niveaux : aucun state pour les points consommés ou restants.
    const consumed = allocatedMentalPoints(values)
    const remaining = budget - consumed

    function chooseLevel(criterion: MentalCriterion, level: number) {
        setValues(currentValues => selectMentalLevel(currentValues, criterion, level, budget))
        setConfirmed(false)
    }

    return (
        <section className="assessment" aria-labelledby="assessment-title">
            <p className="eyebrow">Volet {position + 1}/3 — Cognitif</p>
            <h2 id="assessment-title">{PRIORITY_LABELS[position]}</h2>
            <p className="assessment-intro">
                Ce volet évalue la manière dont vous percevez, analysez et traitez les informations dans votre environnement.
                Vous disposez de {budget} points à répartir afin de nous aider à comprendre
                votre fonctionnement face à des situations complexes, imprévues ou nécessitant une prise de décision rapide.
                Le premier niveau de chaque critère représente le niveau fonctionnel humain
                de base : il est acquis automatiquement et n’entre pas dans votre décompte.
            </p>
            {position === 0 && (
                <p className="assessment-note">Ce domaine correspond à l’un de vos principaux domaines d’aisance.</p>
            )}

            <div className="budget-summary" role="status">
                <span>Points disponibles : <strong>{budget}</strong></span>
                <span>Restants : <strong>{remaining}</strong></span>
            </div>

            <form onSubmit={event => {
                event.preventDefault()
                if (remaining !== 0) return
                setConfirmed(true)
                onContinue()
            }}>
                <div className="assessment-criteria">
                    {MENTAL_CRITERIA.map(({ id, title, description, levels }) => (
                        <fieldset className="criterion-card" key={id}>
                            <legend>{title}</legend>
                            <p className="criterion-description">{description}</p>
                            <div className="rating-levels">
                                {LEVEL_LABELS.map((label, index) => {
                                    const level = index + 1
                                    const exceedsBudget = consumed + level - values[id] > budget
                                    return (
                                        <label className="level-control" key={level}>
                                            <input
                                                className="sr-only level-input"
                                                type="radio"
                                                name={id}
                                                aria-label={`Niveau ${level} — ${label}`}
                                                checked={values[id] === level}
                                                disabled={exceedsBudget}
                                                onChange={() => chooseLevel(id, level)}
                                                aria-describedby={`${id}-level-description`}
                                            />
                                            <span className="level-dot" aria-hidden="true">
                                                {level <= values[id] ? '●' : '○'}
                                            </span>
                                        </label>
                                    )
                                })}
                            </div>
                            <div className="level-description" id={`${id}-level-description`}>
                                <p className="level-caption">Niveau {values[id]} — {LEVEL_LABELS[values[id] - 1]}</p>
                                <p>{levels[values[id] - 1]}</p>
                            </div>
                        </fieldset>
                    ))}
                </div>

                <p className="assessment-help">
                    {confirmed
                        ? 'Ce volet est validé. Vous pouvez ajuster vos réponses si nécessaire.'
                        : remaining > 0
                            ? `Répartissez encore ${remaining} ${remaining === 1 ? 'point' : 'points'} pour continuer.`
                            : 'Tous les points ont été répartis. Vous pouvez continuer.'}
                    {' '}Les niveaux grisés dépassent les points disponibles.
                    Vous pouvez réduire un niveau pour réattribuer les points.
                </p>
                {confirmed && (
                    <p className="assessment-confirmation" role="status">Vos réponses pour ce volet sont validées.</p>
                )}
                <div className="assessment-actions">
                    <button type="button" className="secondary-button" onClick={onBack}>Retour au classement</button>
                    <button type="submit" disabled={remaining !== 0 || confirmed}>
                        {confirmed ? 'Validé' : 'Continuer'}
                    </button>
                </div>
            </form>
        </section>
    )
}


