const logger = require('../middleware/logger/logger');
const BattleshipService = require('../services/battleship.service');
const { LOG_TYPE } = require('../enum/log');
const { PAYLOAD } = require('../enum/message');

const BattleshipController = {
  startNewGame: async (req, res) => {
    try {
      const newGame = await BattleshipService.createNewGame();

      res.json({
        success: true,
        data: {
          message: PAYLOAD.GAME_STARTED,
          game: newGame,
        },
      });
    } catch (error) {
      logger(LOG_TYPE.ERROR, false, 500, error.message, req);

      res.json({
        success: false,
        data: {
          message: error.message,
        },
      });
    }
  },
};

module.exports = BattleshipController;
