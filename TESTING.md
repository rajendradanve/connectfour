### **TESTING

## **HTML
HTML is vallidated using online [HTML Validator](https://validator.w3.org/) tool.
-   **index.html :** Validation showed error that "Element h4 not allowed as child of element label"
    h4 element removed from lable instead <br> is used to show player name bellow icon.
    After this no error shown for the index.html page.
-   **game.html :** Validation showed error that "Attribute type not allowed on element audio at this point".
    Removed "type" attribute from audio element to remove error.


## **CSS
CSS is validated using online [CSS Validator](https://validator.w3.org/) tool.
-   **style.css :**Validation showed error that "scrollbar-width property doesn't exist" and "-ms-overflow-style" is an unknown vendor extension
    This is not removed as this css property is used to hide scrollbar for a page on firefox and EDGE browser for as mention in [this link](https://www.w3schools.com/howto/howto_css_hide_scrollbars.asp)

## **Javascript
Javascript is validated using online [JSHint](https://jshint.com/) tool.
-   **main-page.js :** Received warnings related to use of let and use of $ sign which can be ignored.

-   **game-script.js :** Received warning related to use of let, template literal syntax and use of const which can be ignored.


## **Testing Based on User Stories

### **General player
As aim of the game was to make is simple game with minimal controls and avoid destractions of anykind. 
After testing index.html page, I released that when I use radio button user has to perform one click extra to enter in the game.
To avoid this I changed radio option to buttons which will directly redirect to the game by choosing correct option of 2nd player.
icons are used inside button to provide visual information about with whom user want to play. This also provide better look.

### **Kids
- For kids aim was to have simple and easy screen layout.
  Main page has only 2 buttons with attractive background. One button to enter new game which provides option to choose opponent player. 
  Second button provides instructions about how to play game. It is assumed that parents will explain instructions to the kids who can not read.
  Imagaes provided to show different possibilities of winning the game.
  Game page has 3 buttons and main game layout. Game can be played by only simple left click to the correct row. 
  Maximum available spaced tried to use for game board. 

-   Game with few controls.
    In main page there are 2 main buttons and buttons to choose the player. 
    In game page there are 3 buttons to refresh/restart the game, go to homepage and music toggle button. 
    Game can be played simple left click at the column where user wanted to put Pokeball coin.

-   Game which can be played alone or with a friend/family
    Pokeball connect four is a 2 player game. But option is provided to play against computer. 
    Currently, computer is taking random place to put coin. In future version of the game some more logic can be added to computer moves to make game more challenging.

-   Game to teach strategic thinking
    As basic aim of the game to make strategic moves of the coin to win. Kids will learn to think and observe before taking decision.
    
### **parents
-   Destraction free layout
    Layout is quite simple and aim to increase focus while playing game. At main page some animation added to generate interest. 
    At game page big icons are added and most of the space is used for game board. This page has only 3 controls. 
    Fancy look and animation is avoided. 
    