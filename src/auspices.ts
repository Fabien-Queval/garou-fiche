import type { UmbraDraft } from './umbraQuestionnaire'
import { validTribeChoice } from './tribeSelection.ts'
import { UMBRA_QUESTIONS } from './umbraQuestions.ts'

// Synthèses originales du livre W20 VO fourni, pages imprimées 76–79.
export const AUSPICES = [
    {
        id: 'ragabash', name: 'Ragabash', phase: 'Nouvelle lune', role: 'Le questionneur', light: 0, pages: '77',
        invocation: 'Et si le chemin juste était celui que personne n’ose prendre ?',
        description: 'Le Ragabash éprouve les certitudes de la Nation Garou. Par l’ironie, le détour et les questions qui dérangent, il révèle les failles d’une tradition ou d’un plan. Sa liberté sert la meute lorsqu’elle lui permet de découvrir une issue que les autres n’avaient pas envisagée.',
        pack: 'Éclaireur, stratège imprévisible, regard critique : il observe, déjoue les attentes et rappelle qu’une autorité peut se tromper.',
        tension: 'Remettre en question demande du discernement. La provocation perd son sens si elle humilie les compagnons ou empêche toute décision.',
        prompt: 'Qu’est-ce que votre personnage oserait demander quand tous les autres se taisent ?',
    },
    {
        id: 'theurge', name: 'Théurge', phase: 'Croissant', role: 'Le visionnaire', light: 0.23, pages: '77',
        invocation: 'Écouter ce qui parle de l’autre côté du monde.',
        description: 'Le Théurge porte son regard vers l’Umbra et les esprits qui la peuplent. Il interprète leurs signes, apprend leurs usages et cherche comment traiter avec eux. Ses visions rappellent à la meute que le monde possède une profondeur spirituelle aussi réelle que la terre sous ses pas.',
        pack: 'Guide spirituel et interlocuteur des esprits : il aide ses compagnons à comprendre des présences, des lieux et des dettes qui leur échapperaient autrement.',
        tension: 'Comprendre la logique des esprits peut éloigner de celle de ses proches. Il faut aussi rendre ses découvertes compréhensibles et utiles à la meute.',
        prompt: 'Quelle voix votre personnage prendrait-il le temps d’entendre, même si personne d’autre ne la perçoit ?',
    },
    {
        id: 'philodox', name: 'Philodox', phase: 'Demi-lune', role: 'Le médiateur', light: 0.5, pages: '77–78',
        invocation: 'Écouter les deux voix. Puis porter le poids du jugement.',
        description: 'À la frontière de la lumière et de l’ombre, le Philodox cherche un équilibre entre les deux natures du Garou. Conseiller, médiateur et gardien des lois, il doit interpréter les traditions et trouver une décision juste lorsque plusieurs devoirs s’opposent.',
        pack: 'Il dénoue les conflits, met les responsabilités en mots et aide la meute à tenir ses engagements. Son jugement peut reconnaître un mérite autant que demander réparation.',
        tension: 'L’impartialité n’efface ni les conséquences d’une décision ni la souffrance de ceux qui la subissent. Une règle peut exiger d’être comprise avant d’être appliquée.',
        prompt: 'Que ferait votre personnage si protéger un proche entrait en conflit avec ce qu’il estime juste ?',
    },
    {
        id: 'galliard', name: 'Galliard', phase: 'Gibbeuse', role: 'Le porteur de mémoire', light: 0.78, pages: '78–79',
        invocation: 'Que leurs noms traversent la nuit avec nous.',
        description: 'Le Galliard porte la mémoire et la voix du Peuple. Il transmet les récits, célèbre les vivants et les morts, et donne une forme aux joies comme aux blessures des Garou. Son art peut être parole, chant, danse ou musique ; il relie le passé à ceux qui doivent encore agir.',
        pack: 'Il inspire ses compagnons, soutient leur courage et fait vivre ce qui mérite d’être transmis. Au cœur du conflit, sa voix peut rappeler pourquoi la meute continue de lutter.',
        tension: 'La passion peut éclairer un événement ou le déformer. Le récit le plus exaltant n’est pas toujours celui qui rend justice à ce qui s’est passé.',
        prompt: 'De qui votre personnage refuserait-il de laisser disparaître l’histoire ?',
    },
    {
        id: 'ahroun', name: 'Ahroun', phase: 'Pleine lune', role: 'Le guerrier', light: 1, pages: '79',
        invocation: 'Quand la nuit frappe, tenir devant les siens.',
        description: 'L’Ahroun incarne la puissance guerrière de Gaia. Sous la pleine lune, sa Rage nourrit une vocation de combattant : affronter le danger, ouvrir la voie et mener par ses actes lorsque la guerre éclate. Même parmi les Garou, cette force inspire autant le respect que la crainte.',
        pack: 'Champion et protecteur au combat, il se place au-devant de la menace et prépare ses compagnons à l’affronter. Sa responsabilité dure aussi dans les moments où il faut retenir ses griffes.',
        tension: 'La Rage offre une force terrible et peut mettre les proches en danger. Savoir se battre inclut la discipline, le choix de ses batailles et la capacité de laisser d’autres conduire.',
        prompt: 'Qu’est-ce qui mérite que votre personnage se batte, et qui pourrait lui demander de s’arrêter ?',
    },
] as const

export type AuspiceId = typeof AUSPICES[number]['id']
export type AuspiceChoice = { version: 1; auspiceId: AuspiceId; validation: 'unreviewed' }
export type AuspiceStage = 'explore' | 'chosen'
export const isAuspiceId = (value: unknown): value is AuspiceId => AUSPICES.some(auspice => auspice.id === value)
export const getAuspice = (id: AuspiceId) => AUSPICES.find(auspice => auspice.id === id)!

export function validAuspiceChoice(value: unknown): value is AuspiceChoice {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return false
    const choice = value as Partial<AuspiceChoice>
    return choice.version === 1 && choice.validation === 'unreviewed' && isAuspiceId(choice.auspiceId)
}

function canVisitLuna(draft: UmbraDraft) {
    return draft.completed && draft.introSeen && draft.questionIndex === 15 && draft.tribalStage === 'chosen' && validTribeChoice(draft.tribeChoice)
        && UMBRA_QUESTIONS.every(question => question.answers.some(answer => answer.id === draft.answers[question.id]))
}

export function enterAuspices(draft: UmbraDraft): UmbraDraft {
    if (!canVisitLuna(draft)) return draft
    return { ...draft, auspiceStage: draft.auspiceChoice ? 'chosen' : 'explore', viewedAuspice: draft.auspiceChoice?.auspiceId ?? draft.viewedAuspice ?? 'ragabash' }
}

export function browseAuspice(draft: UmbraDraft, id: AuspiceId): UmbraDraft {
    if (!canVisitLuna(draft) || !isAuspiceId(id)) return draft
    return { ...draft, auspiceStage: 'explore', viewedAuspice: id }
}

export function confirmAuspiceChoice(draft: UmbraDraft, id: AuspiceId): UmbraDraft {
    if (!canVisitLuna(draft) || !isAuspiceId(id)) return draft
    return { ...draft, auspiceStage: 'chosen', viewedAuspice: id, auspiceChoice: { version: 1, auspiceId: id, validation: 'unreviewed' } }
}

export function leaveAuspices(draft: UmbraDraft): UmbraDraft {
    return { ...draft, auspiceStage: undefined }
}
