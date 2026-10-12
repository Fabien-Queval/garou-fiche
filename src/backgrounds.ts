export const BACKGROUND_POINTS = 5
export type BackgroundMode = 'stable' | 'hybrid' | 'foreign'
export type BackgroundId = 'allies' | 'ancestors' | 'contacts' | 'fate' | 'fetish' | 'kinfolk' | 'mentor' | 'pureBreed' | 'resources' | 'spiritHeritage' | 'totemContribution'
export type BackgroundValues = Record<BackgroundId, number>
export type BackgroundDetails = Partial<Record<BackgroundId, Record<string, string>[]>>
export type BackgroundDraft = { values: BackgroundValues; details: BackgroundDetails; revealed: BackgroundId[]; confirmed: boolean }
export type DetailField = { key: string; label: string; kind?: 'textarea' | 'select'; required?: boolean; hint?: string; suggestions?: string[]; options?: string[] }
export type BackgroundLevel = { title: string; description?: string }
export type BackgroundDefinition = {
    id: BackgroundId
    title: string
    description: string
    extraDescription?: string
    presentationMode: BackgroundMode
    garouTitle?: string
    garouDescription?: string
    garouExtra?: string
    levels: BackgroundLevel[]
    humanLevels?: BackgroundLevel[]
    fields: DetailField[]
    repeated?: 'Allié' | 'Contact'
    inline?: boolean
    inlineAlways?: boolean
    optionalDetails?: boolean
    emphasis?: string
    intensity: number
    // Réservé aux contrôles futurs du MJ ; aucune restriction pendant le questionnaire.
    compatibilityTags: string[]
}

const levels = (...titles: string[]): BackgroundLevel[] => titles.map(title => ({ title }))

export const BACKGROUNDS: BackgroundDefinition[] = [
    {
        id: 'allies', title: 'Alliés', presentationMode: 'stable', intensity: 0, compatibilityTags: ['allies'],
        description: 'Certaines personnes sont réellement prêtes à vous aider lorsque vous en avez besoin. Il peut s’agir d’amis, de membres de votre famille, de collègues ou de personnes avec lesquelles vous partagez des intérêts communs. Contrairement à de simples connaissances, ces personnes tiennent suffisamment à vous pour mobiliser leurs propres moyens ou prendre certains risques en votre faveur.',
        levels: [
            { title: 'Un allié fiable', description: 'Une personne disposant de moyens ou d’une influence modérée : médecin, vétérinaire, militant local…' },
            { title: 'Deux alliés fiables', description: 'Deux personnes disposant chacune de ressources ou d’une influence utile.' },
            { title: 'Un petit réseau solide', description: 'Trois alliés, dont l’un possède une influence notable.' },
            { title: 'Un réseau important', description: 'Quatre alliés, dont l’un occupe une position très influente.' },
            { title: 'Un réseau exceptionnel', description: 'Cinq alliés, dont l’un dispose d’une influence particulièrement importante.' },
        ],
        repeated: 'Allié', fields: [
            { key: 'name', label: 'Nom ou rôle' },
            { key: 'relationship', label: 'Qui est cette personne et pourquoi vous aide-t-elle ?', kind: 'textarea', hint: 'Quelques phrases suffisent.' },
        ],
    },
    {
        id: 'ancestors', title: 'Héritage familial', presentationMode: 'hybrid', intensity: 0.65, compatibilityTags: ['ancestors'],
        description: 'Votre histoire familiale semble avoir une influence inhabituelle sur votre identité. Certains souvenirs, récits, lieux ou personnes appartenant aux générations précédentes peuvent vous sembler particulièrement familiers, parfois sans que vous sachiez exactement pourquoi.',
        garouTitle: 'MÉMOIRE ANCESTRALE',
        garouDescription: 'Chez certains Garou, l’héritage familial ne se limite pas aux récits transmis de génération en génération. Les souvenirs et les esprits des ancêtres peuvent réellement laisser une trace accessible à leurs descendants.',
        levels: [
            { title: 'Échos du passé', description: 'Vous recevez parfois de brèves visions indistinctes d’un passé que vous n’avez pas vécu.' },
            { title: 'Souvenirs familiers', description: 'Certains visages et lieux appartenant à vos ancêtres vous semblent aussi familiers que des souvenirs de votre propre enfance.' },
            { title: 'Mémoire identifiable', description: 'Vous pouvez reconnaître certains ancêtres et rattacher des noms à ces souvenirs.' },
            { title: 'Présences conscientes', description: 'Vos ancêtres peuvent converser régulièrement avec vous.' },
            { title: 'Conseillers ancestraux', description: 'Vos ancêtres suivent votre existence et viennent parfois vous conseiller directement.' },
        ],
        optionalDetails: true, fields: [{ key: 'familyHistory', label: 'Que sait votre personnage de son histoire familiale ou de sa lignée ?', kind: 'textarea', hint: 'Vous n’avez pas à inventer les ancêtres spirituels.' }],
    },
    {
        id: 'contacts', title: 'Réseau de contacts', presentationMode: 'stable', intensity: 0, compatibilityTags: ['contacts'],
        description: 'Vous connaissez des personnes capables de vous fournir des informations dans différents milieux. Elles ne sont pas nécessairement assez proches pour prendre des risques importants pour vous, mais elles disposent d’informations utiles et acceptent généralement de vous renseigner.',
        extraDescription: 'Votre personnage possède également un réseau plus diffus de contacts secondaires.',
        levels: levels('Un contact majeur', 'Deux contacts majeurs', 'Trois contacts majeurs', 'Quatre contacts majeurs', 'Cinq contacts majeurs'),
        repeated: 'Contact', fields: [
            { key: 'name', label: 'Nom ou surnom' }, { key: 'domain', label: 'Domaine / milieu' },
            { key: 'relationship', label: 'Comment vous connaissez-vous ?', kind: 'textarea' },
        ],
    },
    {
        id: 'fate', title: 'Où vous voyez-vous dans cinq ans ?', presentationMode: 'hybrid', intensity: 0.8, compatibilityTags: ['fate'],
        description: 'Décrivez brièvement les objectifs, évolutions ou accomplissements que vous imaginez pour votre avenir.',
        garouTitle: 'DESTIN',
        garouDescription: 'Certaines trajectoires ne sont pas seulement des ambitions. Une prophétie accompagne votre existence — ou celle du groupe auquel vous appartiendrez. Elle peut annoncer gloire, catastrophe ou quelque chose d’encore impossible à comprendre.',
        garouExtra: 'Vous décrivez vos ambitions. La prophétie relève du Maître de Jeu.',
        levels: [
            { title: 'Destin connu localement', description: 'Votre avenir est lié à un événement qui peut vous faire connaître au sein d’une communauté locale.' },
            { title: 'Destin majeur pour une communauté', description: 'Votre trajectoire peut bouleverser profondément l’avenir d’un groupe ou d’un territoire.' },
            { title: 'Destin d’ampleur continentale', description: 'Vos actes peuvent avoir des conséquences ressenties très loin de votre lieu d’origine.' },
            { title: 'Destin de la Nation', description: 'Vos actes pourraient affecter l’ensemble de la Nation Garou.' },
            { title: 'Destin de l’Apocalypse', description: 'Votre existence ou celle de votre meute pourrait devenir un facteur direct dans l’issue de l’Apocalypse.' },
        ],
        inline: true, inlineAlways: true, fields: [{ key: 'futureGoals', label: 'Votre avenir en quelques phrases', kind: 'textarea', hint: 'Quelques phrases suffisent.' }],
    },
    {
        id: 'fetish', title: 'FÉTICHE', presentationMode: 'foreign', intensity: 0.85, compatibilityTags: ['fetish'],
        description: 'Un fétiche est un objet matériel dans lequel un esprit a été lié. Cet esprit lui confère des capacités particulières et en fait un objet important dans la société Garou.',
        levels: levels('Un fétiche de niveau 1', 'Un fétiche de niveau 2 ou deux fétiches de niveau 1', 'Un ou plusieurs fétiches représentant trois niveaux au total', 'Quatre niveaux au total', 'Cinq niveaux au total'),
        fields: [
            { key: 'object', label: 'Décrivez brièvement l’objet.', kind: 'textarea' },
            { key: 'powerIdea', label: 'Une idée de son pouvoir ? (facultatif)', kind: 'textarea', hint: 'Si vous avez déjà une idée de son pouvoir, indiquez-la ici. Le Maître de Jeu se chargera de lui donner corps et de l’adapter aux règles.' },
        ],
    },
    {
        id: 'kinfolk', title: 'PARENTÈLE — KINFOLK', presentationMode: 'foreign', intensity: 0.65, compatibilityTags: ['kinfolk'],
        description: 'Les Kinfolk sont des humains ou des loups issus de lignées Garou qui n’ont pas eux-mêmes hérité du devoir spirituel des Garou. Ils savent ce que vous êtes — parfois avant même que vous ne le compreniez pleinement vous-même. Contrairement aux humains ordinaires, ils ne sont pas frappés par le Délirium lorsqu’ils voient un Garou sous sa véritable forme.',
        extraDescription: 'Ils constituent une base essentielle de la société Garou dans le monde humain : famille, soutien, intermédiaires et réseau capable d’aider les Garou sans provoquer panique ou révélation.',
        levels: levels('Deux Kinfolk', 'Cinq Kinfolk', 'Dix Kinfolk', 'Vingt Kinfolk', 'Cinquante Kinfolk'),
        fields: [{ key: 'network', label: 'Décrivez brièvement la nature de ce réseau.', kind: 'textarea', suggestions: ['Famille proche', 'Famille étendue', 'Communauté locale', 'Réseau dispersé', 'Groupe organisé'] }],
    },
    {
        id: 'mentor', title: 'Mentor / Référent', presentationMode: 'hybrid', intensity: 0.55, compatibilityTags: ['mentor'],
        description: 'Une personne plus expérimentée a pris votre personnage sous son aile. Elle peut lui apprendre des choses, lui donner des conseils, le présenter aux bonnes personnes ou intervenir en sa faveur. Elle a cependant ses propres obligations et ne pourra pas toujours être disponible. Plus le niveau est élevé, plus ce mentor est expérimenté, respecté et capable d’agir en votre faveur.',
        humanLevels: [
            { title: 'Mentor expérimenté', description: 'Une personne déjà bien installée dans son milieu. Elle peut vous conseiller, vous former et vous ouvrir certaines portes.' },
            { title: 'Mentor reconnu', description: 'Votre mentor possède une expérience importante et une certaine autorité.' },
            { title: 'Mentor influent', description: 'Il occupe une position importante et peut intervenir dans certaines décisions ou prendre votre défense.' },
            { title: 'Mentor de premier plan', description: 'Il fait partie des figures majeures de son milieu.' },
            { title: 'Mentor exceptionnel', description: 'Il appartient aux individus les plus respectés et puissants de son organisation ou de sa communauté.' },
        ],
        garouTitle: 'MENTOR — RANG GAROU', garouDescription: 'L’expérience de votre mentor possède aussi une autre mesure.',
        levels: levels('Rang 2', 'Rang 3', 'Rang 4', 'Rang 5', 'Rang 6'),
        fields: [
            { key: 'nature', label: 'Nature du mentor', kind: 'select', options: ['Individu', 'Groupe', 'Conseil'] },
            { key: 'name', label: 'Qui est votre mentor ?' },
            { key: 'relationship', label: 'Quelle relation avez-vous avec lui et pourquoi a-t-il décidé de vous aider ?', kind: 'textarea' },
        ],
    },
    {
        id: 'pureBreed', title: 'Héritage familial', presentationMode: 'hybrid', intensity: 0.8, compatibilityTags: ['pureBreed'],
        description: 'Avez-vous dans votre famille un parent ou un ancêtre particulièrement célèbre, respecté ou reconnu dans son domaine ? Son nom, sa réputation, son apparence ou certains de ses traits semblent-ils encore peser sur la manière dont les autres vous perçoivent ?',
        garouTitle: 'SANG DES HÉROS',
        garouDescription: 'Portez-vous le sang des héros d’antan ? Retrouve-t-on dans votre regard la sagesse d’un ancien célèbre, dans votre port la noblesse d’une lignée prestigieuse, ou dans votre manière de combattre la fureur de ceux qui ont autrefois défendu Gaïa ?',
        garouExtra: 'Chez les Garou, cet héritage ne relève pas uniquement de la généalogie. La lignée, certains traits physiques, la manière de se tenir et une forme d’héritage spirituel peuvent rappeler instinctivement aux autres Garou les grandes figures du passé.',
        levels: levels('Vous avez les yeux de votre père.', 'Un ancêtre respecté a laissé son nom dans l’histoire de votre lignée.', 'Votre ascendance compte plusieurs figures majeures de la Nation Garou.', 'Même dépouillé de tout signe de statut, votre présence impose naturellement le respect.', 'Les plus grands héros de votre peuple semblent vivre encore à travers vous.'),
        optionalDetails: true, fields: [{ key: 'lineage', label: 'Que sait votre personnage de sa famille ou de son ascendance ?', kind: 'textarea' }],
    },
    {
        id: 'resources', title: 'Ressources', presentationMode: 'stable', intensity: 0, compatibilityTags: ['resources'],
        description: 'Ce niveau représente l’accès durable de votre personnage à l’argent, au logement, au patrimoine et aux autres biens permettant de financer son mode de vie. Il ne s’agit pas seulement de l’argent disponible immédiatement.',
        levels: [
            { title: 'Suffisant', description: 'Niveau de vie ouvrier correct, logement décent, véhicule fonctionnel, peu de grosses dépenses.' },
            { title: 'Modéré', description: 'Classe moyenne, quelques loisirs, possibilité de payer ponctuellement des services ou de l’aide.' },
            { title: 'Confortable', description: 'Propriétaire d’un logement et de biens significatifs, patrimoine réel et accès facile au crédit.' },
            { title: 'Fortuné', description: 'Puissance financière importante ; vous comptez parmi les personnes les plus riches de votre pays.' },
            { title: 'Extrêmement fortuné', description: 'Vous comptez parmi les personnes les plus riches au monde, avec plusieurs propriétés, moyens de transport de luxe et actifs considérables.' },
        ],
        fields: [{ key: 'origin', label: 'D’où viennent principalement vos ressources ?', kind: 'textarea', suggestions: ['Salaire régulier', 'Activité indépendante', 'Patrimoine familial', 'Immobilier', 'Placements', 'Entreprise', 'Rente', 'Héritage'] }],
    },
    {
        id: 'spiritHeritage', title: 'HÉRITAGE SPIRITUEL', presentationMode: 'foreign', intensity: 1, compatibilityTags: ['spiritHeritage'],
        description: 'Certains Garou possèdent une affinité particulière avec une catégorie d’esprits. Ceux-ci semblent reconnaître quelque chose de familier en vous et peuvent se montrer plus réceptifs, respectueux, intrigués ou parfois craintifs.',
        levels: levels('Les esprits concernés reconnaissent leur odeur sur vous, même si personne d’autre ne le perçoit.', 'Ils remarquent votre arrivée et les autres peuvent vaguement associer votre présence à ces esprits sans comprendre pourquoi.', 'Dans l’Umbra, votre affinité devient perceptible.', 'Dans l’Umbra, cette affinité devient visiblement manifeste.', 'Votre lien est si fort que certains peuvent se demander si vous êtes réellement seulement à moitié esprit.'),
        inline: true, fields: [{ key: 'spiritType', label: 'À quel type d’esprits êtes-vous lié ?', required: true, suggestions: ['Esprits animaux', 'Esprits végétaux', 'Élémentaires', 'Esprits urbains', 'Banes'] }],
    },
    {
        id: 'totemContribution', title: 'TOTEM', presentationMode: 'foreign', intensity: 0.95, compatibilityTags: ['totem'],
        description: 'Le Totem n’appartient pas à un seul personnage : il est lié à la meute entière. Chaque membre peut investir une partie de ses points d’Historiques dans ce lien spirituel. Tous les points investis par les membres de la meute sont réunis afin de déterminer la puissance et les capacités de leur Totem.',
        emphasis: 'LA PUISSANCE DU TOTEM DÉPEND DE CE QUE CHAQUE MEMBRE DE LA MEUTE INVESTIT EN LUI.',
        levels: levels('Un point investi dans le lien de la meute', 'Deux points investis dans le lien de la meute', 'Trois points investis dans le lien de la meute', 'Quatre points investis dans le lien de la meute', 'Cinq points investis dans le lien de la meute'),
        fields: [],
    },
]

export function createBackgroundDraft(): BackgroundDraft {
    return { values: Object.fromEntries(BACKGROUNDS.map(({ id }) => [id, 0])) as BackgroundValues, details: {}, revealed: [], confirmed: false }
}

export function allocatedBackgroundPoints(values: BackgroundValues): number {
    return BACKGROUNDS.reduce((sum, { id }) => sum + values[id], 0)
}

export function selectBackgroundLevel(draft: BackgroundDraft, id: BackgroundId, level: number): BackgroundDraft {
    if (!BACKGROUNDS.some(definition => definition.id === id) || !Number.isInteger(level) || level < 0 || level > 5) return draft
    const values = { ...draft.values, [id]: level }
    if (allocatedBackgroundPoints(values) > BACKGROUND_POINTS) return draft
    return { ...draft, values, confirmed: false }
}

export function setBackgroundDetail(draft: BackgroundDraft, id: BackgroundId, index: number, key: string, value: string): BackgroundDraft {
    const definition = BACKGROUNDS.find(definition => definition.id === id)
    if (!definition?.fields.some(field => field.key === key) || !Number.isInteger(index) || index < 0 || index > 4 || (!definition.repeated && index !== 0)) return draft
    const previous = draft.details[id] ?? []
    const rows = Array.from({ length: Math.max(previous.length, index + 1) }, (_, row) => ({ ...previous[row] }))
    rows[index] = { ...rows[index], [key]: value.slice(0, 500) }
    return { ...draft, details: { ...draft.details, [id]: rows }, confirmed: false }
}

export function revealBackground(draft: BackgroundDraft, id: BackgroundId): BackgroundDraft {
    if (draft.revealed.includes(id) || BACKGROUNDS.find(definition => definition.id === id)?.presentationMode !== 'hybrid') return draft
    return { ...draft, revealed: [...draft.revealed, id] }
}

export function canCompleteBackgrounds(draft: BackgroundDraft): boolean {
    return allocatedBackgroundPoints(draft.values) === BACKGROUND_POINTS && BACKGROUNDS.every(({ id, fields }) => {
        const value = draft.values[id]
        return Number.isInteger(value) && value >= 0 && value <= 5 && (value === 0 || fields.every(field => !field.required || Boolean(draft.details[id]?.[0]?.[field.key]?.trim())))
    })
}
