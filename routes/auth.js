const express = require('express');
const router = express.Router();

router.get('/register', (req, res) => {
    res.render("user/register", {
        viewTitle : "User Registration"
    });
});


module.exports = router;