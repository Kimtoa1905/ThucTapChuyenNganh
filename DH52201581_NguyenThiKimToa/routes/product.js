
const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Category = require("../models/Category");
const multer = require("multer");
const path = require("path");




const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "public/uploads"),
    filename: (req, file, cb) =>
        cb(null, Date.now() + path.extname(file.originalname))
});


const upload = multer({ storage: storage });
router.get("/create", async (req, res) => {
    const categories = await Category.find({ status:true }).lean();
    res.render("admin/product/create", { categories });
});

router.post("/create", upload.single("image"), async (req, res) => {
    try {
        const product = new Product({
            name: req.body.name,
            description:req.body.description,
            price:req.body.price,
            image: "/uploads/" + req.file.filename,
            category: req.body.category,
            status: req.body.status === "true"
        });

        await product.save();
        res.redirect("/admin/product");
    }
    catch (err) {
        console.log(err);
        res.send("Create product failed");
    }
});
router.get("/", async (req, res) => {
    res.app.locals.layout = "admin";

    let query = {};

    // Search theo tên
    if (req.query.keyword) {
        query.name = { $regex: req.query.keyword, $options: "i" };
    }

    // Lọc category
    if (req.query.category) {
        query.category = req.query.category;
    }

    // Lọc trạng thái
    if (req.query.status === "true") query.status = true;
    if (req.query.status === "false") query.status = false;


    // ============= PAGINATION =============
    let page = parseInt(req.query.page) || 1;
    let limit = 5;
    let skip = (page - 1) * limit;


    const products = await Product.find(query)
        .populate("category")
        .skip(skip)
        .limit(limit)
        .lean();

    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);

    const categories = await Category.find().lean();

    res.render("admin/product/list", {
        title: "Product",
        products,
        categories,

        // giữ lại giá trị trên form
        keyword: req.query.keyword || "",
        selectedCategory: req.query.category || "",
        status: req.query.status || "",

        // gửi biến phân trang
        page,
        totalPages
    });
});


router.get("/edit/:id", async (req, res) => {
    const product = await Product.findById(req.params.id).lean();
    const categories = await Category.find({status:true}).lean();

    res.render("admin/product/edit", { product, categories });
});
router.put("/edit/:id", upload.single("image"), async (req, res) => {

    const updateData = {
        name:req.body.name,
        description:req.body.description,
        price:req.body.price,
        category:req.body.category,
        status:req.body.status === "true"
    };

    if(req.file){
        updateData.image = "/uploads/" + req.file.filename;
    }

    await Product.findByIdAndUpdate(req.params.id, updateData);
    res.redirect("/admin/product");
});
router.delete("/delete/:id", async (req,res)=>{
    await Product.findByIdAndDelete(req.params.id);
    res.redirect("/admin/product");
});

module.exports = router;
