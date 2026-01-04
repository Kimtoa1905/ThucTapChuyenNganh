// routes/home.js
const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Product = require('../models/Product');
const Contact = require("../models/Contact");


// Áp layout home cho tất cả route
router.all('/*', (req, res, next) => {
    res.app.locals.layout = 'home';
    next();
});

// ----------- HOME PAGE -----------
router.get('/', (req, res) => {
    Category.find({ status: true })
        .then(categories => {
            const list = categories.map(c => c.toObject());//khi query xong → nhận kết quả trong biến categories
            res.render('home/index', {
                title: 'Trang chủ',
                categories: list
            });
        });
});





// ----------- SHOP -----------
router.get("/shopgrid", async (req, res) => {
    try {
        let page = parseInt(req.query.page) || 1;
        let limit = 12;                     // mỗi trang 6 sản phẩm
        let skip = (page - 1) * limit;

        // tổng sản phẩm
        const totalProducts = await Product.countDocuments({ status: true });

        // lấy sản phẩm theo trang
        const products = await Product.find({ status: true })
            .populate("category")
            .skip(skip)
            .limit(limit)
            .lean();

        const totalPages = Math.ceil(totalProducts / limit);

        res.render("home/shopgrid", {
            title: "Danh sách sản phẩm",
            products,
            currentPage: page,
            totalPages
        });

    } catch (err) {
        console.log("SHOPGRID ERROR:", err);
        res.redirect("/");
    }
});








// ----------- CONTACT -----------
router.get('/contact', (req, res) => {
    res.render('home/contact', { title: 'Liên hệ' });
});
router.get('/category/:id', async (req, res) => {
    const products = await Product.find({
        category: req.params.id,
        status: true
    })
        .populate("category")
        .lean();

    const categories = await Category.find({ status:true }).lean();

    res.render('home/category', {
        title: "Danh sách sản phẩm",
        products,
        categories
    });
});

router.get("/detail/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate("category")
            .lean();

        if (!product) return res.redirect("/");

        res.render("home/product-detail", {
            title: product.name,
            product
        });

    } catch (err) {
        console.log(err);
        res.redirect("/");
    }
});
router.post("/contact", async (req, res) => {
    try {
        await Contact.create({
            name: req.body.name,
            email: req.body.email,
            message: req.body.message
        });

        req.flash("success_message", "Gửi liên hệ thành công!");
        res.redirect("/contact");

    } catch (err) {
        console.log(err);
        req.flash("error_message", "Có lỗi xảy ra!");
        res.redirect("/contact");
    }
});

module.exports = router;
