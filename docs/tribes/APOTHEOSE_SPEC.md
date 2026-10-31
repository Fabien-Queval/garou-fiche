# Phase 6 — L’Apothéose et le dossier d’entretien

Réalisation du 31 octobre 2026, à la demande de Fabien après sa confirmation d’un arbre de travail propre et d’une branche distante à jour. L’exécution des commandes Git reste à Fabien.

## Sources et statut des textes

- [Premier envoi du lexique terminal](APOTHEOSE_SOURCE_1.md), conservé intégralement.
- [Suite du lexique terminal](APOTHEOSE_SOURCE_2.md), conservée intégralement.
- [Lexique initial](LEXIQUE_SOURCE.md), réservoir de la saturation.

La coupure « LUNA SIGN » du premier envoi est remplacée par « LUNA SIGNATURE // DETECTED » dans les données de présentation. Les sources originales gardent la coupure. Les onze pools sont conservés dans `terminalLexicon.ts`. Les lignes de console sont du récit : aucune commande n’est exécutée, aucun diagnostic informatique réel n’est lancé.

La saturation rassemble 328 entrées réservées du lexique initial : micro-phrases [A] et noms des listes [C]/[R], sans les paragraphes d’explication ni les références bibliographiques. Sont écartés les textes déjà employés dans le code antérieur au final, avec comparaison insensible à la casse et aux accents. Il s’agit d’une réserve éditoriale, pas d’un historique des apparitions aléatoires vues par chaque joueur. Huit termes procéduraux du nouveau lexique portent l’accumulation à 336 fragments.

## Déroulement

1. **Saturation.** Les fragments se déposent par petites cascades et restent. Après l’arrivée du dernier, l’écran demeure saturé environ quatre secondes. La taille du lot s’adapte au nombre d’entrées pour garder la montée autour de neuf secondes.
2. **Silence.** Tous les fragments et le paysage s’effacent ensemble au noir en 2,8 secondes.
3. **Appel.** Texte entier, propre, doux, sur noir, pendant 8,5 secondes :

   > J’ai besoin de toi.\
   > Enfant de Luna…\
   > Je meurs.

   La formulation universelle « Enfant de Luna » reprend la variante proposée dans le second envoi. Aucune voix audio ni signature explicite ne sont ajoutées.
4. **Diagnostic.** Trente-trois lignes apparaissent entières, à environ 780 ms d’intervalle. Questions sur « Je », vérification de source, résolution de référence, interface et classe, impossibilité de représenter l’objet, puis reconnaissance du destinataire. Après `AUSPICE // RESOLVED`, trois termes viennent du seul Auspice choisi. Quelques interventions du Pool 10 restent rares. Les résultats contradictoires sont des tentatives narratives du système, jamais des vérités de campagne calculées ou des modifications de fiche.
5. **Rupture.** `PROTECTOR // REQUIRED`, puis déchirure d’affichage et noir, en 2,2 secondes.
6. **Retour médical.** La même esthétique administrative accueille une synthèse complète, modifiable et préparée pour l’impression.

La lecture complète dure environ 52 secondes, hors pauses. « Lire à mon rythme », « Continuer » pendant la pause et « Passer au dossier » offrent une sortie accessible. La préférence de mouvement réduit donne une lecture sans animation et une progression manuelle. L’horloge s’arrête quand l’onglet est masqué. Chaque grande étape est sauvegardée ; un rechargement reprend le chapitre courant, dont les positions et horloges visuelles repartent du début.

## Synthèse et corrections

Le dossier reprend le pseudo du joueur, l’emploi, la présentation, les classements, les neuf capacités, les trente-trois compétences et leurs précisions, les onze Historiques et leurs détails, les préférences de Tribu et d’Auspice et les seize réponses de la Traversée. Les appellations Garou disponibles précisent les rubriques hybrides. Aucun âge, lignage ou autre renseignement absent n’est inventé. Totem signifie ici contribution individuelle au lien de meute.

Les boutons « Modifier » ouvrent la rubrique concernée avec ses réponses. Les formulaires existants permettent le retour direct à la synthèse. Une nouvelle priorité peut modifier les budgets ; les valeurs restent conservées et les diminutions sont possibles même si le total dépasse encore le nouveau budget. Toute augmentation dépassant le budget reste refusée. La confirmation du dossier attend une répartition complète et les précisions obligatoires.

Modifier un choix ne rejoue pas l’Apothéose. Les réponses du questionnaire recalculent les résonances comme auparavant. Tribu et Auspice restent des préférences libres, avec la validation MJ `unreviewed`. Les conditions W20 à examiner avec le MJ sont signalées sans être transformées en refus de dossier. Origine, Dons et finition de fiche restent à la séance 0.

## Confirmation et dernière intrusion

Les deux consignes affichées et imprimées sont :

> Ce dossier sera à imprimer et présenter au responsable de la séance du 08 Novembre 2026 à 14h00 pour finaliser votre entretien. Merci d’avoir pris le temps de répondre à cette enquête.
>
> Si vous n’êtes pas en mesure de l’imprimer, merci de prévenir le conducteur de votre entretien à l’avance.

« Confirmer mon dossier » confirme les données courantes du joueur. Un instantané canonique de leurs contenus détecte toute correction ultérieure : le dossier doit alors être confirmé à nouveau. Une simple visite de rubrique ne change pas cet instantané. Cette confirmation ne constitue pas un accord MJ sur les conditions de création.

La consigne subit 7,5 secondes de corruption forte, puis 5,5 secondes d’effacement. Le message final reste immobile jusqu’à « Afficher le dossier » :

> Je sais qui tu es maintenant {%user}.\
> Dossier validé.\
> À dimanche prochain…

`{%user}` est remplacé par le pseudo de joueur déjà saisi dans `playerName`, sans inférer de nom civil. Le message est rendu comme du texte React. Une version sans animation et la sortie par Échap sont disponibles. Le focus reste dans la confirmation et revient au bouton d’impression à sa fermeture. La lecture achevée est retenue ; le rechargement suivant revient au dossier, sans rejouer le message.

## Données et impression

Le nouveau champ facultatif `finaleDraft` version un contient `stage`, `confirmedFingerprint`, `closingSeen`. Les anciennes sauvegardes restent lisibles. Un champ final invalide est réinitialisé seul ; les réponses humaines et `umbraDraft` restent conservées. Les phases `finale` et `dossier` rejoignent les phases existantes. Le transport JSON actuel est conservé et vérifié localement, sans changement distant.

La feuille A4 masque les commandes et tous les effets. Les seize réponses sont incluses à l’impression même si elles sont repliées à l’écran. L’impression s’active après confirmation. Les difficultés de stockage local sont signalées. L’appel au dialogue natif d’impression a été exercé ; son contrôle visuel n’a pas pu être terminé dans le navigateur intégré, l’accès à la fenêtre native ayant expiré. L’aperçu et les sauts de page restent donc à vérifier dans le navigateur cible.

« Rejouer le final » est accessible depuis le dossier, y compris dans la version publiée. Il lance une relecture temporaire sans modifier le dossier ni sa confirmation. Les raccourcis de relecture sont décrits ci-dessous.

## Vérifications

Compilation, lint et 96 tests réussis. Les huit nouveaux tests portent sur les sources et leur jonction, tous les fragments réservés, les étapes, les choix personnalisés, les budgets et précisions, l’invalidation après correction, les sauvegardes et le transport, les textes de séance et le message final, ainsi que les diminutions après changement de classement.

Navigateur, dans un brouillon fictif distinct du `passage` de Fabien : accumulation complète, pause, fondu, appel propre, console et reprise après rechargement, retour automatique au médical ; saisie des trois domaines et compétences ; changement de classement avec diminution progressive et restauration ; changement d’Auspice sans rejouer le rituel ; confirmation, rechargement, correction, nouvelle confirmation et message personnalisé ; focus de la fenêtre finale et sortie vers le dossier. Captures sur ordinateur et à 320 px. Aucun débordement horizontal ni erreur de console observé après correction de la largeur minimale du document.

Restent à éprouver : préférence système de mouvement réduit, masquage réel d’onglet, lecteurs d’écran réels, aperçu natif d’impression et vrais comptes connectés. Les tests locaux ne remplacent pas ces vérifications avant ouverture aux joueurs.

## Raccords du parcours — 31 octobre 2026

Les changements de volet médical utilisent un fondu de 520 ms. Les grands passages entre la Traversée, les Tribus, le ciel lunaire et le dossier passent par le noir sur 1 130 ms. Le défilement vers le début de la nouvelle étape intervient pendant le changement masqué, après la capture de l’étape précédente. Les gestes modifiant plusieurs états partagent un seul fondu ; les clics répétés en attente de capture ne sautent pas de volet.

L’appel initial, la descente de 420 + 540 ms entre les seize questions, la rotation des lunes, l’effacement des fragments et la rupture volontaire conservent leurs animations. La console apparaît en fondu après l’appel ; le dossier revient progressivement après la rupture. La confirmation et son retour au dossier utilisent aussi un fondu, en conservant la position de lecture et le retour du focus vers l’impression.

`sceneTransition.ts`, `useFadingSetter.ts` et `SceneTransition.css` coordonnent les raccords. Les navigateurs compatibles utilisent les captures natives du document ; les autres disposent d’un voile de transition. La préférence de mouvement réduit et un document masqué désactivent les nouveaux fondus. Aucune transition n’est enregistrée dans le dossier.

Vérifiés dans le navigateur : volet physique et retour, exploration et préférence tribales, entrée sous Luna, confirmation d’Auspice, retour au dossier, rejeu automatique du final, ouverture et fermeture de la dernière intrusion avec conservation du défilement et du focus. Contrôle à 320 px : largeur de contenu et largeur disponible identiques. Compilation, lint et 96 tests réussis. Le voile de repli et la préférence système de mouvement réduit restent à éprouver sur leurs navigateurs cibles.

## Rejouer depuis une rubrique — 31 octobre 2026

Chaque action « Modifier » de la synthèse est accompagnée de « Rejouer l’expérience à partir d’ici ». Les treize points d’entrée correspondent à l’identité, aux classements et à leurs volets, aux Historiques, aux réponses de la Traversée, aux résonances tribales et aux lunes. La relecture continue dans l’ordre normal jusqu’au retour au dossier. Les entrées narratives restent indisponibles si leurs prérequis ne sont plus remplis.

Les mêmes composants et effets sont rejoués avec les valeurs préremplies, dans une copie indépendante conservée uniquement en mémoire. Les révélations des Historiques et l’introduction de la Traversée peuvent ainsi revenir sans effacer les réponses ni rendre le brouillon invalide. L’introduction rejouée est un état de présentation distinct. Aucune modification de cette copie n’écrit dans le stockage local d’origine ni ne déclenche d’événement de sauvegarde connectée. Le dépôt Totem connecté n’est pas transmis à la relecture.

Le bandeau « Relecture de l’expérience » propose « Revenir à mon dossier ». La sortie, la fin du rituel et le rechargement retrouvent le dossier enregistré, avec sa confirmation inchangée. Pour conserver une correction, utiliser « Modifier » dans le dossier. Les commandes de relecture sont masquées à l’impression.

Fichiers : `experienceReplay.ts`, contexte de stockage temporaire dans `questionnaireStorage.ts`, raccords dans `App.tsx`, `MedicalDossier.tsx`, `UmbraAssessment.tsx` et styles de relecture. Compilation, lint et 100 tests réussis, dont quatre nouveaux contrôles des points d’entrée, des classements, des prérequis et de l’isolation des réponses. Navigateur : premier incident, continuation physique vers social, introduction et première descente avec réponse préremplie, autre réponse sans effet sur la fiche validée, résonances, lune, confirmation et raccord vers l’Apothéose, sortie et rechargement. Ordinateur et 320 px : commandes accessibles, aucune largeur débordante, aucune erreur de console observée.
