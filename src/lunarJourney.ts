import { AUSPICES, isAuspiceId } from './auspices.ts'
import type { AuspiceId } from './auspices'

export const LUNAR_PASSAGE_MS = 1800
export type LunarJourney = { current: AuspiceId; passage: { from: AuspiceId; to: AuspiceId; direction: 1 | -1 } | null }
type Action = { type: 'navigate'; to: AuspiceId; direction: 1 | -1; animate: boolean } | { type: 'settle' }

export function nextAuspice(current: AuspiceId, direction: 1 | -1): AuspiceId {
    const index = AUSPICES.findIndex(auspice => auspice.id === current)
    return AUSPICES[(index + direction + AUSPICES.length) % AUSPICES.length].id
}

export function lunarJourneyReducer(state: LunarJourney, action: Action): LunarJourney {
    if (action.type === 'settle') return state.passage ? { current: state.passage.to, passage: null } : state
    if (state.passage || !isAuspiceId(action.to) || action.to === state.current) return state
    return action.animate
        ? { current: state.current, passage: { from: state.current, to: action.to, direction: action.direction } }
        : { current: action.to, passage: null }
}
