const GameService = require('../services/game.service');

const GameController = {
  startNewGame: async (req, res, next) => {
    try {
      const user = req.user;

      const startResponse = await GameService.startNewGame(user);

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
      const getResponse = await GameService.getGameDetails(data);

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
      const abandonResponse = await GameService.abandonGame(data);

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

module.exports = GameController;
