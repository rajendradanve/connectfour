//Assign width and height for game container div based on broswer width and height
let gameContainerWidth = window.innerWidth*0.8;
let gameContainerHeight = window.innerHeight;
$("#game-container").css("width", gameContainerWidth);
$("#game-container").css("height", gameContainerHeight);


//calculate height of available game-container height - game-controller height
let availableHeightForGameArea = gameContainerHeight- parseFloat($("#game-controller").css("height").slice(0, -2));

//calculated sized for game-area div based on width and height. 
// Size required for game-area div required to be square within game-container
// below formula compare 60% of width vs 80% of height and takes the minimum 
let gameAreaSize = (gameContainerWidth*0.6)>=(availableHeightForGameArea*0.9)? (availableHeightForGameArea*0.9) : (gameContainerWidth*0.6);

//calculated margin available and divided for top and bottom
let gameAreaMargin = (availableHeightForGameArea-gameAreaSize)/2;

//assign width, height and margin to game-area div
$("#game-area").css("width", gameAreaSize+"px");
$("#game-area").css("height", gameAreaSize+"px");
$("#game-area").css("margin-top", gameAreaMargin+"px");
