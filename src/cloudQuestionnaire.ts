import type { SupabaseClient } from '@supabase/supabase-js'
import { createBackgroundDraft } from './backgrounds.ts'

export type AnswerBag = Record<string, unknown>
export type DossierContext = { campaignId: string; groupId: string; groupName: string; role: 'player' | 'gm' }
export type CloudDraft = { answers: AnswerBag; updatedAt: number }

export function accountStorageKey(baseKey: string, userId: string): string {
    return `${baseKey}-user-${userId}`
}

export function toCloudPayload(answers: AnswerBag) {
    const { _updatedAt: ignoredTimestamp, ...payload } = answers
    void ignoredTimestamp
    const draft = payload.backgroundDraft as ReturnType<typeof createBackgroundDraft> | undefined
    const contribution = draft?.values?.totemContribution ?? 0
    if (!Number.isInteger(contribution) || contribution < 0 || contribution > 5) throw new Error('La contribution est invalide.')
    if (draft?.values) {
        const { totemContribution: omitted, ...values } = draft.values
        void omitted
        payload.backgroundDraft = { ...draft, values }
    }
    return { p_answers: payload, p_contribution: contribution }
}

export function restoreCloudPayload(answers: AnswerBag, contribution: number): AnswerBag {
    const fallback = createBackgroundDraft()
    const background = answers.backgroundDraft as Partial<typeof fallback> | undefined
    return {
        ...answers,
        backgroundDraft: { ...fallback, ...background, values: { ...fallback.values, ...background?.values, totemContribution: contribution } },
    }
}

export function preferLocalDraft(local: AnswerBag, cloud: CloudDraft | null): boolean {
    return !cloud || (typeof local._updatedAt === 'number' && local._updatedAt > cloud.updatedAt)
}

export function createQuestionnaireRepository(client: SupabaseClient, userId: string) {
    return {
        async load(): Promise<CloudDraft | null> {
            const { data, error } = await client.from('garou_questionnaires')
                .select('answers,totem_contribution,updated_at').eq('owner_id', userId).maybeSingle()
            if (error) throw new Error('Votre dossier distant n’est pas encore disponible.')
            return data ? { answers: restoreCloudPayload(data.answers, data.totem_contribution), updatedAt: Date.parse(data.updated_at) } : null
        },
        async save(answers: AnswerBag, signal?: AbortSignal) {
            let request = client.rpc('garou_save_questionnaire', toCloudPayload(answers))
            if (signal) request = request.abortSignal(signal)
            const { error } = await request
            if (error) throw new Error('Vos réponses restent sur cet appareil. La sauvegarde distante n’a pas abouti.')
        },
        async context(): Promise<DossierContext | null> {
            const { data, error } = await client.rpc('garou_context')
            if (error) throw new Error('Le rattachement de votre dossier est indisponible.')
            return data
        },
        async join(code: string): Promise<DossierContext> {
            const { data, error } = await client.rpc('garou_join_group', { p_code: code.trim() })
            if (error || !data) throw new Error('Cette référence est invalide, expirée ou ne correspond pas à votre dossier.')
            return data
        },
    }
}
