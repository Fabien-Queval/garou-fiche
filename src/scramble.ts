export const JOB_QUESTION = 'Quel emploi exercez-vous actuellement ?'
export const CONCEPT_QUESTION = 'Dites-moi qui vous êtes en une ou deux phrases.'

export const SCRAMBLE_DURATION = 2400

export type Distortion = 'quiet' | 'fracture' | 'breach' | 'relapse' | 'repair'

export function distortionAt(elapsed: number): Distortion {
    if (elapsed < 180) return 'quiet'
    if (elapsed < 620) return 'fracture'
    if (elapsed < 1380) return 'breach'
    if (elapsed < 1540) return 'relapse'
    if (elapsed < 2220) return 'repair'
    return 'quiet'
}

const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/%#<>_░▒▓█ÆØЖΨΞ'

// Une image est stable pendant 55 ms : pas de hasard à chaque rendu React.
function noise(index: number, tick: number, salt = 0): number {
    const value = Math.sin(index * 127.1 + tick * 311.7 + salt * 74.7) * 43758.5453
    return value - Math.floor(value)
}

export function corruptText(text: string, elapsed: number, strength = 0.3): string {
    const stage = distortionAt(elapsed)
    if (stage === 'quiet' || stage === 'relapse') return text

    const tick = Math.floor(elapsed / 55)
    const intensity = stage === 'breach'
        ? strength
        : stage === 'fracture'
            ? strength * (elapsed - 180) / 440
            : strength * Math.max(0, (2220 - elapsed) / 680)

    return Array.from(text, (character, index) => {
        if (/\s/.test(character) || noise(index, tick, text.length) > intensity) {
            return character
        }
        return CHARACTERS[Math.floor(noise(index, tick, 5) * CHARACTERS.length)]
    }).join('')
}

export function scrambleFrame(elapsed: number): string {
    if (elapsed < 180 || (elapsed >= 1380 && elapsed < 1540)) return JOB_QUESTION
    if (elapsed >= 2220) return CONCEPT_QUESTION

    // Une brève phrase lisible surgit au milieu du bruit, avant d'être perdue.
    if (elapsed >= 900 && elapsed < 1060) return CONCEPT_QUESTION

    const length = Math.max(JOB_QUESTION.length, CONCEPT_QUESTION.length)
    const tick = Math.floor(elapsed / 55)
    return Array.from({ length }, (_, index) => {
        const oldCharacter = JOB_QUESTION[index] ?? ' '
        const newCharacter = CONCEPT_QUESTION[index] ?? ' '
        const offset = ((index * 17) % length) / length

        if (elapsed < 620 && offset > (elapsed - 180) / 440) return oldCharacter
        if (elapsed >= 1540 && offset <= (elapsed - 1540) / 680) return newCharacter
        if (newCharacter === ' ') return ' '
        return CHARACTERS[Math.floor(noise(index, tick) * CHARACTERS.length)]
    }).join('')
}
