var express = require('express');
var router = express.Router();
router.all('/*', function (req, res, next) {
    res.app.locals.layout = 'home';
    next();
});

/* GET home page. */

router.get('/', function(req, res, next) {
    res.render('home/login', { title: 'Login' });
});

module.exports = router;
