import test from 'node:test'
import assert from 'node:assert/strict'
import { createUmbraJourneyReducer, INITIAL_UMBRA_JOURNEY } from '../src/umbraJourney.ts'

const reduce = createUmbraJourneyReducer(4)
const navigate = (to, animate = true) => ({ type: 'navigate', to, animate })

test('la descente traverse le voile avant de stabiliser le palier suivant', () => {
    const departure = reduce(INITIAL_UMBRA_JOURNEY, navigate(1))
    assert.equal(departure.depth, 0)
    assert.equal(departure.passage.phase, 'leaving')
    assert.equal(departure.passage.direction, 'down')
    const crossing = reduce(departure, { type: 'cross' })
    assert.equal(crossing.depth, 1)
    assert.equal(crossing.passage.phase, 'arriving')
    assert.deepEqual(reduce(crossing, { type: 'arrive' }), { depth: 1, passage: null })
    assert.deepEqual(INITIAL_UMBRA_JOURNEY, { depth: 0, passage: null })
})

test('des clics répétés pendant le passage ne sautent aucun palier', () => {
    let state = reduce(INITIAL_UMBRA_JOURNEY, navigate(1))
    for (let i = 0; i < 10; i++) state = reduce(state, navigate(3))
    state = reduce(state, { type: 'cross' })
    for (let i = 0; i < 10; i++) state = reduce(state, navigate(2))
    assert.deepEqual(reduce(state, { type: 'arrive' }), { depth: 1, passage: null })
})

test('la pause ou la disparition de l’onglet permettent une arrivée propre à tout moment', () => {
    const departure = reduce(INITIAL_UMBRA_JOURNEY, navigate(2))
    const arrival = reduce(departure, { type: 'cross' })
    for (const state of [departure, arrival]) {
        const settled = reduce(state, { type: 'settle' })
        assert.deepEqual(settled, { depth: 2, passage: null })
        assert.strictEqual(reduce(settled, { type: 'cross' }), settled)
        assert.strictEqual(reduce(settled, { type: 'arrive' }), settled)
        assert.equal(reduce(settled, navigate(3)).passage.to, 3)
    }
})

test('sans mouvement, les quatre paliers et le retour restent accessibles immédiatement', () => {
    let state = INITIAL_UMBRA_JOURNEY
    for (const depth of [1, 2, 3, 0]) {
        state = reduce(state, navigate(depth, false))
        assert.deepEqual(state, { depth, passage: null })
    }
    const ascent = reduce({ depth: 3, passage: null }, navigate(0))
    assert.equal(ascent.passage.direction, 'up')
    assert.deepEqual(reduce(ascent, { type: 'settle' }), INITIAL_UMBRA_JOURNEY)
})

test('les paliers inexistants et les événements d’animation hors séquence sont ignorés', () => {
    for (const depth of [-1, 4, 1.5, NaN, 0]) assert.strictEqual(reduce(INITIAL_UMBRA_JOURNEY, navigate(depth)), INITIAL_UMBRA_JOURNEY)
    const departure = reduce(INITIAL_UMBRA_JOURNEY, navigate(1))
    assert.strictEqual(reduce(departure, { type: 'arrive' }), departure)
    const arrival = reduce(departure, { type: 'cross' })
    assert.strictEqual(reduce(arrival, { type: 'cross' }), arrival)
})
