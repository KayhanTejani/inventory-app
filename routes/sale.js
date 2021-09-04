const express = require('express');
const router = express.Router();
const Sale = require('../models/sale.model');
const Product = require('../models/product.model');
const verifyToken = require('./verifyToken');


function handleError(errorMessage) {
    console.error(errorMessage);
    const error = new Error(errorMessage);
    // next(error);
}


router.get('/', verifyToken, async (req, res, next) => {
    let sales;
    if (!req.query.sort) {
        sales = await Sale.find((err, findResult) => {
            if (err) {
                const errorMessage = `Error getting sales list: ${err}`;
                handleError(errorMessage);
            }
        }).lean().exec();
    }
    else {
        const sortQuery = req.query.sort;
        if (sortQuery == "total-low-high") {
            sales = await Sale.find((err, findResult) => {
                if (err) {
                    const errorMessage = `Error sorting products list: ${err}`;
                    handleError(errorMessage, next);
                }
            }).sort({ total: 1 }).lean();
        }
        else if (sortQuery == "total-high-low") {
            sales = await Sale.find((err, findResult) => {
                if (err) {
                    const errorMessage = `Error sorting products list: ${err}`;
                    handleError(errorMessage, next);
                }
            }).sort({ total: -1 }).lean();
        }
        else {
            sales = await Sale.find((err, findResult) => {
                if (err) {
                    const errorMessage = `Error sorting products list: ${err}`;
                    handleError(errorMessage, next);
                }
            }).collation({ 'locale': 'en' }).sort({ name: 1 }).lean();
        }
    }

    if (sales) {
        Product.find((err, findResult) => {
            if (err) {
                const errorMessage = `Error getting sales list: ${err}`;
                handleError(errorMessage);
            }
            else {
                res.render("sale/list", {
                    list: sales,
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
            res.render("sale/addOrEdit", {
                viewTitle: "Create Sale Entry",
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
    const sale = new Sale({
        name: req.body.name,
        price: req.body.price,
        quantity: req.body.quantity,
        category: req.body.category,
        discount: req.body.discount,
        total: req.body.total
    });

    Product.findByIdAndUpdate({ _id: req.body._id }, { $inc: { quantity: -req.body.quantity } }, { new: true }, (err, findResult) => {
        if (err) {
            console.log("Could not update product quantity");
        }
    })

    sale.save((err, doc) => {
        if (!err) {
            res.redirect('/sale');
        }
        else {
            console.log('Error during sale record insertion: ' + err);
        }
    });
}

function updateRecord(req, res) {
    Sale.findOneAndUpdate({ _id: req.body._id}, req.body, { new: true }, (err, doc) => {
        if (!err) {
            res.redirect('/');
        }
        else {
            console.log('Error during record update: ' + err);
        }
    });
}


router.get('/search', verifyToken, async (req, res, next) => {
    const searchQuery = req.query.name;
    const regex = RegExp(".*" + searchQuery + ".*", 'i');
    const items = await Sale.find({
        "$or": [
            { name: regex },
            { category: regex }
        ]
    }, (err, findResult) => {
        if (err) {
            const errorMessage = `Error seaching sales list: ${err}`;
            handleError(errorMessage, next);
        }
    }).lean();
    
    if (items) {
        res.render("sale/list", {
            list: items
        })
        return;
    }
});


router.get('/filter', verifyToken, async (req, res, next) => {
    const filter = req.query.option;
    const value = req.query.filterValue;
    let items;
    if (isNaN(value) || value.length == 0) {
        res.redirect('/sale');
    }

    switch (filter) {
        case "equals":
            items = await Sale.find({ total: { $eq: value } }, (err, findResult) => {
                if (err) {
                    const errorMessage = `Error filtering sales list: ${err}`;
                    handleError(errorMessage, next);
                }
            }).lean();
            break;
        case "less-than":
            items = await Sale.find({ total: { $lt: value } }, (err, findResult) => {
                if (err) {
                    const errorMessage = `Error filtering sales list: ${err}`;
                    handleError(errorMessage, next);
                }
            }).lean();
            break;
        case "less-than-equal":
            items = await Sale.find({ total: { $lte: value } }, (err, findResult) => {
                if (err) {
                    const errorMessage = `Error filtering sales list: ${err}`;
                    handleError(errorMessage, next);
                }
            }).lean();
            break;
        case "greater-than":
            items = await Sale.find({ total: { $gt: value } }, (err, findResult) => {
                if (err) {
                    const errorMessage = `Error filtering sales list: ${err}`;
                    handleError(errorMessage, next);
                }
            }).lean();
            break;
        case "greater-than-equal":
            items = await Sale.find({ total: { $gte: value } }, (err, findResult) => {
                if (err) {
                    const errorMessage = `Error filtering sales list: ${err}`;
                    handleError(errorMessage, next);
                }
            }).lean();
            break;
    }

    if (items) {
        res.render("sale/list", {
            list: items
        })
        return;
    }
});


router.get('/:id', verifyToken, (req, res) => {
    Sale.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("sale/addOrEdit", {
                viewTitle: "Update Sale",
                sale: doc
            });
        }
    }).lean();
});


router.get('/delete/:id', verifyToken, (req, res) => {
    Sale.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err)
            res.redirect("/sale");
        else
            console.log("Error while deleting sale: " + err);
    })
});


module.exports = router;