const Deck = require('../models/deck');
const Card = require('../models/card');
const { ErrorMsg, SuccessMsg } = require('../messages');

const cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: 'quickreview',
    api_key: '672993711515718',
    api_secret: process.env.CLOUDINARY_SECRET
});

module.exports = {
    /* GET decks index /decks */
    async deckIndex(req, res, next) {
        let decks = await Deck.find({});
        res.render('decks/index', { decks });
    },
    /* GET decks new /decks/new */
    deckNew(req, res, next) {
        res.render('decks/new');
    },
    /* POST decks create /decks */
    async deckCreate(req, res, next) {
        req.body.deck.images = [];
        for(const file of req.files) {
            let image = await cloudinary.v2.uploader.upload(file.path);
            // Add image info to req.body.deck
            req.body.deck.images.push({
                url: image.secure_url,
                public_id: image.public_id
            });
        }
        // use req.body.deck to create a new deck
        let deck = await Deck.create(req.body.deck);
        req.session.success = SuccessMsg.DECK_CREATED;
        res.redirect(`/decks/${deck.id}`);
    },
    /* GET decks show /decks/:id */
    async deckShow(req, res, next) {
        try {
            let deck = await Deck.findById(req.params.id);
            let cards = await Card.find({ deck: deck.id });
            res.render('decks/show', { deck, cards });
        } catch(e) {
            throw new Error(ErrorMsg.DECK_NOT_FOUND);
        }
    },
    /* GET decks edit /decks/:id/edit */
    async deckEdit(req, res, next) {
        let deck = await Deck.findById(req.params.id);
        res.render('decks/edit', { deck });
    },
    /* PUT decks update /decks/:id */
    async deckUpdate(req, res, next) {
        // Update the deck with any new properties in req.body.deck
        let deck = await Deck.findByIdAndUpdate(req.params.id, req.body.deck);

        // handle any deletion of existing images
        let deleteImages = req.body.deleteImages;
        if(deleteImages && deleteImages.length) {
            // Loop over each image in deleteImages
            for(const public_id of deleteImages) {
                // Delete image from cloudinary and deck.images
                await cloudinary.v2.uploader.destroy(public_id);
                for(const image of deck.images) {
                    if(image.public_id === public_id) {
                        let index = deck.images.indexOf(image);
                        deck.images.splice(index, 1);
                    }
                }
            }
        }
        // check for any new images to upload
        if(req.files) {
            for(const file of req.files) {
                let image = await cloudinary.v2.uploader.upload(file.path);
                // Add images to deck.images array
                deck.images.push({
                    url: image.secure_url,
                    public_id: image.public_id
                });
            }
        }

        // Save the updated deck to the db
        deck.save();
        
        req.session.success = SuccessMsg.DECK_UPDATED;
        res.redirect(`/decks/${deck.id}`);
    },
    /* DELETE decks destroy /decks/:id */
    async deckDestroy(req, res, next) {
        let deck = await Deck.findById(req.params.id);
        console.log(deck.id);

        // Delete associated deck images
        for(const image of deck.images) {
            await cloudinary.v2.uploader.destroy(image.public_id);
        }

        // Delete associated cards
        let cards = await Card.find({ deck: deck.id });
        for(const card of cards) {
            if(card.image && card.image.public_id) {
                await cloudinary.v2.uploader.destroy(card.image.public_id);
            }
            await card.remove();
        }

        // Delete the deck itself from db
        console.log(deck.remove);
        await deck.remove();
        req.session.success = SuccessMsg.DECK_DELETED;
        res.redirect('/decks');
    }
}