import assert from 'node:assert/strict'
import test from 'node:test'
import { BACKGROUNDS, createBackgroundDraft, allocatedBackgroundPoints, selectBackgroundLevel, setBackgroundDetail, revealBackground, canCompleteBackgrounds } from '../src/backgrounds.ts'
import { readAnswer, writeAnswer } from '../src/questionnaireStorage.ts'
import { createSupabaseTotemRepository } from '../src/totemRepository.ts'

test('les onze Historiques démarrent à zéro, sans Rites, et chacun peut recevoir les cinq points', () => {
    const base = createBackgroundDraft()
    assert.equal(BACKGROUNDS.length, 11)
    assert.ok(!BACKGROUNDS.some(({ id }) => id === 'rites'))
    assert.equal(allocatedBackgroundPoints(base.values), 0)
    for (const definition of BACKGROUNDS) {
        assert.equal(definition.levels.length, 5)
        let draft = selectBackgroundLevel(base, definition.id, 5)
        if (definition.id === 'spiritHeritage') draft = setBackgroundDetail(draft, definition.id, 0, 'spiritType', 'Esprits animaux')
        assert.equal(allocatedBackgroundPoints(draft.values), 5)
        assert.equal(canCompleteBackgrounds(draft), true)
        const otherId = definition.id === 'allies' ? 'contacts' : 'allies'
        assert.strictEqual(selectBackgroundLevel(draft, otherId, 1), draft)
        assert.equal(allocatedBackgroundPoints(selectBackgroundLevel(draft, definition.id, 0).values), 0)
    }
    assert.equal(allocatedBackgroundPoints(base.values), 0)
    for (const level of [-1, 6, 1.5, NaN]) assert.strictEqual(selectBackgroundLevel(base, 'allies', level), base)
})

test('le type d’esprits est obligatoire, les ancêtres restent facultatifs et les diminutions rendent les points', () => {
    const base = createBackgroundDraft()
    let draft = selectBackgroundLevel(selectBackgroundLevel(base, 'allies', 3), 'spiritHeritage', 2)
    assert.equal(canCompleteBackgrounds(draft), false)
    draft = setBackgroundDetail(draft, 'spiritHeritage', 0, 'spiritType', '   ')
    assert.equal(canCompleteBackgrounds(draft), false)
    draft = setBackgroundDetail(draft, 'spiritHeritage', 0, 'spiritType', 'Banes')
    assert.equal(canCompleteBackgrounds(draft), true)
    assert.equal(canCompleteBackgrounds(selectBackgroundLevel(base, 'ancestors', 5)), true)
    assert.equal(allocatedBackgroundPoints(selectBackgroundLevel(draft, 'allies', 1).values), 3)
})

test('les fiches d’alliés et de contacts sont conservées lors des changements de score', () => {
    const base = createBackgroundDraft()
    let draft = selectBackgroundLevel(base, 'allies', 3)
    draft = setBackgroundDetail(draft, 'allies', 0, 'name', 'Une vétérinaire')
    draft = setBackgroundDetail(draft, 'allies', 2, 'name', 'Un ami')
    const reduced = selectBackgroundLevel(draft, 'allies', 1)
    assert.equal(reduced.details.allies[2].name, 'Un ami')
    const restored = selectBackgroundLevel(reduced, 'allies', 3)
    assert.equal(restored.details.allies[0].name, 'Une vétérinaire')
    assert.equal(base.details.allies, undefined)
    assert.strictEqual(setBackgroundDetail(draft, 'allies', 0, 'secretField', 'x'), draft)
    assert.strictEqual(setBackgroundDetail(draft, 'mentor', 1, 'name', 'x'), draft)
})

test('les quatre doubles lectures sont permanentes et conservent leur formulation humaine', () => {
    let draft = createBackgroundDraft()
    const hybrids = BACKGROUNDS.filter(({ presentationMode }) => presentationMode === 'hybrid')
    assert.deepEqual(hybrids.map(({ id }) => id), ['ancestors', 'fate', 'mentor', 'pureBreed'])
    for (const definition of hybrids) {
        assert.ok(definition.description && definition.garouDescription && definition.garouTitle)
        draft = revealBackground(draft, definition.id)
        assert.strictEqual(revealBackground(draft, definition.id), draft)
    }
    assert.equal(selectBackgroundLevel(draft, 'ancestors', 0).revealed.length, 4)
    assert.strictEqual(revealBackground(draft, 'allies'), draft)
    assert.equal(BACKGROUNDS.find(({ id }) => id === 'mentor').levels[4].title, 'Rang 6')
    assert.equal(BACKGROUNDS.find(({ id }) => id === 'kinfolk').levels[4].title, 'Cinquante Kinfolk')
})

test('le brouillon préserve les réponses précédentes et les révélations ; une corruption ne bloque pas la reprise', () => {
    const data = new Map()
    const storage = { getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value) }
    writeAnswer(storage, 'draft', 'concept', 'Une gardienne de nuit')
    let draft = revealBackground(createBackgroundDraft(), 'ancestors')
    draft = setBackgroundDetail(selectBackgroundLevel(draft, 'allies', 2), 'allies', 1, 'name', 'Une amie')
    assert.equal(writeAnswer(storage, 'draft', 'backgroundDraft', draft), true)
    assert.equal(readAnswer(storage, 'draft', 'concept', ''), 'Une gardienne de nuit')
    assert.deepEqual(readAnswer(storage, 'draft', 'backgroundDraft', createBackgroundDraft()), draft)
    assert.deepEqual(readAnswer(storage, 'other', 'backgroundDraft', createBackgroundDraft()), createBackgroundDraft())
    storage.setItem('draft', '{broken')
    assert.equal(readAnswer(storage, 'draft', 'concept', ''), '')
    assert.equal(writeAnswer(storage, 'draft', 'concept', 'Nouvelle réponse'), true)
    const invalid = { ...draft, values: { ...draft.values, allies: 5, contacts: 5 } }
    writeAnswer(storage, 'draft', 'backgroundDraft', invalid)
    assert.deepEqual(readAnswer(storage, 'draft', 'backgroundDraft', createBackgroundDraft()), createBackgroundDraft())
    assert.equal(writeAnswer({ ...storage, setItem: () => { throw new Error('quota') } }, 'draft', 'x', 'y'), false)
})

test('le client Totem filtre campagne et groupe, transmet une seule contribution et recharge la somme', async t => {
    const calls = []
    let total = 7
    t.mock.method(globalThis, 'fetch', async (url, options) => {
        calls.push({ url, body: JSON.parse(options.body), headers: options.headers })
        return new Response(JSON.stringify(url.endsWith('garou_totem_summary') ? { total, ownContribution: 2 } : null))
    })
    const repository = createSupabaseTotemRepository({ url: 'https://example.supabase.co', publishableKey: 'public-test-key', campaignId: 'campaign-a', groupId: 'group-a', getAccessToken: async () => 'test-session' })
    const draft = selectBackgroundLevel(createBackgroundDraft(), 'totemContribution', 2)
    await repository.saveBackgrounds(draft)
    assert.equal(calls[0].body.p_contribution, 2)
    assert.equal(calls[0].body.p_backgrounds.values.totemContribution, undefined)
    assert.equal(calls[0].body.p_campaign_id, 'campaign-a')
    assert.equal(calls[0].body.p_group_id, 'group-a')
    assert.equal(calls[0].body.p_user_id, undefined)
    assert.deepEqual(await repository.getSummary(), { total: 7, ownContribution: 2 })
    total = 9
    assert.deepEqual(await repository.getSummary(), { total: 9, ownContribution: 2 })
    assert.ok(calls.every(call => !call.url.includes('/rest/v1/characters')))
})

test('le client Totem refuse une session absente et un agrégat invalide', async t => {
    const config = { url: 'https://example.supabase.co', publishableKey: 'public-test-key', campaignId: 'campaign-a', groupId: 'group-a', getAccessToken: async () => '' }
    const fetch = t.mock.method(globalThis, 'fetch', async () => new Response('{"total":1,"ownContribution":2}'))
    await assert.rejects(createSupabaseTotemRepository(config).getSummary(), /connexion/)
    assert.equal(fetch.mock.callCount(), 0)
    await assert.rejects(createSupabaseTotemRepository({ ...config, getAccessToken: async () => 'test-session' }).getSummary(), /total/)
})
