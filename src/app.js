/**
 * Module dependencies.
 */
const express = require('express');
const compression = require('compression');
const session = require('express-session');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const passport = require('passport');
const app = express();


const logger = require('./config/winston');
const config = require('./config/config');
const router = require('./router/router');

require('./config/passport');
require('./config/mongoose');

require('./config/api-docs/swagger-setup')(app);

// =======================
// configuration =========
// =======================

app.use(session({
    secret: config.secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 60000
    }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(cors());
app.use(morgan("combined", {
    "format": "default",
    "stream": {
        write: function (str) {
            logger.info(str);
        }
    }
}));

// =======================
// security ==============
// =======================
app.use(helmet());
app.disable('x-powered-by');

// =======================
// routes ================
// =======================

app.use('/healthcheck', require('express-healthcheck')());
app.use(router);


// =======================
// error handling ========
// =======================

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {

    logger.error('err handler: ' + err);
    res.status(err.status || 500).json(err);

});

module.exports = app;