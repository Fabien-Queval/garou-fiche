export type AbilityBlock = 'talents' | 'skills' | 'knowledges'

export const ABILITY_POINTS = [13, 9, 5]

export function abilityBudget(order: AbilityBlock[], block: AbilityBlock): number {
    return ABILITY_POINTS[order.indexOf(block)] ?? 0
}

export function moveAbility(order: AbilityBlock[], index: number, direction: -1 | 1): AbilityBlock[] {
    const targetIndex = index + direction
    if (index < 0 || index >= order.length || targetIndex < 0 || targetIndex >= order.length) {
        return order
    }

    // React reçoit une nouvelle copie ; le tableau du state reste intact.
    const nextOrder = [...order]
    const movingBlock = nextOrder[index]
    nextOrder[index] = nextOrder[targetIndex]
    nextOrder[targetIndex] = movingBlock
    return nextOrder
}

export const ABILITY_BLOCKS: Record<AbilityBlock, { title: string; description: string }> = {
    talents: {
        title: 'Aptitudes spontanées',
        description: 'Vos aptitudes spontanées regroupent les compétences que vous mobilisez naturellement dans l’action et les relations avec votre environnement. Elles peuvent être développées par l’expérience et la pratique, mais reposent avant tout sur des réflexes, des dispositions personnelles et des habitudes acquises au contact du réel.',
    },
    skills: {
        title: 'Compétences opérationnelles',
        description: 'Vos compétences opérationnelles correspondent aux savoir-faire acquis par l’apprentissage, l’entraînement ou la pratique encadrée. Elles concernent des activités qui nécessitent généralement d’avoir appris une méthode, utilisé des outils ou reçu une formation avant de pouvoir être réalisées efficacement.',
    },
    knowledges: {
        title: 'Connaissances spécialisées',
        description: 'Vos connaissances spécialisées correspondent aux domaines dans lesquels vous avez acquis un savoir structuré par les études, la formation, la recherche personnelle ou une expérience intellectuelle approfondie. Elles reflètent ce que vous connaissez et comprenez, davantage que ce que vous savez exécuter directement.',
    },
}
