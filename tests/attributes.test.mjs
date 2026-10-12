import assert from 'node:assert/strict'
import test from 'node:test'
import { allocatedPhysicalPoints, allocatedSocialPoints, allocatedMentalPoints, attributeBudget, selectPhysicalLevel, selectSocialLevel, selectMentalLevel } from '../src/attributes.ts'

const base = { strength: 1, dexterity: 1, stamina: 1 }

test('les budgets suivent le classement dans les six ordres possibles', () => {
    for (const order of [
        ['physical', 'social', 'mental'], ['physical', 'mental', 'social'],
        ['social', 'physical', 'mental'], ['mental', 'physical', 'social'],
        ['social', 'mental', 'physical'], ['mental', 'social', 'physical'],
    ]) {
        order.forEach((block, index) => assert.equal(attributeBudget(order, block), [7, 5, 3][index]))
    }
})

test('les trois niveaux de base sont gratuits', () => {
    assert.equal(allocatedPhysicalPoints(base), 0)
})

test('un choix direct consomme seulement les niveaux supplémentaires et rend les points en diminuant', () => {
    const raised = selectPhysicalLevel(base, 'strength', 5, 7)
    assert.deepEqual(raised, { strength: 5, dexterity: 1, stamina: 1 })
    assert.equal(allocatedPhysicalPoints(raised), 4)
    const lowered = selectPhysicalLevel(raised, 'strength', 2, 7)
    assert.equal(allocatedPhysicalPoints(lowered), 1)
    assert.deepEqual(base, { strength: 1, dexterity: 1, stamina: 1 })
    assert.equal(raised.strength, 5)
})

test('les budgets 7, 5 et 3 peuvent être remplis exactement sans dépassement', () => {
    for (const [budget, levels] of [[7, [4, 3, 3]], [5, [3, 3, 2]], [3, [2, 2, 2]]]) {
        let values = base
        for (const [index, criterion] of ['strength', 'dexterity', 'stamina'].entries()) {
            values = selectPhysicalLevel(values, criterion, levels[index], budget)
        }
        assert.equal(allocatedPhysicalPoints(values), budget)
        assert.strictEqual(selectPhysicalLevel(values, 'strength', values.strength + 1, budget), values)
        assert.equal(allocatedPhysicalPoints(selectPhysicalLevel(values, 'strength', 1, budget)), budget - (values.strength - 1))
    }
})

test('un saut qui dépasse le budget est ignoré sans modifier les réponses', () => {
    assert.strictEqual(selectPhysicalLevel(base, 'strength', 5, 3), base)
})

test('les niveaux restent entiers et compris entre 1 et 5', () => {
    for (const level of [0, -1, 6, 2.5, NaN]) {
        assert.strictEqual(selectPhysicalLevel(base, 'strength', level, 7), base)
    }
})

const socialBase = { charisma: 1, manipulation: 1, appearance: 1 }

test('le relationnel commence avec trois niveaux gratuits', () => {
    assert.equal(allocatedSocialPoints(socialBase), 0)
})

test('le relationnel rembourse les diminutions sans muter les réponses précédentes', () => {
    const raised = selectSocialLevel(socialBase, 'charisma', 5, 7)
    const lowered = selectSocialLevel(raised, 'charisma', 2, 7)
    assert.equal(allocatedSocialPoints(raised), 4)
    assert.equal(allocatedSocialPoints(lowered), 1)
    assert.deepEqual(socialBase, { charisma: 1, manipulation: 1, appearance: 1 })
    assert.equal(raised.charisma, 5)
})

test('le relationnel remplit exactement les trois budgets et bloque les dépassements', () => {
    for (const [budget, levels] of [[7, [4, 3, 3]], [5, [3, 3, 2]], [3, [2, 2, 2]]]) {
        let values = socialBase
        for (const [index, criterion] of ['charisma', 'manipulation', 'appearance'].entries()) {
            values = selectSocialLevel(values, criterion, levels[index], budget)
        }
        assert.equal(allocatedSocialPoints(values), budget)
        for (const criterion of ['charisma', 'manipulation', 'appearance']) {
            assert.strictEqual(selectSocialLevel(values, criterion, values[criterion] + 1, budget), values)
        }
        assert.equal(allocatedSocialPoints(selectSocialLevel(values, 'appearance', 1, budget)), budget - (values.appearance - 1))
    }
    assert.strictEqual(selectSocialLevel(socialBase, 'charisma', 5, 3), socialBase)
})

test('le relationnel refuse les niveaux hors limites et non entiers', () => {
    for (const level of [0, -1, 6, 2.5, NaN]) {
        assert.strictEqual(selectSocialLevel(socialBase, 'appearance', level, 7), socialBase)
    }
})

const mentalBase = { perception: 1, intelligence: 1, wits: 1 }

test('le cognitif commence avec trois niveaux gratuits', () => {
    assert.equal(allocatedMentalPoints(mentalBase), 0)
})

test('le cognitif rembourse les diminutions sans muter les réponses précédentes', () => {
    const raised = selectMentalLevel(mentalBase, 'intelligence', 5, 7)
    const lowered = selectMentalLevel(raised, 'intelligence', 2, 7)
    assert.equal(allocatedMentalPoints(raised), 4)
    assert.equal(allocatedMentalPoints(lowered), 1)
    assert.deepEqual(mentalBase, { perception: 1, intelligence: 1, wits: 1 })
    assert.equal(raised.intelligence, 5)
})

test('le cognitif remplit exactement les trois budgets et bloque les dépassements', () => {
    for (const [budget, levels] of [[7, [4, 3, 3]], [5, [3, 3, 2]], [3, [2, 2, 2]]]) {
        let values = mentalBase
        for (const [index, criterion] of ['perception', 'intelligence', 'wits'].entries()) {
            values = selectMentalLevel(values, criterion, levels[index], budget)
        }
        assert.equal(allocatedMentalPoints(values), budget)
        for (const criterion of ['perception', 'intelligence', 'wits']) {
            assert.strictEqual(selectMentalLevel(values, criterion, values[criterion] + 1, budget), values)
        }
        assert.equal(allocatedMentalPoints(selectMentalLevel(values, 'wits', 1, budget)), budget - (values.wits - 1))
    }
    assert.strictEqual(selectMentalLevel(mentalBase, 'perception', 5, 3), mentalBase)
})

test('le cognitif refuse les niveaux hors limites et non entiers', () => {
    for (const level of [0, -1, 6, 2.5, NaN]) {
        assert.strictEqual(selectMentalLevel(mentalBase, 'wits', level, 7), mentalBase)
    }
})
