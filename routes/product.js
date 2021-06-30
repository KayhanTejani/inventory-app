const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render("product/addOrEdit", {
        viewTitle: "Create Product Entry"
    });
});

module.exports = router;