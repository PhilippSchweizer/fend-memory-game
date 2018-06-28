/*
 * Variables
 */

let openCards = [],
  matchedCards = [],
  firstClick = true;



const iconsList = ["fa fa-diamond", "fa fa-diamond", "fa fa-paper-plane-o", "fa fa-paper-plane-o", "fa fa-anchor", "fa fa-anchor", "fa fa-bolt", "fa fa-bolt", "fa fa-cube", "fa fa-cube", "fa fa-leaf", "fa fa-leaf", "fa fa-bicycle", "fa fa-bicycle", "fa fa-bomb", "fa fa-bomb"],
  movesContainer = document.querySelector(".moves");



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

// Use css classes to 'turn' a card when clicked

var displayCard = function() {
  this.classList.toggle('open');
  this.classList.toggle('show');
  // this.classList.toggle('disabled');
}




/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */





function cardClick() {
  for (let i = 0; i < cards.length; i++) {

    // Add a "click" event to each card [ The following function will only be executed if a card was clicked! ]
    cards[i].addEventListener("click", function() {

        // Cache the `current` and `previous` clicked cards
        const currentCard = this;
        const previousCard = openCards[0];

        // Start timer if it is the first click
        if (firstClick) {
          startTimer();
          firstClick = false; // Prevent timer to start again after next click
        }

        /*
         * In case one card is already opened, do the following:
         *
         * 1) add css classes which "open" and "lock" (.disabled) the clicked card
         * 2) add the just opened card to the openCards array
         * 3) compare the just opened (i.e. clicked) card with the exisiting in openCards
         * 4) clear openCards array
         * 5) Add a move
         * 6) Adjust rating
         */
        if (openCards.length === 1) {

          // step 1: lock clicked card into open status
          currentCard.className = "open show disabled";

          // step 2: Add this card to the `openCards` array
          openCards.push(currentCard);

          // step 3: Compare the "current" card with the "previous" card
          isMatched(currentCard, previousCard);

          // step 4: Clear openCards array
          openCards = [];

          // step 5: Add one move to move counter
          addMove();

          // step 6: Adjust rating
          rating();
        }
      }
    }
  }

  // Compare the 2 opened cards
  function isMatched(currentCard, previousCard) {

    // Matched?
    if (currentCard.innerHTML === previousCard.innerHTML) {

      // "Lock" cards
      currentCard.className = "show match disabled";
      previousCard.className = "show match disabled";

      // Add Current & Previous card to `matchedCards` array
      matchedCards.push(currentCard, previousCard);

      // Game Over?
      isOver();

    } else {

      //* Put cards back to closed state. Stop timer for 500 milliseconds while doing so.
      setTimeout(function() {
        // Use `className` to replace existing classes with the given ones
        currentCard.className = "open card";
        previousCard.className = "open card";
      }, 500)
    }
  }

  // Add move to move counter

  function addMove() {
    moves++;
    movesContainer.innerHTML = moves;
  }

  /*
   * Game Over?
   */
  function isOver() {
    if (iconsList.length === matchedCards.length) {
      gameOverMessage();
    }
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