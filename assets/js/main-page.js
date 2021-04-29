$(document).ready(function(){

let randomCoinSize = window.innerWidth * 0.1;
let windowHeight = window.innerHeight;

$(".random-coin").css("width", randomCoinSize);
$(".random-coin").css("height", randomCoinSize);
$(".random-coin").css("top", -randomCoinSize*2);
setInterval(coinBackGroundAnimation, 1000);
})

function coinBackGroundAnimation(){

    for(let i=1; i<=5;i++){
        $(`#random-coin-${i}`).animate({top: `${window.innerHeight}`}, (Math.random()*5000+2000)).fadeOut().animate({top: `-100`}).fadeIn();
    }

    //$(".random-coin").animate({top: `${window.innerHeight}`}, 5000).fadeOut().animate({top: `-100`}).fadeIn();

   /* let endBottomPosition = windowHeight + randomCoinSize ;

    for(let i= -randomCoinSize; i<=endBottomPosition; i+=20){
    $(".random-coin").animate({top: `${i}`});
} */

}




