# Tutoriel Blockchain : de zéro vers ...

On est en mesure de chaîner les blocks et de vérifier que la chaîne n'a pas été modifiée.

On aimerait maintenant pouvoir échanger de la valeur via cette Blockchain. Pouvoir faire un chèque de la forme : Moi, Alice transfère 10€ à Bob. Sous cette forme, il y a deux problèmes : Comment s'assurer que c'est bien Alice qui a signé le chèque ? Comment s'assurer que Alice a bien l'argent ?

Pour la première question, il y a une solution "simple" : un couple de clés publique et privée. Pour la seconde, on va créer notre propre monnaie.

Explications !

## Objectifs

* Comprendre l'identité dans un système distribué.
* Comprendre la notion de transaction.

## Une histoire de couple

La cryptographie met à notre disposition un super outil : RSA. Pour les détails : https://fr.wikipedia.org/wiki/Chiffrement_RSA.

En très gros, vous produisez un couple clé publique/clé privée.

Dans notre cas, nous utilisons RSA pour signer des parties de transactions avec une clé privée et vérifier ces signatures.

La clé publique représente l'identifiant de votre compte. On suppose qu'elle est unique.

## Mise en oeuvre

On utilise le module nodejs node-rsa pour manipuler RSA.

    npm install node-rsa

Vous pouvez maintenant utiliser cette bibliothèque pour :
 - Créer une clé privée,
 - Signer un texte quelconque avec
 - Vérifier avec la clé publique que la signature est valide

```Javascript
const NodeRSA = require('node-rsa');

// Signature du message

const rsa = new NodeRSA({b:2048});
// rsa est un objet qui dans ce cas, contient une clé privée générée aléatoirement. b correspond à la taille de la clé

const msg = "Je transfère 10€ à Bob"
const signature = rsa.sign(msg)
console.log("Signature :", signature.toString('base64')); // Signature : fqZdnTynsPbUO...

const rsaPub = rsa.exportKey("public"); // rsaPub est une chaîne qui peut être diffusée publiquement. Comme j'ai la clé publique, je peux produire la clé privée.
console.log("Clé publique : ", rsaPub)
```

```Javascript
// Vérification du message

// Si j'ai une clé publique ou privé, je peux directement la passer au constructeur de nodeRSA
const rsaVerif = new NodeRSA(rsaPub); // La chaîne de la clé publique

console.log("Vérifier :", rsaVerif.verify(msg, signature)); // Vérifier : true. On vérifie que la signature n'a pu être faite que par rsa et la clé privée correspondante.  

console.log("Vérifier :", rsa.verify(msg, signature)); // Si vous avez la clé privé, vous pouvez aussi vérifier la signature.
```

Notez que rsa, est utilisé à la fois pour générer la clé privée et/ou la clé publique en fonction des paramètres connus.
Pour en savoir plus sur comment l'utiliser : https://github.com/rzcoder/node-rsa.

La clé publique représente ce qu'on appelle votre adresse, votre wallet et peut être vu comme un RIB. Pour le moment, disons qu'un wallet est accessible par sa clé publique et si vous en êtes propriétaire, la clé privée permet de dépenser le solde.

Regardez `etape-3-rsa.js` et vous n'avez plus qu'à compléter le fichier `RSATools.js` en utilisant l'exemple au-dessus. Mettez un chrono, si dans 15 min ce n'est pas fini, appelez moi. Ce n'est pas l'objectif de vous faire coder ça.

    node etape-3-rsa.js

## Build Your Block Coin

On a maintenant une solution pour signer et vérifier, il faut maintenant de l'argent à transférer. Allons voir les différents problèmes que l'on veut résoudre, proposer une solution et voir les problèmes de cette solution. On recommence jusqu'à converger vers une solution satisfaisante.

Créons une nouvelle unité, le Build Your Block coin ou BYB. Disons qu'un BYB vaut un centime. Dans ce contexte, que devient la phrase : Moi, Alice transfère 10€ à Bob ?

[![musique de questions](https://img.youtube.com/vi/QrPCPoOAO4E/0.jpg)](https://www.youtube.com/watch?v=QrPCPoOAO4E)

C'est une transaction de la forme :

* source : clé publique de Alice
* destination : clé publique de Bob
* valeur : 1000 BYB

Et pour signer le chèque :

* signature : signé avec la clé privée de Alice de source + destination + valeur

On peut le représenter comme cela :

     Transaction 1
    +-------------------------------------------------------+
    |                                                       |
    | source: <Alice public key>                            |
    | destination: <Bob public key>                         |
    | value: 1000                                           |
    |                                                       |
    +-------------------------------------------------------+
    |                                                       |
    | signature: <Alice.sign(source + destination + value)> |
    |                                                       |
    +-------------------------------------------------------+

Facile ! Oui mais non.

Mais en fait, on n'a toujours pas résolu la question de s'assurer que la source a l'argent. Vous ne pouvez pas non plus distinguer deux envois de 1000 BYB. Qu'est-ce qui empêche Bob d'ajouter indéfiniment votre transaction à la Blockchain ?

## Mon précieux !

Comment rendre une transaction unique ?

Une idée ?

On veut que quelque-chose soit unique ? On a déjà eu ce problème, non ? Quelle solution a-t-on utilisée déjà ?

Vous avez trouvé ?

Et si on mettait à nos transactions un id calculé à partir du contenu de celle-ci ? C'est cool ça.

     Transaction 2
    +--------------------------------------------------+
    |                                                  |
    | id: <hash(source + destination + value)>         |
    | source: <Alice public key>                       |
    | destination: <Bob public key>                    |
    | value: 1000                                      |
    |                                                  |
    +--------------------------------------------------+
    |                                                  |
    | signature: <Alice.sign(id)>                      |
    |                                                  |
    +--------------------------------------------------+


Je vois déjà plein de choses qu'il va falloir vérifier. Il va falloir vérifier que la transaction est unique dans la blockchain, si elle est dans la blockchain, je ne peux pas l'ajouter au block courant. Mais pour ça, il faut avoir toute la blockchain et la parcourir à la recherche de transaction identique. Couteux mais faisable.

Autre chose, si je veux faire deux transactions de 1000 BYB à Bob, je ne peux pas car leur signature sera la même ! Je dois rajouter une autre information comme la date et/ou un nonce.

Une transaction aurait au moins : une source, un destinataire, un montant, un nonce ou date et une signature.

     Transaction 2
    +--------------------------------------------------+
    |                                                  |
    | id: <hash(source + destination + value + nonce)> |
    | source: <Alice public key>                       |
    | destination: <Bob public key>                    |
    | value: 1000                                      |
    | nonce: <exemple: 21>                             |
    |                                                  |
    +--------------------------------------------------+
    |                                                  |
    | signature: <Alice.sign(id)>                      |
    |                                                  |
    +--------------------------------------------------+

Pour que cette solution fonctionne, il faut que je maintienne le solde de tous les comptes des utilisateurs.

## Ça coule de source

Maintenir l'état des comptes de tout le monde ne me fait pas envie. En plus, j'aimerait pouvoir faire plusieurs choses :

* Ne pas devoir stocker l'intégralité de la blockchain pour valider une transaction.
* Pouvoir remonter à la source de l'argent.
* Pouvoir mettre des conditions sur l'utilisation de l'argent.

Pour la dernière, on verra ça plus tard. Pour les deux premières, c'est assez similaire aux blocks : on va chainer les transactions !

Une transaction prendra en entrée une ou plusieurs autres transactions que j'ai reçu et aura une ou plusieurs sorties.

     Transaction
    +-----------------------------+
    |                             |
    | id: <sha(inputs + outputs)> |
    | inputs: []                  |
    | outputs: []                 |
    |                             |
    +-----------------------------+

Une sortie est un `Output`. Un `Output` aura un montant, un destinataire et un hash permettant de vérifier leur contenu.

     Output
     +-----------------------------------------+
     |                                         |
     | montant: <exemple: 1000>                |
     | destinataire: <public key destinataire> |
     | hash: <hash(montant + destinataire)>    |
     |                                         |
     +-----------------------------------------+

Une sortie est **dépensée** quand une entrée la référence. La liste des sorties non dépensées pointant vers votre clé publique représente le solde de votre compte. On ne peut pas dépenser partiellement une sortie.

Une entrée est un `Input`. Un `Input` représente la sortie d'une transaction précédente, elle contient une référence à la transaction précédente et l'index de la sortie que l'on veut utiliser. Elle contient aussi la signature du destinataire de la sortie référencée. Cette signature prouve que l'utilisateur a le droit d'utiliser la sortie.

     Input
    +-----------------------------+
    |                             |
    | tx: <ref une transaction>   |
    | index: <index de la sortie> |
    | hash: <hash(tx.id + index)> |
    | signature: <sign(hash)>     | <---- Signature qui sert de preuve de l'identité d'Alice
    |                             |
    +-----------------------------+

Les sorties doivent être entièrement utilisés mais je ne veux pas qu'un utilisateur puisse créer ou détruire de l'argent. Il faut s'assurer que la somme des entrées et égale à la somme des sorties. Ma transaction doit être à somme nulle.

Dans l'exemple suivant, `Transaction 0` est une transaction sans entée. On peut faire le parallèle avec le block generis qui n'avais pas de `previous`. La `Transaction 1` utilise la sortie de `Transaction 0` comme entrée et produit deux sorties. La `Transaction 1` est écrite et signé par Alice.

     Transaction 0                                   Transaction 1
    +----------------------------------------+      +-------------------------------------------+
    |                                        |      |                                           |
    | id: < Exemple: 1654823783 > <-------------+   | id: <sha(inputs + outputs)>               |
    | inputs: []                             |  |   | inputs: [                                 |
    | outputs:  ]                            |  |   |                                           |
    |                                        |  |   |   Input                                   |
    |   Output                               |  |   |  +--------------------------------------+ |
    |  +-----------------------------------+ |  |   |  |                                      | |
    |  |                                   | |  +------+ tx: < Exemple: 1654823783 >          | |
    |  | montant: 5000                     +<----------+ index: 0                             | |
    |  | destinataire: <public key Alice > | |      |  | signature: <Alice.sign(hash)>        | |
    |  |     ^                             | |      |  |                +                     | |
    |  +-----------------------------------+ |      |  +--------------------------------------+ |
    |        |                               |      |                   |                       |
    | ]      +----------------------------------------------------------+                       |
    |                                        |      | ]                                         |
    +----------------------------------------+      |                                           |
                                                    | outputs: [                                |
                                                    |                                           |
                                                    |    Output                                 |
                                                    |   +-----------------------------------+   |
                                                    |   |                                   |   |
                                                    |   | montant: 1000                     |   |
                                                    |   | destinataire: <public key Bob >   |   |
                                                    |   |                                   |   |
                                                    |   +-----------------------------------+   |
                                                    |                                           |
                                                    |    Output                                 |
                                                    |   +-----------------------------------+   |
                                                    |   |                                   |   |
                                                    |   | montant: 4000                     |   |
                                                    |   | destinataire: <public key Alice > |   |
                                                    |   |     ^                             |   |
                                                    |   +-----+-----------------------------+   |
                                                    |                                           |
                                                    | ]                                         |
                                                    |                                           |
                                                    +-------------------------------------------+

###### Que vaut la somme des entrées moins la somme des sorties de `Transaction 1` ?

Implémentons ! Regardez le fichier `etape-3-transaction.js` et complétez `Transaction.js`.

###### Combien de BYB Alice a avant le transfère à Bob ?
###### Combien de BYB ont Alice et Bob après le transfère ?
###### Pourquoi ne pas se limiter à une entrée et une sortie ?
###### Pourquoi cette solution permet de résoudre les deux premiers points ?

## Mettre des transactions en block

On sait produire des transactions, maintenant, pour les sauvegarder, il faut les mettre dans la blockchain.

Je vous laisse faire ! Modifiez la classe `Block` pour que data soit maintenant une liste de `Transaction`s.

## Fait tourner la planche à billets

###### Comment peut-on créer de l'argent ?

La solution que nous avons utilisé implicitement jusqu'ici est de créer tout l'argent au premier block.

La solution de Bitcoin est de créer de la monnaie à chaque block. Le première transaction de chaque block est une transaction sans Input mais avec une sortie.

Implémentez cette mécanique pour que chaque nouveau block crée 50 BYB.

## Suite

Vos mains saignent devant tant de code mais ça fonctionne ? Cool ! <Rire sadique> :D

Je n'ai pas encore écrit la suite. Vous avez fini ? Alors `git checkout etape-4` et vous écrivez un tuto pour codez un client pair à pair ou bien pour modifier le code pour que les transactions acceptent un script qui permet des conditions comme *attendre 100 blocks avant de dépenser* ou *Il faut la signature de deux personnes pour la dépenser*.

## Questions cultures

###### Qu'est-ce qu'un arbre de Merkle ?
