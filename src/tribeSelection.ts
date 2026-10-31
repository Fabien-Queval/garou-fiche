import type { UmbraDraft } from './umbraQuestionnaire'
import { UMBRA_TRIBES } from './umbraTribes.ts'
import type { TribeId } from './umbraTribes'
import { UMBRA_QUESTIONS } from './umbraQuestions.ts'

export type TribalStage = 'reveal' | 'explore' | 'chosen'
export type TribeChoice = { version: 1; tribeId: TribeId; validation: 'unreviewed' }

export function validTribeChoice(value: unknown): value is TribeChoice {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return false
    const choice = value as Partial<TribeChoice>
    return choice.version === 1 && choice.validation === 'unreviewed' && UMBRA_TRIBES.some(tribe => tribe.id === choice.tribeId)
}

export function exploreTribes(draft: UmbraDraft): UmbraDraft {
    return draft.completed ? { ...draft, tribalStage: 'explore', ...(draft.auspiceStage ? { auspiceStage: undefined } : {}) } : draft
}

export function revealTribes(draft: UmbraDraft): UmbraDraft {
    return draft.completed ? { ...draft, tribalStage: 'reveal', ...(draft.auspiceStage ? { auspiceStage: undefined } : {}) } : draft
}

export function confirmTribeChoice(draft: UmbraDraft, tribeId: TribeId): UmbraDraft {
    if (!draft.completed || !draft.introSeen || draft.questionIndex !== 15 || UMBRA_QUESTIONS.some(question => !question.answers.some(answer => answer.id === draft.answers[question.id])) || !UMBRA_TRIBES.some(tribe => tribe.id === tribeId)) return draft
    // La préférence explicite du joueur n'est ni une affectation par le score, ni un accord MJ.
    return { ...draft, tribalStage: 'chosen', tribeChoice: { version: 1, tribeId, validation: 'unreviewed' }, ...(draft.auspiceStage ? { auspiceStage: undefined } : {}) }
}
