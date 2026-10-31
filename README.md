# It's a kind of magic — Aide à la création de personnage

Application web d'aide à la création de personnage, réalisée par **QUEVAL Fabien** pour le jeu de rôle **Werewolf: The Apocalypse**, dans le cadre de la campagne **« It's a kind of magic »**.

Pensée pour accompagner des joueurs débutants, elle propose un questionnaire progressif qui les aide à définir leur personnage sans avoir à maîtriser les règles au préalable. Leurs réponses permettent au meneur de jeu de préparer un personnage adapté à leurs envies et à leur manière de jouer.

## Le questionnaire

Le parcours adopte la présentation d'un questionnaire professionnel : expérience, capacités, compétences et parcours personnel. Cette approche permet aux joueurs de faire des choix concrets avant de découvrir leur traduction dans les règles du jeu.

- Définition du concept et de la profession du personnage.
- Classement et évaluation des domaines physiques, sociaux et mentaux.
- Classement et évaluation des aptitudes, savoir-faire et connaissances.
- Choix des ressources, relations et éléments de parcours du personnage.
- Effets visuels ponctuels intégrés à l'ambiance de la campagne.
- Traversée umbrale, résonances, exploration des treize Tribus et choix de l’Auspice sous les cinq lunes.
- Apothéose narrative, puis retour au dossier médico-professionnel complet et modifiable.
- Confirmation et préparation d’une impression pour l’entretien du 08 Novembre 2026 à 14h00 ; finition du personnage en séance 0.
- Relecture de l’expérience depuis chaque rubrique du dossier, avec les choix préremplis dans une copie temporaire qui préserve le dossier confirmé.

Les règles internes suivent **W20**. Les réponses sont conservées dans un brouillon local et, après identification, sauvegardées dans Supabase. Les dossiers sont individuels ; le total du Totem est calculé pour la meute autorisée.

## État du projet

Le questionnaire et l'écran d'identification par lien email sont implémentés. Le schéma de sauvegarde et les règles d'accès sont installés dans le projet Supabase dédié.

Avant l'ouverture aux joueurs, il reste à publier le site, configurer l'envoi des emails et les adresses de retour, créer la campagne et la meute, puis tester le parcours avec de vrais comptes.

Les droits de consultation du MJ sont prévus côté base ; l'interface de consultation des dossiers reste à construire.

Le déroulement du final, ses sources et les vérifications encore nécessaires sont décrits dans [la spécification de l’Apothéose](docs/tribes/APOTHEOSE_SPEC.md). L’aperçu natif d’impression et les essais avec de vrais comptes restent à vérifier avant ouverture.

La page `/?page=confidentialite` est accessible sans connexion, depuis les pieds de page de l’identification, du questionnaire médical et du dossier final. Elle s’ouvre dans un autre onglet pour conserver le parcours. Le contact indiqué est **Papy Fab, sur le Discord de l’Antre de la Manticore**, par message privé. La suppression des comptes et dossiers actifs après la séance du **8 novembre 2026** est une opération manuelle annoncée par l’organisateur ; aucun effacement automatique n’a été ajouté. La notice distingue les dossiers en ligne, les copies locales, les fiches remises au MJ et les éventuelles sauvegardes techniques des prestataires.

## Lancer le projet en local

Prérequis : **Node.js 24** et **npm**.

Depuis le dossier du projet, installer les dépendances :

```powershell
npm ci
```

Pour connecter l'application à Supabase, créer un fichier `.env.local` à partir de `.env.example`, puis renseigner l'URL du projet et sa clé publique :

```dotenv
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_replace_me
```

Si `.env.local` est déjà configuré, le conserver. Ce fichier est exclu de Git. Utiliser uniquement une clé publique dans l'application ; les clés secrètes restent côté serveur.

Démarrer le site :

```powershell
npm run dev
```

Ouvrir l'adresse affichée dans le terminal. Pour arrêter le serveur, utiliser `Ctrl+C`.

En développement, les écrans peuvent être consultés directement, par exemple avec `?screen=attributes` ou `?screen=backgrounds`. Ces aperçus utilisent des brouillons distincts des dossiers connectés et sont désactivés dans la version publiée.

## Vérifier et préparer une publication

| Commande | Utilité |
| --- | --- |
| `npm run lint` | Vérifier le code avec ESLint. |
| `npm test` | Vérifier les règles, la sauvegarde et les accès au schéma de données dans un Postgres local de test. |
| `npm run build` | Générer la version de publication dans `dist/`. |
| `npm run preview` | Consulter localement la version générée. |

Les tests locaux ne remplacent pas les essais de connexion par email et de sauvegarde avec de vrais comptes sur le site publié.

## Technologies et documentation

- React et TypeScript pour l'interface.
- Vite pour le développement et la préparation du site.
- Supabase pour l'identification et la sauvegarde des dossiers.

Les règles d'accès et les étapes d'activation sont détaillées dans [la documentation Supabase du projet](docs/TOTEM_SUPABASE.md). Le schéma SQL se trouve dans [supabase/schema.sql](supabase/schema.sql).
