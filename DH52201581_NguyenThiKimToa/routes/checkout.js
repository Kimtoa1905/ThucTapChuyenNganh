var express = require('express');
var router = express.Router();
router.all('/*', function (req, res, next) {
    res.app.locals.layout = 'home/checkout';
    next();
});

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('checkout', { layout: false, title: 'Check Out' });

});


module.exports = router;
