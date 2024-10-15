const express = require('express');
const router = express.Router();
const GameController = require('../controllers/game.controllers');

router.post('/', GameController.startNewGame);
router.delete('/:id', GameController.abandonGame);

module.exports = router;
