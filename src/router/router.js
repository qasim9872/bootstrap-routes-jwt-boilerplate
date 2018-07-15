const router = require('express').Router();
const passport = require('passport');
const validate = require('express-validation');

const fs = require('fs');
const join = require('path').join;

const routes = join(__dirname, 'routes');
const protected_routes = join(__dirname, 'protected-routes');

const logger = require('../config/winston');

// Bootstrap general routes
fs.readdirSync(routes)
    .filter(file => ~file.indexOf('.js'))
    .forEach(file => {
        let route = require(join(routes, file));
        try {
            let endpoint = file.replace('.js', '');
            
            let handlers = route.validationSchema ? [ validate(route.validationSchema), route.handler ] : route.handler;
            router.route(`/${endpoint}`)[route.requestType](handlers);

            logger.info(`succesfully bootstrapped route: /${endpoint}`);
        } catch (err) {
            logger.error(`Error bootstrapping route:  ${file} ->  ${err}`);
        }
    });

// Bootstrap general routes
fs.readdirSync(protected_routes)
    .filter(file => ~file.indexOf('.js'))
    .forEach(file => {
        let route = require(join(protected_routes, file));
        try {
            let endpoint = file.replace('.js', '');

            let handlers = route.validationSchema ? [ validate(route.validationSchema), route.handler ] : route.handler;
            router.route(`/${endpoint}`)[route.requestType](passport.authenticate('jwt', {
                session: false
            }), handlers);

            logger.info(`succesfully bootstrapped protected route: /${endpoint}`);
        } catch (err) {
file        }
    });

module.exports = router;