var express = require('express');
var router = express.Router();

router.all('/*', function (req, res, next) {
    res.app.locals.layout = 'home';
    next();
});

// GET /register → hiện giao diện
router.get('/', function(req, res) {
    res.render('home/register', { title: 'Register' });
});

module.exports = router;
