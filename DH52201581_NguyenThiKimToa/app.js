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
const methodOverride = require('method-override');


// ===== VIEW ENGINE =====
// ===== VIEW ENGINE =====
app.engine('hbs', engine({
    extname: '.hbs',

    // Nơi lưu partials (header, footer,...)
    partialsDir: path.join(__dirname, 'views', 'partials'),

    // Nơi lưu layouts (admin.hbs, home.hbs,...)
    layoutsDir: path.join(__dirname, 'views', 'layouts'),

    helpers: {

        /**
         * ===========================
         *  SO SÁNH BẰNG ===
         * ===========================
         * Dùng cho category, product,… vì ObjectId và String phải convert
         */
        ifEquals: function(a, b, options){
            return (String(a) === String(b))
                ? options.fn(this)
                : options.inverse(this);
        },

        /**
         * ===========================
         *  SO SÁNH ĐƠN GIẢN
         * ===========================
         * Dùng cho các option status: "true" / "false"
         */
        eq: function(a, b){
            return String(a) === String(b);
        },

        /**
         * ===========================
         *  RANGE HELPER
         * ===========================
         * Tạo mảng [1, 2, 3,... totalPages]
         * -> dùng để vẽ button số trang
         */
        range: function(start, end){
            let arr = [];
            for(let i = start; i <= end; i++){
                arr.push(i);
            }
            return arr;
        },

        /**
         * ===========================
         *  BUILD URL GIỮ LỌC
         * ===========================
         * Tự động thêm ?page=&keyword=&category=&status=
         * để khi đổi trang không mất bộ lọc
         */
        paginationUrl: function(page, keyword, category, status){
            let url = `/admin/product?page=${page}`;

            if(keyword)   url += `&keyword=${keyword}`;
            if(category)  url += `&category=${category}`;
            if(status)    url += `&status=${status}`;

            return url;
        },
        nl2br: function(text){
            if(!text) return '';
            return text.replace(/\r?\n/g, '<br>');
        },
        add: (a, b) => Number(a) + Number(b),
        subtract: (a, b) => Number(a) - Number(b),

    }
}));




// Method

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// ===== DATABASE =====
mongoose.connect("mongodb://127.0.0.1/node")
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error("Mongo Error:", err));

app.use(methodOverride('_method'));
// ===== MIDDLEWARE =====
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'));
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
var homeRouter = require('./routes/home');
var adminRouter = require('./routes/admin');
var usersRouter = require('./routes/users');
var categoryRouter = require('./routes/category');
var productRouter = require('./routes/product');
var contactRouter = require('./routes/contact');

app.use('/', homeRouter);      // Trang giao diện
app.use('/', usersRouter);     // Login, Register
app.use('/admin', adminRouter); // Admin
app.use('/admin/category', categoryRouter);
app.use('/admin/product', productRouter);
app.use("/admin/contact", contactRouter);


// ===== ERROR HANDLER =====
app.use((req, res, next) => next(createError(404)));

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});




module.exports = app;
