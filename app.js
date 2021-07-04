require('./models/db');

const express = require('express');
const app = express();
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const Product = require('./models/product.model');


const productRoute = require('./routes/product');

app.use(express.urlencoded({
    extended: true
}));


app.use(express.json());
app.set('views', path.join(__dirname, '/views/'));
app.engine('hbs', exphbs({ extname: 'hbs', defaultLayout: 'mainLayout', layoutsDir: __dirname + '/views/layouts/' }));
app.set('view engine', 'hbs');


app.listen(3000, () => {
    console.log("Express server started at port : 3000");
});

app.use('/product', productRoute);

app.get('/', (req, res) => {
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
        }).lean()
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