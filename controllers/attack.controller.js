const AttackService = require('../services/attack.service');

const AttackController = {
  coordinateAttack: async (req, res, next) => {
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
      next(error);
    }
  },
};

module.exports = AttackController;
