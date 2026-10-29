export const UMBRA_LEAVE_MS = 420
export const UMBRA_ARRIVE_MS = 540

export type UmbraJourney = {
    depth: number
    passage: {
        from: number
        to: number
        direction: 'down' | 'up'
        phase: 'leaving' | 'arriving'
    } | null
}

type JourneyAction =
    | { type: 'navigate'; to: number; animate: boolean }
    | { type: 'cross' }
    | { type: 'arrive' }
    | { type: 'settle' }

export const INITIAL_UMBRA_JOURNEY: UmbraJourney = { depth: 0, passage: null }

export function createUmbraJourneyReducer(depthCount: number) {
    return function journeyReducer(state: UmbraJourney, action: JourneyAction): UmbraJourney {
        if (action.type === 'navigate') {
            if (state.passage || !Number.isInteger(action.to) || action.to < 0 || action.to >= depthCount || action.to === state.depth) return state
            if (!action.animate) return { depth: action.to, passage: null }
            return { depth: state.depth, passage: { from: state.depth, to: action.to, direction: action.to > state.depth ? 'down' : 'up', phase: 'leaving' } }
        }
        if (!state.passage) return state
        if (action.type === 'cross' && state.passage.phase === 'leaving') {
            return { depth: state.passage.to, passage: { ...state.passage, phase: 'arriving' } }
        }
        if (action.type === 'settle' || (action.type === 'arrive' && state.passage.phase === 'arriving')) {
            return { depth: state.passage.to, passage: null }
        }
        return state
    }
}
