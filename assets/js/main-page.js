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
        $(`#random-coin-${i}`).animate({top: `${window.innerHeight}`}, (2000+i*1000)).fadeOut().animate({top: `-100`}).fadeIn();
    }

}




