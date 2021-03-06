module.exports = {
    CARD_CREATED: "Card created successfully!",
    DECK_CREATED: "Deck created successfully!",
    REVIEW_CREATED: "Review created successfully!",

    CARD_UPDATED: "Card updated successfully!",
    DECK_UPDATED: "Deck updated successfully!",
    REVIEW_UPDATED: "Review updated successfully!",
    
    CARD_DELETED: "Card deleted successfully!",
    DECK_DELETED: "Deck deleted successfully!",
    REVIEW_DELETED: "Review deleted successfully!",

    WELCOME_USER: function(name) {
        return `Welcome to Quick Review, ${name}!`;
    },
    WELCOME_BACK_USER: function(name) {
        return `Welcome back, ${name}!`;
    },
    SUCCESS_EMAIL: function(email) {
        return `An email has been sent to ${email} with further instructions`;
    },

    PROFILE_UPDATED: "Profile updated successfully!",
    PASS_UPDATED: "Password successfully updated!",
}