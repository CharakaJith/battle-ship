const express = require('express');
const authenticate = require('../../middleware/auth/authenticate');
const GameController = require('../../controllers/game.controller');

const gameRouter = express.Router();
gameRouter.use(authenticate);

gameRouter.post('/', GameController.startNewGame);
gameRouter.get('/:id', GameController.getGameDetails);
gameRouter.delete('/:id', GameController.abandonGame);

module.exports = gameRouter;
