const express = require('express');
const router = express.Router();

function useAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.redirect('/login');
}


router.use(useAuthenticated);

// set layout admin
router.use((req, res, next) => {
    res.app.locals.layout = 'admin';
    next();
});

router.get('/', (req, res) => {
    res.render('admin/index', { title: 'Admin' });
});

router.get('/dashboard', (req, res) => {
    res.render('admin/dashboard/dashboard');
});

router.get('/category', (req, res) => {
    res.render('admin/category/category-list');
});

router.get('/product', (req, res) => {
    res.render('admin/product/product-list');
});

module.exports = router;
