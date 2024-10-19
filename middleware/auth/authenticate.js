const jwt = require('jsonwebtoken');
const logger = require('../logger/logger');
const { PAYLOAD } = require('../../common/messages');
const { STATUS_CODE } = require('../../constants/app.constant');
const { LOG_TYPE } = require('../../constants/log.constant');

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    const decodedToken = jwt.verify(JSON.parse(token), process.env.ACCESS_TOKEN_SECRET);
    req.user = decodedToken.tokenUser;

    next();
  } catch (error) {
    res.status(STATUS_CODE.UNAUTHORIZED).json({
      success: false,
      data: {
        message: PAYLOAD.AUTH.FAILED,
      },
    });

    logger(LOG_TYPE.ERROR, false, STATUS_CODE.UNAUTHORIZED, `${error.message}`, req);
  }
};

module.exports = authenticate;
