let numCards = 0;
let anotherOne = document.getElementById('another-card');
let cardForm = document.getElementById('card-form-entry');
function createCard(e) {
    let card = document.createElement('div');
    card.id = `card${numCards}`;

    // Question
    let question = document.createElement('div');
    question.classList.add('form-group');

    let qlabel = document.createElement('label');
    qlabel.htmlFor = `card-question-${numCards}`;
    qlabel.innerText = "Question";

    let qtext = document.createElement('textarea');
    qtext.classList.add('form-control');
    qtext.id = "card-question";
    qtext.required = true;
    qtext.placeholder = "Front (question)";
    qtext.name = `cards[${numCards}][question]`
    question.append(qlabel);
    question.append(qtext);

    
    // Answer
    let answer = document.createElement('div');
    answer.classList.add('form-group');

    let alabel = document.createElement('label');
    alabel.htmlFor = `card-answer-${numCards}`;
    alabel.innerText = "Answer";

    let atext = document.createElement('textarea');
    atext.classList.add('form-control');
    atext.id = "card-answer";
    atext.required = true;
    atext.placeholder = "Back (answer)";
    atext.name = `cards[${numCards}][answer]`
    answer.append(alabel);
    answer.append(atext);

    
    // Image
    let image = document.createElement('div');
    image.classList.add('form-group');

    let ilabel = document.createElement('label');
    ilabel.htmlFor = `card-image-${numCards}`;
    ilabel.innerText = "Image";

    let iinput = document.createElement('input');
    iinput.setAttribute('cardId', numCards);
    iinput.addEventListener('change', function() {
        if(iinput.files.length > 0) {
            let hasImage = document.createElement('input');
            let inputid = iinput.getAttribute('cardId');
            hasImage.name = `cards[${inputid}][image]`;
            hasImage.style = "display: none;";
            card.append(hasImage);
        }
    });
    iinput.classList.add('form-control-file');
    iinput.type = "file";
    iinput.accept = "images/*";
    iinput.id = "card-image";
    iinput.name = 'images';
    let inote = document.createElement('small');
    inote.classList.add(['form-text', 'text-muted']);
    inote.innerText = "Optional";
    image.append(ilabel);
    image.append(iinput);
    image.append(inote);

    //card.append(cardnum);
    // Del button
    if(numCards > 0) {
        let delbtn = document.createElement('button');
        
        delbtn.innerHTML = '<i class="fas fa-times"></i>';
        delbtn.classList.add('btn', 'btn-danger', 'rounded-circle', 'animated', 'fast', 'bounceIn', 'card-form-close');
        delbtn.setAttribute('cardId', numCards);
        delbtn.onclick = function(e) { 
            e.preventDefault();
            numCards--;
            let id = this.getAttribute('cardId');
            let delcard = document.getElementById(`card${id}`);
            delcard.parentNode.removeChild(delcard);
        };
        card.append(delbtn);
    }
    card.append(question);
    card.append(answer);
    card.append(image);
    card.append(document.createElement('br'));
    cardForm.append(card);

    numCards++;
}
createCard();
anotherOne.addEventListener('click', e => {
    e.preventDefault();
    createCard();
});