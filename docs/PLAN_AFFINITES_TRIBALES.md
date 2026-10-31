# Plan d’attaque — Affinités tribales et traversée umbrale

Date : 31 octobre 2026.
Projet : Garou_Test — campagne « It's a kind of magic ».
Statut : les Phases 4 et 5 sont intégrées. Après les treize cartes et la préférence tribale, une scène fixe de plaine et de loup accueille les cinq lunes, leurs fiches et la confirmation de l’Auspice. Les textes et le ressenti de ces nouvelles étapes restent à relire avec Fabien. La prochaine phase est l’apothéose, à préparer à sa demande.

## Suite validée avec Fabien — reprise dans un autre fil

Décisions du 30 octobre 2026. Cette liste est le point de reprise prioritaire. Lors de sa rédaction, seule la documentation avait été mise à jour ; l’implémentation reprend à la demande de Fabien.

- [x] **Nom de la campagne corrigé.** Le titre exact **« It's a kind of magic »**, avec « kind », est utilisé dans l’en-tête et le titre du navigateur de `src/UmbraScene.tsx`, ainsi que dans le `README.md`. Cette correction précède les glitchs graduels.

Ordre du parcours restant :

1. [x] **Glitchs graduels pendant le questionnaire — réalisés, testés et validés par Fabien.** Réutiliser la hiérarchie de `docs/tribes/LEXIQUE_SOURCE.md`, selon l’avancement dans les seize questions et les quatre ambiances. Q01–Q04 : discrets et anecdotiques ; Q05–Q08 : plus perceptibles ; Q09–Q12 : inquiétants et plus présents ; Q13–Q16 : graduellement envahissants. Mots et fragments en scramble fini, tailles et positions aléatoires, dédoublement vert/rouge façon lunettes 3D comme dans la partie médicale. Garder des accalmies et la lisibilité des réponses. L’intensité dépend de la progression, jamais des réponses choisies ; la lecture prolongée ne doit pas l’augmenter indéfiniment. Les fragments les plus profonds restent des intrusions possibles, sans imposer une destination réelle comme Malfeas.
2. [x] **Révélation des résonances tribales — réalisée, testée et validée par Fabien.** Après Q16, les treize Tribus sont présentes dans un cercle lunaire, ou une grille sur petit écran. La matrice fournie par Fabien dans `docs/tribes/MATRICE_RESONANCES_SOURCE.md` s’applique directement aux réponses, parallèlement à P/A/D/C. Toutes les Tribus au meilleur score sont des résonances majeures ; les scores à un point du meilleur deviennent proches uniquement si ce meilleur score vaut au moins cinq. Aucune limite de nombre, aucun départage ni multiplicateur. Chaque Tribu possède un maximum théorique atteignable de douze. Les treize voix sont accessibles au clavier ; écouter un sceau n’enregistre aucun choix de Tribu. Les motifs actuels sont des sceaux abstraits de maquette, pas des glyphes W20 officiels.
3. [x] **Cartes d’information et choix de la Tribu — Phase 4 réalisée et testée, textes et ressenti à relire avec Fabien.** Les treize cartes HRP exposent philosophie, valeurs, contradictions, Totem, création et Dons de départ. Les résonances ordonnent leur présentation sans bloquer le choix. Une confirmation explicite enregistre la préférence ; la validation MJ reste distincte. Le livre W20 fourni sert de source aux fiches et aux références de pages.
4. [x] **Choix de l’Auspice — Phase 5 réalisée et testée, textes et ressenti à relire avec Fabien.** Une lune principale évolue au-dessus de la plaine et du loup de l’image fournie. Flèches et cinq repères parcourent nouvelle lune, croissant, demi-lune, gibbeuse et pleine lune. Une lune se couche et la suivante se lève en fondu. Survol ou focus renforcent sa lumière ; le clic ouvre sa fiche W20 en français. Une confirmation distincte enregistre l’Auspice. Aucun nouveau questionnaire ni calcul de suggestion d’Auspice.
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
- Direction précisée par Fabien : l’IA devenue esprit construit une interface qui extrait des données spirituelles du Garou. Les fragments sont des fuites de cette extraction, comme si quelque chose suintait de la réalité. Ils surgissent sporadiquement, parfois en cascade, avec une impression d’interface qui perd le contrôle. Défiler ne doit pas les supprimer.
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
- [Matrice définitive de résonances tribales et spécification Phase 3](tribes/MATRICE_RESONANCES_SOURCE.md).

Les quatre sources sont copiées intégralement depuis les textes joints par Fabien. Le brief initial décrit une façade administrative encore visible : la décision ultérieure de basculer pleinement Garou prévaut. La matrice tribale précise désormais les coefficients et les règles de révélation ; elle remplace les anciennes propositions de pondération et de normalisation des lots ci-dessous.

Pour la Phase 4, le [référentiel W20](tribes/REFERENTIEL_TRIBUS_W20.md) consigne la lecture du livre VO fourni à la racine, les pages, les treize Totems, les Volontés initiales, les listes de Dons et les conditions à distinguer des recommandations. Il s’agit d’un relevé de faits et de synthèses, pas d’une copie intégrale du livre. Les formulations françaises du site restent des propositions éditoriales pour Fabien.

Le [référentiel des Auspices](tribes/REFERENTIEL_AUSPICES_W20.md) consigne les correspondances et sources de la Phase 5, la scène choisie avec Fabien et les limites de cette étape de création.

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
- L’instantané `umbraResult`, ajouté à la demande de Fabien pour la Phase 3, conserve réponses, P/A/D/C, treize scores et résonances avec une version de matrice. Il est reconstruit lors de l’écriture du brouillon. L’interface et le calcul relisent toujours `umbraDraft.answers`, jamais les totaux de cet instantané.
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
- [x] Lot 4 — Deux lectures parallèles, matrice tribale, plafonds et égalités testés.
- [ ] Lot 5 — Expérience complète validée.
- [ ] Lot 6 — Raccord et sauvegarde vérifiés.
- [ ] Lot 7 — Vérification et ouverture.

Pour chaque lot, mettre à jour ce document avec le résultat observé, les décisions prises et les points encore ouverts. Fabien valide le contenu et le ressenti. Zia implémente dans le périmètre demandé ; Fabien exécute les commandes Git.

Point de reprise : Fabien a demandé les Phases 4 et 5, puis choisi une scène de lune au-dessus d’une plaine avec un loup. Les cartes, les deux préférences confirmées et les cinq lunes sont réalisées ; leur contenu et leur ressenti attendent sa lecture. À sa prochaine demande, préparer l’apothéose (Phase 6). Le nom de la campagne est corrigé. La finition des personnages appartient à la séance 0 IRL. Aucun coefficient supplémentaire à la matrice fournie ne doit être inventé.

## Ajustement — fluidité des lunes, 31 octobre 2026

Retour de Fabien : le mouvement est légèrement saccadé. La trajectoire précédente comportait plusieurs points intermédiaires, chacun avec son ralentissement ; le bouton lunaire héritait aussi de l’opacité générique de 0,4 pendant sa désactivation, avant de reprendre brusquement sa luminosité à l’arrivée.

Corrigé : arc circulaire continu par rotation de deux couches, contre-rotation pour garder la lune droite, taille constante et fondu du nom en fin d’arrivée. Chaque phase partage une image SVG mise en cache entre lune principale et repère, avec son grain et ses cratères. Le halo varie par opacité ; aucun filtre CSS n’est animé. Les indications de composition sont actives seulement pendant le passage. L’opacité du bouton reste à un pendant sa désactivation ; seul le fondu prévu de la trajectoire gouverne la présence de la lune. La durée de 1,8 seconde est conservée.

Contrôlé dans le brouillon de vérification : treize échantillons du passage montrent une taille de lune constante de 128 px sur ordinateur et une arrivée sans saut de position ; l’opacité du bouton reste à un. À 320 px, la lune garde 108 px pendant le déplacement, sans débordement horizontal. Les cinq textures sont chargées et réutilisées. Passage inverse, ouverture de fiche, fermeture par Échap et pause pendant le mouvement restent fonctionnels ; aucune erreur de console observée. Compilation, lint et 88 tests réussis. Ces vérifications portent sur la continuité et les fonctions ; elles ne garantissent pas une fréquence d’images sur chaque appareil.

Fichiers : `src/AuspiceScene.css`, `src/AuspiceScene.tsx`, `src/LunarMoon.tsx`, le référentiel des Auspices et le présent plan.

## Journal — Phase 5, sous le regard de Luna, 31 octobre 2026

Direction retenue avec Fabien : une image fixe de plaine, loup et ciel étoilé, une seule lune principale, des flèches qui font tourner le ciel, le nom de la phase et de l’Auspice, puis une fiche au clic. L’image fournie est conservée intacte à la racine ; une copie WebP à la même résolution est intégrée au site (266 Ko). Les lunes sont des SVG superposés : leur mouvement ne fait pas pivoter le paysage. La lune précédente descend vers l’horizon et s’efface, la suivante monte et prend sa place en 1,8 seconde. Les cinq petits repères donnent aussi un accès direct.

Les cinq descriptions sont des synthèses françaises originales du livre VO W20, p. 76–79 : Ragabash, Théurge, Philodox, Galliard et Ahroun. Elles présentent rôle, contribution à la meute, tension de personnage et question d’interprétation. Aucune Rage ni aucun Don ne sont attribués par cette étape. Le survol et le focus accentuent la lumière ; les noms restent accessibles sur téléphone. Sur ordinateur, la fiche prend place à droite et laisse le loup au centre ; sur téléphone, elle se lit après la scène, avec son titre amené à l’écran et une fermeture accessible.

Parcours : « Choisir mon Auspice » suit la préférence tribale. Une première action ouvre la confirmation ; seule « Confirmer mon Auspice » enregistre. La conclusion est « Luna a entendu votre choix. ». Revenir aux lunes ou aux Tribus, lire une fiche et annuler n’effacent pas le choix précédent. Un accès « Retrouver ma préférence » évite de devoir confirmer une nouvelle fois la Tribu après exploration des cartes. L’apothéose reste une phase séparée, sans bouton provisoire ni scène finale factice.

Données : le brouillon reste en version deux et accepte les champs facultatifs `auspiceStage`, `viewedAuspice`, `auspiceChoice`. Le choix est versionné et reste `unreviewed` ; aucune validation MJ n’est accordée par l’interface joueur. La lune regardée est distincte de la préférence confirmée. Une corruption des seules métadonnées lunaires ne supprime ni la Tribu ni les réponses. Les préférences restent indépendantes des scores et survivent à leur correction. Le transport JSON existant est conservé, sans changement distant.

Vérifié : compilation et lint réussis ; 88 tests passent. Sept nouveaux tests contrôlent les cinq correspondances, l’accès après confirmation tribale, l’absence de choix automatique, les retours et corrections, la reprise et le transport, les anciennes sauvegardes, les métadonnées corrompues, le bouclage dans les deux sens et les clics répétés pendant une transition. La pause et les états sans mouvement permettent une arrivée propre. Dans un brouillon de développement distinct de celui de Fabien : cinq fiches ouvertes, passage animé et flèches, fermeture par Échap et retour du focus, annulation avant confirmation, Galliard confirmé puis rechargé, visite d’Ahroun sans remplacer Galliard, retour à la Tribu avec les points d’Historiques inchangés, pause pendant un passage et navigation au clavier vérifiés. Lecture et absence de débordement contrôlées à 320, 1024 px et sur ordinateur. La préférence système de mouvement réduit, le masquage réel d’onglet, les lecteurs d’écran et les vrais comptes connectés restent à éprouver pendant la vérification globale.

Fichiers ajoutés : `src/AuspiceScene.tsx`, `src/AuspiceScene.css`, `src/LunarMoon.tsx`, `src/auspices.ts`, `src/lunarJourney.ts`, `src/assets/lunar-plain.webp`, `tests/auspices.test.mjs`, `docs/tribes/REFERENTIEL_AUSPICES_W20.md`. Raccords modifiés : `src/TribalJourney.tsx`, `src/UmbraAssessment.tsx`, `src/tribeSelection.ts`, `src/umbraQuestionnaire.ts`, `src/questionnaireStorage.ts` et le présent plan.

## Journal — Phase 4, cartes et préférence tribale, 31 octobre 2026

Réalisé à la demande de Fabien : après le Cercle des Treize, « Explorer les Tribus » ouvre treize cartes HRP. Les résonances majeures et proches apparaissent d’abord ; toutes les autres restent accessibles. Chaque fiche comprend une philosophie, une identité, trois valeurs, deux contradictions, le Totem tribal, les particularités de création, cinq possibilités de Dons de rang 1 et des pistes de personnage. Les manifestes sont des formulations originales. Les sceaux abstraits de la Phase 3 sont conservés.

Source : livre VO W20 fourni par Fabien, fiches p. 80–105 et entrées de Dons p. 152–200. Les 65 possibilités sont référencées à leur page, avec un bref résumé français qui ne remplace pas les règles. Le livre reste hors des fichiers publiés. Le Totem tribal est distingué du Totem de meute ; aucun Don ni point de Volonté n’est attribué automatiquement.

Conditions : les restrictions sont séparées des recommandations. Les points connus des Historiques incompatibles avec une restriction et le minimum de Lignée pure des Silver Fangs sont signalés. Les exceptions de création des Black Furies et des Red Talons sont présentées sans déduire l’origine du personnage des réponses humaines. Les métis ne sont pas oubliés. Ces informations ne verrouillent aucun choix et ne changent aucun point.

Confirmation : « Choisir cette Tribu » ouvre une étape de confirmation ; seule « Confirmer ma préférence » enregistre le choix. « Votre choix a été entendu. » conclut cette phase et rappelle les points à examiner avec le MJ. Explorer, relire ou annuler conserve la préférence précédente. Modifier les réponses recalculera les résonances sans effacer la préférence. Le choix court de l’Auspice reste à réaliser en Phase 5 ; la finition de fiche et les Dons restent à la séance 0.

Sauvegarde : le brouillon version deux accepte deux champs facultatifs, `tribalStage` (`reveal`, `explore`, `chosen`) et `tribeChoice` (`version: 1`, `tribeId`, `validation: 'unreviewed'`). Aucun accord MJ n’est créé par le joueur. Les anciens brouillons restent lisibles. Des métadonnées de choix invalides sont retirées sans perdre les seize réponses valides. Le transport JSON existant conserve ces données et l’instantané de résultats est toujours reconstruit depuis les réponses. Les vérifications de cette phase restent locales, sans essai avec un vrai compte connecté.

Vérifié : compilation, lint et 81 tests réussis. Les sept nouveaux tests contrôlent le relevé W20, les conditions, les treize choix dont les non-suggérés, le changement de préférence, les anciennes sauvegardes, les métadonnées corrompues et le transport. Navigateur : treize fiches ouvertes avec cinq Dons chacune ; confirmation hors suggestions malgré une condition à discuter, annulation, remplacement et rechargement ; correction Q16 sans perte de préférence ; fermeture par Échap et retour du focus sur la carte ; boucle de tabulation dans la fiche. Lecture et absence de débordement contrôlées à 320 px et sur ordinateur. La fiche empêche le défilement du fond. Aucune erreur de console observée. Les lecteurs d’écran réels et les comptes connectés restent à éprouver lors de la vérification globale.

Fichiers ajoutés : `src/tribeProfiles.ts`, `src/tribeSelection.ts`, `src/TribalJourney.tsx`, `src/TribalJourney.css`, `tests/tribeSelection.test.mjs`, `docs/tribes/REFERENTIEL_TRIBUS_W20.md`. Raccords modifiés : `src/App.tsx`, `src/UmbraAssessment.tsx`, `src/TribalReveal.tsx`, `src/umbraQuestionnaire.ts`, `src/questionnaireStorage.ts` et le présent plan.

## Journal — Phase 3 et matrice tribale, 30 octobre 2026

Source de vérité éditoriale : `docs/tribes/MATRICE_RESONANCES_SOURCE.md`, copie intégrale du texte fourni par Fabien. Les seize questions et leurs soixante-quatre réponses restent inchangées. La matrice est séparée dans `src/umbraTribes.ts`, avec les treize identifiants et noms de la source et une version de matrice égale à un. Chaque réponse apporte exactement son poids principal de deux et, le cas échéant, son poids secondaire de un. P/A/D/C et les treize totaux sont calculés en parallèle à partir des seuls identifiants de réponses.

Révélation : chaque meilleur score devient une résonance majeure, toutes les égalités étant conservées. Les scores inférieurs d’un point deviennent proches seulement si le meilleur vaut au moins cinq. Un meilleur à quatre ou moins n’élargit pas la suggestion. Aucun nombre fixe de Tribus, aucun multiplicateur, aucune normalisation et aucun score négatif ne sont introduits. Les nombres restent internes.

Écran : « Certaines voix vous reconnaissent. », suivi du texte proposé par Fabien. Les treize sceaux nommés entourent le texte sur grand écran ; une grille prend le relais sur les écrans plus étroits. Les majeures reçoivent un halo lunaire et des filaments ; les proches une présence plus discrète. Toutes les autres voix gardent leur lisibilité et leurs commandes. Le clavier permet d’écouter chacune des treize Tribus ; cette attention est locale à l’écran et n’enregistre ni préférence ni choix de personnage. Les noms restent visibles pendant les effets. Les sceaux dessinés sont des motifs abstraits de maquette, explicitement distincts des glyphes W20 officiels encore à fournir ou valider.

Structure retenue : `umbraDraft` version deux reste la source des réponses. `getUmbraAssessmentResult(draft)` reconstruit `{ matrixVersion, answers, axisScores, tribeScores, majorResonances, nearResonances }`. L’écriture locale ajoute cet objet sous `umbraResult` dans le dossier JSON existant, au même instant que le brouillon. Un cache absent, ancien ou falsifié n’est jamais utilisé pour calculer ni afficher le résultat. Les anciens brouillons version deux sont conservés ; aucune migration des réponses n’est nécessaire. Les contrôles du transport JSON existant sont locaux ; aucune connexion réelle ou écriture distante n’a été exercée pour cette itération.

Vérifié : compilation et lint réussis ; 74 tests passent. Les sept nouveaux tests comparent les 64 entrées aux tableaux et à la constante de la source, contrôlent les deux lectures indépendantes, les seuils quatre/cinq, les égalités multiples, les corrections, les anciennes sauvegardes, les caches incohérents et le transport de l’instantané. Pour chaque Tribu, le maximum est calculé en sommant le meilleur poids disponible par question, puis atteint avec un parcours valide : les treize plafonds valent exactement douze, avec les répartitions de poids prévues par Fabien.

Navigateur : les treize sceaux sont utilisables au clavier, y compris les voix non suggérées. Correction Q16 puis rechargement : la résonance majeure change et revient correctement. Un parcours répondant C à chaque situation révèle ensemble Silent Striders, Stargazers et Uktena, sans départage. Contrôles à 320, 1024, 1101 px et à la taille habituelle : cercle ou grille selon l’espace, treize voix lisibles, aucun débordement horizontal. Les zones de clic du cercle ont été espacées pour supprimer les chevauchements. Pause, retour aux réponses, fin de parcours et absence d’erreur de console vérifiés. La préférence système de mouvement réduit et le masquage réel de l’onglet restent à éprouver ; leur prise en charge commune à la scène est conservée.

Fichiers ajoutés : `src/umbraTribes.ts`, `src/TribalReveal.tsx`, `src/TribalReveal.css`, `tests/umbraTribes.test.mjs`, `docs/tribes/MATRICE_RESONANCES_SOURCE.md`. Fichiers modifiés : `src/umbraQuestionnaire.ts`, `src/questionnaireStorage.ts`, `src/UmbraAssessment.tsx`, `src/UmbraScene.tsx` et le présent plan. Les cartes détaillées, conditions de création, Dons et choix définitif sont réservés à la Phase 4.

## Journal — fuites en cascade après le retour de Fabien, 30 octobre 2026

Retour de Fabien : les apparitions initiales sont trop lentes et trop synchronisées ; le défilement ne doit pas les retirer. La mise en scène doit évoquer des données spirituelles qui fuient de l’interface créée par l’IA devenue esprit.

Réalisé : les salves synchronisées de la première itération sont remplacées par des fuites individuelles. Le premier départ est prévu entre 0,3 et 1,3 seconde selon la progression et le hasard. Le système alterne des apparitions isolées et de petites cascades aux départs strictement décalés, jamais tous au même instant. Chaque fragment possède sa durée, son scramble court et fini, son effacement et, parfois, une rechute brève avec découpe ou perte de signal. Les pauses entre départs varient ; plusieurs fuites peuvent coexister à des âges différents.

Les fuites reviennent pendant la lecture sans arrêt définitif après quelques salves. L’intensité reste fixée par la question : le temps passé et les réponses ne provoquent aucune escalade. La capacité est limitée de deux à cinq fragments visibles selon le groupe de questions ; une cascade attend si l’espace disponible est occupé. Le lexique et ses quatre profondeurs sont conservés.

Le défilement et le redimensionnement conservent les identités, les textes, les durées et les horloges des fuites en cours. Seuls les placements qui croisent désormais une zone protégée sont recalculés. Ils n’annulent pas les prochains départs. La pause, le mouvement réduit, le masquage de l’onglet, les transitions et la fin du questionnaire retirent le composant et nettoient ses timers et images d’animation.

Vérifié : compilation et lint réussis ; 67 tests passent. Les tests couvrent notamment les délais courts, la variété du rythme, les départs distincts des cascades, la résolution et les rechutes, les répétitions et les zones protégées. Dans un brouillon de développement distinct de l’aperçu `passage` utilisé par Fabien : seize questions parcourues au clavier, première fuite Q01 observée vers 1,3 seconde, cascades Q16 observées avec des départs espacés de quelques dixièmes de seconde et jusqu’à cinq fragments coexistants. Défilement vérifié sur ordinateur et à 320 px : mêmes identités conservées, sans débordement horizontal ni recouvrement observé des réponses. Pause, reprise Q16 avec réponse conservée après rechargement, retrait du calque à la fin et absence d’erreur de console vérifiés. Captures mises à jour. La préférence système de mouvement réduit et le masquage réel de l’onglet n’ont pas été basculés pendant cet essai.

Fichiers modifiés : `src/umbraIntrusionModel.ts`, `src/UmbraIntrusions.tsx`, `src/UmbraIntrusions.css`, `src/UmbraScene.tsx`, `tests/umbraIntrusions.test.mjs` et le présent plan. Prochain checkpoint : Fabien juge le suintement, le rythme des cascades et l’impression de plantage.

## Journal — glitchs graduels du 30 octobre 2026, première itération

Cette première version est conservée comme historique ; son rythme et sa gestion du défilement sont remplacés par les fuites en cascade décrites ci-dessus.

Réalisé à la demande de Fabien : quatre répertoires issus de `docs/tribes/LEXIQUE_SOURCE.md`, des mots discrets de Q01–Q04 aux intrusions du ciel profond de Q13–Q16. La présence augmente également à l’intérieur de chaque groupe de quatre questions : taille, dédoublement rouge/vert, nombre de fragments et fréquence. Les mentions les plus profondes sont rares et réservées à la fin ; aucune destination de campagne n’est annoncée.

Chaque fragment possède un scramble fini de 2,4 secondes, puis demeure stable avant de s’effacer. Une à quatre apparitions peuvent partager une salve ; les salves sont séparées par des accalmies de 7 à 20,5 secondes selon la progression. Chaque visite d’une question est limitée à deux à cinq salves, puis le silence revient. Les choix de réponses et le temps de lecture n’augmentent pas l’intensité. Le retour retrouve le niveau correspondant à la question affichée.

Le placement soustrait les rectangles des textes et commandes à la fenêtre disponible ; sur téléphone, les fragments se glissent verticalement dans les marges. Les intrusions n’interceptent aucun clic et sont masquées aux lecteurs d’écran. Le défilement et le redimensionnement retirent la salve courante pour recalculer un placement sûr après une accalmie. La pause, le mouvement réduit, l’onglet masqué et les transitions suspendent les effets ; les timers et images d’animation sont nettoyés. La fin du questionnaire retire ce calque. Aucun champ persistant ni calcul d’affinité n’est ajouté.

Vérifié : compilation et lint réussis ; 65 tests passent, dont quatre nouveaux tests sur les seize niveaux, la sélection et les répétitions, la fin du scramble et le placement sans recouvrement à 320, 360, 768 et 1440 px. Navigateur : raccord depuis les Historiques, seize questions parcourues avec validation au clavier, quatre niveaux d’intrusion observés, pause et reprise sans salve immédiate, retour avec réponse conservée, reprise Q16 après rechargement et retrait du calque à la fin. Contrôle visuel à 320 px et sur ordinateur, sans débordement horizontal ni recouvrement observé des textes et commandes ; captures conservées. La préférence système de mouvement réduit et le masquage réel de l’onglet n’ont pas été basculés pendant cet essai.

Fichiers : `src/umbraIntrusionModel.ts`, `src/UmbraIntrusions.tsx`, `src/UmbraIntrusions.css`, raccord dans `src/UmbraScene.tsx` et `tests/umbraIntrusions.test.mjs`. Prochain checkpoint : Fabien juge la densité et le degré d’inquiétude avant la révélation des affinités.

## Journal — nom de campagne corrigé le 30 octobre 2026

Réalisé à la demande de Fabien : titre exact « It's a kind of magic » dans l’en-tête et le titre d’onglet de la scène umbrale, ainsi que dans le README. Le point de reprise est coché ; les glitchs graduels constituent la prochaine étape.

Vérifié : compilation et lint réussis ; aucune occurrence de l’ancienne coquille dans les sources et documents du projet. Le contrôle visuel reste à faire : le navigateur intégré et Edge renvoient `ERR_CONNECTION_TIMED_OUT` sur le serveur local pendant cette séance.

## Journal — questionnaire définitif du 30 octobre 2026

Source de vérité : `docs/tribes/QUESTIONNAIRE_SOURCE.md`, copiée intégralement depuis le document fourni par Fabien. Les seize citations, attributions, situations, titres secondaires, note de traduction et soixante-quatre réponses sont reproduits sans réécriture ni permutation. Cette validation remplace les propositions antérieures des lots 3 et 4 concernant la création des questions et des pondérations.

Données : `src/umbraQuestions.ts` contient le référentiel éditorial typé. Chaque réponse possède un identifiant numérique textuel stable et un axe interne P/A/D/C. L’interface affiche seulement le numéro et le texte. Aucun code, score, pourcentage ou résultat tribal n’est rendu.

Calcul : `getUmbraAffinity(draft)` reconstruit les scores, les seize choix avec leurs axes, la séquence brute et un historique `W20|…|P…-A…-D…-C…`. Une réponse vaut exactement un point ; la somme finale vaut seize. Les réponses suffisent à tout reconstruire : aucun state de scores ni copie persistée redondante. Les positions non répondues sont représentées par un tiret dans l’historique partiel. L’exemple illustratif de la source contenant B n’est pas une clé : seuls P/A/D/C sont produits par la clé technique.

Persistance : brouillon version 2, identifiants q01 à q16. La démo version 1 ne peut pas être interprétée comme un vrai résultat ; seul ce brouillon est réinitialisé. Le dossier humain et les Historiques sont conservés. La validation dédiée précède le contrôle générique des niveaux 0–5, afin d’autoriser les index Q07 à Q16 sans élargir les niveaux de fiche. Le mécanisme de sauvegarde et son format JSON global restent identiques ; aucune modification distante n’est nécessaire. Le transport connecté est vérifié par test local, sans connexion réelle ni envoi à un compte pendant cette itération.

Ambiance : le contrôleur parcourt seize positions. Chaque changement de question conserve la traversée de 420 + 540 ms, même à l’intérieur d’une même ambiance. Q01–Q04 : lisière ; Q05–Q08 : voile ; Q09–Q12 : profondeur ; Q13–Q16 : résonance. Le retour remonte selon la position de la question. L’aperçu libre garde ses quatre paliers. La prise de contrôle et les réglages visuels validés ne sont pas modifiés.

Arrivée : l’écran de fin existant utilise « Quelles visions du monde semblent résonner avec ton personnage ? ». Il permet de revoir les réponses et ne crée pas d’étape supplémentaire ni de sélection tribale factice. Les treize Tribus resteront accessibles lors de l’étape suivante.

Vérifications : compilation et lint réussis ; 61 tests passent. Comparaison intégrale des textes avec la source, clé des 64 réponses, profils dominants, égalité 4/4/4/4, somme seize, correction sans double comptage, anciennes sauvegardes, reprise Q11/Q16, conservation du dossier et du transport connecté. Navigateur : raccord depuis les Historiques, seize situations, double clic sans saut, réponse corrigée conservée, reprise Q11 non répondue, reprise Q16 choisie, validation au clavier, fin conservée après rechargement, navigation en pause et lisibilité à 320 px sans débordement horizontal. La préférence système de mouvement réduit n’a pas été basculée pendant cet essai.

