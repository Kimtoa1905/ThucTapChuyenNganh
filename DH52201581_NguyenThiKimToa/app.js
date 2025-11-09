var createError = require('http-errors');
var express = require('express');
const { engine } = require('express-handlebars');
var app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

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




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRouter);
app.use('/', indexRouter);
app.use('/blog', blogRouter);
app.use('/contact', contactRouter);
app.use('/shopdetails', shopdetailsRouter);
app.use('/shopingcart', shopingcartRouter);
app.use('/checkout', checkoutRouter);
app.use('/blogdetails', blogdetailsRouter);
app.use('/shopgrid', shopgridRouter);
app.use('/users', usersRouter);


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
