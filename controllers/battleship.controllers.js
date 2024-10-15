const logger = require('../middleware/logger/logger');
const GameService = require('../services/game.service');
const { LOG_TYPE } = require('../enum/log');
const { PAYLOAD } = require('../enum/message');
const { GAME_STATUS } = require('../enum/game');

const BattleshipController = {
  startNewGame: async (req, res) => {
    try {
      // create a new game
      const newGame = await GameService.createNewGame();

      // TODO: set grid
      // TODO: set ships

      res.status(200).json({
        success: true,
        data: {
          message: PAYLOAD.GAME_STARTED,
          game: newGame,
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
      const id = parseInt(req.params.id);

      // get the game by id and validate
      const game = await GameService.getGameById(id);
      if (!game || game.game_status === GAME_STATUS.OVER) {
        throw new Error(PAYLOAD.INVALID_ID(id));
      }

      // update game status
      await GameService.updateGameById(game.game_id, GAME_STATUS.OVER);

      res.status(200).json({
        success: true,
        data: {
          message: PAYLOAD.GAME_ABANDONED(id),
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
};

module.exports = BattleshipController;
