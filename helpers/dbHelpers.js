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


async function sortItemsPrice(query, next) {
    if (query == "price-low-high") {
        const items = await Product.find((err, findResult) => {
            if (err) {
                const errorMessage = `Error sorting products list: ${err}`;
                handleError(errorMessage, next);
            }
        }).sort({price:1}).lean();
        return items;
    }
    const items = await Product.find((err, findResult) => {
        if (err) {
            const errorMessage = `Error sorting products list: ${err}`;
            handleError(errorMessage, next);
        }
    }).sort({ price: -1 }).lean();
    return items
};


async function sortItemsName(next) {
    const items = await Product.find((err, findResult) => {
        if (err) {
            const errorMessage = `Error sorting products list: ${err}`;
            handleError(errorMessage, next);
        }
    }).collation({ 'locale': 'en' }).sort({ name: 1 }).lean();
    return items;
}


module.exports = {
    getItems,
    sortItemsPrice,
    sortItemsName
}