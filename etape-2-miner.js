const Block = require("./Block");
const Blockchain = require("./Blockchain");

const DIFFICULTY = 5;

const first  = new Block(0, null     , DIFFICULTY, "First !");
console.log("Minage de first");
first.miner();
const second = new Block(1, first.id , DIFFICULTY, "Second :)");
console.log("Minage de second");
second.miner();
const third  = new Block(2, second.id, DIFFICULTY, "Vous commencez à voir le principe ?");
console.log("Minage de third");
third.miner();

const blockchain = new Blockchain();

blockchain.add(first);
blockchain.add(second);
blockchain.add(third);

console.log("isValid:", blockchain.isValid()); // true

second.data = "Hack";

console.log("Un hacker passe par ici...");
console.log("isValid:", blockchain.isValid()); // false

second.data = "Hack moins grossier";
second.id = second.getHash();

console.log("Et un autre par là...");
console.log("isValid:", blockchain.isValid()); // false

second.data = "Hack moins grossier";
second.id = second.getHash();

third.previous = second.id;
third.id = third.getHash();

console.log("Lui, il est motivé...");
console.log("isValid:", blockchain.isValid()); // false
