# Tutoriel blockchain : de zéro vers ...

Le but de ce tutoriel est de coder une blockchain depuis zéro pour en comprendre les mécanismes. Cette blockchain sera très loin d'une blockchain de production mais permettra d'illustrer les différentes mécaniques la constituant. Les notions et les problématiques seront introduites au fur et à mesure de la progression. Certaines seront *un peu* simplifiées.

Le code se fait en Javascript pour permettre au plus grand nombre de réaliser ce tutoriel et parce que c'est le langage de programmation que j'utilise quotidiennement :D. L'environnement utilisé pour l'écriture de ce sujet est Node.js (https://nodejs.org/fr/) en version 11 avec npm pour gérer les dépendances mais il doit fonctionner à partir de la version 8.

Pour écrire ce tutoriel, je me suis inspiré de la suite d'article de Kass sur Medium qui réalise une blockchain en Java : https://medium.com/programmers-blockchain/create-simple-blockchain-java-tutorial-from-scratch-6eeed3cb03fa.

## Prérequis

Je pars du principe que vous savez coder en Javascipt et utiliser git. Si ce n'est pas le cas, je vous invite pour le prochain TD à lire :

* Javascript : https://fr.eloquentjavascript.net/ (première edition en français, anglais, allemand et polonais)
* Git : http://rogerdudler.github.io/git-guide/index.fr.html

## Installation de node

https://github.com/dreimert/dia-td1#installation-de-node

## Cloner ce dépôt

```Bash
git clone https://github.com/dreimert/BuildYourBlock.git
cd BuildYourBlock
```

## Objectif

Le buts de cette étape sont :

* Comprendre la notion de `Block`.
* Comprendre la notion de fonction de hachage.
* Comprendre comment l'utilisation de fonction de hachage permet de détecter une modification de la chaîne.

## Au commencement fut le block

Dans une blockchain, il y a block. Un block est un ensemble d'informations et quand les blocks sont mis bout-à-bout, ils forment une chaîne : la blockchain !

Commençons avec une structure de block assez simple :

* Un index : permet d'identifier le block et de connaitre à position dans la chaîne.
* Des données : pour le moment, une simple chaîne de caractères.

J'ai écrit le fichier `etape-1-a.js` suivant :

```Javascript
const Block = require("./Block");

const first  = new Block(0, "First !");
const second = new Block(1, "Second :)");
const third  = new Block(2, "Vous commencez à voir le principe ?");

console.log([first, second, third]);
```

J'ai aussi commencé à écrire le fichier `Block.js` que vous devez compléter.

Quand c'est fini, dans un terminal placé dans ce dossier : `node ./etape-1-a.js`. Vous devriez voir quelque chose comme cela :

```
[ Block<
       index: 0
       id: undefined
       previous: undefined
       data: 'First !' >,
  Block<
       index: 1
       id: undefined
       previous: undefined
       data: 'Second :)' >,
  Block<
       index: 2
       id: undefined
       previous: undefined
       data: 'Vous commencez à voir le principe ?' > ]
```

C'est bon ? Magnifique ! Vous avez une première blockchain ! Bon, par contre, elle n'est  pas fonctionnelle... Quand un block est ajouté dans la Blockchain, il n'est plus modifiable. Ici, rien ne vous empêche de modifier ce que vous voulez et vous n'avez aucun moyen de le détecter.

###### Par exemple, complétez le code de `etape-1-a.js` en modifiant les données du troisième block.

## Prenons un peu de hash

Nous voulons vérifier que les blocks n'ont pas été modifiés. Pour vérifier l'intégrité des données, on utilise les fonctions de hachage.

Une fonction de hachage est une fonction qui prend en entrée un ensemble de données et retourne une empreinte, aussi appelée hash. L'empreinte respecte deux principes : Elle est unique pour un ensemble de données d'entrée, et une empreinte donnée ne permet pas de remonter à l'ensemble initial. On parle de non-collision et de non calculabilité de la pré-image. Cette empreinte est de taille fixe quelque-soit l'entrée. Une fonction couramment utilisé est SHA. Voici quelques exemples d'empreinte :

```Bash
> echo "Blockchain" | shasum
# efcf8baf5959ad1ebc7f4950425ef1c2eae9cbd9  -

> echo "Block" | shasum
# d1a6b1157e37bdaad78bec4c3240f0d6c576ad21  -

> echo "Vous commencez à voir le principe ?" | shasum
# 25abec7ced7642b886c1bffbc710cc3439f23ab7  -
```

Une propriété intéressante est qu'une petite modification dans l'entrée change totalement l'empreinte :

```Bash
> echo "Blockchain" | shasum
# efcf8baf5959ad1ebc7f4950425ef1c2eae9cbd9  -

> echo "blockchain" | shasum
# ea5f179324c233b002fa8ac4201fa216001515e5  -
```

Si je vous parle de tout ça, c'est qu'on va l'utiliser mais comment cela résout notre problème ?

Une idée ?

Cool !

On va calculer l'empreinte du block avec cette fonction et on va utiliser cette empreinte comme identifiant (`id`) du block. Si on modifie le block, son empreinte change donc son `id` change ! Mais cette `id` est utilisé dans le block suivant, ce qui modifie son empreinte. Et ainsi de suite jusqu'au dernier block de la chaîne. On va tester plus loin.

Modifiez le fichier `Block.js` pour ajouter au block deux propriétés :

* `id` : permet d'identifier le block. Il sera généré aléatoirement.
* `previous` : l'identifiant du block qui précède dans la chaîne. Cela nous permet de remonter la chaîne jusqu'à son origine.

On peut voir nos blocks comme ceci :

     Block 1                   Block 2                         Block 3
    +-------------------+     +-------------------------+     +-------------------------+
    |                   |     |                         |     |                         |
    | index: 0          |     | index: 1                |     | index: 2                |
    | id: <example: 42> +<-+  | id: <example: 26>       +<-+  | id: <example: 59>       |
    | previous: null,   |  +--+ previous: <exemple: 42> |  +--+ previous: <exemple: 26> |
    | data: "First !"   |     | data: "Second :)"       |     | data: "Blabla..."       |
    |                   |     |                         |     |                         |
    +-------------------+     +-------------------------+     +-------------------------+

La fonction suivante prend en entrée une chaîne de caractère et retourne l'empreinte correspondante.

```Javascript
const crypto = require('crypto');

class Block {
  getHash() {
    const unMotDoux = "Votre mot doux";
    return crypto.createHash('sha256').update(unMotDoux, 'utf8').digest('hex');
  }
}
```

Regardez le fichier `etape-1-b.js` et modifiez la `class Block` pour lui ajouter la fonction `getHash()` qui calcule l'empreinte correspondant au block. Pour calculer cette empreinte, vous devez utiliser l'identifiant du block précédent et les données contenues dans le block.

Exemple de concaténation :

```Javascript
const toHash = `${index}${previous}${data}`;
```

Vous obtenez exactement ça pour `node etape-1-b.js` :

```
[ Block<
       index: 0
       id: '9054f1b086ce32ea53a16925cbdaec4a6c49b3ed272ae4523823182cb495631b'
       previous: null
       data: 'First !' >,
  Block<
       index: 1
       id: 'a5b9c4f6b5fb31f45b985fee3c5cc7dd0057c307a55add3e3d8a87baf04410c7'
       previous: '9054f1b086ce32ea53a16925cbdaec4a6c49b3ed272ae4523823182cb495631b'
       data: 'Second :)' >,
  Block<
       index: 2
       id: 'de3c20962e84f44919bf010747aa2b042e8684523cb710c4b8048eb445e8742d'
       previous: 'a5b9c4f6b5fb31f45b985fee3c5cc7dd0057c307a55add3e3d8a87baf04410c7'
       data: 'Vous commencez à voir le principe ?' > ]
```

Maintenant, essayez de modifier le premier élément de la chaîne.

###### Comparez avec l'exécution précédente. Qu'est-ce qu'il se passe ?

## Passer entre les mailles du filet

Modifiez la fonction `isValid()` pour qu'elle vérifie que l'id du block correspond à son contenu.

Exécutez `node etape-1-c.js` pour vérifier que tout se passe bien.

###### Que ce passe t'il dans le cas de third ?

## Suite

Vous avez survécu ? Cool ! Passons à l'étape suivante.

Aller à l'étape 2 : `git checkout etape-2`.

Pour continuer à lire le sujet soit vous lisez le fichier `README.md` sur votre machine, soit sur GitHub, au-dessus de la liste des fichiers, vous pouvez cliquer sur `Branch: master` et sélectionner `etape-2`.
