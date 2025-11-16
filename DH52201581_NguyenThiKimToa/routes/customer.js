var express = require('express');
var router = express.Router();
router.all('/*', function (req, res, next) {
    res.app.locals.layout = 'home/customer';
    next();
});

/* GET home page. */
router.get('/customer', function(req, res, next) {
    res.render('customer');
});


module.exports = router;
