const crypto = require('crypto');

function getHash(data) {
  return crypto.createHash('sha256').update(data, 'utf8').digest('hex');
}

function generateId(date, previous, data) {
  return getHash(date + previous + data)
}

module.exports = class Block {
  // Complétez le constructeur
  constructor(previous, data) {
    this.previous = previous;
    this.data = data;
    this.date = new Date();
    this.id = generateId(this.date, previous, data);
  }
}
