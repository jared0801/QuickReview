const faker = require('faker')
const Deck = require('./models/deck');

async function seedDecks() {
    // Remove posts
    await Deck.deleteMany({});
    for(let i = 0; i < 40; i++) {
        const deck = {
            title: faker.lorem.word(),
            description: faker.lorem.text(),
            author: '5ea20cb41942fb1580f1b227'
        }
        await Deck.create(deck);
    }
    console.log('40 new decks created.');
}

module.exports = seedDecks;