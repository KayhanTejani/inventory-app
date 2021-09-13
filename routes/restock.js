const express = require('express');
const router = express.Router();
const Sale = require('../models/sale.model');
const Product = require('../models/product.model');
const Restock = require('../models/restock.model');
const verifyToken = require('./verifyToken');


router.get('/', verifyToken, async (req, res, next) => {
    let restocks;
    if (!req.query.sort) {
        restocks = await Restock.find((err, findResult) => {
            if (err) {
                const errorMessage = `Error getting Restocks list: ${err}`;
                handleError(errorMessage);
            }
        }).lean().exec();
    }
    else {
        const sortQuery = req.query.sort;
        if (sortQuery == "total-low-high") {
            restocks = await Restock.find((err, findResult) => {
                if (err) {
                    const errorMessage = `Error sorting products list: ${err}`;
                    handleError(errorMessage, next);
                }
            }).sort({ total: 1 }).lean();
        }
        else if (sortQuery == "total-high-low") {
            restocks = await Restock.find((err, findResult) => {
                if (err) {
                    const errorMessage = `Error sorting products list: ${err}`;
                    handleError(errorMessage, next);
                }
            }).sort({ total: -1 }).lean();
        }
        else {
            restocks = await Restock.find((err, findResult) => {
                if (err) {
                    const errorMessage = `Error sorting products list: ${err}`;
                    handleError(errorMessage, next);
                }
            }).collation({ 'locale': 'en' }).sort({ name: 1 }).lean();
        }
    }

    if (restocks) {
        Product.find((err, findResult) => {
            if (err) {
                const errorMessage = `Error getting Restocks list: ${err}`;
                handleError(errorMessage);
            }
            else {
                res.render("restock/list", {
                    list: restocks,
                    products: findResult
                })
                return;
            }
        }).lean().exec();
    }
});

module.exports = router;