import { PRIORITY_LABELS, SECTION_LABELS } from './attributes'
import type { AttributeBlock } from './attributes'
import './Assessment.css'

type Props = {
    block: AttributeBlock
    position: number
    onBack: () => void
    onContinue: () => void
}

export default function PendingAssessment({ block, position, onBack, onContinue }: Props) {
    return (
        <section className="assessment" aria-labelledby="assessment-title">
            <p className="eyebrow">Volet {position + 1}/3 — {SECTION_LABELS[block]}</p>
            <h2 id="assessment-title">{PRIORITY_LABELS[position]}</h2>
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
