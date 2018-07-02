// Variables
let openCards = [],
  matchedCards = [],
  firstClick = true,
  rateHTML = '',
  minutes,
  seconds,
  totalTime = 0,
  moves = 0,
  rateStep = 6;


const iconsList = ['fa fa-diamond', 'fa fa-diamond', 'fa fa-paper-plane-o', 'fa fa-paper-plane-o', 'fa fa-anchor', 'fa fa-anchor', 'fa fa-bolt', 'fa fa-bolt', 'fa fa-cube', 'fa fa-cube', 'fa fa-leaf', 'fa fa-leaf', 'fa fa-bicycle', 'fa fa-bicycle', 'fa fa-bomb', 'fa fa-bomb'],
  movesContainer = document.querySelector('.moves'),
  message = document.querySelector('.message'),
  rateContainer = document.querySelector('#total_rate'),
  restartBtn = document.querySelector('.panel .play-again'),
  restartBtnInMessage = document.querySelector('.message .play-again'),
  deck = document.querySelector('.deck'),
  cards = deck.children,
  stars = document.querySelectorAll('.star'),
  secondsContainer = document.querySelector('#seconds'),
  minutesContainer = document.querySelector('#minutes'),
  exactMoves = iconsList.length / 2,
  maxStars = exactMoves + rateStep,
  minStars = exactMoves + (2 * rateStep);



// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

// Initialize game
function init() {
  const icons = shuffle(iconsList);
  const deckFragment = document.createDocumentFragment();

  for (let i = 0; i < icons.length; i++) {
    const card = document.createElement('li');
    card.innerHTML = '<i class="' + icons[i] + '"></i>';
    deckFragment.appendChild(card);
  }
  deck.appendChild(deckFragment);
}

// Start game
function start() {
  init();
  cardClick();
}


function cardClick() {
  for (let i = 0; i < cards.length; i++) {

    // Add a click event to each card
    cards[i].addEventListener('click', function() {

      // Cache the current and previous clicked cards
      const currentCard = this;
      const previousCard = openCards[0];

      // Start timer if it is the first click
      if (firstClick) {
        startTimer();
        firstClick = false; // Prevent timer to start again after next click
      }

      // FIRST CASE: one card is already open
      if (openCards.length === 1) {

        // step 1: lock clicked card into open status
        currentCard.className = 'open show disabled';

        // step 2: Add this card to the openCards array
        openCards.push(currentCard);

        // step 3: Compare the current card with the previous card
        isMatched(currentCard, previousCard);

        // step 4: Clear openCards array
        openCards = [];

        // step 5: Add one move to move counter
        addMove();

        // step 6: Adjust rating
        rating();
      } else {
        currentCard.className = 'show disabled';
        openCards.push(currentCard);
      }
    });
  }
}

// Compare the 2 opened cards
function isMatched(currentCard, previousCard) {

  // Matched?
  if (currentCard.innerHTML === previousCard.innerHTML) {

    // 'Lock' cards
    currentCard.className = 'show match disabled';
    previousCard.className = 'show match disabled';

    // Add Current & Previous card to matchedCards array
    matchedCards.push(currentCard, previousCard);

    // Game Over?
    isOver();

  } else {

    // Put cards back to closed state and stop timer while doing so
    setTimeout(function() {
      currentCard.className = 'open card';
      previousCard.className = 'open card';
    }, 500)
  }
}

// Add move to move counter
function addMove() {
  moves++;
  movesContainer.innerHTML = moves;
}

// Check if game is over
function isOver() {
  if (iconsList.length === matchedCards.length) {
    gameOverMessage();
  }
}

// Display message when game is over
function gameOverMessage() {

  stopTimer();

  // Display the message
  message.style.top = '0';

  // Add moves to message
  const totalMoves = document.querySelector('#total_moves');
  totalMoves.innerHTML = moves + 1; // + 1 is a workaround because somehow moves returns the count -1

  // Add rating
  rateContainer.innerHTML = rateHTML;

  // Add time to message
  // const totalHours = document.querySelector('#totalHours');
  const totalMinutes = document.querySelector('#total_minutes');
  const totalSeconds = document.querySelector('#total_seconds');
  // totalHours.innerHTML = hours;
  totalMinutes.innerHTML = minutes;
  totalSeconds.innerHTML = seconds;
}

// Play again buttons
restartBtn.addEventListener('click', function() {
  restart();
});
restartBtnInMessage.addEventListener('click', function() {
  // Hide the message
  message.style.top = "-150%";
  restart();
});

// Rating
function rating() {

  if (moves < maxStars) {
    rateHTML = "<i class='star fa fa-star'></i><i class='star fa fa-star'></i><i class='star fa fa-star'></i>";
  } else if (moves < minStars) {
    stars[2].style.color = "#444";
    rateHTML = "<i class='star fa fa-star'></i><i class='star fa fa-star'></i>";
  } else {
    stars[1].style.color = "#444";
    rateHTML = "<i class='star fa fa-star'></i>";
  }
}

// Timer [ Start ]
function startTimer() {
  // Start Incrementer
  incrementer = setInterval(function() {
    // Add totalTime by 1
    totalTime += 1;
    // Convert Total Time to M:S
    calculateTime(totalTime);
    // Change the current time values
    secondsContainer.innerHTML = seconds;
    minutesContainer.innerHTML = minutes;
    // hoursContainer.innerHTML = hours;
  }, 1000);
}

// Timer [ Calculate Time ]
function calculateTime(totalTime) {
  // hours = Math.floor(totalTime / 60 / 60);
  minutes = Math.floor((totalTime / 60) % 60);
  seconds = totalTime % 60;
}

// Timer [ Stop ]
function stopTimer() {
  // Stop Timer
  clearInterval(incrementer);
}

// Reset deck
function resetValues() {
  matchedCards = [];
  openCards = [];
  moves = 0;
  movesContainer.innerHTML = '--';
  stars[1].style.color = "#ffb400";
  stars[2].style.color = "#ffb400";
  rateHTML = '';
  minutesContainer.innerHTML = '00';
  secondsContainer.innerHTML = '00';
  stopTimer();
  firstClick = true;
  totalTime = 0;
  minutes = 0;
  seconds = 0;
}

// Restart function
function restart() {

  // Remove all cards
  deck.innerHTML = '';

  // Reset Current Values
  resetValues();

  // Start the game again
  start();
}


// Start the game for the first time!
start();