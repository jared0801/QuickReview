const Deck = require('../models/deck');
const Card = require('../models/card');

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
        // use req.body to create a new deck
        let deck = await Deck.create(req.body.deck);
        res.redirect(`/decks/${deck.id}`);
    },
    /* GET decks show /decks/:id */
    async deckShow(req, res, next) {
        let deck = await Deck.findById(req.params.id);
        let cards = await Card.find({ deck: deck.id });
        res.render('decks/show', { deck, cards });
    },
    /* GET decks edit /decks/:id/edit */
    async deckEdit(req, res, next) {
        let deck = await Deck.findById(req.params.id);
        res.render('decks/edit', { deck });
    },
    /* PUT decks update /decks/:id */
    async deckUpdate(req, res, next) {
        let deck = await Deck.findByIdAndUpdate(req.params.id, req.body.deck);
        res.redirect(`/decks/${deck.id}`);
    },
    /* DELETE decks destroy /decks/:id */
    async deckDestroy(req, res, next) {
        await Deck.findByIdAndDelete(req.params.id);
        res.redirect('/decks');
    }
}