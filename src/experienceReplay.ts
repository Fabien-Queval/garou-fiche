import type { DossierData, DossierSection } from './dossierModel'
import { canCompleteBackgrounds } from './backgrounds.ts'
import { UMBRA_QUESTIONS, validUmbraDraft } from './umbraQuestionnaire.ts'
import { validTribeChoice } from './tribeSelection.ts'
import { validAuspiceChoice } from './auspices.ts'
import { createFinaleDraft } from './finaleState.ts'

export type ReplayPoint = DossierSection | 'finale'
export function canReplayExperience(data: DossierData, point: ReplayPoint): boolean {
    if (!['answers', 'tribe', 'auspice', 'finale'].includes(point)) return true
    if (!canCompleteBackgrounds(data.backgroundDraft) || !validUmbraDraft(data.umbraDraft)) return false
    if (point === 'answers') return true
    if (UMBRA_QUESTIONS.some(question => !data.umbraDraft.answers[question.id])) return false
    if (point === 'tribe') return true
    if (!validTribeChoice(data.umbraDraft.tribeChoice)) return false
    return point !== 'finale' || validAuspiceChoice(data.umbraDraft.auspiceChoice)
}

/** Une copie temporaire : les réponses et la confirmation du vrai dossier restent intactes. */
export function createExperienceReplay(data: DossierData, point: ReplayPoint) {
    const copy = structuredClone(data)
    const umbra = copy.umbraDraft
    const late = ['tribe', 'auspice', 'finale'].includes(point)
    const draft = {
        ...copy,
        started: true,
        phase: 'job',
        evaluationIndex: 0,
        abilityIndex: 0,
        backgroundDraft: { ...copy.backgroundDraft, revealed: [], confirmed: false },
        // L'introduction est rejouée séparément : les réponses déjà remplies restent valides.
        umbraDraft: { ...umbra, questionIndex: late ? 15 : 0, completed: late, tribalStage: late && point !== 'tribe' ? 'chosen' as const : 'reveal' as const, auspiceStage: point === 'auspice' ? 'explore' as const : point === 'finale' ? 'chosen' as const : undefined, viewedAuspice: umbra.auspiceChoice?.auspiceId ?? umbra.viewedAuspice },
        finaleDraft: { ...createFinaleDraft(), stage: point === 'finale' ? 'saturation' as const : 'ready' as const },
    }
    if (point === 'attributeOrder') draft.phase = 'attributes'
    else if (point === 'physical' || point === 'social' || point === 'mental') { draft.phase = 'evaluation'; draft.evaluationIndex = Math.max(0, copy.attributeOrder.indexOf(point)) }
    else if (point === 'abilityOrder') draft.phase = 'abilities'
    else if (point === 'talents' || point === 'skills' || point === 'knowledges') { draft.phase = 'abilityEvaluation'; draft.abilityIndex = Math.max(0, copy.abilityOrder.indexOf(point)) }
    else if (point === 'backgrounds') draft.phase = 'backgrounds'
    else if (point === 'answers' || point === 'tribe' || point === 'auspice') draft.phase = 'umbra'
    else if (point === 'finale') draft.phase = 'finale'
    return draft
}

export function createReplayStorage(data: DossierData, point: ReplayPoint) {
    const rows = new Map<string, string>([['experience-replay', JSON.stringify(createExperienceReplay(data, point))]])
    return { getItem: (key: string) => rows.get(key) ?? null, setItem: (key: string, value: string) => { rows.set(key, value) } }
}
