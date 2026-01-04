// routes/users.js
const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

// Áp layout home cho form login / đăng ký
router.all('/*', (req, res, next) => {
    res.app.locals.layout = 'home';
    next();
});

// ----------- LOGIN FORM -----------
router.get('/login', (req, res) => {
    res.render('home/login', { title: 'Login' });
});

// ----------- REGISTER FORM -----------
router.get('/register', (req, res) => {
    res.render('home/register', { title: 'Register' });
});

// ----------- PASSPORT LOGIN -----------
passport.use(new LocalStrategy({ usernameField: 'email' },
    async (email, password, done) => {
        try {
            const user = await User.findOne({ email });
            if (!user) return done(null, false, { message: 'Email does not exist' });

            const matched = await bcryptjs.compare(password, user.password);
            if (matched) return done(null, user);

            return done(null, false, { message: 'Incorrect password' });

        } catch (err) {
            return done(err);
        }
    }
));

router.post('/login', passport.authenticate('local', {
    successRedirect: '/admin',
    failureRedirect: '/login',
    failureFlash: true
}));

// ----------- REGISTER HANDLE -----------
router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, email, password, confirm_password } = req.body;
        let errors = [];

        // VALIDATION CHUẨN
        if (!firstName || firstName.trim() === '') {
            errors.push({ message: 'First name is required' });
        }
        if (!lastName || lastName.trim() === '') {
            errors.push({ message: 'Last name is required' });
        }
        if (!email || email.trim() === '') {
            errors.push({ message: 'E-mail is required' });
        }
        if (!password || password.trim() === '') {
            errors.push({ message: 'Password is required' });
        }
        if (!confirm_password || confirm_password.trim() === '') {
            errors.push({ message: 'Confirm Password is required' });
        }
        if (password !== confirm_password) {
            errors.push({ message: 'Passwords do not match' });
        }

        // Nếu có lỗi → return ngay
        if (errors.length > 0) {
            return res.render('home/register', {
                title: 'Register',
                errors,
                firstName,
                lastName,
                email
            });
        }

        // Kiểm tra email tồn tại chưa
        const exist = await User.findOne({ email });
        if (exist) {
            return res.render('home/register', {
                title: 'Register',
                errors: [{ message: 'Email already exists' }],
                firstName, lastName, email
            });
        }

        // Hash password và tạo user
        const hashedPass = await bcryptjs.hash(password, 10);
        await User.create({
            firstName,
            lastName,
            email,
            password: hashedPass
        });

        req.flash('success_message', 'Register successful!');
        res.redirect('/login');

    } catch (err) {
        console.error(err);
        res.render('home/register', {
            title: 'Register',
            errors: [{ message: 'Server error!' }]
        });
    }
});

// ----------- LOGOUT -----------
router.get('/logout', (req, res) => {
    req.logOut(() => {});
    res.redirect('/');
});

router.get("/forgot", (req,res)=>{
    res.render("home/forgot", {title:"Forgot Password"});
});
const nodemailer = require("nodemailer");
const crypto = require("crypto");
router.post("/forgot", async(req,res)=>{
    try{
        const user = await User.findOne({ email:req.body.email });

        if(!user){
            req.flash("error_message","Email không tồn tại!");
            return res.redirect("/forgot");
        }

        // Tạo token
        const token = crypto.randomBytes(32).toString("hex");

        user.resetPasswordToken = token;
        user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 phút
        await user.save();

        // Cấu hình Gmail
        let transporter = nodemailer.createTransport({
            service:"gmail",
            auth:{
                user:"ktoa08055@gmail.com",
                pass:"qprrrfgdgdrggyfd"
            }
        });

        const resetLink = `http://localhost:3000/reset/${token}`;

        await transporter.sendMail({
            to:user.email,
            subject:"Password Reset",
            html:`<h3>Click để reset mật khẩu:</h3>
                  <a href="${resetLink}">${resetLink}</a>
                  <p>Link hết hạn sau 15 phút</p>`
        });

        req.flash("success_message","Đã gửi link reset mật khẩu qua email!");
        res.redirect("/login");

    }catch(err){
        console.log(err);
        req.flash("error_message","Có lỗi xảy ra!");
        res.redirect("/forgot");
    }
});

router.get("/reset/:token", async(req,res)=>{
    const user = await User.findOne({
        resetPasswordToken:req.params.token,
        resetPasswordExpire:{$gt:Date.now()}
    });

    if(!user){
        req.flash("error_message","Link không hợp lệ hoặc đã hết hạn");
        return res.redirect("/login");
    }

    res.render("home/reset",{
        title:"Reset Password",
        token:req.params.token
    });
});

router.post("/reset/:token", async(req,res)=>{
    const user = await User.findOne({
        resetPasswordToken:req.params.token,
        resetPasswordExpire:{$gt:Date.now()}
    });

    if(!user){
        req.flash("error_message","Token hết hạn");
        return res.redirect("/login");
    }

    user.password = await bcryptjs.hash(req.body.password,10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    req.flash("success_message","Reset mật khẩu thành công! Hãy đăng nhập lại");
    res.redirect("/login");
});


// Passport session
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
    User.findById(id).then(user => done(null, user));
});

module.exports = router;
