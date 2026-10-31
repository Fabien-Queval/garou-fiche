import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { UMBRA_TRIBES } from '../src/umbraTribes.ts'
import { TRIBE_PROFILES, TRIBAL_GIFTS, tribeCreationReview } from '../src/tribeProfiles.ts'
import { confirmTribeChoice, exploreTribes, revealTribes, validTribeChoice } from '../src/tribeSelection.ts'
import { createUmbraDraft, chooseUmbraAnswer, visitUmbraQuestion, completeUmbra, validUmbraDraft, getUmbraAssessmentResult } from '../src/umbraQuestionnaire.ts'
import { createBackgroundDraft, selectBackgroundLevel } from '../src/backgrounds.ts'
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
const memoryStorage = () => {
    const rows = new Map()
    return { getItem: key => rows.get(key) ?? null, setItem: (key, value) => rows.set(key, value) }
}

test('les treize fiches et les 65 possibilités de Dons correspondent au relevé du livre W20', () => {
    const reference = readFileSync(new URL('../docs/tribes/REFERENTIEL_TRIBUS_W20.md', import.meta.url), 'utf8')
    const rows = [...reference.matchAll(/^\| ([a-zA-Z]+) \| (\d+)-(\d+) \| (.+) \| ([34]) \| (.+) \|$/gm)]
    assert.equal(rows.length, 13)
    assert.deepEqual(TRIBE_PROFILES.map(profile => profile.id), UMBRA_TRIBES.map(tribe => tribe.id))
    for (const [, id, first, last, totem, willpower, gifts] of rows) {
        const profile = TRIBE_PROFILES.find(profile => profile.id === id)
        assert.ok(profile, id)
        assert.deepEqual([...profile.pages], [Number(first), Number(last)])
        assert.equal(profile.willpower, Number(willpower))
        assert.deepEqual([...profile.gifts], gifts.split(', '))
        assert.ok(totem && profile.totem.meaning)
        assert.ok(profile.identity && profile.philosophy && profile.advice && profile.manifesto)
        assert.equal(profile.values.length, 3)
        assert.equal(profile.tensions.length, 2)
        for (const gift of profile.gifts) {
            assert.ok(TRIBAL_GIFTS[gift]?.summary, `${id} : ${gift}`)
            assert.ok(TRIBAL_GIFTS[gift].page >= 152 && TRIBAL_GIFTS[gift].page <= 200)
        }
    }
    assert.equal(TRIBE_PROFILES.reduce((total, profile) => total + profile.gifts.length, 0), 65)
})

test('les restrictions et les conseils W20 restent distincts et ne modifient pas les Historiques', () => {
    const values = { ...createBackgroundDraft().values, resources: 5, ancestors: 1, pureBreed: 1 }
    const before = structuredClone(values)
    assert.equal(tribeCreationReview('boneGnawers', values).length, 2)
    assert.equal(tribeCreationReview('glassWalkers', values).length, 2)
    assert.equal(tribeCreationReview('silentStriders', values).length, 1)
    assert.ok(tribeCreationReview('redTalons', values).some(issue => issue.includes('Ressources')))
    assert.ok(tribeCreationReview('redTalons', values).some(issue => issue.includes('métis')))
    assert.ok(tribeCreationReview('silverFangs', values).some(issue => issue.includes('minimum de trois')))
    assert.deepEqual(tribeCreationReview('silverFangs', { pureBreed: 3 }), [])
    assert.deepEqual(tribeCreationReview('wendigo', values), [], 'Ressources déconseillé ne devient pas interdit')
    assert.deepEqual(tribeCreationReview('stargazers', values), [])
    assert.deepEqual(values, before)
})

test('toutes les Tribus, même non suggérées, restent confirmables sans accord MJ automatique', () => {
    const draft = completed()
    const result = getUmbraAssessmentResult(draft)
    let outside = 0
    for (const { id } of UMBRA_TRIBES) {
        if (!result.majorResonances.includes(id) && !result.nearResonances.includes(id)) outside++
        const choice = confirmTribeChoice(exploreTribes(draft), id)
        assert.equal(choice.tribalStage, 'chosen')
        assert.deepEqual(choice.tribeChoice, { version: 1, tribeId: id, validation: 'unreviewed' })
        assert.equal(validUmbraDraft(choice), true)
        assert.deepEqual(getUmbraAssessmentResult(choice), result)
    }
    assert.ok(outside > 0)
    assert.equal(draft.tribeChoice, undefined)
})

test('explorer conserve la préférence existante et seul un nouveau consentement la remplace', () => {
    const first = confirmTribeChoice(completed(), 'silverFangs')
    const exploring = exploreTribes(first)
    assert.equal(exploring.tribalStage, 'explore')
    assert.deepEqual(exploring.tribeChoice, first.tribeChoice)
    assert.deepEqual(revealTribes(exploring).tribeChoice, first.tribeChoice)
    const changed = confirmTribeChoice(exploring, 'boneGnawers')
    assert.equal(changed.tribeChoice.tribeId, 'boneGnawers')
    assert.equal(first.tribeChoice.tribeId, 'silverFangs')
    const corrected = chooseUmbraAnswer(visitUmbraQuestion(changed, 7), '4')
    assert.equal(corrected.tribalStage, 'reveal')
    assert.equal(corrected.completed, false)
    assert.deepEqual(corrected.tribeChoice, changed.tribeChoice)
    assert.equal(validUmbraDraft(corrected), true)
})

test('les préférences invalides ne fabriquent ni résultat ni approbation', () => {
    const draft = completed()
    const invalid = ['unknown', null, [], { version: 1, tribeId: 'invalid', validation: 'unreviewed' }, { version: 1, tribeId: 'fianna', validation: 'approved' }]
    for (const choice of invalid) assert.equal(validTribeChoice(choice), false)
    assert.strictEqual(confirmTribeChoice(draft, 'invalid'), draft)
    const partial = createUmbraDraft()
    assert.strictEqual(confirmTribeChoice(partial, 'fianna'), partial)
    assert.strictEqual(exploreTribes(partial), partial)
    assert.equal(validUmbraDraft({ ...draft, tribalStage: 'chosen' }), false)
    assert.equal(validUmbraDraft({ ...draft, tribalStage: 'other' }), false)
    assert.equal(validUmbraDraft({ ...partial, tribalStage: 'explore' }), false)
})

test('rechargement et transport conservent le choix, le statut distinct et les réponses médicales', () => {
    const port = memoryStorage()
    const draft = confirmTribeChoice(completed(), 'redTalons')
    const backgroundDraft = selectBackgroundLevel(createBackgroundDraft(), 'resources', 5)
    writeAnswer(port, 'dossier', 'profession', 'Archiviste')
    writeAnswer(port, 'dossier', 'backgroundDraft', backgroundDraft)
    writeAnswer(port, 'dossier', 'umbraDraft', draft)
    const restored = readAnswer(port, 'dossier', 'umbraDraft', createUmbraDraft())
    assert.deepEqual(restored, draft)
    const bag = JSON.parse(port.getItem('dossier'))
    const transported = restoreCloudPayload(toCloudPayload(bag).p_answers, 0)
    assert.deepEqual(transported.umbraDraft, draft)
    assert.equal(transported.umbraDraft.tribeChoice.validation, 'unreviewed')
    assert.equal(transported.profession, 'Archiviste')
    assert.equal(transported.backgroundDraft.values.resources, 5)
    assert.deepEqual(transported.umbraResult, getUmbraAssessmentResult(draft))
})

test('une préférence corrompue et les anciennes sauvegardes ne font pas perdre les seize réponses', () => {
    const original = completed()
    const port = memoryStorage()
    port.setItem('dossier', JSON.stringify({ profession: 'Archiviste', umbraDraft: original }))
    assert.deepEqual(readAnswer(port, 'dossier', 'umbraDraft', createUmbraDraft()), original)
    port.setItem('dossier', JSON.stringify({ profession: 'Archiviste', umbraDraft: { ...original, tribalStage: 'chosen', tribeChoice: { tribeId: 'garbage' } } }))
    assert.deepEqual(readAnswer(port, 'dossier', 'umbraDraft', createUmbraDraft()), original)
    assert.equal(readAnswer(port, 'dossier', 'profession', ''), 'Archiviste')
})
