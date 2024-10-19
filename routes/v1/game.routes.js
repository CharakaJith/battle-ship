const express = require('express');
const GameController = require('../../controllers/game.controller');

const gameRouter = express.Router();

gameRouter.post('/', GameController.startNewGame);
gameRouter.get('/:id', GameController.getGameDetails);
gameRouter.delete('/:id', GameController.abandonGame);

module.exports = gameRouter;
