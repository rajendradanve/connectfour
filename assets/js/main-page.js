$(document).ready(function(){

let randomCoinSize = window.innerWidth * 0.1;
let windowHeight = window.innerHeight;

$(".random-coin").css("width", randomCoinSize);
$(".random-coin").css("height", randomCoinSize);
$(".random-coin").css("top", -randomCoinSize*2);

$("input").click(function(){

    if($(this).val()==="player-1-computer"){

        $("#player-2-computer").attr('disabled', true);
        $("#player-2-computer").attr('checked', false);

    }else if($(this).val()==="player-2-computer"){
        
        $("#player-1-computer").attr('disabled', true);
        $("#player-1-computer").attr('checked', false);
        
    }else if($(this).val()==="player-1-human" || $(this).val()==="player-2-human" ) {
        $("#player-1-computer").attr('disabled', false);
         $("#player-2-computer").attr('disabled', false);
    }

});


})

function redirectToGamePage(){
    
}




