const express = require('express');
const AttackController = require('../../controllers/attack.controller');

const attackRouter = express.Router();

attackRouter.post('/', AttackController.coordinateAttack);

module.exports = attackRouter;
