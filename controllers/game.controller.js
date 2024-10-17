const logger = require('../middleware/logger/logger');
const GameService = require('../services/game.service');
const { LOG_TYPE } = require('../enum/log');

const GameController = {
  startNewGame: async (req, res) => {
    try {
      const startResponse = await GameService.startNewGame();

      const { statusCode, responseMessage, game } = startResponse;
      res.status(statusCode).json({
        success: true,
        data: {
          message: responseMessage,
          game: game,
        },
      });
    } catch (error) {
      logger(LOG_TYPE.ERROR, false, 500, error.message, req);

      res.status(500).json({
        success: false,
        data: {
          message: error.message,
        },
      });
    }
  },

  getGameDetails: async (req, res) => {
    try {
      const gameId = parseInt(req.params.id);
      const getResponse = await GameService.getGameDetails(gameId);

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
      logger(LOG_TYPE.ERROR, false, 500, error.message, req);

      res.status(500).json({
        success: false,
        data: {
          message: error.message,
        },
      });
    }
  },

  abandonGame: async (req, res) => {
    try {
      const gameId = parseInt(req.params.id);
      const abandonResponse = await GameService.abandonGame(gameId);

      const { statusCode, responseMessage } = abandonResponse;
      res.status(statusCode).json({
        success: true,
        data: {
          message: responseMessage,
        },
      });
    } catch (error) {
      logger(LOG_TYPE.ERROR, false, 500, error.message, req);

      res.status(500).json({
        success: false,
        data: {
          message: error.message,
        },
      });
    }
  },
};

module.exports = GameController;
