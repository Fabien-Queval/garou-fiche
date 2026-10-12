export type AttributeBlock = 'physical' | 'social' | 'mental'
export type PhysicalCriterion = 'strength' | 'dexterity' | 'stamina'
export type PhysicalValues = Record<PhysicalCriterion, number>
export type SocialCriterion = 'charisma' | 'manipulation' | 'appearance'
export type SocialValues = Record<SocialCriterion, number>
export type MentalCriterion = 'perception' | 'intelligence' | 'wits'
export type MentalValues = Record<MentalCriterion, number>

export const ATTRIBUTE_POINTS = [7, 5, 3]
export const PRIORITY_LABELS = [
    'Vos points forts',
    'Vos points en cours d’acquisition',
    'Vos axes de développement',
]
export const SECTION_LABELS: Record<AttributeBlock, string> = {
    physical: 'Fonctionnel',
    social: 'Relationnel',
    mental: 'Cognitif',
}

export function attributeBudget(order: AttributeBlock[], block: AttributeBlock): number {
    return ATTRIBUTE_POINTS[order.indexOf(block)] ?? 0
}

export function allocatedPhysicalPoints(values: PhysicalValues): number {
    return (values.strength - 1) + (values.dexterity - 1) + (values.stamina - 1)
}

export function selectPhysicalLevel(
    values: PhysicalValues,
    criterion: PhysicalCriterion,
    level: number,
    budget: number,
): PhysicalValues {
    if (!Number.isInteger(level) || level < 1 || level > 5) return values

    const nextValues = { ...values, [criterion]: level }
    return allocatedPhysicalPoints(nextValues) <= budget ? nextValues : values
}

export const LEVEL_LABELS = ['Base', 'Standard', 'Élevé', 'Très élevé', 'Hors norme']

export function allocatedMentalPoints(values: MentalValues): number {
    return (values.perception - 1) + (values.intelligence - 1) + (values.wits - 1)
}

export function selectMentalLevel(
    values: MentalValues,
    criterion: MentalCriterion,
    level: number,
    budget: number,
): MentalValues {
    if (!Number.isInteger(level) || level < 1 || level > 5) return values

    const nextValues = { ...values, [criterion]: level }
    return allocatedMentalPoints(nextValues) <= budget ? nextValues : values
}

export const MENTAL_CRITERIA: {
    id: MentalCriterion
    title: string
    description: string
    levels: string[]
}[] = [
    {
        id: 'perception',
        title: 'Vigilance situationnelle',
        description: 'Capacité à remarquer les détails pertinents de son environnement, détecter les changements, ressentir l’ambiance d’une situation et repérer rapidement ce qui mérite attention.',
        levels: [
            'Vous pouvez facilement manquer des détails évidents ou ne remarquer qu’assez tard un changement dans votre environnement.',
            'Vous percevez correctement ce qui se passe autour de vous, même si certains détails ou signaux faibles peuvent vous échapper.',
            'Vous remarquez rapidement l’ambiance générale d’une situation, les changements inhabituels et de nombreux détails que d’autres pourraient ignorer.',
            'Vous êtes extrêmement attentif à votre environnement et remarquez souvent des éléments subtils même lorsque les conditions sont défavorables ou que votre attention est sollicitée ailleurs.',
            'Votre sens de l’observation est exceptionnel. Vous détectez presque instinctivement des détails, anomalies ou signaux que la majorité des personnes ne remarqueraient pas.',
        ],
    },
    {
        id: 'intelligence',
        title: 'Analyse et raisonnement',
        description: 'Capacité à organiser des informations, identifier des schémas, résoudre des problèmes et tirer des conclusions cohérentes à partir d’éléments parfois dispersés ou complexes.',
        levels: [
            'Les situations abstraites, les problèmes complexes ou les raisonnements comportant plusieurs étapes peuvent rapidement devenir difficiles à traiter.',
            'Vous raisonnez avec l’efficacité attendue dans la plupart des situations courantes et savez reconnaître lorsque vous manquez d’informations ou de connaissances.',
            'Avec un peu de temps, vous identifiez facilement des liens ou des schémas que beaucoup de personnes ne remarquent pas spontanément.',
            'Vous savez structurer rapidement des informations complexes, distinguer les éléments pertinents et en tirer des conclusions nouvelles ou inattendues.',
            'Vos capacités de raisonnement sont exceptionnellement élevées. Face à un problème nouveau, suffisamment de temps et d’informations vous permettent généralement d’en comprendre le fonctionnement ou d’en dégager une solution.',
        ],
    },
    {
        id: 'wits',
        title: 'Réactivité cognitive',
        description: 'Capacité à comprendre rapidement une situation nouvelle, garder son sang-froid et produire une réponse pertinente lorsque le contexte évolue brusquement.',
        levels: [
            'Vous avez besoin de temps pour vous adapter aux situations imprévues et pouvez facilement être déstabilisé lorsqu’il faut répondre immédiatement.',
            'Vous réagissez correctement aux imprévus courants et savez généralement identifier une réponse raisonnable lorsqu’une situation évolue.',
            'Vous restez efficace dans les échanges rapides ou les situations sous pression et trouvez généralement une réponse adaptée sans avoir besoin de beaucoup de temps.',
            'Il est difficile de vous prendre au dépourvu. Vous adaptez rapidement votre raisonnement, trouvez de nouvelles options et répondez avec aisance lorsque les circonstances changent.',
            'Votre vitesse d’analyse et d’adaptation est exceptionnelle. Vous semblez parfois comprendre une situation et commencer à y répondre presque avant que les autres aient fini de réaliser ce qui vient de se produire.',
        ],
    },
]

export function allocatedSocialPoints(values: SocialValues): number {
    return (values.charisma - 1) + (values.manipulation - 1) + (values.appearance - 1)
}

export function selectSocialLevel(
    values: SocialValues,
    criterion: SocialCriterion,
    level: number,
    budget: number,
): SocialValues {
    if (!Number.isInteger(level) || level < 1 || level > 5) return values

    const nextValues = { ...values, [criterion]: level }
    return allocatedSocialPoints(nextValues) <= budget ? nextValues : values
}

export const SOCIAL_CRITERIA: {
    id: SocialCriterion
    title: string
    description: string
    levels: string[]
}[] = [
    {
        id: 'charisma',
        title: 'Impact relationnel',
        description: 'Capacité à susciter naturellement sympathie, confiance ou adhésion, à mobiliser les autres et à devenir spontanément une personne vers laquelle ils se tournent.',
        levels: [
            'Vous éprouvez régulièrement des difficultés à susciter spontanément sympathie ou confiance.',
            'Vous établissez généralement des relations cordiales et êtes aussi facile à côtoyer que la plupart des gens.',
            'Les autres vous accordent facilement leur confiance et ont tendance à se tourner vers vous lorsqu’une situation devient difficile.',
            'Vous créez rapidement des liens et attirez naturellement l’attention ou l’adhésion. Les inconnus restent rarement longtemps étrangers avec vous.',
            'Votre personnalité possède un pouvoir d’entraînement exceptionnel. Vous pouvez naturellement fédérer, inspirer et mobiliser un groupe autour de vous.',
        ],
    },
    {
        id: 'manipulation',
        title: 'Influence interpersonnelle',
        description: 'Capacité à comprendre les motivations d’autrui et à adapter son discours ou son comportement afin d’orienter une décision, une négociation ou une interaction dans le sens souhaité.',
        levels: [
            'Vous avez du mal à amener quelqu’un à modifier son comportement ou son opinion lorsque cette personne n’y est pas déjà disposée.',
            'Comme la plupart des gens, vous savez occasionnellement négocier, argumenter ou présenter les choses à votre avantage.',
            'Vous savez identifier les bons arguments, lire les attentes de votre interlocuteur et obtenir régulièrement des concessions ou des décisions favorables.',
            'Vous adaptez avec finesse votre approche à chaque interlocuteur et parvenez fréquemment à orienter ses choix sans qu’il ait nécessairement conscience de votre influence.',
            'Votre compréhension des motivations et dynamiques humaines vous permettrait d’influencer profondément les décisions d’un individu ou d’un groupe, y compris lorsqu’ils vous sont initialement hostiles.',
        ],
    },
    {
        id: 'appearance',
        title: 'Présence personnelle',
        description: 'Impact produit lors d’une première rencontre par l’apparence générale, la posture, le langage corporel, les expressions et la manière d’occuper l’espace. Il ne s’agit donc pas uniquement d’attractivité physique.',
        levels: [
            'Votre présence tend à produire une première impression défavorable ou à mettre certaines personnes mal à l’aise avant même qu’elles apprennent à vous connaître.',
            'Au premier contact, vous vous fondez facilement dans la moyenne et ne produisez généralement pas d’impression particulièrement marquante.',
            'Votre apparence, votre attitude ou votre manière de vous présenter produisent généralement une impression favorable et vous rendent facilement mémorable.',
            'Votre présence attire spontanément les regards et suscite facilement intérêt ou curiosité lorsque vous entrez dans un nouvel environnement.',
            'Vous possédez une présence exceptionnellement marquante. Une rencontre, même brève, suffit généralement pour que l’on se souvienne de vous.',
        ],
    },
]

export const PHYSICAL_CRITERIA: {
    id: PhysicalCriterion
    title: string
    description: string
    levels: string[]
}[] = [
    {
        id: 'strength',
        title: 'Puissance physique',
        description: 'Capacité à mobiliser une force importante pour porter, soulever, pousser ou déplacer une charge.',
        levels: [
            'Soulever ou déplacer une charge d’environ 20 kg représente déjà un effort conséquent.',
            'Vous pouvez ponctuellement manipuler une charge d’environ 50 kg.',
            'Vous êtes capable de mobiliser une force dépassant les 100 kg dans des conditions favorables.',
            'Votre puissance physique est exceptionnelle et peut approcher la manipulation de charges de l’ordre de 200 kg.',
            'Votre force se situe à un niveau humain extrêmement rare, pouvant approcher les 300 kg.',
        ],
    },
    {
        id: 'dexterity',
        title: 'Coordination motrice',
        description: 'Maîtrise du corps, précision gestuelle, coordination œil-main, agilité et rapidité d’exécution.',
        levels: [
            'Votre coordination est limitée et les tâches demandant précision ou agilité peuvent facilement vous mettre en difficulté.',
            'Votre coordination correspond à celle de la plupart des adultes, sans difficulté ni aptitude particulière.',
            'Vos mouvements sont précis, assurés et naturellement bien coordonnés.',
            'Votre maîtrise corporelle pourrait correspondre à celle d’un danseur, acrobate, sportif ou professionnel fortement entraîné.',
            'Votre contrôle corporel, votre précision et votre fluidité de mouvement sont exceptionnellement rares.',
        ],
    },
    {
        id: 'stamina',
        title: 'Résistance à l’effort',
        description: 'Capacité à maintenir un effort, supporter la fatigue, l’inconfort et les contraintes physiques prolongées.',
        levels: [
            'Un effort soutenu provoque rapidement fatigue ou essoufflement.',
            'Vous supportez normalement les efforts et contraintes physiques du quotidien.',
            'Vous pouvez supporter une longue journée physiquement éprouvante ou plusieurs heures d’effort sans difficulté inhabituelle.',
            'Vous pouvez maintenir un effort intense ou supporter des conditions difficiles pendant une durée très supérieure à la moyenne.',
            'Votre résistance à l’épuisement, à la douleur et aux contraintes physiques est exceptionnelle.',
        ],
    },
]
