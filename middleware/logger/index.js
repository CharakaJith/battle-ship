const winston = require('winston');
const { format } = winston;
const { combine, timestamp, printf } = format;
const DailyRotateFile = require('winston-daily-rotate-file');
const { LOG_TYPE } = require('../../constants/log.constant');

const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

const logger = winston.createLogger({
  level: LOG_TYPE.DEBUG,
  format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat),

  transports: [
    new DailyRotateFile({
      filename: 'logs/%DATE%-logger.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: false,
      maxFiles: '14d',
    }),
  ],
});

module.exports = logger;
