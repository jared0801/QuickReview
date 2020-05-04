/*
Deck
- title - string
- description - string
- author - object id (ref user)
- image: { url: String, public_id: String }
- reviews - [object id (ref review)]
- cards - [object id (ref card)]
- subjects - [{ name: String }]
- avgRating - number
- created - date
- public - boolean
*/
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Review = require('./review');
const Card = require('./card');
const Schema = mongoose.Schema;
const { cloudinary } = require('../cloudinary');

const DeckSchema = new Schema({
    title: String,
    description: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    image: {
        url: String,
        public_id: String
    },
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
    ],
    subjects: [
        {
            type: String,
        }
    ],
    avgRating: { 
        type: Number,
        default: 0
    },
    created: Date,
    public: Boolean
});

DeckSchema.pre('remove', async function() {
    await this.populate('cards').execPopulate();
    // Remove image associated with each card in the deck
    for(const card of this.cards) {
        if(card.image && card.image.public_id) {
            await cloudinary.v2.uploader.destroy(card.image.public_id);
        }
        await card.remove();
    }

    // Remove image associated with this deck
    if(this.image) {
        await cloudinary.v2.uploader.destroy(this.image.public_id);
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

DeckSchema.pre('deleteMany', async function() {
    const decks = await this.model.find(this.getQuery()).populate('cards');
    // Remove image associated with each card in the deck
    for(const deck of decks) {
        for(const card of deck.cards) {
            if(card.image && card.image.public_id) {
                await cloudinary.v2.uploader.destroy(card.image.public_id);
            }
            await card.remove();
        }

        // Remove image associated with this deck
        if(deck.image && deck.image.public_id) {
            await cloudinary.v2.uploader.destroy(deck.image.public_id);
        }

        // Remove cards associated with this deck
        await Card.deleteMany({
            _id: {
                $in: deck.cards
            }
        });
        // Remove reviews associated with this deck
        await Review.deleteMany({
            _id: {
                $in: deck.reviews
            }
        });
    }
});

DeckSchema.plugin(mongoosePaginate);

// Any deck document can call this function
DeckSchema.methods.calculateAvgRating = function() {
    let ratingsTotal = 0;
    if(this.reviews.length) {
        this.reviews.forEach(review => {
            ratingsTotal += review.rating;
        });
        this.avgRating = Math.round((ratingsTotal / this.reviews.length) * 10) / 10;
    } else {
        this.avgRating = ratingsTotal;
    }
    const roundedRating = Math.round(this.avgRating * 2) / 2;
    this.save();
    return roundedRating;
}

module.exports = mongoose.model('Deck', DeckSchema);