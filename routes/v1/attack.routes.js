const express = require('express');
const authenticate = require('../../middleware/auth/authenticate');
const attackController = require('../../controllers/attack.controller');

const attackRouter = express.Router();
attackRouter.use(authenticate);

attackRouter.post('/', attackController.coordinateAttack);

module.exports = attackRouter;
