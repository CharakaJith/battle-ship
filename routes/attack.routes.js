const express = require('express');
const router = express.Router();
const AttackController = require('../controllers/attack.controller');

router.post('/:id', AttackController.coordinateAttack);

module.exports = router;
