$(document).ready(function() {
    setGameArea();

    let player2 = getPlayerInfo();

})


function getPlayerInfo() {

    let p2= "";

    let queryString = new Array(); // defined new array

    if (window.location.search.split('?').length > 1) {
        let params = window.location.search.split('?')[1].split('&');
            
        p2 = decodeURIComponent(params[0].split('=')[1]);
    }else{
        //set up error 
        p2= "error";

    }

    return p2;
}

//DOM using java. Setting up gaming graphics
function setGameArea() {

    //Assign width and height for game container div based on broswer width and height
    let gameContainerWidth = window.innerWidth * 0.8;
    let gameContainerHeight = window.innerHeight;
    $("#game-container").css("width", gameContainerWidth);
    $("#game-container").css("height", gameContainerHeight);


    //calculate height of available game-container height - game-controller height
    let availableHeightForGameArea = gameContainerHeight - parseFloat($("#game-controller").css("height").slice(0, -2));

    //calculated sized for game-area div based on width and height. 
    // Size required for game-area div required to be square within game-container
    // below formula compare 60% of width vs 80% of height and takes the minimum 
    let gameAreaSize = (gameContainerWidth * 0.6) >= (availableHeightForGameArea * 0.9) ? (availableHeightForGameArea * 0.9) : (gameContainerWidth * 0.6);

    //calculated margin available and divided for top and bottom
    let gameAreaMargin = (availableHeightForGameArea - gameAreaSize) / 2;

    //assign width, height and margin to game-area div
    $("#game-area").css("width", gameAreaSize + "px");
    $("#game-area").css("height", gameAreaSize + "px");
    $("#game-area").css("margin-top", gameAreaMargin + "px");

    //adding column and cells html using javascript and JQuery
    // number of rows will be 7 including row for coin insert. i: number of column, j: number of row
    // when row is top row  j = 6 class of square-cell-entry is added and for other rows square-cell-game-board is added to create board look
    // for each square cell and coin circle unique id is generated. 
    for (let i = 0; i < 7; i++) {
        // i is number for column from left to right
        $("#game-area").append(`<div id="column${i}"></div>`);
        $(`#column${i}`).addClass("column");
        for (let j = 0; j < 7; j++) {
            // j is number of row. i and j both creat cell grid.
            $(`#column${i}`).append(`<div id="square-cell-${i}${j}"><div id="coin${i}${j}" class= "empty-coin"></div></div></div>`);
            if (j == 6) {
                $(`#square-cell-${i}${j}`).addClass("square-cell-entry");
            } else {
                $(`#square-cell-${i}${j}`).addClass("square-cell-game-board");
            }
        }
    }


    return;
}