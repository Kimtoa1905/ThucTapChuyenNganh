const express = require('express');
const router = express.Router();
const Product = require("../models/Product");
const Category = require("../models/Category");
const Contact = require("../models/Contact");


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


router.get("/", async (req, res) => {
    res.app.locals.layout = "admin"; // chỉ định layouthieenrn thị

    const totalProducts = await Product.countDocuments();
    const totalCategories = await Category.countDocuments();
    const activeProducts = await Product.countDocuments({ status: true });
    const hiddenProducts = await Product.countDocuments({ status: false });

    res.render("admin/index", {
        title: "Dashboard",

        totalProducts,
        totalCategories,
        activeProducts,
        hiddenProducts
    });
});

router.get('/dashboard', (req, res) => {
    res.render('admin/dashboard/dashboard');
});

router.get("/contact", async (req, res) => {
    const contacts = await Contact.find().sort({ createdAt: -1 }).lean();

    res.render("admin/contact/list", {
        title: "Danh sách liên hệ",
        contacts
    });
});
router.post("/contact/read/:id", async (req, res) => {
    await Contact.findByIdAndUpdate(req.params.id, { isRead: true });
    res.redirect("/admin/contact");
});
router.post("/contact/status/:id", async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    contact.status = !contact.status;
    await contact.save();

    res.redirect("/admin/contact");
});
router.post("/contact/delete/:id", async (req, res) => {
    await Contact.findByIdAndDelete(req.params.id);
    res.redirect("/admin/contact");
});


module.exports = router;
