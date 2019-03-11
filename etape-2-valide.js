const Block = require("./Block");
const Blockchain = require("./Blockchain");

const first  = new Block(0, null     , "First !");
const second = new Block(1, first.id , "Second :)");
const third  = new Block(2, second.id, "Vous commencez à voir le principe ?");

const blockchain = new Blockchain();

blockchain.add(first);
blockchain.add(second);
blockchain.add(third);

console.log("isValid:", blockchain.isValid());  // true

second.data = "Hack";

console.log("Un hacker passe par ici");
console.log("isValid:", blockchain.isValid());  // false

second.data = "Hack moins grossier";
second.id = second.getHash();

console.log("Et un autre par là");
console.log("isValid:", blockchain.isValid());  // false

console.log("On va voir comment lui compliquer la vie.");
