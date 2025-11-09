var express = require('express');
var router = express.Router();
router.all('/*', function (req, res, next) {
    res.app.locals.layout = 'home/blogdetails';
    next();
});

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('blogdetails', { layout: false, title: 'Blog Details' });

});


module.exports = router;
