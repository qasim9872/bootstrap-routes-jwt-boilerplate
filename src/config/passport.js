const passport = require('passport');
const passportJWT = require("passport-jwt");

const ExtractJWT = passportJWT.ExtractJwt;

const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = passportJWT.Strategy;

const UserModel = require('../models/User');
const config = require('../config/config');

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (user, done) {
    //If using Mongoose with MongoDB; if other you will need JS specific to that schema
    UserModel.findById(id, function (err, user) {
        done(err, user);
    });
});

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    function (email, password, done) {
        var options = {
            email: email
        };
        UserModel.findOne(options, function (err, user) {
            if (err) return done(err);
            if (!user) {
                return done(null, false, {
                    message: 'Unknown user'
                });
            }
            user.comparePassword(password, (err, isMatch) => {
                if (err)
                    return done(null, false, {
                        message: 'error:' + err
                    });
                else if (!isMatch)
                    return done(null, false, {
                        message: 'Invalid password'
                    });
                else {
                    return done(null, user);
                }

            });
        });
    }
));


passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.secret
    },
    function (jwtPayload, cb) {
        //find the user in db if needed
        return UserModel.findOne({
                email: jwtPayload.email
            })
            .then(user => {
                return cb(null, user);
            })
            .catch(err => {
                return cb(err);
            });
    }
));