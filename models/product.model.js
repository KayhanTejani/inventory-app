const mongoose = require('mongoose');

let productSchema = new mongoose.Schema({
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
    }
});

module.exports = mongoose.model('Product', productSchema);
