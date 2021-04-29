$(document).ready(function(){

let randomCoinSize = window.innerWidth * 0.1;
let windowHeight = window.innerHeight;

$(".random-coin").css("width", randomCoinSize);
$(".random-coin").css("height", randomCoinSize);
$(".random-coin").css("top", -randomCoinSize);

setInterval(coinBackGroundAnimation, 5000);


})

function coinBackGroundAnimation(){

    $(".random-coin").animate({top: `${window.innerHeight}`}, 5000).fadeOut().animate({top: `-100`}).fadeIn();

   /* let endBottomPosition = windowHeight + randomCoinSize ;

    for(let i= -randomCoinSize; i<=endBottomPosition; i+=20){
    $(".random-coin").animate({top: `${i}`});
} */

}




