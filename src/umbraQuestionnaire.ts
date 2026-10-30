import { UMBRA_QUESTIONS } from './umbraQuestions.ts'
import type { AffinityAxis, UmbraAnswer } from './umbraQuestions'

export { UMBRA_QUESTIONS }
export type { UmbraAnswer }
type QuestionId = typeof UMBRA_QUESTIONS[number]['id']
export type UmbraDraft = {
    version: 2
    introSeen: boolean
    questionIndex: number
    answers: Record<QuestionId, UmbraAnswer | ''>
    completed: boolean
}

export function createUmbraDraft(): UmbraDraft {
    const answers = Object.fromEntries(UMBRA_QUESTIONS.map(({ id }) => [id, ''])) as UmbraDraft['answers']
    return { version: 2, introSeen: false, questionIndex: 0, answers, completed: false }
}

export function validUmbraDraft(value: unknown): value is UmbraDraft {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return false
    const draft = value as Partial<UmbraDraft>
    if (draft.version !== 2 || typeof draft.introSeen !== 'boolean' || typeof draft.completed !== 'boolean'
        || !Number.isInteger(draft.questionIndex) || Number(draft.questionIndex) < 0 || Number(draft.questionIndex) >= UMBRA_QUESTIONS.length
        || !draft.answers || typeof draft.answers !== 'object' || Array.isArray(draft.answers)) return false
    const answers = draft.answers
    return Object.keys(answers).length === UMBRA_QUESTIONS.length
        && UMBRA_QUESTIONS.every(question => answers[question.id] === '' || question.answers.some(answer => answer.id === answers[question.id]))
        && (draft.introSeen || UMBRA_QUESTIONS.every(({ id }) => answers[id] === ''))
        && (draft.questionIndex === 0 || (draft.introSeen && UMBRA_QUESTIONS.slice(0, draft.questionIndex).every(({ id }) => Boolean(answers[id]))))
        && (!draft.completed || (draft.introSeen && draft.questionIndex === UMBRA_QUESTIONS.length - 1 && UMBRA_QUESTIONS.every(({ id }) => Boolean(answers[id]))))
}

export function chooseUmbraAnswer(draft: UmbraDraft, answer: UmbraAnswer): UmbraDraft {
    const question = UMBRA_QUESTIONS[draft.questionIndex]
    if (!draft.introSeen || !question.answers.some(option => option.id === answer)) return draft
    return { ...draft, answers: { ...draft.answers, [question.id]: answer }, completed: false }
}

export function canContinueUmbra(draft: UmbraDraft): boolean {
    return draft.introSeen && Boolean(draft.answers[UMBRA_QUESTIONS[draft.questionIndex].id])
}

export function visitUmbraQuestion(draft: UmbraDraft, index: number): UmbraDraft {
    if (!Number.isInteger(index) || index < 0 || index >= UMBRA_QUESTIONS.length) return draft
    if (index > draft.questionIndex && (!draft.introSeen || !UMBRA_QUESTIONS.slice(0, index).every(({ id }) => Boolean(draft.answers[id])))) return draft
    return { ...draft, questionIndex: index, completed: false }
}

export function completeUmbra(draft: UmbraDraft): UmbraDraft {
    if (!draft.introSeen || draft.questionIndex !== UMBRA_QUESTIONS.length - 1 || !UMBRA_QUESTIONS.every(({ id }) => Boolean(draft.answers[id]))) return draft
    return { ...draft, completed: true }
}

// Les réponses sauvegardées suffisent à reconstruire scores et historique sans state redondant.
export function getUmbraAffinity(draft: UmbraDraft) {
    const scores: Record<AffinityAxis, number> = { P: 0, A: 0, D: 0, C: 0 }
    const responses = UMBRA_QUESTIONS.map(question => {
        const answer = question.answers.find(option => option.id === draft.answers[question.id])
        if (answer) scores[answer.axis]++
        return { questionId: question.id, answerId: answer?.id ?? '', axis: answer?.axis ?? '' }
    })
    const sequence = responses.map(response => response.axis || '-').join('')
    return { scores, responses, sequence, history: `W20|${sequence}|P${scores.P}-A${scores.A}-D${scores.D}-C${scores.C}` }
}
