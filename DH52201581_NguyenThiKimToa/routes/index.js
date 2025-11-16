var express = require('express');
var router = express.Router();

// Middleware: áp dụng layout 'admin' cho tất cả route trong file này
router.all('/*', function (req, res, next) {
    res.app.locals.layout = 'home';
    next();
});

/* GET home page. */
router.get('/', function (req, res) {
    res.render('home/index', { title: 'Trang chủ' });
});

router.get('/blog', function (req, res) {
    res.render('home/blog', { title: 'Blog' });
});

router.get('/contact', function (req, res) {
    res.render('home/contact', { title: 'Liên hệ' });
});

router.get('/shopdetails', function (req, res) {
    res.render('home/shopdetails', { title: 'Chi tiết sản phẩm' });
});

router.get('/checkout', function (req, res) {
    res.render('home/checkout', { title: 'Thanh toán' });
});

router.get('/blogdetails', function (req, res) {
    res.render('home/blogdetails', { title: 'Chi tiết blog' });
});

router.get('/shopgrid', function (req, res) {
    res.render('home/shopgrid', { title: 'Sản phẩm' });
});
router.get('/customer', function (req, res) {
    res.render('home/customer', { title: 'Sản phẩm' });
});

module.exports = router;
