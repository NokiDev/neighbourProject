var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var csrf = require('csurf');

var mongoose = require('mongoose');

var routes = require('./App/routes/index');
var profiles = require('./App/routes/profiles');
var requests = require('./App/routes/requests');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'App/views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(expressSession({
    secret: "ingesup",
    cookie:{
        httpOnly:true,
        secure:true
    },
    resave : false,
    saveUninitialized : true
}));
app.use(csrf());

app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    var isAuthenticated = req.session.isAuthenticated;
    if (!isAuthenticated) {
        isAuthenticated = req.session.isAuthenticated = false;
    }
    res.locals._csrf = req.csrfToken();
    next();
});


app.use('/', routes);
app.use('/profile', profiles);
app.use('/request', requests);


// error handler
app.use(function (err, req, res, next) {
    if (err.code !== 'EBADCSRFTOKEN') return next(err);
    // handle CSRF token errors here
    res.status(403);
    res.send('form tampered with')
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// Connection a la base mongoDb
mongoose.connect('mongodb://localhost/neighbourDatas', function (err) {
    if (err)
        throw err;
});


module.exports = app;
