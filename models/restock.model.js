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
    total: {
        type: Number
    },
    status: {
        type: String
    }
});

module.exports = mongoose.model('Restock', restockSchema);
