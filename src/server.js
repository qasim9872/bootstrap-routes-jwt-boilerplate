const app = require('./app');
const config = require('./config/config');

const http = require('http');
const server = http.createServer(app);

const logger = require('./config/winston');

server.listen(config.PORT, () => {
    logger.info(`App listening on ${config.PORT}`);
})