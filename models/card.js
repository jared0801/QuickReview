/*
Card
- front (question) - string
- back (answer) - string
- image - { url: String, public_id: String }
*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CardSchema = new Schema({
    question: String,
    answer: String,
    image: {
        url: String,
        public_id: String
    }
});

module.exports = mongoose.model('Card', CardSchema);