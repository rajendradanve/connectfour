$.holdReady(true); //loading of document is hold to check if correct player information available. 

getPlayerInfo(); // getting player information to check if 1 player game or 2 player game and also checks if there is any problems with player information.

//if everything okay then game will be proceed. 

function getPlayerInfo() {
    let queryString = new Array(); // defined new array

    if (window.location.search.split('?').length > 1) {
        let params = window.location.search.split('?')[1].split('&');

        for (let param of params) {
            let key = param.split('=')[0];
            let value = decodeURIComponent(param.split('=')[1]);
            queryString[key] = value;
        }

        if (Object.values(queryString)[0] === "player-1-computer" && Object.values(queryString)[1] === "player-2-computer") {
            //redirect to index page as both players are computer which is not allowed. This is not possible unless user make it manually.
            window.location.href = "/";


        } else {
            //load document and player now able to play game.

            $.holdReady(false);
            let p1 = Object.values(queryString)[0].split('-')[2];
            let p2 = Object.values(queryString)[1].split('-')[2];

            if ((p1 != "human" && p1 != "computer") || (p2 != "human" && p2 != "computer")) {
                //something is wrong. redirect or alert. 
                console.log("something is wrong");

            } else {
                //everything okay start the game. :-)
                
                startGame(p1, p2);
            }

        }


    } else {
        //if length is 1 or less then player information is not available. send user back to index page to select player.
        window.location.href = "/";
    }

    return;
}

function startGame(player1, player2) {

    $(document).ready(function() {
        // Function called to setup gaming  area. HTML generated using javascript/jquery.
        setGameArea();    
        setUpEventHandler(player1, player2);
    })

}


//Function for setting up gaming area correctly.
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

function setUpEventHandler(player1Game, player2Game) {

    let coinClass = "red-coin"; // setup coin class. Currently giving red coin to first player.
    let gameResult = 0;
    let activePlayer = 1;

    

    while (gameResult === 0) {

        console.log("active Player: "+ activePlayer + "coin:-" +coinClass);
        

        if (activePlayer === 1) {

            console.log(coinClass);
            if (player1Game === "computer") { //player 1 is computer
                
                gameResult = computerPlayer(coinClass);
                console.log("computer played")

            } else if (player1Game === "human") { //player 1 is human
                
                gameResult = humanPlayer(coinClass);
                
            }
            
            
            if (gameResult === 0) {

                activePlayer = 2; // once computer played active player is changed
                coinClass = "yellow-coin";

            } else if (gameResult === 1) {
                // Player 1 won the game
                gameFinish(player1Game);
                break;

            } else if (gameResult === 2) {

                gameFinish("draw");
                break;

            }
            
        } else if (activePlayer === 2) {
             
            if (player2Game === "computer") {

                gameResult = computerPlayer(coinClass);

            } else if (player2Game === "human") {

                gameResult = humanPlayer(coinClass);
            }

            if (gameResult === 0) {
                console.log(gameResult);
                activePlayer = 1; // once computer played active player is changed
                coinClass = "red-coin";

            } else if (gameResult === 1) {
                // Player 1 won the game
                gameFinish(player2Game);
                break;

            } else if (gameResult === 2) {

                gameFinish("draw");
                break;

            }
            
        } else {

            console.log("something is wrong")
            break;
        }

    }

    return;
}

//function when one of the player is computer. Function will find random cell to put coin.
function computerPlayer(computerCoin) {
    
    let isComputerWin = 0;
    let isComputerPlayed = false;

    while (!isComputerPlayed) {
        let computerColumn = Math.floor(Math.random() * 7);

        if (checkEmptyClass(computerColumn, 5)) {

            let computerRow = addActivePlayerCoin(computerColumn, computerCoin);
            isComputerPlayed = true;
            isComputerWin = checkIfWin(computerColumn, computerRow, computerCoin)
            break;
        }

    }

    return isComputerWin;

}

function humanPlayer(humanCoin) {
    //Below for loop event is created for mouse enter mouse leave and click event to get the coin at entry area. 
    let isGameOn = 0; //to continue playing game
    let isHumanPlayed = false;

    for (let i = 0; i < 7; i++) {

        $(`#column${i}`).mouseenter(function() {

            if (checkEmptyClass(i, 5)) { //only allowed if top last row in game board is not filled with coin.

                removeAddClass(i, 6, "empty-coin", humanCoin); // not show coin in the top entry row as no empty cell available.
            }
        }).mouseleave(function() {

            removeAddClass(i, 6, humanCoin, "empty-coin");

        }).click(function() {

            let column = i;

                 if (checkEmptyClass(i, 5)) { //only allowed if last row (6th) in game board is not filled with any coin
                    
                    let row = addActivePlayerCoin(i, humanCoin); //add coin of active player in the selected column and available row.

                    //check if wining condition satify if not game goes on
                    isGameOn = checkIfWin(column, row, humanCoin);
                    isHumanPlayed  = true;
    
                } else { // if top last row of game board don't have empty class then this column shall not be used for further play

                    $(`#coin${i}6`).removeClass("red-coin").removeClass("yellow-coin").addClass("empty-coin");

                }
            
        });

    }
   
    

}

//checking if any of winning condition satisfied
function checkIfWin(i, j, winningCheckClass) {

    let winningInt = 0;

    if (isColumnWinning(i, j, winningCheckClass) || isRowWining(i, j, winningCheckClass) || isDiagonalWinning(i, j, winningCheckClass)) {

        winningInt = 1; // winning condition satisfied. stop game.

    } else if (isGameDraw()) {

        winningInt = 2; // game is draw. No empty cells to add coins. No one wins

    } else {

        winningInt = 0;
    }

    return winningInt;

}

//function to check if cell is empty to add coin
function checkEmptyClass(column, row) {

    return $(`#coin${column}${row}`).hasClass("empty-coin")

}

function removeAddClass(column, row, removeClass, addClass) {

    return $(`#coin${column}${row}`).removeClass(removeClass).addClass(addClass);
}

//function to add active player coin in the empty cell and remove column if place is not available. 
function addActivePlayerCoin(selectedColumn, activePlayerCoin) {

    let rowNumber = 0;

    while (rowNumber < 6) { // rowNumber required to checked only 6 rows from bottom.

        if (checkEmptyClass(selectedColumn, rowNumber)) {

            removeAddClass(selectedColumn, rowNumber, "empty-coin", activePlayerCoin)

            if (rowNumber === 5) { //if coin goes to top last row of the game board then that column shall not be used for further play.
                
                $(`#coin${selectedColumn}6`).removeClass("red-coin").removeClass("yellow-coin").addClass("empty-coin");
            }

            break; //come out of for loop for rowNumber after condition is satisfied once.
        }

        rowNumber++;
    }

    //removing coinClass for current player so that another player can play.
    removeAddClass(selectedColumn, 6, activePlayerCoin, "empty-coin");
    return rowNumber;
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

function isColumnWinning(column, row, coinColorClass) {

    let numberOfCoinsColumn = 1; //to check if 4 coins are in a row. 
    let isColumnWinner = false;
    if (row > 2) { //don't need to check column winning condition if row is less than 3. 


        //for loop to check if there are same coins in a column
        for (let j = (row - 1); j >= (row - 3); j--) {

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
    let minColumnCheck = column <= 3 ? 0 : (column - 3); //only need to check max 3 columns on left if available
    let maxColumnCheck = column >= 3 ? 6 : (column + 3); // only need to check max 3 column on right if available
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

    if ((row > column && (row - column) >= 3) || (row < column && (column - row) >= 4)) {

        diagonalWinner = false;

    } else {

        let numberOfDiagonalLeftToRight = 1; // for left to right condition. Value one is given as current cell will already pass the test
        let minColumnCheckLeftToRight = column <= 3 ? 0 : (column - 3); //only need to check max 3 columns on left if available
        let maxColumnCheckLeftToRight = column >= 3 ? 6 : (column + 3); // only need to check max 3 column on right if available
        let minRowCheckLeftToRight = row <= 3 ? 0 : (row - 3); // only need to check 3 down rows if available
        let maxRowCheckLeftToRight = row >= 3 ? 5 : (row + 3); // only need to check 3 up rows if available of max 5
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
        if ((row + column) <= 2 || (column + row) >= 9) {

            diagonalWinner = false;

        } else {

            let numberOfDiagonalRightToLeft = 1; // for Rith to left condition. Value one is given as current cell will already pass the test

            let minColumnCheckRightToLeft = column <= 3 ? 0 : (column - 3); //only need to check max 3 columns on left if available
            let maxColumnCheckRightToLeft = column >= 3 ? 6 : (column + 3); // only need to check max 3 column on right if available
            let minRowCheckRightToLeft = row <= 3 ? 0 : (row - 3); // only need to check 3 down rows if available
            let maxRowCheckRightToLeft = row >= 3 ? 5 : (row + 3); // only need to check 3 up rows if available of max 5

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

    for (let i = 0; i < 7; i++) {

        if (checkEmptyClass(i, 5)) {
            gameDrawStatus = false;
            break;
        }

    }
    return gameDrawStatus;
}

//function after player wins. to be updated.
function afterWin(coinColor) {

    if (coinColor === "red-coin") {
        alert("player one wins");
    } else {
        alert("player 2 wins");
    }

}

function gameFinish(winnerPlayer) {

    console.log("winner player is " + winnerPlayer);

}