/*
 * Variables
 */

let openCards = [],
  matchedCards = [],
  firstClick = true,
  rateHTML = '';



const iconsList = ['fa fa-diamond', 'fa fa-diamond', 'fa fa-paper-plane-o', 'fa fa-paper-plane-o', 'fa fa-anchor', 'fa fa-anchor', 'fa fa-bolt', 'fa fa-bolt', 'fa fa-cube', 'fa fa-cube', 'fa fa-leaf', 'fa fa-leaf', 'fa fa-bicycle', 'fa fa-bicycle', 'fa fa-bomb', 'fa fa-bomb'],
  movesContainer = document.querySelector('.moves'),
  message = document.querySelector('.message'),
  rateContainer = document.querySelector('#total_rate');



// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

// Initialize game
function init() {
  const icons = shuffle(iconsList);
  const cardsFragment = document.createDocumentFragment();

  for (let i = 0; i < icons.length; i++) {
    const card = document.createElement('li');
    card.innerHTML = '<i class="' + icons[i] + '"></i>';
    cardsFragment.appendChild(card);
  }
  cardsList.appendChild(cardsFragment);
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
        currentOpenedCards.push(currentCard);
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
      // Use `className` to replace existing classes with the given ones
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
function message() {

  stopTimer();

  // Display the message
  message.style.top = '0';

  // Add moves to modal
  const totalMoves = document.querySelector('#total_moves');
  totalMoves.innerHTML = moves + 1; // + 1 is a workaround because somehow moves returns the count -1

  // Add rating
  rateContainer.innerHTML = rateHTML;

  // Add time to message
  const totalHours = document.querySelector('#totalHours');
  const totalMinutes = document.querySelector('#totalMinutes');
  const totalSeconds = document.querySelector('#totalSeconds');
}

/*
 * Timer [ Start ]
 */
function startTimer() {
  // Start Incrementer
  incrementer = setInterval(function() {
    // Add totalTime by 1
    totalTime += 1;
    // Convert Total Time to H:M:S
    calculateTime(totalTime);
    // Change the current time values
    secondsContainer.innerHTML = seconds;
    minutesContainer.innerHTML = minutes;
    hoursContainer.innerHTML = hours;
  }, 1000);
}

/*
 * Timer [ Calculate Time ]
 */
function calculateTime(totalTime) {
  hours = Math.floor(totalTime / 60 / 60);
  minutes = Math.floor((totalTime / 60) % 60);
  seconds = totalTime % 60;
}

/*
 * Timer [ Stop ]
 */
function stopTimer() {
  // Stop Timer
  clearInterval(incrementer);
}