const jwt = require('jsonwebtoken');
require('dotenv').config();

//Middleware function to check if user has token
module.exports = function(req, res, next) {
    const jwtCookie = req.cookies.jwt;
    const token = jwtCookie && jwtCookie.split(' ')[1];

    if(token == null) {
        res.redirect('/user/login');
    };

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) res.redirect('/user/login');

        req.user = user;
        next();
    });
}