const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const multer = require('multer');
const Product = require("../models/Product");

function useAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.redirect('/login');
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

router.use(useAuthenticated);

// set layout admin
router.use((req, res, next) => {
    res.app.locals.layout = 'admin';
    next();
});

router.get("/", async (req, res) => {
    res.app.locals.layout = "admin";

    const query = {};

    // --- Search theo tên ---
    if (req.query.keyword) {
        query.name = { $regex: req.query.keyword, $options: "i" };
    }

    // --- Lọc trạng thái ---
    if(req.query.status === "true") query.status = true;
    if(req.query.status === "false") query.status = false;

    // --- Pagination ---
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    const totalCategories = await Category.countDocuments(query);

    const categories = await Category.find(query)
        .skip(skip)
        .limit(limit)
        .lean();

    res.render("admin/category/list", {
        title: "Category",
        categories,

        // giữ filter
        keyword: req.query.keyword || "",
        statusFilter: req.query.status || "",

        // phân trang
        page,
        totalPages: Math.ceil(totalCategories / limit)
    });
});








router.get('/create', (req, res) => {
    res.render('admin/category/create');
});
router.post('/create', upload.single('image'),(req, res) => {
    const newCategory = new Category({
        name: req.body.name,
        image: '/uploads/' + req.file.filename,
        status: req.body.status === "true"
    });
    newCategory.save().then(savedCategory => {
        res.redirect('/admin/category');
    })

});


router.get('/edit/:id', (req, res) => {
    Category.findOne({ _id: req.params.id }).then(category => {
        res.render('admin/category/edit', {
            title: 'Edit a Category',
            category: category.toObject() // Convert dữ liệu MongoDB -> Object để HBS đọc được
        });
    });
});
router.put('/edit/:id', upload.single('image'), async (req, res) => {
    const category = await Category.findById(req.params.id);

    category.name = req.body.name;
    category.status = req.body.status;

    // Nếu có chọn ảnh mới → cập nhật
    if (req.file) {
        category.image = '/uploads/' + req.file.filename;
    }

    await category.save();
    res.redirect('/admin/category');
});


router.delete("/:id", async (req, res) => {
    try {
        const productCount = await Product.countDocuments({ category: req.params.id });

        if (productCount > 0) {
            req.flash("error_message", " Không thể xoá! Danh mục này đang có sản phẩm.");
            return res.redirect("/admin/category");
        }

        await Category.findByIdAndDelete(req.params.id);

        req.flash("success_message", " Xoá category thành công");
        res.redirect("/admin/category");
    }
    catch (err) {
        console.log(err);
        req.flash("error_message", " Đã xảy ra lỗi khi xoá category");
        res.redirect("/admin/category");
    }
});



router.get('/product', (req, res) => {
    res.render('admin/product/list');
});

module.exports = router;
