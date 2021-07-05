const express = require('express');
const router = express.Router();

router.get('/register', async (req, res) => {
    res.render("user/register", {
        viewTitle : "User Registration"
    });
});


router.get('/login', async (req, res) => {
    res.render("user/login", {
        viewTitle : "User Login"
    });
});


module.exports = router;