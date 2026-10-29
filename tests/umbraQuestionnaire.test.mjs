import test from 'node:test'
import assert from 'node:assert/strict'
import { UMBRA_QUESTIONS, createUmbraDraft, chooseUmbraAnswer, canContinueUmbra, visitUmbraQuestion, completeUmbra, validUmbraDraft } from '../src/umbraQuestionnaire.ts'
import { readAnswer, writeAnswer } from '../src/questionnaireStorage.ts'
import { toCloudPayload, restoreCloudPayload } from '../src/cloudQuestionnaire.ts'
import { createBackgroundDraft, selectBackgroundLevel } from '../src/backgrounds.ts'

const enter = () => ({ ...createUmbraDraft(), introSeen: true })

test('les quatre situations commencent sans réponse et exigent un choix explicite', () => {
    const initial = createUmbraDraft()
    assert.equal(UMBRA_QUESTIONS.length, 4)
    assert.equal(canContinueUmbra(initial), false)
    assert.strictEqual(chooseUmbraAnswer(initial, 'A'), initial)
    const started = enter()
    assert.strictEqual(visitUmbraQuestion(started, 1), started)
    assert.strictEqual(completeUmbra(started), started)
    const chosen = chooseUmbraAnswer(started, 'B')
    assert.equal(canContinueUmbra(chosen), true)
    assert.equal(chosen.questionIndex, 0)
    assert.equal(started.answers.q1, '')
    assert.strictEqual(visitUmbraQuestion(chosen, 3), chosen)
})

test('le parcours atteint le quatrième palier puis se termine sans calcul d’affinité', () => {
    let draft = enter()
    for (let index = 0; index < 4; index++) {
        assert.equal(draft.questionIndex, index)
        draft = chooseUmbraAnswer(draft, ['A', 'C', 'B', 'D'][index])
        if (index < 3) draft = visitUmbraQuestion(draft, index + 1)
    }
    assert.equal(draft.completed, false)
    draft = completeUmbra(draft)
    assert.equal(draft.completed, true)
    assert.equal(validUmbraDraft(draft), true)
    assert.deepEqual(draft.answers, { q1: 'A', q2: 'C', q3: 'B', q4: 'D' })
    assert.equal('tribeAffinity' in draft, false)
    assert.equal('selectedTribe' in draft, false)
})

test('le retour et la correction conservent les autres réponses', () => {
    let draft = enter()
    for (let index = 0; index < 4; index++) {
        draft = chooseUmbraAnswer(draft, 'A')
        if (index < 3) draft = visitUmbraQuestion(draft, index + 1)
    }
    const completed = completeUmbra(draft)
    draft = visitUmbraQuestion(completed, 1)
    draft = chooseUmbraAnswer(draft, 'C')
    assert.deepEqual(draft.answers, { q1: 'A', q2: 'C', q3: 'A', q4: 'A' })
    assert.equal(draft.completed, false)
    assert.equal(completed.answers.q2, 'A')
    for (const index of [-1, 4, 2.5]) assert.strictEqual(visitUmbraQuestion(draft, index), draft)
    assert.strictEqual(chooseUmbraAnswer(draft, 'Z'), draft)
})

test('le rechargement reprend la situation courante sans effacer le dossier médical', () => {
    const rows = new Map()
    const storage = { getItem: key => rows.get(key) ?? null, setItem: (key, value) => rows.set(key, value) }
    writeAnswer(storage, 'dossier', 'profession', 'Archiviste')
    let draft = chooseUmbraAnswer(enter(), 'C')
    draft = visitUmbraQuestion(draft, 1)
    draft = chooseUmbraAnswer(draft, 'B')
    writeAnswer(storage, 'dossier', 'umbraDraft', draft)
    writeAnswer(storage, 'dossier', 'phase', 'umbra')
    assert.deepEqual(readAnswer(storage, 'dossier', 'umbraDraft', createUmbraDraft()), draft)
    assert.equal(readAnswer(storage, 'dossier', 'phase', 'job'), 'umbra')
    assert.equal(readAnswer(storage, 'dossier', 'profession', ''), 'Archiviste')
})

test('un brouillon umbral incompatible est isolé des réponses médicales valides', () => {
    const fallback = createUmbraDraft()
    for (const invalid of [
        { ...enter(), version: 2 }, { ...enter(), questionIndex: 4 },
        { ...enter(), questionIndex: 2 }, { ...enter(), completed: true },
        { ...enter(), answers: { q1: 'Z', q2: '', q3: '', q4: '' } },
    ]) {
        assert.equal(validUmbraDraft(invalid), false)
        const storage = { getItem: () => JSON.stringify({ profession: 'Archiviste', umbraDraft: invalid }) }
        assert.strictEqual(readAnswer(storage, 'dossier', 'umbraDraft', fallback), fallback)
        assert.equal(readAnswer(storage, 'dossier', 'profession', ''), 'Archiviste')
    }
})

test('la sauvegarde connectée conserve le brouillon umbral et une seule contribution Totem', () => {
    const umbraDraft = chooseUmbraAnswer(enter(), 'D')
    const backgroundDraft = selectBackgroundLevel(createBackgroundDraft(), 'totemContribution', 5)
    const payload = toCloudPayload({ phase: 'umbra', profession: 'Archiviste', backgroundDraft, umbraDraft })
    assert.deepEqual(payload.p_answers.umbraDraft, umbraDraft)
    assert.equal(payload.p_contribution, 5)
    assert.equal(payload.p_answers.backgroundDraft.values.totemContribution, undefined)
    const restored = restoreCloudPayload(payload.p_answers, 5)
    assert.deepEqual(restored.umbraDraft, umbraDraft)
    assert.equal(restored.profession, 'Archiviste')
    assert.equal(restored.backgroundDraft.values.totemContribution, 5)
})
