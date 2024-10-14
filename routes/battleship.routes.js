const express = require('express');
const router = express.Router();
const BattleshipController = require('../controllers/battleship.controllers');

router.post('/', BattleshipController.startNewGame);

module.exports = router;
