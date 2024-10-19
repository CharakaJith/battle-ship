const express = require('express');
const authController = require('../../controllers/auth.controller');
const authRouter = express.Router();

authRouter.post('/', authController.generateAccessToken);
authRouter.post('/refresh', authController.refreshAccessToken);

module.exports = authRouter;
