export type AffinityAxis = 'P' | 'A' | 'D' | 'C'
export type UmbraAnswer = '1' | '2' | '3' | '4'
export type UmbraQuestion = {
    id: string
    quote: string
    attribution: string
    title?: string
    note?: string
    situation: readonly string[]
    answers: readonly { id: UmbraAnswer; text: string; axis: AffinityAxis }[]
}

// Texte validé : docs/tribes/QUESTIONNAIRE_SOURCE.md.
export const UMBRA_QUESTIONS = [
    {
        "id": "q01",
        "quote": "« Tout ce qui a un début a une fin. »",
        "attribution": "L’Oracle, Matrix Revolutions",
        "title": "Quand arrive la fin…",
        "situation": [
            "Un lieu auquel votre groupe est profondément attaché va disparaître.",
            "Vous ne pourrez pas tout sauver.",
            "Que faites-vous ?"
        ],
        "answers": [
            {
                "id": "1",
                "text": "Avant de sauver quoi que ce soit, je veux savoir ce qui compte vraiment ici. On s’attache facilement aux symboles ; je veux comprendre ce qui faisait réellement vivre ce lieu.",
                "axis": "C"
            },
            {
                "id": "2",
                "text": "Je n’ai pas le temps de faire du sentiment. Armes, outils, vivres, ressources et personnes. Je trie ce que je peux sauver sans mettre le reste en péril.",
                "axis": "A"
            },
            {
                "id": "3",
                "text": "Il nous faut préserver ce qui est précieux, ce qui incarne notre passé. Ainsi, nous sauverons notre futur.",
                "axis": "P"
            },
            {
                "id": "4",
                "text": "Moi, j’organise la suite. Je tiens le cap. Il nous faut des priorités claires, et si personne d’autre n’est capable de trancher, je le ferai. J’assumerai la décision finale.",
                "axis": "D"
            }
        ]
    },
    {
        "id": "q02",
        "quote": "Lourde est la Couronne",
        "attribution": "Linkin Park, Heavy Is the Crown",
        "situation": [
            "Quelqu’un que votre groupe respecte depuis longtemps vient de prendre une décision catastrophique.",
            "Il reconnaît son erreur.",
            "Que faites-vous ?"
        ],
        "answers": [
            {
                "id": "1",
                "text": "Je m’occupe d’abord de ceux qui ont payé pour son erreur. Le chef viendra après : il faut réparer ce qui peut encore l’être et redonner aux autres les moyens d’avancer.",
                "axis": "A"
            },
            {
                "id": "2",
                "text": "S’il reste capable de tenir son rôle, d’assumer ce qu’il a fait et de restaurer la confiance, il peut rester. Sinon, quelqu’un d’autre doit prendre la relève.",
                "axis": "D"
            },
            {
                "id": "3",
                "text": "Avant de le juger, je veux comprendre sa décision. Ce qu’il savait, ce qu’il croyait savoir, ce qu’on ne lui a pas dit… et ce qu’il n’a peut-être pas voulu voir.",
                "axis": "C"
            },
            {
                "id": "4",
                "text": "Reconnaître son erreur ne suffit pas. Il doit réparer ce qu’il a réellement atteint — surtout ce qu’il n’avait pas le droit de sacrifier.",
                "axis": "P"
            }
        ]
    },
    {
        "id": "q03",
        "quote": "Trop avidement, trop profondément…",
        "attribution": "Saroumane, Le Seigneur des Anneaux : La Communauté de l’Anneau",
        "situation": [
            "Vous découvrez quelque chose de dangereux.",
            "Personne ne vous reprocherait de refermer la porte et de ne jamais y revenir.",
            "Que faites-vous ?"
        ],
        "answers": [
            {
                "id": "1",
                "text": "Je cherche d’abord pourquoi cette limite existe. Si quelque chose a été tenu à l’écart pour protéger ce qui l’entoure, ma curiosité ne me donne pas automatiquement le droit de briser cette frontière.",
                "axis": "P"
            },
            {
                "id": "2",
                "text": "Je veux savoir ce que c’est, ce que ça veut, ce qui le retient… et surtout ce qu’il serait dangereux de supposer à son sujet.",
                "axis": "C"
            },
            {
                "id": "3",
                "text": "Quelqu’un doit en avoir la garde. Des limites claires, une responsabilité claire, et quelqu’un qui répondra si elles sont franchies.",
                "axis": "D"
            },
            {
                "id": "4",
                "text": "Si je ne peux pas m’en débarrasser sans provoquer pire, alors je m’organise autour. Surveillance, règles, solutions de secours. Un danger qu’on ne peut pas éliminer doit au moins devenir gérable.",
                "axis": "A"
            }
        ]
    },
    {
        "id": "q04",
        "quote": "« La lettre tue, mais l’Esprit vivifie. »",
        "attribution": "Paul, Deuxième épître aux Corinthiens, 3:6",
        "title": "La lettre et l’esprit",
        "situation": [
            "Un membre de votre groupe enfreint volontairement une règle importante.",
            "Sa désobéissance sauve plusieurs vies.",
            "Que faites-vous ?"
        ],
        "answers": [
            {
                "id": "1",
                "text": "Je veux comprendre ce qui lui a permis de voir que, cette fois, obéir aurait été une erreur. Si on ne distingue pas le discernement de la simple désobéissance, on n’apprendra rien de ce qui vient de se passer.",
                "axis": "C"
            },
            {
                "id": "2",
                "text": "Je ne défends pas la règle pour elle-même. Je veux savoir ce qu’elle devait protéger. Si sa lettre a trahi son but, alors on garde le but et on change la règle.",
                "axis": "P"
            },
            {
                "id": "3",
                "text": "Il a peut-être eu raison de désobéir. Mais il doit venir défendre son choix devant le groupe. Avoir raison n’efface pas l’obligation de rendre des comptes.",
                "axis": "D"
            },
            {
                "id": "4",
                "text": "Alors je change la règle. Si elle oblige quelqu’un à la briser pour faire ce qui doit être fait, c’est qu’elle ne remplit plus son rôle.",
                "axis": "A"
            }
        ]
    },
    {
        "id": "q05",
        "quote": "Un tort réparé… mais le Livre reste plein de rancunes",
        "attribution": "Proverbe Nain de Karaz-a-Karak",
        "situation": [
            "Votre groupe hérite d’un conflit commencé bien avant votre naissance.",
            "Les responsables directs sont morts.",
            "Les conséquences, elles, existent toujours.",
            "Que faites-vous ?"
        ],
        "answers": [
            {
                "id": "1",
                "text": "On peut choisir d’avancer sans prétendre que rien ne s’est passé. Je veux que la mémoire demeure, et que ce qui peut encore être rendu, réparé ou restauré le soit réellement.",
                "axis": "P"
            },
            {
                "id": "2",
                "text": "Il faut qu’une autorité clairement identifiée prenne enfin la responsabilité de ce qui peut encore être corrigé. Une injustice dure aussi parce que chacun peut prétendre qu’elle relève de quelqu’un d’autre.",
                "axis": "D"
            },
            {
                "id": "3",
                "text": "Je cherche ce qui, aujourd’hui encore, continue à produire les conséquences de cette injustice. Tant que ce mécanisme existe, le passé n’est pas vraiment passé.",
                "axis": "A"
            },
            {
                "id": "4",
                "text": "Je veux reconstituer les faits jusque dans ce qui dérange notre propre récit. Si on ne comprend le passé qu’à travers la version qui nous arrange, on continuera à combattre une histoire simplifiée plutôt que ses conséquences réelles.",
                "axis": "C"
            }
        ]
    },
    {
        "id": "q06",
        "quote": "« En un seul jour et une nuit néfastes… »",
        "attribution": "Platon, Timée",
        "situation": [
            "Une partie de la ville se dégrade rapidement.",
            "Violence, pauvreté, pollution, abandon : tout semble s’y accumuler.",
            "Vous ne pouvez consacrer vos forces qu’à une seule approche.",
            "Que faites-vous ?"
        ],
        "answers": [
            {
                "id": "1",
                "text": "Je cherche ceux qui ont réellement le pouvoir de changer les choses — propriétaires, responsables, institutions, chefs locaux — et je les force à agir ou à céder la place.",
                "axis": "D"
            },
            {
                "id": "2",
                "text": "Je commence par écouter ceux qui voient cet endroit depuis des positions différentes : habitants, travailleurs, enfants, commerçants, ceux qui sont partis. Les contradictions entre leurs récits me diront peut-être où se cache le vrai problème.",
                "axis": "C"
            },
            {
                "id": "3",
                "text": "Je pars de ce qui tient encore debout : les gens qui s’entraident, les lieux qui fonctionnent, les ressources que personne ne remarque. Je renforce ça d’abord.",
                "axis": "A"
            },
            {
                "id": "4",
                "text": "Je protège ce qui empêche encore cet endroit de devenir une simple zone sur une carte : ses habitants, ses liens, ses lieux, tout ce que le reste de la ville semble déjà considérer comme jetable.",
                "axis": "P"
            }
        ]
    },
    {
        "id": "q07",
        "quote": "« Toute magie a un prix. »",
        "attribution": "Rumplestiltskin, Once Upon a Time",
        "situation": [
            "Un adversaire vous propose une information capable de sauver votre groupe.",
            "En échange, il réclame sa liberté.",
            "Vous savez qu’il recommencera probablement à agir contre vous.",
            "Que faites-vous ?"
        ],
        "answers": [
            {
                "id": "1",
                "text": "Avant d’accepter ou de refuser, je veux savoir ce qu’il espère nous faire faire avec cette information. Une vérité peut être exacte et pourtant nous pousser exactement là où il le souhaite.",
                "axis": "C"
            },
            {
                "id": "2",
                "text": "Si cet accord sauve réellement des vies maintenant, je l’accepte comme un compromis temporaire. Ensuite, je prépare immédiatement ce qui nous permettra de ne plus dépendre de lui.",
                "axis": "A"
            },
            {
                "id": "3",
                "text": "Je peux prendre un risque pour moi. Je refuse de prendre à la place des autres une décision qui les remet volontairement à la merci de quelqu’un qui leur a déjà nui.",
                "axis": "P"
            },
            {
                "id": "4",
                "text": "J’accepte seulement si les conditions sont claires : qui garantit l’accord, ce qu’il engage, et ce qu’il se passe s’il le rompt. Une décision aussi dangereuse ne peut pas reposer sur du flou.",
                "axis": "D"
            }
        ]
    },
    {
        "id": "q08",
        "quote": "« Oh, là, là ! Oh, là, là ! Je vais être en retard ! »",
        "attribution": "Le Lapin Blanc, Alice au pays des merveilles",
        "situation": [
            "Votre groupe est paralysé.",
            "Plusieurs solutions s’opposent, chacune avec de bons arguments.",
            "La discussion tourne en rond et, cette fois, vous n’avez plus le temps d’attendre que tout le monde soit d’accord.",
            "Que faites-vous ?"
        ],
        "answers": [
            {
                "id": "1",
                "text": "Je commence par identifier ce qu’on ne pourra pas réparer si on se trompe. Le reste peut attendre ou être corrigé plus tard. L’irréversible, non.",
                "axis": "P"
            },
            {
                "id": "2",
                "text": "Je demande à chacun ce qui pourrait réellement lui faire changer d’avis. Si la réponse est « rien », alors le problème n’est probablement plus la solution elle-même. Il faut comprendre ce qui nous bloque vraiment.",
                "axis": "C"
            },
            {
                "id": "3",
                "text": "On n’a plus le temps de tourner autour. Qui est prêt à trancher et à répondre du résultat ? Si personne ne l’est, je prendrai la décision — et j’en assumerai les conséquences.",
                "axis": "D"
            },
            {
                "id": "4",
                "text": "On n’a pas besoin de résoudre tous nos désaccords maintenant. Je cherche le plus petit choix sur lequel assez d’entre nous peuvent agir ensemble immédiatement. On avancera à partir de là.",
                "axis": "A"
            }
        ]
    },
    {
        "id": "q09",
        "quote": "« Le monde a changé. Je le sens dans l’eau, je le sens dans la terre, je le sens dans l’air. »",
        "attribution": "Galadriel, Le Seigneur des Anneaux : La Communauté de l’Anneau",
        "situation": [
            "Une tradition, une méthode ou une manière de faire a longtemps très bien fonctionné.",
            "Aujourd’hui, elle échoue de plus en plus souvent.",
            "Que faites-vous ?"
        ],
        "answers": [
            {
                "id": "1",
                "text": "Je garde ce qui fonctionne encore et je remplace le reste. Une méthode n’a pas à survivre simplement parce qu’elle a autrefois été efficace.",
                "axis": "A"
            },
            {
                "id": "2",
                "text": "Je cherche ce qu’elle était censée transmettre ou protéger. La forme peut changer ; ce qui compte, c’est de ne pas perdre avec elle ce qui lui donnait du sens.",
                "axis": "P"
            },
            {
                "id": "3",
                "text": "Ceux qui en ont aujourd’hui la responsabilité doivent avoir le courage de la changer s’ils ne peuvent plus la défendre par ses résultats. Hériter d’une autorité, c’est aussi hériter de l’obligation de la remettre en question.",
                "axis": "D"
            },
            {
                "id": "4",
                "text": "Je cherche le moment où elle a cessé de fonctionner. Qu’est-ce qui a changé : le monde, la pratique elle-même, ou notre manière de la comprendre ?",
                "axis": "C"
            }
        ]
    },
    {
        "id": "q10",
        "quote": "« Toute technologie suffisamment avancée est indiscernable de la magie. »",
        "attribution": "Arthur C. Clarke, troisième loi de Clarke",
        "situation": [
            "Une nouvelle technologie pourrait résoudre un problème qui vous coûte énormément depuis longtemps.",
            "Elle fonctionne.",
            "Mais vous la comprenez encore mal, et une erreur pourrait avoir des conséquences sérieuses.",
            "Que faites-vous ?"
        ],
        "answers": [
            {
                "id": "1",
                "text": "Je regarde ce qu’elle provoque en dehors du problème qu’elle est censée résoudre. Un outil peut parfaitement remplir sa mission et foutre le bordel partout autour sans que personne ne l’ait prévu.",
                "axis": "C"
            },
            {
                "id": "2",
                "text": "Je la confie à quelqu’un qui sait réellement ce qu’il fait. Il a une marge de décision claire, mais aussi la responsabilité de ce qui arrivera s’il se plante.",
                "axis": "D"
            },
            {
                "id": "3",
                "text": "Je veux surtout savoir si on pourra revenir en arrière. Tant qu’une erreur reste réparable, je peux accepter de prendre le risque. Ce qui m’inquiète, c’est le moment où son usage détruit définitivement l’ancienne solution.",
                "axis": "P"
            },
            {
                "id": "4",
                "text": "Je commence petit. On la teste là où un échec reste supportable, on regarde ce qu’elle fait réellement, et on ajuste avant de la déployer davantage.",
                "axis": "A"
            }
        ]
    },
    {
        "id": "q11",
        "quote": "« Hmm… le médaillon vibre. »",
        "attribution": "Geralt de Riv, The Witcher 3: Wild Hunt",
        "situation": [
            "Plusieurs membres de votre groupe commencent à ressentir la même chose : malaise, impression d’être observés, mauvais pressentiment.",
            "Pourtant, rien de visible ne semble avoir changé.",
            "Aucun danger évident.",
            "Aucune preuve.",
            "Que faites-vous ?"
        ],
        "answers": [
            {
                "id": "1",
                "text": "Je mets quelqu’un en charge de centraliser ce qu’on sait et de coordonner la réaction. Dans le doute, je préfère une réponse imparfaite mais organisée à dix initiatives contradictoires.",
                "axis": "D"
            },
            {
                "id": "2",
                "text": "Je cherche ce qui a changé autour d’eux, même quelque chose d’infime. Une sensation partagée peut être le premier signe d’un problème réel, bien avant qu’on puisse lui donner un nom.",
                "axis": "P"
            },
            {
                "id": "3",
                "text": "Je modifie d’abord ce qui peut l’être sans grand risque. Les trajets, les habitudes, la surveillance… Si le malaise diminue, on aura déjà appris quelque chose sans attendre de tout comprendre.",
                "axis": "A"
            },
            {
                "id": "4",
                "text": "Je leur demande de raconter précisément ce qu’ils ressentent, sans essayer tout de suite de faire coïncider leurs histoires. Les différences entre leurs expériences peuvent être plus révélatrices que leurs points communs.",
                "axis": "C"
            }
        ]
    },
    {
        "id": "q12",
        "quote": "« Qu’est-ce que ça t’a coûté ? — Tout. »",
        "attribution": "Gamora enfant & Thanos, Avengers: Infinity War",
        "situation": [
            "Vous pouvez remporter une victoire décisive.",
            "Mais pour gagner, vous devrez détruire quelque chose que vous cherchiez justement à protéger.",
            "Il n’existe peut-être pas d’autre occasion de vaincre.",
            "Que faites-vous ?"
        ],
        "answers": [
            {
                "id": "1",
                "text": "Si gagner exige de détruire ce qui donnait un sens au combat, alors ce n’est pas une victoire. Il y a des pertes qu’on peut accepter ; devenir soi-même l’auteur de celle qu’on voulait empêcher n’en fait pas partie.",
                "axis": "P"
            },
            {
                "id": "2",
                "text": "Je veux d’abord être certain qu’on nous présente réellement toutes les possibilités. Quand on me dit qu’il n’existe que deux choix, je commence par chercher qui a décidé qu’il n’y en avait que deux.",
                "axis": "C"
            },
            {
                "id": "3",
                "text": "Je change l’objectif. Si je peux sauver l’essentiel en renonçant à une partie de la victoire, je préfère un résultat incomplet mais durable à un triomphe qui nous laisse exsangues.",
                "axis": "A"
            },
            {
                "id": "4",
                "text": "S’il n’existe réellement aucune autre voie et que l’enjeu le justifie, je donne l’ordre. Mais je ne dirai pas ensuite que « nous n’avions pas le choix ». Si j’ai choisi, alors cette décision et son prix m’appartiennent.",
                "axis": "D"
            }
        ]
    },
    {
        "id": "q13",
        "quote": "« La force du Clan, c’est le Loup, et la force du Loup, c’est le Clan. »",
        "attribution": "Rudyard Kipling, Le Second Livre de la jungle",
        "situation": [
            "Un groupe venu d’ailleurs demande à rejoindre votre communauté.",
            "Ils apportent des compétences utiles, mais leurs coutumes et leur manière de faire sont très différentes des vôtres.",
            "Que faites-vous ?"
        ],
        "answers": [
            {
                "id": "1",
                "text": "Je leur donne une vraie place et de vraies responsabilités. La confiance viendra de ce qu’on réussira à faire ensemble, pas du fait qu’ils adoptent immédiatement nos habitudes.",
                "axis": "A"
            },
            {
                "id": "2",
                "text": "Je veux d’abord comprendre ce qu’ils quittent, ce qu’ils cherchent ici et ce qu’ils veulent préserver. On comprend mal quelqu’un si on commence seulement par demander ce qu’il peut nous apporter.",
                "axis": "C"
            },
            {
                "id": "3",
                "text": "Je ne leur demande pas de nous ressembler. Je leur demande ce qu’ils sont prêts à prendre en charge. Une place réelle dans le groupe doit venir avec une responsabilité réelle.",
                "axis": "D"
            },
            {
                "id": "4",
                "text": "Je peux accueillir ce qu’ils apportent sans demander à mon groupe de s’effacer pour leur faire une place. L’intégration doit permettre la coexistence, pas le remplacement de l’un par l’autre.",
                "axis": "P"
            }
        ]
    },
    {
        "id": "q14",
        "quote": "« Tu as changé. »",
        "attribution": "Padmé Amidala, Star Wars : Épisode III — La Revanche des Sith",
        "situation": [
            "Quelqu’un que vous connaissez très bien commence à agir d’une manière qui ne lui ressemble pas.",
            "Il s’isole, prend des décisions inhabituelles et devient difficile à comprendre.",
            "Rien de grave ne s’est encore produit.",
            "Que faites-vous ?"
        ],
        "answers": [
            {
                "id": "1",
                "text": "Je cherche d’abord ce qui a changé. Je l’écoute, je regarde ce qui s’est passé autour de lui et j’évite de décider trop vite que le problème vient forcément de lui.",
                "axis": "C"
            },
            {
                "id": "2",
                "text": "Je reste près de lui et je cherche ce qui pourrait concrètement l’aider maintenant. S’il traverse quelque chose, je préfère lui donner des appuis plutôt que d’attendre que la situation empire.",
                "axis": "A"
            },
            {
                "id": "3",
                "text": "Je lui parle franchement. Je peux lui laisser de l’espace, mais pas faire semblant de ne rien voir : si ses choix commencent à mettre d’autres personnes en danger, il faudra poser une limite.",
                "axis": "D"
            },
            {
                "id": "4",
                "text": "Je m’assure surtout qu’il ne coupe pas tous les liens qui comptaient pour lui. Même s’il change, je ne veux pas qu’une mauvaise période détruise des relations ou des choses qu’il regrettera ensuite d’avoir perdues.",
                "axis": "P"
            }
        ]
    },
    {
        "id": "q15",
        "quote": "« Nous sommes ce qu’ils dépassent. C’est là le vrai fardeau de tous les maîtres. »",
        "attribution": "Yoda, Star Wars : Épisode VIII — Les Derniers Jedi",
        "situation": [
            "Une génération plus jeune rejette plusieurs habitudes que votre groupe considère comme normales depuis longtemps.",
            "Ils ne cherchent pas à détruire ce que vous avez construit.",
            "Ils pensent simplement pouvoir faire mieux.",
            "Que faites-vous ?"
        ],
        "answers": [
            {
                "id": "1",
                "text": "Je leur donne une vraie part de pouvoir sur ce qu’ils veulent changer. Une idée ne vaut pas grand-chose tant que ceux qui la défendent n’ont pas à vivre avec ses conséquences.",
                "axis": "D"
            },
            {
                "id": "2",
                "text": "Ils ont le droit de transformer ce qu’ils reçoivent. Mais je veux qu’ils comprennent d’abord ce qu’ils s’apprêtent à abandonner. On ne transmet pas l’obligation de nous imiter, seulement la possibilité de savoir d’où l’on vient.",
                "axis": "P"
            },
            {
                "id": "3",
                "text": "Je leur laisse de l’espace pour essayer. Avec de vraies responsabilités, et la possibilité de revenir sur ce qui échoue. Si leur méthode marche mieux, tant mieux : on aura appris quelque chose.",
                "axis": "A"
            },
            {
                "id": "4",
                "text": "Je leur demande quelles évidences de notre génération leur paraissent absurdes. Même s’ils se trompent sur la solution, ils voient peut-être quelque chose que nous avons cessé de remarquer.",
                "axis": "C"
            }
        ]
    },
    {
        "id": "q16",
        "quote": "« Le véritable général sait quand un tel prix mérite d’être payé… et quand l’addition du boucher est pure folie. »",
        "attribution": "Roboute Guilliman, On War",
        "note": "Traduction française de la citation anglaise.",
        "situation": [
            "Votre groupe perd du terrain depuis longtemps.",
            "Les ressources diminuent.",
            "Vos adversaires apprennent de vos méthodes.",
            "Certaines de vos certitudes ne tiennent plus.",
            "Vous savez que vous ne pourrez pas tout maintenir.",
            "Que faites-vous ?"
        ],
        "answers": [
            {
                "id": "1",
                "text": "Je veux d’abord comprendre ce que nous sommes réellement en train de perdre. Dans une crise, tout paraît urgent. Mais tout n’est pas essentiel.",
                "axis": "C"
            },
            {
                "id": "2",
                "text": "Il faut choisir ce que nous allons défendre, désigner qui en répondra et accepter que cette décision nous définisse. Refuser de choisir, à ce stade, c’est encore choisir — simplement sans vouloir porter le poids de la décision.",
                "axis": "D"
            },
            {
                "id": "3",
                "text": "Notre manière actuelle d’exister peut disparaître. Ce que je refuse, c’est que ce qu’elle portait disparaisse avec elle. Il faut décider ce qui mérite de nous survivre.",
                "axis": "P"
            },
            {
                "id": "4",
                "text": "J’arrête d’essayer de maintenir chaque structure simplement parce qu’elle existe. Je concentre ce qu’il nous reste sur ce qui fonctionne encore et je reconstruis autour.",
                "axis": "A"
            }
        ]
    }
] as const satisfies readonly UmbraQuestion[]
