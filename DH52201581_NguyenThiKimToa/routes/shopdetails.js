var express = require('express');
var router = express.Router();
router.all('/*', function (req, res, next) {
    res.app.locals.layout = 'home/shopdetails';
    next();
});

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('shopdetails', { layout: false, title: 'Shop Details' });

});


module.exports = router;
