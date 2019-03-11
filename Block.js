const { BlockTool } = require('./tools');

// Vous n'avez pas à comprendre BlockTool.
// Cette class vient en support du sujet.
// Si vous avez besoin de débugguer,
// vous pouvez commenter le `extends BlockTool`.
module.exports = class Block extends BlockTool {

  // Complétez le constructeur
  constructor(index, data) {
    super() // Obligatoire car on hérite de BlockTool
    // Le mot clé `this` permet d'accèder aux propriétés de l'object depuis ses méthodes.
    this.index = index;
    //...
  }

  // Retourne l'identifiant du block en le calculant depuis les données
  getHash() {}

  // Retourne un boolean qui indique si le block est valide
  isValid(
    DIFFICULTY // Utile à l'étape 2
  ) {
    return true;
  }

  // Utile à l'étape 2
  miner(DIFFICULTY) {}
}
