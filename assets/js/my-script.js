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

//adding column and cells html using javascript and JQuery
// number of rows will be 7 including row for coin insert. i: number of column, j: number of row
// when row is top row  j = 6 class of square-cell-entry is added and for other rows square-cell-game-board is added to create board look
// for each square cell and coin circle unique id is generated. 
for(let i=0; i<7; i++){
    // i is number for column from left to right
    $("#game-area").append(`<div id="column${i}"></div>`);
    $(`#column${i}`).addClass("column");
    for (let j=0; j<7; j++){
        // j is number of row. i and j both creat cell grid.
        $(`#column${i}`).append(`<div id="square-cell-${i}${j}"><div id="coin${i}${j}" class= "empty-coin"></div></div></div>`);
        if(j==6){
            $(`#square-cell-${i}${j}`).addClass("square-cell-entry");
        }else{
        $(`#square-cell-${i}${j}`).addClass("square-cell-game-board");
        } 
    }
}
//Till above code is creating html DOM strcture for the game.

let isPlayer1Turn = true; //setup to define who is playing if player1turn is false means player2 is playing
let coinClass = "red-coin"; // setup coin class. Currently giving red coin to first player.

//Below for loop event is created for mouse enter and mouse leave to get the coin at entry area. 
for(let i=0; i<7; i++){
    $(`#column${i}`).mouseenter(function(){
        if($(`#coin${i}5`).hasClass("empty-coin")){ //only allowed if last row in game board is not filled with coin
        $(`#coin${i}6`).removeClass("empty-coin").addClass(coinClass);
        }
    }).mouseleave(function(){
        
        $(`#coin${i}6`).removeClass(coinClass).addClass("empty-coin");
        
    }).click(function(){
        if($(`#coin${i}5`).hasClass("empty-coin")){ //only allowed if last row in game board is not filled with coin
        for(let j=0; j<6; j++){ // row (j) required to checked only 6 rows from bottom.
            
            if($(`#coin${i}${j}`).hasClass("empty-coin")){
                $(`#coin${i}${j}`).removeClass("empty-coin").addClass(coinClass);

                if(j==5){
                    //if coin goes to top last row of the game board then that column shall not be used for further play.
                    $(`#coin${i}6`).removeClass("red-coin").removeClass("yellow-coin").addClass("empty-coin");
                }
                break; //come out of for loop for j
            }
            
        
        }

        //below code changes player and active class
        $(`#coin${i}6`).addClass("empty-coin").removeClass(coinClass);
        if(isPlayer1Turn){
        isPlayer1Turn = false;
        coinClass = "yellow-coin";
    }else {
        isPlayer1Turn = true;
        coinClass = "red-coin"
    }

    if(j!=5){
    $(`#coin${i}6`).removeClass("empty-coin").addClass(coinClass);
    }

    }else { // if top last row of game board don't have empty class then this column shall not be used for further play

        $(`#coin${i}6`).removeClass("red-coin").removeClass("yellow-coin").addClass("empty-coin");

    }

    });
}
