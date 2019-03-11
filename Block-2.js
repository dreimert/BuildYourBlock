const crypto = require('crypto');

const { BlockTool } = require('./tools');

// Vous n'avez pas à comprendre BlockTool.
// Cette class vient en support du sujet.
// Si vous avez besoin de débugguer,
// vous pouvez commenter le `extends BlockTool`.
module.exports = class Block extends BlockTool {

  // Complétez le constructeur
  constructor(index, previous, difficulty, data) {
    super() // Obligatoire car on hérite de BlockTool
    // Le mot clé `this` permet d'accèder aux propriétés de l'object depuis ses méthodes.
    this.index = index;
    this.previous = previous;
    this.data = data;
    this.difficulty = difficulty;
    this.nonce = 0;
    this.id = this.getHash();
  }

  // Retourne l'identifiant du block en le calculant depuis les données
  getHash() {
    return crypto.createHash('sha256').update(`${this.index}${this.previous}${this.data}${this.difficulty}${this.nonce}`, 'utf8').digest('hex');
  }

  // Retourne un boolean qui indique si le block est valide
  isValid() {
    return this.getHash() === this.id && this.id.startsWith('0'.repeat(this.difficulty));
  }

  miner() {
    const target = '0'.repeat(this.difficulty);
    while (!this.id.startsWith(target)) {
      this.nonce++;
      this.id = this.getHash();
    }
  }
}
