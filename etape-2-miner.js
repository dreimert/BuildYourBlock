const Block = require("./Block");
const Blockchain = require("./Blockchain");

const DIFFICULTY = 5;

const first  = new Block(null     , "First !");
first.miner(DIFFICULTY);
const second = new Block(first.id , "Second :)");
second.miner(DIFFICULTY);
const third  = new Block(second.id, "Vous commencez à voir le principe ?");
third.miner(DIFFICULTY);

const blockchain = new Blockchain();

blockchain.add(first);
blockchain.add(second);
blockchain.add(third);

console.log("isValid:", blockchain.isValid());

console.log(blockchain);
