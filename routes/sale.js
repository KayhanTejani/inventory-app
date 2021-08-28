const express = require('express');
const router = express.Router();
const Sale = require('../models/sale.model');
const verifyToken = require('./verifyToken');


function handleError(errorMessage) {
    console.error(errorMessage);
    const error = new Error(errorMessage);
    // next(error);
}


router.get('/', verifyToken, (req, res) => {
    const items = Sale.find((err, findResult) => {
        if (err) {
            const errorMessage = `Error getting sales list: ${err}`;
            handleError(errorMessage);
        }
    }).lean().exec();

    if (items) {
        res.render("sale/list", {
            list: items
        })
        return;
    }
});

router.get('/new', verifyToken, (req, res) => {
    res.render("sale/addOrEdit", {
        viewTitle: "Create Sale Entry"
    });
});

router.post('/new', (req, res) => {
    if (req.body._id == "")
        insertRecord(req, res);
    else
        updateRecord(req, res);
});


function insertRecord(req, res) {
    const sale = new Sale({
        name: req.body.name,
        price: req.body.price,
        quantity: req.body.quantity,
        category: req.body.category,
        discount: req.body.discount,
        total: req.body.discount
    });
    
    sale.save((err, doc) => {
        if (!err) {
            res.redirect('/');
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