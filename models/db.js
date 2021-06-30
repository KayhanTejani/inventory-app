const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.DB_CONNECT, {useNewUrlParser: true}, (err) => {
    if (!err) {
        console.log('MongoDB Connection Succeeded.')
    }
    else {
        console.log('Error in DB connection: ' + err)
    }
});

require('./product.model');