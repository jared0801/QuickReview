const Deck = require('../models/deck');
const { ErrorMsg, SuccessMsg } = require('../messages');

const { cloudinary } = require('../cloudinary');

module.exports = {
    /* GET decks index /decks */
    async deckIndex(req, res, next) {
        let decks = await Deck.paginate({}, {
            page: req.query.page || 1,
            limit: 10
        });
        res.render('decks/index', { decks, title: 'Decks Index' });
    },
    /* GET decks new /decks/new */
    deckNew(req, res, next) {
        res.render('decks/new');
    },
    /* POST decks create /decks */
    async deckCreate(req, res, next) {
        req.body.deck.images = [];
        for(const file of req.files) {
            // Add image info to req.body.deck
            req.body.deck.images.push({
                url: file.secure_url,
                public_id: file.public_id
            });
        }
        try {
            req.body.deck.author = req.user._id;
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
            const roundedAvgRating = deck.calculateAvgRating();
            //let cards = await Card.find({ deck: deck.id });
            res.render('decks/show', { deck, roundedAvgRating });
        } catch(e) {
            req.session.error = ErrorMsg.DECK_NOT_FOUND;
            res.redirect('/decks');
        }
    },
    /* GET decks edit /decks/:id/edit */
    deckEdit(req, res, next) {
        res.render('decks/edit');
    },
    /* PUT decks update /decks/:id */
    async deckUpdate(req, res, next) {
        try {
            // Update the deck with any new properties in req.body.deck
            //let deck = await Deck.findByIdAndUpdate(req.params.id, req.body.deck);
            // Destructure deck from res.locals
            const { deck } = res.locals;

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
                    // Add images to deck.images array
                    deck.images.push({
                        url: file.secure_url,
                        public_id: file.public_id
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
            //let deck = await Deck.findById(req.params.id);
            const { deck } = res.locals;

            // Delete the deck itself from db
            // cards, images & reviews handled by deck model remove hook
            await deck.remove();
            req.session.success = SuccessMsg.DECK_DELETED;
            res.redirect('/decks');
        } catch(e) {
            console.log(e);
            throw new Error(ErrorMsg.DECK_NOT_DELETED);
        }
    }
}