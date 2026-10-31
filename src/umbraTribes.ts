// Noms et identifiants de la matrice validée par Fabien.
export const UMBRA_TRIBES = [
    { id: 'blackFuries', name: 'Black Furies' },
    { id: 'boneGnawers', name: 'Bone Gnawers' },
    { id: 'childrenOfGaia', name: 'Children of Gaia' },
    { id: 'fianna', name: 'Fianna' },
    { id: 'getOfFenris', name: 'Get of Fenris' },
    { id: 'glassWalkers', name: 'Glass Walkers' },
    { id: 'redTalons', name: 'Red Talons' },
    { id: 'shadowLords', name: 'Shadow Lords' },
    { id: 'silentStriders', name: 'Silent Striders' },
    { id: 'silverFangs', name: 'Silver Fangs' },
    { id: 'stargazers', name: 'Stargazers' },
    { id: 'uktena', name: 'Uktena' },
    { id: 'wendigo', name: 'Wendigo' },
] as const
export type TribeId = typeof UMBRA_TRIBES[number]['id']
export type TribeScores = Record<TribeId, number>
type TribalWeights = Partial<Record<TribeId, 1 | 2>>
export const TRIBAL_MATRIX_VERSION = 1

// Source intégrale : docs/tribes/MATRICE_RESONANCES_SOURCE.md.
// Les quatre positions correspondent aux identifiants de réponse '1' à '4'.
export const TRIBAL_RESONANCE_MATRIX = {
    q01: [{ stargazers: 2 }, { boneGnawers: 2 }, { fianna: 2, wendigo: 1 }, { shadowLords: 2, redTalons: 1 }],
    q02: [{ childrenOfGaia: 2, boneGnawers: 1 }, { shadowLords: 2, silverFangs: 1 }, { uktena: 2, silentStriders: 1 }, { blackFuries: 2, wendigo: 1 }],
    q03: [{ redTalons: 2, blackFuries: 1 }, { uktena: 2 }, { silverFangs: 2, getOfFenris: 1 }, { glassWalkers: 2 }],
    q04: [{ stargazers: 2 }, { blackFuries: 2 }, { silverFangs: 2 }, { glassWalkers: 2 }],
    q05: [{ wendigo: 2, fianna: 1 }, { silverFangs: 2 }, { glassWalkers: 2 }, { uktena: 2 }],
    q06: [{ shadowLords: 2 }, { silentStriders: 2 }, { boneGnawers: 2, childrenOfGaia: 1 }, { blackFuries: 2, redTalons: 1 }],
    q07: [{ uktena: 2, silentStriders: 1 }, { boneGnawers: 2 }, { blackFuries: 2, childrenOfGaia: 1 }, { shadowLords: 2 }],
    q08: [{ redTalons: 2, fianna: 1 }, { stargazers: 2 }, { getOfFenris: 2, silverFangs: 1 }, { childrenOfGaia: 2 }],
    q09: [{ glassWalkers: 2 }, { fianna: 2, wendigo: 1 }, { silverFangs: 2 }, { silentStriders: 2 }],
    q10: [{ uktena: 2 }, { shadowLords: 2 }, { redTalons: 2 }, { glassWalkers: 2, boneGnawers: 1 }],
    q11: [{ shadowLords: 2 }, { redTalons: 2, blackFuries: 1 }, { boneGnawers: 2 }, { silentStriders: 2, uktena: 1 }],
    q12: [{ wendigo: 2, redTalons: 1 }, { stargazers: 2, uktena: 1 }, { childrenOfGaia: 2 }, { getOfFenris: 2 }],
    q13: [{ childrenOfGaia: 2, blackFuries: 1 }, { silentStriders: 2, fianna: 1 }, { getOfFenris: 2 }, { wendigo: 2, redTalons: 1 }],
    q14: [{ silentStriders: 2 }, { childrenOfGaia: 2 }, { getOfFenris: 2 }, { fianna: 2 }],
    q15: [{ getOfFenris: 2, blackFuries: 1 }, { fianna: 2, wendigo: 1 }, { glassWalkers: 2 }, { stargazers: 2 }],
    q16: [{ stargazers: 2 }, { silverFangs: 2, getOfFenris: 1 }, { wendigo: 2, fianna: 1 }, { boneGnawers: 2 }],
} as const satisfies Record<string, readonly [TribalWeights, TribalWeights, TribalWeights, TribalWeights]>

export function classifyTribalResonances(tribeScores: TribeScores) {
    const highestScore = Math.max(...UMBRA_TRIBES.map(tribe => tribeScores[tribe.id]))
    const majorResonances: TribeId[] = []
    const nearResonances: TribeId[] = []
    // Un brouillon vide n'est pas une révélation à treize voix.
    if (highestScore > 0) {
        for (const { id } of UMBRA_TRIBES) {
            if (tribeScores[id] === highestScore) majorResonances.push(id)
            else if (highestScore >= 5 && tribeScores[id] === highestScore - 1) nearResonances.push(id)
        }
    }
    return { majorResonances, nearResonances }
}

export function getTribalResonance(answers: Readonly<Record<string, string | undefined>>) {
    const tribeScores = Object.fromEntries(UMBRA_TRIBES.map(tribe => [tribe.id, 0])) as TribeScores
    for (const [questionId, options] of Object.entries(TRIBAL_RESONANCE_MATRIX)) {
        const selected = answers[questionId]
        if (!selected || !/^[1-4]$/.test(selected)) continue
        const weights: TribalWeights = options[Number(selected) - 1]
        for (const { id } of UMBRA_TRIBES) tribeScores[id] += weights[id] ?? 0
    }
    return { tribeScores, ...classifyTribalResonances(tribeScores) }
}
