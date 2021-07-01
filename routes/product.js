const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/product.model');

router.get('/', (req, res) => {
    res.render("product/addOrEdit", {
        viewTitle: "Create Product Entry"
    });
});

router.post('/', (req, res) => {
    console.log(req.body);
});

module.exports = router;