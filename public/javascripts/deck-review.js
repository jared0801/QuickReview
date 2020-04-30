const cardText = $('#card-display');
const reviewForm = $('.review-form');
const image = $('#image');
const cardSide = $('#card-side-icon');
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
        // Show question & image for a given round
        if(deck[round].image && deck[round].image.url) {
            image.attr('src', deck[round].image.url);
            image.attr('alt', deck[round].image.question);
        }
        cardText.text(deck[round].question);
        cardSide.text('Q');
        questionSide = true;
    }
    
}

function flipCard(deck, round) {
    reviewForm.addClass('flipOutY');
    setTimeout(() => {
        reviewForm.removeClass('flipOutY');
        reviewForm.addClass('flipInY');
        if(questionSide) {
            cardText.text(deck[round].answer);
            cardSide.text('A');
        } else {
            cardText.text(deck[round].question);
            cardSide.text('Q');
        }
        questionSide = !questionSide;
    }, 500);
}


$(document).ready(() => {
    // Shuffle deck
    let shuffled = shuffleDeck(mydeck);
    showCard(shuffled, qNum);

    // Same functionality whether the user clicks submit or hits enter on input
    reviewForm.click(function() {
        //testGuess(shuffled);
        flipCard(shuffled, qNum);
    });

    reviewForm.keypress(function(e) {
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

