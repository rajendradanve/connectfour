$(document).ready(function(){

    let randomCoinSize = window.innerWidth * 0.1;
let windowHeight = window.innerHeight;

$(".random-coin").css("width", randomCoinSize);
$(".random-coin").css("height", randomCoinSize);
$(".random-coin").css("top", -randomCoinSize);

let endBottomPosition = windowHeight + randomCoinSize ;

for(let i= -randomCoinSize; i<=endBottomPosition; i+=20){
    $(".random-coin").animate({top: `${i}`});
}
})


