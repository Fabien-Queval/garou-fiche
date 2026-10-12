import type { AbilityDefinition, SpecialtySuggestion } from './talents'

const examples = (...labels: string[]): SpecialtySuggestion[] => labels.map(label => ({ label }))

export const SKILLS: AbilityDefinition[] = [
    {
        id: 'animalKen', label: 'Relation et conduite animale', presentationMode: 'stable', specialtyMode: 'normal',
        description: 'Capacité à comprendre le comportement d’un animal, instaurer une relation de confiance avec lui et, avec l’expérience nécessaire, lui apprendre des comportements ou tâches spécifiques.',
        levels: [
            'Vous savez adopter un comportement adapté avec des animaux domestiques.',
            'Vous avez déjà assuré leur éducation ou leur apprentissage de comportements simples.',
            'Vous êtes capable d’entraîner un animal pour une tâche spécialisée.',
        ],
        specialtySuggestions: examples('Fauconnerie', 'Animaux d’élevage', 'Animaux sauvages', 'Dressage de défense', 'Chevaux', 'Grands félins', 'Chiens'),
        intrusions: [], foreignFragments: ['les animaux sentent la Rage des Garou'],
    },
    {
        id: 'crafts', label: 'Fabrication et maintenance', presentationMode: 'stable', specialtyMode: 'requiredEarly',
        detailLabel: 'Domaine de spécialisation',
        description: 'Capacité pratique à fabriquer, modifier ou réparer des objets et équipements par un travail manuel ou technique.',
        levels: [
            'Vous savez réaliser ou réparer des éléments simples.',
            'Vous disposez déjà de méthodes et d’une pratique personnelle identifiable.',
            'Votre niveau vous permettrait de produire régulièrement un travail de qualité professionnelle.',
        ],
        specialtySuggestions: examples('Travail du bois', 'Dessin/peinture', 'Tissage', 'Sculpture', 'Travail du métal', 'Mécanique automobile'),
        intrusions: [], foreignFragments: ['fabrication de fetishes', 'esprits', 'Theurges', 'Weaponsmiths'],
    },
    {
        id: 'drive', label: 'Conduite de véhicules', presentationMode: 'stable', specialtyMode: 'normal',
        description: 'Maîtrise pratique de la conduite de véhicules routiers et capacité à s’adapter à différents types de véhicules, conditions de circulation ou terrains.',
        levels: [
            'Vous conduisez un véhicule courant dans des conditions normales.',
            'Vous êtes à l’aise avec différents véhicules ou conditions de conduite.',
            'Vous pouvez conduire des véhicules lourds ou spécialisés dans des situations exigeantes.',
        ],
        specialtySuggestions: examples('Hors-piste', 'Moto', 'Circulation dense', 'Conduite à grande vitesse'),
        intrusions: [], foreignFragments: ['road trip avec la pack'],
    },
    {
        id: 'etiquette', label: 'Codes sociaux et protocole', presentationMode: 'stable', specialtyMode: 'normal',
        description: 'Connaissance des règles de comportement, conventions sociales et usages permettant d’adapter correctement son attitude au contexte et aux personnes présentes.',
        levels: [
            'Vous savez généralement quand prendre la parole, écouter ou adopter une attitude plus réservée.',
            'Vous êtes à l’aise dans des environnements formels et avec leurs principaux codes.',
            'Vous savez évoluer naturellement dans des contextes sociaux très codifiés.',
        ],
        specialtySuggestions: examples('Haute société', 'Protocole', 'Usages communautaires', 'Environnement professionnel'),
        intrusions: [], foreignFragments: ['Silver Fangs', 'Moots', 'Tribal'],
    },
    {
        id: 'firearms', label: 'Maîtrise des armes à feu', presentationMode: 'hesitant', specialtyMode: 'normal',
        description: 'Formation et expérience dans la manipulation, l’entretien, l’identification et l’utilisation d’armes à feu individuelles.',
        levels: [
            'Vous avez reçu une initiation ou pratiquez occasionnellement le tir.',
            'Vous êtes un tireur régulier et maîtrisez correctement le maniement d’une arme.',
            'Vous possédez une expérience approfondie de plusieurs types d’armes et de situations opérationnelles.',
        ],
        specialtySuggestions: examples('Fusils', 'Pistolets', 'Armes automatiques', 'Armurerie', 'Tir de précision', 'Tir technique'),
        intrusionLabel: 'ARMES À FEU', anomalyIntensity: 0.8,
        intrusions: ['TUER', 'fusillade', 'cible', 'arme'],
        foreignFragments: ['klaive', 'dirigeant contaminé par le Wyrm', 'Wyrmspawn', 'odeur du Wyrm', 'souvenir des griffes'],
        fragmentIntrusions: ['TUER', 'cible', 'odeur du Wyrm', 'souvenir des griffes'],
    },
    {
        id: 'larceny', label: 'Techniques d’accès et de sécurisation', presentationMode: 'hesitant', specialtyMode: 'normal',
        description: 'Connaissance pratique des dispositifs de fermeture et de sécurité physique, de leur contournement et des méthodes permettant d’identifier ou exploiter leurs vulnérabilités.',
        levels: [
            'Vous connaissez les principes élémentaires du crochetage ou du contournement d’une fermeture simple.',
            'Vous maîtrisez plusieurs techniques d’accès, de diversion ou de contournement.',
            'Vous pouvez neutraliser des dispositifs de sécurité physique complexes avec suffisamment de temps.',
        ],
        specialtySuggestions: examples('Pickpocket', 'Diversion', 'Crochetage', 'Démarrage sans clé', 'Coffres-forts'),
        intrusionLabel: 'EFFRACTION', anomalyIntensity: 0.65,
        intrusions: ['EFFRACTION', 'VOL', 'CROCHETAGE'], foreignFragments: ['techniques criminelles', 'falsification', 'effraction'],
        fragmentIntrusions: ['VOL', 'CROCHETAGE'],
    },
    {
        id: 'melee', label: 'Maniement d’armes de contact', presentationMode: 'hesitant', specialtyMode: 'normal',
        description: 'Formation et expérience dans l’utilisation d’armes de contact telles que couteaux, bâtons, lances ou armes comparables.',
        levels: [
            'Vous savez manipuler une arme simple sans vous mettre immédiatement en danger.',
            'Vous avez déjà reçu un entraînement réel au combat armé.',
            'Votre niveau pourrait correspondre à celui d’un pratiquant confirmé d’escrime ou d’une discipline comparable.',
        ],
        specialtySuggestions: [...examples('Épées', 'Lances', 'Armes improvisées'), { label: 'Klaives', foreign: true }],
        intrusionLabel: 'ARME BLANCHE', anomalyIntensity: 0.75,
        intrusions: ['ARME BLANCHE', 'combat rapproché', 'tuer'],
        foreignFragments: ['klaives', 'lames-fétiches d’argent', 'armes naturelles Garou', 'Delirium', 'Ahroun'],
        fragmentIntrusions: ['combat rapproché', 'tuer', 'lames-fétiches d’argent'],
    },
    {
        id: 'performance', label: 'Pratique artistique', presentationMode: 'stable', specialtyMode: 'requiredEarly',
        detailLabel: 'Discipline principale',
        description: 'Maîtrise pratique d’une discipline artistique destinée à être présentée devant un public : musique, chant, danse, théâtre ou domaines comparables.',
        levels: [
            'Vous pratiquez régulièrement dans un contexte amateur.',
            'Vous pouvez vous produire devant un public avec assurance.',
            'Votre niveau pourrait vous permettre d’exercer professionnellement votre discipline.',
        ],
        specialtySuggestions: [...examples('Danse', 'Chant', 'Théâtre', 'Rock', 'Guitare', 'Opéra'), { label: 'Howling', foreign: true }],
        intrusions: [], foreignFragments: ['Howling'],
    },
    {
        id: 'stealth', label: 'Discrétion et déplacement furtif', presentationMode: 'hesitant', specialtyMode: 'normal',
        description: 'Capacité à se déplacer, observer ou rester présent dans un environnement en limitant sa visibilité, son bruit et les traces de son passage.',
        levels: [
            'Vous savez profiter efficacement de l’obscurité ou d’un couvert évident.',
            'Vous savez vous déplacer discrètement en utilisant votre environnement.',
            'Vous êtes capable de suivre quelqu’un ou de vous déplacer sans attirer facilement son attention.',
        ],
        specialtySuggestions: examples('Filature', 'Milieu urbain', 'Progression en tête', 'Foule', 'Dissimulation d’objets'),
        intrusionLabel: 'TRAQUER', anomalyIntensity: 0.6,
        intrusions: ['PROIE', 'traquer', 'chasser'], foreignFragments: ['Ragabash', 'assassins', 'prey'],
        fragmentIntrusions: ['PROIE', 'chasser'],
    },
    {
        id: 'survival', label: 'Autonomie en milieu isolé', presentationMode: 'stable', specialtyMode: 'normal',
        description: 'Capacité à subvenir à ses besoins, s’orienter et assurer sa sécurité dans un environnement naturel éloigné des infrastructures habituelles.',
        levels: [
            'Vous connaissez les bases d’une sortie ou d’un séjour simple en pleine nature.',
            'Vous savez identifier certaines ressources utiles et assurer vos besoins élémentaires.',
            'Vous pouvez suivre une piste, vous orienter avec des moyens improvisés et rester autonome dans un environnement difficile.',
        ],
        specialtySuggestions: examples('Recherche de nourriture', 'Pistage', 'Environnement particulier (arctique, désert, etc.)', 'Piégeage'),
        intrusions: [], foreignFragments: ['Lupus', 'survivre dans une meute de loups'],
    },
    {
        id: 'professionalSkill', label: 'Compétence professionnelle libre', presentationMode: 'stable', specialtyMode: 'custom',
        detailLabel: 'Précisez la compétence',
        description: 'Compétence enseignée, essentiellement pratique, qui n’entre pas dans les catégories précédentes.',
        levels: [
            'Vous avez reçu une initiation ou suivi un apprentissage.',
            'Vous maîtrisez correctement les fondamentaux.',
            'Votre niveau pourrait vous permettre d’en faire une activité professionnelle.',
        ],
        specialtySuggestions: examples('Tir à l’arc', 'Cuisine', 'Démolition', 'Escapologie', 'Jeux d’argent', 'Méditation', 'Pilotage d’aéronef'),
        intrusions: [], foreignFragments: [],
    },
]
