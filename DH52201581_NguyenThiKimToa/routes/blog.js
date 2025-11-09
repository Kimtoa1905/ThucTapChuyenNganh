var express = require('express');
var router = express.Router();
router.all('/*', function (req, res, next) {
    res.app.locals.layout = 'home/blog';
    next();
});

/* GET home page. */

router.get('/blog', function(req, res, next) {
    res.render('blog');
});

module.exports = router;
