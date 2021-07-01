const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render("product/addOrEdit", {
        viewTitle: "Create Product Entry"
    });
});

router.post('/', (req, res) => {
    console.log(req.body);
})

module.exports = router;