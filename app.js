require('./models/db');

const express = require('express');
const app = express();
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const Product = require('./models/product.model');
const verifyToken = require('./routes/verifyToken');
const appHelpers = require('./helpers/appHelpers');
const dbHelpers = require('./helpers/dbHelpers');
const productRoute = require('./routes/product');
const authRoute = require('./routes/auth');


app.use(cookieParser());

app.use(express.urlencoded({
    extended: true
}));


app.use(express.json());
app.set('views', path.join(__dirname, '/views/'));
app.engine('hbs', exphbs({ extname: 'hbs', defaultLayout: 'mainLayout', layoutsDir: __dirname + '/views/layouts/' }));
app.set('view engine', 'hbs');

//Load static assets
app.use(express.static('public'));


app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});


app.get('/', verifyToken, async (req, res, next) => {
    if (!req.query.sort) {
        await appHelpers.getItems(req, res, next);
    }
    else {
        const sortQuery = req.query.sort;
        console.log(sortQuery);
        if (sortQuery == "price-low-high" || sortQuery == "price-high-low") {
            await appHelpers.sortByPrice(sortQuery, req, res, next);
        }
        else {
            await appHelpers.sortByName(req, res, next);
        }
    }
});


app.get('/search', verifyToken, async (req, res, next) => {
    const searchQuery = req.query.name;
    await appHelpers.searchItems(searchQuery, req, res, next);
});


app.get('/filter', verifyToken, async (req, res, next) => {
    const filter = req.query.option;
    const value = req.query.filterValue;
    await appHelpers.filterItems(filter, value, req, res, next);
});


app.use('/product', productRoute);
app.use('/user', authRoute);