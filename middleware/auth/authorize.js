const logger = require('../logger/logger');
const { STATUS_CODE } = require('../../constants/app.constant');
const { LOG_TYPE } = require('../../constants/log.constant');

const authorize = (...allowedRoles) => {
  const checkRole = async (req, res, next) => {
    try {
      // TODO: implement a role based authorization mechanism

      next();
    } catch (error) {
      res.status(STATUS_CODE.FORBIDDON).json({
        success: false,
        data: {
          message: 'Authentication failed!',
        },
      });

      logger(LOG_TYPE.ERROR, false, STATUS_CODE.FORBIDDON, `${error.message}`, req);
    }
  };

  return checkRole;
};

module.exports = authorize;
