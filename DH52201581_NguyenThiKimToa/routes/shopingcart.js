var express = require('express');
var router = express.Router();
router.all('/*', function (req, res, next) {
    res.app.locals.layout = 'home/shopingcart';
    next();
});

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('shopingcart', { layout: false, title: 'Shoping Cart' });

});


module.exports = router;
