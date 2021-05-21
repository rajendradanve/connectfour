const PLAYER_1_COIN_CLASS = "red-pokeball";
const PLAYER_2_COIN_CLASS = "yellow-pokeball";
const EMPTY_COIN_CLASS = "empty-coin";
const DISABLE_COIN_CLASS = "disable-coin";
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

    $("#game-result").hide();

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

                    if(currentPlayerId=== 1 || (currentPlayerId === 2 && second_player != COMPUTER_PLAYER)){
                            //only allowed to add coin if top last row in the game board is not filled with coin.
                    removeAndAddClassToCell({
                        column: col_no,
                        row: NO_OF_TOTAL_ROWS,
                        removeClass: EMPTY_COIN_CLASS,
                        addClass: activePlayerCoin
                    }); // not show coin in the top entry row as no empty cell available.
                    }
                    
                }
            })
            .mouseleave(function () {

                removeAndAddClassToCell({
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
                        gameResult(`Player ${currentPlayerId}`);
                    } else if (isGameOn === 2) {
                        //game is GAME_DRAW
                       
                        gameResult(GAME_DRAW);
                    } else {
                        //something is wrong
                       
                        redirectToErrorPage();
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

    removeAndAddClassToCell({
        column: selectedColumn,
        row: NO_OF_TOTAL_ROWS,
        removeClass: activePlayerCoin,
        addClass: EMPTY_COIN_CLASS
    });

    let row_no = 0;

    while (row_no <= NO_OF_GAME_ROWS) {
        // row_norequired to checked only 6 rows from bottom.

        if (checkIfCoinExists(selectedColumn, row_no)) {

            removeAndAddClassToCell({
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

    return row_no;
}

function disableColumnForFurtherClick(colNo) {
    $(`#coin${colNo}${NO_OF_TOTAL_ROWS}`).removeClass(PLAYER_1_COIN_CLASS).removeClass(PLAYER_2_COIN_CLASS).addClass(DISABLE_COIN_CLASS).removeClass(EMPTY_COIN_CLASS);
    $(`#square-cell-${colNo}${NO_OF_TOTAL_ROWS}`).removeClass("square-cell-entry").addClass("square-cell-entry-disable");
    return;
}

//function to check if cell is empty to add coin
function checkIfCoinExists(column, row) {
    return $(`#coin${column}${row}`).hasClass(EMPTY_COIN_CLASS);
}

//function to remove class and add another class from cell
function removeAndAddClassToCell({
    column,
    row,
    removeClass,
    addClass
}) {

    
    let cellWidth = parseFloat($("#coin00").css("height").slice(0, -2));

    let animationTop = "";

        if(currentPlayerId === 2 && second_player === COMPUTER_PLAYER){
            animationTop = "-" + (NO_OF_TOTAL_ROWS-row +1)  * cellWidth + "px"; //caculated releative position for animation
        }else{
            animationTop = "-" + (NO_OF_TOTAL_ROWS - row) * cellWidth + "px"; //caculated releative position for animation
        }

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
        redirectToErrorPage()
    }

    return;
}

//DOM using javascript. Setting up gaming graphics
function setGameArea() {

    let availableHeightForGameArea = window.innerHeight - 100 - parseFloat($("#game-controller-container").css("height").slice(0, -2));
    let availableWidthForGameArea = window.innerWidth - 40;

    let gameAreaSize = availableWidthForGameArea > availableHeightForGameArea ? availableHeightForGameArea : availableWidthForGameArea;
    console.log("gameAreaSize: "+ gameAreaSize);
    //assign width, height and margin to game-area div
    $("#game-area").css("width", gameAreaSize + "px");
    $("#game-area").css("height", gameAreaSize + "px");

    //adding column and cells html using javascript and JQuery
    // number of rows will be 7 including row for coin insert. 
    // when row is top row  row_no = 6 class of square-cell-entry is added and for other rows square-cell-game-board is added to create board look
    // for each square cell and coin circle unique id is generated.

    for (let col_no = 0; col_no < NO_OF_COLS; col_no++) {

        $("#game-area").append(`<div id="column${col_no}"></div>`);
        $(`#column${col_no}`).addClass("column");
        for (let row_no = 0; row_no <= NO_OF_TOTAL_ROWS; row_no++) {

            $(`#column${col_no}`).append(`<div id="square-cell-${col_no}${row_no}"><div class="empty-coin-out"><div id="coin${col_no}${row_no}" class= "empty-coin"></div></div></div></div>`);
            if (row_no === NO_OF_TOTAL_ROWS) {
                $(`#square-cell-${col_no}${row_no}`).addClass("square-cell-entry");
                if(col_no === 0){
                    $(`#square-cell-${col_no}${row_no}`).css("border-left", "1px solid gray");
                }
              if(col_no === (NO_OF_COLS-1)){
                    $(`#square-cell-${col_no}${row_no}`).css("border-right", "1px solid gray");
                }
            } else {
                $(`#square-cell-${col_no}${row_no}`).addClass("square-cell-game-board");
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

    if (isColumnWinning(playedColumn, playedRow) || isRowWining(playedColumn, playedRow) || isDiagonalWinning(playedColumn, playedRow)) {
        winningInt = 1; // winning condition satisfied. stop game.
    } else if (isGameDraw()) {
        winningInt = 2; // game is GAME_DRAW. No empty cells to add coins. No one wins
    } else {
        winningInt = 0;
    }

    return winningInt;
}

function isColumnWinning(column, row) {
    let numberOfCoinsColumn = 1; //to check if 4 coins are in a row.
    let isColumnWinner = false;
    if (row > 2) {
        //don't need to check column winning condition if row is less than 3.

        //for loop to check if there are same coins in a column
        for (let j = row - 1; j >= row - 3; j--) {
            if ($(`#coin${column}${j}`).hasClass(activePlayerCoin)) {
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
function isRowWining(column, row) {
    let numberOfCoinsRow = 1;
    let isRowWinner = false;
    let minColumnCheck = column <= 3 ? 0 : column - 3; //only need to check max 3 columns on left if available
    let maxColumnCheck = column >= 3 ? 6 : column + 3; // only need to check max 3 column on right if available
    let i = column - 1;

    //below while loop checking left side of the row if same conis are present

    while (i >= minColumnCheck) {
        if ($(`#coin${i}${row}`).hasClass(activePlayerCoin)) {
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
            if ($(`#coin${j}${row}`).hasClass(activePlayerCoin)) {
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
function isDiagonalWinning(column, row) {

    if (diagonalLeftToRightWinningCheck(column, row) || diagonalRightToLeftWinningCheck(column, row)) {

        return true;
    } else {
        return false;
    }

}

function diagonalLeftToRightWinningCheck(column, row) {

    //left to right check. As per testing condition for left top cells and right bottom cells diagonal winning is not possible.
    // below if statement is used to remove above cells from checking.

    if ((row > column && row - column >= 3) || (row < column && column - row >= 4)) {

        return false;
    } else {

        let totalLoopCounter = 3; //Need to loop max 3 times to check winning condition.
        let row_down_check_idx = row - 1; // setting initial value to check coins on left side of the current coin cell
        let col_down_check_idx = column - 1; //setting initial value to check coins on left side of the current coin cell
        let winCounterCheck = 1; // current cell already has active player coin. So value is set to 1

        //below loop will check left side row and column diagonally.
        while (totalLoopCounter > 0 && col_down_check_idx >= 0 && row_down_check_idx >= 0) {

            if ($(`#coin${col_down_check_idx}${row_down_check_idx}`).hasClass(activePlayerCoin)) {

                winCounterCheck++;

            } else {
                break;
            }

            row_down_check_idx--;
            col_down_check_idx--;
            totalLoopCounter--;

        }

        if (winCounterCheck != MIN_COIN_COUNT_SEQ_REQUIRED) { //if winCounterCheck is 4 then winning condition is satisfied and no need for further checks.


            totalLoopCounter = 3; //reassigning value of the counter to 3 to check left to right condition upward.
            let row_up_check_idx = row + 1; // setting initial value to check coins on right side of the current coin cell
            let col_up_check_idx = column + 1; //setting initial value to check coins on right side of the current coin cell

            while (totalLoopCounter > 0 && col_up_check_idx < NO_OF_COLS && row_up_check_idx < NO_OF_GAME_ROWS) {
                if ($(`#coin${col_up_check_idx}${row_up_check_idx}`).hasClass(activePlayerCoin)) {

                    winCounterCheck++;

                } else {
                    break;
                }
                row_up_check_idx++;
                col_up_check_idx++;
                totalLoopCounter--;
            }

        }

        if (winCounterCheck === MIN_COIN_COUNT_SEQ_REQUIRED) {
            return true;
        } else {
            return false;
        }

    }
}

function diagonalRightToLeftWinningCheck(column, row) {
    // As per testing condition left bottom cells and right top cells diagonal winning is not possible.
    // below if statement is used to remove above cells from checking. This will avoid extra looping time.
    if (row + column <= 2 || column + row >= 9) {

        return false;

    } else {

        let totalLoopCounter = 3; //Need to loop max 3 times to check winning condition.
        let row_down_check_idx = row - 1; // setting initial value to check coins on right bottom side of the current coin cell
        let col_up_check_idx = column + 1; //setting initial value to check coins on right bottom side of the current coin cell
        let winCounterCheck = 1; // current cell already has active player coin. So value is set to 1

        //below loop will check right bottom side current row and column diagonally.
        while (totalLoopCounter > 0 && col_up_check_idx < NO_OF_COLS && row_down_check_idx >= 0) {

            if ($(`#coin${col_up_check_idx}${row_down_check_idx}`).hasClass(activePlayerCoin)) {

                winCounterCheck++;

            } else {
                break;
            }

            row_down_check_idx--;
            col_up_check_idx++;
            totalLoopCounter--;

        }

        if (winCounterCheck != MIN_COIN_COUNT_SEQ_REQUIRED) { //if winCounterCheck is 4 then winning condition is satisfied and no need for further checks.

            totalLoopCounter = 3; //reassigning value of the counter to 3 to check left to right condition upward.
            let row_up_check_idx = row + 1; // setting initial value to check coins on right side of the current coin cell
            let col_down_check_idx = column - 1; //setting initial value to check coins on right side of the current coin cell

            while (totalLoopCounter > 0 && col_down_check_idx >= 0 && row_up_check_idx < NO_OF_GAME_ROWS) {

                if ($(`#coin${col_down_check_idx}${row_up_check_idx}`).hasClass(activePlayerCoin)) {

                    winCounterCheck++;

                } else {

                    break;
                }
                row_up_check_idx++;
                col_up_check_idx--;
                totalLoopCounter--;
            }

        }

        if (winCounterCheck === MIN_COIN_COUNT_SEQ_REQUIRED) {
            return true;
        } else {
            return false;
        }

    }
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

    $("#player-info").text("");
    
    let gameResultText = "";

    if (winnerPlayer != GAME_DRAW) {
        
        gameResultText= `<h1>${winnerPlayer} Won </h1>`;

    } else {
        
        gameResultText= `<h1>This Game Is <br> Draw </h1>`
    }

    
    $("#game-result").append(gameResultText).addClass('game-result-div').show().animate ({fontSize: '4rem'}, "slow");
}

function redirectToHomePage() {
    window.location.href = "./";
}

function toggleSound() {
    if ($("#music").children("i").hasClass("fa-volume-up")) {
        $("#music").children("i").removeClass("fa-volume-up").addClass("fa-volume-mute");
        $("#music").prop("title", "Music On");
        document.getElementById("background-audio").pause();
    } else {
        $("#music").children("i").removeClass("fa-volume-mute").addClass("fa-volume-up");
        $("#music").prop("title", "Music Mute");
        document.getElementById("background-audio").play();
    }
   
}

function reloadPage() {
    location.reload();
}

function redirectToErrorPage(){
    window.location.href = "./error.html";
}