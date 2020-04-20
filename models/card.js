/*
Card
- front (question) - string
- back (answer) - string
- image - string
*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CardSchema = new Schema({
    question: String,
    answer: String,
    image: String
});

module.exports = mongoose.model('Card', CardSchema);