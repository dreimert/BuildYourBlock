const NodeRSA = require('node-rsa');

module.exports = class RSATools {

  // Retourne la clé publique associée à la clé privée
  static privateToPublic(privateKeyString) {
    const rsa = new NodeRSA(privateKeyString);

    return rsa.exportKey("public");
  }

  // Retourne la signature du message par la clé privée
  // https://github.com/rzcoder/node-rsa#signingverifying
  static sign(msg, privateKeyString) {
    const rsa = new NodeRSA(privateKeyString);

    return rsa.sign(msg);
  }

  // Vérifie la signature du message par la clé publique
  // Retourne un booléen à true si la signature est bonne
  // https://github.com/rzcoder/node-rsa#signingverifying
  static verify(msg, signature, publicKeyString) {
    const rsa = new NodeRSA(publicKeyString);

    return rsa.verify(msg, signature);
  }
}
