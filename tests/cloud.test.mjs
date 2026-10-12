import test from 'node:test'
import assert from 'node:assert/strict'
import { createBackgroundDraft, selectBackgroundLevel } from '../src/backgrounds.ts'
import { accountStorageKey, toCloudPayload, restoreCloudPayload, preferLocalDraft } from '../src/cloudQuestionnaire.ts'
import { identificationError } from '../src/authMessages.ts'

test('la sauvegarde distante conserve chaque réponse et une seule contribution Totem', () => {
    const backgroundDraft = selectBackgroundLevel(createBackgroundDraft(), 'totemContribution', 3)
    const answers = { playerName: 'Joueur', concept: 'Une gardienne', talentDetails: { expression: 'Poésie' }, backgroundDraft, _updatedAt: 1000 }
    const payload = toCloudPayload(answers)
    assert.equal(payload.p_contribution, 3)
    assert.equal(payload.p_answers._updatedAt, undefined)
    assert.equal(payload.p_answers.backgroundDraft.values.totemContribution, undefined)
    assert.equal(payload.p_answers.talentDetails.expression, 'Poésie')
    assert.equal(answers.backgroundDraft.values.totemContribution, 3)
    const restored = restoreCloudPayload(payload.p_answers, 3)
    assert.equal(restored.backgroundDraft.values.totemContribution, 3)
    assert.equal(restored.concept, 'Une gardienne')
    assert.throws(() => toCloudPayload({ backgroundDraft: { ...backgroundDraft, values: { ...backgroundDraft.values, totemContribution: 6 } } }), /invalide/)
})

test('les comptes utilisent des brouillons distincts et une réponse locale récente survit à un envoi interrompu', () => {
    assert.notEqual(accountStorageKey('base', 'joueur-a'), accountStorageKey('base', 'joueur-b'))
    assert.equal(preferLocalDraft({ _updatedAt: 2000 }, { answers: {}, updatedAt: 1000 }), true)
    assert.equal(preferLocalDraft({ _updatedAt: 1000 }, { answers: {}, updatedAt: 2000 }), false)
    assert.equal(preferLocalDraft({}, null), true)
})

test('les erreurs de connexion expliquent les limites sans révéler de réponse technique ou de compte existant', () => {
    assert.match(identificationError('email_address_not_authorized'), /configuré/)
    assert.match(identificationError('over_email_send_rate_limit'), /patienter/)
    assert.equal(identificationError('unknown'), identificationError('user_not_found'))
})
