# Plan d’attaque — Affinités tribales et traversée umbrale

Date : 29 octobre 2026.
Projet : Garou_Test — campagne « It's a King of Magic ».
Statut : thème de la première itération du lot 1 validé explicitement par Fabien. La véritable animation de descente et la rupture initiale restent à réaliser. Les questions et le calcul des affinités restent à construire.

## 1. Intention et décisions retenues

- Le site quitte progressivement son apparence administrative pour devenir pleinement Garou, lunaire et spirituel.
- La rupture donne momentanément l’impression d’un plantage. Les réponses et la navigation restent réellement protégées.
- Une phrase apparaît entière, sans effet de frappe :
  > Oubliez l'Humain.. Laissez parler le Loup en vous. Que feriez vous vraiment, débarrassé de la peau d'homme ?
- Le questionnaire suit cette entrée. Il concerne le personnage que le joueur veut incarner.
- Chaque réponse validée accompagne un passage vers davantage de profondeur.
- Des wisps bleutés, des lumières argentées, des brumes et des signes composent la présence umbrale.
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

Les deux sources sont copiées intégralement depuis les textes joints par Fabien. Le brief initial décrit une façade administrative encore visible : la décision ultérieure de basculer pleinement Garou prévaut.

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

Clarification confirmée avec Fabien : les quatre paliers actuels changent la présence visuelle ; ils ne réalisent pas encore une descente à travers le voile. Le faux plantage initial est également à construire.

Prochains checkpoints : enregistrer le thème validé dans un commit exécuté par Fabien ; construire la descente entre deux paliers (décor qui s’éloigne, traversée d’un voile, nouveau plan qui émerge) ; puis réaliser la rupture administrative initiale et l’entrée progressive. Les textes et commandes doivent retrouver leur stabilité après chaque passage. Le lot 1 reste ouvert jusqu’à ces réalisations et à leur validation.

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

Constat local au 29 octobre :
- App.tsx s’arrête actuellement à la phase « backgrounds ».
- Le bouton « Continuer » des Historiques confirme le volet puis devient « Validé ».
- Il faut ajouter le passage vers la traversée et tester le retour.

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
- [ ] Lot 1 — Animation de descente et rupture initiale réalisées et validées.
- [ ] Lot 2 — Référentiel tribal validé.
- [ ] Lot 3 — Questions et matrice validées.
- [ ] Lot 4 — Calcul testé.
- [ ] Lot 5 — Expérience complète validée.
- [ ] Lot 6 — Raccord et sauvegarde vérifiés.
- [ ] Lot 7 — Vérification et ouverture.

Pour chaque lot, mettre à jour ce document avec le résultat observé, les décisions prises et les points encore ouverts. Fabien valide le contenu et le ressenti. Zia implémente dans le périmètre demandé ; Fabien exécute les commandes Git.

Prochaine action : guider Fabien pour enregistrer le thème validé dans Git, puis réaliser et faire essayer la véritable descente entre deux paliers. La rupture initiale viendra ensuite.

