export type PresentationMode = 'stable' | 'hesitant' | 'foreign'
export type SpecialtyMode = 'normal' | 'optionalEarly' | 'requiredEarly' | 'custom'
export type AbilityValues = Record<string, number>
export type AbilityDetails = Record<string, string>
export type SpecialtySuggestion = { label: string; displayLabel?: string; foreign?: boolean }
export type AbilityDefinition = {
    id: string
    label: string
    description: string
    levels: [string, string, string]
    specialtySuggestions: SpecialtySuggestion[]
    specialtyMode: SpecialtyMode
    detailLabel?: string
    presentationMode: PresentationMode
    intrusionLabel?: string
    anomalyIntensity?: number
    fragmentIntrusions?: string[]
    intrusions: string[]
    foreignFragments: string[]
}

const examples = (...labels: string[]): SpecialtySuggestion[] => labels.map(label => ({ label }))

export const TALENTS: AbilityDefinition[] = [
    {
        id: 'alertness', label: 'Vigilance environnementale', presentationMode: 'stable', specialtyMode: 'normal',
        description: 'Capacité à rester attentif à son environnement et à identifier rapidement les changements, signaux ou événements susceptibles de nécessiter une réaction.',
        levels: [
            'Vous êtes attentif aux principaux signaux visuels et sonores autour de vous.',
            'Vous remarquez régulièrement des informations périphériques sans les rechercher activement.',
            'Vous identifiez spontanément des changements subtils dans votre environnement.',
        ],
        specialtySuggestions: [
            { label: 'Embuscades', displayLabel: 'Détection de situations à risque' },
            { label: 'Écoute discrète', displayLabel: 'Écoute' },
            { label: 'Vigilance excessive', displayLabel: 'Surveillance' },
            { label: 'Pièges', displayLabel: 'Identification de pièges' },
            { label: 'Odeurs', displayLabel: 'Signaux olfactifs' },
        ],
        intrusions: [], foreignFragments: [],
    },
    {
        id: 'athletics', label: 'Aptitudes sportives', presentationMode: 'stable', specialtyMode: 'normal',
        description: 'Capacité développée par l’activité physique : course, saut, natation, lancer et autres disciplines mobilisant coordination, endurance et entraînement sportif.',
        levels: [
            'Vous avez une pratique physique régulière ou une expérience sportive de base.',
            'Vous possédez un niveau comparable à celui d’un pratiquant entraîné.',
            'Votre niveau pourrait correspondre à celui d’un compétiteur expérimenté.',
        ],
        specialtySuggestions: examples('Sport spécifique', 'Jeu en équipe', 'Natation', 'Escalade', 'Gymnastique', 'Endurance', 'Pentathlon'),
        intrusions: [], foreignFragments: [],
    },
    {
        id: 'brawl', label: 'Gestion de confrontation physique', presentationMode: 'hesitant', specialtyMode: 'normal',
        description: 'Expérience des situations de confrontation physique et capacité à agir efficacement au corps à corps sans utiliser d’équipement spécialisé.',
        levels: [
            'Vous connaissez les bases d’une confrontation physique réelle.',
            'Vous savez vous défendre et rester efficace dans une altercation.',
            'Vous possédez une expérience significative du combat réel ou d’un art martial.',
        ],
        specialtySuggestions: [...examples('Boxe', 'Lutte', 'Combat de rue', 'Arts martiaux sans armes'), { label: 'Kailindo', foreign: true }],
        intrusionLabel: 'COMBAT À MAINS NUES', intrusions: ['frapper', 'coups', 'corps à corps'],
        foreignFragments: ['crocs', 'griffes', 'forme Crinos', 'guerre', 'Kailindo'],
    },
    {
        id: 'empathy', label: 'Compréhension émotionnelle', presentationMode: 'stable', specialtyMode: 'normal',
        description: 'Capacité à identifier les émotions, réactions et motivations d’autrui et à adapter son comportement en conséquence.',
        levels: [
            'Vous savez généralement reconnaître quand quelqu’un a besoin d’écoute ou de soutien.',
            'Vous percevez assez facilement l’état émotionnel de votre interlocuteur.',
            'Vous savez analyser avec précision les émotions et réactions des personnes autour de vous.',
        ],
        specialtySuggestions: examples('Détection du mensonge', 'Motivations cachées', 'États émotionnels', 'Traits de personnalité', 'Relations affectives'),
        intrusions: [], foreignFragments: [],
    },
    {
        id: 'expression', label: 'Communication et expression', presentationMode: 'stable', specialtyMode: 'optionalEarly',
        detailLabel: 'Domaine privilégié (facultatif)',
        description: 'Capacité à formuler et transmettre efficacement une idée à l’écrit ou à l’oral, en adaptant son langage au public et au support utilisé.',
        levels: [
            'Vous savez produire des contenus ou prises de parole simples mais structurés.',
            'Vous êtes à l’aise dans des situations de débat, rédaction ou présentation.',
            'Vous pourriez exercer professionnellement une activité reposant fortement sur l’expression écrite ou orale.',
        ],
        specialtySuggestions: examples('Rhétorique', 'Discours', 'Poésie', 'Théâtre', 'Communication politique', 'Réseaux sociaux'),
        intrusions: [], foreignFragments: [],
    },
    {
        id: 'intimidation', label: 'Gestion des rapports de force', presentationMode: 'hesitant', specialtyMode: 'normal',
        description: 'Capacité à exercer une pression explicite ou implicite afin d’obtenir une réaction, faire respecter une limite ou imposer une position dans une situation conflictuelle.',
        levels: [
            'Vous savez exercer une pression directe lorsque la situation l’exige.',
            'Vous savez imposer une position et vous montrer difficile à ignorer.',
            'Votre autorité et votre manière d’exercer la pression peuvent suffire à contrôler une situation tendue.',
        ],
        specialtySuggestions: examples('Menaces voilées', 'Alternance conciliant/ferme', 'Chantage', 'Pression physique', 'Représailles'),
        intrusionLabel: 'MENACE', intrusions: ['pression physique', 'faire céder'],
        foreignFragments: ['meutes', 'Ahroun', 'Shadow Lords'],
    },
    {
        id: 'leadership', label: 'Leadership', presentationMode: 'stable', specialtyMode: 'normal',
        description: 'Capacité à coordonner un groupe, susciter l’adhésion et adapter son mode de direction aux circonstances et aux personnes impliquées.',
        levels: [
            'Vous avez déjà assumé naturellement un rôle de référent ou de responsable.',
            'Lorsque vous prenez la parole ou donnez une direction, les autres ont tendance à vous écouter.',
            'Vous pourriez diriger efficacement une équipe ou une organisation.',
        ],
        specialtySuggestions: examples('Communication mobilisatrice', 'Transparence', 'Commandement', 'Motivation', 'Préparation aux situations de crise'),
        intrusions: [], foreignFragments: ['alpha', 'pack', 'Garou Nation'],
    },
    {
        id: 'primalUrge', label: 'Réactivité instinctive', presentationMode: 'foreign', specialtyMode: 'normal',
        description: 'Capacité à se fier à des réactions instinctives et à des signaux sensoriels difficiles à rationaliser afin d’anticiper une situation inhabituelle ou dangereuse.',
        levels: [
            'Vous ressentez parfois instinctivement qu’une situation mérite votre attention sans pouvoir expliquer immédiatement pourquoi.',
            'Vous faites régulièrement confiance à votre instinct pour éviter un danger ou choisir une réaction.',
            'Vous percevez très rapidement lorsqu’une situation est anormale et votre réaction instinctive vous conduit souvent vers une réponse adaptée.',
        ],
        specialtySuggestions: [{ label: 'Changement de forme', foreign: true }, ...examples('Chasse', 'Pressentiments', 'Réaction')],
        intrusionLabel: 'PULSION PRIMALE', intrusions: ['nature bestiale', 'quelque chose d’anormal', 'le loup'],
        foreignFragments: ['transformation', 'autres formes', 'formes non humaines', 'surnaturel', 'Garou', 'guerrier de Gaia', 'Changement de forme'],
    },
    {
        id: 'streetwise', label: 'Adaptation aux environnements informels', presentationMode: 'hesitant', specialtyMode: 'normal',
        description: 'Connaissance pratique des environnements sociaux peu institutionnels, des réseaux informels et des codes permettant d’obtenir informations, services ou contacts en dehors des circuits habituels.',
        levels: [
            'Vous connaissez quelques codes et interlocuteurs permettant d’obtenir certaines informations.',
            'Vous savez évoluer dans des milieux informels et y être reconnu comme quelqu’un qui comprend leurs règles.',
            'Vous disposez d’une connaissance solide de ces réseaux et pourriez y exercer une réelle influence.',
        ],
        specialtySuggestions: examples('Recel', 'Stupéfiants', 'Armes illégales', 'Gangs', 'Réseaux Wi-Fi non sécurisés'),
        intrusionLabel: 'RÉSEAUX CLANDESTINS', intrusions: ['gang', 'criminal underworld', 'drogues', 'armes illégales'], foreignFragments: [],
    },
    {
        id: 'subterfuge', label: 'Stratégie relationnelle', presentationMode: 'hesitant', specialtyMode: 'normal',
        description: 'Capacité à contrôler les informations que vous communiquez, dissimuler vos intentions et adapter votre comportement afin d’obtenir un avantage dans une interaction.',
        levels: [
            'Vous savez faire passer un mensonge simple ou masquer ponctuellement votre intention.',
            'Vous savez adapter votre présentation et votre discours à ce que votre interlocuteur attend.',
            'Vous êtes particulièrement efficace lorsqu’il faut dissimuler vos véritables objectifs ou construire une version crédible des faits.',
        ],
        specialtySuggestions: examples('Mensonges anodins', 'Séduction', 'Manipulation à long terme', 'Fausse innocence'),
        intrusionLabel: 'MENTIR', intrusions: ['tromper', 'double jeu'], foreignFragments: ['vampires', 'Uktena'],
    },
    {
        id: 'hobbyTalent', label: 'Aptitude personnelle', presentationMode: 'stable', specialtyMode: 'requiredEarly',
        detailLabel: 'Précisez cette aptitude',
        description: 'Aptitude pratique que vous avez développée principalement par vous-même, au fil de vos expériences et de vos centres d’intérêt.',
        levels: [
            'Vous avez acquis les bases de cette aptitude par la pratique personnelle.',
            'Vous la mobilisez avec assurance dans des situations variées.',
            'Votre pratique est approfondie et vous pourriez transmettre cette aptitude à d’autres.',
        ],
        specialtySuggestions: examples('Sociabilité', 'Diplomatie', 'Cartomancie', 'Pédagogie', 'Négociation', 'Récupération / débrouille'),
        intrusions: [], foreignFragments: [],
    },
]

export function createAbilityValues(definitions: AbilityDefinition[]): AbilityValues {
    return Object.fromEntries(definitions.map(({ id }) => [id, 0]))
}

export function allocatedAbilityPoints(values: AbilityValues): number {
    return Object.values(values).reduce((sum, value) => sum + value, 0)
}

export function selectAbilityLevel(values: AbilityValues, id: string, level: number, budget: number): AbilityValues {
    if (!(id in values) || !Number.isInteger(level) || level < 0 || level > 3) return values
    const next = { ...values, [id]: level }
    return allocatedAbilityPoints(next) <= budget ? next : values
}

export function canCompleteAbilities(definitions: AbilityDefinition[], values: AbilityValues, details: AbilityDetails, budget: number): boolean {
    return allocatedAbilityPoints(values) === budget && definitions.every(({ id, specialtyMode }) => {
        const level = values[id]
        return Number.isInteger(level) && level >= 0 && level <= 3 &&
            (level === 0 || !requiresAbilityDetail(specialtyMode) || Boolean(details[id]?.trim()))
    })
}

export function requiresAbilityDetail(mode: SpecialtyMode): boolean {
    return mode === 'requiredEarly' || mode === 'custom'
}
