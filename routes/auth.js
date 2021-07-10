const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/user.model');
const { registerValidation, loginValidation } = require('../validation');


router.get('/register', async (req, res) => {
    res.render("user/register", {
        viewTitle : "User Registration"
    });
});


router.post('/register', async (req, res) => {
    //VALIDATE DATA BEFORE USER IS CREATED
    const { error } = registerValidation(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    };

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


router.post('/login', async (req, res) => {
    //VALIDATE DATA BEFORE USER IS LOGGED IN
    const { error } = loginValidation(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    };

    //Check if email exists
    const user = await User.findOne({
        email: req.body.email
    }).lean();
    if (!user) {
        return res.status(400).send('Email or password is incorrect');
    };

    //Check if password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) {
        return res.status(400).send('Email or password is incorrect');
    }
    
    jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, { expiresIn: '300s'},  (err, token) => {
        if (err) {
            res.json('Invalid credentials');
        } else {
            res.cookie('jwt', 'Bearer '+ token);
            res.redirect('/');
        }
    });
});


module.exports = router;