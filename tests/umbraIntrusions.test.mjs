import test from 'node:test'
import assert from 'node:assert/strict'
import { freeSignalAreas, nextUmbraLeakDelay, pickUmbraFragment, placeUmbraFragment, planUmbraLeaks, signalFitsArea, umbraIntrusionProfile, umbraLeakFrame } from '../src/umbraIntrusionModel.ts'

const overlaps = (a, b) => a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y
function seededRandom(seed = 42) {
    return () => {
        seed = (1664525 * seed + 1013904223) >>> 0
        return seed / 4294967296
    }
}

test('les seize questions intensifient les intrusions sans dépendre des réponses ni du temps de lecture', () => {
    const profiles = Array.from({ length: 16 }, (_, index) => umbraIntrusionProfile(index))
    assert.deepEqual(profiles.map(profile => profile.tier), [0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3])
    for (let index = 1; index < profiles.length; index++) {
        assert.ok(profiles[index].intensity > profiles[index - 1].intensity)
        assert.ok(profiles[index].maxFontSize > profiles[index - 1].maxFontSize)
        assert.ok(profiles[index].restMs < profiles[index - 1].restMs)
    }
    assert.deepEqual(profiles.map(profile => profile.maxFragments), [2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5])
    assert.ok(profiles.every(profile => profile.restMs >= 1100))
    assert.deepEqual(umbraIntrusionProfile(-1), profiles[0])
    assert.deepEqual(umbraIntrusionProfile(NaN), profiles[0])
    assert.deepEqual(umbraIntrusionProfile(999), profiles[15])
    assert.deepEqual(umbraIntrusionProfile(2), profiles[2], 'revenir en arrière restaure une intensité plus faible')
})

test('les fragments profonds restent tardifs et les fuites évitent les fragments récents', () => {
    const random = seededRandom()
    let sawDeepFragment = false
    const deep = ['MALFEAS', 'EREBUS', 'LAST JUNCTION', 'NO BOTTOM DETECTED', 'THE SILVER DOES NOT KILL HERE']
    for (let index = 0; index < 16; index++) {
        const profile = umbraIntrusionProfile(index)
        let previous = []
        for (let leak = 0; leak < 100; leak++) {
            const fragment = pickUmbraFragment(profile, previous, random)
            assert.ok(!previous.includes(fragment))
            assert.ok(!fragment.includes('DESTINATION:'))
            if (index < 12) assert.ok(!deep.includes(fragment))
            else sawDeepFragment ||= deep.includes(fragment)
            previous = [...previous, fragment].slice(-3)
        }
    }
    assert.ok(sawDeepFragment)
})

test('chaque fuite résout son scramble et sa rechute sans partager une horloge collective', () => {
    const random = seededRandom()
    for (const index of [0, 4, 8, 15]) {
        const profile = umbraIntrusionProfile(index)
        for (let repeat = 0; repeat < 50; repeat++) {
            for (const plan of planUmbraLeaks(profile, random)) {
                const text = pickUmbraFragment(profile, [], random)
                assert.equal(umbraLeakFrame(text, plan.scrambleMs, plan, profile.intensity).text, text)
                assert.equal(umbraLeakFrame(text, plan.durationMs, plan, profile.intensity).text, text)
                assert.ok(plan.durationMs - plan.scrambleMs >= 1000)
                if (plan.aftershockAtMs !== null) {
                    assert.equal(umbraLeakFrame(text, plan.aftershockAtMs + 20, plan, profile.intensity).phase, 'rupture')
                    assert.ok(plan.aftershockAtMs + plan.aftershockMs < plan.durationMs - 280)
                    assert.equal(umbraLeakFrame(text, plan.aftershockAtMs + plan.aftershockMs, plan, profile.intensity).text, text)
                }
            }
        }
    }
})

test('les premières fuites arrivent vite et les cascades ont des départs et des durées distincts', () => {
    const random = seededRandom()
    for (let index = 0; index < 16; index++) {
        const profile = umbraIntrusionProfile(index)
        let singles = 0
        let cascades = 0
        const gaps = new Set()
        const lifetimes = new Set()
        for (let repeat = 0; repeat < 100; repeat++) {
            const first = nextUmbraLeakDelay(profile, true, random)
            assert.ok(first >= 300 && first <= 1300)
            const next = nextUmbraLeakDelay(profile, false, random)
            assert.ok(next >= 1100 && next <= 7300)
            const plans = planUmbraLeaks(profile, random)
            assert.ok(plans.length >= 1 && plans.length <= 6)
            assert.equal(plans[0].offsetMs, 0)
            if (plans.length > 1) cascades++
            else singles++
            for (let i = 0; i < plans.length; i++) {
                lifetimes.add(Math.round(plans[i].durationMs))
                if (i) {
                    const gap = plans[i].offsetMs - plans[i - 1].offsetMs
                    assert.ok(gap >= 110, 'aucun départ simultané dans une cascade')
                    gaps.add(Math.round(gap))
                }
            }
        }
        assert.ok(singles > 0 && cascades > 0)
        assert.ok(gaps.size > 10 && lifetimes.size > 10, 'le rythme ne devient pas une séquence périodique')
    }
})

test('les intrusions évitent textes et commandes, restent dans la fenêtre et peuvent utiliser les marges mobiles', () => {
    const random = seededRandom()
    for (const width of [320, 360, 768, 1440]) {
        const height = 800
        const panel = { x: width < 680 ? 20 : width * 0.25, y: 200, width: width < 680 ? width - 40 : width * 0.5, height: 1100 }
        const blockers = [
            { x: 0, y: 0, width, height: 120 },
            panel,
            { x: width / 2 - 40, y: 130, width: 80, height: 60 },
            { x: 28, y: 350, width: 44, height: 240 },
        ]
        const areas = freeSignalAreas(width, height, blockers)
        assert.ok(areas.length > 0)
        for (let i = 0; i < areas.length; i++) {
            assert.ok(blockers.every(blocker => !overlaps(areas[i], blocker)))
            assert.ok(areas.slice(i + 1).every(other => !overlaps(areas[i], other)))
        }
        let vertical = false
        for (let index = 0; index < 16; index++) {
            const profile = umbraIntrusionProfile(index)
            for (let repeat = 0; repeat < 20; repeat++) {
                for (let leak = 0; leak < profile.maxFragments; leak++) {
                    const text = pickUmbraFragment(profile, [], random)
                    const placement = placeUmbraFragment(text, areas, profile, random)
                    assert.ok(placement, `${width}px : une zone sûre reste disponible`)
                    assert.ok(placement.x >= 0 && placement.y >= 0)
                    assert.ok(placement.x + placement.width <= width + 0.001)
                    assert.ok(placement.y + placement.height <= height + 0.001)
                    assert.ok(placement.fontSize >= 9)
                    assert.ok(blockers.every(blocker => !overlaps(placement, blocker)))
                    vertical ||= placement.vertical
                }
            }
        }
        if (width <= 360) assert.ok(vertical)
    }
    assert.deepEqual(freeSignalAreas(320, 800, [{ x: 0, y: 0, width: 320, height: 800 }]), [])
    assert.equal(placeUmbraFragment('Luna', [], umbraIntrusionProfile(0)), null)
})

test('le défilement peut déplacer une fuite sans modifier son identité ni sa durée', () => {
    const random = seededRandom()
    const profile = umbraIntrusionProfile(15)
    const plan = planUmbraLeaks(profile, random)[0]
    const originalAreas = freeSignalAreas(1280, 800, [{ x: 280, y: 200, width: 700, height: 1000 }])
    const text = 'MEMBRANE THINNING'
    const original = { ...placeUmbraFragment(text, originalAreas, profile, random), ...plan, id: 17, text, start: 500 }
    const scrolledPanel = { x: 280, y: -180, width: 700, height: 1000 }
    const nextAreas = freeSignalAreas(1280, 800, [scrolledPanel])
    const placement = nextAreas.some(area => signalFitsArea(original, area)) ? original : placeUmbraFragment(text, nextAreas, profile, random)
    assert.ok(placement)
    const followed = { ...original, ...placement }
    assert.ok(!overlaps(followed, scrolledPanel))
    assert.equal(followed.id, original.id)
    assert.equal(followed.start, original.start)
    assert.equal(followed.durationMs, original.durationMs)
    assert.equal(followed.scrambleMs, original.scrambleMs)
    assert.equal(followed.text, original.text)
})
