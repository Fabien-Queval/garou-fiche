import { ABILITY_BLOCKS } from './abilities'
import type { AbilityBlock } from './abilities'
import './Assessment.css'

type Props = { block: AbilityBlock; position: number; onBack: () => void; onContinue: () => void }

export default function PendingAbility({ block, position, onBack, onContinue }: Props) {
    return (
        <section className="assessment" aria-labelledby="pending-ability-title">
            <p className="eyebrow">Votre parcours</p>
            <h2 id="pending-ability-title">{ABILITY_BLOCKS[block].title}</h2>
            <div className="pending-assessment">
                <p className="eyebrow">À venir</p>
                <p>Ce volet sera disponible prochainement.</p>
                {position < 2 && <p className="subtitle">Vous pouvez poursuivre vers le volet suivant.</p>}
            </div>
            <div className="assessment-actions">
                <button type="button" className="secondary-button" onClick={onBack}>Retour au classement</button>
                {position < 2 && <button type="button" onClick={onContinue}>Continuer</button>}
            </div>
        </section>
    )
}
