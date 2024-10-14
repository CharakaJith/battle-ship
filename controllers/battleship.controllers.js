const logger = require('../middleware/logger/logger');
const BattleshipService = require('../services/battleship.service');
const { LOG_TYPE } = require('../enum/log');
const { PAYLOAD } = require('../enum/message');

const BattleshipController = {
  startNewGame: async (req, res) => {
    try {
      throw new Error('sample test error');
      res.json({
        success: true,
        message: PAYLOAD.GAME_STARTED,
      });
    } catch (error) {
      logger(LOG_TYPE.ERROR, false, 500, error.message, req);

      res.json({
        success: false,
        error: error.message,
      });
    }
  },
};

module.exports = BattleshipController;
