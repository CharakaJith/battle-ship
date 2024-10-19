const express = require('express');
const authenticate = require('../../middleware/auth/authenticate');
const AttackController = require('../../controllers/attack.controller');

const attackRouter = express.Router();
attackRouter.use(authenticate);

attackRouter.post('/', AttackController.coordinateAttack);

module.exports = attackRouter;
