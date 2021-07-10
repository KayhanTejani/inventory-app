const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/product.model');
const verifyToken = require('./verifyToken');

router.get('/', verifyToken, (req, res) => {
    res.render("product/addOrEdit", {
        viewTitle: "Create Product Entry"
    });
});

router.post('/', (req, res) => {
    if (req.body._id == "")
        insertRecord(req, res);
    else
        updateRecord(req, res);
});


function insertRecord(req, res) {
    const product = new Product({
        name: req.body.name,
        price: req.body.price,
        quantity: req.body.quantity,
        category: req.body.category
    });
    
    product.save((err, doc) => {
        if (!err) {
            res.redirect('/');
        }
        else {
            console.log('Error during product record insertion: ' + err);
        }
    });
}

function updateRecord(req, res) {
    Product.findOneAndUpdate({ _id: req.body._id}, req.body, { new: true }, (err, doc) => {
        if (!err) {
            res.redirect('/');
        }
        else {
            console.log('Error during record update: ' + err);
        }
    });
}


router.get('/:id', verifyToken, (req, res) => {
    Product.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("product/addOrEdit", {
                viewTitle: "Update Product",
                product: doc
            });
        }
    }).lean();
});


router.get('/delete/:id', verifyToken, (req, res) => {
    Product.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err)
            res.redirect("/");
        else
            console.log("Error while deleting product: " + err);
    })
});


module.exports = router;