const questionDisplay = $('#question');
const wrongAnswer = $('#incorrect-display');
const rightAnswer = $('#correct-display');
const ansInput = $('#ans-input');
const image = $('#image');
const testForm = $('#test-form');
const endForm = $('#end-form');
const skipOne = $('#skip-one');
const incorrectCount = $('#incorrect-count');
let ans = '';
let qNum = 0;
let correct = 0;
let incorrect = 0;
let consecutiveFail = 0;

// Copies an array (deck), randomly shuffles it, then returns it
function shuffleDeck(deck) {
    let newDeck = [...deck];
    for(let i = newDeck.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i+1));
        [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
    }
    return newDeck;
}

// Changes the interface for the user to advance to the next question
function showCard(deck, round) {
    // Clear any old image
    image.attr('src', '');
    image.attr('alt', '');
    if(round >= deck.length && testForm.is(':visible')) {
        // Deck is finished, display results
        testForm.hide();
        endForm.show();
        if(correct >= deck.length / 2)
            endForm.prepend(`<div class="alert alert-success">You scored ${correct} / ${deck.length} with ${incorrect} incorrect attempts.</div>`);
        else
            endForm.prepend(`<div class="alert alert-danger">You scored ${correct} / ${deck.length} with ${incorrect} incorrect attempts.</div>`);
        return;
    } else {
        // Change the interface for a new card
        questionDisplay.text(deck[round].question);
        if(deck[round].image && deck[round].image.url) {
            image.attr('src', deck[round].image.url);
            image.attr('alt', deck[round].image.question);
        }
        ans = deck[round].answer;
    }
}

// Checks whether a guess is correct & if it is, shows the next question
function testGuess(deck) {
    const guess = ansInput.val();
    if(guess === ans) {
        // User guessed correctly
        consecutiveFail = 0;
        rightAnswer.addClass('show');
        // Display congrats message for 2s
        setTimeout(() => {
            rightAnswer.removeClass('show');
        }, 2000);
        // Clear input and move to the next card
        wrongAnswer.removeClass('show');
        ansInput.val('');
        qNum++;
        correct++;
        showCard(deck, qNum);
    } else {
        // User guessed incorrectly
        wrongAnswer.addClass('show');
        wrongAnswer.addClass('shake');
        rightAnswer.removeClass('show');
        incorrect++;
        consecutiveFail++;
        if(consecutiveFail === 4) {
            // Allow the user to skip after more than 3 consecutive fails
            skipOne.addClass('show');
            skipOne.click(function() {
                qNum++;
                showCard(deck, qNum);
                skipOne.removeClass('show');
                consecutiveFail = 0;
                wrongAnswer.removeClass('show');
            });
        }
        // Show total # incorrect guesses in top right
        incorrectCount.addClass('show');
        incorrectCount.html(`<small><div class="animated fadeInUp">${incorrect}</div> incorrect</small>`);
    }
}


$(document).ready(() => {
    // Shuffle deck
    let shuffled = shuffleDeck(mydeck);
    showCard(shuffled, qNum);    

    // Same functionality whether the user clicks submit or hits enter on input
    $('#submit').click(function() {
        testGuess(shuffled);
    });

    $('#ans-input').keypress(function(e) {
        if(e.which === 13) { // 13 maps to enter key
            testGuess(shuffled);
        }
    });
});

