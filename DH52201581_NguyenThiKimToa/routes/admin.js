var express = require('express');
var router = express.Router();

router.all('/*', function(req, res, next) {
    res.app.locals.layout = 'admin';
    next();
});

/* GET home page. */
router.get('/', function(req, res) {
    res.render('admin/index', { title: 'Admin' });
});
router.get('/category', function(req, res) {
    res.render('admin/category/category-list', { title: 'SanPham' });
});
router.get('/product', function(req, res) {
    res.render('admin/product/product-list', { title: 'SanPham' });
});
router.get('/order', function(req, res) {
    res.render('admin/order/order-list', { title: 'SanPham' });
});
router.get('/customer', function(req, res) {
    res.render('admin/customer/customer-list', { title: 'SanPham' });
});

module.exports = router;
