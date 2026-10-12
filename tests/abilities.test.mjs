import assert from 'node:assert/strict'
import test from 'node:test'
import { abilityBudget } from '../src/abilities.ts'
import { TALENTS, createAbilityValues, allocatedAbilityPoints, selectAbilityLevel, canCompleteAbilities } from '../src/talents.ts'
import { centralIntensity, referenceFrame } from '../src/referenceWriting.ts'
import { SKILLS } from '../src/skills.ts'

test('les budgets des compétences suivent les six classements', () => {
    for (const order of [
        ['talents', 'skills', 'knowledges'], ['talents', 'knowledges', 'skills'],
        ['skills', 'talents', 'knowledges'], ['knowledges', 'talents', 'skills'],
        ['skills', 'knowledges', 'talents'], ['knowledges', 'skills', 'talents'],
    ]) order.forEach((id, index) => assert.equal(abilityBudget(order, id), [13, 9, 5][index]))
})

test('les aptitudes démarrent à zéro ; les budgets peuvent être remplis sans dépasser trois', () => {
    const base = createAbilityValues(TALENTS)
    assert.equal(allocatedAbilityPoints(base), 0)
    for (const budget of [13, 9, 5]) {
        let values = base
        for (const { id } of TALENTS) {
            const level = Math.min(3, budget - allocatedAbilityPoints(values))
            values = selectAbilityLevel(values, id, level, budget)
        }
        assert.equal(allocatedAbilityPoints(values), budget)
        assert.ok(Object.values(values).every(value => value >= 0 && value <= 3))
        assert.strictEqual(selectAbilityLevel(values, 'hobbyTalent', 1, budget), values)
        assert.ok(canCompleteAbilities(TALENTS, values, {}, budget))
    }
    assert.equal(allocatedAbilityPoints(base), 0)
})

test('le retour à zéro rembourse les points et les anciens objets restent intacts', () => {
    const base = createAbilityValues(TALENTS)
    const raised = selectAbilityLevel(base, 'athletics', 3, 5)
    const refunded = selectAbilityLevel(raised, 'athletics', 0, 5)
    assert.equal(allocatedAbilityPoints(raised), 3)
    assert.equal(allocatedAbilityPoints(refunded), 0)
    assert.equal(base.athletics, 0)
    for (const level of [4, -1, 1.5, NaN]) assert.strictEqual(selectAbilityLevel(base, 'athletics', level, 13), base)
    assert.strictEqual(selectAbilityLevel(base, 'unknown', 1, 13), base)
})

test('seule une aptitude personnelle non nulle exige une précision ; Expression reste facultative', () => {
    const base = createAbilityValues(TALENTS)
    const values = { ...base, alertness: 3, expression: 1, hobbyTalent: 1 }
    assert.equal(canCompleteAbilities(TALENTS, values, {}, 5), false)
    assert.equal(canCompleteAbilities(TALENTS, values, { hobbyTalent: '   ' }, 5), false)
    assert.equal(canCompleteAbilities(TALENTS, values, { hobbyTalent: 'Pédagogie' }, 5), true)
    assert.equal(canCompleteAbilities(TALENTS, { ...base, alertness: 3, expression: 2 }, {}, 5), true)
    assert.equal(canCompleteAbilities(TALENTS, values, { hobbyTalent: 'Pédagogie' }, 9), false)
})

test('les anomalies gardent les références réservées hors de la présentation', () => {
    for (const definition of TALENTS) {
        for (let elapsed = 0; elapsed < 40000; elapsed += 90) {
            const frame = referenceFrame(definition, 3, elapsed)
            assert.equal(frame.description, definition.description)
            assert.equal(frame.levelText, definition.levels[2])
            const displayed = [frame.label, frame.description, frame.levelText, frame.ghost, frame.note].join(' ')
            for (const fragment of definition.foreignFragments) {
                assert.ok(!displayed.includes(fragment), `${definition.id} expose ${fragment}`)
            }
        }
    }
    const primal = TALENTS.find(({ id }) => id === 'primalUrge')
    assert.equal(referenceFrame(primal, 0, 1200).label, 'PULSION PRIMALE')
    assert.equal(referenceFrame(primal, 0, 12000).label, primal.label)
})

test('sans animation, les textes sont complets et le récit reste accessible', () => {
    for (const definition of TALENTS) {
        const frame = referenceFrame(definition, 2, 0, true)
        assert.equal(frame.description, definition.description)
        assert.equal(frame.levelText, definition.levels[1])
        assert.equal(frame.phase, 'settled')
    }
})

test('le centre renforce une anomalie sans changer les descriptions ni relancer sa durée', () => {
    assert.equal(centralIntensity(500, 1000), 1)
    assert.equal(centralIntensity(0, 1000), 0)
    assert.equal(centralIntensity(1000, 1000), 0)
    assert.ok(centralIntensity(400, 1000) > centralIntensity(200, 1000))
    const definition = TALENTS.find(({ id }) => id === 'primalUrge')
    for (const elapsed of [300, 800, 1200, 2500, 3600, 13000]) {
        const frame = referenceFrame(definition, 2, elapsed, false, 1)
        assert.equal(frame.description, definition.description)
        assert.equal(frame.levelText, definition.levels[1])
        if (elapsed >= 3600) assert.equal(frame.label, definition.label)
    }
    assert.equal(referenceFrame(definition, 2, 800, true, 1).label, definition.label)
})

test('les onze Skills démarrent à zéro, respectent chaque budget et remboursent les points', () => {
    const base = createAbilityValues(SKILLS)
    assert.equal(Object.keys(base).length, 11)
    assert.equal(allocatedAbilityPoints(base), 0)
    for (const budget of [13, 9, 5]) {
        let values = base
        for (const { id } of SKILLS) {
            values = selectAbilityLevel(values, id, Math.min(3, budget - allocatedAbilityPoints(values)), budget)
        }
        assert.equal(allocatedAbilityPoints(values), budget)
        assert.strictEqual(selectAbilityLevel(values, 'professionalSkill', 1, budget), values)
        assert.strictEqual(selectAbilityLevel(values, 'drive', 4, budget), values)
        assert.equal(canCompleteAbilities(SKILLS, values, { crafts: 'Travail du bois' }, budget), true)
        const refunded = selectAbilityLevel(values, 'animalKen', 0, budget)
        assert.equal(allocatedAbilityPoints(refunded), budget - values.animalKen)
        assert.equal(allocatedAbilityPoints(values), budget)
    }
    assert.equal(allocatedAbilityPoints(base), 0)
})

test('Crafts, Performance et la compétence libre exigent chacune une précision dès un point', () => {
    const base = createAbilityValues(SKILLS)
    const values = { ...base, animalKen: 2, crafts: 1, performance: 1, professionalSkill: 1 }
    const details = { crafts: 'Bois', performance: 'Chant', professionalSkill: 'Cuisine' }
    for (const id of ['crafts', 'performance', 'professionalSkill']) {
        assert.equal(canCompleteAbilities(SKILLS, values, { ...details, [id]: '' }, 5), false)
        assert.equal(canCompleteAbilities(SKILLS, values, { ...details, [id]: '   ' }, 5), false)
    }
    assert.equal(canCompleteAbilities(SKILLS, values, details, 5), true)
    assert.equal(canCompleteAbilities(SKILLS, { ...base, drive: 3, animalKen: 2 }, {}, 5), true)
    assert.equal(canCompleteAbilities(SKILLS, { ...values, crafts: 0, drive: 1 }, { ...details, crafts: '' }, 5), true)
})

test('les cartes corpo gardent les fragments étrangers dans les données et les suggestions normales restent humaines', () => {
    const hesitant = ['firearms', 'larceny', 'melee', 'stealth']
    for (const definition of SKILLS) {
        assert.equal(definition.presentationMode, hesitant.includes(definition.id) ? 'hesitant' : 'stable')
        for (const elapsed of [0, 800, 1200, 2000, 3600]) {
            const frame = referenceFrame(definition, 3, elapsed, false, 1)
            assert.equal(frame.description, definition.description)
            assert.equal(frame.levelText, definition.levels[2])
            if (definition.presentationMode === 'stable') {
                assert.equal(frame.label, definition.label)
                assert.equal(frame.ghost, '')
                for (const fragment of definition.foreignFragments) {
                    assert.ok(![frame.label, frame.description, frame.levelText, frame.note].join(' ').includes(fragment))
                }
            }
        }
    }
    for (const [id, reserved] of [['melee', 'Klaives'], ['performance', 'Howling']]) {
        const definition = SKILLS.find(definition => definition.id === id)
        assert.ok(definition.specialtySuggestions.some(s => s.label === reserved && s.foreign))
        assert.ok(!definition.specialtySuggestions.filter(s => !s.foreign).some(s => s.label === reserved))
    }
})

test('les fragments des Skills ne surgissent que dans la brève intrusion centrale', () => {
    const firearms = SKILLS.find(({ id }) => id === 'firearms')
    assert.equal(referenceFrame(firearms, 0, 800, false, 1).ghost, 'TUER')
    assert.equal(referenceFrame(firearms, 0, 1100, false, 1).ghost, 'odeur du Wyrm')
    assert.equal(referenceFrame(firearms, 0, 800, false, 0).ghost, '')
    for (const definition of SKILLS) {
        for (const elapsed of [0, 1600, 3600, 12000]) {
            assert.equal(referenceFrame(definition, 1, elapsed, false, 1).ghost, '')
        }
        const reduced = referenceFrame(definition, 1, 1100, true, 1)
        assert.equal(reduced.ghost, '')
        assert.equal(reduced.label, definition.label)
    }
})
