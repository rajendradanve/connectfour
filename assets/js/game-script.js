const PLAYER_1_COIN_CLASS = "red-coin";
const PLAYER_2_COIN_CLASS = "yellow-coin";
const EMPTY_COIN_CLASS = "empty-coin";
const GAME_DRAW = "Draw";
const HUMAN_PLAYER = "Human";
const COMPUTER_PLAYER = "Computer";
const NO_OF_COLS = 7;
const NO_OF_TOTAL_ROWS = 6;
const NO_OF_GAME_ROWS = 5;
let currentPlayerId = 1;
const MIN_COIN_COUNT_SEQ_REQUIRED = 4;
const TIMEOUT_DELAY = 1000;
let second_player = "";
let activePlayerCoin = PLAYER_1_COIN_CLASS;

$(document).ready(function () {
    
    getPlayerInfo();

    if (second_player != HUMAN_PLAYER && second_player != COMPUTER_PLAYER) {

        redirectToHomePage();

    } else {

        setGameArea();

        startGame();
    }
});

function startGame() {
 
    for (let col_no = 0; col_no < NO_OF_COLS; col_no++) {
        $(`#column${col_no}`)
            .mouseenter(function () {
                if (checkIfCoinExists(col_no, NO_OF_GAME_ROWS)) {
                    
                    //only allowed to add coin if top last row in the game board is not filled with coin.
                    removeAndAddClassFromCell({
                        column: col_no, 
                        row: NO_OF_TOTAL_ROWS, 
                        removeClass: EMPTY_COIN_CLASS, 
                        addClass: activePlayerCoin
                    }); // not show coin in the top entry row as no empty cell available.
                }
            })
            .mouseleave(function () {
                removeAndAddClassFromCell({
                    column: col_no, 
                    row: NO_OF_TOTAL_ROWS, 
                    removeClass: activePlayerCoin,
                    addClass: EMPTY_COIN_CLASS
                });
            })
            .click(function () {

                if (checkIfCoinExists(col_no, NO_OF_GAME_ROWS)) {
                    //Allowed to enter coin only if last row (6th) in game board is not filled with any coin.

                    let row = insertActivePlayerCoinToGrid(col_no, activePlayerCoin, EMPTY_COIN_CLASS); //add coin of active player in the selected column and available row.

                    let isGameOn = checkIfPlayerWon(col_no, row);

                    if (isGameOn === 0) {

                        changePlayer();

                        setTimeout(function () {

                            
                           
                            if (currentPlayerId === 2 && second_player === COMPUTER_PLAYER) {
                               
                                playComputersTurn();

                            }
                        }, TIMEOUT_DELAY);
                        //continue Game. change player change class

                    } else if (isGameOn === 1) {
                        //current player is winner
                        gameResult(`player ${currentPlayerId}`);
                    } else if (isGameOn === 2) {
                        //game is GAME_DRAW
                        console.log("Game is GAME_DRAW");
                        gameResult(GAME_DRAW);
                    } else {
                        //something is wrong
                        console.log("something is wrong");
                    }
                }
            });
    }
}

//function when one of the player is computer. Function will find random cell to put coin.
function playComputersTurn() {

    //currently computer will be 2nd player. so PLAYER_2_COIN_CLASS used.

    let isComputerWon = 0;
    let isComputerPlayed = false;

    while (!isComputerPlayed) {
        let computerColumn = Math.floor(Math.random() * 7);

        if (checkIfCoinExists(computerColumn, NO_OF_GAME_ROWS)) {
            $(`#coin${computerColumn}${NO_OF_TOTAL_ROWS}`).removeClass(EMPTY_COIN_CLASS).addClass(PLAYER_2_COIN_CLASS).animate({
                opacity: 0.7}, "medium").animate({opacity: 1}, "medium");
                
            let computerRow = insertActivePlayerCoinToGrid(computerColumn);
            isComputerWon = checkIfPlayerWon(computerColumn, computerRow);
            isComputerPlayed = true;
            break;
        }
    }

    if (isComputerWon === 0) {

        changePlayer();

    } else if (isComputerWon === 1) {

        gameResult(second_player);

    } else if (isComputerWon === 2) {

        gameResult(GAME_DRAW);
    }
    return;
}

//function to add active player coin in the empty cell and remove column if place is not available.
function insertActivePlayerCoinToGrid(selectedColumn) {
    
    let row_no = 0;

    while (row_no < NO_OF_TOTAL_ROWS) {
        // row_norequired to checked only 6 rows from bottom.

        if (checkIfCoinExists(selectedColumn, row_no)) {
            removeAndAddClassFromCell({
                column: selectedColumn, 
                row: row_no, 
                removeClass: EMPTY_COIN_CLASS, 
                addClass: activePlayerCoin
            });

            if (row_no === NO_OF_GAME_ROWS) {
                
                //if coin goes to top last row of the game board then that column shall not be used for further play.
                disableColumnForFurtherClick(selectedColumn);

            }

            break; //come out of for loop for row_noafter condition is satisfied once.
        }

        row_no++;
    }

    //removing coinClass for current player so that another player can play.
    removeAndAddClassFromCell({
        column:selectedColumn, 
        row: NO_OF_TOTAL_ROWS, 
        removeClass: activePlayerCoin, 
        addClass: EMPTY_COIN_CLASS
    });

    return row_no;
}

function disableColumnForFurtherClick(colNo) {
    return $(`#coin${colNo}${NO_OF_GAME_ROWS}`).removeClass(PLAYER_1_COIN_CLASS).removeClass(PLAYER_2_COIN_CLASS).addClass(EMPTY_COIN_CLASS);
}

//function to check if cell is empty to add coin
function checkIfCoinExists(column, row) {
    return $(`#coin${column}${row}`).hasClass(EMPTY_COIN_CLASS);
}

//function to remove class and add another class from cell
function removeAndAddClassFromCell({column, row, removeClass, addClass}) {

    let cellWidth = parseFloat($("#coin00").css("height").slice(0, -2));
    let animationTop = "-" + (NO_OF_TOTAL_ROWS-row) * cellWidth + "px"; //caculated releative position for animation
   
    $(`#coin${column}${row}`).removeClass(removeClass).addClass(addClass).css("top", animationTop).animate({
        top: 0
    }, "slow");

    return;
}

//setup active player coin

function setActivePlayerCoin() {

    activePlayerCoin = currentPlayerId === 1 ? PLAYER_1_COIN_CLASS : PLAYER_2_COIN_CLASS;

    return;
}

// change player
function changePlayer() {

    currentPlayerId = currentPlayerId === 1 ? 2 : 1;
    setActivePlayerCoin();
    $("#player-info").text(`Player ${currentPlayerId} turn`);

    return;
}

//function to get information about second player (Computer or Human)
function getPlayerInfo() {
   
    if (window.location.search.split("?").length > 1) {
        let params = window.location.search.split("?")[1].split("&");

        second_player = decodeURIComponent(params[0].split("=")[1]);
    } else {
        //Todo: set up error
        second_player = "error";
    }
    
    return ;
}

//DOM using javascript. Setting up gaming graphics
function setGameArea() {
    //Assign width and height for game container div based on broswer width and height
    let gameContainerWidth = window.innerWidth * 0.9;
    let gameContainerHeight = window.innerHeight;
    $("#game-container").css("width", gameContainerWidth);
    $("#game-container").css("height", gameContainerHeight);

    //calculate height of available game-container height - game-controller height
    let availableHeightForGameArea = gameContainerHeight - parseFloat($("#game-controller").css("height").slice(0, -2));

    //calculated sized for game-area div based on width and height.
    // Size required for game-area div required to be square within game-container
    // below formula compare 60% of width vs 80% of height and takes the minimum
    let gameAreaSize = gameContainerWidth * 0.6 >= availableHeightForGameArea * 0.9 ? availableHeightForGameArea * 0.9 : gameContainerWidth * 0.6;

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
            $(`#column${i}`).append(`<div id="square-cell-${i}${j}"><div class="empty-coin-out"><div id="coin${i}${j}" class= "empty-coin"></div></div></div></div>`);
            if (j == 6) {
                $(`#square-cell-${i}${j}`).addClass("square-cell-entry");
            } else {
                $(`#square-cell-${i}${j}`).addClass("square-cell-game-board");
            }
        }
    }

    return;
}

/* checking if any same color 4 coins are in a row or diagonal. 
function takes current row and column where coin goes last, active coin class.
This function checks if there are any four same coins in a
    1. column - downward
    2. row - right side or left side
    3. Diagonal - left to right
    4. diagonal - right to left

    function will return true if any of above condition satified. 
*/

//checking if any of winning condition satisfied
function checkIfPlayerWon(playedColumn, playedRow) {
    let winningInt = 0; //0 for game continue, 1 for game won by active player, 2 for game draw.

    if (isColumnWinning(playedColumn, playedRow, activePlayerCoin) || isRowWining(playedColumn, playedRow, activePlayerCoin) || isDiagonalWinning(playedColumn, playedRow, activePlayerCoin)) {
        winningInt = 1; // winning condition satisfied. stop game.
    } else if (isGameDraw()) {
        winningInt = 2; // game is GAME_DRAW. No empty cells to add coins. No one wins
    } else {
        winningInt = 0;
    }

    return winningInt;
}

function isColumnWinning(column, row, coinColorClass) {
    let numberOfCoinsColumn = 1; //to check if 4 coins are in a row.
    let isColumnWinner = false;
    if (row > 2) {
        //don't need to check column winning condition if row is less than 3.

        //for loop to check if there are same coins in a column
        for (let j = row - 1; j >= row - 3; j--) {
            if ($(`#coin${column}${j}`).hasClass(coinColorClass)) {
                numberOfCoinsColumn++;
            }

            if (numberOfCoinsColumn == 4) {
                isColumnWinner = true;
            }
        }
    }
    return isColumnWinner;
}

//Below function check if four same coins are in a same row.
function isRowWining(column, row, coinColorClass) {
    let numberOfCoinsRow = 1;
    let isRowWinner = false;
    let minColumnCheck = column <= 3 ? 0 : column - 3; //only need to check max 3 columns on left if available
    let maxColumnCheck = column >= 3 ? 6 : column + 3; // only need to check max 3 column on right if available
    let i = column - 1;

    //below while loop checking left side of the row if same conis are present

    while (i >= minColumnCheck) {
        if ($(`#coin${i}${row}`).hasClass(coinColorClass)) {
            numberOfCoinsRow++;
        } else {
            break; // loop breaks if immidate cells don't have same class.
        }

        i--;
    }

    //below while loop checks right of the row if same class present

    if (numberOfCoinsRow != 4) {
        let j = column + 1;

        while (j <= maxColumnCheck) {
            if ($(`#coin${j}${row}`).hasClass(coinColorClass)) {
                numberOfCoinsRow++;
            } else {
                break; // loop breaks if immidate cells don't have same class.
            }

            j++;
        }
    }

    if (numberOfCoinsRow == 4) {
        isRowWinner = true;
    }

    return isRowWinner;
}
// Below function check if four coins are same diagonally.
function isDiagonalWinning(column, row, coinColorClass) {
    let diagonalWinner = false;

    //left to right check. As per testing condition for left top cells and right bottom cells diagonal winning is not possible.
    // below if statement is used to remove above cells from checking.

    if ((row > column && row - column >= 3) || (row < column && column - row >= 4)) {
        diagonalWinner = false;
    } else {
        let numberOfDiagonalLeftToRight = 1; // for left to right condition. Value one is given as current cell will already pass the test
        let minColumnCheckLeftToRight = column <= 3 ? 0 : column - 3; //only need to check max 3 columns on left if available
        let maxColumnCheckLeftToRight = column >= 3 ? 6 : column + 3; // only need to check max 3 column on right if available
        let minRowCheckLeftToRight = row <= 3 ? 0 : row - 3; // only need to check 3 down rows if available
        let maxRowCheckLeftToRight = row >= 3 ? 5 : row + 3; // only need to check 3 up rows if available of max 5
        let i = column - 1; //to check downward items.
        let j = row - 1; // to check downward items

        //below while loop check diagonal cells to left side (if cells are available)
        while (i >= minColumnCheckLeftToRight && j >= minRowCheckLeftToRight) {
            if ($(`#coin${i}${j}`).hasClass(coinColorClass)) {
                numberOfDiagonalLeftToRight++;
            } else {
                break; // loop breaks if immidate cells don't have same class.
            }

            i--;
            j--;
        }

        //if condition check winning condition already acheived or not
        if (numberOfDiagonalLeftToRight != 4) {
            //reassign value to i and j
            i = column + 1;
            j = row + 1;
            //Below while loop check diagonal cell to right (if cells are available)
            while (i <= maxColumnCheckLeftToRight && j <= maxRowCheckLeftToRight) {
                if ($(`#coin${i}${j}`).hasClass(coinColorClass)) {
                    numberOfDiagonalLeftToRight++;
                } else {
                    break; // loop breaks if immidate cells don't have same class.
                }
                i++;
                j++;
            }
        }

        if (numberOfDiagonalLeftToRight == 4) {
            diagonalWinner = true;
        }
    }

    //Right to Left check
    // Right to left check required to done if left to right condition doesn't satisfy winning condition.
    if (!diagonalWinner) {
        // As per testing condition left bottom cells and right top cells diagonal winning is not possible.
        // below if statement is used to remove above cells from checking.
        if (row + column <= 2 || column + row >= 9) {
            diagonalWinner = false;
        } else {
            let numberOfDiagonalRightToLeft = 1; // for Rith to left condition. Value one is given as current cell will already pass the test

            let minColumnCheckRightToLeft = column <= 3 ? 0 : column - 3; //only need to check max 3 columns on left if available
            let maxColumnCheckRightToLeft = column >= 3 ? 6 : column + 3; // only need to check max 3 column on right if available
            let minRowCheckRightToLeft = row <= 3 ? 0 : row - 3; // only need to check 3 down rows if available
            let maxRowCheckRightToLeft = row >= 3 ? 5 : row + 3; // only need to check 3 up rows if available of max 5

            //reassigning values to i (column) and j (rows)
            i = column + 1; //to check downward items towards right . Number of column increases towards right
            j = row - 1; // to check downward items towards right

            //below while loop check diagonal cells to left side (if cells are available)
            while (i <= maxColumnCheckRightToLeft && j >= minRowCheckRightToLeft) {
                if ($(`#coin${i}${j}`).hasClass(coinColorClass)) {
                    numberOfDiagonalRightToLeft++;
                } else {
                    break; // loop breaks if immidate cells don't have same class.
                }

                i++;
                j--;
            }

            //if condition check winning condition already acheived or not
            if (numberOfDiagonalRightToLeft != 4) {
                //reassign value to i and j
                i = column - 1;
                j = row + 1;
                //Below while loop check diagonal cell to right (if cells are available)
                while (i >= minColumnCheckRightToLeft && j <= maxRowCheckRightToLeft) {
                    if ($(`#coin${i}${j}`).hasClass(coinColorClass)) {
                        numberOfDiagonalRightToLeft++;
                    } else {
                        break; // loop breaks if immidate cells don't have same class.
                    }
                    i--;
                    j++;
                }
            }

            if (numberOfDiagonalRightToLeft == 4) {
                diagonalWinner = true;
            }
        }
    }

    return diagonalWinner;
}

function isGameDraw() {
    let gameDrawStatus = true;

    for (let colNo = 0; colNo < 7; colNo++) {
        if (checkIfCoinExists(colNo, NO_OF_GAME_ROWS)) {
            gameDrawStatus = false;
            break;
        }
    }
    return gameDrawStatus;
}

function gameResult(winnerPlayer) {

    for (let col_no = 0; col_no < NO_OF_COLS; col_no++) {
        $(`#column${col_no}`).removeClass(PLAYER_1_COIN_CLASS).removeClass(PLAYER_2_COIN_CLASS).addClass(EMPTY_COIN_CLASS);
        $(`#column${col_no}`).off("click").off("mouseenter").off("mouseleave");
    }

    let winnertext = "";
    console.log("winner player is " + winnerPlayer);
    if (winnerPlayer != GAME_DRAW) {
        winnertext = `...And WINNER IS ${winnerPlayer}`;
    } else {
        winnertext = "This Game Is Draw";
    }

    $("#player-info").text(winnertext);
}

function redirectToHomePage() {
    window.location.href = "./";
}

function toggleSound() {
    if ($("#music").children("i").hasClass("fa-volume-up")) {
        $("#music").children("i").removeClass("fa-volume-up").addClass("fa-volume-mute");

        document.getElementById("background-audio").pause();
    } else {
        $("#music").children("i").removeClass("fa-volume-mute").addClass("fa-volume-up");
        document.getElementById("background-audio").play();
    }
    //document.getElementById("background-audio").loop = true;
}

function reloadPage() {
    location.reload();
}