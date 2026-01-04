const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");

router.get("/", async (req, res) => {
    const contacts = await Contact.find().sort({ createdAt: -1 }).lean();

    res.render("admin/contact/list", {
        title: "Quản lý liên hệ",
        layout: "admin",
        contacts
    });
});

router.delete("/:id", async (req, res) => {
    await Contact.findByIdAndDelete(req.params.id);
    req.flash("success_message", "Xóa thành công");
    res.redirect("/admin/contact");
});

module.exports = router;
