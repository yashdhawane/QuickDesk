// logger.js
const winston = require('winston');
require('winston-daily-rotate-file');

// Daily rotate transport
const transport = new winston.transports.DailyRotateFile({
  filename: 'logs/app-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: false,
  maxSize: '10m',
  maxFiles: '7d',
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console(),
    transport,
  ],
});

module.exports = logger;
