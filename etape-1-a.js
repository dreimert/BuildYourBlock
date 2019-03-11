const Block = require("./Block");

const first  = new Block(0, "First !");
const second = new Block(1, "Second :)");
const third  = new Block(2, "Vous commencez à voir le principe ?");

console.log([first, second, third]);
