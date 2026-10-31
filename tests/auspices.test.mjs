import test from 'node:test'
import assert from 'node:assert/strict'
import { AUSPICES, enterAuspices, browseAuspice, confirmAuspiceChoice, leaveAuspices, validAuspiceChoice } from '../src/auspices.ts'
import { lunarJourneyReducer, nextAuspice } from '../src/lunarJourney.ts'
import { createUmbraDraft, chooseUmbraAnswer, visitUmbraQuestion, completeUmbra, validUmbraDraft, getUmbraAssessmentResult } from '../src/umbraQuestionnaire.ts'
import { confirmTribeChoice, exploreTribes } from '../src/tribeSelection.ts'
import { readAnswer, writeAnswer } from '../src/questionnaireStorage.ts'
import { toCloudPayload, restoreCloudPayload } from '../src/cloudQuestionnaire.ts'

function completed() {
    let draft = { ...createUmbraDraft(), introSeen: true }
    for (let index = 0; index < 16; index++) {
        draft = chooseUmbraAnswer(draft, '1')
        if (index < 15) draft = visitUmbraQuestion(draft, index + 1)
    }
    return completeUmbra(draft)
}
function ready() { return enterAuspices(confirmTribeChoice(completed(), 'fianna')) }
function storage() {
    const values = new Map()
    return { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) }
}

test('les cinq phases correspondent aux Auspices W20 et restent de simples possibilités à découvrir', () => {
    assert.deepEqual(AUSPICES.map(a => [a.phase, a.id]), [['Nouvelle lune', 'ragabash'], ['Croissant', 'theurge'], ['Demi-lune', 'philodox'], ['Gibbeuse', 'galliard'], ['Pleine lune', 'ahroun']])
    const first = ready()
    assert.equal(first.viewedAuspice, 'ragabash')
    assert.equal(first.auspiceChoice, undefined)
    for (const auspice of AUSPICES) {
        assert.ok(auspice.description && auspice.pack && auspice.tension && auspice.prompt)
        const browsed = browseAuspice(first, auspice.id)
        assert.equal(browsed.auspiceChoice, undefined)
        assert.equal(validUmbraDraft(browsed), true)
        const choice = confirmAuspiceChoice(browsed, auspice.id)
        assert.deepEqual(choice.auspiceChoice, { version: 1, auspiceId: auspice.id, validation: 'unreviewed' })
        assert.equal(validUmbraDraft(choice), true)
        assert.deepEqual(choice.tribeChoice, first.tribeChoice)
        assert.deepEqual(getUmbraAssessmentResult(choice), getUmbraAssessmentResult(first))
    }
})

test('l’accès à Luna exige les seize réponses et une Tribu explicitement choisie', () => {
    for (const draft of [createUmbraDraft(), completed(), { ...ready(), completed: false }, { ...ready(), answers: { ...ready().answers, q16: '' } }, { ...ready(), tribeChoice: { version: 1, tribeId: 'invalid', validation: 'unreviewed' } }]) {
        assert.strictEqual(enterAuspices(draft), draft)
        assert.strictEqual(confirmAuspiceChoice(draft, 'galliard'), draft)
    }
    assert.strictEqual(confirmAuspiceChoice(ready(), 'invalid').auspiceChoice, undefined)
    assert.equal(validAuspiceChoice({ version: 1, auspiceId: 'ahroun', validation: 'approved' }), false)
    assert.equal(validUmbraDraft({ ...ready(), auspiceStage: 'chosen' }), false)
    assert.equal(validUmbraDraft({ ...ready(), viewedAuspice: 'invalid' }), false)
})

test('revenir aux lunes, à la Tribu et aux réponses conserve les deux préférences', () => {
    const selected = confirmAuspiceChoice(ready(), 'galliard')
    const browsing = browseAuspice(selected, 'ahroun')
    assert.deepEqual(browsing.auspiceChoice, selected.auspiceChoice)
    const back = leaveAuspices(browsing)
    assert.equal(back.auspiceStage, undefined)
    assert.equal(enterAuspices(back).viewedAuspice, 'galliard')
    const tribes = exploreTribes(selected)
    assert.equal(validUmbraDraft(tribes), true)
    assert.deepEqual(tribes.auspiceChoice, selected.auspiceChoice)
    const edited = chooseUmbraAnswer(visitUmbraQuestion(selected, 8), '4')
    assert.equal(validUmbraDraft(edited), true)
    assert.equal(edited.auspiceStage, undefined)
    assert.deepEqual(edited.auspiceChoice, selected.auspiceChoice)
    assert.deepEqual(edited.tribeChoice, selected.tribeChoice)
    assert.equal(confirmAuspiceChoice(browsing, 'ahroun').auspiceChoice.auspiceId, 'ahroun')
    assert.equal(selected.auspiceChoice.auspiceId, 'galliard')
})

test('recharger l’exploration et le choix conserve le dossier et le transport existant', () => {
    const port = storage()
    writeAnswer(port, 'dossier', 'profession', 'Archiviste')
    writeAnswer(port, 'dossier', 'backgroundDraft', { values: { resources: 5 } })
    for (const draft of [browseAuspice(ready(), 'theurge'), confirmAuspiceChoice(ready(), 'philodox')]) {
        writeAnswer(port, 'dossier', 'umbraDraft', draft)
        assert.deepEqual(readAnswer(port, 'dossier', 'umbraDraft', createUmbraDraft()), draft)
        const bag = JSON.parse(port.getItem('dossier'))
        const result = restoreCloudPayload(toCloudPayload(bag).p_answers, 0)
        assert.deepEqual(result.umbraDraft, draft)
        assert.equal(result.profession, 'Archiviste')
        assert.equal(result.backgroundDraft.values.resources, 5)
    }
})

test('des métadonnées lunaires corrompues ne font perdre ni Tribu ni réponses', () => {
    const port = storage()
    const old = confirmTribeChoice(completed(), 'fianna')
    assert.equal(validUmbraDraft(old), true)
    port.setItem('dossier', JSON.stringify({ umbraDraft: { ...old, auspiceStage: 'chosen', viewedAuspice: 'wrong', auspiceChoice: { version: 1, auspiceId: 'wrong', validation: 'approved' } } }))
    assert.deepEqual(readAnswer(port, 'dossier', 'umbraDraft', createUmbraDraft()), old)
})

test('le ciel boucle dans les deux sens et les clics répétés ne sautent aucune lune', () => {
    assert.equal(nextAuspice('ragabash', -1), 'ahroun')
    assert.equal(nextAuspice('ahroun', 1), 'ragabash')
    let state = { current: 'ragabash', passage: null }
    for (const to of ['theurge', 'philodox', 'galliard', 'ahroun', 'ragabash']) {
        const before = state
        state = lunarJourneyReducer(state, { type: 'navigate', to, direction: 1, animate: true })
        assert.equal(state.current, before.current)
        assert.equal(state.passage.to, to)
        assert.strictEqual(lunarJourneyReducer(state, { type: 'navigate', to: nextAuspice(to, 1), direction: 1, animate: true }), state)
        state = lunarJourneyReducer(state, { type: 'settle' })
        assert.deepEqual(state, { current: to, passage: null })
    }
})

test('pause, mouvement réduit et sortie d’onglet permettent une arrivée immédiate', () => {
    const state = { current: 'galliard', passage: null }
    assert.deepEqual(lunarJourneyReducer(state, { type: 'navigate', to: 'ahroun', direction: 1, animate: false }), { current: 'ahroun', passage: null })
    const crossing = lunarJourneyReducer(state, { type: 'navigate', to: 'philodox', direction: -1, animate: true })
    assert.deepEqual(lunarJourneyReducer(crossing, { type: 'settle' }), { current: 'philodox', passage: null })
    assert.strictEqual(lunarJourneyReducer(state, { type: 'navigate', to: 'invalid', direction: 1, animate: true }), state)
    assert.strictEqual(lunarJourneyReducer(state, { type: 'navigate', to: 'galliard', direction: 1, animate: true }), state)
})
