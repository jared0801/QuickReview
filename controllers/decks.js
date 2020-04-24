const Deck = require('../models/deck');
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
        try {
            // use req.body.deck to create a new deck
            let deck = await Deck.create(req.body.deck);
            req.session.success = SuccessMsg.DECK_CREATED;
            res.redirect(`/decks/${deck.id}`);
        } catch(e) {
            throw new Error(ErrorMsg.DECK_NOT_CREATED);
        }
    },
    /* GET decks show /decks/:id */
    async deckShow(req, res, next) {
        try {
            let deck = await Deck.findById(req.params.id).populate({
                path: 'reviews',
                options: { sort: { '_id': -1 }}, // descending order
                populate: {
                    path: 'author',
                    model: 'User'
                }
            }).populate('cards');
            //let cards = await Card.find({ deck: deck.id });
            res.render('decks/show', { deck });
        } catch(e) {
            req.session.error = ErrorMsg.DECK_NOT_FOUND;
            res.redirect('/decks');
        }
    },
    /* GET decks edit /decks/:id/edit */
    async deckEdit(req, res, next) {
        try {
            let deck = await Deck.findById(req.params.id);
            res.render('decks/edit', { deck });
        } catch(e) {
            throw new Error(ErrorMsg.CARD_NOT_FOUND);
        }
    },
    /* PUT decks update /decks/:id */
    async deckUpdate(req, res, next) {
        try {
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
        } catch(e) {
            throw new Error(ErrorMsg.DECK_NOT_UPDATED);
        }
    },
    /* DELETE decks destroy /decks/:id */
    async deckDestroy(req, res, next) {
        try {
            let deck = await Deck.findById(req.params.id);

            // Delete associated deck images
            for(const image of deck.images) {
                await cloudinary.v2.uploader.destroy(image.public_id);
            }

            // Delete the deck itself from db
            // cards & reviews handled by deck model remove hook
            await deck.remove();
            req.session.success = SuccessMsg.DECK_DELETED;
            res.redirect('/decks');
        } catch(e) {
            console.log(e);
            throw new Error(ErrorMsg.DECK_NOT_DELETED);
        }
    }
}