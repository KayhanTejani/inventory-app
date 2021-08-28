const mongoose = require('mongoose');

let saleSchema = new mongoose.Schema({
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
    discount: {
        type: Number
    },
    total: {
        type: Number
    }
});

module.exports = mongoose.model('Sale', saleSchema);
