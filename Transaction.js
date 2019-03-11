const crypto = require('crypto');

const RSATools = require('./RSATools');

// Représente une transaction ou un chèque.
// Souvent abrégé en tx quand passé en variable.
class Transaction {

  // @params inputs : un tableau de Input
  // @params outputs : un tableau de Output
  constructor(
    inputs,
    outputs
  ) {
    // ...
    this.id = ''; // ...
  }

  // Retourne le hash du Tx : hash des inputs + hash des outputs
  getHash() {
    const hashInputs = this.inputs.map((input) => {return input.hash;}).join('');
    // ...
  }
}

class Input {
  // @params tx : transaction dans laquelle est le Output que j'utilise
  // @params index : index du Output dans le outputs de la transaction
  // @params signature : signature du destinataire du Output
  constructor(tx, index, signature = undefined) {
    // ...
  }

  // Calcule la signature : tx.id + index
  sign(privateKeyString) {
    this.signature = "/* ... */";
  }

  // Retourne le hash du Input : tx.id + index
  getHash() {
    // ...
  }

  // Retourne le montant de l'output utilisé
  montant() {
    return /* ... */;
  }
}

class Output {
  constructor(montant, destinataire) {
    // ...
  }

  // Retourne le hash du Output : montant + destinataire
  getHash() {
    // ...
  }
}

// Construit une transaction envoyant montant à destinataire.
// Retourne la transaction
function buildSimpleTransaction(
  privateKeyStringSender,
  publicKeyStringDestinataire,
  montant,
  unspentOutputs
) {

  const unspentOutputsForMontant = calcUnspentOutputsForMontant(/* ... */);

  const inputs = unspentOutputsForMontant.map((unspentOutput) => {
    // transformez un unspentOutput en input
    const input = new Input(/* ... */);
    // ...
    return input;
  });

  const sommeInputs = inputs.reduce((somme, input) => {
    return somme + input.montant();
  }, 0);

  const outputs = [/* ... */];

  // ...

  return new Transaction(inputs, outputs);
}

module.exports = {
  Transaction,
  Input,
  Output,
  buildSimpleTransaction
}


// Sélection des unspentOutputs m'appartenant jusqu'à atteindre le montant souhaité
function calcUnspentOutputsForMontant(montant, unspentOutputs, publicKeyStringSender) {
  let unspentOutputsForMontant = [];
  let valueUnspentOutputsForMontant = 0;

  for (let i = 0; i < unspentOutputs.length; i++) {
    const unspentOutput = unspentOutputs[i];
    const output = unspentOutput.tx.outputs[unspentOutput.index];

    // Je ne sélectionne que les transactions qui m'appartiennent
    if(output.destinataire === publicKeyStringSender) {
      unspentOutputsForMontant.push(unspentOutput);
      valueUnspentOutputsForMontant += output.montant;

      if (valueUnspentOutputsForMontant >= montant) {
        // Quand j'atteind le montant souhaité, j'arrête.
        return unspentOutputsForMontant;
      }
    }
  }

  // Quand on n'a pas assez d'argent, on lance une exception
  throw new Error("Vous n'avez pas assez.");
}
