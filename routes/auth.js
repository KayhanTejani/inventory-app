const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/user.model');


router.get('/register', async (req, res) => {
    res.render("user/register", {
        viewTitle : "User Registration"
    });
});


router.post('/register', async (req, res) => {
    //Check if user is already in the database
    const emailExists = await User.findOne({
        email: req.body.email
    }).lean();
    if (emailExists) {
        return res.status(400).send('Email already exists');
    };

    //Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //Create a new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });

    user.save((err, doc) => {
        if (!err) {
            res.redirect('/');
        }
        else {
            res.status(400).send(err);
        }
    });
});


router.get('/login', async (req, res) => {
    res.render("user/login", {
        viewTitle : "User Login"
    });
});


module.exports = router;