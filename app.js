const express = require('express');
const app = express();

const productRoute = require('./routes/product');


app.listen(3000, () => {
    console.log("Express server started at port : 3000");
});

app.use('/product', productRoute);