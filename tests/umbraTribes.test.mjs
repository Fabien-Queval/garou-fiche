import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { UMBRA_TRIBES, TRIBAL_RESONANCE_MATRIX, classifyTribalResonances, getTribalResonance } from '../src/umbraTribes.ts'
import { UMBRA_QUESTIONS, createUmbraDraft, chooseUmbraAnswer, visitUmbraQuestion, completeUmbra, getUmbraAffinity, getUmbraAssessmentResult } from '../src/umbraQuestionnaire.ts'
import { readAnswer, writeAnswer } from '../src/questionnaireStorage.ts'
import { toCloudPayload, restoreCloudPayload } from '../src/cloudQuestionnaire.ts'

const emptyScores = () => Object.fromEntries(UMBRA_TRIBES.map(tribe => [tribe.id, 0]))
const storage = () => {
    const rows = new Map()
    return { getItem: key => rows.get(key) ?? null, setItem: (key, value) => rows.set(key, value) }
}
const fill = answers => {
    let draft = { ...createUmbraDraft(), introSeen: true }
    for (let index = 0; index < 16; index++) {
        draft = chooseUmbraAnswer(draft, answers[UMBRA_QUESTIONS[index].id] ?? '1')
        if (index < 15) draft = visitUmbraQuestion(draft, index + 1)
    }
    return completeUmbra(draft)
}

test('la matrice des 64 réponses correspond aux tableaux et à la constante de la source fournie', () => {
    const source = readFileSync(new URL('../docs/tribes/MATRICE_RESONANCES_SOURCE.md', import.meta.url), 'utf8').replace(/\r\n/g, '\n')
    const compact = source.match(/const TRIBAL_RESONANCE_MATRIX = (\{[\s\S]*?\}) as const;/)[1]
    const expected = JSON.parse(compact.replace(/(\w+):/g, '"$1":').replace(/,\s*([}\]])/g, '$1'))
    assert.deepEqual(TRIBAL_RESONANCE_MATRIX, expected)
    const sections = [...source.matchAll(/^## Q(\d{2}) —[^\n]*\n([\s\S]*?)(?=^## Q|^# Version TypeScript)/gm)]
    assert.equal(sections.length, 16)
    for (const [, number, section] of sections) {
        const question = UMBRA_QUESTIONS.find(question => question.id === `q${number}`)
        const rows = [...section.matchAll(/^\| ([1-4]) — ([PADC]) \| (.+) \|$/gm)]
        assert.equal(rows.length, 4)
        for (const [, answer, axis, cell] of rows) {
            assert.equal(question.answers[Number(answer) - 1].axis, axis)
            const weights = {}
            for (const [, name, weight] of cell.matchAll(/([A-Za-z ]+) `\+([12])`/g)) {
                const tribe = UMBRA_TRIBES.find(tribe => tribe.name === name.trim())
                assert.ok(tribe, name)
                weights[tribe.id] = Number(weight)
            }
            assert.deepEqual(TRIBAL_RESONANCE_MATRIX[question.id][Number(answer) - 1], weights)
            assert.equal(Object.values(weights).filter(weight => weight === 2).length, 1)
            assert.ok(Object.values(weights).filter(weight => weight === 1).length <= 1)
        }
    }
})

test('chacune des treize Tribus possède un maximum théorique atteignable de exactement 12 points', () => {
    const calibration = {
        blackFuries: [4, 4], fianna: [4, 4], redTalons: [4, 4], wendigo: [4, 4],
        boneGnawers: [5, 2], childrenOfGaia: [5, 2], glassWalkers: [6, 0], getOfFenris: [5, 2],
        shadowLords: [6, 0], silverFangs: [5, 2], silentStriders: [5, 2], stargazers: [6, 0], uktena: [5, 2],
    }
    assert.equal(UMBRA_TRIBES.length, 13)
    for (const { id } of UMBRA_TRIBES) {
        const weights = Object.values(TRIBAL_RESONANCE_MATRIX).flat().map(option => option[id] ?? 0)
        assert.deepEqual([weights.filter(weight => weight === 2).length, weights.filter(weight => weight === 1).length], calibration[id])
        const maximum = Object.values(TRIBAL_RESONANCE_MATRIX).reduce((sum, options) => sum + Math.max(...options.map(option => option[id] ?? 0)), 0)
        assert.equal(maximum, 12, id)
        const witness = Object.fromEntries(Object.entries(TRIBAL_RESONANCE_MATRIX).map(([question, options]) => {
            const best = Math.max(...options.map(option => option[id] ?? 0))
            return [question, String(options.findIndex(option => (option[id] ?? 0) === best) + 1)]
        }))
        const result = getTribalResonance(witness)
        assert.equal(result.tribeScores[id], 12, `${id} : une seule réponse par question atteint le plafond`)
        assert.ok(result.majorResonances.includes(id))
        assert.ok(Object.values(result.tribeScores).every(score => score >= 0 && score <= 12))
    }
})

test('chaque réponse attribue exactement ses poids tribaux et rien aux autres Tribus', () => {
    for (const [question, options] of Object.entries(TRIBAL_RESONANCE_MATRIX)) {
        for (let index = 0; index < options.length; index++) {
            assert.deepEqual(getTribalResonance({ [question]: String(index + 1) }).tribeScores, { ...emptyScores(), ...options[index] })
        }
    }
    const empty = getTribalResonance({ q01: '', q02: '2junk', q03: '0', q04: '5', q99: '1' })
    assert.deepEqual(empty.tribeScores, emptyScores())
    assert.deepEqual(empty.majorResonances, [])
    assert.deepEqual(empty.nearResonances, [])
})

test('P/A/D/C et les scores tribaux restent des lectures indépendantes des réponses', () => {
    const original = fill({})
    const changed = fill({ q01: '2', q02: '3' })
    assert.deepEqual(getUmbraAffinity(original).scores, getUmbraAffinity(changed).scores)
    assert.notDeepEqual(getUmbraAssessmentResult(original).tribeScores, getUmbraAssessmentResult(changed).tribeScores)
    const poisoned = { ...original, axisScores: { P: 999, A: 999, D: 999, C: 999 }, tribeScores: { fianna: 999 } }
    assert.deepEqual(getUmbraAssessmentResult(poisoned), getUmbraAssessmentResult(original))
    assert.deepEqual(getUmbraAssessmentResult(original).axisScores, getUmbraAffinity(original).scores)
    assert.equal(Object.values(getUmbraAssessmentResult(original).axisScores).reduce((a, b) => a + b), 16)
})

test('la révélation respecte toutes les égalités, le seuil des proches et le profil diffus', () => {
    assert.deepEqual(classifyTribalResonances({ ...emptyScores(), fianna: 7, silentStriders: 7, uktena: 6, wendigo: 5, glassWalkers: 3 }), {
        majorResonances: ['fianna', 'silentStriders'], nearResonances: ['uktena'],
    })
    assert.deepEqual(classifyTribalResonances({ ...emptyScores(), fianna: 4, silentStriders: 4, uktena: 3 }), {
        majorResonances: ['fianna', 'silentStriders'], nearResonances: [],
    })
    assert.deepEqual(classifyTribalResonances({ ...emptyScores(), fianna: 5, uktena: 4, wendigo: 4 }), {
        majorResonances: ['fianna'], nearResonances: ['uktena', 'wendigo'],
    })
    const fiveTied = { ...emptyScores(), blackFuries: 6, fianna: 6, glassWalkers: 6, stargazers: 6, uktena: 6 }
    assert.equal(classifyTribalResonances(fiveTied).majorResonances.length, 5)
    assert.deepEqual(classifyTribalResonances(Object.fromEntries(Object.entries(fiveTied).reverse())), classifyTribalResonances(fiveTied))
    assert.equal(classifyTribalResonances(Object.fromEntries(UMBRA_TRIBES.map(({ id }) => [id, 5]))).majorResonances.length, 13)
})

test('corriger une réponse et recharger reconstruit les deux scores sans ancien point résiduel', () => {
    const original = fill({})
    const originalResult = getUmbraAssessmentResult(original)
    const corrected = chooseUmbraAnswer(visitUmbraQuestion(original, 7), '4')
    const fresh = fill({ q08: '4' })
    assert.deepEqual(getUmbraAssessmentResult(corrected), getUmbraAssessmentResult(fresh))
    assert.deepEqual(getUmbraAssessmentResult(original), originalResult)
    assert.equal(corrected.completed, false)
    const port = storage()
    writeAnswer(port, 'dossier', 'profession', 'Archiviste')
    writeAnswer(port, 'dossier', 'umbraDraft', corrected)
    const serialized = JSON.parse(port.getItem('dossier'))
    assert.deepEqual(serialized.umbraResult, getUmbraAssessmentResult(corrected))
    serialized.umbraResult = { matrixVersion: 0, axisScores: { P: 999 }, tribeScores: { fianna: 999 }, majorResonances: ['fianna'] }
    port.setItem('dossier', JSON.stringify(serialized))
    const restored = readAnswer(port, 'dossier', 'umbraDraft', createUmbraDraft())
    assert.deepEqual(getUmbraAssessmentResult(restored), getUmbraAssessmentResult(fresh))
    assert.equal(restored.questionIndex, 7)
    assert.equal(readAnswer(port, 'dossier', 'profession', ''), 'Archiviste')
    writeAnswer(port, 'dossier', 'umbraDraft', restored)
    assert.deepEqual(JSON.parse(port.getItem('dossier')).umbraResult, getUmbraAssessmentResult(fresh))
})

test('l’instantané versionné accompagne les réponses dans le transport existant et les anciens brouillons restent valides', () => {
    const draft = fill({})
    const oldPort = { getItem: () => JSON.stringify({ profession: 'Archiviste', umbraDraft: draft }) }
    assert.deepEqual(getUmbraAssessmentResult(readAnswer(oldPort, 'dossier', 'umbraDraft', createUmbraDraft())), getUmbraAssessmentResult(draft))
    const port = storage()
    writeAnswer(port, 'dossier', 'umbraDraft', draft)
    const saved = JSON.parse(port.getItem('dossier'))
    assert.equal(saved.umbraResult.matrixVersion, 1)
    const payload = toCloudPayload(saved)
    const restored = restoreCloudPayload(JSON.parse(JSON.stringify(payload.p_answers)), 0)
    assert.deepEqual(restored.umbraResult, getUmbraAssessmentResult(restored.umbraDraft))
    assert.deepEqual(saved.umbraDraft, draft)
    assert.equal('selectedTribe' in saved.umbraResult, false)
    assert.equal('chosenTribe' in saved.umbraDraft, false)
})
