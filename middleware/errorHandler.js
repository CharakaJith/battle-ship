const logger = require('../middleware/logger/logger');
const { APP_ENV, STATUS_CODE } = require('../constants/app.constant');

const errorHandler = (err, req, res, next) => {
  const { status, statusCode, message, stack } = err;
  const httpCode = statusCode || STATUS_CODE.SERVER_ERROR;

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

module.exports = errorHandler;
