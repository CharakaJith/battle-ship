const AuthService = require('../services/auth.service');
const { APP_ENV } = require('../constants/app.constant');

const AuthController = {
  generateAccessToken: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const data = { email, password };
      const generateResponse = await AuthService.generateTokens(data);

      const { statusCode, responseMessage, accessToken, refreshToken } = generateResponse;

      // set access token at response header
      res.set({
        'Access-Token': accessToken,
      });

      // set refresh token in a http-only cookie
      const isSecure = process.env.NODE_ENV === APP_ENV.DEV ? false : true;
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: isSecure,
        sameSite: 'Strict',
        path: '/',
      });

      res.status(statusCode).json({
        success: true,
        data: {
          message: responseMessage,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  refreshAccessToken: async (req, res, next) => {
    try {
      const { cookie } = req.headers;

      const refreshResponse = await AuthService.refreshAccessToken(cookie);

      const { statusCode, responseMessage, accessToken } = refreshResponse;
      res.set({
        'Access-Token': accessToken,
      });
      res.status(statusCode).json({
        success: true,
        data: {
          message: responseMessage,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = AuthController;
