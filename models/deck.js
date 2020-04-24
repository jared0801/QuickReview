/*
Deck
- title - string
- description - string
- author - object id (ref user)
- images: [{ url: String, public_id: String }]
*/
const mongoose = require('mongoose');
const Review = require('./review');
const Card = require('./card');
const Schema = mongoose.Schema;

const cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: 'quickreview',
    api_key: '672993711515718',
    api_secret: process.env.CLOUDINARY_SECRET
});

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
    ],
	reviews: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Review'
		}
	],
	cards: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Card'
		}
	]
});

DeckSchema.pre('remove', async function() {
    await this.populate('cards').execPopulate();
    // Remove images associated with each card in the deck
    for(const card of this.cards) {
        if(card.image && card.image.public_id) {
            await cloudinary.v2.uploader.destroy(card.image.public_id);
        }
        await card.remove();
    }
    // Remove cards associated with this deck
    await Card.deleteMany({
        _id: {
            $in: this.cards
        }
    });
    // Remove reviews associated with this deck
    await Review.deleteMany({
        _id: {
            $in: this.reviews
        }
    });
});

module.exports = mongoose.model('Deck', DeckSchema);