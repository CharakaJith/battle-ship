const gameService = require('../services/game.service');

const gameController = {
  startNewGame: async (req, res, next) => {
    try {
      const user = req.user;

      const startResponse = await gameService.startNewGame(user);

      const { statusCode, responseMessage, game } = startResponse;
      res.status(statusCode).json({
        success: true,
        data: {
          message: responseMessage,
          game: game,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  getGameDetails: async (req, res, next) => {
    try {
      const gameId = parseInt(req.params.id);
      const user = req.user;

      const data = { gameId, user };
      const getResponse = await gameService.getGameDetails(data);

      const { statusCode, responseMessage, game, ships, attacks } = getResponse;
      res.status(statusCode).json({
        success: true,
        data: {
          message: responseMessage,
          game: game,
          ships: ships,
          attacks: attacks,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  abandonGame: async (req, res, next) => {
    try {
      const gameId = parseInt(req.params.id);
      const user = req.user;

      const data = { gameId, user };
      const abandonResponse = await gameService.abandonGame(data);

      const { statusCode, responseMessage } = abandonResponse;
      res.status(statusCode).json({
        success: true,
        data: {
          message: responseMessage,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = gameController;
