export const FINALE_STAGES = ['ready', 'saturation', 'silence', 'appeal', 'diagnostic', 'rupture', 'dossier'] as const
export type FinaleStage = typeof FINALE_STAGES[number]
export type FinaleDraft = { version: 1; stage: FinaleStage; confirmedFingerprint: string; closingSeen: boolean }
export const createFinaleDraft = (): FinaleDraft => ({ version: 1, stage: 'ready', confirmedFingerprint: '', closingSeen: false })
export function validFinaleDraft(value: unknown): value is FinaleDraft {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return false
    const draft = value as Partial<FinaleDraft>
    return draft.version === 1 && FINALE_STAGES.includes(draft.stage as FinaleStage) && typeof draft.confirmedFingerprint === 'string' && typeof draft.closingSeen === 'boolean'
        && (!draft.confirmedFingerprint || draft.stage === 'dossier')
}
