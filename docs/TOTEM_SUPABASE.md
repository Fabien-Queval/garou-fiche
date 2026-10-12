# Raccordement du Totem collectif

## État actuel

Le code local comporte le client officiel Supabase, un écran d'identification par lien email et la sauvegarde de toutes les réponses. Le schéma a été appliqué à **GAROU_fiches** le 12 octobre 2026, après autorisation explicite de Fabien.

Le projet dédié `GAROU_fiches` (`qfqlyytjecnvhlvtkubr`) est actif. Il contient maintenant la table publique des fiches et les quatre tables privées de gestion. Le projet `9TS_CORE_JDR_Test` ne doit pas être utilisé.

L'écran « Accéder à votre dossier » est préparé avant le questionnaire. Il gère la demande de lien, les erreurs et le délai de renvoi. Aucun email n'a été envoyé pendant les tests. L'envoi pour les joueurs reste à configurer avec un fournisseur SMTP.

Le fichier `supabase/schema.sql` est testé dans un Postgres local en mémoire et installé dans le projet distant. Deux index complémentaires couvrent les relations groupes/campagnes et références d'accès/groupes.

Les accès installés sont : chaque joueur lit et sauvegarde sa propre fiche ; un MJ explicitement affecté à un groupe peut consulter les fiches de ce groupe ; aucun accès anonyme aux fiches. L'agrégat du Totem renvoie uniquement la somme et la contribution du demandeur. Les opérations privilégiées restent dans le schéma privé et les fonctions publiques sont `SECURITY INVOKER`.

Les brouillons sont séparés par compte. Un ancien brouillon non identifié est repris seulement sur choix explicite du joueur. La copie locale est conservée si un envoi distant échoue. Les écritures sont sérialisées. Les aperçus `?screen=…` utilisent des brouillons de développement distincts et ne sauvegardent pas dans les vrais dossiers.

L'URL et la clé publique de **GAROU_fiches** sont configurées dans `.env.local`, ignoré par Git. Aucune clé secrète ou `service_role` n'est utilisée dans le navigateur. Aucun total collectif fictif n'est utilisé.

## Contrat installé

`createSupabaseTotemRepository` dans `src/totemRepository.ts` accepte une URL Supabase, une clé publique, un identifiant de campagne, un identifiant de groupe et une fonction obtenant le jeton de la session authentifiée. L'écran d'identification injecte ce repository dans le questionnaire après chargement du contexte de groupe autorisé.

- `garou_totem_summary(p_campaign_id, p_group_id)` renvoie uniquement `{ total, ownContribution }`.
- `garou_save_questionnaire(p_answers, p_contribution)` sauvegarde toutes les réponses du joueur authentifié, avec sa contribution dans une colonne séparée.
- `garou_context()` retourne uniquement le groupe et le rôle autorisés du demandeur. `garou_join_group(p_code)` vérifie une référence d'accès expirante et n'attribue que le rôle joueur.
- `garou_save_backgrounds(p_campaign_id, p_group_id, p_contribution, p_backgrounds)` sauvegarde les réponses privées du joueur courant et sa contribution, puis le client recharge l'agrégat.
- Le JSON des réponses exclut `values.totemContribution` : la contribution doit être stockée une seule fois dans la colonne individuelle utilisée par l'agrégat. Aucun total collectif n'est enregistré dans une fiche.
- L'écran récupère le total à l'ouverture, puis propose une actualisation et le partage de la contribution. La sauvegarde automatique peut avoir déjà publié une modification ; actualiser recharge alors le total du groupe.

## Règles côté base

Les fonctions suivent ces règles, sans inventer les relations de campagne/meute :

1. Déterminer l'identité exclusivement à partir de `auth.uid()` ; refuser une session absente.
2. Vérifier dans les adhésions gérées par le serveur que cet utilisateur appartient au groupe demandé **et** que ce groupe appartient à la campagne demandée.
3. En lecture, calculer `SUM` sur les contributions individuelles de ce groupe/cette campagne uniquement. Ne renvoyer aucune identité, réponse narrative, fiche ou ligne individuelle d'un autre joueur.
4. En écriture, autoriser uniquement la contribution et les réponses du joueur courant. Valider les onze clés, les entiers entre 0 et 5, le budget total au plus égal à 5 et les limites de taille des textes. Une fiche validée exige un budget complet et le type d'esprits lorsque l'Héritage spirituel est non nul.
5. Activer RLS sur les tables exposées et limiter les fiches privées à leur propriétaire. Les adhésions ne doivent pas être librement modifiables par un joueur.
6. Si l'agrégat exige des privilèges pour lire les contributions des autres, placer le calcul privilégié dans un schéma privé, avec contrôle d'adhésion explicite, chemin de recherche fixé et droits d'exécution restreints. Ne pas exposer de vue qui contourne RLS ni une fonction privilégiée ouverte à `PUBLIC`/`anon`.
7. Tester deux utilisateurs dans la même meute, une autre meute de la même campagne, une autre campagne et une session absente. Vérifier qu'une modification individuelle change la somme au prochain fetch et qu'aucune fiche privée n'est lisible.

Le schéma installé crée une table publique de fiches privées et quatre tables privées : campagnes, groupes, adhésions et références d'accès.

Les tests exécutent ce même SQL dans un Postgres local avec des identités fictives et un équivalent de `auth.uid()`. Ils vérifient la confidentialité des fiches, l'accès MJ limité à son groupe, les autres campagnes refusées, le budget, les invitations et les accès anonymes refusés.

Les contrôles distants ont confirmé RLS sur les cinq tables, aucun droit de lecture anonyme, aucune écriture directe des utilisateurs connectés, des fonctions publiques non privilégiées et les chemins de recherche fixés. Le conseiller de sécurité signale seulement, à titre informatif, les quatre tables privées sans politique : leur fermeture est volontaire, les opérations autorisées passent par les fonctions contrôlées. Aucun avertissement de sécurité n'a été remonté. Ces contrôles ne remplacent pas les essais avec de vraies sessions et des emails réels.

## Activation ultérieure

Autoriser `http://127.0.0.1:5173/` dans les URLs de retour Auth pour le développement, puis le domaine réel à la publication. Configurer le SMTP : le service par défaut ne délivre qu'aux membres de l'équipe du projet, les joueurs ne doivent pas rejoindre cette équipe.

Fabien se connectera lui-même une première fois. Son identifiant Auth pourra ensuite être associé au rôle MJ, et la campagne/meute sera créée par l'administration avec des références d'accès pour les joueurs. Le rôle MJ n'est jamais donné automatiquement au premier inscrit. Aucune campagne, invitation ou affectation MJ distante n'a été créée pendant la préparation.

Les tests du vrai lien email, de la reprise sur un autre navigateur et du Totem avec deux vrais comptes restent à effectuer après cette activation.

Documentation consultée : [fonctions Supabase](https://supabase.com/docs/guides/database/functions), [RLS et fonctions privées](https://supabase.com/docs/guides/database/postgres/row-level-security).
