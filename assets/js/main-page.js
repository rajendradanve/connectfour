$(document).ready(function () {
	let randomCoinHTML = "";
	let randomCoinSize = window.innerWidth * 0.1;
	let windowHeight = window.innerHeight;
	for (let randomCoin = 1; randomCoin <= 5; randomCoin++) {
		randomCoinHTML = randomCoinHTML + `<div id="random-coin-${randomCoin}" class="random-coin"></div>`;
	}
	$("#animation-container").append(randomCoinHTML);
	$(".random-coin").css("width", randomCoinSize);
	$(".random-coin").css("height", randomCoinSize);
	$(".random-coin").css("top", -randomCoinSize * 2);
});

function humanOpponentRedirect(){

    redirectToGamePage("Human");

}

function computerOpponentRedirect(){
    redirectToGamePage("Computer");
}

function redirectToGamePage(player2) {
	//getting selected 2nd player values for radio button
	let url = "game.html?player2=" + encodeURIComponent(player2);
	window.location.href = url;
}