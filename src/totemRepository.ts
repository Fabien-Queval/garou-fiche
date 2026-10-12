import { allocatedBackgroundPoints, BACKGROUNDS } from './backgrounds.ts'
import type { BackgroundDraft } from './backgrounds'

export type TotemSummary = { total: number; ownContribution: number }
export type TotemRepository = {
    getSummary: (signal?: AbortSignal) => Promise<TotemSummary>
    saveBackgrounds: (draft: BackgroundDraft, signal?: AbortSignal) => Promise<void>
}

type Configuration = { url: string; publishableKey: string; campaignId: string; groupId: string; getAccessToken: () => Promise<string> }

// Le contrat RPC renvoie seulement un agrégat, jamais les fiches des autres joueurs.
export function createSupabaseTotemRepository(config: Configuration): TotemRepository {
    async function rpc(name: string, parameters: Record<string, unknown>, signal?: AbortSignal) {
        const token = await config.getAccessToken()
        if (!token || !config.campaignId || !config.groupId) throw new Error('La connexion au groupe est indisponible.')
        const response = await fetch(`${config.url.replace(/\/$/, '')}/rest/v1/rpc/${name}`, {
            method: 'POST', signal,
            headers: { apikey: config.publishableKey, Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ p_campaign_id: config.campaignId, p_group_id: config.groupId, ...parameters }),
        })
        if (!response.ok) throw new Error('Impossible de joindre la meute. Réessayez dans un instant.')
        return response.status === 204 ? null : response.json()
    }
    return {
        async getSummary(signal) {
            const data = await rpc('garou_totem_summary', {}, signal)
            if (!data || !Number.isSafeInteger(data.total) || data.total < 0 || !Number.isInteger(data.ownContribution) || data.ownContribution < 0 || data.ownContribution > 5 || data.total < data.ownContribution) {
                throw new Error('Le total de la meute est indisponible.')
            }
            return { total: data.total, ownContribution: data.ownContribution }
        },
        async saveBackgrounds(draft, signal) {
            if (allocatedBackgroundPoints(draft.values) > 5 || BACKGROUNDS.some(({ id }) => !Number.isInteger(draft.values[id]) || draft.values[id] < 0 || draft.values[id] > 5)) {
                throw new Error('La répartition des points est invalide.')
            }
            const { totemContribution, ...otherValues } = draft.values
            await rpc('garou_save_backgrounds', {
                p_contribution: totemContribution,
                p_backgrounds: { ...draft, values: otherValues },
            }, signal)
        },
    }
}
