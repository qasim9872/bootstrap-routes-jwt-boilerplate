const requestType = require('../../config/request-type');

const handler = async (request, response) => {
    response.status(200).send("test route");
};

module.exports = {
    requestType: requestType.GET,
    handler
};