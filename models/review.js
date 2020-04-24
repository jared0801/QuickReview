/*
Review
- body - string
- rating - number
- created - date
- lastEdit - date
- author - object id (ref user)
*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
    body: String,
    rating: Number,
    created: Date,
    lastEdit: Date,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Review', ReviewSchema);