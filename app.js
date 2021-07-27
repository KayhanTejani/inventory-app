require('./models/db');

const express = require('express');
const app = express();
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const Product = require('./models/product.model');
const verifyToken = require('./routes/verifyToken');

app.use(cookieParser());

const productRoute = require('./routes/product');
const authRoute = require('./routes/auth');

app.use(express.urlencoded({
    extended: true
}));


app.use(express.json());
app.set('views', path.join(__dirname, '/views/'));
app.engine('hbs', exphbs({ extname: 'hbs', defaultLayout: 'mainLayout', layoutsDir: __dirname + '/views/layouts/' }));
app.set('view engine', 'hbs');

//Load static assets
app.use(express.static('public'));


app.listen(3000, () => {
    console.log("Express server started at port : 3000");
});


app.get('/', verifyToken, (req, res) => {
    if (!req.query.sort) {
        Product.find((err, docs) => {
            if (!err) {
                res.render("product/list", {
                    list: docs
                });
            }
            else {
                console.log('Error in retrieving product list: ' + err);
            }
        }).lean();
    }
    else {
        let sortQuery = req.query.sort;
        console.log(sortQuery);
        if (sortQuery == "price-low-high" || sortQuery == "price-high-low") {
            sortByPrice(sortQuery, req, res);
        }
        else {
            sortByName(req, res);
        }
    }
});

function sortByPrice(query, req, res) {
    if (query == "price-low-high") {
        Product.find((err, docs) => {
            if (!err) {
                res.render("product/list", {
                    list: docs
                });
            }
            else {
                console.log("Error while sorting");
            }
        }).sort({price:1}).lean();
    }
    else {
        Product.find((err, docs) => {
            if (!err) {
                res.render("product/list", {
                    list: docs
                });
            }
            else {
                console.log("Error while sorting");
            }
        }).sort({price:-1}).lean();
    }
}

function sortByName(req, res) {
    Product.find((err, docs) => {
        if (!err) {
            res.render("product/list", {
                list: docs
            });
        }
        else {
            console.log("Error while sorting by name");
        }
    }).collation({'locale':'en'}).sort({name:1}).lean();
}


app.get('/search', (req, res) => {
    let searchName = req.query.name;
    let regex = RegExp(".*" + searchName + ".*")
    Product.find(
        {
            "$or": [
                { name: regex },
                { category: regex }
            ]
        }, (err, doc) => {
            if (!err)
                res.render("product/list", {
                    list: doc
                });
        }).lean();
});


app.get('/filter', (req, res) => {
    let filter = req.query.option;
    let value = req.query.filterValue;
    
    if (isNaN(value) || value.length == 0) {
        res.redirect('/');
    }

    if (filter == "equals") {
        Product.find({price: {$eq: value}}, (err, docs) => {
                        if (!err) {
                            res.render("product/list", {
                                list: docs
                            });
                        }
                    }).lean();
    }
    else if (filter == "less-than") {
        Product.find({price: {$lt: value}}, (err, docs) => {
                        if (!err) {
                            res.render("product/list", {
                                list: docs
                            });
                        }
                    }).lean();
    }
    else if (filter == "less-than-equal") {
        Product.find({price: {$lte: value}}, (err, docs) => {
                        if (!err) {
                            res.render("product/list", {
                                list: docs
                            });
                        }
                    }).lean();
    }
    else if (filter == "greater-than") {
        Product.find({price: {$gt: value}}, (err, docs) => {
                        if (!err) {
                            res.render("product/list", {
                                list: docs
                            });
                        }
                    }).lean();
    }
    else {
        Product.find({price: {$gte: value}}, (err, docs) => {
                        if (!err) {
                            res.render("product/list", {
                                list: docs
                            });
                        }
                    }).lean();
    }
});


app.use('/product', productRoute);
app.use('/user', authRoute);