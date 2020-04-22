const Card = require('../models/card');
const cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: 'quickreview',
    api_key: '672993711515718',
    api_secret: process.env.CLOUDINARY_SECRET
});

module.exports = {
    /* GET cards new /decks/:id/cards/new */
    cardNew(req, res, next) {
        res.render('cards/new', { deckId: req.params.id });
    },
    /* POST cards create /decks/:id/cards */
    async cardCreate(req, res, next) {
        if(req.files) {
            const file = req.files[0];
            let image = await cloudinary.v2.uploader.upload(file.path);
            // Add image info to req.body.card
            req.body.card.image = {
                url: image.secure_url,
                public_id: image.public_id
            };
        }
        // Add deck info to req.body.card
        req.body.card.deck = req.params.id;
        // use req.body.card to create a new card
        await Card.create(req.body.card);
        res.redirect(`/decks/${req.params.id}`);
    },
    /* GET cards edit /decks/:id/cards/:card_id/edit */
    async cardEdit(req, res, next) {
        let card = await Card.findById(req.params.card_id);
        res.render('cards/edit', { card });
    },
    /* PUT cards update /decks/:id/cards/:card_id */
    async cardUpdate(req, res, next) {
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
            let image = await cloudinary.v2.uploader.upload(file.path);
            // Add image info to req.body.card
            card.image = {
                url: image.secure_url,
                public_id: image.public_id
            };
        }

        // Save changes made to card.image
        card.save();

        res.redirect(`/decks/${card.deck}`);
    },
    /* DELETE cards destroy /decks/:id/cards/:card_id */
    async cardDestroy(req, res, next) {
        let card = await Card.findById(req.params.card_id);
        if(card.image && card.image.public_id) {
            await cloudinary.v2.uploader.destroy(card.image.public_id);
        }
        await card.remove();
        res.redirect(`/decks/${card.deck}`);
    }
}