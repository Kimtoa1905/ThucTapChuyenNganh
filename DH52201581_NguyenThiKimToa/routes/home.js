// routes/home.js
const express = require('express');
const router = express.Router();

// Áp layout home cho tất cả route
router.all('/*', (req, res, next) => {
    res.app.locals.layout = 'home';
    next();
});

// ----------- HOME PAGE -----------
router.get('/', (req, res) => {
    res.render('home/index', { title: 'Trang chủ' });
});

// ----------- BLOG -----------
router.get('/blog', (req, res) => {
    res.render('home/blog', { title: 'Blog' });
});

router.get('/blogdetails', (req, res) => {
    res.render('home/blogdetails', { title: 'Chi tiết blog' });
});

// ----------- SHOP -----------
router.get('/shopgrid', (req, res) => {
    res.render('home/shopgrid', { title: 'Danh sách sản phẩm' });
});

router.get('/shopdetails', (req, res) => {
    res.render('home/shopdetails', { title: 'Chi tiết sản phẩm' });
});

router.get('/shopingcart', (req, res) => {
    res.render('home/shopingcart', { title: 'Giỏ hàng' });
});

router.get('/checkout', (req, res) => {
    res.render('home/checkout', { title: 'Thanh toán' });
});

// ----------- CONTACT -----------
router.get('/contact', (req, res) => {
    res.render('home/contact', { title: 'Liên hệ' });
});

module.exports = router;
