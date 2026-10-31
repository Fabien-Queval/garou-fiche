import type { AttributeBlock, PhysicalValues, SocialValues, MentalValues } from './attributes'
import { attributeBudget } from './attributes.ts'
import type { AbilityBlock } from './abilities'
import { abilityBudget } from './abilities.ts'
import { TALENTS, canCompleteAbilities } from './talents.ts'
import type { AbilityValues, AbilityDetails } from './talents'
import { SKILLS } from './skills.ts'
import { KNOWLEDGES } from './knowledges.ts'
import { canCompleteBackgrounds } from './backgrounds.ts'
import type { BackgroundDraft } from './backgrounds'
import { UMBRA_QUESTIONS, validUmbraDraft } from './umbraQuestionnaire.ts'
import type { UmbraDraft } from './umbraQuestionnaire'
import { validTribeChoice } from './tribeSelection.ts'
import { validAuspiceChoice } from './auspices.ts'

export type DossierData = {
    playerName: string; profession: string; concept: string
    attributeOrder: AttributeBlock[]; physicalValues: PhysicalValues; socialValues: SocialValues; mentalValues: MentalValues
    abilityOrder: AbilityBlock[]; talentValues: AbilityValues; talentDetails: AbilityDetails; skillValues: AbilityValues; skillDetails: AbilityDetails; knowledgeValues: AbilityValues; knowledgeDetails: AbilityDetails
    backgroundDraft: BackgroundDraft; umbraDraft: UmbraDraft
}
export type DossierSection = 'identity' | 'attributeOrder' | 'physical' | 'social' | 'mental' | 'abilityOrder' | 'talents' | 'skills' | 'knowledges' | 'backgrounds' | 'tribe' | 'auspice' | 'answers'
const permutation = (values: string[], expected: string[]) => values.length === expected.length && new Set(values).size === expected.length && values.every(value => expected.includes(value))
export function dossierIssues(data: DossierData): { section: DossierSection; message: string }[] {
    const issues: { section: DossierSection; message: string }[] = []
    if (![data.playerName, data.profession, data.concept].every(value => value.trim())) issues.push({ section: 'identity', message: 'Complétez votre pseudo, l’emploi et la présentation du personnage.' })
    if (!permutation(data.attributeOrder, ['physical', 'social', 'mental'])) issues.push({ section: 'attributeOrder', message: 'Le classement des capacités doit comporter les trois domaines.' })
    for (const [section, values] of [['physical', data.physicalValues], ['social', data.socialValues], ['mental', data.mentalValues]] as const) {
        const levels = Object.values(values)
        if (levels.length !== 3 || levels.some(value => !Number.isInteger(value) || value < 1 || value > 5) || levels.reduce((sum, level) => sum + level - 1, 0) !== attributeBudget(data.attributeOrder, section)) issues.push({ section, message: `La répartition du domaine ${section === 'physical' ? 'fonctionnel' : section === 'social' ? 'relationnel' : 'cognitif'} reste à terminer.` })
    }
    if (!permutation(data.abilityOrder, ['talents', 'skills', 'knowledges'])) issues.push({ section: 'abilityOrder', message: 'Le classement des compétences doit comporter les trois domaines.' })
    for (const [section, definitions, values, details] of [['talents', TALENTS, data.talentValues, data.talentDetails], ['skills', SKILLS, data.skillValues, data.skillDetails], ['knowledges', KNOWLEDGES, data.knowledgeValues, data.knowledgeDetails]] as const) {
        if (!canCompleteAbilities([...definitions], values, details, abilityBudget(data.abilityOrder, section))) issues.push({ section, message: `Complétez la répartition et les précisions du volet ${section === 'talents' ? 'aptitudes' : section === 'skills' ? 'savoir-faire' : 'connaissances'}.` })
    }
    if (!canCompleteBackgrounds(data.backgroundDraft)) issues.push({ section: 'backgrounds', message: 'Complétez les cinq points d’Historiques et les précisions obligatoires.' })
    if (!validUmbraDraft(data.umbraDraft) || UMBRA_QUESTIONS.some(question => !question.answers.some(answer => answer.id === data.umbraDraft.answers[question.id]))) issues.push({ section: 'answers', message: 'Les seize réponses de la Traversée restent à compléter.' })
    if (!validTribeChoice(data.umbraDraft.tribeChoice)) issues.push({ section: 'tribe', message: 'Confirmez votre préférence de Tribu.' })
    if (!validAuspiceChoice(data.umbraDraft.auspiceChoice)) issues.push({ section: 'auspice', message: 'Confirmez votre Auspice.' })
    return issues
}
function canonical(value: unknown): unknown {
    if (Array.isArray(value)) return value.map(canonical)
    if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).sort(([a], [b]) => a.localeCompare(b)).map(([key, item]) => [key, canonical(item)]))
    return value
}
export function dossierFingerprint(data: DossierData): string {
    const { umbraDraft, backgroundDraft, ...human } = data
    return JSON.stringify(canonical({ ...human, backgrounds: { values: backgroundDraft.values, details: backgroundDraft.details }, answers: umbraDraft.answers, tribe: umbraDraft.tribeChoice?.tribeId, auspice: umbraDraft.auspiceChoice?.auspiceId }))
}
