const crypto = require('crypto');
const { BlockchainTool } = require('./tools');

module.exports = class Blockchain extends BlockchainTool {
  constructor() {
    super()
    this.chain = [];
  }

  add(block) {
    this.chain.push(block);
  }

  last() {
    if (this.chain.length > 0) {
      return this.chain[this.chain.length - 1];
    } else {
      throw new Error("La blockchain est vide");
    }
  }

  // Retourne un boolean qui indique si la blockchain est valide
  isValid() {
    return this.chain.reduce(function(isValid, block, index, chain) {
      if (!isValid) {
        return false;
      } else if (!block.isValid()) {
        return false;
      } else if (block.index === 0 && block.previous !== null) {
        return false;
      } else if (block.index !== 0 && block.previous !== chain[index - 1].id) {
        return false;
      } else {
        return true;
      }
    }, true);
  }
}
