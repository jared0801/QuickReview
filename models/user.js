/*
User
- email - string
- password - string
- username - string
- image - { url: String, public_id: String }
- decks - array of objects ref Deck
- reviews - array of objects ref Review
*/

const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: String,
    image: {
        url: String,
        public_id: String
    },
    decks: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Deck'
        }
    ]
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);