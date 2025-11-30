var express = require('express');
var router = express.Router();

/* GET Shopping Cart Page */
router.get('/', function(req, res) {
    res.render('home/shopingcart', {
        layout: 'home',
        title: 'Shopping Cart'
    });
});

module.exports = router;
