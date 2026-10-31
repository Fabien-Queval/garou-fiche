# Les cinq visages de Luna — Phase 5

Vérification du 31 octobre 2026. Source primaire : le livre VO W20 fourni par Fabien, [Werewolf: The Apocalypse — 20th Anniversary Edition](../../../werewolf-the-apocalypse-20th-anniversary-edition_compress.pdf), pages imprimées 76–79 (pages PDF 78–81).

| Phase affichée | Auspice | Désignation VO du livre | Pages imprimées |
|---|---|---|---|
| Nouvelle lune | Ragabash | The New Moon, The Trickster | 77 |
| Croissant | Théurge | The Crescent Moon, The Seer | 77 |
| Demi-lune | Philodox | The Half Moon, The Mediator | 77–78 |
| Gibbeuse | Galliard | The Gibbous Moon, The Moon Dancer | 78–79 |
| Pleine lune | Ahroun | The Full Moon, The Warrior | 79 |

Les descriptions, invocations, questions de personnage et intitulés français sont des synthèses éditoriales originales. Chaque fiche présente une vocation, sa place dans la meute et une tension à jouer. Elles restent à relire par Fabien ; elles ne remplacent pas le livre ni les adaptations de campagne.

Dans W20, la phase de la lune à la naissance du Garou détermine son Auspice. Le joueur choisit ici cette composante de son personnage en création ; l’interface ne calcule pas l’Auspice à partir d’une date de naissance humaine ou des réponses du questionnaire. Changer cette préférence pendant la création n’est pas présenté comme le Rite de Renonciation d’un Garou déjà en jeu.

Le site ne distribue automatiquement ni Rage ni Dons. La distinction croissante/décroissante à l’intérieur d’un même Auspice, les règles détaillées et la finition de fiche restent à la séance 0. Il n’y a aucun verrou dépendant de la Tribu ou des scores de résonance, ni de nouveau questionnaire.

## Direction visuelle retenue

Fabien fournit [Loup sous la voûte céleste](../../../Loup%20sous%20la%20vo%C3%BBte%20c%C3%A9leste.png). L’image reste fixe, sans modification de composition. Une copie WebP à la résolution originale de 1672 × 941 pixels est intégrée sous `src/assets/lunar-plain.webp` (266 034 octets). Le PNG original reste intact à la racine.

Les lunes sont dessinées en SVG et superposées à cette scène. Une lune principale à la fois, cinq repères de navigation, des flèches et un passage en arc avec fondu : la lune précédente se couche et la suivante se lève. Les proportions éclairées sont une représentation visuelle des cinq catégories W20, pas une simulation astronomique datée. Aucune animation n’altère la plaine ni le loup. Le survol et le focus renforcent la lumière ; le nom reste accessible au clavier et sur téléphone.

Après le retour de Fabien sur les saccades, chaque phase partage une image SVG mise en cache entre la lune principale et son repère. Le grain reste dans cette image ; il n’y a plus d’arbre de filtres SVG dans la scène. La trajectoire utilise un arc circulaire continu, sans changement d’échelle ni freinage intermédiaire. Une contre-rotation garde la lune droite. Le halo varie par opacité et les indications de composition sont limitées au temps du passage. La lune n’hérite plus de l’assombrissement générique des boutons désactivés pendant le déplacement : sa luminosité ne saute plus au moment de redevenir cliquable.

La fiche reste à droite sur ordinateur pour laisser le loup visible. Sur téléphone, elle prend place après la scène, avec déplacement du regard vers son début, texte complet et fermeture accessible. Le passage dure 1,8 seconde ; la pause et la préférence de mouvement réduit permettent une arrivée immédiate. Les mouvements transitoires ne sont pas enregistrés.

## Préférence et reprise

L’accès suit une Tribu explicitement confirmée. Parcourir les lunes, ouvrir une fiche et annuler une confirmation ne modifient aucune préférence existante. Seule « Confirmer mon Auspice » écrit une nouvelle préférence, avec `version: 1`, un identifiant d’Auspice et `validation: 'unreviewed'`.

Le brouillon version deux est étendu par des champs facultatifs : `auspiceStage` (`explore` ou `chosen`), `viewedAuspice` et `auspiceChoice`. Le premier décrit l’étape, le deuxième la lune regardée, le troisième la préférence confirmée. La reprise d’un choix confirmé s’appuie sur sa préférence, jamais sur le seul curseur de navigation. Les anciennes sauvegardes restent valides ; des métadonnées lunaires corrompues sont écartées sans perdre la Tribu ni les seize réponses valides.

Les préférences tribale et lunaire restent indépendantes. Retour aux Tribus, correction des réponses ou nouvelle exploration : les préférences restent présentes jusqu’à une nouvelle confirmation explicite. Le transport JSON existant les conserve ; aucune nouvelle table ou modification distante n’est nécessaire pour cette phase. Les essais avec de vrais comptes font partie de la vérification globale avant ouverture.
