import assert from 'node:assert/strict'
import test from 'node:test'
import { KNOWLEDGES } from '../src/knowledges.ts'
import { createAbilityValues, allocatedAbilityPoints, selectAbilityLevel, canCompleteAbilities } from '../src/talents.ts'
import { referenceFrame } from '../src/referenceWriting.ts'

test('les onze connaissances remplissent les trois budgets sans dépasser trois et remboursent les diminutions', () => {
    const base = createAbilityValues(KNOWLEDGES)
    assert.equal(Object.keys(base).length, 11)
    assert.equal(allocatedAbilityPoints(base), 0)
    for (const budget of [13, 9, 5]) {
        let values = base
        for (const { id } of KNOWLEDGES) {
            values = selectAbilityLevel(values, id, Math.min(3, budget - allocatedAbilityPoints(values)), budget)
        }
        assert.equal(allocatedAbilityPoints(values), budget)
        assert.equal(canCompleteAbilities(KNOWLEDGES, values, { academics: 'Histoire' }, budget), true)
        assert.strictEqual(selectAbilityLevel(values, 'rituals', 1, budget), values)
        assert.strictEqual(selectAbilityLevel(values, 'computer', 4, budget), values)
        const refunded = selectAbilityLevel(values, 'academics', 0, budget)
        assert.equal(allocatedAbilityPoints(refunded), budget - 3)
        assert.equal(allocatedAbilityPoints(values), budget)
    }
    assert.equal(allocatedAbilityPoints(base), 0)
})

test('les quatre précisions sont obligatoires dès un point mais les autres connaissances à trois restent libres', () => {
    const base = createAbilityValues(KNOWLEDGES)
    const values = { ...base, academics: 1, science: 1, technology: 1, expertKnowledge: 1, computer: 1 }
    const details = { academics: 'Histoire', science: 'Biologie', technology: 'Télécommunications', expertKnowledge: 'Psychologie' }
    for (const id of ['academics', 'science', 'technology', 'expertKnowledge']) {
        assert.equal(canCompleteAbilities(KNOWLEDGES, values, { ...details, [id]: '' }, 5), false)
        assert.equal(canCompleteAbilities(KNOWLEDGES, values, { ...details, [id]: '   ' }, 5), false)
        const refunded = { ...values, [id]: 0, computer: 2 }
        assert.equal(canCompleteAbilities(KNOWLEDGES, refunded, { ...details, [id]: '' }, 5), true)
    }
    assert.equal(canCompleteAbilities(KNOWLEDGES, values, details, 5), true)
    assert.equal(canCompleteAbilities(KNOWLEDGES, { ...base, rituals: 3, occult: 2 }, {}, 5), true)
})

test('Rituels garde sa place entre ésotérisme et sciences ; les suggestions étrangères sont réservées', () => {
    const ids = KNOWLEDGES.map(({ id }) => id)
    const index = ids.indexOf('rituals')
    assert.deepEqual(ids.slice(index - 1, index + 2), ['occult', 'rituals', 'science'])
    for (const definition of KNOWLEDGES) {
        assert.equal(definition.presentationMode, definition.id === 'rituals' ? 'foreign' : definition.id === 'occult' ? 'hesitant' : 'stable')
    }
    for (const [id, reserved] of [['medicine', 'Garou Physiology'], ['occult', 'Garou Lore'], ['rituals', 'Caern'], ['expertKnowledge', 'Wyrm Lore']]) {
        const definition = KNOWLEDGES.find(definition => definition.id === id)
        assert.ok(definition.specialtySuggestions.some(s => s.label === reserved && s.foreign))
        assert.ok(!definition.specialtySuggestions.filter(s => !s.foreign).some(s => s.label === reserved))
    }
})

test('les contaminations sont brèves et locales ; les descriptions restent complètes et le mouvement réduit les supprime', () => {
    const law = KNOWLEDGES.find(({ id }) => id === 'law')
    const fragment = referenceFrame(law, 3, 1000, false, 0.3)
    assert.equal(fragment.label, law.label)
    assert.equal(fragment.phase, 'contamination')
    assert.equal(fragment.ghost, 'Litany')
    assert.equal(referenceFrame(law, 3, 1000, false, 0).ghost, '')
    const rituals = KNOWLEDGES.find(({ id }) => id === 'rituals')
    assert.equal(referenceFrame(rituals, 3, 1200, false, 1).label, 'RITUELS')
    assert.equal(referenceFrame(rituals, 3, 1600, false, 1).ghost, 'Umbra')
    for (const definition of KNOWLEDGES) {
        for (const elapsed of [0, 400, 1000, 1200, 1600, 2500, 3600, 40000]) {
            const frame = referenceFrame(definition, 3, elapsed, false, 1)
            assert.equal(frame.description, definition.description)
            assert.equal(frame.levelText, definition.levels[2])
            if (definition.presentationMode === 'stable' || elapsed >= 3600) assert.equal(frame.label, definition.label)
            if (elapsed >= 3600) assert.equal(frame.ghost, '')
            const reduced = referenceFrame(definition, 3, elapsed, true, 1)
            assert.equal(reduced.label, definition.label)
            assert.equal(reduced.ghost, '')
            assert.equal(reduced.phase, 'settled')
        }
    }
})
