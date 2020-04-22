/*
Deck
- title - string
- description - string
- author - object id (ref user)
- images: [{ url: String, public_id: String }]
*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DeckSchema = new Schema({
    title: String,
    description: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    images: [
        {
            url: String,
            public_id: String
        }
    ]
});

module.exports = mongoose.model('Deck', DeckSchema);