const mongoose = require('mongoose');

let restockSchema = new mongoose.Schema({
    price: {
        type: Number
    },
    quantity: {
        type: Number
    },
    name: {
        type: String
    },
    category: {
        type: String
    },
    completed: {
        type: Boolean
    }
});

module.exports = mongoose.model('Restock', restockSchema);
