export const UMBRA_QUESTIONS = [
    { id: 'q1', title: 'Première situation', text: 'Le texte de la première situation sera ajouté ici.' },
    { id: 'q2', title: 'Deuxième situation', text: 'Le texte de la deuxième situation sera ajouté ici.' },
    { id: 'q3', title: 'Troisième situation', text: 'Le texte de la troisième situation sera ajouté ici.' },
    { id: 'q4', title: 'Quatrième situation', text: 'Le texte de la quatrième situation sera ajouté ici.' },
] as const

export const UMBRA_OPTIONS = ['A', 'B', 'C', 'D'] as const
type QuestionId = typeof UMBRA_QUESTIONS[number]['id']
export type UmbraAnswer = typeof UMBRA_OPTIONS[number]
export type UmbraDraft = {
    version: 1
    introSeen: boolean
    questionIndex: number
    answers: Record<QuestionId, UmbraAnswer | ''>
    completed: boolean
}

export function createUmbraDraft(): UmbraDraft {
    return { version: 1, introSeen: false, questionIndex: 0, answers: { q1: '', q2: '', q3: '', q4: '' }, completed: false }
}

export function validUmbraDraft(value: unknown): value is UmbraDraft {
    if (!value || typeof value !== 'object') return false
    const draft = value as Partial<UmbraDraft>
    return draft.version === 1 && typeof draft.introSeen === 'boolean' && typeof draft.completed === 'boolean'
        && Number.isInteger(draft.questionIndex) && Number(draft.questionIndex) >= 0 && Number(draft.questionIndex) < UMBRA_QUESTIONS.length
        && Boolean(draft.answers) && UMBRA_QUESTIONS.every(({ id }) => draft.answers?.[id] === '' || UMBRA_OPTIONS.includes(draft.answers?.[id] as UmbraAnswer))
        && (draft.questionIndex === 0 || (draft.introSeen === true && UMBRA_QUESTIONS.slice(0, draft.questionIndex).every(({ id }) => Boolean(draft.answers?.[id]))))
        && (!draft.completed || (draft.introSeen === true && UMBRA_QUESTIONS.every(({ id }) => Boolean(draft.answers?.[id]))))
}

export function chooseUmbraAnswer(draft: UmbraDraft, answer: UmbraAnswer): UmbraDraft {
    if (!draft.introSeen || !UMBRA_OPTIONS.includes(answer)) return draft
    const id = UMBRA_QUESTIONS[draft.questionIndex].id
    return { ...draft, answers: { ...draft.answers, [id]: answer }, completed: false }
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
