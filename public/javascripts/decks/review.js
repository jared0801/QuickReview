const cardText = $('#card-display');
const reviewForm = $('.review-form');
const image = $('#image');
const cardSide = $('#card-side-icon');
const endForm = $('#end-form');
const skipOne = $('#skip-one');
const prevButton = $('#prev');
const nextButton = $('#next');
const backButton = $('#back');
const flipWarning = $('#flipWarning');
const flipWarningButton = $('#flipWarningButton');
const animationState = $('#animationState');
let qNum = 0;
let correct = 0;
let questionSide = true;

// Copies an array (deck), randomly shuffles it, then returns it
function shuffleDeck(deck, flipped=false) {
    // Reinitialize stats
    qNum = 0;
    let newDeck;
    if(flipped) {
        newDeck = deck.map(card => {
            return { answer: card.question, question: card.answer, image }
        });
    } else {
        newDeck = [...deck];
    }
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

    // Show question & image for a given round
    if(deck[round].image && deck[round].image.url) {
        image.attr('src', deck[round].image.url);
        image.attr('alt', deck[round].image.question);
    }
    cardText.text(deck[round].question);
    cardSide.text('Q');
    questionSide = true;
    
}

function flipCard(deck, round) {
    let animated = reviewForm.hasClass('animated');
    if(animated) reviewForm.addClass('flipOutY');
    setTimeout(() => {
        if(animated) {
            reviewForm.removeClass('flipOutY');
            reviewForm.addClass('flipInY');
        }
        if(questionSide) {
            cardText.text(deck[round].answer);
            cardSide.text('A');
        } else {
            cardText.text(deck[round].question);
            cardSide.text('Q');
        }
        questionSide = !questionSide;
    }, animated ? 500 : 0);
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
    
    flipWarningButton.click(function() {
        flipWarning.modal('toggle');
        shuffled = shuffleDeck(shuffled, true);
        showCard(shuffled, 0);
    });

    animationState.change(function() {
        if(animationState.val() === 'off') {
            $('.animated').addClass('not-animated').removeClass('animated');
        } else {
            $('.not-animated').addClass('animated').removeClass('not-animated');
        }
    });
});

