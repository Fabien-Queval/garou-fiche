import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { UMBRA_QUESTIONS, createUmbraDraft, chooseUmbraAnswer, canContinueUmbra, visitUmbraQuestion, completeUmbra, validUmbraDraft, getUmbraAffinity } from '../src/umbraQuestionnaire.ts'
import { readAnswer, writeAnswer } from '../src/questionnaireStorage.ts'
import { toCloudPayload, restoreCloudPayload } from '../src/cloudQuestionnaire.ts'
import { createBackgroundDraft, selectBackgroundLevel } from '../src/backgrounds.ts'

const enter = () => ({ ...createUmbraDraft(), introSeen: true })
const keys = ['CAPD', 'ADCP', 'PCDA', 'CPDA', 'PDAC', 'DCAP', 'CAPD', 'PCDA', 'APDC', 'CDPA', 'DPAC', 'PCAD', 'ACDP', 'CADP', 'DPAC', 'CDPA']
const fill = choose => {
    let draft = enter()
    for (let index = 0; index < UMBRA_QUESTIONS.length; index++) {
        draft = chooseUmbraAnswer(draft, choose(UMBRA_QUESTIONS[index], index))
        if (index < UMBRA_QUESTIONS.length - 1) draft = visitUmbraQuestion(draft, index + 1)
    }
    return completeUmbra(draft)
}
const memoryStorage = () => {
    const rows = new Map()
    return { getItem: key => rows.get(key) ?? null, setItem: (key, value) => rows.set(key, value) }
}

test('les 16 questions, citations et 64 réponses correspondent exactement à la source éditoriale', () => {
    const source = readFileSync(new URL('../docs/tribes/QUESTIONNAIRE_SOURCE.md', import.meta.url), 'utf8').replace(/\r\n/g, '\n')
    const sections = source.split('# Clé technique')[0].split(/^# Q\d{2}\s*$/m).slice(1)
    assert.equal(UMBRA_QUESTIONS.length, 16)
    assert.equal(sections.length, 16)
    for (const [index, question] of UMBRA_QUESTIONS.entries()) {
        const section = sections[index]
        const intro = section.split(/^### [1-4] — [PADC]\s*$/m)[0].trim().split('\n').filter(Boolean)
        assert.equal(question.id, `q${String(index + 1).padStart(2, '0')}`)
        assert.equal(question.quote, intro.shift().slice(3))
        assert.equal(question.attribution, intro.shift().replace(/^\*— |\*$/g, ''))
        if (question.title) assert.equal(`### ${question.title}`, intro.shift())
        if (question.note) assert.equal(`*${question.note}*`, intro.shift())
        assert.deepEqual([...question.situation], intro)
        const answerTexts = [...section.matchAll(/^### ([1-4]) — ([PADC])\s*\n([\s\S]*?)(?=^### [1-4] — |\n---|$(?![\s\S]))/gm)]
        assert.equal(answerTexts.length, 4)
        assert.equal(question.answers.map(answer => answer.axis).join(''), keys[index])
        for (const [optionIndex, answer] of question.answers.entries()) {
            const [, id, axis, text] = answerTexts[optionIndex]
            assert.deepEqual(answer, { id, axis, text: text.trim() })
        }
    }
})

test('chaque situation exige un choix explicite ; les sauts et conclusions précoces sont refusés', () => {
    const initial = createUmbraDraft()
    assert.equal(canContinueUmbra(initial), false)
    assert.strictEqual(chooseUmbraAnswer(initial, '1'), initial)
    const started = enter()
    assert.strictEqual(visitUmbraQuestion(started, 1), started)
    assert.strictEqual(completeUmbra(started), started)
    const chosen = chooseUmbraAnswer(started, '2')
    assert.equal(canContinueUmbra(chosen), true)
    assert.equal(chosen.questionIndex, 0)
    assert.equal(started.answers.q01, '')
    assert.strictEqual(visitUmbraQuestion(chosen, 15), chosen)
    for (const answer of ['A', 'C', '0', '5', 'Z']) assert.strictEqual(chooseUmbraAnswer(started, answer), started)
})

test('la clé des 64 réponses donne exactement un point au bon axe', () => {
    for (const [index, question] of UMBRA_QUESTIONS.entries()) {
        for (const [optionIndex, answer] of question.answers.entries()) {
            const draft = { ...enter(), questionIndex: index }
            const result = getUmbraAffinity(chooseUmbraAnswer(draft, answer.id))
            const expected = { P: 0, A: 0, D: 0, C: 0 }
            expected[keys[index][optionIndex]] = 1
            assert.deepEqual(result.scores, expected)
            assert.equal(result.responses[index].answerId, answer.id)
            assert.equal(result.sequence[index], answer.axis)
        }
    }
})

test('les profils dominants et les égalités totalisent 16 points sans assignation tribale', () => {
    for (const axis of ['P', 'A', 'D', 'C']) {
        const draft = fill(question => question.answers.find(answer => answer.axis === axis).id)
        assert.equal(validUmbraDraft(draft), true)
        const result = getUmbraAffinity(draft)
        assert.equal(result.scores[axis], 16)
        assert.equal(Object.values(result.scores).reduce((a, b) => a + b), 16)
        assert.equal(result.sequence, axis.repeat(16))
        assert.equal('scores' in draft, false)
        assert.equal('selectedTribe' in draft, false)
    }
    const balanced = fill((question, index) => question.answers.find(answer => answer.axis === 'PADC'[index % 4]).id)
    assert.deepEqual(getUmbraAffinity(balanced).scores, { P: 4, A: 4, D: 4, C: 4 })
    assert.equal(getUmbraAffinity(balanced).history, 'W20|PADCPADCPADCPADC|P4-A4-D4-C4')
})

test('le retour et la correction recalculent le score sans double comptage ni mutation', () => {
    const completed = fill(question => question.answers.find(answer => answer.axis === 'P').id)
    const prior = JSON.stringify(completed)
    const revisited = visitUmbraQuestion(completed, 1)
    const changed = chooseUmbraAnswer(revisited, '1') // Q02 : A
    assert.deepEqual(getUmbraAffinity(changed).scores, { P: 15, A: 1, D: 0, C: 0 })
    assert.deepEqual(getUmbraAffinity(chooseUmbraAnswer(changed, '1')), getUmbraAffinity(changed))
    assert.equal(changed.completed, false)
    assert.equal(JSON.stringify(completed), prior)
    for (const index of [-1, 16, 2.5]) assert.strictEqual(visitUmbraQuestion(changed, index), changed)
})

test('le rechargement reprend Q11 et Q16 avec leurs choix, scores et dossier médical intacts', () => {
    const storage = memoryStorage()
    writeAnswer(storage, 'dossier', 'profession', 'Archiviste')
    writeAnswer(storage, 'dossier', 'physicalScores', { strength: 4, dexterity: 2, stamina: 3 })
    const all = fill(() => '1')
    for (const index of [10, 15]) {
        const draft = visitUmbraQuestion(all, index)
        writeAnswer(storage, 'dossier', 'umbraDraft', draft)
        writeAnswer(storage, 'dossier', 'phase', 'umbra')
        const restored = readAnswer(storage, 'dossier', 'umbraDraft', createUmbraDraft())
        assert.deepEqual(restored, draft)
        assert.deepEqual(getUmbraAffinity(restored), getUmbraAffinity(draft))
        assert.equal(readAnswer(storage, 'dossier', 'phase', 'job'), 'umbra')
        assert.equal(readAnswer(storage, 'dossier', 'profession', ''), 'Archiviste')
        assert.deepEqual(readAnswer(storage, 'dossier', 'physicalScores', { strength: 1, dexterity: 1, stamina: 1 }), { strength: 4, dexterity: 2, stamina: 3 })
    }
    assert.equal(readAnswer({getItem: () => '{"abilityIndex":10}'}, 'dossier', 'abilityIndex', 0), 0)
})

test('reprendre Q11 sans réponse conserve précisément Q01 à Q10 et leur score partiel', () => {
    let draft = enter()
    for (let index = 0; index < 10; index++) draft = visitUmbraQuestion(chooseUmbraAnswer(draft, '1'), index + 1)
    const storage = memoryStorage()
    writeAnswer(storage, 'dossier', 'umbraDraft', draft)
    const restored = readAnswer(storage, 'dossier', 'umbraDraft', createUmbraDraft())
    assert.equal(restored.questionIndex, 10)
    assert.equal(restored.answers.q11, '')
    assert.equal(canContinueUmbra(restored), false)
    assert.equal(getUmbraAffinity(restored).sequence, keys.slice(0, 10).map(key => key[0]).join('') + '------')
    assert.equal(Object.values(getUmbraAffinity(restored).scores).reduce((a, b) => a + b), 10)
})

test('la démo version 1 et les brouillons invalides sont isolés du dossier valide', () => {
    const fallback = createUmbraDraft()
    for (const invalid of [
        { version: 1, introSeen: true, questionIndex: 3, answers: {q1: 'A', q2: 'B', q3: 'C', q4: 'D'}, completed: true },
        { ...enter(), version: 3 }, { ...enter(), questionIndex: 16 },
        { ...enter(), questionIndex: 10 }, { ...enter(), completed: true },
        { ...enter(), answers: { ...enter().answers, q01: 'Z' } },
        { ...enter(), answers: [] }, { ...enter(), answers: { ...enter().answers, unexpected: '1' } },
        { ...createUmbraDraft(), answers: { ...enter().answers, q01: '1' } },
    ]) {
        assert.equal(validUmbraDraft(invalid), false)
        const storage = { getItem: () => JSON.stringify({ profession: 'Archiviste', umbraDraft: invalid }) }
        assert.strictEqual(readAnswer(storage, 'dossier', 'umbraDraft', fallback), fallback)
        assert.equal(readAnswer(storage, 'dossier', 'profession', ''), 'Archiviste')
    }
})

test('la sauvegarde connectée conserve les 16 choix et une seule contribution Totem', () => {
    const umbraDraft = fill(() => '1')
    const backgroundDraft = selectBackgroundLevel(createBackgroundDraft(), 'totemContribution', 5)
    const payload = toCloudPayload({ phase: 'umbra', profession: 'Archiviste', backgroundDraft, umbraDraft })
    assert.deepEqual(payload.p_answers.umbraDraft, umbraDraft)
    assert.equal(payload.p_contribution, 5)
    assert.equal(payload.p_answers.backgroundDraft.values.totemContribution, undefined)
    const restored = restoreCloudPayload(JSON.parse(JSON.stringify(payload.p_answers)), 5)
    assert.deepEqual(restored.umbraDraft, umbraDraft)
    assert.deepEqual(getUmbraAffinity(restored.umbraDraft), getUmbraAffinity(umbraDraft))
    assert.equal(restored.profession, 'Archiviste')
    assert.equal(restored.backgroundDraft.values.totemContribution, 5)
})
