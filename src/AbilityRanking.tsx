import type { Dispatch, SetStateAction } from 'react'
import { ABILITY_BLOCKS, moveAbility } from './abilities'
import type { AbilityBlock } from './abilities'
import './AttributeRanking.css'
import './AbilityRanking.css'

const POSITIONS = ['1er', '2e', '3e']

type Props = {
    abilityOrder: AbilityBlock[]
    setAbilityOrder: Dispatch<SetStateAction<AbilityBlock[]>>
    talentsNeedsReset: boolean
    skillsNeedsReset: boolean
    knowledgesNeedsReset: boolean
    onContinue: () => void
}

export default function AbilityRanking({ abilityOrder, setAbilityOrder, talentsNeedsReset, skillsNeedsReset, knowledgesNeedsReset, onContinue }: Props) {

    function moveCard(index: number, direction: -1 | 1, button: HTMLButtonElement) {
        // Le focus reste sur la carte si cette flèche devient désactivée.
        if (index === 1) button.closest('li')?.focus()
        setAbilityOrder(currentOrder => moveAbility(currentOrder, index, direction))
    }

    return (
        <section className="attribute-ranking ability-ranking" aria-labelledby="ability-ranking-title">
            <p className="eyebrow">Votre parcours</p>
            <h2 id="ability-ranking-title">
                Classez les domaines suivants selon la place qu’ils occupent dans votre expérience,
                votre apprentissage et votre manière habituelle d’agir.
            </h2>
            <p className="ranking-help">Utilisez les flèches pour changer leur ordre.</p>

            <ol className="attribute-cards">
                {abilityOrder.map((id, index) => {
                    const { title, description } = ABILITY_BLOCKS[id]
                    return (
                        <li className="attribute-card" key={id} tabIndex={-1}>
                            <div className="attribute-card-heading">
                                <span className="attribute-position" aria-label={`Position ${index + 1} sur 3`}>
                                    {POSITIONS[index]}
                                </span>
                                <h3>{title}</h3>
                                <div className="attribute-arrows">
                                    <button
                                        type="button"
                                        aria-label={`Monter ${title}`}
                                        disabled={index === 0}
                                        onClick={event => moveCard(index, -1, event.currentTarget)}
                                    >
                                        <span aria-hidden="true">↑</span>
                                    </button>
                                    <button
                                        type="button"
                                        aria-label={`Descendre ${title}`}
                                        disabled={index === abilityOrder.length - 1}
                                        onClick={event => moveCard(index, 1, event.currentTarget)}
                                    >
                                        <span aria-hidden="true">↓</span>
                                    </button>
                                </div>
                            </div>
                            <p>{description}</p>
                        </li>
                    )
                })}
            </ol>
            <p className="sr-only" role="status">
                {abilityOrder.map((id, index) => `${POSITIONS[index]} : ${ABILITY_BLOCKS[id].title}`).join('. ')}
            </p>
            {talentsNeedsReset && (
                <p className="ability-confirmation" role="status">Ce nouvel ordre nécessite de recommencer l’évaluation des aptitudes spontanées.</p>
            )}
            {skillsNeedsReset && (
                <p className="ability-confirmation" role="status">Ce nouvel ordre nécessite de recommencer l’évaluation des compétences opérationnelles.</p>
            )}
            {knowledgesNeedsReset && (
                <p className="ability-confirmation" role="status">Ce nouvel ordre nécessite de recommencer l’évaluation des connaissances spécialisées.</p>
            )}
            <button type="button" onClick={onContinue}>Continuer</button>
        </section>
    )
}
