import express from 'express';
const bodyParser = require('body-parser');
const logger = require('morgan');
const cors = require('cors');
const compression = require('compression');

const app = express();

app.use(
    cors({
        maxAge: 1728000,
    }),
);
app.use(logger('dev'));
app.use(
    bodyParser.urlencoded({
        extended: false,
    }),
);
app.use(bodyParser.json());
//routes
app.use('/', function (req, res, next) {
    res.send('Welcome to APOE4 API!');
});

// Handle favicon requests from browsers
app.get('/favicon.ico', (req, res) => res.sendStatus(204));


// Match non existing routes
app.use('*', (req, res, next) => {
    next(new Error('Ooops! Nothing here for you!'));
});
// Error handlers
process.on('unhandledRejection', (reason, promise) => {
    throw reason;
});

process.on('uncaughtException', (error) => {
    console.log(`Uncaught Exception: ${500} - ${error.message}, Stack: ${error.stack}`);
    // process.exit(1);
});

process.on('SIGINT', () => {
    console.log(' Alright! Bye!');
    process.exit();
});

module.exports = app;