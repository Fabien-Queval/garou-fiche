# Matrice de résonances tribales W20

## Objectif

À la fin des 16 questions de la Traversée Umbrale, le système dispose déjà de quatre scores idéologiques :

- `P` — Préserver l’irremplaçable
- `A` — Rendre le monde habitable
- `D` — Porter la charge
- `C` — Voir ce qui échappe

Ces quatre scores doivent être conservés.

Ils ne suffisent cependant pas à distinguer les Tribus appartenant à une même famille idéologique.

Une seconde couche de scoring doit donc être calculée **directement à partir des réponses choisies**.

Cette couche produit une résonance indépendante pour chacune des 13 Tribus.

---

# Principe de scoring tribal

Chaque réponse peut attribuer :

- `+2` à une Tribu dont elle exprime fortement la philosophie ;
- éventuellement `+1` à une autre Tribu lorsqu’une vraie proximité canonique existe ;
- `0` à toutes les autres.

Il n’existe :

- aucun score négatif ;
- aucun malus ;
- aucune exclusion ;
- aucun multiplicateur lié au score P/A/D/C.

Les scores P/A/D/C et les scores tribaux sont **deux lectures parallèles des mêmes réponses**.

Ne jamais faire :

```ts
tribeScore *= axisScore;
```

ou toute autre pondération de ce genre.

Cela compterait deux fois la même information.

---

# Calibration importante

La matrice a été équilibrée afin que **chaque Tribu dispose exactement du même maximum théorique : 12 points**.

Ainsi :

- aucune normalisation n’est nécessaire ;
- un score de `8` chez les Fianna est directement comparable à un score de `8` chez les Glass Walkers ;
- les quatre Tribus de l’attracteur P ne sont pas désavantagées par rapport aux familles de trois Tribus.

| Tribu | Résonances +2 | Résonances +1 | Maximum |
|---|---:|---:|---:|
| Black Furies | 4 | 4 | 12 |
| Fianna | 4 | 4 | 12 |
| Red Talons | 4 | 4 | 12 |
| Wendigo | 4 | 4 | 12 |
| Bone Gnawers | 5 | 2 | 12 |
| Children of Gaia | 5 | 2 | 12 |
| Glass Walkers | 6 | 0 | 12 |
| Get of Fenris | 5 | 2 | 12 |
| Shadow Lords | 6 | 0 | 12 |
| Silver Fangs | 5 | 2 | 12 |
| Silent Striders | 5 | 2 | 12 |
| Stargazers | 6 | 0 | 12 |
| Uktena | 5 | 2 | 12 |

Cette calibration doit être conservée.

---

# Identifiants techniques recommandés

```ts
type TribeId =
  | 'blackFuries'
  | 'boneGnawers'
  | 'childrenOfGaia'
  | 'fianna'
  | 'getOfFenris'
  | 'glassWalkers'
  | 'redTalons'
  | 'shadowLords'
  | 'silentStriders'
  | 'silverFangs'
  | 'stargazers'
  | 'uktena'
  | 'wendigo';
```

Une réponse peut contenir :

```ts
interface TribalResonance {
  tribe: TribeId;
  weight: 1 | 2;
}
```

Puis :

```ts
interface UmbraAnswer {
  id: string;
  text: string;
  axis: 'P' | 'A' | 'D' | 'C';
  tribalResonances: TribalResonance[];
}
```

---

# Matrice définitive

Les numéros de réponses correspondent exactement à l’ordre actuellement validé dans le questionnaire.

## Q01 — Quand arrive la fin…

| Réponse | Résonance tribale |
|---|---|
| 1 — C | Stargazers `+2` |
| 2 — A | Bone Gnawers `+2` |
| 3 — P | Fianna `+2` · Wendigo `+1` |
| 4 — D | Shadow Lords `+2` · Red Talons `+1` |

---

## Q02 — Lourde est la Couronne

| Réponse | Résonance tribale |
|---|---|
| 1 — A | Children of Gaia `+2` · Bone Gnawers `+1` |
| 2 — D | Shadow Lords `+2` · Silver Fangs `+1` |
| 3 — C | Uktena `+2` · Silent Striders `+1` |
| 4 — P | Black Furies `+2` · Wendigo `+1` |

---

## Q03 — Trop avidement, trop profondément…

| Réponse | Résonance tribale |
|---|---|
| 1 — P | Red Talons `+2` · Black Furies `+1` |
| 2 — C | Uktena `+2` |
| 3 — D | Silver Fangs `+2` · Get of Fenris `+1` |
| 4 — A | Glass Walkers `+2` |

---

## Q04 — La lettre et l’esprit

| Réponse | Résonance tribale |
|---|---|
| 1 — C | Stargazers `+2` |
| 2 — P | Black Furies `+2` |
| 3 — D | Silver Fangs `+2` |
| 4 — A | Glass Walkers `+2` |

---

## Q05 — Un tort réparé… mais le Livre reste plein de rancunes

| Réponse | Résonance tribale |
|---|---|
| 1 — P | Wendigo `+2` · Fianna `+1` |
| 2 — D | Silver Fangs `+2` |
| 3 — A | Glass Walkers `+2` |
| 4 — C | Uktena `+2` |

---

## Q06 — En un seul jour et une nuit néfastes…

| Réponse | Résonance tribale |
|---|---|
| 1 — D | Shadow Lords `+2` |
| 2 — C | Silent Striders `+2` |
| 3 — A | Bone Gnawers `+2` · Children of Gaia `+1` |
| 4 — P | Black Furies `+2` · Red Talons `+1` |

---

## Q07 — Toute magie a un prix

| Réponse | Résonance tribale |
|---|---|
| 1 — C | Uktena `+2` · Silent Striders `+1` |
| 2 — A | Bone Gnawers `+2` |
| 3 — P | Black Furies `+2` · Children of Gaia `+1` |
| 4 — D | Shadow Lords `+2` |

---

## Q08 — Je vais être en retard !

| Réponse | Résonance tribale |
|---|---|
| 1 — P | Red Talons `+2` · Fianna `+1` |
| 2 — C | Stargazers `+2` |
| 3 — D | Get of Fenris `+2` · Silver Fangs `+1` |
| 4 — A | Children of Gaia `+2` |

---

## Q09 — Le monde a changé

| Réponse | Résonance tribale |
|---|---|
| 1 — A | Glass Walkers `+2` |
| 2 — P | Fianna `+2` · Wendigo `+1` |
| 3 — D | Silver Fangs `+2` |
| 4 — C | Silent Striders `+2` |

---

## Q10 — Toute technologie suffisamment avancée…

| Réponse | Résonance tribale |
|---|---|
| 1 — C | Uktena `+2` |
| 2 — D | Shadow Lords `+2` |
| 3 — P | Red Talons `+2` |
| 4 — A | Glass Walkers `+2` · Bone Gnawers `+1` |

---

## Q11 — Le médaillon vibre

| Réponse | Résonance tribale |
|---|---|
| 1 — D | Shadow Lords `+2` |
| 2 — P | Red Talons `+2` · Black Furies `+1` |
| 3 — A | Bone Gnawers `+2` |
| 4 — C | Silent Striders `+2` · Uktena `+1` |

---

## Q12 — Qu’est-ce que ça t’a coûté ? — Tout.

| Réponse | Résonance tribale |
|---|---|
| 1 — P | Wendigo `+2` · Red Talons `+1` |
| 2 — C | Stargazers `+2` · Uktena `+1` |
| 3 — A | Children of Gaia `+2` |
| 4 — D | Get of Fenris `+2` |

---

## Q13 — La force du Clan, c’est le Loup…

| Réponse | Résonance tribale |
|---|---|
| 1 — A | Children of Gaia `+2` · Black Furies `+1` |
| 2 — C | Silent Striders `+2` · Fianna `+1` |
| 3 — D | Get of Fenris `+2` |
| 4 — P | Wendigo `+2` · Red Talons `+1` |

---

## Q14 — Tu as changé

| Réponse | Résonance tribale |
|---|---|
| 1 — C | Silent Striders `+2` |
| 2 — A | Children of Gaia `+2` |
| 3 — D | Get of Fenris `+2` |
| 4 — P | Fianna `+2` |

---

## Q15 — Nous sommes ce qu’ils dépassent

| Réponse | Résonance tribale |
|---|---|
| 1 — D | Get of Fenris `+2` · Black Furies `+1` |
| 2 — P | Fianna `+2` · Wendigo `+1` |
| 3 — A | Glass Walkers `+2` |
| 4 — C | Stargazers `+2` |

---

## Q16 — Le véritable général sait…

| Réponse | Résonance tribale |
|---|---|
| 1 — C | Stargazers `+2` |
| 2 — D | Silver Fangs `+2` · Get of Fenris `+1` |
| 3 — P | Wendigo `+2` · Fianna `+1` |
| 4 — A | Bone Gnawers `+2` |

---

# Version TypeScript compacte

Work peut soit intégrer les résonances directement dans les objets `answers`, soit utiliser une constante séparée.

Exemple recommandé :

```ts
const TRIBAL_RESONANCE_MATRIX = {
  q01: [
    { stargazers: 2 },
    { boneGnawers: 2 },
    { fianna: 2, wendigo: 1 },
    { shadowLords: 2, redTalons: 1 },
  ],

  q02: [
    { childrenOfGaia: 2, boneGnawers: 1 },
    { shadowLords: 2, silverFangs: 1 },
    { uktena: 2, silentStriders: 1 },
    { blackFuries: 2, wendigo: 1 },
  ],

  q03: [
    { redTalons: 2, blackFuries: 1 },
    { uktena: 2 },
    { silverFangs: 2, getOfFenris: 1 },
    { glassWalkers: 2 },
  ],

  q04: [
    { stargazers: 2 },
    { blackFuries: 2 },
    { silverFangs: 2 },
    { glassWalkers: 2 },
  ],

  q05: [
    { wendigo: 2, fianna: 1 },
    { silverFangs: 2 },
    { glassWalkers: 2 },
    { uktena: 2 },
  ],

  q06: [
    { shadowLords: 2 },
    { silentStriders: 2 },
    { boneGnawers: 2, childrenOfGaia: 1 },
    { blackFuries: 2, redTalons: 1 },
  ],

  q07: [
    { uktena: 2, silentStriders: 1 },
    { boneGnawers: 2 },
    { blackFuries: 2, childrenOfGaia: 1 },
    { shadowLords: 2 },
  ],

  q08: [
    { redTalons: 2, fianna: 1 },
    { stargazers: 2 },
    { getOfFenris: 2, silverFangs: 1 },
    { childrenOfGaia: 2 },
  ],

  q09: [
    { glassWalkers: 2 },
    { fianna: 2, wendigo: 1 },
    { silverFangs: 2 },
    { silentStriders: 2 },
  ],

  q10: [
    { uktena: 2 },
    { shadowLords: 2 },
    { redTalons: 2 },
    { glassWalkers: 2, boneGnawers: 1 },
  ],

  q11: [
    { shadowLords: 2 },
    { redTalons: 2, blackFuries: 1 },
    { boneGnawers: 2 },
    { silentStriders: 2, uktena: 1 },
  ],

  q12: [
    { wendigo: 2, redTalons: 1 },
    { stargazers: 2, uktena: 1 },
    { childrenOfGaia: 2 },
    { getOfFenris: 2 },
  ],

  q13: [
    { childrenOfGaia: 2, blackFuries: 1 },
    { silentStriders: 2, fianna: 1 },
    { getOfFenris: 2 },
    { wendigo: 2, redTalons: 1 },
  ],

  q14: [
    { silentStriders: 2 },
    { childrenOfGaia: 2 },
    { getOfFenris: 2 },
    { fianna: 2 },
  ],

  q15: [
    { getOfFenris: 2, blackFuries: 1 },
    { fianna: 2, wendigo: 1 },
    { glassWalkers: 2 },
    { stargazers: 2 },
  ],

  q16: [
    { stargazers: 2 },
    { silverFangs: 2, getOfFenris: 1 },
    { wendigo: 2, fianna: 1 },
    { boneGnawers: 2 },
  ],
} as const;
```

---

# Calcul du résultat

Initialiser :

```ts
const tribeScores: Record<TribeId, number> = {
  blackFuries: 0,
  boneGnawers: 0,
  childrenOfGaia: 0,
  fianna: 0,
  getOfFenris: 0,
  glassWalkers: 0,
  redTalons: 0,
  shadowLords: 0,
  silentStriders: 0,
  silverFangs: 0,
  stargazers: 0,
  uktena: 0,
  wendigo: 0,
};
```

Puis parcourir les réponses choisies :

```ts
for (const answer of selectedAnswers) {
  for (const resonance of answer.tribalResonances) {
    tribeScores[resonance.tribe] += resonance.weight;
  }
}
```

Ou utiliser directement la matrice avec l’index de réponse sélectionné.

---

# Recalcul déterministe

Ne pas considérer le total sauvegardé comme source de vérité.

La source de vérité doit rester :

```ts
selectedAnswers
```

Les `axisScores` et `tribeScores` doivent pouvoir être recalculés à tout moment à partir des réponses.

Ainsi, si le joueur revient à Q08 et modifie sa réponse :

- aucun ancien point ne reste accidentellement présent ;
- P/A/D/C est recalculé ;
- les 13 scores tribaux sont recalculés ;
- le résultat reste déterministe.

---

# Résultat de Phase 3

À la fin de Q16 :

```ts
const highestScore = Math.max(...Object.values(tribeScores));
```

## Résonance majeure

Toute Tribu dont :

```ts
score === highestScore
```

possède une **résonance majeure**.

Toutes les égalités sont conservées.

Aucun tie-break.

---

## Résonance proche

Une Tribu peut également être suggérée avec une intensité légèrement inférieure si :

```ts
highestScore >= 5 &&
score === highestScore - 1
```

Ainsi :

### Exemple

```text
Fianna          7
Silent Striders 7
Uktena          6
Wendigo         5
Glass Walkers   3
...
```

Révélation :

- Fianna → résonance majeure
- Silent Striders → résonance majeure
- Uktena → résonance proche
- Wendigo → non suggéré
- les autres → non suggérées

Si le meilleur score n’est que `4` ou moins, ne pas élargir automatiquement aux scores `-1`.

Dans ce cas, seules les Tribus au meilleur score sont mises en avant.

Cela évite qu’un profil très diffus illumine artificiellement la moitié du Cercle.

---

# Aucune limite artificielle

Ne jamais imposer :

```text
top 3
```

ou :

```text
exactement 4 Tribus
```

Le nombre de Tribus mises en lumière dépend réellement du profil.

Il peut donc y avoir :

- 1 Tribu ;
- 2 Tribus ;
- 3 Tribus ;
- 5 Tribus si une égalité réelle se produit.

Les égalités sont une information du questionnaire.

Elles ne constituent pas un problème à résoudre.

---

# Présentation visuelle Phase 3

Les treize sceaux restent visibles.

## Résonance majeure

Effets possibles :

- halo lunaire clair ;
- respiration lumineuse lente ;
- filaments umbraux convergeant vers le sceau ;
- légère augmentation de contraste ;
- constellation stabilisée autour du symbole.

## Résonance proche

Effets plus faibles :

- halo discret ;
- pulsation plus lente ;
- quelques filaments ou particules.

## Autres Tribus

Elles restent :

- visibles ;
- lisibles ;
- accessibles ;
- sélectionnables dans la phase suivante.

Elles ne sont jamais :

- grisées ;
- barrées ;
- verrouillées ;
- assombries au point de paraître refusées.

---

# Texte de révélation

Proposition principale :

> **Certaines voix vous reconnaissent.**

Puis :

> Votre passage dans le Voile a laissé des traces.  
> Certaines visions du monde répondent davantage aux vôtres.  
> Elles ne décident pourtant pas de ce que vous êtes.

Ou, plus court :

> **Certaines voix vous reconnaissent.**  
> Ce n’est ni un jugement, ni un destin. Seulement une résonance.

Ne jamais afficher :

- « Votre meilleure Tribu »
- « Vous êtes un Fianna »
- « Compatibilité 87 % »
- « Mauvaise compatibilité »
- une note numérique au joueur.

Les nombres restent internes.

---

# Conservation des quatre attracteurs

Les scores :

```ts
{
  P,
  A,
  D,
  C
}
```

restent sauvegardés.

Ils pourront éventuellement servir plus tard :

- à expliquer pourquoi certaines Tribus résonnent ;
- à produire une visualisation des quatre philosophies ;
- à effectuer du debugging ou du playtest.

Ils ne modifient cependant pas les `tribeScores`.

---

# Persistance recommandée

Conserver au minimum :

```ts
interface UmbraAssessmentResult {
  answers: Record<string, string>;

  axisScores: {
    P: number;
    A: number;
    D: number;
    C: number;
  };

  tribeScores: Record<TribeId, number>;

  majorResonances: TribeId[];
  nearResonances: TribeId[];
}
```

`majorResonances` et `nearResonances` peuvent également être recalculés plutôt que persistés.

---

# Phase 4

La Phase 3 révèle seulement les résonances.

Elle ne doit pas encore afficher toutes les informations détaillées des Tribus.

La Phase 4 permettra :

- l’ouverture des 13 cartes ;
- philosophie tribale ;
- Totem ;
- identité culturelle ;
- particularités de jeu ;
- restrictions éventuelles ;
- conseils HRP ;
- Gifts ;
- choix définitif de la Tribu.

Les Tribus suggérées commencent simplement la Phase 4 avec leur sceau déjà en résonance.

Le joueur peut néanmoins ouvrir et sélectionner n’importe laquelle des treize.

---

# Instruction directe pour Work

> Implémente une seconde couche de scoring tribal sur le questionnaire existant.
>
> Ne modifie ni les textes ni l’ordre des 16 questions.
>
> Conserve le scoring P/A/D/C déjà présent.
>
> Ajoute exactement la matrice de résonance tribale fournie dans cette spécification.
>
> Chaque réponse attribue `+2` à sa résonance principale et éventuellement `+1` à sa résonance secondaire.
>
> Aucun score négatif et aucun multiplicateur P/A/D/C ne doivent être ajoutés.
>
> Les 13 Tribus ont volontairement été calibrées avec un plafond théorique identique de 12 points : ne normalise donc pas leurs résultats et ne modifie pas les coefficients.
>
> Les scores doivent être recalculables intégralement à partir des réponses sélectionnées.
>
> Après Q16, calcule les résonances majeures et proches selon les règles définies ici.
>
> Respecte toutes les égalités. N’ajoute aucun tie-break.
>
> Ne limite pas artificiellement le résultat à un nombre fixe de Tribus.
>
> Les 13 sceaux restent visibles et accessibles.
>
> La Phase 3 ne choisit aucune Tribu : elle révèle seulement celles qui résonnent le plus fortement.
>
> Ne développe pas encore les cartes détaillées ou le choix final de Phase 4.
>
> À la fin de l’intervention, indique les fichiers modifiés, la structure de données retenue et confirme par test que chacune des 13 Tribus possède bien un maximum théorique de 12 points.