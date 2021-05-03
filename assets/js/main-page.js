$(document).ready(function(){

let randomCoinSize = window.innerWidth * 0.1;
let windowHeight = window.innerHeight;

$(".random-coin").css("width", randomCoinSize);
$(".random-coin").css("height", randomCoinSize);
$(".random-coin").css("top", -randomCoinSize*2);

$("input").click(function(){
    setPlayer(this);

});

})

function setPlayer(player){

     if($(player).val()==="player-1-computer"){
            
        $("#player-2-computer").attr('disabled', true);
        $(".player-2-computer-label").css('opacity', '.2');
        $("#player-2-human").attr('checked', true);

    }else if($(player).val()==="player-2-computer"){
        
        $("#player-1-computer").attr('disabled', true);
        $(".player-1-computer-label").css('opacity', '.2');
        $("#player-1-human").attr('checked', true);
        
    }else {
        
        $("#player-1-computer").attr('disabled', false);
        $(".player-1-computer-label").css('opacity', '1');
        $("#player-2-computer").attr('disabled', false);
        $(".player-2-computer-label").css('opacity', '1');
         
    }

    return;

      
}

function redirectToGamePage(){

   
    
}




