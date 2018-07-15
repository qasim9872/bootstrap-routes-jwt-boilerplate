const Joi = require('joi');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const requestType = require('../../config/request-type');
const config = require('../../config/config');
const userHandler = require('../../handler/user-handler');


const validationSchema = {
    body: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(5).max(20).required()
    }).required()
};

const handler = async (request, response) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err || !user) {
            return response.status(400).json({
                message: info ? info.message : 'Login failed',
                user: user
            });
        }

        request.login(user, { session: false }, (err) => {
            if (err) {
                response.send(err);
            }

            const token = jwt.sign(user.toObject(), config.secret);

            // remove password field from view
            user.password = undefined;
            return response.json({ user, token });
        });
    })(request, response);
};

module.exports = {
    requestType: requestType.POST,
    validationSchema,
    handler
};