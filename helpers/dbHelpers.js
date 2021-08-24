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
        }).sort({ price: 1 }).lean();
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


async function searchItemsName(query, next) {
    const regex = RegExp(".*" + query + ".*", 'i');
    const items = await Product.find({
        "$or": [
            { name: regex },
            { category: regex }
        ]
    }, (err, findResult) => {
        if (err) {
            const errorMessage = `Error seaching products list: ${err}`;
            handleError(errorMessage, next);
        }
    }).lean();
    return items;
}


async function filterItemsList(filter, value, next) {
    switch (filter) {
        case "equals":
            return await Product.find({price: {$eq: value}}, (err, findResult) => {
                if (err) {
                    const errorMessage = `Error filtering products list: ${err}`;
                    handleError(errorMessage, next);
                }
            }).lean();
        case "less-than":
            return await Product.find({price: {$lt: value}}, (err, findResult) => {
                if (err) {
                    const errorMessage = `Error filtering products list: ${err}`;
                    handleError(errorMessage, next);
                }
            }).lean();
        case "less-than-equal":
            return await Product.find({price: {$lte: value}}, (err, findResult) => {
                if (err) {
                    const errorMessage = `Error filtering products list: ${err}`;
                    handleError(errorMessage, next);
                }
            }).lean();
        case "greater-than":
            return await Product.find({price: {$gt: value}}, (err, findResult) => {
                if (err) {
                    const errorMessage = `Error filtering products list: ${err}`;
                    handleError(errorMessage, next);
                }
            }).lean();
        case "greater-than-equal":
            return await Product.find({price: {$gte: value}}, (err, findResult) => {
                if (err) {
                    const errorMessage = `Error filtering products list: ${err}`;
                    handleError(errorMessage, next);
                }
            }).lean();
    }
}

module.exports = {
    getItems,
    sortItemsPrice,
    sortItemsName,
    searchItemsName,
    filterItemsList
}