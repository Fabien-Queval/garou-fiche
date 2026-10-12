import type { AbilityDefinition, SpecialtySuggestion } from './talents'

const examples = (...labels: string[]): SpecialtySuggestion[] => labels.map(label => ({ label }))

export const KNOWLEDGES: AbilityDefinition[] = [
    {
        id: 'academics', label: 'Culture et sciences humaines', presentationMode: 'stable', specialtyMode: 'requiredEarly',
        detailLabel: 'Domaine principal',
        description: 'Connaissances structurées dans les domaines des lettres, de l’histoire, des arts, de la philosophie, des langues et plus largement des sciences humaines.',
        levels: [
            'Vous possédez des connaissances de base dans plusieurs domaines de culture générale ou de sciences humaines.',
            'Vous disposez d’une culture solide et savez replacer œuvres, idées ou événements dans leur contexte.',
            'Vous possédez une expertise suffisamment approfondie pour produire un travail académique sérieux dans votre domaine.',
        ],
        specialtySuggestions: examples('Théorie des couleurs', 'Linguistique', 'Poststructuralisme', 'Éthique', 'Métaphysique', 'Civilisation sumérienne'),
        intrusions: [], foreignFragments: [],
    },
    {
        id: 'computer', label: 'Informatique', presentationMode: 'stable', specialtyMode: 'normal',
        description: 'Maîtrise des outils informatiques, systèmes d’exploitation, logiciels, Internet et, à un niveau avancé, développement ou analyse de systèmes numériques.',
        levels: [
            'Vous utilisez avec aisance les appareils et logiciels informatiques courants.',
            'Vous êtes à l’aise avec différents systèmes, logiciels et outils techniques, y compris en ligne de commande.',
            'Vous êtes capable de développer des applications ou sites, écrire des logiciels spécifiques et assurer un support technique avancé.',
        ],
        specialtySuggestions: examples('Recherche Internet', 'Montage vidéo', 'Retouche d’image', 'Programmation', 'Langages informatiques'),
        intrusions: [], foreignFragments: ['pack'],
    },
    {
        id: 'enigmas', label: 'Résolution de problèmes complexes', presentationMode: 'stable', specialtyMode: 'normal',
        description: 'Capacité à résoudre des énigmes, problèmes logiques ou situations complexes en combinant raisonnement, informations disparates et pensée latérale.',
        levels: [
            'Vous pratiquez régulièrement des jeux, énigmes ou problèmes de logique.',
            'Vous savez identifier la logique cachée d’un problème et anticiper certains dénouements.',
            'Vous êtes particulièrement efficace lorsqu’il faut croiser indices, connaissances et intuition pour résoudre une situation complexe.',
        ],
        specialtySuggestions: examples('Problèmes logiques', 'Pensée latérale', 'Mystères anciens'),
        intrusions: [], foreignFragments: ['spirits', 'pack', 'Theurge', 'Things Werewolves Were Not Meant to Know'],
        fragmentIntrusions: ['spirits'], anomalyIntensity: 0.25,
    },
    {
        id: 'investigation', label: 'Investigation', presentationMode: 'stable', specialtyMode: 'normal',
        description: 'Capacité à rechercher, recouper et interpréter des éléments matériels ou testimoniaux afin de reconstituer des faits et établir un scénario cohérent.',
        levels: [
            'Vous savez effectuer efficacement des recherches ciblées et exploiter les premières informations disponibles.',
            'Vous savez identifier les incohérences d’un dossier ou d’un récit et dégager des pistes pertinentes.',
            'Votre niveau pourrait correspondre à celui d’un enquêteur professionnel.',
        ],
        specialtySuggestions: examples('Indices matériels', 'Balistique', 'Médecine légale', 'Empreintes', 'Recherche documentaire', 'Investigation en ligne'),
        intrusions: [], foreignFragments: [],
    },
    {
        id: 'law', label: 'Droit et réglementation', presentationMode: 'stable', specialtyMode: 'normal',
        description: 'Connaissance des systèmes juridiques, procédures, réglementations et mécanismes permettant d’interpréter ou appliquer une norme.',
        levels: [
            'Vous connaissez les grands principes du système juridique.',
            'Vous possédez une connaissance avancée des règles, procédures et mécanismes juridiques.',
            'Vous pourriez conseiller professionnellement autrui dans un domaine juridique ou réglementaire.',
        ],
        specialtySuggestions: examples('Droit pénal', 'Responsabilité civile', 'Procédures', 'Sanctions'),
        intrusions: [], foreignFragments: ['Litany', 'sept', 'Philodox', 'Garou law', 'Garou Nation', 'Truthcatcher'],
        fragmentIntrusions: ['Litany'], anomalyIntensity: 0.3,
    },
    {
        id: 'medicine', label: 'Sciences médicales', presentationMode: 'stable', specialtyMode: 'normal',
        description: 'Connaissances relatives au fonctionnement de l’organisme, à l’identification des pathologies ou blessures et aux méthodes permettant leur prise en charge.',
        levels: [
            'Vous connaissez les premiers secours et les gestes élémentaires de prise en charge.',
            'Votre niveau pourrait correspondre à celui d’un étudiant avancé ou d’un professionnel paramédical.',
            'Avec les qualifications administratives adéquates, vos connaissances pourraient correspondre à celles d’un médecin généraliste.',
        ],
        specialtySuggestions: [...examples('Médecine d’urgence', 'Médecine légale', 'Neurologie', 'Pharmacologie', 'Toxicologie'), { label: 'Garou Physiology', foreign: true }],
        intrusions: [], foreignFragments: ['Garou Physiology', 'Theurge'],
        fragmentIntrusions: ['Garou Physiology'], anomalyIntensity: 0.35,
    },
    {
        id: 'occult', label: 'Études ésotériques', presentationMode: 'hesitant', specialtyMode: 'normal',
        description: 'Connaissances relatives aux traditions ésotériques, croyances, phénomènes inexpliqués, systèmes divinatoires et courants mystiques.',
        levels: [
            'Vous connaissez les principales références de plusieurs traditions ésotériques ou phénomènes inexpliqués.',
            'Vous avez étudié plusieurs de ces domaines et savez distinguer leurs principaux courants ou interprétations.',
            'Vous possédez une connaissance approfondie du sujet et savez évaluer avec recul la crédibilité d’informations nouvelles.',
        ],
        specialtySuggestions: [...examples('Tarot', 'Sorcellerie', 'Malédictions', 'Fantômes', 'Psychométrie'), { label: 'Garou Lore', foreign: true }],
        intrusionLabel: 'OCCULTE', anomalyIntensity: 0.55,
        intrusions: ['phénomènes inexpliqués'], foreignFragments: ['spirits', 'vampires', 'truths', 'Garou Lore'],
        fragmentIntrusions: ['truths', 'spirits'],
    },
    {
        id: 'rituals', label: 'Traditions et pratiques rituelles', presentationMode: 'foreign', specialtyMode: 'normal',
        description: 'Connaissance des traditions, cérémonies et protocoles propres à une communauté structurée, ainsi que des comportements attendus lors de leur mise en œuvre.',
        levels: [
            'Vous avez déjà observé attentivement plusieurs cérémonies ou pratiques codifiées.',
            'Vous connaissez suffisamment leurs règles pour participer correctement à des rassemblements formels.',
            'Votre maîtrise de ces traditions est reconnue par d’autres pratiquants expérimentés.',
        ],
        specialtySuggestions: [
            { label: 'Accord' }, { label: 'Caern', foreign: true }, { label: 'Mort' }, { label: 'Mystique' },
            { label: 'Punition' }, { label: 'Renommée', foreign: true }, { label: 'Saisonnier' }, { label: 'Mineur' },
        ],
        intrusionLabel: 'RITUELS', anomalyIntensity: 1,
        intrusions: ['RITUELS'],
        foreignFragments: ['Rage', 'Garou', 'rites', 'elders', 'spirit magic', 'moot', 'Black Spiral Dancers', 'Umbra', 'Caern', 'Renown'],
        fragmentIntrusions: ['rites', 'spirit magic', 'Umbra', 'Caern'],
    },
    {
        id: 'science', label: 'Sciences', presentationMode: 'stable', specialtyMode: 'requiredEarly',
        detailLabel: 'Domaine scientifique',
        description: 'Connaissances scientifiques fondées sur l’observation, la formulation d’hypothèses, l’expérimentation et l’analyse méthodique des résultats.',
        levels: [
            'Vous connaissez les principes fondamentaux de votre domaine scientifique.',
            'Vous savez les appliquer à des situations concrètes.',
            'Votre niveau vous permettrait d’enseigner ou d’expliquer professionnellement les principes de votre spécialité.',
        ],
        specialtySuggestions: examples('Méthodologie expérimentale', 'Théorie', 'Chimie', 'Physique', 'Biologie', 'Mathématiques', 'Astronomie'),
        intrusions: [], foreignFragments: [],
    },
    {
        id: 'technology', label: 'Technologies et électronique', presentationMode: 'stable', specialtyMode: 'requiredEarly',
        detailLabel: 'Domaine technologique',
        description: 'Connaissances appliquées en électronique, matériel informatique, télécommunications et systèmes techniques reposant sur des composants électroniques.',
        levels: [
            'Vous savez effectuer certaines réparations ou modifications simples.',
            'Votre maîtrise pourrait vous permettre d’exercer professionnellement dans la maintenance de systèmes électroniques ou informatiques.',
            'Vous pouvez concevoir ou modifier des équipements pour répondre à un besoin technique précis.',
        ],
        specialtySuggestions: examples('Télécommunications', 'Informatique', 'Sécurité', 'Communications', 'Prototypage / réparation improvisée', 'Espionnage industriel'),
        intrusions: [], foreignFragments: ['Glass Walkers'],
    },
    {
        id: 'expertKnowledge', label: 'Domaine d’expertise libre', presentationMode: 'stable', specialtyMode: 'custom',
        detailLabel: 'Précisez votre domaine d’expertise',
        description: 'Domaine intellectuel ou académique spécialisé qui n’entre pas dans les catégories précédentes.',
        levels: [
            'Vous avez étudié le sujet par lectures, cours ou recherche personnelle.',
            'Vous possédez une connaissance structurée et approfondie de ce domaine.',
            'Vous maîtrisez suffisamment sa littérature et ses concepts pour disposer d’une réelle expertise.',
        ],
        specialtySuggestions: [...examples('Archéologie', 'Psychologie', 'Cosmologie', 'Connaissance d’une région'), { label: 'Wyrm Lore', foreign: true }],
        intrusions: [], foreignFragments: ['Wyrm Lore'],
    },
]
