const bcrypt = require('bcrypt');
const jwtService = require('./jwt.service');
const userRepository = require('../repositories/user.repository');
const fieldValidator = require('../util/fieldValidator');
const CustomError = require('../util/customError');
const { PAYLOAD } = require('../common/messages');
const { STATUS_CODE } = require('../constants/app.constant');

const authService = {
  generateTokens: async (data) => {
    const { email, password } = data;

    // validate user inputs
    await fieldValidator.validateEmail(email);
    await fieldValidator.checkIfEmptyString(password, 'password');

    // validate user
    const user = await userRepository.getUserByEmail(email);
    if (!user) {
      throw new CustomError(PAYLOAD.INVALID_CREDENTIALS, STATUS_CODE.NOT_FOUND);
    }

    // validate password
    const isValidPassword = await bcrypt.compare(password, user.user_password);
    if (!isValidPassword) {
      throw new CustomError(PAYLOAD.INVALID_CREDENTIALS, STATUS_CODE.UNAUTHORIZED);
    }

    // generate access token and access token
    const tokenUser = {
      id: user.user_id,
      name: user.user_name,
      email: user.user_email,
      isActive: user.is_active,
    };
    const accessToken = await jwtService.generateAccessToken(tokenUser);
    const refreshToken = await jwtService.generateRefreshToken(tokenUser);

    return {
      statusCode: STATUS_CODE.OK,
      responseMessage: PAYLOAD.JWT.GENERATE.SUCCESS,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  },

  refreshAccessToken: async (cookie) => {
    // get token
    const token = cookie.split('=')[1];

    // validate user inputs
    await fieldValidator.checkIfEmptyString(token, 'token');

    // refresh access token
    const refreshedToken = await jwtService.refreshToken(token);

    return {
      statusCode: STATUS_CODE.OK,
      responseMessage: PAYLOAD.JWT.REFRESH.SUCCESS,
      accessToken: refreshedToken,
    };
  },
};

module.exports = authService;
