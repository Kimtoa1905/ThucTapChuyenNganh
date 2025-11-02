var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/blog', function(req, res, next) {
    res.render('blog', { title: 'Express' });
});
router.get('/contact', function(req, res, next) {
    res.render('contact', { title: 'Express' });
});
router.get('/shopdetails', function(req, res, next) {
    res.render('shopdetails', { title: 'Express' });
});
router.get('/checkout', function(req, res, next) {
    res.render('checkout', { title: 'Express' });
});
router.get('/blogdetails', function(req, res, next) {
    res.render('blogdetails', { title: 'Express' });
});
router.get('/shopgrid', function(req, res, next) {
    res.render('shopgrid', { title: 'Express' });
});

module.exports = router;
