import { corruptText, SCRAMBLE_DURATION } from './scramble.ts'

// Fragments éditoriaux tirés de docs/tribes/LEXIQUE_SOURCE.md.
// Ce sont des intrusions de l'IA, pas l'annonce d'une destination ou d'un événement de campagne.
const FRAGMENTS = [
    ['Luna', 'Meute', 'Argent', 'Esprit', 'Ancêtres', 'Territoire', 'Gnose', 'Tu l’entends aussi ?', 'L’argent se souvient.', 'La forêt te reconnaît.'],
    ['Harano', 'Crinos', 'LE VOILE CRAQUE', 'GNOSIS LEAK', 'PACK INCOMPLETE', 'RAGE IS NOT AN ERROR', 'THE WEB REMEMBERS YOU', 'SOMETHING CROSSED THE GAUNTLET', 'PREDATOR CLASSIFICATION FAILED'],
    ['ANTHELIOS', 'THE EYE IS OPEN', 'Gaia tremble.', 'La Lune saignera.', 'Le ciel noircira.', 'Le Phénix a regardé demain.', 'Les forêts pleurent ensemble.', 'Le dernier cycle a commencé.', 'ELLES NE DOIVENT PAS SE REJOINDRE'],
    ['THE STARS ARE IN THE WRONG PLACES', 'CONSTELLATION UPDATE FAILED', 'MEMBRANE THINNING', 'SOMETHING IS PULLING FROM THE OTHER SIDE', 'THIS STAR HAS NO LIGHT', 'L’ŒIL DU VER S’OUVRE', 'RORG HUNTS', 'SHANTAR IS WEAVING', 'THE MIRRORS OPEN INWARD', 'MEMORY IS THE LAST MAP'],
] as const
const DEEP_FRAGMENTS = ['MALFEAS', 'EREBUS', 'LAST JUNCTION', 'NO BOTTOM DETECTED', 'THE SILVER DOES NOT KILL HERE']

export function umbraIntrusionProfile(questionIndex: number) {
    const index = Number.isFinite(questionIndex) ? Math.max(0, Math.min(15, Math.floor(questionIndex))) : 0
    const progress = index / 15
    const tier = Math.floor(index / 4)
    return {
        tier,
        intensity: 0.18 + progress * 0.82,
        maxFragments: 2 + tier,
        maxFontSize: 12 + progress * 28,
        chromaticOffset: 0.7 + progress * 3.3,
        firstDelayMs: 650 - progress * 350,
        restMs: 3500 - progress * 2400,
        restJitterMs: 3800 - progress * 2100,
        cascadeChance: 0.24 + progress * 0.4,
    }
}
export type IntrusionProfile = ReturnType<typeof umbraIntrusionProfile>
export type SignalRect = { x: number; y: number; width: number; height: number }
export type SignalPlacement = SignalRect & { vertical: boolean; fontSize: number }
export type UmbraLeakPlan = {
    offsetMs: number
    durationMs: number
    scrambleMs: number
    aftershockAtMs: number | null
    aftershockMs: number
    kind: 'echo' | 'fracture' | 'dropout'
}

function randomUnit(random: () => number) {
    return Math.max(0, Math.min(0.999999, random()))
}

export function pickUmbraFragment(profile: IntrusionProfile, previous: readonly string[], random = Math.random): string {
    const pool: string[] = [...FRAGMENTS[profile.tier]]
    // Le lore le plus profond reste rare, et n'entre qu'à partir de Q13.
    if (profile.tier === 3 && randomUnit(random) < 0.16) pool.push(...DEEP_FRAGMENTS)
    const available = pool.filter(fragment => !previous.includes(fragment))
    const candidates = available.length ? available : pool
    return candidates[Math.floor(randomUnit(random) * candidates.length)]
}

export function nextUmbraLeakDelay(profile: IntrusionProfile, first = false, random = Math.random): number {
    return first ? profile.firstDelayMs + randomUnit(random) * 650 : profile.restMs + randomUnit(random) * profile.restJitterMs
}

// Un départ isolé ou une petite cascade. Chaque fuite possède sa propre horloge,
// sa propre durée et, parfois, une rechute brève avant de se résorber.
export function planUmbraLeaks(profile: IntrusionProfile, random = Math.random): UmbraLeakPlan[] {
    const count = randomUnit(random) < profile.cascadeChance ? 2 + Math.floor(randomUnit(random) * (2 + profile.tier)) : 1
    let offsetMs = 0
    return Array.from({ length: count }, (_, index) => {
        if (index) {
            offsetMs += 110 + randomUnit(random) * (680 - profile.intensity * 280)
            if (randomUnit(random) < 0.18) offsetMs += 500 + randomUnit(random) * 600
        }
        const durationMs = 1800 + randomUnit(random) * 2400 + profile.intensity * 400
        const scrambleMs = 180 + randomUnit(random) * 560
        const kind = (['echo', 'fracture', 'dropout'] as const)[Math.floor(randomUnit(random) * 3)]
        return {
            offsetMs,
            durationMs,
            scrambleMs,
            aftershockAtMs: kind === 'echo' ? null : Math.max(scrambleMs + 360, durationMs * 0.58),
            aftershockMs: 120 + randomUnit(random) * 200,
            kind,
        }
    })
}

export function umbraLeakFrame(text: string, elapsed: number, plan: UmbraLeakPlan, intensity: number) {
    const aftershock = plan.aftershockAtMs !== null && elapsed >= plan.aftershockAtMs && elapsed < plan.aftershockAtMs + plan.aftershockMs
    const localTime = aftershock ? (elapsed - plan.aftershockAtMs!) / plan.aftershockMs : elapsed / plan.scrambleMs
    const scrambling = elapsed < plan.scrambleMs || aftershock
    return {
        text: scrambling ? corruptText(text, Math.min(1, Math.max(0, localTime)) * SCRAMBLE_DURATION, 0.35 + intensity * 0.55) : text,
        phase: aftershock ? 'rupture' : elapsed < plan.scrambleMs ? 'leak' : elapsed >= plan.durationMs - 280 ? 'fading' : 'residue',
    }
}

export function signalFitsArea(signal: SignalRect, area: SignalRect): boolean {
    return signal.x >= area.x && signal.y >= area.y && signal.x + signal.width <= area.x + area.width && signal.y + signal.height <= area.y + area.height
}

// Les zones de lecture et de commande sont soustraites du calque décoratif.
// Sur téléphone, les marges restantes accueillent des fragments verticaux.
export function freeSignalAreas(width: number, height: number, protectedRects: readonly SignalRect[]): SignalRect[] {
    let areas: SignalRect[] = [{ x: 0, y: 0, width, height }]
    for (const rect of protectedRects) {
        const blocked = { x: rect.x - 6, y: rect.y - 6, width: rect.width + 12, height: rect.height + 12 }
        areas = areas.flatMap(area => {
            const left = Math.max(area.x, blocked.x)
            const top = Math.max(area.y, blocked.y)
            const right = Math.min(area.x + area.width, blocked.x + blocked.width)
            const bottom = Math.min(area.y + area.height, blocked.y + blocked.height)
            if (right <= left || bottom <= top) return [area]
            return [
                { x: area.x, y: area.y, width: area.width, height: top - area.y },
                { x: area.x, y: bottom, width: area.width, height: area.y + area.height - bottom },
                { x: area.x, y: top, width: left - area.x, height: bottom - top },
                { x: right, y: top, width: area.x + area.width - right, height: bottom - top },
            ].filter(part => part.width >= 12 && part.height >= 24)
        })
    }
    return areas
}

export function placeUmbraFragment(text: string, areas: readonly SignalRect[], profile: IntrusionProfile, random = Math.random): SignalPlacement | null {
    const candidates = areas.flatMap(freeArea => {
        const vertical = freeArea.width < 100
        const area = vertical ? freeArea : { x: freeArea.x + 6, y: freeArea.y + 3, width: freeArea.width - 12, height: freeArea.height - 6 }
        const size = Math.min(profile.maxFontSize * (0.7 + randomUnit(random) * 0.3), vertical ? 11 : 100,
            vertical ? area.width - 2 : area.height / 3.2,
            vertical ? area.height / (text.length * 0.7) : area.width / (Math.max(12, text.length / 2) * 0.7))
        if (size < 9 || (vertical && area.height < 110)) return []
        const width = vertical ? size + 2 : Math.min(area.width, Math.max(100, text.length * size * 0.7))
        const height = vertical ? Math.min(area.height, text.length * size * 0.7 + 8) : size * 3.2
        return [{ ...area, vertical, fontSize: size, signalWidth: width, signalHeight: height }]
    })
    if (!candidates.length) return null
    // Sur grand écran, privilégier les zones capables de porter l'intensité du palier.
    // Les fines marges restent le recours mobile, pas le choix dominant sur ordinateur.
    const largestFont = Math.max(...candidates.map(candidate => candidate.fontSize))
    const readable = candidates.filter(candidate => candidate.fontSize >= largestFont * 0.75)
    const area = readable[Math.floor(randomUnit(random) * readable.length)]
    return {
        x: area.x + randomUnit(random) * (area.width - area.signalWidth),
        y: area.y + randomUnit(random) * (area.height - area.signalHeight),
        width: area.signalWidth,
        height: area.signalHeight,
        fontSize: area.fontSize,
        vertical: area.vertical,
    }
}
