var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var MongoStore = require('connect-mongo')(expressSession);
var lusca = require('lusca');

var mongoose = require('mongoose');

var routes = require('./App/routes/index');
var profiles = require('./App/routes/profiles');
var requests = require('./App/routes/requests');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'App/views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(cookieParser("ingesup"));

// Connection a la base mongoDb
mongoose.connect('mongodb://localhost/neighbourDatas', function (err) {
    if (err)
        throw err;
});

app.use(expressSession({
    secret: "ingesup",
    resave : false,
    saveUninitialized : true,
    store : new MongoStore({mongooseConnection : mongoose.connection})
}));

app.use(require('less-middleware')(path.join(__dirname, 'public')));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    var isAuthenticated = req.session.isAuthenticated;
    if (!isAuthenticated) {///undefined of false
        req.session.isAuthenticated = false;
    }
    res.locals.session = req.session;
    next();
});
/*
app.use(lusca({
    csrf : true,
    xframe: 'SAMEORIGIN',
    xssProtection: true
}));*/

app.use('/', routes);
app.use('/profile', profiles);

app.use('/request', requests);


// error handler
/*app.use(function (err, req, res, next) {
    if (err.code !== 'EBADCSRFTOKEN') return next(err);
    // handle CSRF token errors here
    res.status(403);
    res.send('form tampered with')
});*/

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

module.exports = app;
