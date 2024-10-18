const logger = require('../middleware/logger/logger');
const AttackService = require('../services/attack.service');
const { LOG_TYPE } = require('../constants/log.constant');

const AttackController = {
  coordinateAttack: async (req, res) => {
    try {
      const gameId = parseInt(req.params.id);
      const { coordinate } = req.body;

      const data = { gameId, coordinate };
      const attackResponse = await AttackService.coordinateAttack(data);

      const { statusCode, responseMessage } = attackResponse;
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

module.exports = AttackController;
