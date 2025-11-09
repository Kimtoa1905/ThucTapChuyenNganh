var express = require('express');
var router = express.Router();
router.all('/*', function (req, res, next) {
    res.app.locals.layout = 'home/shopgrid';
    next();
});

/* GET home page. */

router.get('/shopgrid', function(req, res, next) {
    res.render('shopgrid');
});

module.exports = router;
