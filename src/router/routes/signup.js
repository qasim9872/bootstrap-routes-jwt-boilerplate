const Joi = require('joi');
const requestType = require('../../config/request-type');
const userHandler = require('../../handler/user-handler');

const validationSchema = {
    body: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(5).max(20).required()
    }).required()
};

const handler = async (request, response) => {
    let body = request.body;

    try {
        let user = await userHandler.saveNewUser(body);

        response.status(201).json(user);
    } catch (err) {
        response.status(500).json(err);
    }
};

module.exports = {
    requestType: requestType.POST,
    validationSchema,
    handler
};