$(document).ready(function () {

    let randomCoinSize = window.innerWidth * 0.1;
    let windowHeight = window.innerHeight;

    $(".random-coin").css("width", randomCoinSize);
    $(".random-coin").css("height", randomCoinSize);
    $(".random-coin").css("top", -randomCoinSize * 2);

})


function redirectToGamePage() {

    //getting selected 2nd player values for radio button
    
    let player2 = $("input[name='player-2']:checked").val();

    let url = "connect-four.html?player2=" + encodeURIComponent(player2);

    window.location.href = url;

}