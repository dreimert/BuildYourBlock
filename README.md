# Tutoriel Blockchain : de zéro vers ...

## Objectifs

* Comprendre la notion de blockchain.
* Comprendre la notion de preuve de travail.
* Comprendre la notion de difficulté.

## Je valide !

Maintenant que l'on peut vérifier si un block est valide, vérifions que notre Blockchain l'est aussi. Faisons-le ! J'ai rajouté un nouveau fichier `Blockchain.js`. Dans `Blockchain.js`, écrivez la fonction `isValid`. Pour chaque block, elle doit faire deux choses : vérifier que le block est valide et que l'identifiant du block précédent correspond bien.

```Bash
node etape-2-valide.js
```

Bon, vous êtes en mesure de vérifier que la chaîne est valide, bravo !

## Je ne suis pas seul

Maintenant, quand vous utilisez une Blockchain, vous n'êtes pas tout seul. Vous êtes dans une application distribuée avec tous les problèmes qui peuvent être dûs au réseau ou à plusieurs personnes qui créent un block en même temps. Il faut un algorithme pour savoir quels blocks sont ajoutés dans la chaîne. Avez-vous une idée de comment faire ?

La solution s'appelle la preuve de travail. Cette technique consiste à faire dépenser à la personne qui veut ajouter un block beaucoup de puissance de calcul et donc du temps et de l'argent pour avoir une chance aléatoire d'ajouter le block. Le but dans le cas de Bitcoin est d'ajouter un block toutes les 10 min. Cela crée un ordonnancement sur l'ajout des blocks sans tiers de confiance.

## Minons du hash

Comment faire pour qu'un block prenne du temps à ajouter à la chaine ?

Indice : ça a un rapport avec la fonction de hachage.

Les fonctions de hachage comme SHA ont une propriété très intéressante, on ne peut pas prédire l'empreinte qu'une donnée va produire avant d'avoir exécuté la fonction. L'astuce consiste donc à mettre une contrainte sur la forme que doit avoir l'empreinte pour être un identifiant valide de block. Par exemple, on peut contraindre l'empreinte à avoir 5 zéros au début.

Maintenant, il faut trouver une empreinte qui commence par 5 zéros pour que ce soit un identifiant valide. Oui mais l'empreinte de mes blocks n'a pas 5 zéros, comment je fais pour produire une nouvelle empreinte ?

Indice : c'est une question de bruit.

On rajoute du bruit tout simplement ! Pour cela, on ajoute au block un élément appelé `nonce` initialisé à 0 et incrémenté de 1 après chaque essai invalide. Cette opération de recherche d'un hash valide s'appelle le minage.

Dans la class Block, ajoutez :
* Un propriété difficulty qui est le nombre de zéro attendu en début d'empreinte. Il sera fournis au constructeur.
* Une propriété `nonce` représentant le bruit pour atteindre la difficulté.
* Une fonction `miner` qui modifie le nonce et donc l'id pour obtenir le nombre de zéros qu'il faut en début d'empreinte.

N'oubliez pas de modifier la fonction `getHash` pour qu'elle prenne en compte le `nonce` et la `difficulty`. Et je suis sympa, je vous donne le lien vers deux fonctions utiles en JS :

* repeat : https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/String/repeat
* startsWith : https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/String/startsWith

Pour voir ce qui est attendu, regardez et exécutez le fichier `etape-2-miner.js`.

Ça met un peu de temps ? Parfait ! Sinon augmentez la difficulté.

###### Modifier la fonction de vérification `isValid` de `Block` pour qu'elle vérifie, en plus, que la difficulté est bien respectée.

Maintenant, votre Blockchain est beaucoup plus difficile à attaquer !

## Trouvons le bon rythme

Une difficulté de 5, c'est bien mais ça semble un peu arbitraire comme valeur. Pour notre blockchain, j'aimerais qu'il y ait un block toutes les 10 secondes qui soit ajouté à la blockchain. Autre contrainte, si tous les participants ont la même puissance de calcul, que le participant soit tiré aléatoirement mais c'est notre algorithme de hash qui nous garantie ça.

J'ai ajouté un fichier `etape-2-rythme.js` qui contient un code permettant de simuler une blockchain avec 5 participants ayant la même puissance de calcul. Essayez de comprendre se que fait ce code. Vérifiez que votre code fonctionne correctement en exécutant le fichier : `node etape-2-rythme.js`.

###### Observez la simulation. Que pouvez-vous dire sur le temps de calcul d'un block ?

###### Essayez de changer la difficulté, que se passe-t-il sur le temps de calcul ?

###### Sur votre machine, quelle est la bonne valeur de la difficulté ?

Maintenant, voyons ce qu'il se passe si tous les participants n'ont pas la même puissance de calcul.

Modifiez `etape-2-rythme.js` pour diminuer la difficulté et augmenter le nombre de blocks recherchés à 1000.

###### Que pouvez-vous dire sur la répartition des blocks ?

Modifiez encore `etape-2-rythme.js` pour mettre des puissances de calcul différentes aux participants.

###### Est-ce qu'il y a un changement ?
###### Y-a-t'il corrélation entre puissance de calcul et nombre de blocks ?

## Suite

Mettre du texte, c'est bien. Échanger de la valeur, c'est mieux : `git checkout etape-3`.
