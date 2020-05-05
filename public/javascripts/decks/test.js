const questionDisplay = $('#question');
const wrongAnswer = $('#incorrect-display');
const rightAnswer = $('#correct-display');
const ansInput = $('#ans-input');
const image = $('#image');
const testForm = $('#test-form');
const endForm = $('#end-form');
const skipOne = $('#skip-one');
const audioState = $('#audioState');
const successAudio = $('#successAudio');
const successAudioSrc = successAudio[0];
const successAudioState = $('#successAudioState');
const failureAudio = $('#failureAudio');
const failureAudioSrc = failureAudio[0];
const failureAudioState = $('#failureAudioState');
const incorrectCount = $('#incorrect-count');
const flipWarning = $('#flipWarning');
const flipWarningButton = $('#flipWarningButton');
const animationState = $('#animationState');
let animation = true;
let ans = '';
let qNum = 0;
let correct = 0;
let incorrect = 0;
let consecutiveFail = 0;

// Copies an array (deck), randomly shuffles it, then returns it
function shuffleDeck(deck, flipped=false) {
    // Reinit stats
    correct = 0;
    incorrect = 0;
    consecutiveFail = 0;
    qNum = 0;
    rightAnswer.removeClass('show');
    wrongAnswer.removeClass('show');
    incorrectCount.removeClass('show');
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
    // Clear any old image
    image.attr('src', '');
    image.attr('alt', '');
    // Clear & focus input
    ansInput.val('');
    ansInput.focus();
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
        playAudio(successAudioSrc);
        rightAnswer.addClass('show');
        // Display congrats message for 2s
        setTimeout(() => {
            rightAnswer.removeClass('show');
        }, 2000);
        // Clear input and move to the next card
        wrongAnswer.removeClass('show');
        wrongAnswer.removeClass('shake');
        qNum++;
        correct++;
        showCard(deck, qNum);
    } else {
        // User guessed incorrectly
        playAudio(failureAudioSrc);
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
                wrongAnswer.removeClass('shake');
            });
        }
        // Show total # incorrect guesses in top right
        incorrectCount.addClass('show');
        if(animation) {
            incorrectCount.html(`<small><div class="animated fadeInUp">${incorrect}</div> incorrect</small>`);
        } else {
            incorrectCount.html(`<small><div>${incorrect}</div> incorrect</small>`);
        }
    }
}

// Helper function makes sure the audio always restarts when needed
function playAudio(audioSrc) {
    if(audioSrc.paused) {
        audioSrc.play();
    } else {
        audioSrc.currentTime = 0;
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

    ansInput.keypress(function(e) {
        if(e.which === 13) { // 13 maps to enter key
            testGuess(shuffled);
        }
    });

    successAudioState.change(function() {
        const newFileOgg = `/audio/success/${successAudioState.val()}.ogg`;
        const newFileMp3 = `/audio/success/${successAudioState.val()}.mp3`;
        successAudio.children()[0].src = newFileOgg;
        successAudio.children()[1].src = newFileMp3;
        successAudioSrc.pause();
        successAudioSrc.load();
        successAudio.oncanplaythrough = playAudio(successAudioSrc);
    });

    failureAudioState.change(function() {
        const newFileOgg = `/audio/failure/${failureAudioState.val()}.ogg`;
        const newFileMp3 = `/audio/failure/${failureAudioState.val()}.mp3`;
        failureAudio.children()[0].src = newFileOgg;
        failureAudio.children()[1].src = newFileMp3;
        failureAudioSrc.pause();
        failureAudioSrc.load();
        failureAudio.oncanplaythrough = playAudio(failureAudioSrc);
    });

    audioState.change(function() {
        if(audioState.val() === 'off') {
            failureAudioState.attr('disabled', 'true');
            successAudioState.attr('disabled', 'true');
            failureAudio[0].muted = true;
            successAudio[0].muted = true;
        } else {
            failureAudioState.removeAttr('disabled');
            successAudioState.removeAttr('disabled');
            failureAudio[0].muted = false;
            successAudio[0].muted = false;
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
            animation = false;
        } else {
            $('.not-animated').addClass('animated').removeClass('not-animated');
            animation = true;
        }
    });

    wrongAnswer.click(function() {
        wrongAnswer.removeClass('show');
        wrongAnswer.removeClass('shake');
    });


});

