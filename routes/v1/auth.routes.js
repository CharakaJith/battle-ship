const express = require('express');
const AuthController = require('../../controllers/auth.controller');
const authRouter = express.Router();

authRouter.post('/', AuthController.generateAccessToken);
authRouter.post('/refresh', AuthController.refreshAccessToken);

module.exports = authRouter;
