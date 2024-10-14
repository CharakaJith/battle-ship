const express = require('express');
const router = express.Router();
const BattleshipController = require('../controllers/battleship.controllers');

router.post('/', BattleshipController.startNewGame);
router.delete('/:id', BattleshipController.abandonGame);

module.exports = router;
