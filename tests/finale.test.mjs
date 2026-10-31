import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { beginFinale, canBeginFinale, createFinaleDraft, nextFinaleStage, validFinaleDraft, diagnosticLines, SATURATION_FRAGMENTS, SATURATION_BATCH, saturationCount, stageDuration, closingFrame, closingMessage, INTERVIEW_NOTICE, PRINT_NOTICE } from '../src/finaleModel.ts'
import { TERMINAL_POOLS, PERSONAL_TERMINAL, APOCALYPSE_RESERVED } from '../src/terminalLexicon.ts'
import { createUmbraDraft, chooseUmbraAnswer, visitUmbraQuestion, completeUmbra } from '../src/umbraQuestionnaire.ts'
import { confirmTribeChoice } from '../src/tribeSelection.ts'
import { confirmAuspiceChoice } from '../src/auspices.ts'
import { dossierFingerprint, dossierIssues } from '../src/dossierModel.ts'
import { selectPhysicalLevel, selectSocialLevel, selectMentalLevel } from '../src/attributes.ts'
import { selectAbilityLevel } from '../src/talents.ts'
import { TALENTS, createAbilityValues, requiresAbilityDetail } from '../src/talents.ts'
import { SKILLS } from '../src/skills.ts'
import { KNOWLEDGES } from '../src/knowledges.ts'
import { createBackgroundDraft, selectBackgroundLevel } from '../src/backgrounds.ts'
import { readAnswer, writeAnswer } from '../src/questionnaireStorage.ts'
import { toCloudPayload, restoreCloudPayload } from '../src/cloudQuestionnaire.ts'

function umbra() {
    let result = { ...createUmbraDraft(), introSeen: true }
    for (let i = 0; i < 16; i++) { result = chooseUmbraAnswer(result, '1'); if (i < 15) result = visitUmbraQuestion(result, i + 1) }
    return confirmAuspiceChoice(confirmTribeChoice(completeUmbra(result), 'fianna'), 'galliard')
}
function filled(definitions, budget) {
    const values = createAbilityValues(definitions), details = {}
    for (const def of definitions) { const level = Math.min(budget, 3); values[def.id] = level; budget -= level; if (level && requiresAbilityDetail(def.specialtyMode)) details[def.id] = 'Domaine du personnage' }
    return { values, details }
}
function dossier() {
    const talents = filled(TALENTS, 13), skills = filled(SKILLS, 9), knowledges = filled(KNOWLEDGES, 5)
    return { playerName: 'Camille', profession: 'Archiviste', concept: 'Une archiviste qui protège la mémoire des autres.', attributeOrder: ['physical', 'social', 'mental'], physicalValues: { strength: 4, dexterity: 3, stamina: 3 }, socialValues: { charisma: 3, manipulation: 3, appearance: 2 }, mentalValues: { perception: 2, intelligence: 2, wits: 2 }, abilityOrder: ['talents', 'skills', 'knowledges'], talentValues: talents.values, talentDetails: talents.details, skillValues: skills.values, skillDetails: skills.details, knowledgeValues: knowledges.values, knowledgeDetails: knowledges.details, backgroundDraft: selectBackgroundLevel(createBackgroundDraft(), 'resources', 5), umbraDraft: umbra() }
}
const storage = () => { const rows = new Map(); return { getItem: key => rows.get(key) ?? null, setItem: (key, value) => rows.set(key, value) } }

test('le lexique conserve les onze pools, leur jonction et une console issue des sources', () => {
    const source = [1, 2].map(part => readFileSync(new URL(`../docs/tribes/APOTHEOSE_SOURCE_${part}.md`, import.meta.url), 'utf8')).join('\n')
    assert.equal(Object.keys(TERMINAL_POOLS).length, 11)
    assert.ok(TERMINAL_POOLS[7].includes('LUNA SIGNATURE // DETECTED'))
    assert.ok(!TERMINAL_POOLS[7].includes('LUNA SIGN'))
    for (const auspice of ['ragabash', 'theurge', 'philodox', 'galliard', 'ahroun']) {
        const lines = diagnosticLines(auspice)
        assert.ok(lines.length >= 25 && lines.length <= 35)
        for (const line of lines) assert.ok(source.includes(line), line)
        for (const line of PERSONAL_TERMINAL[auspice].slice(0, 3)) assert.ok(lines.includes(line))
        assert.equal(lines.at(-1), 'PROTECTOR // REQUIRED')
        assert.ok(lines.indexOf('TARGET = USER') > lines.indexOf('REFERENCE AMBIGUOUS'))
        assert.ok(!lines.includes('BREED // RESOLVED'))
    }
})

test('tous les fragments réservés s’accumulent et restent présents jusqu’au noir', () => {
    const source = readFileSync(new URL('../docs/tribes/LEXIQUE_SOURCE.md', import.meta.url), 'utf8')
    const oldCode = ['umbraIntrusionModel.ts', 'UmbraScene.tsx'].map(file => readFileSync(new URL(`../src/${file}`, import.meta.url), 'utf8')).join('\n')
    assert.ok(APOCALYPSE_RESERVED.length > 100)
    assert.equal(new Set(APOCALYPSE_RESERVED).size, APOCALYPSE_RESERVED.length)
    for (const fragment of APOCALYPSE_RESERVED) { assert.ok(source.includes(fragment), fragment); assert.ok(!oldCode.includes(fragment), fragment) }
    let previous = 0
    for (let elapsed = 0; elapsed <= stageDuration('saturation', 'galliard'); elapsed += 100) { const count = saturationCount(elapsed); assert.ok(count >= previous); assert.ok(count <= SATURATION_FRAGMENTS.length); previous = count }
    assert.equal(previous, SATURATION_FRAGMENTS.length)
    const lastArrival = Math.ceil(SATURATION_FRAGMENTS.length / SATURATION_BATCH) * 180
    assert.ok(stageDuration('saturation', 'galliard') - lastArrival >= 3500)
})

test('le rituel suit les étapes prévues et ne recommence pas après le retour au dossier', () => {
    const empty = createFinaleDraft()
    assert.equal(canBeginFinale(createUmbraDraft()), false)
    assert.strictEqual(beginFinale(empty, createUmbraDraft()), empty)
    let state = beginFinale(empty, umbra())
    const stages = []
    for (let i = 0; i < 6; i++) { stages.push(state.stage); assert.equal(validFinaleDraft(state), true); state = nextFinaleStage(state) }
    assert.deepEqual(stages, ['saturation', 'silence', 'appeal', 'diagnostic', 'rupture', 'dossier'])
    assert.strictEqual(beginFinale(state, umbra()), state)
    assert.strictEqual(nextFinaleStage(state), state)
    assert.ok(stageDuration('appeal', 'galliard') >= 7000)
})

test('le dossier vérifie les budgets, les précisions et les choix sans attribuer de validation MJ', () => {
    const data = dossier()
    assert.deepEqual(dossierIssues(data), [])
    const bad = structuredClone(data)
    bad.physicalValues.strength = 1
    bad.skillDetails = {}
    bad.playerName = ''
    assert.ok(dossierIssues(bad).some(issue => issue.section === 'physical'))
    assert.ok(dossierIssues(bad).some(issue => issue.section === 'skills'))
    assert.ok(dossierIssues(bad).some(issue => issue.section === 'identity'))
    const silver = { ...data, umbraDraft: confirmTribeChoice(data.umbraDraft, 'silverFangs') }
    assert.deepEqual(dossierIssues(silver), [], 'la préférence reste distincte de la condition W20 à examiner avec le MJ')
    assert.equal(silver.umbraDraft.tribeChoice.validation, 'unreviewed')
    assert.equal(silver.umbraDraft.auspiceChoice.validation, 'unreviewed')
})

test('une correction invalide la confirmation, une simple visite des réponses la conserve', () => {
    const data = dossier(), initial = dossierFingerprint(data)
    for (const mutate of [d => { d.concept += ' Nouvelle idée.' }, d => { d.playerName = 'Noa' }, d => { d.profession = 'Mécanicienne' }, d => { d.skillDetails.crafts = 'Menuiserie' }, d => { d.backgroundDraft.details.resources = [{ origin: 'Héritage' }] }, d => { d.umbraDraft = confirmAuspiceChoice(d.umbraDraft, 'theurge') }, d => { d.umbraDraft = confirmTribeChoice(d.umbraDraft, 'uktena') }, d => { d.umbraDraft = chooseUmbraAnswer(d.umbraDraft, '4') }]) {
        const changed = structuredClone(data); mutate(changed); assert.notEqual(dossierFingerprint(changed), initial)
    }
    assert.equal(dossierFingerprint({ ...data, umbraDraft: visitUmbraQuestion(data.umbraDraft, 0) }), initial)
    const reordered = { ...data, physicalValues: { stamina: 3, strength: 4, dexterity: 3 } }
    assert.equal(dossierFingerprint(reordered), initial)
})

test('chaque grande étape et la confirmation voyagent dans le dossier existant', () => {
    const port = storage(), data = dossier()
    writeAnswer(port, 'dossier', 'profession', data.profession)
    writeAnswer(port, 'dossier', 'umbraDraft', data.umbraDraft)
    writeAnswer(port, 'dossier', 'backgroundDraft', data.backgroundDraft)
    for (const stage of ['saturation', 'silence', 'appeal', 'diagnostic', 'rupture', 'dossier']) {
        const finale = { version: 1, stage, confirmedFingerprint: stage === 'dossier' ? dossierFingerprint(data) : '', closingSeen: false }
        writeAnswer(port, 'dossier', 'finaleDraft', finale)
        assert.deepEqual(readAnswer(port, 'dossier', 'finaleDraft', createFinaleDraft()), finale)
        const bag = JSON.parse(port.getItem('dossier')), cloud = restoreCloudPayload(toCloudPayload(bag).p_answers, 0)
        assert.deepEqual(cloud.finaleDraft, finale)
        assert.deepEqual(cloud.umbraDraft, data.umbraDraft)
        assert.equal(cloud.profession, data.profession)
        assert.equal(cloud.backgroundDraft.values.resources, 5)
    }
    port.setItem('dossier', JSON.stringify({ umbraDraft: data.umbraDraft, finaleDraft: { version: 2, stage: 'bad' } }))
    assert.deepEqual(readAnswer(port, 'dossier', 'finaleDraft', createFinaleDraft()), createFinaleDraft())
    assert.deepEqual(readAnswer(port, 'dossier', 'umbraDraft', createUmbraDraft()), data.umbraDraft)
})

test('les consignes et l’effacement finissent exactement sur le message personnalisé stable', () => {
    assert.ok(INTERVIEW_NOTICE.includes('08 Novembre 2026 à 14h00'))
    assert.equal(PRINT_NOTICE, 'Si vous n’êtes pas en mesure de l’imprimer, merci de prévenir le conducteur de votre entretien à l’avance.')
    assert.equal(closingFrame('Camille', 100).phase, 'storm')
    assert.equal(closingFrame('Camille', 9000).phase, 'erasure')
    const expected = 'Je sais qui tu es maintenant Camille.\nDossier validé.\nÀ dimanche prochain…'
    assert.deepEqual(closingFrame('Camille', 13000), { phase: 'revealed', text: expected })
    assert.equal(closingFrame('Camille', 90000).text, expected)
    assert.equal(closingMessage('  Camille  '), expected)
    assert.ok(!closingFrame('Camille', 13000).text.includes('{%user}'))
})

test('un nouveau classement permet de diminuer progressivement un volet en dépassement', () => {
    const physical = { strength: 4, dexterity: 3, stamina: 3 }
    const reduced = selectPhysicalLevel(physical, 'strength', 3, 3)
    assert.equal(reduced.strength, 3)
    assert.strictEqual(selectPhysicalLevel(physical, 'strength', 5, 3), physical)
    assert.equal(selectPhysicalLevel(reduced, 'dexterity', 1, 3).dexterity, 1)
    assert.equal(selectSocialLevel({ charisma: 4, manipulation: 3, appearance: 3 }, 'charisma', 3, 3).charisma, 3)
    assert.equal(selectMentalLevel({ perception: 4, intelligence: 3, wits: 3 }, 'perception', 3, 3).perception, 3)
    const talents = { a: 3, b: 3, c: 3, d: 3, e: 1 }
    assert.equal(selectAbilityLevel(talents, 'a', 2, 5).a, 2)
    assert.strictEqual(selectAbilityLevel(talents, 'e', 2, 5), talents)
    assert.equal(physical.strength, 4)
    assert.equal(talents.a, 3)
})
