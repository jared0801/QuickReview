const Card = require('../models/card');

module.exports = {
    /* GET cards new /decks/:id/cards/new */
    cardNew(req, res, next) {
        res.render('cards/new', { deckId: req.params.id });
    },
    /* POST cards create /decks/:id/cards */
    async cardCreate(req, res, next) {
        // Associate the new card with it's deck
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
        let card = await Card.findByIdAndUpdate(req.params.card_id, req.body.card);
        res.redirect(`/decks/${card.deck}`);
    },
    /* DELETE cards destroy /decks/:id/cards/:card_id */
    async cardDestroy(req, res, next) {
        let card = await Card.findByIdAndDelete(req.params.card_id);
        res.redirect(`/decks/${card.deck}`);
    }
}