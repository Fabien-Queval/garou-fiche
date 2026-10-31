import { createContext, useContext, useEffect, useState } from 'react'
import { BACKGROUNDS, allocatedBackgroundPoints, canCompleteBackgrounds } from './backgrounds.ts'
import type { BackgroundDraft } from './backgrounds'
import { getUmbraAssessmentResult, validUmbraDraft } from './umbraQuestionnaire.ts'

type StoragePort = Pick<Storage, 'getItem' | 'setItem'>
const screen = import.meta.env?.DEV && typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('screen') : null
export const QUESTIONNAIRE_KEY = `garou-questionnaire-v1${screen ? `-preview-${screen}` : ''}`
export const QuestionnaireStorageContext = createContext(QUESTIONNAIRE_KEY)

function compatible(value: unknown, example: unknown): boolean {
    if (typeof value !== typeof example || value === null || example === null) return false
    if (typeof example === 'number') return Number.isInteger(value) && Number(value) >= 0 && Number(value) <= 5
    if (Array.isArray(example)) return Array.isArray(value) && (example.length === 0 ? value.every(item => typeof item === 'string') : value.length === example.length && new Set(value).size === value.length && value.every(item => example.includes(item)))
    if (typeof example === 'object') return !Array.isArray(value) && Object.entries(example).every(([key, item]) => compatible((value as Record<string, unknown>)[key], item))
    return true
}

export function readAnswer<T>(storage: StoragePort, key: string, field: string, fallback: T): T {
    try {
        const value = JSON.parse(storage.getItem(key) ?? '{}')[field]
        // Ce brouillon versionné valide lui-même ses 16 questions, au-delà des niveaux 0–5.
        if (field === 'umbraDraft') {
            if (validUmbraDraft(value)) return value as T
            if (value && typeof value === 'object' && !Array.isArray(value)) {
                const recovered = { ...value }
                delete recovered.auspiceChoice
                delete recovered.auspiceStage
                delete recovered.viewedAuspice
                if (validUmbraDraft(recovered)) return recovered as T
                delete recovered.tribeChoice
                delete recovered.tribalStage
                if (validUmbraDraft(recovered)) return recovered as T
            }
            return fallback
        }
        if (!compatible(value, fallback)) return fallback
        if (['abilityIndex', 'evaluationIndex'].includes(field) && value > 2) return fallback
        if (field === 'phase' && !['job', 'scramble', 'concept', 'attributes', 'evaluation', 'abilities', 'abilityEvaluation', 'backgrounds', 'umbra'].includes(value)) return fallback
        if (field === 'backgroundDraft') {
            const draft = value as BackgroundDraft
            if (allocatedBackgroundPoints(draft.values) > 5) return fallback
            if (draft.revealed.some(id => !BACKGROUNDS.some(definition => definition.id === id && definition.presentationMode === 'hybrid'))) return fallback
            if (Object.entries(draft.details).some(([id, rows]) => {
                const definition = BACKGROUNDS.find(definition => definition.id === id)
                return !definition || !Array.isArray(rows) || rows.length > 5 || rows.some(row => row && (typeof row !== 'object' || Object.entries(row).some(([key, text]) => typeof text !== 'string' || !definition.fields.some(field => field.key === key))))
            })) return fallback
            return { ...draft, confirmed: draft.confirmed && canCompleteBackgrounds(draft) } as T
        }
        return value
    } catch { return fallback }
}

export function writeAnswer(storage: StoragePort, key: string, field: string, value: unknown): boolean {
    try {
        let data: Record<string, unknown> = {}
        try {
            const parsed = JSON.parse(storage.getItem(key) ?? '{}')
            if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) data = parsed
        } catch { /* Un brouillon illisible ne bloque pas les nouvelles réponses. */ }
        const next: Record<string, unknown> = { ...data, [field]: value, _updatedAt: Date.now() }
        if (field === 'umbraDraft') {
            // Instantané demandé pour le dossier ; les réponses restent la source de vérité.
            if (validUmbraDraft(value)) next.umbraResult = getUmbraAssessmentResult(value)
            else delete next.umbraResult
        }
        storage.setItem(key, JSON.stringify(next))
        return true
    } catch { return false }
}

export function useQuestionnaireState<T>(field: string, initial: T) {
    const storageKey = useContext(QuestionnaireStorageContext)
    const [value, setValue] = useState<T>(() => {
        try { return readAnswer(window.localStorage, storageKey, field, initial) }
        catch { return initial }
    })
    useEffect(() => {
        let saved = false
        try { saved = writeAnswer(window.localStorage, storageKey, field, value) }
        catch { /* Certains navigateurs désactivent le stockage local. */ }
        if (!saved) window.dispatchEvent(new Event('questionnaire-storage-error'))
        window.dispatchEvent(new CustomEvent('questionnaire-answer-change', { detail: { key: storageKey } }))
    }, [storageKey, field, value])
    return [value, setValue] as const
}
