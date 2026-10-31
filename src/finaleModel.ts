import type { UmbraDraft } from './umbraQuestionnaire'
import { validUmbraDraft } from './umbraQuestionnaire.ts'
import { validAuspiceChoice } from './auspices.ts'
import { validTribeChoice } from './tribeSelection.ts'
import { APOCALYPSE_RESERVED, PERSONAL_TERMINAL } from './terminalLexicon.ts'
import type { AuspiceId } from './auspices'

import { FINALE_STAGES } from './finaleState.ts'
import type { FinaleDraft, FinaleStage } from './finaleState'
export { createFinaleDraft, validFinaleDraft } from './finaleState.ts'
export type { FinaleDraft, FinaleStage } from './finaleState'

export function canBeginFinale(draft: UmbraDraft) {
    return validUmbraDraft(draft) && draft.completed && validTribeChoice(draft.tribeChoice) && validAuspiceChoice(draft.auspiceChoice)
}
export function beginFinale(current: FinaleDraft, umbra: UmbraDraft): FinaleDraft {
    if (!canBeginFinale(umbra)) return current
    return current.stage === 'ready' ? { ...current, stage: 'saturation' } : current
}
export function nextFinaleStage(current: FinaleDraft): FinaleDraft {
    const index = FINALE_STAGES.indexOf(current.stage)
    if (index < 1 || index >= FINALE_STAGES.length - 1) return current
    return { ...current, stage: FINALE_STAGES[index + 1] }
}
export const SATURATION_FRAGMENTS = [...APOCALYPSE_RESERVED, 'RDI', 'PDE', 'CONSENSUS BREACH', 'TARGET IDENTIFICATION', 'SECURE', 'STABILIZE', 'CONTAIN', 'DENY']
export const SATURATION_BATCH = Math.ceil(SATURATION_FRAGMENTS.length / 55)
export const APPEAL_TEXT = 'J’ai besoin de toi.\nEnfant de Luna…\nJe meurs.'
export const INTERVIEW_NOTICE = 'Ce dossier sera à imprimer et présenter au responsable de la séance du 08 Novembre 2026 à 14h00 pour finaliser votre entretien. Merci d’avoir pris le temps de répondre à cette enquête.'
export const PRINT_NOTICE = 'Si vous n’êtes pas en mesure de l’imprimer, merci de prévenir le conducteur de votre entretien à l’avance.'
export const closingMessage = (name: string) => `Je sais qui tu es maintenant ${name.trim() || 'toi'}.\nDossier validé.\nÀ dimanche prochain…`

export function diagnosticLines(auspice: AuspiceId) {
    // Ces lignes sont du recit : aucune commande n'est executee.
    return [
        'WHO?', 'WHO SPOKE?', 'WHO IS « JE »?', 'WHO IS DYING?', 'NO PROCESS OWNS MESSAGE',
        'SOURCE OUTSIDE MODEL', 'TARGET IDENTIFICATION FAILED', 'PDE MATCH // 0 %', 'SECURE // FAILED', 'CONTAIN // FAILED',
        'RESOLVE SUBJECT', 'resolve("I")', 'interface Speaker', 'SOURCE.TYPE = WORLD', 'SOURCE.TYPE = ???', 'class Gaia extends ???', 'Gaia instanceof World // TRUE?', 'REFERENCE AMBIGUOUS',
        'OBJECT CONTAINS CALLER', 'SOURCE == ENVIRONMENT', 'OBJECT BOUNDARY NOT FOUND', 'THE MODEL CANNOT REPRESENT THE SOURCE',
        'TARGET ≠ SYSTEM', 'TARGET = USER', 'GAROU // RECOGNIZED', 'AUSPICE // RESOLVED',
        ...PERSONAL_TERMINAL[auspice].slice(0, 3),
        'SOURCE IDENTIFIED', 'SOURCE IDENTIFICATION FAILED', 'THE OBSERVER IS PART OF THE INCIDENT', 'PROTECTOR // REQUIRED',
    ]
}
export function stageDuration(stage: FinaleStage, auspice: AuspiceId) {
    if (stage === 'saturation') return Math.ceil(SATURATION_FRAGMENTS.length / SATURATION_BATCH) * 180 + 3800
    if (stage === 'silence') return 2800
    if (stage === 'appeal') return 8500
    if (stage === 'diagnostic') return diagnosticLines(auspice).length * 780
    if (stage === 'rupture') return 2200
    return 0
}
export const saturationCount = (elapsed: number) => Math.min(SATURATION_FRAGMENTS.length, SATURATION_BATCH + Math.floor(Math.max(0, elapsed) / 180) * SATURATION_BATCH)
export function closingFrame(name: string, elapsed: number) {
    const target = closingMessage(name)
    if (elapsed >= 13000) return { phase: 'revealed', text: target }
    const original = `${INTERVIEW_NOTICE}\n${PRINT_NOTICE}`
    const progress = Math.max(0, Math.min(1, (elapsed - 7500) / 5500))
    const glyphs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ░▒▓01<>/{}?'
    const text = Array.from({ length: Math.max(original.length, target.length) }, (_, index) => {
        const threshold = ((index * 73 + 19) % 101) / 101
        if (progress > threshold) return target[index] ?? ' '
        if (elapsed < 7500 && (index + Math.floor(elapsed / 180)) % 5 > 1) return original[index] ?? ' '
        return glyphs[(index * 17 + Math.floor(elapsed / 90)) % glyphs.length]
    }).join('')
    return { phase: elapsed < 7500 ? 'storm' : 'erasure', text }
}
