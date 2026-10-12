import type { Dispatch, SetStateAction } from 'react'
import { ATTRIBUTE_POINTS } from './attributes'
import type { AttributeBlock } from './attributes'
import './AttributeRanking.css'

const POSITIONS = ['1er', '2e', '3e']

// Record impose une description pour chacun des trois identifiants autorisés.
const ATTRIBUTE_BLOCKS: Record<AttributeBlock, { title: string; description: string }> = {
    physical: {
        title: 'Physique',
        description: 'Vos capacités physiques constituent l’un de vos principaux atouts. Vous vous distinguez par la force, la précision ou la maîtrise de vos gestes, l’agilité, ou encore par votre capacité à soutenir un effort prolongé et à supporter fatigue et inconfort.',
    },
    social: {
        title: 'Social',
        description: 'Vos capacités sociales constituent l’un de vos principaux atouts. Vous savez créer une impression forte, inspirer confiance ou attirer l’attention. Vous êtes à l’aise pour convaincre, influencer ou amener les autres à vous suivre, que ce soit par votre personnalité, votre présence ou votre compréhension des rapports humains.',
    },
    mental: {
        title: 'Mental',
        description: 'Vos capacités mentales constituent l’un de vos principaux atouts. Vous remarquez facilement ce qui échappe aux autres, analysez les informations et établissez rapidement des liens entre elles. Vous savez raisonner, résoudre des problèmes et vous adapter lorsque la situation change, y compris lorsqu’il faut réagir vite ou garder la tête froide.',
    },
}

function moveAttribute(order: AttributeBlock[], index: number, direction: -1 | 1): AttributeBlock[] {
    const targetIndex = index + direction
    if (index < 0 || index >= order.length || targetIndex < 0 || targetIndex >= order.length) {
        return order
    }

    // On échange les voisins dans une copie, jamais dans le tableau du state.
    const nextOrder = [...order]
    const movingBlock = nextOrder[index]
    nextOrder[index] = nextOrder[targetIndex]
    nextOrder[targetIndex] = movingBlock
    return nextOrder
}

type Props = {
    attributeOrder: AttributeBlock[]
    setAttributeOrder: Dispatch<SetStateAction<AttributeBlock[]>>
    physicalNeedsReset: boolean
    socialNeedsReset: boolean
    mentalNeedsReset: boolean
    onContinue: () => void
}

export default function AttributeRanking({ attributeOrder, setAttributeOrder, physicalNeedsReset, socialNeedsReset, mentalNeedsReset, onContinue }: Props) {

    // Les points sont recalculés depuis la position ; ils ne sont ni stockés ni affichés.
    const rankedAttributes = attributeOrder.map((id, index) => ({
        id,
        ...ATTRIBUTE_BLOCKS[id],
        points: ATTRIBUTE_POINTS[index],
    }))

    function moveCard(index: number, direction: -1 | 1, button: HTMLButtonElement) {
        // Si React retire cette flèche à la nouvelle position, le focus reste sur la carte.
        if (index === 1) button.closest('li')?.focus()

        // La mise à jour fonctionnelle utilise toujours l'ordre React le plus récent.
        setAttributeOrder(currentOrder => moveAttribute(currentOrder, index, direction))
    }

    return (
        <section className="attribute-ranking" aria-labelledby="ranking-title">
            <p className="eyebrow">Vos principaux atouts</p>
            <h2 id="ranking-title">Classez ces domaines selon ce qui caractérise le mieux votre personnage.</h2>
            <p className="ranking-help">Utilisez les flèches pour changer leur ordre.</p>

            <ol className="attribute-cards">
                {rankedAttributes.map(({ id, title, description }, index) => (
                    // Une clé liée au bloc permet à React de suivre la carte quand elle bouge.
                    <li className="attribute-card" key={id} tabIndex={-1}>
                        <div className="attribute-card-heading">
                            <span className="attribute-position" aria-label={`Position ${index + 1} sur 3`}>
                                {POSITIONS[index]}
                            </span>
                            <h3>{title}</h3>
                            <div className="attribute-arrows">
                                {index > 0 && (
                                    <button
                                        key="up"
                                        type="button"
                                        aria-label={`Monter ${title}`}
                                        onClick={event => moveCard(index, -1, event.currentTarget)}
                                    >
                                        <span aria-hidden="true">↑</span>
                                    </button>
                                )}
                                {index < attributeOrder.length - 1 && (
                                    <button
                                        key="down"
                                        type="button"
                                        aria-label={`Descendre ${title}`}
                                        onClick={event => moveCard(index, 1, event.currentTarget)}
                                    >
                                        <span aria-hidden="true">↓</span>
                                    </button>
                                )}
                            </div>
                        </div>
                        <p>{description}</p>
                    </li>
                ))}
            </ol>
            <p className="sr-only" role="status">
                {rankedAttributes.map(({ title }, index) => `${POSITIONS[index]} : ${title}`).join('. ')}
            </p>
            {physicalNeedsReset && (
                <p className="subtitle" role="status">
                    Ce nouvel ordre nécessite de recommencer l’auto-évaluation du volet fonctionnel.
                </p>
            )}
            {socialNeedsReset && (
                <p className="subtitle" role="status">
                    Ce nouvel ordre nécessite de recommencer l’auto-évaluation du volet relationnel.
                </p>
            )}
            {mentalNeedsReset && (
                <p className="subtitle" role="status">
                    Ce nouvel ordre nécessite de recommencer l’auto-évaluation du volet cognitif.
                </p>
            )}
            <button type="button" onClick={onContinue}>Continuer</button>
        </section>
    )
}
