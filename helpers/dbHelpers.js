const mongoose = require('mongoose');
require('../models/db');

const Product = require('../models/product.model');

function handleError(errorMessage, next) {
    console.error(errorMessage);
    const error = new Error(errorMessage);
    next(error);
}

async function getItems(next) {
    const items = await Product.find((err, findResult) => {
        if (err) {
            const errorMessage = `Error getting products list: ${err}`;
            handleError(errorMessage, next);
        }
    }).lean().exec();

    return items;
}


//     else {
//         Product.find((err, docs) => {
//             if (!err) {
//                 res.render("product/list", {
//                     list: docs
//                 });
//             }
//             else {
//                 console.log("Error while sorting");
//             }
//         }).sort({price:-1}).lean();
//     }
// };

module.exports = {
    getItems
}