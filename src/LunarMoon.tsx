import { memo } from 'react'

const textures = new Map<number, string>()

function moonTexture(light: number): string {
    const cached = textures.get(light)
    if (cached) return cached
    const radius = Math.abs(1 - 2 * light) * 50
    const face = light === 0 ? '' : `M60 10 A50 50 0 0 1 60 110 ${light === 0.5 ? 'L60 10' : `A${radius} 50 0 0 ${light > 0.5 ? 1 : 0} 60 10`} Z`
    // Une image SVG partagée par phase : la texture est mise en cache par le navigateur,
    // plutôt que de déplacer un arbre de filtres SVG dans la scène animée.
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
        <defs>
            <radialGradient id="dark" cx="70%" cy="35%"><stop stop-color="#263344"/><stop offset="1" stop-color="#080e19"/></radialGradient>
            <radialGradient id="light" cx="68%" cy="30%" r="75%"><stop stop-color="#fff7dc"/><stop offset="0.48" stop-color="#d4d3c5"/><stop offset="1" stop-color="#8b99a0"/></radialGradient>
            <clipPath id="circle"><circle cx="60" cy="60" r="50"/></clipPath>
            <clipPath id="lit"><path d="${face}"/></clipPath>
            <filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.14" numOctaves="3" seed="7"/><feColorMatrix type="saturate" values="0"/><feBlend in="SourceGraphic" mode="soft-light"/></filter>
        </defs>
        <circle cx="60" cy="60" r="50" fill="url(#dark)" stroke="#a7b5c6" stroke-opacity="${light === 0 ? 0.48 : 0.22}" stroke-width="0.7"/>
        ${face ? `<g clip-path="url(#lit)">
            <circle cx="60" cy="60" r="50" fill="url(#light)"/>
            <g fill="#566979" opacity="0.2"><ellipse cx="78" cy="43" rx="13" ry="16"/><ellipse cx="52" cy="38" rx="12" ry="9"/><ellipse cx="69" cy="66" rx="16" ry="12"/><circle cx="43" cy="76" r="9"/><circle cx="82" cy="87" r="6"/></g>
            <g fill="none" stroke="#f4edd8" stroke-width="0.7" opacity="0.4"><circle cx="39" cy="59" r="5"/><circle cx="73" cy="82" r="4"/><circle cx="90" cy="59" r="3"/></g>
            <circle cx="60" cy="60" r="50" fill="#bbb8a6" opacity="0.18" filter="url(#grain)" clip-path="url(#circle)"/>
        </g>` : ''}
    </svg>`
    const texture = `data:image/svg+xml,${encodeURIComponent(svg)}`
    textures.set(light, texture)
    return texture
}

const LunarMoon = memo(function LunarMoon({ light }: { light: number }) {
    return <img className="lunar-disc" src={moonTexture(light)} width="120" height="120" alt="" aria-hidden="true" draggable={false} />
})

export default LunarMoon
