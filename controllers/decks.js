const Deck = require('../models/deck');
const { ErrorMsg, SuccessMsg } = require('../messages');

const { cloudinary } = require('../cloudinary');
//{ $or: [ { public: true }, { public: { $exists: false } }] }

module.exports = {
    /* GET decks index /decks */
    async deckIndex(req, res, next) {
        const { publicDbQuery } = res.locals;
        delete res.locals.publicDbQuery;
        let decks = await Deck.paginate(publicDbQuery, {
            page: req.query.page || 1,
            limit: 12,
            sort: '-created'
        });
        if(!decks.docs.length && res.locals.query) {
            res.locals.error = "No decks were found. Try more general search parameters.";
        }
        res.render('decks/index', { decks, title: 'Deck List' });
    },
    /* GET decks index /decks */
    async deckMine(req, res, next) {
        const author = req.user._id;
        const { privateDbQuery } = res.locals;
        delete res.locals.privateDbQuery;
        const query = [
            privateDbQuery,
            { author }
        ];
        let decks = await Deck.paginate({ $and: query }, {
            page: req.query.page || 1,
            limit: 10,
            sort: '-created'
        });
        if(!decks.docs.length && res.locals.query) {
            res.locals.error = "No results match that query.";
        }
        res.render('decks/index', { decks, title: 'My Decks', private: true });
    },
    /* GET decks new /decks/new */
    deckNew(req, res, next) {
        res.render('decks/new', { title: 'Create a Deck' });
    },
    /* POST decks create /decks */
    async deckCreate(req, res, next) {
        if(req.file) {
            const { url, public_id } = req.file;
            req.body.deck.image = { url, public_id };
        }
        try {
            if(req.body.deck.subjects && req.body.deck.subjects.length) {
                req.body.deck.subjects = req.body.deck.subjects.split(',').map(str => str.trim());
            }
            req.body.deck.author = req.user._id;
            req.body.deck.created = new Date();
            if(req.body.accessRadio === 'public') req.body.deck.public = true;
            else req.body.deck.public = false;

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
    /* GET decks show /decks/:id/test */
    async deckTest(req, res, next) {
        try {
            let deck = await Deck.findById(req.params.id).populate('cards');
            const roundedAvgRating = deck.calculateAvgRating();
            //let cards = await Card.find({ deck: deck.id });
            res.render('decks/test', { deck, roundedAvgRating });
        } catch(e) {
            req.session.error = ErrorMsg.DECK_NOT_FOUND;
            res.redirect('/decks');
        }
    },
    /* GET decks show /decks/:id/review */
    async deckReview(req, res, next) {
        try {
            let deck = await Deck.findById(req.params.id).populate('cards');
            //let cards = await Card.find({ deck: deck.id });
            res.render('decks/review', { deck });
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

            if(req.file || req.body.deleteImage) {
                // Delete existing image
                if(deck.image.public_id) {
                    await cloudinary.v2.uploader.destroy(deck.image.public_id);
                    deck.image = null;
                }
            }

            // Update deck's public/private status
            if(req.body.accessRadio === 'public') deck.public = true;
            else deck.public = false;

            // Update any subject changes
            if(req.body.deck.subjects && req.body.deck.subjects.length) {
                deck.subjects = req.body.deck.subjects.split(',').map(str => str.trim());
            }

            // check for any new images to upload
            if(req.file) {
                const { url, public_id } = req.file;
                // Add image to deck.images array
                deck.image = {
                    url,
                    public_id
                }
            }

            // Save the updated deck to the db
            await deck.save();
            
            req.session.success = SuccessMsg.DECK_UPDATED;
            res.redirect(`/decks/${deck.id}`);
        } catch(e) {
            console.log(e);
            throw new Error(ErrorMsg.DECK_NOT_UPDATED);
        }
    },
    /* DELETE decks destroy /decks/:id */
    async deckDestroy(req, res, next) {
        try {
            //let deck = await Deck.findById(req.params.id);
            const { deck } = res.locals;

            // Delete the deck itself from db
            // cards, image & reviews handled by deck model remove hook
            await deck.remove();
            req.session.success = SuccessMsg.DECK_DELETED;
            res.redirect('/decks');
        } catch(e) {
            console.log(e);
            throw new Error(ErrorMsg.DECK_NOT_DELETED);
        }
    }
}