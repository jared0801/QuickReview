/*
User
- email - string
- password - string
- username - string
- image - { url: String, public_id: String }
- resetPasswordToke - string
- resetPasswordExpires - date

Note: passportLocalMongoose handles username annd password fields
*/

const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: { type: String, unique: true, required: true },
    image: {
        url: {
            type: String,
            default: '/images/default-profile.jpg'
        },
        public_id: String
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);