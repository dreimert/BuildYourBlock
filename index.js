const Block = require('./Block');
const Blockchain = require('./Blockchain');

const DIFFICULTY = 5;

const blockchain = new Blockchain();

const first = new Block(
  null,
  new Date("2019-02-27T08:01:42.000Z"),
  "First !"
);

first.miner(DIFFICULTY)

const second = new Block(
  first.id,
  new Date("2019-02-27T10:02:43.000Z"),
  "Second :)"
);

second.miner(DIFFICULTY)

const third = new Block(
  second.id,
  new Date("2019-02-28T10:03:44.000Z"),
  "Vous commencez à voir le principe ?"
);

third.miner(DIFFICULTY)

blockchain.add(first);
blockchain.add(second);
blockchain.add(third);

console.log("isValid:", blockchain.isValid(DIFFICULTY));

console.log(blockchain);
