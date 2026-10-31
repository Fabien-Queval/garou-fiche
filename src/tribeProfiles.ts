import type { TribeId } from './umbraTribes'
import type { BackgroundId } from './backgrounds'

export type TribeProfile = {
    id: TribeId; pages: readonly [number, number]; manifesto: string; philosophy: string; identity: string;
    values: readonly string[]; tensions: readonly string[]; advice: string;
    totem: { name: string; meaning: string }; willpower: 3 | 4;
    creation: readonly string[]; restricted: readonly BackgroundId[]; minimumPureBreed?: number;
    originReview?: string; gifts: readonly string[];
}

// Synthèses HRP originales d'après le livre W20 fourni par Fabien.
// Pages imprimées de la VO ; références et méthode : docs/tribes/REFERENTIEL_TRIBUS_W20.md.
export const TRIBE_PROFILES = [
    {
        id: 'blackFuries', pages: [80, 81], manifesto: 'Défendre ce que personne ne devrait pouvoir posséder.',
        philosophy: 'Refuser la domination, protéger les femmes et garder vivants les derniers lieux sauvages. La fierté, la parole donnée et la capacité de changer le monde comptent autant que la colère.',
        identity: 'Une sororité enracinée dans les mythes grecs et d’Asie Mineure, aujourd’hui présente bien au-delà de ces terres. Ses cercles mêlent action, rites et transmission, avec des désaccords entre anciennes et nouvelles générations.',
        values: ['Dignité et autonomie', 'Solidarité', 'Protection du sauvage'],
        tensions: ['La justice peut devenir vengeance ; la haine des hommes n’est pourtant pas une vertu tribale.', 'Protéger les sanctuaires et agir auprès des femmes des villes ne mobilise pas toujours les mêmes priorités.'],
        advice: 'À jouer si vous voulez une protectrice ou un protecteur déterminé à transformer une injustice, avec une vie spirituelle et des liens de solidarité. Choisissez une cause concrète plutôt qu’une colère contre tout le monde.',
        totem: { name: 'Pégase', meaning: 'Un esprit de liberté et de nature indomptée, dont le refus du joug répond au combat des Furies.' },
        willpower: 3, restricted: [], originReview: 'Dans le cadre W20 standard, Pégase accepte les Garou femelles et fait une exception pour les mâles métis. Un autre concept demande une adaptation discutée avec le MJ.',
        creation: ['La fiche privilégie les aptitudes martiales, la Survie et les connaissances spirituelles ; ce sont des orientations, pas des minima imposés.'],
        gifts: ['Breath of the Wyld', 'Man’s Skin', 'Heightened Senses', 'Sense Wyrm', 'Wyld Resurgence'],
    },
    {
        id: 'boneGnawers', pages: [82, 83], manifesto: 'Personne ne survit seul avec les restes.',
        philosophy: 'La survie est une réussite, et les exclus valent davantage que le mépris qu’on leur porte. Les enfants du Rat savent récupérer des ressources, des liens et des chances que les autres abandonnent.',
        identity: 'Une Tribu cosmopolite des marges et des quartiers délaissés, avec des traditions de débrouille, des assemblées souvent démocratiques et des alliances inattendues. Son histoire porte aussi la révolte des opprimés.',
        values: ['Entraide concrète', 'Ingéniosité', 'Dignité des laissés-pour-compte'],
        tensions: ['Protéger ses proches peut conduire à abandonner ceux qui sont trop loin.', 'L’humour, la débrouille et le refus des hiérarchies cachent parfois la résignation ou des blessures durables.'],
        advice: 'Pour un personnage qui connaît le prix d’un repas, d’un abri ou d’un service rendu. Donnez-lui un réseau et une raison de se battre : la pauvreté ne résume pas sa personnalité.',
        totem: { name: 'Rat', meaning: 'Une figure maternelle de survivants nombreux, discrets et solidaires, liée aux esprits des rebuts et de la ville oubliée.' },
        willpower: 4, restricted: ['ancestors', 'pureBreed'],
        creation: ['Ancêtres et Lignée pure sont restreints dans la fiche W20.', 'Ressources est déconseillé, sans être présenté comme une interdiction. Adaptabilité et Survie sont valorisées.'],
        gifts: ['Cooking', 'Desperate Strength', 'Resist Toxin', 'Scent of Sweet Honey', 'Trash is Treasure'],
    },
    {
        id: 'childrenOfGaia', pages: [84, 85], manifesto: 'Réparer les liens fait aussi partie de la guerre.',
        philosophy: 'La compassion et la coopération peuvent empêcher la Nation Garou de se détruire elle-même. Chercher la paix n’empêche ni de reconnaître le danger ni de combattre lorsque cela devient nécessaire.',
        identity: 'Une Tribu issue de l’opposition aux massacres de l’Impergium, organisée autour d’Unicorn et de la recherche d’alliances. Ses membres servent de médiateurs entre des communautés qui se détestent parfois.',
        values: ['Compassion', 'Coopération', 'Responsabilité dans la violence'],
        tensions: ['Pardonner peut ouvrir un avenir ou laisser un agresseur recommencer.', 'Le refus de la guerre n’efface pas la Rage et les griffes du Garou.'],
        advice: 'Pour négocier, soigner, réunir ou défendre sans faire de la brutalité une identité. Préparez ce que votre personnage refuse de sacrifier pour obtenir la paix.',
        totem: { name: 'Licorne', meaning: 'Un esprit de pureté et de compassion, capable aussi de férocité pour défendre ce qui doit l’être.' },
        willpower: 4, restricted: [], creation: ['La fiche valorise les aptitudes sociales et l’empathie, tout en conservant des compétences de combat. Elle n’ajoute pas de restriction d’Historique.'],
        gifts: ['Brother’s Scent', 'Jam Weapon', 'Mercy', 'Mother’s Touch', 'Resist Pain'],
    },
    {
        id: 'fianna', pages: [86, 87], manifesto: 'Faire vivre la mémoire, pas seulement la conserver.',
        philosophy: 'Joie, deuil, amour et combat font partie d’une même vie. Chanter les histoires et transmettre les leçons du passé aide à défendre ce qui rend cette vie précieuse.',
        identity: 'Les enfants du Cerf entretiennent un fort héritage celtique et des traditions de conte, de musique et de fêtes. Leurs liens familiaux, leurs passions et de vieilles rivalités nourrissent autant leurs exploits que leurs conflits.',
        values: ['Mémoire vivante', 'Loyauté', 'Intensité de la vie'],
        tensions: ['La passion peut devenir excès, jalousie ou rancune.', 'Célébrer son héritage peut conduire à refuser une place à ceux qui ne lui ressemblent pas.'],
        advice: 'Pour un gardien de mémoire, un artiste, un compagnon loyal ou un héros passionné. Votre personnage n’a pas besoin d’être un fêtard : ce qui compte est ce qu’il aime assez pour le transmettre.',
        totem: { name: 'Cerf', meaning: 'La vitalité, la fécondité et la joie d’exister, liées aux esprits des animaux et des cycles naturels.' },
        willpower: 3, restricted: [], creation: ['La fiche indique explicitement l’absence de restriction d’Historique. Les aptitudes sociales et la Représentation sont encouragées.'],
        gifts: ['Faerie Light', 'Hare’s Leap', 'Persuasion', 'Resist Toxin', 'Two Tongues'],
    },
    {
        id: 'getOfFenris', pages: [88, 89], manifesto: 'Être assez fort pour tenir quand tout cède.',
        philosophy: 'La valeur se prouve par le courage, l’endurance et les actes. Les Fenrir se préparent à une guerre sans douceur, où celui qui promet de défendre les siens doit pouvoir en payer le prix.',
        identity: 'Une tradition guerrière d’origine germanique et nordique, portée par les récits des skalds et des rites exigeants. La seule ascendance ne suffit pas : chaque membre doit démontrer sa valeur.',
        values: ['Courage', 'Endurance', 'Preuve par les actes'],
        tensions: ['Le culte de la force peut transformer la protection en humiliation des plus faibles.', 'Une mort glorieuse n’est pas toujours la meilleure manière de servir ceux qui restent.'],
        advice: 'Pour un combattant qui prend au sérieux ses engagements, quel que soit son Auspice. Définissez ce que signifie être fort en dehors du fait de gagner une bagarre.',
        totem: { name: 'Fenris', meaning: 'Le Grand Loup incarne une puissance de guerre redoutable, accompagnée d’esprits de combat et de sagesse.' },
        willpower: 3, restricted: [], creation: ['La fiche met en avant le combat et la survie. Contacts y est très rarement choisi : la Tribu préfère les amitiés éprouvées aux simples relations. Ce n’est pas un seuil mécanique.'],
        gifts: ['Lightning Reflexes', 'Master of Fire', 'Razor Claws', 'Resist Pain', 'Visage of Fenris'],
    },
    {
        id: 'glassWalkers', pages: [90, 91], manifesto: 'La ville est vivante. Apprenons à la défendre.',
        philosophy: 'Les réalisations humaines et les villes peuvent être comprises et transformées. S’adapter, négocier avec les esprits technologiques et utiliser les outils modernes peut servir Gaia.',
        identity: 'Une Tribu urbaine qui a changé de nom avec les époques. Ses traditions empruntent aux organisations humaines, aux réseaux et aux machines ; son identité repose sur l’adaptation plutôt que sur le maintien des formes anciennes.',
        values: ['Adaptation', 'Innovation', 'Écologie urbaine'],
        tensions: ['Faire fonctionner un système peut finir par faire oublier qui il écrase.', 'La fascination pour le progrès expose aux dépendances du Tisserand et éloigne de certaines mémoires spirituelles.'],
        advice: 'Pour agir sur des institutions, des réseaux ou des techniques contemporaines. Le personnage peut être ingénieur, conducteur, organisateur ou négociateur : l’informatique n’est pas son unique porte d’entrée.',
        totem: { name: 'Cafard', meaning: 'L’adaptation et la survie dans un monde en transformation, avec un entourage d’esprits technologiques.' },
        willpower: 3, restricted: ['ancestors', 'pureBreed'],
        creation: ['Ancêtres et Lignée pure sont restreints ; Mentor est déconseillé.', 'La fiche mentionne fréquemment Ressources et des aptitudes modernes, sans en faire un minimum obligatoire.'],
        gifts: ['Control Simple Machine', 'Diagnostics', 'Persuasion', 'Plug and Play', 'Trick Shot'],
    },
    {
        id: 'redTalons', pages: [92, 93], manifesto: 'Le sauvage n’a pas à demander la permission de vivre.',
        philosophy: 'Les loups et leurs territoires subissent une expansion humaine qui paraît sans limite. Les Griffes Rouges défendent cette vie menacée avec un regard d’abord lupin et une hostilité souvent radicale envers l’humanité.',
        identity: 'Une Tribu presque entièrement née parmi les loups, organisée autour de la famille-meute et de la chasse. Elle possède langage, techniques et rites Garou ; elle choisit de ne pas donner aux usages humains la première place.',
        values: ['Vie sauvage', 'Territoire', 'Loyauté à la meute'],
        tensions: ['Défendre les loups peut se muer en haine aveugle de tout humain.', 'Le besoin de coopérer avec la Nation se heurte au rejet de sa part humaine.'],
        advice: 'Pour explorer une intelligence lupine et un rapport au territoire. C’est un concept à préparer avec le MJ et la meute : une hostilité permanente envers les autres personnages ne suffit pas à le rendre jouable.',
        totem: { name: 'Griffon', meaning: 'La colère du monde animal et l’excellence du prédateur, alliées à des esprits anciens de la chasse.' },
        willpower: 3, restricted: ['resources'], originReview: 'La Tribu W20 est composée de lupus et de quelques métis ; elle n’accepte normalement pas les homidés. L’origine du personnage est à examiner avec le MJ.',
        creation: ['Ressources est restreint. Alliés et Contacts sont déconseillés ; la Parentèle de la Tribu est exclusivement lupine.'],
        gifts: ['Beast Speech', 'Eye of the Hunter', 'Hidden Killer', 'Scent of Running Water', 'Wolf at the Door'],
    },
    {
        id: 'shadowLords', pages: [94, 95], manifesto: 'L’autorité doit être capable d’obtenir des résultats.',
        philosophy: 'Le pouvoir doit appartenir à ceux qui savent le prendre et l’exercer. Les Seigneurs de l’Ombre valorisent la compétence, la stratégie et la capacité de faire aboutir une décision, même au prix de méthodes contestables.',
        identity: 'Une Tribu de hiérarchies rigoureuses, de rivalités et de formation politique. Les traditions d’Europe orientale côtoient un pragmatisme prêt à remettre en cause un chef qui ne mérite plus son rang.',
        values: ['Compétence', 'Stratégie', 'Maîtrise des rapports de pouvoir'],
        tensions: ['La recherche d’efficacité peut justifier la cruauté et la manipulation.', 'Une hiérarchie fondée sur le mérite peut devenir un système où chacun redoute d’être trahi.'],
        advice: 'Pour un stratège, un organisateur ou un chef qui veut peser sur le cours des événements. Construisez une loyauté réelle envers la meute : jouer politique n’oblige pas à saboter ses partenaires.',
        totem: { name: 'Grand-père Tonnerre', meaning: 'Un esprit d’orage exigeant une hiérarchie claire, dont les corbeaux de tempête sont des alliés emblématiques.' },
        willpower: 3, restricted: [], creation: ['Alliés et Mentor sont déconseillés, sans être indiqués comme des interdictions. Les aptitudes mentales, la ruse et la persuasion sont valorisées.'],
        gifts: ['Aura of Confidence', 'Fatal Flaw', 'Seizing the Edge', 'Shadow Weaving', 'Whisper Catching'],
    },
    {
        id: 'silentStriders', pages: [96, 97], manifesto: 'Porter jusqu’aux autres ce qu’ils doivent savoir.',
        philosophy: 'Voyager, écouter et transmettre ce que d’autres ne peuvent atteindre. Les Arpenteurs prennent en charge des nouvelles dangereuses et des dettes envers les morts, malgré l’exil qui les prive d’un véritable foyer.',
        identity: 'Une tradition venue notamment d’Égypte, d’Afrique et du Moyen-Orient, marquée par la malédiction de Sutekh. Messagers et éclaireurs, ses membres rencontrent aussi les fantômes qui hantent leurs routes.',
        values: ['Transmission', 'Vigilance', 'Devoir envers les oubliés'],
        tensions: ['Le besoin de repartir complique les liens durables et la vie de meute.', 'Le poids du passé et la vengeance peuvent détourner du message qu’il fallait porter.'],
        advice: 'Pour un messager, un enquêteur ou un voyageur hanté. Décidez pourquoi il reste avec cette meute : l’errance devient alors une tension à jouer plutôt qu’un prétexte à quitter les autres.',
        totem: { name: 'Hibou', meaning: 'Un chasseur nocturne silencieux, lié à la sagesse, aux passages discrets et à de petits esprits singuliers.' },
        willpower: 3, restricted: ['ancestors'], creation: ['Ancêtres est restreint en raison de la malédiction de Sutekh. Ressources est déconseillé.'],
        gifts: ['Heaven’s Guidance', 'Sense Wyrm', 'Silence', 'Speed of Thought', 'Visions of Duat'],
    },
    {
        id: 'silverFangs', pages: [98, 99], manifesto: 'Hériter du commandement oblige à en être digne.',
        philosophy: 'L’héritage héroïque confère une responsabilité envers la Nation Garou. Un véritable chef doit inspirer et servir, pas seulement réclamer les honneurs attachés à son nom.',
        identity: 'Une aristocratie Garou organisée en Maisons, cours et loges, attachée aux lignées prestigieuses. Des héros sincères y côtoient des dirigeants prisonniers du protocole, des privilèges et des blessures de leur héritage.',
        values: ['Service', 'Continuité', 'Exemplarité du commandement'],
        tensions: ['Le prestige ancestral peut remplacer l’exigence de mérite personnel.', 'Préserver une lignée et ses institutions peut conduire à protéger ce qui devrait changer.'],
        advice: 'Pour un héritier qui veut mériter sa place, ou qui découvre le prix de sa fonction. Son nom peut créer autant d’obligations que d’avantages ; donnez à ses compagnons une raison de lui faire confiance.',
        totem: { name: 'Faucon', meaning: 'La hauteur de vue et le commandement, avec des alliés aviaires et solaires.' },
        willpower: 3, restricted: [], minimumPureBreed: 3,
        creation: ['La fiche W20 impose au moins trois points d’Historique en Lignée pure pour appartenir à la Tribu. Ce minimum doit être concilié avec les points déjà répartis.'],
        gifts: ['Eye of the Falcon', 'Falcon’s Grasp', 'Inspiration', 'Lambent Flame', 'Sense Wyrm'],
    },
    {
        id: 'stargazers', pages: [100, 101], manifesto: 'Apprendre à diriger sa Rage plutôt qu’à lui appartenir.',
        philosophy: 'Chercher l’équilibre entre humain et loup, matière et esprit, Rage et Gnose. La compréhension de soi est une discipline exigeante qui doit aussi servir quand la guerre ne peut plus attendre.',
        identity: 'Une petite Tribu dont le cœur spirituel se situe autour de l’Inde et de l’Himalaya. Méditation, philosophie, rêves et disciplines martiales s’y rencontrent, dans un dialogue entre traditions humaines et nature lupine.',
        values: ['Équilibre', 'Lucidité', 'Discipline intérieure'],
        tensions: ['Chercher la maîtrise parfaite peut devenir une manière de différer l’action.', 'Le détachement peut éclairer les relations ou les appauvrir.'],
        advice: 'Pour un contemplatif qui agit, un combattant discipliné ou un chercheur de sens. Jouez les efforts et les échecs de sa maîtrise ; il n’a pas à être un sage infaillible.',
        totem: { name: 'Chimère', meaning: 'Une présence multiple des rêves et de la sagesse, difficile à enfermer dans une seule forme.' },
        willpower: 4, restricted: [], creation: ['Mentor est courant. L’ascétisme rend Fétiche et Ressources rares ; les attaches d’Alliés sont souvent évitées. La fiche ne les présente pas comme des interdictions.'],
        gifts: ['Balance', 'Channeling', 'Falling Touch', 'Iron Resolve', 'Sense Wyrm'],
    },
    {
        id: 'uktena', pages: [102, 103], manifesto: 'Comprendre ce qui se cache pour pouvoir le contenir.',
        philosophy: 'La connaissance des mystères peut protéger là où la force ne suffit pas. Les Uktena gardent, recherchent et transmettent des savoirs spirituels, y compris sur les horreurs qu’ils doivent surveiller.',
        identity: 'Une des Tribus des Premiers Peuples des Amériques, qui a ensuite accueilli des lignées issues d’autres cultures opprimées et de traditions animistes. Sa mémoire de la dépossession accompagne une grande diversité de pratiques.',
        values: ['Savoir spirituel', 'Mémoire', 'Vigilance face aux secrets'],
        tensions: ['Garder les secrets peut protéger les autres ou les priver d’un savoir nécessaire.', 'Étudier la corruption expose à la tentation de la maîtriser plutôt que de la combattre.'],
        advice: 'Pour un enquêteur de l’invisible, un gardien de rites ou un chercheur de savoirs perdus. Choisissez ce qu’il refuse d’apprendre ou d’utiliser, et construisez son ancrage culturel avec le MJ.',
        totem: { name: 'Uktena', meaning: 'Un esprit fluvial prenant la forme d’un serpent cornu, nourricier autant que tempétueux.' },
        willpower: 3, restricted: [], creation: ['Les aptitudes mentales, l’Occultisme, les rites et les fétiches sont valorisés. La fiche n’ajoute pas de minimum d’Historique.'],
        gifts: ['Sense Magic', 'Sense Wyrm', 'Shroud', 'Spirit of the Lizard', 'Spirit Speech'],
    },
    {
        id: 'wendigo', pages: [104, 105], manifesto: 'Tenir pour ceux dont on a déjà trop pris.',
        philosophy: 'Défendre les terres, les proches et les traditions menacées par la dépossession et la corruption. La mémoire des violences subies nourrit une volonté farouche de ne plus céder.',
        identity: 'Une Tribu issue des peuples autochtones d’Amérique du Nord, marquée par la colonisation et les conflits avec d’autres Garou. Chasse, hiver, rites de purification et liens communautaires structurent sa vie spirituelle.',
        values: ['Terre et communauté', 'Mémoire des pertes', 'Résistance'],
        tensions: ['La fidélité à la mémoire peut se figer en haine héréditaire.', 'Vouloir préserver la pureté peut rendre presque toute coopération suspecte.'],
        advice: 'Pour un défenseur ancré dans une communauté et son histoire. Construisez cet ancrage avec précision et respect ; une culture vivante ne se réduit ni à un costume ni à une colère abstraite.',
        totem: { name: 'Wendigo', meaning: 'L’esprit cannibale de l’hiver, associé à la faim, à la chasse et à une colère aussi froide que tenace.' },
        willpower: 4, restricted: [], creation: ['Contacts et Ressources sont déconseillés. Les aptitudes de chasse, de combat et de survie sont particulièrement valorisées.'],
        gifts: ['Beat of the Heart-Drum', 'Call the Breeze', 'Camouflage', 'Ice Echo', 'Resist Pain'],
    },
] as const satisfies readonly TribeProfile[]

export type GiftSummary = { page: number; summary: string }
export const TRIBAL_GIFTS: Record<string, GiftSummary> = {
    'Breath of the Wyld': { page: 173, summary: 'Insuffle vitalité et clarté mentale à un autre être vivant.' },
    'Man’s Skin': { page: 173, summary: 'Modifie la présentation perçue du genre aux yeux des témoins.' },
    'Heightened Senses': { page: 158, summary: 'Affûte les sens jusqu’à une acuité surnaturelle.' },
    'Sense Wyrm': { page: 156, summary: 'Perçoit des manifestations proches du Ver ; ce n’est pas une preuve automatique de culpabilité.' },
    'Wyld Resurgence': { page: 173, summary: 'Mobilise l’énergie du Sauvage pour accélérer la guérison de ses blessures.' },
    'Cooking': { page: 174, summary: 'Transforme des rebuts en une nourriture peu appétissante mais nourrissante.' },
    'Desperate Strength': { page: 174, summary: 'Puise dans ses dernières réserves pour un surcroît de force.' },
    'Resist Toxin': { page: 174, summary: 'Renforce la résistance du corps aux toxines.' },
    'Scent of Sweet Honey': { page: 174, summary: 'Attire une nuée de petites bêtes sur une cible touchée récemment.' },
    'Trash is Treasure': { page: 175, summary: 'Remet temporairement en fonctionnement un objet cassé.' },
    'Brother’s Scent': { page: 177, summary: 'Aide à passer pour une présence normale auprès de personnes qui ne cherchent pas un intrus.' },
    'Jam Weapon': { page: 177, summary: 'Empêche des armes issues du Tisserand de fonctionner à portée de voix.' },
    'Mercy': { page: 177, summary: 'Permet de combattre avec ses armes naturelles en limitant leur caractère meurtrier.' },
    'Mother’s Touch': { page: 164, summary: 'Soigne par le toucher un autre être vivant, pas soi-même ni les esprits ou les morts-vivants.' },
    'Resist Pain': { page: 166, summary: 'Permet d’agir malgré la douleur des blessures, sans les guérir.' },
    'Faerie Light': { page: 178, summary: 'Conjure une petite lumière mobile pour éclairer ou attirer l’attention.' },
    'Hare’s Leap': { page: 158, summary: 'Permet des bonds d’une ampleur impossible à un corps ordinaire.' },
    'Persuasion': { page: 153, summary: 'Donne aux paroles une force de conviction surnaturelle.' },
    'Two Tongues': { page: 179, summary: 'Mène deux conversations différentes à la fois, en choisissant qui entend laquelle.' },
    'Lightning Reflexes': { page: 180, summary: 'Facilite le passage immédiat d’une attaque à une réaction défensive.' },
    'Master of Fire': { page: 152, summary: 'Réduit la gravité des brûlures infligées par le feu.' },
    'Razor Claws': { page: 171, summary: 'Aiguise ses griffes pour les rendre plus dangereuses.' },
    'Visage of Fenris': { page: 180, summary: 'Prend une apparence plus imposante pour inspirer respect ou crainte.' },
    'Control Simple Machine': { page: 182, summary: 'Commande aux esprits de mécanismes simples pour les actionner.' },
    'Diagnostics': { page: 182, summary: 'Identifie la panne d’une machine et aide à la réparer avec son esprit.' },
    'Plug and Play': { page: 183, summary: 'Rend des appareils compatibles au-delà des limites techniques habituelles.' },
    'Trick Shot': { page: 183, summary: 'Permet des tirs de précision spectaculaires, sans blesser directement une cible avec ce Don.' },
    'Beast Speech': { page: 169, summary: 'Permet de communiquer avec les animaux sans imposer leur obéissance.' },
    'Eye of the Hunter': { page: 185, summary: 'Repère les membres les plus forts et les plus faibles d’un groupe visible.' },
    'Hidden Killer': { page: 185, summary: 'Dissimule les traces physiques qui relieraient le Garou à une mise à mort.' },
    'Scent of Running Water': { page: 161, summary: 'Masque son odeur pour rendre une poursuite olfactive très difficile.' },
    'Wolf at the Door': { page: 185, summary: 'Inspire à un humain une crainte profonde du monde sauvage.' },
    'Aura of Confidence': { page: 188, summary: 'Protège son assurance et dissimule ses failles à certaines lectures surnaturelles.' },
    'Fatal Flaw': { page: 188, summary: 'Décèle une faiblesse de l’adversaire pour prendre l’avantage au combat.' },
    'Seizing the Edge': { page: 188, summary: 'Fait pencher en sa faveur une opposition qui se terminerait à égalité.' },
    'Shadow Weaving': { page: 188, summary: 'Façonne les ombres pour se cacher, intimider ou modifier l’atmosphère d’un lieu.' },
    'Whisper Catching': { page: 189, summary: 'Permet de surprendre surnaturellement des conversations chuchotées.' },
    'Heaven’s Guidance': { page: 191, summary: 'Donne un sens de l’orientation et du chemin parcouru sous les étoiles.' },
    'Silence': { page: 191, summary: 'Étouffe les sons que produit le Garou.' },
    'Speed of Thought': { page: 191, summary: 'Accroît fortement sa vitesse de course.' },
    'Visions of Duat': { page: 191, summary: 'Accorde la perception du paysage des morts.' },
    'Eye of the Falcon': { page: 193, summary: 'Donne à la vision la précision d’un oiseau de proie.' },
    'Falcon’s Grasp': { page: 193, summary: 'Renforce la prise des mains ou des mâchoires pour retenir une cible.' },
    'Inspiration': { page: 171, summary: 'Communique sa résolution et son courage à ses compagnons.' },
    'Lambent Flame': { page: 193, summary: 'Enveloppe le corps d’une lumière argentée surnaturelle.' },
    'Balance': { page: 195, summary: 'Permet de garder l’équilibre sur des appuis étroits ou glissants.' },
    'Channeling': { page: 195, summary: 'Concentre sa Rage dans l’accomplissement d’une action.' },
    'Falling Touch': { page: 170, summary: 'Renverse un adversaire par un simple contact.' },
    'Iron Resolve': { page: 195, summary: 'Renforce la détermination pour accomplir des efforts de volonté exceptionnels.' },
    'Sense Magic': { page: 196, summary: 'Perçoit des énergies mystiques sans en révéler systématiquement la nature exacte.' },
    'Shroud': { page: 197, summary: 'Crée une zone d’obscurité dans laquelle le Garou conserve sa vision.' },
    'Spirit of the Lizard': { page: 197, summary: 'Permet d’adhérer aux surfaces et de grimper jusque sous un plafond.' },
    'Spirit Speech': { page: 164, summary: 'Permet de parler avec les esprits, sans garantir leur bienveillance.' },
    'Beat of the Heart-Drum': { page: 199, summary: 'Poursuit une proie en suivant surnaturellement les battements de son cœur.' },
    'Call the Breeze': { page: 199, summary: 'Appelle et dirige un vent froid capable de disperser brumes ou nuées.' },
    'Camouflage': { page: 199, summary: 'Se fond dans le paysage sauvage pour échapper aux regards.' },
    'Ice Echo': { page: 200, summary: 'Projette un double illusoire visible et audible, mais sans corps, odeur ni chaleur.' },
}

export function getTribeProfile(id: TribeId): TribeProfile {
    return TRIBE_PROFILES.find(profile => profile.id === id)!
}

export function tribeCreationReview(id: TribeId, values: Partial<Record<BackgroundId, number>> = {}) {
    const profile = getTribeProfile(id)
    const issues: string[] = []
    if (profile.originReview) issues.push(profile.originReview)
    for (const background of profile.restricted) {
        if ((values[background] ?? 0) > 0) {
            const label = { ancestors: 'Ancêtres', pureBreed: 'Lignée pure', resources: 'Ressources' }[background as 'ancestors' | 'pureBreed' | 'resources']
            issues.push(`${label} comporte déjà des points dans votre dossier, alors que la fiche W20 de cette Tribu le restreint. Conservez votre préférence et voyez l’adaptation avec le MJ.`)
        }
    }
    if (profile.minimumPureBreed && (values.pureBreed ?? 0) < profile.minimumPureBreed) issues.push('La Lignée pure de votre dossier est inférieure au minimum de trois demandé par W20. Le MJ pourra discuter avec vous de la répartition ou d’une adaptation de campagne.')
    return issues
}
