import test from 'node:test'
import assert from 'node:assert/strict'
import { createExperienceReplay, createReplayStorage, canReplayExperience } from '../src/experienceReplay.ts'
import { createUmbraDraft, UMBRA_QUESTIONS, validUmbraDraft } from '../src/umbraQuestionnaire.ts'
import { createBackgroundDraft, selectBackgroundLevel } from '../src/backgrounds.ts'
import { createFinaleDraft } from '../src/finaleState.ts'
import { dossierFingerprint } from '../src/dossierModel.ts'
import { readAnswer, writeAnswer } from '../src/questionnaireStorage.ts'

function savedDossier() {
    return {
        playerName: 'Camille', profession: 'Archiviste', concept: 'Protéger les récits oubliés.',
        attributeOrder: ['mental', 'physical', 'social'], physicalValues: { strength: 3, dexterity: 3, stamina: 2 }, socialValues: { charisma: 2, manipulation: 2, appearance: 2 }, mentalValues: { perception: 4, intelligence: 3, wits: 3 },
        abilityOrder: ['knowledges', 'talents', 'skills'], talentValues: { alertness: 3 }, talentDetails: {}, skillValues: { drive: 3 }, skillDetails: {}, knowledgeValues: { computer: 3 }, knowledgeDetails: {},
        backgroundDraft: { ...selectBackgroundLevel(createBackgroundDraft(), 'resources', 5), revealed: ['ancestors'], confirmed: true },
        umbraDraft: { ...createUmbraDraft(), introSeen: true, completed: true, questionIndex: 15, answers: Object.fromEntries(UMBRA_QUESTIONS.map(question => [question.id, '1'])), tribalStage: 'chosen', tribeChoice: { version: 1, tribeId: 'fianna', validation: 'unreviewed' }, auspiceStage: 'chosen', auspiceChoice: { version: 1, auspiceId: 'galliard', validation: 'unreviewed' } },
    }
}

test('chaque raccourci reprend le bon volet, même après un classement différent', () => {
    const data = savedDossier()
    for (const [point, phase, index] of [['identity', 'job'], ['attributeOrder', 'attributes'], ['physical', 'evaluation', 1], ['social', 'evaluation', 2], ['mental', 'evaluation', 0], ['abilityOrder', 'abilities'], ['talents', 'abilityEvaluation', 1], ['skills', 'abilityEvaluation', 2], ['knowledges', 'abilityEvaluation', 0], ['backgrounds', 'backgrounds'], ['answers', 'umbra'], ['tribe', 'umbra'], ['auspice', 'umbra'], ['finale', 'finale']]) {
        const replay = createExperienceReplay(data, point)
        assert.equal(replay.phase, phase)
        assert.equal(replay.started, true)
        if (phase === 'evaluation') assert.equal(replay.evaluationIndex, index)
        if (phase === 'abilityEvaluation') assert.equal(replay.abilityIndex, index)
        assert.ok(validUmbraDraft(replay.umbraDraft), point)
        assert.deepEqual(replay.umbraDraft.answers, data.umbraDraft.answers)
        assert.equal(replay.finaleDraft.stage, point === 'finale' ? 'saturation' : 'ready')
        assert.equal(replay.finaleDraft.confirmedFingerprint, '')
    }
})

test('les résonances, les lunes et les incidents redémarrent sans effacer les choix', () => {
    const data = savedDossier()
    const questions = createExperienceReplay(data, 'answers')
    assert.equal(questions.umbraDraft.questionIndex, 0)
    assert.equal(questions.umbraDraft.completed, false)
    assert.equal(questions.umbraDraft.introSeen, true)
    assert.deepEqual(questions.umbraDraft.tribeChoice, data.umbraDraft.tribeChoice)
    assert.deepEqual(questions.umbraDraft.auspiceChoice, data.umbraDraft.auspiceChoice)
    assert.equal(createExperienceReplay(data, 'tribe').umbraDraft.tribalStage, 'reveal')
    assert.equal(createExperienceReplay(data, 'auspice').umbraDraft.auspiceStage, 'explore')
    assert.deepEqual(questions.backgroundDraft.revealed, [])
    assert.equal(questions.backgroundDraft.confirmed, false)
})

test('les modifications de relecture sont isolées du dossier et de sa confirmation', () => {
    const data = savedDossier(), before = structuredClone(data), fingerprint = dossierFingerprint(data)
    const storage = createReplayStorage(data, 'physical')
    const replay = createExperienceReplay(data, 'physical')
    replay.physicalValues.strength = 1
    replay.umbraDraft.answers.q01 = '2'
    replay.backgroundDraft.details.resources = [{ origin: 'Autre vie' }]
    writeAnswer(storage, 'experience-replay', 'profession', 'Une autre profession')
    writeAnswer(storage, 'experience-replay', 'umbraDraft', replay.umbraDraft)
    writeAnswer(storage, 'experience-replay', 'finaleDraft', { ...createFinaleDraft(), stage: 'dossier', confirmedFingerprint: 'copie', closingSeen: true })
    assert.equal(readAnswer(storage, 'experience-replay', 'profession', ''), 'Une autre profession')
    assert.deepEqual(data, before)
    assert.equal(dossierFingerprint(data), fingerprint)
    const again = createReplayStorage(data, 'identity')
    assert.equal(readAnswer(again, 'experience-replay', 'profession', ''), 'Archiviste')
    assert.equal(readAnswer(again, 'experience-replay', 'finaleDraft', createFinaleDraft()).confirmedFingerprint, '')
})

test('une étape narrative ne se lance que lorsque ses prérequis existent', () => {
    const data = savedDossier()
    for (const point of ['answers', 'tribe', 'auspice', 'finale']) assert.equal(canReplayExperience(data, point), true)
    delete data.umbraDraft.auspiceChoice
    delete data.umbraDraft.auspiceStage
    assert.equal(canReplayExperience(data, 'auspice'), true)
    assert.equal(canReplayExperience(data, 'finale'), false)
    data.backgroundDraft = createBackgroundDraft()
    assert.equal(canReplayExperience(data, 'answers'), false)
    assert.equal(canReplayExperience(data, 'backgrounds'), true)
    assert.equal(canReplayExperience(data, 'identity'), true)
})
