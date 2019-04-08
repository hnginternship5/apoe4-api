const winston = require('winston');
const appRoot = require('app-root-path');

const options = {
  error: {
    level: 'error',
    filename: `${appRoot}/logs/error.log`,
    handleExceptions: true,
    format: winston.format.timestamp(),
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
  },
  combined: {
    level: 'info',
    filename: `${appRoot}/logs/app.log`,
    handleExceptions: true,
    format: winston.format.timestamp(),
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
  },
  console: {
    level: 'debug',
    levels: winston.config.npm.levels,
    handleExceptions: true,
    json: false,
    colorize: true,
    format: winston.format.simple(),
  },
};

// instantiate a new Winston Logger with the settings defined above
const logger = winston.createLogger({
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [
    new winston.transports.File(options.error),
    new winston.transports.File(options.combined),
    new winston.transports.Console({
      format: winston.format.cli(),
    }),
  ],
  exitOnError: false, // do not exit on handled exceptions
});

// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
// if (process.env.NODE_ENV !== 'production') {
//   logger.add(
//     new winston.transports.Console({
//       format: winston.format.cli(),
//     })
//   );
// }

exports = logger;