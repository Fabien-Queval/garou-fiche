import { corruptText } from './scramble.ts'
import type { AbilityDefinition } from './talents'

export function centralIntensity(cardCenter: number, viewportHeight: number): number {
    if (viewportHeight <= 0) return 0
    return Math.max(0, 1 - Math.abs(cardCenter - viewportHeight / 2) / (viewportHeight * 0.35))
}

export function referenceFrame(definition: AbilityDefinition, level: number, elapsed: number, reducedMotion = false, intensity = 0) {
    const levelText = level === 0
        ? 'Aucune expérience particulière déclarée dans ce domaine.'
        : definition.levels[level - 1]
    const normal = { label: definition.label, description: definition.description, levelText, phase: 'settled', ghost: '', note: '' }
    if (reducedMotion || elapsed >= 3600) return {
        ...normal,
        note: definition.presentationMode === 'foreign' ? 'Formulation provisoire.' : '',
    }

    const foreign = definition.presentationMode === 'foreign'
    const hesitant = definition.presentationMode === 'hesitant'
    const intrusion = (foreign && elapsed >= 900 && elapsed < 2200) ||
        (hesitant && elapsed >= 700 && elapsed < 1400)
    // Seuls les fragments choisis pour cette anomalie peuvent quitter les données.
    const fragments = definition.fragmentIntrusions ?? []
    const fragmentStart = foreign ? 900 : 700
    const fragmentDuration = foreign ? 1300 : 700
    const fragmentIndex = Math.floor((elapsed - fragmentStart) * fragments.length / fragmentDuration)
    const fragment = intensity > 0 ? fragments[fragmentIndex] ?? '' : ''

    if (definition.presentationMode === 'stable') return {
        ...normal,
        phase: fragment ? 'contamination' : 'settled',
        ghost: fragment,
    }

    if (intrusion) return {
        ...normal,
        label: definition.intrusionLabel ?? definition.label,
        phase: foreign ? 'breach' : 'hesitation',
        ghost: foreign ? fragment || 'VOUS LE SAVEZ DÉJÀ.' : fragment,
        note: foreign ? 'Ce n’est pas un apprentissage. C’est une mémoire.' : 'Relecture en cours.',
    }

    const rewrite = (foreign && elapsed >= 2200 && elapsed < 3600) ||
        (hesitant && elapsed >= 1400 && elapsed < 2300)
    return {
        ...normal,
        label: rewrite
            ? corruptText(definition.label, 650 + elapsed % 600, (foreign ? 0.22 : 0.08) + intensity * 0.45)
            : intensity > 0 && (foreign || hesitant) ? corruptText(definition.label, elapsed, intensity * 0.6) : definition.label,
        phase: rewrite ? 'rewrite' : 'settled',
        ghost: rewrite && foreign && fragments.length === 0 ? 'LE LOUP' : '',
        note: rewrite ? 'Reformulation en cours.' : '',
    }
}
