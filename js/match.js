document.querySelector('.deck').addEventListener("click", clickFunction);
document.querySelector('#resetButton').addEventListener("click", restart);
document.querySelector('.close').addEventListener("click",closeFunction);
document.querySelector('.again').addEventListener("click",closeAndRestart);

// card images
let images = ["img\\silhouette.svg", "img\\apple.svg", "img\\bird.svg", "img\\butterfly.svg", 
"img\\car.svg", "img\\cat.svg", "img\\tree.svg", "img\\house.svg"];
images = images.concat(images);

// variables
let cards = document.querySelectorAll('div.back');
let i=0, turns=0, matches=0, start=0;
let firstCard = null;
let secondCard = null;
let timeVar = null;
let time = 0;

// shuffle cards 
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  while (0 !== currentIndex) {
  	randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
    }
    return array;
}

// returns game board to zero, calls to shuffle cards
function init(){
	document.querySelector("#rating").src = "img/star/star.svg";		
	i = turns = matches = start = time = 0;
	firstCard = secondCard = timeVar = null;

	images = shuffle(images);
	for (i; i<cards.length; i++){
		cards[i].innerHTML = `<img class="images" src="${images[i]}">`;
	}	
}

// restart game 
function restart(){
	if(timeVar){
		clearInterval(timeVar);	
	}

	document.querySelector('#moves').textContent = "Moves 0";
	document.querySelector('#time').textContent = "Time 00:00";

	let changeFlipped = document.querySelectorAll('.flipped');
	for(let flip of changeFlipped){
		flip.classList.toggle('flipped');
	}
	setTimeout(init,600);	
}

// creates congraduations modal
function createModal(){
	document.querySelector('.modal').style.display = 'block';
	document.querySelector('#endRating').src = document.querySelector('#rating').src;
	let str = document.querySelector('#moves').textContent;
	str = str + "        " + document.querySelector('#time').textContent;
	document.querySelector('.moveEnd').textContent = str;
}

// closes congraduations modal
function closeFunction(){
	document.querySelector('.modal').style.display = "none";
}

function closeAndRestart(){
	closeFunction();
	restart();
}

// called when game is over, eigth matches
function gameover(){
	clearInterval(timeVar);
	checkRating(retrieveTime());
	createModal();
}

// checks the star rating for the player: player scores 100% by reaching 8 matches
// in 30 seconds with 12 turns.  Program set to check star rating every 10 seconds
// and at end of game.  Weight 60% # of matches, 15% time spent and 25% # of turns.
function checkRating(elapse){
	let score = 0.15*(150-elapse)/120 + 0.25*(28-turns)/16 + 0.6*matches/8;

	if(score < 0.55)
		document.querySelector('#rating').src = "img/star/starHalf.svg";
	else if(score < 0.60)
		document.querySelector('#rating').src = "img/star/starOne.svg";
	else if(score >= 0.60 && score < 0.65)
		document.querySelector('#rating').src = "img/star/starOneHalf.svg";
	else if(score >= 0.65 && score < 0.70)
		document.querySelector('#rating').src = "img/star/starTwo.svg";
	else if(score >= 0.70 && score < 0.75)
		document.querySelector('#rating').src = "img/star/starTwoHalf.svg";
	else if(score >= 0.75 && score < 0.80)
		document.querySelector('#rating').src = "img/star/starThree.svg";
	else if(score >= 0.80 && score < 0.85)
		document.querySelector('#rating').src = "img/star/starThreeHalf.svg";
	else if(score >= 0.85 && score < 0.90)
		document.querySelector('#rating').src = "img/star/starFour.svg";
	else if(score >= 0.90 && score < 0.95)
		document.querySelector('#rating').src = "img/star/starFourHalf.svg";
	else if(score >= 0.95)
		document.querySelector('#rating').src = "img/star/starFive.svg";	
}

// returns time in seconds
function retrieveTime(){
	let t = (new Date().getTime() - time) / 1000;
	 return Math.trunc(t);	
}

// calcuates how long game has be running
function addTime(){
	t = retrieveTime();
	let seconds = t % 60;
	let minutes = (t-seconds)/60;

	let str = ""
	if(seconds < 10){
		str = ":0" + seconds;
	}
	else{
		str = ":" + seconds;
	}
	
	if(minutes<10){
		str = "Time 0" + minutes + str;		
	}
	else{
		str = "Time " + minutes + seconds;
	}
	document.querySelector('#time').textContent = str;

	// checks star rating every 10 seconds
	let rem = t % 10;
	if(rem == 0){
		checkRating(t);
	}	
}

function resetCards(){
	firstCard = secondCard = null;
}

// flips back all unmatched cards back
function flipBackUnmatched(){
	if(firstCard.querySelector('.images').classList.contains('unmatched')){
		firstCard.classList.toggle('flipped');
		secondCard.classList.toggle('flipped');
		firstCard.querySelector('.images').classList.toggle('unmatched');
		secondCard.querySelector('.images').classList.toggle('unmatched');
	}
	setTimeout(resetCards,300);
}

// checks for matched or unmatched cards, increments turns taken
function checkForMatch(){
	turns++;
	document.querySelector('#moves').textContent = "Moves " + turns;
	if(firstCard.innerHTML == secondCard.innerHTML){
		firstCard.querySelector('.images').classList.toggle('matched');
		secondCard.querySelector('.images').classList.toggle('matched');
		matches++;

	}
	else{
		firstCard.querySelector('.images').classList.toggle('unmatched');
		secondCard.querySelector('.images').classList.toggle('unmatched');	
	}

	if(matches == 8){
		gameover();
	}
	else{
		setTimeout(flipBackUnmatched,300);
	}	
}

// checks selection is card, if card selected is flipped, if there are two cards
// flipped that havent been checked for matching condition
function clickFunction(event) {
	if(!firstCard || !secondCard){
		let node = event.target;
		// go up DOM tree to card div but stop if BODY reached
		while(!node.classList.contains('card') && node.nodeName != "BODY"){
			node = node.parentNode;
		}
		// condition meet for card not being filled or click outside of card (ie deck background)
		if(!node.classList.contains('flipped') && node.nodeName != "BODY"){
			// if first card flipped start timmer
			if(start == 0){
				start++;
				time = new Date().getTime();
				timeVar = setInterval(addTime,1000);
			}
			// set first card
			if(!firstCard){
				firstCard = node;
				firstCard.classList.toggle('flipped');
			}
			// set second card and call to check for match
			else{
				secondCard = node;
				secondCard.classList.toggle('flipped');
				setTimeout(checkForMatch,300);
			}
		}	
	}
}	

init();