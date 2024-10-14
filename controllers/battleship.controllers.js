const logger = require('../middleware/logger/logger');
const BattleshipService = require('../services/battleship.service');

const BattleshipController = {
  startNewGame: (req, res) => {
    try {
      res.json({
        success: true,
        message: 'New game started!',
      });
    } catch (error) {
      res.json({
        success: false,
        error: error.message,
      });
    }
  },
};

module.exports = BattleshipController;
