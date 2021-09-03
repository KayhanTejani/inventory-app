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
    const sales = await Sale.find((err, findResult) => {
        if (err) {
            const errorMessage = `Error getting sales list: ${err}`;
            handleError(errorMessage);
        }
    }).lean().exec();

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
            res.redirect("/");
        else
            console.log("Error while deleting sale: " + err);
    })
});


module.exports = router;