# Plan d’attaque — Affinités tribales et traversée umbrale

Date : 30 octobre 2026.
Projet : Garou_Test — campagne « It's a King of Magic ».
Statut : rupture et ambiance validées par Fabien. Les seize questions définitives et leur scoring interne P/A/D/C sont intégrés ; la révélation et le choix parmi les treize Tribus restent à construire.

## Suite validée avec Fabien — reprise dans un autre fil

Décisions du 30 octobre 2026. Cette liste est le point de reprise prioritaire. Ce soir, seule la documentation est mise à jour : ne pas commencer l’implémentation des effets ou des écrans suivants.

Ordre du parcours restant :

1. [ ] **Glitchs graduels pendant le questionnaire.** Réutiliser la hiérarchie de `docs/tribes/LEXIQUE_SOURCE.md`, selon l’avancement dans les seize questions et les quatre ambiances. Q01–Q04 : discrets et anecdotiques ; Q05–Q08 : plus perceptibles ; Q09–Q12 : inquiétants et plus présents ; Q13–Q16 : graduellement envahissants. Mots et fragments en scramble fini, tailles et positions aléatoires, dédoublement vert/rouge façon lunettes 3D comme dans la partie médicale. Garder des accalmies et la lisibilité des réponses. L’intensité dépend de la progression, jamais des réponses choisies ; la lecture prolongée ne doit pas l’augmenter indéfiniment. Les fragments les plus profonds restent des intrusions possibles, sans imposer une destination réelle comme Malfeas.
2. [ ] **Révélation du groupe de Tribus le plus en résonance.** Après Q16, présenter le « pack de clans » qui résonne le plus avec le personnage, avec une mise en lumière éthérée, umbrale et lunaire. Le questionnaire suggère une famille de philosophies ; il n’assigne pas une Tribu. Prévoir les égalités sans inventer de pondérations secondaires. Toutes les treize Tribus restent visibles et accessibles.
3. [ ] **Cartes d’information et choix de la Tribu.** Proposer différentes cartes de Tribus avec des informations explicitement HRP : philosophie, informations méta et de jeu, particularités et conditions de création utiles. Le joueur consulte les cartes pour choisir librement sa Tribu. Le résultat ne verrouille aucune option ; une éventuelle validation MJ demeure distincte.
4. [ ] **Choix de l’Auspice.** Étape beaucoup plus courte : un choix direct, sans nouveau long questionnaire. Ciel étoilé, lune qui se déplace et animation adaptée à la phase parcourue : nouvelle lune, croissante, demi-lune, gibbeuse, pleine lune. Un texte présente l’Auspice correspondant ; le joueur découvre puis confirme son choix. Le mouvement sert la découverte et laisse le texte lisible. Les descriptions et détails de présentation restent à préparer.
5. [ ] **Apothéose après le choix de l’Auspice.** Réserver le sommet de la mise en scène à la toute fin du parcours en ligne. Direction discutée : dernière poussée du dérèglement, puis silence et présence lunaire, avec une conclusion claire. Le rythme, les textes et la réalisation précise restent à valider avec Fabien.
6. [ ] **Relais à la séance 0 IRL.** La finition des personnages se fera autour de la table, hors du site. Ne pas étendre automatiquement le questionnaire à toute la finalisation de fiche.

Les vérifications de sauvegarde, l’hébergement et les prérequis de publication indiqués plus bas restent à traiter séparément. Zia prépare et implémente les éléments autorisés ; Fabien garde l’exécution des commandes Git.

## 1. Intention et décisions retenues

- Le site quitte progressivement son apparence administrative pour devenir pleinement Garou, lunaire et spirituel.
- La rupture donne momentanément l’impression d’un plantage. Les réponses et la navigation restent réellement protégées.
- Une phrase apparaît entière, sans effet de frappe :
  > Oubliez l’humain en vous… Laissez parler le Loup… Que feriez-vous, débarrassé de la peau d’homme ?
- Le questionnaire suit cette entrée. Il concerne le personnage que le joueur veut incarner.
- Chaque réponse validée accompagne un passage vers davantage de profondeur.
- Des wisps initialement bleutés, des lumières argentées, des brumes et des signes composent la présence umbrale. À la demande de Fabien, chaque descente assombrit le décor et fait évoluer les wisps vers un vert spectral.
- L’IA continue à parler par fragments : apparitions brèves en scramble, avec une sélection adaptée à la progression.
- Après le questionnaire, les principales affinités apparaissent dans une surbrillance éthérée et lunaire.
- Les autres Tribus restent présentes, flottantes et plus lointaines. Leurs noms et leurs accès demeurent lisibles.
- Les treize Tribus restent découvrables et sélectionnables. Le questionnaire propose ; le joueur choisit.
- Une fiche explique la philosophie de chaque Tribu, ses contradictions, son Totem, ses particularités de création et ses Dons de départ.
- Le choix d’une Tribu peu suggérée n’est pas une erreur.
- Les exigences de règles et les exceptions de campagne relèvent d’une validation distincte du MJ.

Ces décisions prolongent les échanges avec Fabien. Les formulations supplémentaires et réglages ci-dessous sont des propositions de travail, pas du canon de campagne.

## 2. Sources conservées dans le projet

- [Brief UX/UI initial](tribes/BRIEF_UX_UI_SOURCE.md).
- [Réservoir de mots et fragments proposé](tribes/LEXIQUE_SOURCE.md).
- [Questionnaire définitif et clé technique validés](tribes/QUESTIONNAIRE_SOURCE.md).

Les trois sources sont copiées intégralement depuis les textes joints par Fabien. Le brief initial décrit une façade administrative encore visible : la décision ultérieure de basculer pleinement Garou prévaut.

Les mentions « canonique », les explications de lore et les liens du lexique sont des affirmations de sa source. Ils restent à vérifier dans la référence W20 retenue avant de constituer les données finales. Les fragments suggérés ne deviennent pas automatiquement des événements de la campagne.

## 3. Parcours cible

Historiques validés → rupture simulée → transformation lunaire → phrase d’entrée → questionnaire et descentes successives → révélation des affinités → exploration des treize Tribus → préférence du joueur → confirmation ou attente de validation MJ.

Le prototype servira à régler la durée et le rythme. La révélation ne doit pas annoncer une acceptation définitive lorsqu’un choix attend encore l’accord du MJ.

## 4. Ordre des lots

### Lot 1 — Prototype de la traversée (COMMENCER ICI)

Objectif : valider la sensation, la lisibilité et la réalisation sur ordinateur et téléphone.

À produire :
- Un accès d’aperçu réservé au développement, dans la logique des aperçus existants.
- Une rupture brève, puis une transformation complète de l’ambiance.
- La phrase d’entrée, affichée entière.
- Un décor à wisps bleutés et lumière argentée.
- Quatre paliers d’essai, parcourus par un bouton de démonstration explicite.
- Un exemple de fragment de l’IA pour chaque palier.
- Une composition finale d’essai ; aucun résultat tribal factice présenté comme personnel.

Propositions à éprouver :
- Passage entre deux paliers inférieur à environ une seconde.
- Décor stabilisé pendant la lecture.
- Fragments déclenchés de façon espacée, avec évitement des répétitions immédiates.
- Scramble fini pour chaque fragment ; aucun texte descriptif réécrit en boucle.
- Version en mouvement réduit conservant toutes les informations.

Terminé lorsque :
- Fabien valide l’ambiance et le degré d’inquiétude.
- La phrase, les commandes et les textes restent lisibles.
- Le prototype fonctionne au clavier et sur mobile.
- Les effets se mettent au repos lorsque l’onglet est masqué et sont nettoyés à la sortie.
- La rupture n’endommage ni les réponses existantes ni leur sauvegarde.

#### Journal — première itération du 29 octobre 2026

Réalisé : aperçu de développement `?screen=umbra`, quatre paliers navigables, wisps bleutés, lune argentée, brumes, marques abstraites qui se révèlent et fragments courts de l’IA avec scramble fini. La phrase d’entrée reste lisible et entière. La scène peut être immobilisée ; elle respecte la préférence de mouvement réduit et suspend ses animations lorsque l’onglet est masqué.

Les marques sont des dessins d’essai, pas les sceaux validés des Tribus. Les paliers ne représentent pas des résultats calculés. Cet aperçu ne lit ni n’enregistre les réponses du questionnaire.

Vérifié : compilation, lint et 46 tests existants ; parcours des quatre paliers au clavier et conservation du focus ; commande de pause ; ouverture des Connaissances et de l’identification existantes. Contrôle des mises en page ordinateur et téléphone, avec correction d’un débordement à 320 px. La préférence système de mouvement réduit est prise en charge dans le code ; la commande de pause a été exercée dans le navigateur.

Fichiers : `src/RootScreen.tsx`, `src/UmbraPreview.tsx`, `src/UmbraAtmosphere.tsx`, `src/UmbraPreview.css` et raccord dans `src/main.tsx`. L’aperçu est exclu de la compilation de publication.

Validation de Fabien : thème pleinement approuvé (« je valide à fond ce thème »). Cette ambiance devient la référence visuelle pour la suite.

Clarification confirmée avec Fabien lors de la première itération : les quatre paliers changeaient la présence visuelle sans réaliser encore une descente à travers le voile. Le faux plantage initial est également à construire.

Prochains checkpoints : enregistrer le thème validé dans un commit exécuté par Fabien ; construire la descente entre deux paliers (décor qui s’éloigne, traversée d’un voile, nouveau plan qui émerge) ; puis réaliser la rupture administrative initiale et l’entrée progressive. Les textes et commandes doivent retrouver leur stabilité après chaque passage. Le lot 1 reste ouvert jusqu’à ces réalisations et à leur validation.

#### Journal — descente du 29 octobre 2026

Fabien a confirmé une copie de travail propre après le commit du thème. La descente est désormais réalisée dans l’aperçu : recul du décor pendant 420 ms, franchissement par une nappe de brume et des ondes lunaires, puis émergence du plan suivant pendant 540 ms. Le retour vers les paliers précédents utilise le mouvement inverse. La phrase et les commandes gardent leur position.

Un contrôleur indépendant sépare le départ, le franchissement et l’arrivée. Il ignore les clics supplémentaires pendant le passage, conserve le focus et permet une arrivée immédiate lorsque la scène est immobilisée. La préférence de mouvement réduit est prise en charge ; une interruption ou la disparition de l’onglet ne doit pas laisser la navigation bloquée.

Vérifié : compilation et lint réussis ; 51 tests passent, dont cinq tests de progression, clics répétés, interruptions, navigation sans mouvement et événements hors séquence. Dans le navigateur : départ et arrivée observés, quatre paliers parcourus au clavier, double clic sans saut de palier, remontée, pause pendant le passage, navigation immédiate en pause et absence de débordement à 320 px pendant et après l’animation. Aucune erreur ou alerte de console relevée. La bascule effective de la préférence système de mouvement réduit n’a pas été exercée.

Fichiers de cette itération : `src/umbraJourney.ts`, `src/UmbraPreview.tsx`, `src/UmbraPreview.css` et `tests/umbraJourney.test.mjs`. Le raccord au questionnaire et la rupture initiale restent hors de cette itération. Fabien doit maintenant valider la sensation de descente.

#### Journal — obscurité et couleurs spirituelles du 29 octobre 2026

Demande de Fabien : renforcer la présence umbrale en assombrissant l’écran et en faisant évoluer les feux follets vers le vert au fil des descentes.

Réalisé : quatre palettes communes au canvas et au décor CSS, dans `src/umbraPalette.ts` : bleu lunaire, turquoise, jade et vert spectral pâle. Le fond s’assombrit à chaque palier ; étoiles et horizon s’effacent progressivement. Les noyaux, halos, traînes, brumes, marques et voiles suivent la palette. Les textes et la lune gardent leur clarté argentée. Le retour à la lisière restaure la première palette.

Recherche : la [présentation officielle de W20 — Umbra: The Velvet Shadow, par Onyx Path](https://theonyxpath.com/now-available-book-of-the-wyrm-and-umbra-the-velvet-shadow/) présente une Umbra animiste, la Pénumbra, les royaumes de l’Umbra proche et des voyages par les Ponts de Lune. Notre traduction artistique vise l’éloignement des repères humains et la présence croissante des esprits. Les quatre palettes sont une interprétation visuelle libre, pas une classification canonique des royaumes. La recherche porte sur cette présentation éditoriale ; elle ne constitue pas une lecture complète du supplément.

Vérifié : compilation et lint réussis ; 51 tests passent. Les quatre couleurs de décor et de wisps ont été parcourues dans le navigateur ; le retour au bleu fonctionne. Aucun débordement à 320 px au dernier palier, texte clair conservé et aucune erreur de console relevée. Captures conservées des ambiances initiale et finale.

#### Journal — raccord médical et quatre situations provisoires du 29 octobre 2026

Demande de Fabien : relier les deux questionnaires par une prise de contrôle brutale et saccadée, laisser apparaître le message spirituel, le faire disparaître lentement et présenter quatre questions provisoires, une par niveau.

Réalisé : le bouton « Continuer » des Historiques valide réellement le volet puis déclenche une rupture de 2,2 secondes sur le formulaire médical existant. L’interface se disloque par décalages et découpes, perd sa liaison, puis cède à l’Umbra. Le formulaire est temporairement inerte ; les réponses médicales restent conservées. En mouvement réduit, le passage devient une coupure calme et brève.

Le nouvel appel suit la dernière formulation de Fabien. Il apparaît entier, dispose d’environ 6,5 secondes de lecture, puis s’efface sur 2,2 secondes avant la première situation. « Lire à mon rythme » suspend ce passage ; « Entrer dans le voile » permet d’avancer volontairement. La lecture est suspendue lorsque l’onglet est masqué et le mouvement réduit garde un passage manuel.

Le parcours comporte quatre situations et quatre réponses A/B/C/D volontairement provisoires. Un choix explicite permet de valider puis descendre. Une situation correspond à un palier ; le retour remonte au précédent et conserve les réponses. La quatrième validation termine l’essai sans calculer d’affinité ni attribuer de Tribu.

La sauvegarde du brouillon umbral est versionnée et séparée des réponses médicales dans le même dossier. Après rechargement, le parcours retrouve la situation et les choix, sans rejouer la rupture lorsque l’appel a déjà été passé. Les nouveaux champs passent par le mécanisme de sauvegarde existant ; aucune modification de schéma ou de droits distants n’a été nécessaire.

La scène est désormais partagée dans `src/UmbraScene.tsx` ; `?screen=umbra` conserve l’aperçu libre. Un aperçu de développement séparé, `?screen=passage`, permet d’essayer le raccord depuis les Historiques avec son propre brouillon. Le rejeu volontaire, disponible seulement en développement, réinitialise les réponses provisoires et conserve le volet médical. Les composants de la traversée font maintenant partie du parcours normal compilé ; les accès d’aperçu restent réservés au développement.

Vérifié : 57 tests passent, compilation et lint réussis. Dans le navigateur : bouton bloqué avant répartition des points, rupture du formulaire, apparition de l’appel puis de la première situation, lecture libre, quatre réponses et trois descentes, reprise à la deuxième situation avec son choix, retour conservant le premier choix, fin au quatrième niveau, consultation et rejeu. Contrôle à 320 px sans débordement, focus rétabli sur les titres, retour au médical avec points conservés et absence d’erreur de console. L’acheminement email et la sauvegarde avec de vrais comptes restent à tester lors de l’activation.

Prochain checkpoint : Fabien juge la prise de contrôle et le rythme de l’appel. Les textes du QCM, le référentiel tribal et la matrice d’affinités restent à valider avant de remplacer les placeholders.

### Lot 2 — Référentiel des treize Tribus

Objectif : fixer ce que le joueur pourra découvrir et ce que le système peut suggérer.

À produire, avec validation éditoriale de Fabien :
- Identifiant stable, nom affiché et éventuel nom original de chaque Tribu.
- Philosophie, rapport au monde, contradictions et exemple de personnage possible.
- Totem, particularités de création et Dons de départ expliqués brièvement.
- Références W20 pour les conditions et règles.
- Conditions standard, choix à discuter avec le MJ et éventuelles adaptations de campagne.
- Axes de valeurs et motivations utiles au futur questionnaire.
- Noms lisibles accompagnant les symboles ; choix des illustrations et des sceaux à valider.

Terminé lorsque :
- Les treize fiches sont complètes et comparables en niveau de détail.
- Les descriptions évitent les portraits purement flatteurs et les caricatures.
- Les restrictions ne sont pas confondues avec l’affinité.
- Les conditions qui pourraient toucher les Historiques déjà saisis sont identifiées.

### Lot 3 — Questionnaire et matrice de correspondance

Objectif : créer des situations qui donnent matière à jouer.

À produire :
- Consigne rappelant de répondre pour son personnage.
- Situations concrètes ; chaque réponse exprime une intention défendable et une contrepartie.
- Correspondances justifiées entre réponses, axes et Tribus.
- Couverture comparable des treize Tribus.
- Cas de personnages d’essai, y compris des profils contrastés ou ambivalents.
- Détermination du nombre de questions après un premier essai de durée.

Terminé lorsque :
- Fabien valide les textes et la lecture des philosophies.
- Une réponse n’identifie pas immédiatement une seule Tribu.
- Aucun résultat n’est assimilé à un diagnostic psychologique du joueur.
- Une Tribu ne domine pas simplement parce que davantage de questions la favorisent.

### Lot 4 — Calcul des affinités

Objectif : transformer les réponses en suggestions explicables et reproductibles.

À produire :
- Calcul TypeScript séparé de l’interface.
- Méthode de pondération et, si nécessaire, de normalisation documentée.
- Règles pour les égalités, les faibles écarts et l’absence de dominante.
- Nombre de suggestions adaptable ; aucun « top 3 » imposé indépendamment des résultats.
- Explications brèves issues des réponses et axes effectivement utilisés.
- Versions du questionnaire et du calcul pour interpréter les anciennes sauvegardes.

Terminé lorsque les tests vérifient :
- Les mêmes réponses produisent les mêmes affinités.
- Les égalités ne dépendent pas arbitrairement de l’ordre des Tribus dans un tableau.
- Les scores ne sont pas présentés comme des pourcentages scientifiques.
- Le joueur peut choisir une Tribu qui n’est pas parmi les suggestions.

### Lot 5 — Parcours complet et exploration

Objectif : assembler les questions, les effets et le choix.

À produire :
- Une situation à la fois ; sélection puis validation explicite.
- Retour aux questions précédentes avec réponses conservées.
- Progression perceptible et lisible.
- Profondeur liée à l’avancement, pas au caractère supposé bon ou mauvais d’une réponse.
- Passage visuel unique par validation ; les retours et corrections n’accumulent pas les descentes.
- Révélation des principales résonances et accès à toutes les Tribus.
- Fiches détaillées, retour à l’exploration et confirmation du choix.
- Distinction entre préférence enregistrée et choix nécessitant l’accord du MJ.

À éprouver :
- Cercle des Treize ou éventail sur grand écran.
- Présentation mobile lisible : le cercle ne devient pas une contrainte.
- Principales affinités éclairées de l’intérieur, autres présences plus lointaines.
- Flou porté en priorité par les auras et le décor.
- Fiches lisibles, noms accessibles et commandes utilisables sans survol.
- Même confirmation pour une préférence suggérée ou non, sauf exigence de validation MJ.

### Lot 6 — Raccordement, sauvegarde et reprise

Objectif : intégrer la nouvelle étape au questionnaire existant.

Constat initial avant le raccord :
- App.tsx s’arrête actuellement à la phase « backgrounds ».
- Le bouton « Continuer » des Historiques confirme le volet puis devient « Validé ».
- Il faut ajouter le passage vers la traversée et tester le retour.

Raccord provisoire désormais réalisé : phase « umbra », bouton final relié à la prise de contrôle, appel et quatre situations persistées. Le parcours complet a été essayé dans le navigateur avec le brouillon de développement. Les contenus définitifs et les essais de sauvegarde avec de vrais comptes restent ouverts.

À produire :
- Raccord après validation réelle des Historiques.
- Conservation des choix précédents.
- Sauvegarde des réponses tribales, de leur version, de la préférence et du statut de validation.
- Reprise au bon endroit après rechargement ou reconnexion.
- Effets transitoires séparés des réponses persistantes.
- Vérification de l’ancienne sauvegarde sur un compte existant.
- Décision explicite sur le rejeu de l’introduction : proposition, une lecture normale puis un rejeu volontaire.

Principe de données :
- Conserver les réponses et le choix explicite du joueur.
- Déduire scores et suggestions du questionnaire versionné au lieu d’entretenir des states redondants.
- Ne pas enregistrer les positions des particules, les lettres du scramble ou une horloge d’animation.
- Le hasard visuel ne participe jamais au calcul des affinités.
- L’absence de validation MJ ne doit pas effacer une préférence.
- Réexaminer les contrôles côté base avant toute nouvelle modification distante.

### Lot 7 — Vérification et ouverture aux joueurs

À vérifier :
- Parcours depuis les Historiques jusqu’à la confirmation.
- Rechargement à chaque grande étape, retour, correction et changement de préférence.
- Égalités, résultats serrés, absence de dominante et choix hors suggestions.
- Conflits avec des conditions de création, sans modification automatique des réponses précédentes.
- Clavier, focus après transition, lecteur d’écran, mouvement réduit et petits écrans.
- Charge des particules sur mobile, mise en veille et absence de boucles/timers résiduels.
- Sauvegarde locale, sauvegarde connectée, déconnexion et séparation des comptes.
- Vérifications de compilation et de qualité ; tests ciblés sur les règles et les transitions importantes.

Prérequis de publication, indépendants de la direction artistique :
- Choisir et configurer l’hébergement.
- Configurer le fournisseur d’emails et les adresses de retour Supabase.
- Créer la campagne, la meute et l’affectation MJ avec Fabien.
- Tester les vrais liens de connexion et le parcours avec plusieurs comptes.
- Prévoir l’interface MJ pour lire les dossiers.

Voir aussi [TOTEM_SUPABASE.md](TOTEM_SUPABASE.md). Les informations d’activation doivent être revérifiées avant la mise en ligne.

## 5. Organisation technique proposée

Trois couches indépendantes :
1. Le contenu : questions, réponses, fiches tribales, lexique et correspondances.
2. Le parcours : étapes, validations, navigation, choix final et sauvegarde.
3. L’ambiance : profondeur, wisps, lumière, fragments et transitions.

Les effets restent dans un calque décoratif qui ne capture pas les clics. Le choix CSS/Canvas et le nombre de particules seront réglés sur le prototype selon la fluidité et la maintenance. Aucune nouvelle bibliothèque n’est décidée à ce stade.

La trajectoire principale proposée reste lunaire et spirituelle. Les fragments menaçants constituent des intrusions rares, pas une descente automatique vers Malfeas. Fabien garde la décision sur le contenu et les révélations.

## 6. Questions à trancher au bon moment

Ces questions n’empêchent pas le prototype :
- Durée de la rupture et intensité maximale acceptée.
- Nombre et représentation des paliers.
- Répertoire des fragments réellement retenus ; quantité d’anglais et de français.
- Présence éventuelle de sons et déclenchement volontaire.
- Liste et contenu W20 de référence, conditions adaptées à la campagne.
- Nombre de questions et format exact des réponses.
- Forme finale du Cercle/éventail et possibilité de comparer deux fiches.
- Retours du joueur après un choix déjà confirmé et effets sur la validation MJ.

## 7. Suivi et discipline

- [x] Conserver les sources et les décisions dans le projet.
- [x] Lot 1 — Thème lunaire et wisps validés par Fabien.
- [x] Lot 1 — Animation de descente réalisée et testée.
- [x] Lot 1 — Sensation de descente validée par Fabien.
- [x] Lot 1 — Rupture initiale réalisée et testée.
- [x] Lot 1 — Prise de contrôle et rythme de l’appel validés par Fabien.
- [x] Parcours provisoire — Raccord médical et quatre situations jouables, avec reprise.
- [ ] Lot 2 — Référentiel tribal validé.
- [x] Lot 3 — Seize questions et clé P/A/D/C validées et intégrées.
- [ ] Lot 4 — Calcul testé.
- [ ] Lot 5 — Expérience complète validée.
- [ ] Lot 6 — Raccord et sauvegarde vérifiés.
- [ ] Lot 7 — Vérification et ouverture.

Pour chaque lot, mettre à jour ce document avec le résultat observé, les décisions prises et les points encore ouverts. Fabien valide le contenu et le ressenti. Zia implémente dans le périmètre demandé ; Fabien exécute les commandes Git.

Prochaine action de développement, lorsque Fabien demandera de reprendre : construire les glitchs graduels selon la liste prioritaire en tête de ce document, puis la révélation du groupe en résonance, les cartes de Tribus et leur choix, le choix court de l’Auspice et l’apothéose. La finition des personnages appartient à la séance 0 IRL. Aucune pondération secondaire ne doit être inventée.

## Journal — questionnaire définitif du 30 octobre 2026

Source de vérité : `docs/tribes/QUESTIONNAIRE_SOURCE.md`, copiée intégralement depuis le document fourni par Fabien. Les seize citations, attributions, situations, titres secondaires, note de traduction et soixante-quatre réponses sont reproduits sans réécriture ni permutation. Cette validation remplace les propositions antérieures des lots 3 et 4 concernant la création des questions et des pondérations.

Données : `src/umbraQuestions.ts` contient le référentiel éditorial typé. Chaque réponse possède un identifiant numérique textuel stable et un axe interne P/A/D/C. L’interface affiche seulement le numéro et le texte. Aucun code, score, pourcentage ou résultat tribal n’est rendu.

Calcul : `getUmbraAffinity(draft)` reconstruit les scores, les seize choix avec leurs axes, la séquence brute et un historique `W20|…|P…-A…-D…-C…`. Une réponse vaut exactement un point ; la somme finale vaut seize. Les réponses suffisent à tout reconstruire : aucun state de scores ni copie persistée redondante. Les positions non répondues sont représentées par un tiret dans l’historique partiel. L’exemple illustratif de la source contenant B n’est pas une clé : seuls P/A/D/C sont produits par la clé technique.

Persistance : brouillon version 2, identifiants q01 à q16. La démo version 1 ne peut pas être interprétée comme un vrai résultat ; seul ce brouillon est réinitialisé. Le dossier humain et les Historiques sont conservés. La validation dédiée précède le contrôle générique des niveaux 0–5, afin d’autoriser les index Q07 à Q16 sans élargir les niveaux de fiche. Le mécanisme de sauvegarde et son format JSON global restent identiques ; aucune modification distante n’est nécessaire. Le transport connecté est vérifié par test local, sans connexion réelle ni envoi à un compte pendant cette itération.

Ambiance : le contrôleur parcourt seize positions. Chaque changement de question conserve la traversée de 420 + 540 ms, même à l’intérieur d’une même ambiance. Q01–Q04 : lisière ; Q05–Q08 : voile ; Q09–Q12 : profondeur ; Q13–Q16 : résonance. Le retour remonte selon la position de la question. L’aperçu libre garde ses quatre paliers. La prise de contrôle et les réglages visuels validés ne sont pas modifiés.

Arrivée : l’écran de fin existant utilise « Quelles visions du monde semblent résonner avec ton personnage ? ». Il permet de revoir les réponses et ne crée pas d’étape supplémentaire ni de sélection tribale factice. Les treize Tribus resteront accessibles lors de l’étape suivante.

Vérifications : compilation et lint réussis ; 61 tests passent. Comparaison intégrale des textes avec la source, clé des 64 réponses, profils dominants, égalité 4/4/4/4, somme seize, correction sans double comptage, anciennes sauvegardes, reprise Q11/Q16, conservation du dossier et du transport connecté. Navigateur : raccord depuis les Historiques, seize situations, double clic sans saut, réponse corrigée conservée, reprise Q11 non répondue, reprise Q16 choisie, validation au clavier, fin conservée après rechargement, navigation en pause et lisibilité à 320 px sans débordement horizontal. La préférence système de mouvement réduit n’a pas été basculée pendant cet essai.

