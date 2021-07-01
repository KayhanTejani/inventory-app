require('./models/db');

const express = require('express');
const app = express();
const path = require('path');
const exphbs = require('express-handlebars');

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