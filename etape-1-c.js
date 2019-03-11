const Block = require("./Block");

const first  = new Block(0, null     , "First !");
const second = new Block(1, first.id , "Second :)");
const third  = new Block(2, second.id, "Vous commencez à voir le principe ?");

console.log([first, second, third]);

console.log("First ! Je dois être valide :", first.isValid()); // true
console.log("Second :) Je dois être valide aussi :", second.isValid()); // true
console.log("Car mon getHash est équale à mon id :", second.getHash() === second.id); // true

console.log("Il se passe quelque-chose...");
third.data = "Une modification par ici";

console.log("Pas moi :( Quelqu'un est passé par là :", third.isValid()); // false
