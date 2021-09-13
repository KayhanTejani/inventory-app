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


router.get('/new', verifyToken, (req, res) => {
    const productName = req.query.product;
    console.log(productName);
    Product.find( {name: productName}, (err, findResult) => {
        if (err) {
            const errorMessage = `Error getting sales list: ${err}`;
            handleError(errorMessage);
        }
        else {
            res.render("restock/addOrEdit", {
                viewTitle: "Create Restock Entry",
                product: findResult[0]
            });
        }
    }).lean().exec();
});


router.post('/new', (req, res) => {
    insertRecord(req, res);

    // if (req.body._id == "")
    //     insertRecord(req, res);
    // else
    //     updateRecord(req, res);
});


function insertRecord(req, res) {
    const restock = new Restock({
        name: req.body.name,
        price: req.body.price,
        quantity: req.body.quantity,
        category: req.body.category,
        total: req.body.total,
        status: "Processing"
    });

    // Product.findByIdAndUpdate({ _id: req.body._id }, { $inc: { quantity: -req.body.quantity } }, { new: true }, (err, findResult) => {
    //     if (err) {
    //         console.log("Could not update product quantity");
    //     }
    // })

    restock.save((err, doc) => {
        if (!err) {
            res.redirect('/restock');
        }
        else {
            console.log('Error during restock record insertion: ' + err);
        }
    });
}


router.get('/complete/:name/:quantity', verifyToken, (req, res) => {
    Product.findOneAndUpdate({name: req.params.name}, { $inc: { quantity: req.params.quantity } }, { new: true }, (err, findResult) => {
        if (err) {
            console.log("Could not update product quantity");
        }
    })

    Restock.findOneAndUpdate({name: req.params.name}, {status: "Completed"}, {new: true}, (err, findResult) => {
        if (err) {
            console.log("Could not update restock status");
        }
        else {
            res.redirect('/restock');
        }
    })

    // Product.findById(req.params.id, (err, doc) => {
    //     if (!err) {
    //         res.render("product/addOrEdit", {
    //             viewTitle: "Update Product",
    //             product: doc
    //         });
    //     }
    // }).lean();
});

router.get('/delete/:id', verifyToken, (req, res) => {
    Restock.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err)
            res.redirect("/restock");
        else
            console.log("Error while deleting restock order: " + err);
    })
});

module.exports = router;