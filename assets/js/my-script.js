let gameContainerWidth = $("#game-controller").css("width");
let gameContainerHeight = $("#game-controller").css("height");

let gameAreaWidth = parseFloat(gameContainerWidth.slice(0,-2))*0.6;
let gameAreaHeight = parseFloat(gameContainerHeight.slice(0,-2))*0.9;

console.log(gameAreaHeight);
console.log(gameAreaWidth);

