const logger = require('../middleware/logger/logger');
const { APP_ENV } = require('../constants/app.constant');

const ErrorHandler = (err, req, res, next) => {
  const { status, statusCode, message, stack } = err;
  const httpCode = statusCode || 500;

  logger(status, false, httpCode, message, req);

  res.status(httpCode).json({
    success: false,
    data: {
      statusCode: httpCode,
      message: message,
      stack: process.env.NODE_ENV === APP_ENV.DEV ? stack : undefined,
    },
  });
};

module.exports = ErrorHandler;
