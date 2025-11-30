var createError = require('http-errors');
var express = require('express');
const { engine } = require('express-handlebars');
var app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcryptjs = require('bcryptjs');
const User = require('./models/user');

app.engine(
    'hbs',
    engine({
        extname: '.hbs',
        defaultLayout: 'false',
        partialsDir: path.join(__dirname, 'views', 'partials'),
        layoutsDir: path.join(__dirname, 'views', 'layouts')
    })
);

var indexRouter = require('./routes/index');
var adminRouter = require('./routes/admin');
var usersRouter = require('./routes/users');
var blogRouter = require('./routes/blog');
var contactRouter = require('./routes/contact');
var shopdetailsRouter = require('./routes/shopdetails');
var shopingcartRouter = require('./routes/shopingcart');
var checkoutRouter = require('./routes/checkout');
var blogdetailsRouter = require('./routes/blogdetails');
var shopgridRouter = require('./routes/shopgrid');
var customerRouter = require('./routes/customer');
var loginRouter = require('./routes/login');
var registerRouter = require('./routes/register');




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect('mongodb://127.0.0.1/node')
    .then(()=>{
        console.log('MongoDB Connected successfully.');
    })
    .catch(err=>{
        console.error("Error connecting to MongoDB:",err);
    });
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    User.findOne({ email })
        .then(user => {
            if (!user) {
                return res.status(400).send("Email does not exist");
            }

            bcryptjs.compare(password, user.password, (err, matched) => {
                if (err) {
                    return res.status(500).send("Server error");
                }

                if (matched) {
                    return res.redirect('/admin');
                } else {
                    return res.status(400).send("Incorrect password");
                }
            });
        })
        .catch(err => {
            return res.status(500).send("Server error: " + err);
        });
});

app.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Kiểm tra trùng email
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.send("Email đã tồn tại, vui lòng chọn email khác");
        }

        // Tạo user mới
        const newUser = new User({ email, password });

        // Hash mật khẩus
        const salt = await bcryptjs.genSalt(10);
        newUser.password = await bcryptjs.hash(newUser.password, salt);

        await newUser.save();

        // Đăng ký xong → chuyển về trang home
        return res.redirect('/');

    } catch (err) {
        return res.status(500).send("USER ERROR: " + err);
    }
});



app.use('/admin', adminRouter);

app.use('/blog', blogRouter);
app.use('/contact', contactRouter);
app.use('/shopdetails', shopdetailsRouter);
app.use('/shopingcart', shopingcartRouter);
app.use('/checkout', checkoutRouter);
app.use('/blogdetails', blogdetailsRouter);
app.use('/shopgrid', shopgridRouter);
app.use('/customer', customerRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/users', usersRouter);
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
