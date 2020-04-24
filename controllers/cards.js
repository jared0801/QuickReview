const Deck = require('../models/deck');
const Card = require('../models/card');
const { ErrorMsg, SuccessMsg } = require('../messages');
const { cloudinary } = require('../cloudinary');

module.exports = {
    /* GET cards new /decks/:id/cards/new */
    cardNew(req, res, next) {
        res.render('cards/new', { deckId: req.params.id });
    },
    /* POST cards create /decks/:id/cards */
    async cardCreate(req, res, next) {
        try {
            let deck = await Deck.findById(req.params.id);
            if(req.files && req.files.length) {
                const file = req.files[0];
                // Add image info to req.body.card
                req.body.card.image = {
                    url: file.secure_url,
                    public_id: file.public_id
                };
            }
            // Add deck info to req.body.card
            //req.body.card.deck = req.params.id;
            // use req.body.card to create a new card
            let card = await Card.create(req.body.card);
            // associated this card with its deck
            deck.cards.push(card);
            deck.save();

            req.session.success = SuccessMsg.CARD_CREATED;
            res.redirect(`/decks/${deck.id}`);
        } catch(e) {
            throw new Error(ErrorMsg.CARD_NOT_CREATED);
        }
    },
    /* GET cards edit /decks/:id/cards/:card_id/edit */
    async cardEdit(req, res, next) {
        try {
            let card = await Card.findById(req.params.card_id);
            res.render('cards/edit', { card, deckId: req.params.id });
        } catch(e) {
            throw new Error(ErrorMsg.CARD_NOT_FOUND);
        }
    },
    /* PUT cards update /decks/:id/cards/:card_id */
    async cardUpdate(req, res, next) {
        try {
            // Update card based on req.body.card
            let card = await Card.findByIdAndUpdate(req.params.card_id, req.body.card);

            if((req.files && req.files.length && card.image.public_id) || 
                req.body.deleteImage) {
                    // Delete old image
                    await cloudinary.v2.uploader.destroy(card.image.public_id);
                    card.image = null;
            }

            if(req.files && req.files.length) {
                // Upload new image
                const file = req.files[0];
                // Add image info to req.body.card
                card.image = {
                    url: file.secure_url,
                    public_id: file.public_id
                };
            }

            // Save changes made to card.image
            card.save();
            req.session.success = SuccessMsg.CARD_UPDATED;

            res.redirect(`/decks/${req.params.id}`);
        } catch(e) {
            throw new Error(ErrorMsg.CARD_NOT_UPDATED);
        }
    },
    /* DELETE cards destroy /decks/:id/cards/:card_id */
    async cardDestroy(req, res, next) {
        try {
            try {
                // Remove this card from it's deck's cards array
                await Deck.findByIdAndUpdate(req.params.id, {
                    $pull: { cards: req.params.card_id }
                });
            } catch(e) {
                throw new Error(ErrorMsg.DECK_NOT_FOUND);
            }
            let card = await Card.findById(req.params.card_id);

            // Delete image associated with this card
            if(card.image && card.image.public_id) {
                await cloudinary.v2.uploader.destroy(card.image.public_id);
            }
            await card.remove();
            
            req.session.success = SuccessMsg.CARD_DELETED;
            res.redirect(`/decks/${req.params.id}`);
        } catch(e) {
            throw new Error(ErrorMsg.CARD_NOT_DELETED);
        }
    }
}