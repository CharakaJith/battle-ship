const express = require('express');
const attackRouter = express.Router();
const AttackController = require('../../controllers/attack.controller');

attackRouter.post('/', AttackController.coordinateAttack);

module.exports = attackRouter;
