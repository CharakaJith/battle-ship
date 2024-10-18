const express = require('express');
const gameRouter = express.Router();
const GameController = require('../../controllers/game.controller');

gameRouter.post('/', GameController.startNewGame);
gameRouter.get('/:id', GameController.getGameDetails);
gameRouter.delete('/:id', GameController.abandonGame);

module.exports = gameRouter;
