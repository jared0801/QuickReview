const cardText = $('#card-display');
const reviewForm = $('#review-form');
const image = $('#image');
const endForm = $('#end-form');
const skipOne = $('#skip-one');
const prevButton = $('#prev');
const nextButton = $('#next');
const backButton = $('#back');
const incorrectCount = $('#incorrect-count');
let qNum = 0;
let correct = 0;
let questionSide = true;

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
    // Clear any image
    image.attr('src', '');
    image.attr('alt', '');
    // Hide appropriate buttons
    if(round < 1) prevButton.hide();
    else prevButton.show();
    if(round >= deck.length-1) nextButton.hide();
    else nextButton.show();
    if(round === deck.length-1) backButton.show();
    else backButton.hide();

    if(round >= deck.length && reviewForm.is(':visible')) {
        // Deck is finished, display results
        reviewForm.hide();
        endForm.show();
        if(correct >= deck.length / 2)
            endForm.prepend(`<div class="alert alert-success">You scored ${correct} / ${deck.length} with ${incorrect} incorrect attempts.</div>`);
        else
            endForm.prepend(`<div class="alert alert-danger">You scored ${correct} / ${deck.length} with ${incorrect} incorrect attempts.</div>`);
        return;
    } else {
        // Change the interface for a new card
        if(deck[round].image && deck[round].image.url) {
            image.attr('src', deck[round].image.url);
            image.attr('alt', deck[round].image.question);
        }
        cardText.text('Front: ' + deck[round].question);
    }
}

function flipCard(deck, round) {
    cardText.addClass('flipInY');
    setTimeout(() => {
        cardText.removeClass('flipInY');
    }, 1000)
    if(questionSide) {
        cardText.text('Back: ' + deck[round].answer);
    } else {
        cardText.text('Front: ' + deck[round].question);
    }
    questionSide = !questionSide;
}


$(document).ready(() => {
    // Shuffle deck
    let shuffled = shuffleDeck(mydeck);
    showCard(shuffled, qNum);

    // Same functionality whether the user clicks submit or hits enter on input
    $('#review-form').click(function() {
        //testGuess(shuffled);
        flipCard(shuffled, qNum);
    });

    $('#review-form').keypress(function(e) {
        if(e.which === 13) { // 13 maps to enter key
            //testGuess(shuffled);
            flipCard(shuffled, qNum);
        }
    });

    nextButton.click(function() {
        showCard(shuffled, ++qNum);
    });
    nextButton.keypress(function(e) {
        if(e.which === 13) { // 13 maps to enter key
            showCard(shuffled, ++qNum);
        }
    });

    prevButton.click(function() {
        showCard(shuffled, --qNum);
    });
    prevButton.keypress(function(e) {
        if(e.which === 13) { // 13 maps to enter key
            showCard(shuffled, --qNum);
        }
    });
});

