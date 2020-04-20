/*
Deck
- title - string
- description - string
- cards - array of objects ref Card
- reviews - array of objects ref Review
- author - object id (ref user)
*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DeckSchema = new Schema({
    title: String,
    description: String,
    cards: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Card'
        }
    ],
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Deck', DeckSchema);