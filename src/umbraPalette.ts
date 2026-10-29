export type UmbraColor = readonly [number, number, number]

type UmbraPalette = {
    sky: UmbraColor
    middle: UmbraColor
    ground: UmbraColor
    mist: UmbraColor
    edge: UmbraColor
    halo: UmbraColor
    glow: UmbraColor
    filament: UmbraColor
    core: UmbraColor
    starPresence: number
    hazePresence: number
    horizonPresence: number
}

// Le décor CSS et les feux follets du canvas partagent la même palette par palier.
const PALETTES = [
    {
        sky: [16, 34, 48], middle: [8, 19, 30], ground: [3, 9, 16],
        mist: [28, 100, 145], edge: [142, 197, 223], halo: [151, 222, 255],
        glow: [56, 163, 255], filament: [181, 234, 255], core: [231, 251, 255],
        starPresence: 1, hazePresence: 0.2, horizonPresence: 1,
    },
    {
        sky: [9, 25, 31], middle: [4, 12, 20], ground: [2, 6, 10],
        mist: [21, 73, 82], edge: [129, 198, 206], halo: [122, 223, 229],
        glow: [48, 174, 204], filament: [160, 234, 235], core: [224, 252, 246],
        starPresence: 0.72, hazePresence: 0.27, horizonPresence: 0.72,
    },
    {
        sky: [6, 17, 20], middle: [2, 8, 13], ground: [1, 4, 7],
        mist: [12, 49, 42], edge: [132, 206, 181], halo: [124, 226, 182],
        glow: [55, 194, 162], filament: [159, 240, 210], core: [230, 255, 240],
        starPresence: 0.43, hazePresence: 0.24, horizonPresence: 0.42,
    },
    {
        sky: [3, 10, 12], middle: [1, 5, 8], ground: [1, 2, 4],
        mist: [13, 35, 25], edge: [166, 222, 181], halo: [154, 231, 157],
        glow: [112, 205, 143], filament: [195, 244, 193], core: [244, 255, 230],
        starPresence: 0.18, hazePresence: 0.2, horizonPresence: 0.16,
    },
] as const satisfies readonly UmbraPalette[]

export function umbraPalette(depth: number): UmbraPalette {
    return PALETTES[depth] ?? PALETTES[0]
}
