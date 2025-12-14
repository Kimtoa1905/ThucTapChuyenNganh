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

// Passport session
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
    User.findById(id).then(user => done(null, user));
});

module.exports = router;
