var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/shopgrid', function(req, res, next) {
    res.render('shopgrid');
});

module.exports = router;
