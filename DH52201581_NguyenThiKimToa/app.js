var createError = require('http-errors');
var express = require('express');
var app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { engine } = require('express-handlebars');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');

// ===== VIEW ENGINE =====
app.engine('hbs', engine({
    extname: '.hbs',
    partialsDir: path.join(__dirname, 'views', 'partials'),
    layoutsDir: path.join(__dirname, 'views', 'layouts')
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// ===== DATABASE =====
mongoose.connect("mongodb://127.0.0.1/node")
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error("Mongo Error:", err));

// ===== MIDDLEWARE =====
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ===== SESSION + FLASH =====
app.use(session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
}));

app.use(flash());

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Make flash & user available to views
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    res.locals.success_message = req.flash("success_message");
    res.locals.error_message = req.flash("error_message");
    res.locals.error = req.flash("error");
    next();
});

// ===== ROUTES =====
const homeRouter = require('./routes/home');
const adminRouter = require('./routes/admin');
const usersRouter = require('./routes/users');

app.use('/', homeRouter);      // Trang giao diện
app.use('/', usersRouter);     // Login, Register
app.use('/admin', adminRouter); // Admin

// ===== ERROR HANDLER =====
app.use((req, res, next) => next(createError(404)));

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
