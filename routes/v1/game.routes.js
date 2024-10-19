const express = require('express');
const authenticate = require('../../middleware/auth/authenticate');
const gameController = require('../../controllers/game.controller');

const gameRouter = express.Router();
gameRouter.use(authenticate);

gameRouter.post('/', gameController.startNewGame);
gameRouter.get('/:id', gameController.getGameDetails);
gameRouter.delete('/:id', gameController.abandonGame);

module.exports = gameRouter;
