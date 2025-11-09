var express = require('express');
var router = express.Router();
router.all('/*', function (req, res, next) {
    res.app.locals.layout = 'home/contact';
    next();
});

/* GET home page. */
router.get('/contact', function(req, res, next) {
    res.render('contact');
});


module.exports = router;
