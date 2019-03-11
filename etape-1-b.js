const Block = require("./Block");

const first  = new Block(0, null     , "First !");
const second = new Block(1, first.id , "Second :)");
const third  = new Block(2, second.id, "Vous commencez à voir le principe ?");

// Vos tests ici...

console.log([first, second, third]);
