/*
Card
- front (question) - string
- back (answer) - string
- image - string
- deck - object id (ref Deck)
*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CardSchema = new Schema({
    question: String,
    answer: String,
    image: String,
    deck: {
        type: Schema.Types.ObjectId,
        ref: 'Deck'
    }
});

module.exports = mongoose.model('Card', CardSchema);